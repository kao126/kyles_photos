'use client';
import { useState, useEffect } from 'react';

export function Gallery() {
  const [signedUrls, setSignedUrls] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/aws/s3')
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, []);

  return (
    <div>
      {signedUrls.map((url) => (
        <img src={url} alt='photo' key={url} />
      ))}
    </div>
  );
}
