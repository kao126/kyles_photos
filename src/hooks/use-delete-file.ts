'use client';
import { completelyDeleteS3Object } from '@/actions/aws/s3';
import { useState } from 'react';
import { toast } from 'sonner';

export function useDeleteFileLogic() {
  const [isOpen, setIsOpen] = useState(false);

  async function handleDeleteFile({ originalKey }: { originalKey: MediaEntryType['key'] }) {
    try {
      const DeletingToastId = toast('削除中', {
        description: `Completely Deleting file`,
        duration: Infinity,
      });
      await completelyDeleteS3Object({ originalKey });
      toast.dismiss(DeletingToastId);
      const completedToastId = toast('削除完了', {
        description: `file deleted successfully`,
        action: {
          label: 'Undo',
          onClick: () => toast.dismiss(completedToastId),
        },
      });
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
    }
  }
  return { isOpen, setIsOpen, handleDeleteFile };
}
