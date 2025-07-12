'use client';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Trash2, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useFileUrlStore } from '@/lib/stores/file-url-store';
import { useSession } from 'next-auth/react';

export function AppSidebarContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { signedUrls } = useFileUrlStore();

  const scrollToTargetMonth = ({ year, month }: { year: string; month: string }) => {
    router.push(`${pathname}?year=${year}&month=${month}`, { scroll: false });
    const element = document.getElementById(`${year}-${month}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    session?.userId && (
      <SidebarContent>
        {Object.keys(signedUrls).length > 0 && pathname !== '/' && (
          <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
            <SidebarGroupLabel>年月から探す</SidebarGroupLabel>
            <SidebarMenu>
              {Object.entries(signedUrls).map(([year, month]) => (
                <Collapsible key={year} asChild defaultOpen={false} className='group/collapsible'>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <span>{year}年</span>
                        <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {Object.entries(month).map(([month]) => (
                          <SidebarMenuSubItem key={month}>
                            <SidebarMenuSubButton asChild onClick={() => scrollToTargetMonth({ year, month })}>
                              <span>{month}月</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup className='mt-auto'>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/user/${session.userId}`}>
                  <LayoutGrid className='w-4 h-4' />
                  <span>ギャラリー</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={`/user/${session.userId}/recently-deleted`}>
                  <Trash2 className='w-4 h-4' />
                  <span>最近削除した項目</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    )
  );
}
