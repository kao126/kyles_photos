'use client';

import { useState } from 'react';

export function useGenerateThumbnailLogic() {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>();

  async function generateThumbnail(videoUrl: MediaEntryType['url']): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;

      video.addEventListener(
        'loadedmetadata',
        () => {
          video.play().then(() => {
            video.currentTime = 0;
          });
        },
        { once: true }
      );

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
      });

      video.addEventListener('error', () => reject('動画の読み込みに失敗'));
    });
  }
  return { thumbnailUrl, setThumbnailUrl, generateThumbnail };
}
