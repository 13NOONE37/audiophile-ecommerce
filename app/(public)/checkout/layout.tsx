import Header from '../_components/header/header';
export default function PublicCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <div className='page-max-width'>{children}</div>
      </main>
    </>
  );
}
