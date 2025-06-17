import { LambdaClient } from '@aws-sdk/client-lambda';

export const lambdaClient = new LambdaClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.IAM_ACCESS_KEY || '',
    secretAccessKey: process.env.IAM_SECRET_ACCESS_KEY || '',
  },
});
