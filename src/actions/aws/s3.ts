'use server';
import { s3Client } from '@/lib/aws/s3';
import { CompleteMultipartUploadCommand, CopyObjectCommand, CreateMultipartUploadCommand, DeleteObjectCommand, HeadObjectCommand, UploadPartCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function createMultipartUpload(userId: string, fileMime: string, fileName: string) {
  const command = new CreateMultipartUploadCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: `${userId}/tmp/${fileName}`,
    ContentType: fileMime,
  });

  const response = await s3Client.send(command);
  return response.UploadId;
}
export async function completeMultipartUpload(userId: string, fileName: string, uploadId: string, parts: { ETag: string; PartNumber: number }[]) {
  const command = new CompleteMultipartUploadCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: `${userId}/tmp/${fileName}`,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  });

  await s3Client.send(command);
}

export async function getS3PresignedUrl(userId: string, fileName: string, uploadId: string, partNumber: number) {
  // プリサインドURLを発行
  const command = new UploadPartCommand({
    Bucket: process.env.S3_BUCKET_NAME || '',
    Key: `${userId}/tmp/${fileName}`,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

  return url;
}

export async function getHeadObject(bucket: string, key: string) {
  const headCommand = new HeadObjectCommand({ Bucket: bucket, Key: key });
  const headResult = await s3Client.send(headCommand);
  return headResult;
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
