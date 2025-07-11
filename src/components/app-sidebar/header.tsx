import Link from 'next/link';
import { SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { AppSidebarButton } from './button';

export function AppSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size='lg' asChild>
            <Link href='/'>
              <img src='/logo.png' alt='logo' className='size-8' />
              <span className='text-base font-semibold'>{"Kyle's Photos"}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          <AppSidebarButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
