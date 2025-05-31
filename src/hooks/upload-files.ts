import { toast } from 'sonner';

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

    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    const res = await fetch(`/api/aws/s3?userId=${userId}`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    const completedToastId = toast('アプロード完了', {
      description: `${data.successCount} files uploaded successfully`,
      action: {
        label: 'Undo',
        onClick: () => toast.dismiss(completedToastId),
      },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
