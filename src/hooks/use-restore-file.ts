'use client';
import { restoreS3Object } from '@/actions/aws/s3';
import { toast } from 'sonner';

export function useRestoreFileLogic() {

  async function handleRestoreFile({ originalKey }: { originalKey: MediaEntryType['key'] }) {
    try {
      const RestoringToastId = toast('復元中', {
        description: `Restoring file`,
        duration: Infinity,
      });
      await restoreS3Object({ originalKey });
      toast.dismiss(RestoringToastId);
      const completedToastId = toast('復元完了', {
        description: `file restored successfully`,
        action: {
          label: 'Undo',
          onClick: () => toast.dismiss(completedToastId),
        },
      });
    } catch (error) {
      console.error('Error restoring file:', error);
    } finally {
    }
  }
  return { handleRestoreFile };
}
