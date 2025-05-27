import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import * as exifr from 'exifr';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return new NextResponse('Missing `userId`', { status: 400 });
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Prefix: `${userId}/`,
    });

    const { Contents } = await s3Client.send(command);
    const keys = Contents?.map((obj) => obj.Key!) || [];
    const urls = [];
    for (const key of keys) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key,
      });
      // 署名付きURLを生成（1時間有効）
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error('Error listing user photos:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return new NextResponse('Missing `userId`', { status: 400 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    let successCount = 0;
    for (const file of files) {
      // ファイルを Buffer に変換
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // exifr で EXIF 情報を取得
      let exifData: { DateTimeOriginal?: string } = {};
      try {
        exifData = await exifr.parse(buffer, ['DateTimeOriginal']);
      } catch (e) {
        console.error('Failed to extract EXIF data:', e);
      }

      // 撮影日などをファイル名やメタデータに使える
      const dateStr = exifData?.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toISOString() : new Date().toISOString();

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: `${userId}/${dateStr}/${file.name}`,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          originalDate: dateStr,
        },
      });

      try {
        await s3Client.send(command);
        console.log('File uploaded successfully');
        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }
    return NextResponse.json({ successCount });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
