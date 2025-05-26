import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import * as exifr from 'exifr';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

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

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: `photos/${dateStr}/${file.name}`,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        originalDate: dateStr,
      },
    });
    await s3Client
      .send(command)
      .then(() => {
        console.log('File uploaded successfully');
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        throw error;
      });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
