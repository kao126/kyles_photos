'use server';
import { s3Client } from '@/lib/aws/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getImageMetadata } from '@/lib/exifr';
import { getVideoMetadata } from '@/lib/ffprobe';

export async function getS3PresignedUrl(buffer: Buffer, userId: string, fileMime: string, fileName: string) {
  // file情報から撮影日を取得
  let dateStr = new Date().toISOString(); // デフォルト値を設定
  if (fileMime.startsWith('image/')) {
    dateStr = await getImageMetadata(buffer, dateStr);
  } else if (fileMime.startsWith('video/')) {
    dateStr = await getVideoMetadata(buffer, dateStr, fileName);
  } else {
    console.warn(`Skipped: ${fileName} (Unsupported file type: ${fileMime})`);
    return;
  }

  // プリサインドURLを発行
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: `${userId}/${dateStr}/${fileName}`,
    ContentType: fileMime,
    Metadata: {
      originalDate: dateStr,
    },
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return url;
}
