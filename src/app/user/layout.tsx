export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className='relative flex-auto'>{children}</section>;
}
