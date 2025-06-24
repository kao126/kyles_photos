import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { useRecentlyDeletedFileLogic } from '@/hooks/use-recently-deleted-file';
import { useRestoreFileLogic } from '@/hooks/use-restore-file';

export function FileDropDown({ fileKey, isDeleted }: { fileKey: MediaEntryType['key']; isDeleted: MediaEntryType['isDeleted'] }) {
  const { handleRecentlyDeletedFile } = useRecentlyDeletedFileLogic();
  const { handleRestoreFile } = useRestoreFileLogic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='cursor-pointer'>
          <MoreVerticalIcon className='text-white' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='rounded-sm'>
        {isDeleted ? (
          <DropdownMenuItem className='hover:bg-gray-100' onClick={() => handleRestoreFile({ originalKey: fileKey })}>
            復元
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className='text-red-600 hover:bg-gray-100' onClick={() => handleRecentlyDeletedFile({ originalKey: fileKey })}>
            削除
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
