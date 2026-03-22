import Header from '../_components/header';
export default function PublicCartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='page-max-width'>{children}</main>
    </>
  );
}
