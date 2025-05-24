import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY || '',
    secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY || '',
  },
});
