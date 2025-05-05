import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/login-form';

export default async function Login() {
  const session = await auth();

  if (session) {
    redirect('/');
  }

  return (
    !session && (
      <div className='flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10'>
        <div className='flex w-full max-w-sm flex-col gap-6'>
          <LoginForm />
        </div>
      </div>
    )
  );
}
