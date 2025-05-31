'use client';

import { SidebarMenuButton } from '../ui/sidebar';
import { PlusCircleIcon } from 'lucide-react';
import { handleUpload } from '@/hooks/upload-files';

export function AppSidebarButton({ userId }: { userId: string }) {
  return (
    <SidebarMenuButton asChild>
      <label htmlFor='file-upload' className='cursor-pointer'>
        <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={(e) => handleUpload({ e, userId })} />
        <PlusCircleIcon />
        <span>アップロード</span>
      </label>
    </SidebarMenuButton>
  );
}
