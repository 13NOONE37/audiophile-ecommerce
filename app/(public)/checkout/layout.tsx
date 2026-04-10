import Footer from '../_components/footer';
import Header from '../_components/header';
import { CartContent } from '../_components/cartModal/CartContent';
import { Suspense } from 'react';
export default function PublicCheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        cartContent={
          <Suspense>
            <CartContent />
          </Suspense>
        }
      />
      <main>
        <div className='page-max-width'>{children}</div>
      </main>
    </>
  );
}
