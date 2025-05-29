import Link from 'next/link';
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function AppSidebarHeader() {
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
    </SidebarHeader>
  );
}
