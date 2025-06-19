'use client';

import { useFileUpload } from '@/contexts/file-upload-context';
import { PlusSquareIcon } from 'lucide-react';

export function UploadButton({ userId }: { userId: string }) {
  const { uploading, handleUpload } = useFileUpload();
  return (
    <label htmlFor='file-upload' className={`md:hidden  ${uploading ? 'opacity-50' : ''}`}>
      <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={(e) => handleUpload({ e, userId })} disabled={uploading} />
      <PlusSquareIcon className='size-8 bg-transparent' strokeWidth={1.5} />
    </label>
  );
}
