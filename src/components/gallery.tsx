'use client';
import { useState, useEffect } from 'react';

export function Gallery({ userId }: { userId: string }) {
  const [signedUrls, setSignedUrls] = useState<{ [year: string]: { [month: string]: { url: string; fileName: string }[] } }>({});

  useEffect(() => {
    fetch(`/api/aws/s3?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, []);

  return (
    <div>
      {Object.entries(signedUrls).map(([year, month]) => (
        <div key={year}>
          <p className='text-2xl font-bold'>{year}年</p>
          {Object.entries(month).map(([month, files]) => (
            <div id={`${year}-${month}`} key={month}>
              <p className='text-lg font-bold'>{month}月</p>
              <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'>
                {files.map(({ url, fileName }) => (
                  <div className='w-fit overflow-hidden rounded-xs' key={url}>
                    <img src={url} alt={fileName} className='w-full h-auto aspect-[1/1] object-cover' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
