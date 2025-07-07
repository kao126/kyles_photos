import { auth } from '@/auth';
import { Sidebar } from '@/components/ui/sidebar';
import { AppSidebarHeader } from './header';
import { AppSidebarContent } from './content';
import { AppSidebarFooter } from './footer';

export async function AppSidebar() {
  const session = await auth();

  return (
    <Sidebar>
      <AppSidebarHeader session={session} />
      {session?.user && (
        <>
          <AppSidebarContent session={session} />
          <AppSidebarFooter session={session} />
        </>
      )}
    </Sidebar>
  );
}
