import { auth } from '@/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default async function Home() {
  const session = await auth();

  return (
    <div className='flex justify-center items-center md:gap-6 w-full h-full md:h-dvh'>
      <div className='absolute md:static inset-0 md:inset-auto flex justify-center items-center opacity-10 pointer-events-none select-none'>
        <img src='/logo.png' alt='logo' />
      </div>
      <div className='select-none'>
        <h1 className='text-5xl md:text-7xl font-bold text-center md:text-start'>{"Kyle's Photos"}</h1>
        <p className='mt-2 mb-4 text-xs md:text-base text-zinc-600'>写真や動画を日付ごとに管理できるシンプルなギャラリーアプリ</p>
        <div className='flex justify-center items-center'>
          {!session && (
            <Link href={'/login'}>
              <Button variant='outline' className='cursor-pointer'>
                <LogIn className='size-4' />
                ログイン
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
