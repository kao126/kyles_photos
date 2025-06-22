'use client';
import { useFileUpload } from '@/contexts/file-upload-context';
import { useState, useEffect } from 'react';
import { FileDialogContent } from './file-dialog';

export function Gallery({ userId }: { userId: string }) {
  const [signedUrls, setSignedUrls] = useState<fileUrlsType>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>();
  const { uploaded } = useFileUpload();

  useEffect(() => {
    fetch(`/api/aws/s3?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, [uploaded]);

  function handleDialog({ year, month, file }: { year: string; month: string; file: MediaEntryType }) {
    setIsOpen((prev) => !prev);
    setSelectedFile({ year, month, file });
  }

  return (
    <>
      <div className='p-4'>
        {Object.entries(signedUrls).map(([year, month]) => (
          <div className='py-4 md:p-4' key={year}>
            <p className='text-2xl font-bold'>{year}年</p>
            {Object.entries(month).map(([month, files]) => (
              <div id={`${year}-${month}`} className='py-1' key={month}>
                <p className='text-lg font-bold'>{month}月</p>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'>
                  {files.map((file) => (
                    <div className='w-fit overflow-hidden rounded-xs' key={file.imageUrl} onClick={() => handleDialog({ year, month, file })}>
                      <img src={file.imageUrl} alt={file.fileName} className='w-full h-auto aspect-[1/1] object-cover' />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedFile && <FileDialogContent open={isOpen} setOpen={setIsOpen} selectedFile={selectedFile} />}
    </>
  );
}
