import { auth } from '@/auth';
import { Sidebar, SidebarRail } from '@/components/ui/sidebar';
import { AppSidebarHeader } from './header';
import { AppSidebarContent } from './content';
import { AppSidebarFooter } from './footer';

export async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar>
      <AppSidebarHeader />
      <AppSidebarContent session={session} />
      <SidebarRail />
      <AppSidebarFooter session={session} />
    </Sidebar>
  );
}
