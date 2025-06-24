import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogHeader } from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';
import { FileDropDown } from './file-dropdown';

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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='absolute inset-0 bg-black/90 h-full flex flex-col'>
        <DialogHeader className='flex flex-row justify-between items-center p-4'>
          <DialogTitle className='text-white'>
            {selectedFile.year}年{selectedFile.month}月{selectedFile.file.day}日
          </DialogTitle>
          <FileDropDown fileKey={selectedFile.file.key} isDeleted={isDeleted} />
        </DialogHeader>
        <div className='flex-1 flex justify-center items-center overflow-hidden pb-6 md:pb-12'>
          {selectedFile.file.videoUrl ? (
            <video src={selectedFile.file.videoUrl} poster={selectedFile.file.imageUrl} controls className='w-auto h-full object-contain' />
          ) : (
            <img src={selectedFile.file.imageUrl} alt={selectedFile.file.fileName} className='w-auto h-full object-contain' />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
