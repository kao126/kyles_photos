'use client';
import { useFileUpload } from '@/contexts/file-upload-context';
import { useState, useEffect, useRef } from 'react';
import { FileDialogContent } from './file-dialog';
import { VideoThumbnail } from './video-thumbnail';
import { Skeleton } from '@/components/ui/skeleton';

export function Gallery({ userId, isDeleted }: { userId: string; isDeleted: MediaEntryType['isDeleted'] }) {
  const [signedUrls, setSignedUrls] = useState<fileUrlsType>({});
  const [continuationToken, setContinuationToken] = useState<string | null>(null);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<SelectedFileType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { uploaded } = useFileUpload();
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = isDeleted ? `/api/aws/s3?userId=${userId}&isDeleted=true` : `/api/aws/s3?userId=${userId}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
        setContinuationToken(data.NextContinuationToken);
        setIsTruncated(data.IsTruncated);
      });
  }, [uploaded]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isTruncated) {
          const encodedToken = encodeURIComponent(continuationToken ?? '');
          const url = isDeleted
            ? `/api/aws/s3?userId=${userId}&continuationToken=${encodedToken}&isDeleted=true`
            : `/api/aws/s3?userId=${userId}&continuationToken=${encodedToken}`;
          fetch(url)
            .then((res) => res.json())
            .then((data) => {
              const fileUrls = data.urls;
              setSignedUrls((prev) => {
                const newSignedUrls: fileUrlsType<MediaEntryType> = {};

                // まず prev をコピー
                for (const year in prev) {
                  newSignedUrls[year] = {};
                  for (const month in prev[year]) {
                    newSignedUrls[year][month] = [...prev[year][month]];
                  }
                }

                // fileUrls をマージ
                for (const year in fileUrls) {
                  if (!newSignedUrls[year]) newSignedUrls[year] = {};

                  for (const month in fileUrls[year]) {
                    if (!newSignedUrls[year][month]) {
                      newSignedUrls[year][month] = [...fileUrls[year][month]];
                    } else {
                      newSignedUrls[year][month] = [...newSignedUrls[year][month], ...fileUrls[year][month]];
                    }
                  }
                }

                return newSignedUrls;
              });
              setContinuationToken(data.NextContinuationToken);
              setIsTruncated(data.IsTruncated);
            });
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loaderRef.current, isTruncated]);

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
                      {isDeleted && (
                        <div className='absolute bottom-0 text-center text-white w-full bg-gradient-to-t from-black/60 to-black/0'>{DaysLeft(file.lastModifiedDate)}日前</div>
                      )}
                    </div>
                  ))}
                  <div ref={loaderRef} className='h-10'></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedFile && <FileDialogContent open={isOpen} setOpen={setIsOpen} selectedFile={selectedFile} isDeleted={isDeleted} />}
    </>
  );
}
