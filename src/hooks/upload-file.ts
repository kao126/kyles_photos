'use server';
import { s3Client } from '@/lib/aws/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadFile(base64: string, fileName: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: fileName,
      Body: Buffer.from(base64.split(',')[1], 'base64'),
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
    return;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
