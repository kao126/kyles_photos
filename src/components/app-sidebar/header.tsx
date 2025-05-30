import Link from 'next/link';
import { type Session } from 'next-auth';
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { AppSidebarButton } from './button';

export function AppSidebarHeader({ session }: { session: Session | null }) {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' asChild>
            <Link href='/'>
              <div className='flex size-8 items-center justify-center'>
                <img src='/logo.png' alt='logo' className='block' />
              </div>
              <span className='text-base font-semibold'>Kyle's Photos</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem>{session?.userId && <AppSidebarButton userId={session.userId} />}</SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
