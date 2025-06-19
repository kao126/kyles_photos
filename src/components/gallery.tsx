'use client';
import { useFileUpload } from '@/contexts/file-upload-context';
import path from 'path';
import { useState, useEffect } from 'react';
import { FileDialogContent } from './file-dialog';

export function Gallery({ userId }: { userId: string }) {
  const [signedUrls, setSignedUrls] = useState<{ [year: string]: { [month: string]: { url: string; fileName: string; day: string }[] } }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSrc, setSelectedSrc] = useState<string>('');
  const [selectedAlt, setSelectedAlt] = useState<string>('');
  const [fileDate, setFileDate] = useState<Record<string, string>>({ year: 'xxxx', month: 'xx', day: 'xx' });
  const { uploaded } = useFileUpload();

  useEffect(() => {
    fetch(`/api/aws/s3?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, [uploaded]);

  const isPhoto = (fileName: string) => {
    const photoExtensions = ['.jpg', '.jpeg', '.png', '.heic'];
    const ext = path.extname(fileName).toLowerCase();
    return photoExtensions.includes(ext);
  };

  function handleDialog({ url, fileName, year, month, day }: { url: string; fileName: string; year: string; month: string; day: string }) {
    setIsOpen((prev) => !prev);
    setSelectedSrc(url);
    setSelectedAlt(fileName);
    setFileDate({ year, month, day });
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
                  {files.map(
                    ({ url, fileName, day }) =>
                      isPhoto(fileName) && (
                        <div className='w-fit overflow-hidden rounded-xs' key={url} onClick={() => handleDialog({ url, fileName, year, month, day })}>
                          <img src={url} alt={fileName} className='w-full h-auto aspect-[1/1] object-cover' />
                        </div>
                      )
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <FileDialogContent open={isOpen} setOpen={setIsOpen} selectedSrc={selectedSrc} selectedAlt={selectedAlt} fileDate={fileDate} />
    </>
  );
}
