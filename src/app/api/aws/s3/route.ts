import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from '@aws-sdk/client-s3';
import * as exifr from 'exifr';
import { fileTypeFromBuffer } from 'file-type';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { getVideoMetadata } from '@/lib/ffprobe';

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

    // 日付ごとにグループ化するオブジェクト
    const urls: Record<string, Record<string, { fileName: string; url: string }[]>> = {};

    for (const key of keys) {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key,
      });

      const isoDatetime = key.split('/')[1]; // e.g. 2024-12-01T10:30:00.000Z
      const date = new Date(isoDatetime);
      if (!date) continue; // 不正な形式はスキップ

      // 日本時間（JST）で取得
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      // ファイル名を取得
      const fileName = path.basename(key);
      // 署名付きURLを生成（1時間有効）
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

      if (!urls[year]) {
        urls[year] = {};
      }
      if (!urls[year][month]) {
        urls[year][month] = [];
      }

      urls[year][month].push({ url, fileName });
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
      const fileType = await fileTypeFromBuffer(buffer);
      let dateStr = new Date().toISOString(); // デフォルト値を設定

      if (!fileType) {
        console.warn(`Skipped: ${file.name} (unknown type)`);
        continue;
      }

      if (fileType.mime.startsWith('image/')) {
        // 写真の場合: exifr で EXIF 情報を取得
        let exifData: { DateTimeOriginal?: string } = {};
        try {
          exifData = await exifr.parse(buffer, ['DateTimeOriginal']);
          dateStr = exifData?.DateTimeOriginal ? new Date(exifData.DateTimeOriginal).toISOString() : dateStr;
        } catch (e) {
          console.error('Failed to extract EXIF data:', e);
        }
      } else if (fileType.mime.startsWith('video/')) {
        // 動画の場合: 一時保存して ffprobe で creation_time を取得
        const tempPath = path.join('/tmp', file.name);
        await writeFile(tempPath, buffer);

        const metadata = await getVideoMetadata(tempPath);
        dateStr = metadata?.format?.tags?.creation_time ?? dateStr;
        await unlink(tempPath);
      } else {
        console.warn(`Skipped: ${file.name} (Unsupported file type: ${fileType.mime})`);
        continue;
      }

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
