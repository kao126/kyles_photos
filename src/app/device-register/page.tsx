'use client';

import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DeviceRegister() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const deviceToken = formData.get('device-token');
    if (deviceToken) {
      document.cookie = `device-token=${deviceToken}; path=/; max-age=${60 * 60 * 24 * 30}`; // device-tokenをCookieに保存（有効期限30日）
      alert('端末が登録されました！');
      router.push('/login');
    }
  }

  return (
    <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
      <div className='flex w-full max-w-sm flex-col gap-6'>
        <Card className='text-center'>
          <CardHeader>
            <CardTitle className='text-xl'>Device Registration</CardTitle>
            <CardDescription>Enter "Device Token" and register the token</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Input type='password' name='device-token' placeholder='Device Token' />
              <Button type='submit' className='mt-4 cursor-pointer'>
                登録する
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
