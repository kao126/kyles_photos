'use client';

import { SidebarMenuButton } from '../ui/sidebar';
import { PlusCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

export function AppSidebarButton({ userId }: { userId: string }) {
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  return (
    <SidebarMenuButton asChild>
      <label htmlFor='file-upload' className='cursor-pointer'>
        <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={handleUpload} />
        <PlusCircleIcon />
        <span>アップロード</span>
      </label>
    </SidebarMenuButton>
  );
}
