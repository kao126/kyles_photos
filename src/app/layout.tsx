import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from 'sonner';
import Link from 'next/link';
import { auth } from '@/auth';
import { UploadButton } from '@/components/upload-button';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className='md:hidden flex justify-between items-center h-16 border-b sticky top-0 bg-background z-50 px-6'>
                <div className='w-8'></div>
                <Link href='/' className='flex justify-center items-center gap-2 h-full'>
                  <img src='/logo.png' alt='logo' className='size-8' />
                  <span className='text-base font-semibold'>{"Kyle's Photos"}</span>
                </Link>
                {session?.userId && <UploadButton userId={session?.userId} />}
              </header>
              {children}
              <footer className='md:hidden flex justify-center items-center h-16 border-t'>
                <small>{"Copyright © 2025 Kyle's Photos All Rights Reserved."}</small>
              </footer>
            </SidebarInset>
            <Toaster />
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
