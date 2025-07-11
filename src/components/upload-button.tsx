'use client';

import { useFileUpload } from '@/contexts/file-upload-context';
import { PlusSquareIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function UploadButton() {
  const { data: session } = useSession();
  const { uploading, handleUpload } = useFileUpload();
  return (
    session?.userId && (
      <label htmlFor='file-upload' className={`md:hidden  ${uploading ? 'opacity-50' : ''}`}>
        <input
          type='file'
          id='file-upload'
          className='hidden'
          accept='image/*,video/*'
          multiple
          onChange={(e) => handleUpload({ e, userId: session.userId })}
          disabled={uploading}
        />
        <PlusSquareIcon className='size-8 bg-transparent' strokeWidth={1.5} />
      </label>
    )
  );
}
