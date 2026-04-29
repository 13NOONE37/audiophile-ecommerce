import Categories from '../_components/categories';
import Header from '../_components/header/header';
import Outro from '../_components/outro';
export default function PublicDefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        {children}

        <div className='page-max-width'>
          <div className='mt-44.5 md:mt-43 lg:mt-60'>
            <Categories />
          </div>
          <div className='mb-30 md:mb-24 lg:mb-50 mt-24 md:mt-30 lg:mt-50'>
            <Outro />
          </div>
        </div>
      </main>
    </>
  );
}
