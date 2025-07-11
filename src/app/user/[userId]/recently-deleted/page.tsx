import { auth } from '@/auth';
import { Gallery } from '@/components/gallery';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const session = await auth();

  if (!(session?.userId == userId)) {
    redirect('/');
  }

  return <Gallery userId={session?.userId} />;
}
