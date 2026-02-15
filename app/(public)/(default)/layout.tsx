import Header from '../_components/header';
export default function PublicDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className='max-w-(--max-width) mx-auto px-6 md:px-10 box-content'>
        {children}
      </main>
    </>
  );
}
