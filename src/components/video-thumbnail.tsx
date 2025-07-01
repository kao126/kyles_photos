import { useGenerateThumbnailLogic } from '@/hooks/use-generate-thumbnail';
import { useEffect } from 'react';

export function VideoThumbnail({ file }: { file: MediaEntryType }) {
  const { thumbnailUrl, setThumbnailUrl, generateThumbnail } = useGenerateThumbnailLogic();

  useEffect(() => {
    if (file.videoUrl) {
      generateThumbnail(file.videoUrl).then(setThumbnailUrl);
    }
  }, [file.videoUrl]);

  return <img src={thumbnailUrl} alt={file.fileName} className='w-full h-auto aspect-[1/1] object-cover' />;
}
