import { fileTypeFromBuffer } from 'file-type';
import { getImageMetadata } from '@/lib/exifr';
import { getVideoMetadata, getVideoThumbnail } from '@/actions/aws/lambda';
import { completeMultipartUpload, createMultipartUpload, getS3PresignedUrl, renameS3Object } from '@/actions/aws/s3';

export async function uploadFiles({ file, userId }: { file: File; userId: string }) {
  // ファイルを Buffer に変換
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    console.warn(`Skipped: ${file.name} (unknown type)`);
    return;
  }

  const UploadId = await createMultipartUpload(userId, fileType.mime, file.name);

  if (!UploadId) {
    console.error(`${file.name}: Failed to create multipart upload`);
    return;
  }

  const parts: { ETag: string; PartNumber: number }[] = [];
  function getChunkSize(fileSize: number) {
    if (fileSize <= 50 * 1024 * 1024) {
      return 8 * 1024 * 1024; // 8MB(単発)
    } else if (fileSize <= 200 * 1024 * 1024) {
      return 16 * 1024 * 1024; // 16MB(中型)
    } else if (fileSize <= 1024 * 1024 * 1024) {
      return 32 * 1024 * 1024; // 32MB(大型)
    } else {
      return 128 * 1024 * 1024; // 128MB(超大型)
    }
  }
  const chunkSize = getChunkSize(file.size);
  const totalParts = Math.ceil(file.size / chunkSize);

  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const start = (partNumber - 1) * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const blobPart = file.slice(start, end);

    // プリサインドURLを発行
    const url = await getS3PresignedUrl(userId, file.name, UploadId, partNumber);
    if (!url) continue;

    const response = await fetch(url, {
      method: 'PUT',
      body: blobPart,
      headers: {
        'Content-Type': fileType.mime,
      },
    });

    // パートのアップロードが失敗した場合、エラーを投げる
    if (!response.ok) {
      throw new Error(`Part ${partNumber} upload failed`);
    }

    // パートのETagを取得
    const eTag = response.headers.get('ETag')!;
    parts.push({ ETag: eTag.replaceAll('"', ''), PartNumber: partNumber });
  }

  await completeMultipartUpload(userId, file.name, UploadId, parts);

  // 撮影日を取得
  let dateStr = new Date().toISOString(); // デフォルト値を設定
  if (fileType.mime.startsWith('image/')) {
    dateStr = await getImageMetadata(buffer, dateStr);
  } else if (fileType.mime.startsWith('video/')) {
    // 動画の場合、Lambda関数を呼び出し
    dateStr = await getVideoMetadata(userId, file.name);
  } else {
    console.warn(`Skipped: ${file.name} (Unsupported file type: ${fileType.mime})`);
    return;
  }

  // ファイル名をリネーム
  await renameS3Object(userId, dateStr, file.name);
  if (fileType.mime.startsWith('video/')) {
    // 動画のサムネイルを取得
    const s3Key = `${userId}/${dateStr}/${file.name}`;
    await getVideoThumbnail(s3Key, file.name);
  }
}
