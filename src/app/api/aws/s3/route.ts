import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';

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
