'use client';
import { useState, useEffect } from 'react';

export function Gallery({ userId }: { userId: string }) {
  const [signedUrls, setSignedUrls] = useState<{ url: string; fileName: string }[]>([]);

  useEffect(() => {
    fetch(`/api/aws/s3?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, []);

  return (
    <div>
      {signedUrls.map(({ url, fileName }) => (
        <img src={url} alt={fileName} key={url} />
      ))}
    </div>
  );
}
