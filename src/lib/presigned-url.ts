'use server';
import { s3Client } from '@/lib/aws/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { fileTypeFromBuffer } from 'file-type';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getImageMetadata } from '@/lib/exifr';
import { getVideoMetadata } from '@/lib/ffprobe';

export async function getS3PresignedUrl(file: File, userId: string) {
  // ファイルを Buffer に変換
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = await fileTypeFromBuffer(buffer);
  
  if (!fileType) {
    console.warn(`Skipped: ${file.name} (unknown type)`);
    return;
  }
  
  // file情報から撮影日を取得
  let dateStr = new Date().toISOString(); // デフォルト値を設定
  if (fileType.mime.startsWith('image/')) {
    dateStr = await getImageMetadata(buffer, dateStr);
  } else if (fileType.mime.startsWith('video/')) {
    dateStr = await getVideoMetadata(buffer, dateStr, file.name);
  } else {
    console.warn(`Skipped: ${file.name} (Unsupported file type: ${fileType.mime})`);
    return;
  }

  // プリサインドURLを発行
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: `${userId}/${dateStr}/${file.name}`,
    ContentType: file.type,
    Metadata: {
      originalDate: dateStr,
    },
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return url;
}
