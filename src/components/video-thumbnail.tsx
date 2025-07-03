import { useGenerateThumbnailLogic } from '@/hooks/use-generate-thumbnail';
import { formatVideoDuration } from '@/lib/format-video-duration';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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

  return thumbnailUrl && duration > 0 ? (
    <div className='relative'>
      <img src={thumbnailUrl} alt={file.fileName} className='w-full aspect-square object-cover' />
      <span className='absolute bottom-0 right-0 text-white font-semibold text-sm md:text-base p-1 md:p-1.5'>{formatVideoDuration(duration)}</span>
    </div>
  ) : (
    <Skeleton className='w-full aspect-square' />
  );
}
