import { useGenerateThumbnailLogic } from '@/hooks/use-generate-thumbnail';
import { formatVideoDuration } from '@/lib/format-video-duration';
import { useEffect } from 'react';

export function VideoThumbnail({ file }: { file: MediaEntryType }) {
  const { thumbnailUrl, setThumbnailUrl, duration, setDuration, generateThumbnail } = useGenerateThumbnailLogic();

  useEffect(() => {
    if (file.url && file.fileMimeCategory === 'video') {
      generateThumbnail(file.url).then(({ thumbnail, duration }) => {
        setThumbnailUrl(thumbnail);
        setDuration(duration);
      });
    }
  }, [file.url]);

  return (
    <div className='relative'>
      <img src={thumbnailUrl} alt={file.fileName} className='w-full h-auto aspect-[1/1] object-cover' />
      <span className='absolute bottom-0 right-0 text-white font-semibold text-sm p-1'>{formatVideoDuration(duration)}</span>
    </div>
  );
}
