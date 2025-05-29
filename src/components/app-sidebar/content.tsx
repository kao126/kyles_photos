'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { type Session } from 'next-auth';
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
import { ChevronRight } from 'lucide-react';

export function AppSidebarContent({ session }: { session: Session | null }) {
  const [signedUrls, setSignedUrls] = useState<{ [year: string]: { [month: string]: { url: string; fileName: string }[] } }>({});
  const searchParams = useSearchParams();
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  useEffect(() => {
    fetch(`/api/aws/s3?userId=${session?.userId}`)
      .then((res) => res.json())
      .then((data) => {
        setSignedUrls(data.urls);
      });
  }, []);

  useEffect(() => {
    if (year && month) {
      const id = `${year}-${month}`;
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [year, month]);

  return (
    <SidebarContent>
      {Object.keys(signedUrls).length > 0 && (
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
                            <Link href={`/user/${session?.userId}?year=${year}&month=${month}`} scroll={false}>
                              {month}月
                            </Link>
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
    </SidebarContent>
  );
}
