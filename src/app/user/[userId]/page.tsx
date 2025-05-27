import { auth } from '@/auth';
import { Button } from '@/components/button';
import { Gallery } from '@/components/gallery';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const session = await auth();

  if (!(session?.userId == userId)) {
    redirect('/');
  }

  return (
    <>
      <div>{userId}</div>
      <Button />
      <Gallery />
    </>
  );
}
