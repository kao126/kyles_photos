import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getHeadObject } from '@/actions/aws/s3';
import { getMimeCategory } from '@/lib/mime-category';
import { getCloudFrontSignedUrl } from '@/actions/aws/cloud-front';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const continuationToken = decodeURIComponent(req.nextUrl.searchParams.get('continuationToken') ?? '');
  const isDeleted = Boolean(req.nextUrl.searchParams.get('isDeleted'));

  if (!userId) {
    return new NextResponse('Missing `userId`', { status: 400 });
  }

  try {
    const bucket = process.env.S3_BUCKET_NAME || '';
    const state = isDeleted ? 'recently-deleted' : 'active';
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `${userId}/${state}/`,
      MaxKeys: 20,
      ContinuationToken: continuationToken || undefined,
    });

    const { Contents, NextContinuationToken, IsTruncated } = await s3Client.send(command);
    const keys = Contents?.map((obj) => obj.Key!) || [];

    // 日付ごとにグループ化するオブジェクト
    const urls: fileUrlsType<MediaEntryType> = {};

    for (const key of keys) {
      // fileMimeを取得
      const head = await getHeadObject(bucket, key);
      const fileMime = head.ContentType || '';
      const fileMimeCategory = getMimeCategory(fileMime);
      const lastModifiedDate = head.LastModified!;

      // 撮影日/ファイル名を取得
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_userId, _state, isoDatetime, fileName] = key.split('/'); // ${userId}/${state}/${isoDatetime}/${fileName}

      // 日本時間（JST）で取得
      const date = new Date(isoDatetime);
      if (!date) continue; // 不正な形式はスキップ
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();
      const day = date.getDate().toString();

      // 署名付きURLを生成（1時間有効）
      const url = getCloudFrontSignedUrl(key);

      if (!urls[year]) {
        urls[year] = {};
      }
      if (!urls[year][month]) {
        urls[year][month] = [];
      }

      urls[year][month].push({ fileName, fileMimeCategory, key, day, url, lastModifiedDate, isDeleted });
    }

    return NextResponse.json({ urls, NextContinuationToken, IsTruncated });
  } catch (err) {
    console.error('Error listing user photos:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
