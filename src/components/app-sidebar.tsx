'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function AppSidebar({ session }: { session: Session | null }) {
  const [signedUrls, setSignedUrls] = useState<{ [year: string]: { [month: string]: { url: string; fileName: string }[] } }>({});

  useEffect(() => {
    fetch(`/api/aws/s3?userId=${session?.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, []);

  return (
    <Sidebar className='top-[--header-height] !h-[calc(100svh-var(--header-height))]'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#'>
                <div className='flex size-8 items-center justify-center'>
                  <img src='/logo.png' alt='logo' className='block' />
                </div>
                <span className='text-base font-semibold'>Kyle's Photos</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
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
                      {Object.entries(month).map(([month, _files]) => (
                        <SidebarMenuSubItem key={month}>
                          <SidebarMenuSubButton asChild>
                            <a href={`#${year}-${month}`}>{month}月</a>
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
      </SidebarContent>
      <SidebarRail />
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
    </Sidebar>
  );
}
