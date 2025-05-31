import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Kyle's Photos",
  description: 'photos and videos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className='md:hidden flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background z-50'>
                <SidebarTrigger className='-ml-1' />
              </header>
              <div>{children}</div>
            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
