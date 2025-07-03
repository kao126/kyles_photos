import { NextRequest, NextResponse } from 'next/server';
import { s3Client } from '@/lib/aws/s3';
import { GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getHeadObject } from '@/actions/aws/s3';
import { getMimeCategory } from '@/lib/mime-category';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const continuationToken = decodeURIComponent(req.nextUrl.searchParams.get('continuationToken') ?? '');

  if (!userId) {
    return new NextResponse('Missing `userId`', { status: 400 });
  }

  try {
    const bucket = process.env.S3_BUCKET_NAME || '';
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `${userId}/`,
      MaxKeys: 20,
      ContinuationToken: continuationToken || undefined,
    });

    const { Contents, NextContinuationToken, IsTruncated } = await s3Client.send(command);
    const keys = Contents?.map((obj) => obj.Key!) || [];

    function getKeyInfo(key: MediaEntryType['key'], isDeleted: MediaEntryType['isDeleted']) {
      const normalizedKey = isDeleted
        ? key.replace('/recently-deleted', '') // ${userId}/recently-deleted/${isoDatetime}/${fileName}
        : key;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_userId, isoDatetime, fileName] = normalizedKey.split('/'); // ${userId}/${isoDatetime}/${fileName}
      return { isoDatetime, fileName };
    }

    // 日付ごとにグループ化するオブジェクト
    const urls: fileUrlsType<MediaEntryType> = {};
    const deletedUrls: fileUrlsType<MediaEntryType> = {};

    for (const key of keys) {
      const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      // fileMimeを取得
      const head = await getHeadObject(bucket, key);
      const fileMime = head.ContentType || '';
      const fileMimeCategory = getMimeCategory(fileMime);
      const lastModifiedDate = head.LastModified!;

      // 削除対応済みファイルかどうか
      const isDeleted = key.startsWith(`${userId}/recently-deleted/`);
      // 撮影日/ファイル名を取得
      const { isoDatetime, fileName } = getKeyInfo(key, isDeleted);

      // 日本時間（JST）で取得
      const date = new Date(isoDatetime);
      if (!date) continue; // 不正な形式はスキップ
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();
      const day = date.getDate().toString();

      // 署名付きURLを生成（1時間有効）
      const url = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

      const fileUrls = isDeleted ? deletedUrls : urls;

      if (!fileUrls[year]) {
        fileUrls[year] = {};
      }
      if (!fileUrls[year][month]) {
        fileUrls[year][month] = [];
      }

      fileUrls[year][month].push({ fileName, fileMimeCategory, key, day, url, lastModifiedDate, isDeleted });
    }

    return NextResponse.json({ urls, deletedUrls, NextContinuationToken, IsTruncated });
  } catch (err) {
    console.error('Error listing user photos:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
