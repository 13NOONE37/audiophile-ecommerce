// Import global styles and fonts
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import '@/styles/globals.css';
import Header from './(public)/_components/header';
import Footer from './(public)/_components/footer';
import { LinkButton } from '@/components/button';
import Image from 'next/image';
import Waves from '@/public/images/shared/waves.svg';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className='w-full'>
        <div className='page-max-width my-24 relative overflow-hidden'>
          <Image
            src={Waves}
            alt='Soundwaves'
            className='absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 opacity-25'
          />
          <div className='h-full flex flex-col justify-center items-center relative z-10'>
            <span className='font-extrabold text-[120px] leading-[120px] md:text-[220px] md:leading-[220px] text-body'>
              404
            </span>
            <h1 className='heading-2  text-body uppercase'>Page not found</h1>
            <p className='text-content text-body text-center mt-1 md:mt-4'>
              The page you are looking for might have been removed,
              <br />
              had its name changed, or is temporarily unavailable.
              <br />
              Please check the URL or return to the homepage.
            </p>
            <LinkButton href='/' className='uppercase mt-6'>
              Back to home
            </LinkButton>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
