'use client';

import { useState } from 'react';
import { SidebarMenuButton } from '../ui/sidebar';
import { PlusCircleIcon } from 'lucide-react';

export function AppSidebarButton({ userId }: { userId: string }) {
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setTotalFiles(files.length);
      setIsUploading(true);

      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      const res = await fetch(`/api/aws/s3?userId=${userId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadedFiles(data.successCount);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setIsUploading(false);
    setIsCompleted(true);
  }

  return (
    <SidebarMenuButton asChild>
      <>
        <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={handleUpload} />
        <label
          htmlFor='file-upload'
          className='peer/menu-button cursor-pointer flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'
        >
          <PlusCircleIcon />
          <span>アップロード</span>
        </label>
        {isUploading && (
          <div>
            <p>Uploading {totalFiles} files</p>
          </div>
        )}
        {isCompleted && (
          <div>
            <p>{uploadedFiles} files uploaded successfully</p>
          </div>
        )}
      </>
    </SidebarMenuButton>
  );
}
