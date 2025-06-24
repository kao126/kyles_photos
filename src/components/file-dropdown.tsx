import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { useRecentlyDeletedFileLogic } from '@/hooks/use-recently-deleted-file';

export function FileDropDown({ fileKey }: { fileKey: MediaEntryType['key'] }) {
  const { handleRecentlyDeletedFile } = useRecentlyDeletedFileLogic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='cursor-pointer'>
          <MoreVerticalIcon className='text-white' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='rounded-sm'>
        <DropdownMenuItem className='text-red-600 hover:bg-gray-100' onClick={() => handleRecentlyDeletedFile({ originalKey: fileKey })}>
          削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
