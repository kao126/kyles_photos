'use server';
import { s3Client } from '@/lib/aws/s3';
import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function getS3PresignedUrl(userId: string, fileMime: string, fileName: string) {
  // プリサインドURLを発行
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: `${userId}/tmp/${fileName}`,
    ContentType: fileMime,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return url;
}

export async function copyS3Object(bucket: string, copySource: string, newKey: string) {
  await s3Client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: copySource,
      Key: newKey,
    })
  );
}

export async function deleteS3Object(bucket: string, tmpKey: string) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: tmpKey,
    })
  );
}

export async function renameS3Object(userId: string, date: string, fileName: string) {
  // S3オブジェクトをコピー → 削除（リネーム処理）
  const bucket = process.env.S3_BUCKET_NAME || '';
  const tmpKey = `${userId}/tmp/${fileName}`;
  const copySource = `${bucket}/${userId}/tmp/${fileName}`;
  const newKey = `${userId}/${date}/${fileName}`;

  await copyS3Object(bucket, copySource, newKey);
  await deleteS3Object(bucket, tmpKey);
}
