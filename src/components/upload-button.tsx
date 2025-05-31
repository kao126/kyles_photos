'use client';

import { handleUpload } from '@/hooks/upload-files';
import { PlusSquareIcon } from 'lucide-react';

export function UploadButton({ userId }: { userId: string }) {
  return (
    <label htmlFor='file-upload' className='md:hidden'>
      <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={(e) => handleUpload({ e, userId })} />
      <PlusSquareIcon className='size-8 bg-transparent' strokeWidth={1.5} />
    </label>
  );
}
