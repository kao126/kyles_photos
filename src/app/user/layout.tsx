export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className='flex-auto'>{children}</section>;
}
