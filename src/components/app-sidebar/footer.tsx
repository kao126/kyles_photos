import { SidebarFooter } from '@/components/ui/sidebar';
import { type Session } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function AppSidebarFooter({ session }: { session: Session | null }) {
  return (
    <SidebarFooter>
      <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
        {session?.user?.image && (
          <Avatar className='h-8 w-8 rounded-lg'>
            <AvatarImage src={session?.user?.image} alt='profile image' />
            <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
          </Avatar>
        )}
        <div className='grid flex-1 text-left text-sm leading-tight'>
          <span className='truncate font-semibold'>{session?.user?.name}</span>
          <span className='truncate text-xs'>{session?.user?.email}</span>
        </div>
      </div>
    </SidebarFooter>
  );
}
