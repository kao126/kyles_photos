'use client';
import { toast } from 'sonner';
import { uploadFiles } from './upload-files';
import { useState } from 'react';

export function useFileUploadLogic() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload({ e, userId }: { e: React.ChangeEvent<HTMLInputElement>; userId: string }) {
    try {
      setUploading(true);
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const uploadingToastId = toast('アップロード中', {
        description: `Uploading ${files.length} files`,
        duration: Infinity,
      });

      let successCount = 0;
      for (const file of files) {
        try {
          await uploadFiles({ file, userId }); // S3にアップロード
          successCount++;
          setProgress(Math.round((successCount / files.length) * 100));
          console.log('File uploaded successfully');
        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }

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
  return { uploading, progress, handleUpload };
}
