import Header from '../_components/header';
import Hero from './_components/hero';

export default function PublicLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Hero />
      <main className='max-w-(--max-width) mx-auto px-6 md:px-10 box-content'>
        {children}
      </main>
    </>
  );
}
