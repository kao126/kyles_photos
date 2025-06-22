import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogHeader } from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';

export function FileDialogContent({ open, setOpen, selectedFile }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; selectedFile: SelectedFileType }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='absolute inset-0 bg-black/90 h-full flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-white p-4'>
            {selectedFile.year}年{selectedFile.month}月{selectedFile.file.day}日
          </DialogTitle>
        </DialogHeader>
        <div className='flex-1 flex justify-center items-center overflow-hidden pb-6 md:pb-12'>
          {selectedFile.file.videoUrl ? (
            <video src={selectedFile.file.videoUrl} controls className='w-auto h-full object-contain' />
          ) : (
            <img src={selectedFile.file.imageUrl} alt={selectedFile.file.fileName} className='w-auto h-full object-contain' />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
