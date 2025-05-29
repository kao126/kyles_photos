'use client';

import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

export function Button({ userId }: { userId: string }) {
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
    <div>
      <input type='file' id='file-upload' className='hidden' accept='image/*,video/*' multiple onChange={handleUpload} />
      <label htmlFor='file-upload' className='cursor-pointer flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition'>
        <PlusCircleIcon />
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
    </div>
  );
}
