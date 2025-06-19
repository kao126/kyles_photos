import { DialogContent, DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Dialog, DialogHeader } from '@/components/ui/dialog';
import { Dispatch, SetStateAction } from 'react';

export function FileDialogContent({
  open,
  setOpen,
  selectedSrc,
  selectedAlt,
  fileDate,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSrc: string;
  selectedAlt: string;
  fileDate: Record<string, string>;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='absolute inset-0 bg-black/90 h-full flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-white p-4'>
            {fileDate.year}年{fileDate.month}月{fileDate.day}日
          </DialogTitle>
        </DialogHeader>
        <div className='flex-1 flex justify-center items-center overflow-hidden pb-6 md:pb-12'>
          <img src={selectedSrc} alt={selectedAlt} className='w-auto h-full object-contain' />
        </div>
      </DialogContent>
    </Dialog>
  );
}
