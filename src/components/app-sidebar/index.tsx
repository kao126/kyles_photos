import { Sidebar } from '@/components/ui/sidebar';
import { AppSidebarHeader } from './header';
import { AppSidebarContent } from './content';
import { AppSidebarFooter } from './footer';

export function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <AppSidebarContent />
      <AppSidebarFooter />
    </Sidebar>
  );
}
