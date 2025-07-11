import { SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppSidebarDropdown } from './dropdown';
import { auth } from '@/auth';

export async function AppSidebarFooter() {
  const session = await auth();
  return (
    session?.user && (
      <SidebarFooter>
        <div className='flex justify-between items-center px-1 py-1.5'>
          <div className='flex items-center gap-2'>
            {session.user?.image && (
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={session.user.image} alt='profile image' />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
            )}
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{session.user.name}</span>
              <span className='truncate text-xs'>{session.user.email}</span>
            </div>
          </div>
          <AppSidebarDropdown />
        </div>
      </SidebarFooter>
    )
  );
}
