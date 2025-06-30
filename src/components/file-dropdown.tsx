import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { useRecentlyDeletedFileLogic } from '@/hooks/use-recently-deleted-file';
import { useRestoreFileLogic } from '@/hooks/use-restore-file';
import { useDeleteFileLogic } from '@/hooks/use-delete-file';
import { useDownloadFileLogic } from '@/hooks/use-download-file';

export function FileDropDown({ file, isDeleted }: { file: MediaEntryType; isDeleted: MediaEntryType['isDeleted'] }) {
  const { handleRecentlyDeletedFile } = useRecentlyDeletedFileLogic();
  const { handleRestoreFile } = useRestoreFileLogic();
  const { handleDeleteFile } = useDeleteFileLogic();
  const { handleDownloadFile } = useDownloadFileLogic();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='cursor-pointer'>
          <MoreVerticalIcon className='text-white' />
        </Button>
      </DropdownMenuTrigger>
      {isDeleted ? (
        <DropdownMenuContent className='rounded-sm'>
          <DropdownMenuItem className='hover:bg-gray-100' onClick={() => handleRestoreFile({ originalKey: file.key })}>
            復元
          </DropdownMenuItem>
          <DropdownMenuItem className='text-red-600 hover:bg-gray-100' onClick={() => handleDeleteFile({ originalKey: file.key })}>
            完全に削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className='rounded-sm'>
          <DropdownMenuItem className='hover:bg-gray-100' onClick={() => handleDownloadFile({ originalKey: file.key, fileName: file.fileName })}>
            ダウンロード
          </DropdownMenuItem>
          <DropdownMenuItem className='text-red-600 hover:bg-gray-100' onClick={() => handleRecentlyDeletedFile({ originalKey: file.key })}>
            削除
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
