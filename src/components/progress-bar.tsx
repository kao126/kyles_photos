'use client';
import { Progress } from '@/components/ui/progress';
import { useFileUpload } from '@/contexts/file-upload-context';

export function ProgressBar() {
  const { uploading, progress } = useFileUpload();
  return uploading && <Progress value={progress} />;
}
