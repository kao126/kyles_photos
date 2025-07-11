'use client';
import { useFileUpload } from '@/contexts/file-upload-context';
import { useState, useEffect, useRef } from 'react';
import { FileDialogContent } from './file-dialog';
import { VideoThumbnail } from './video-thumbnail';
import { Skeleton } from '@/components/ui/skeleton';
import { useFileUrlStore } from '@/lib/stores/file-url-store';
import { usePathname } from 'next/navigation';

export function Gallery({ userId }: { userId: string; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { uploaded } = useFileUpload();
  const loaderRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef<boolean>(false);
  const pathname = usePathname();
  const isRecentlyDeletedPage = pathname.endsWith('/recently-deleted');
  const { signedUrls, nextContinuationToken, isTruncated, fetchFileUrls, updateFileUrls } = useFileUrlStore();

  useEffect(() => {
    fetchFileUrls(userId, isRecentlyDeletedPage);
  }, [uploaded]);

  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isTruncated && !isFetchingRef.current) {
          updateFileUrls(isFetchingRef, userId, isRecentlyDeletedPage);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [nextContinuationToken, isTruncated]);

  function handleDialog({ year, month, file }: { year: string; month: string; file: MediaEntryType }) {
    setIsOpen((prev) => !prev);
    setSelectedFile({ year, month, file });
  }

  function DaysLeft(lastModifiedDate: MediaEntryType['lastModifiedDate']) {
    function addDays(date: Date, days: number): Date {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    const today = new Date();
    const deadline = addDays(lastModifiedDate, 30);
    const msDiff = deadline.getTime() - today.getTime();
    const dayDiff = Math.round(msDiff / (1000 * 60 * 60 * 24)); // 日数に変換
    return dayDiff;
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
                    <div className='relative overflow-hidden rounded-xs' key={file.url} onClick={() => handleDialog({ year, month, file })}>
                      {file.fileMimeCategory === 'video' ? (
                        <VideoThumbnail file={file} />
                      ) : (
                        <>
                          {isLoading && <Skeleton className='w-full aspect-square' />}
                          <img
                            src={file.url}
                            alt={file.fileName}
                            className={`w-full aspect-square object-cover ${isLoading ? 'hidden' : 'block'}`}
                            onLoad={() => setIsLoading(false)}
                          />
                        </>
                      )}
                      {isRecentlyDeletedPage && (
                        <div className='absolute bottom-0 text-center text-white w-full bg-gradient-to-t from-black/60 to-black/0'>{DaysLeft(file.lastModifiedDate)}日前</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={loaderRef} className='flex justify-center items-center'>
          {isFetchingRef && isTruncated && <div className='w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin p-4'></div>}
        </div>
      </div>
      {selectedFile && <FileDialogContent open={isOpen} setOpen={setIsOpen} selectedFile={selectedFile} isRecentlyDeletedPage={isRecentlyDeletedPage} />}
    </>
  );
}
