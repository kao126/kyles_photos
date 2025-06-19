'use client';
import { useFileUpload } from '@/contexts/file-upload-context';
import { SidebarMenuButton } from '../ui/sidebar';
import { PlusCircleIcon } from 'lucide-react';

export function AppSidebarButton({ userId }: { userId: string }) {
  const { uploading, progress, handleUpload } = useFileUpload();

  return (
    <SidebarMenuButton asChild>
      <label htmlFor='file-upload' className={`cursor-pointer  ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
        <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={(e) => handleUpload({ e, userId })} disabled={uploading} />
        <PlusCircleIcon />
        <span>{uploading ? `アップロード中... ${progress} %` : 'アップロード'}</span>
      </label>
    </SidebarMenuButton>
  );
}
