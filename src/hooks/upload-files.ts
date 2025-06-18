import { toast } from 'sonner';
import { fileTypeFromBuffer } from 'file-type';
import { getImageMetadata } from '@/lib/exifr';
import { getVideoMetadata, getVideoThumbnail } from '@/actions/aws/lambda';
import { getS3PresignedUrl, renameS3Object } from '@/actions/aws/s3';

export async function handleUpload({ e, userId }: { e: React.ChangeEvent<HTMLInputElement>; userId: string }) {
  try {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadingToastId = toast('アップロード中', {
      description: `Uploading ${files.length} files`,
      action: {
        label: 'Undo',
        onClick: () => toast.dismiss(uploadingToastId),
      },
    });

    let successCount = 0;
    for (const file of files) {
      // S3にアップロード
      try {
        // ファイルを Buffer に変換
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fileType = await fileTypeFromBuffer(buffer);

        if (!fileType) {
          console.warn(`Skipped: ${file.name} (unknown type)`);
          return;
        }

        // プリサインドURLを発行
        const url = await getS3PresignedUrl(userId, fileType.mime, file.name);
        if (!url) continue;
        // S3 userId/tmpに一時アップロード
        await fetch(url, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': fileType.mime,
          },
        });

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

        console.log('File uploaded successfully');
        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }

    const completedToastId = toast('アプロード完了', {
      description: `${successCount} files uploaded successfully`,
      action: {
        label: 'Undo',
        onClick: () => toast.dismiss(completedToastId),
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
