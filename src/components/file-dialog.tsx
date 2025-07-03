import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { FileDropDown } from './file-dropdown';
import { useGenerateThumbnailLogic } from '@/hooks/use-generate-thumbnail';

export function FileDialogContent({
  open,
  setOpen,
  selectedFile,
  isDeleted,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedFile: SelectedFileType;
  isDeleted: MediaEntryType['isDeleted'];
}) {
  const { thumbnailUrl, setThumbnailUrl, generateThumbnail } = useGenerateThumbnailLogic();

  useEffect(() => {
    if (selectedFile.file.url && selectedFile.file.fileMimeCategory === 'video') {
      generateThumbnail(selectedFile.file.url).then(({ thumbnail }) => {
        setThumbnailUrl(thumbnail);
      });
    }
  }, [selectedFile.file.url]);

  useEffect(() => {
    if (open) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='fixed md:top-0 right-0 bottom-0 w-full md:w-[calc(100vw-var(--sidebar-width))] h-[calc(100dvh-4rem)] md:h-full bg-black/90 flex flex-col'>
        <DialogHeader className='flex flex-row justify-between items-center p-4'>
          <DialogTitle className='text-white'>
            {selectedFile.year}年{selectedFile.month}月{selectedFile.file.day}日
          </DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
          <FileDropDown file={selectedFile.file} isDeleted={isDeleted} />
        </DialogHeader>
        <div className='flex-1 flex justify-center items-center overflow-hidden pb-6 md:pb-12'>
          {selectedFile.file.fileMimeCategory === 'video' ? (
            <video src={selectedFile.file.url} poster={thumbnailUrl} controls className='w-auto h-full object-contain' />
          ) : (
            <img src={selectedFile.file.url} alt={selectedFile.file.fileName} className='w-auto h-full object-contain' />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
