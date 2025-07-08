'use client';

import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export function AppSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar} className='size-8'>
      <PanelLeft className='size-2/3' strokeWidth={1.5} />
    </button>
  );
}
