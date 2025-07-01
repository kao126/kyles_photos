'use server';
import { lambdaClient } from '@/lib/aws/lambda';
import { InvokeCommand } from '@aws-sdk/client-lambda';

export async function getVideoMetadata(userId: string, fileName: string) {
  const command = new InvokeCommand({
    FunctionName: process.env.LAMBDA_GET_VIDEO_METADATA_FUNCTION || '',
    InvocationType: 'RequestResponse',
    Payload: Buffer.from(
      JSON.stringify({
        userId: userId,
        fileName: fileName,
      })
    ),
  });

  const response = await lambdaClient.send(command);
  const payloadString = Buffer.from(response.Payload!).toString();
  const payload = JSON.parse(payloadString);

  return payload.body.creationTime;
}

// export async function getVideoThumbnail(s3Key: string, fileName: string) {
//   try {
//     const command = new InvokeCommand({
//       FunctionName: process.env.LAMBDA_CREATE_VIDEO_THUMBNAIL_FUNCTION || '',
//       InvocationType: 'RequestResponse',
//       Payload: Buffer.from(
//         JSON.stringify({
//           s3Key: s3Key,
//           fileName: fileName,
//         })
//       ),
//     });

//     const response = await lambdaClient.send(command);
//     const payloadString = Buffer.from(response.Payload!).toString();
//     const payload = JSON.parse(payloadString);
//     return payload.statusCode;
//   } catch (error) {
//     console.error('Error getting video thumbnail:', error);
//     throw error;
//   }
// }
