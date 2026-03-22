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
      <main className='page-max-width'>{children}</main>
    </>
  );
}
