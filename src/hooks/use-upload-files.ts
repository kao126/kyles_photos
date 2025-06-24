'use client';
import { toast } from 'sonner';
import { uploadFiles } from './upload-files';
import { useState } from 'react';

export function useFileUploadLogic() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload({ e, userId }: { e: React.ChangeEvent<HTMLInputElement>; userId: string }) {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;
      const filesLength = files.length;

      const uploadingToastId = toast('アップロード中', {
        description: `Uploading ${filesLength} files`,
        duration: Infinity,
      });

      const queue = [...files];
      const concurrency = 3;
      let successCount = 0;
      async function uploadNext() {
        const file = queue.shift();
        if (!file) return;

        try {
          await uploadFiles({ file, userId }); // S3にアップロード
          successCount++;
          setProgress(Math.round((successCount / filesLength) * 100));
        } catch (err) {
          console.error(`Upload failed for ${file.name}:`, err);
        }

        await uploadNext(); // 次のファイルに進む
      }

      // 並列処理
      await Promise.all(Array.from({ length: concurrency }, () => uploadNext()));

      setUploaded((prev) => !prev);
      toast.dismiss(uploadingToastId);
      const completedToastId = toast('アプロード完了', {
        description: `${successCount} files uploaded successfully`,
        action: {
          label: 'Undo',
          onClick: () => toast.dismiss(completedToastId),
        },
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  }
  return { uploading, uploaded, progress, handleUpload };
}
