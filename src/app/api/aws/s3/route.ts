import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { getHeadObject } from '@/actions/aws/s3';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return new NextResponse('Missing `userId`', { status: 400 });
  }

  try {
    const bucket = process.env.S3_BUCKET_NAME || '';
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `${userId}/`,
    });

    const { Contents } = await s3Client.send(command);
    const keys = Contents?.map((obj) => obj.Key!) || [];

    type FileMime = 'image' | 'video' | 'other';

    function getMimeCategory(mime: string): FileMime {
      if (mime.startsWith('image/')) return 'image';
      if (mime.startsWith('video/')) return 'video';
      return 'other';
    }

    // 日付ごとにグループ化するオブジェクト
    const urls: fileUrlsType<Partial<MediaEntryType>> = {};
    const entriesMap: Record<string, Partial<MediaEntryType>> = {};

    for (const key of keys) {
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      // fileMimeを取得
      const head = await getHeadObject(bucket, key);
      const fileMime = head.ContentType || '';

      const isoDatetime = key.split('/')[1]; // e.g. 2024-12-01T10:30:00.000Z
      // ファイル名を取得
      const fileName = path.basename(key);
      // 署名付きURLを生成（1時間有効）
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

      const parsed = path.parse(fileName);
      let baseFileName = parsed.name;

      if (baseFileName.endsWith('_thumb')) {
        baseFileName = baseFileName.replace(/_thumb$/, '');
      }

      const groupKey = `${isoDatetime}/${baseFileName}`;
      if (!entriesMap[groupKey]) {
        entriesMap[groupKey] = { fileName, baseFileName };
      }

      switch (getMimeCategory(fileMime)) {
        case 'image':
          entriesMap[groupKey].imageUrl = url;
          break;
        case 'video':
          entriesMap[groupKey].videoUrl = url;
          break;
        default:
          console.warn(`Skipped: ${fileName} (Unsupported file type: ${fileMime})`);
          break;
      }
    }

    for (const [key, entry] of Object.entries(entriesMap)) {
      if (!entry.imageUrl) continue; // imageUrlがないものは表示しない

      const isoDatetime = key.split('/')[0]; // key: ${isoDatetime}/${baseFileName}
      const date = new Date(isoDatetime);
      if (!date) continue; // 不正な形式はスキップ

      // 日本時間（JST）で取得
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();
      const day = date.getDate().toString();
      entry.day = day;

      if (!urls[year]) {
        urls[year] = {};
      }
      if (!urls[year][month]) {
        urls[year][month] = [];
      }

      urls[year][month].push(entry);
    }

    return NextResponse.json({ urls });
  } catch (err) {
    console.error('Error listing user photos:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}