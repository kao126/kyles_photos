'use client';
import { recentlyDeletedS3Object } from '@/actions/aws/s3';
import { toast } from 'sonner';

export function useRecentlyDeletedFileLogic() {

  async function handleRecentlyDeletedFile({ originalKey }: { originalKey: MediaEntryType['key'] }) {
    try {
      const DeletingToastId = toast('削除中', {
        description: `Deleting file`,
        duration: Infinity,
      });
      await recentlyDeletedS3Object({ originalKey });
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
  return { handleRecentlyDeletedFile };
}
