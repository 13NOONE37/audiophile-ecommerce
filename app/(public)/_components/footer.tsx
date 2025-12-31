import Link from 'next/link';

import Logo from '../../../public/images/shared/desktop/logo.svg';
import IconFacebook from '@/icons/IconFacebook';
import IconTwitter from '@/icons/IconTwitter';
import IconInstagram from '@/icons/IconInstagram';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='px-6 md:px-10  bg-surface-card-dark'>
      <div
        className={`grid md:grid-cols-2 lg:grid-cols-[1fr_1fr] place-items-center md:place-items-start gap-12 mg:gap-0 max-w-[var(--max-width)] mx-auto 
      relative before:absolute before:w-[101px] before:h-[4px] before:bg-brand-primary before:top-0 before:left-[50%] before:translate-x-[-50%] before:md:left-0 before:md:translate-x-0
      pb-9 md:pb-11.5 lg:pb-12 pt-13 md:pt-15 lg:pt-18.5
      `}
      >
        <Link href={'/'}>
          <Image src={Logo} alt={'Audiophile site logo'} />
        </Link>

        <nav className='md:col-span-2 lg:col-2 lg:place-self-end'>
          <ul className='flex flex-col md:flex-row place-items-center gap-4 md:gap-8.5 subtitle-text uppercase text-body-inverted'>
            <li>
              <Link href={'/'} className='hover:text-brand-primary'>
                Home
              </Link>
            </li>
            <li>
              <Link href={'/headphones'} className='hover:text-brand-primary'>
                Headphones
              </Link>
            </li>
            <li>
              <Link href={'/speakers'} className='hover:text-brand-primary'>
                Speakers
              </Link>
            </li>
            <li>
              <Link href={'/earphones'} className='hover:text-brand-primary'>
                Earphones
              </Link>
            </li>
          </ul>
        </nav>
        <p className='md:col-span-2 max-w-[75ch] md:max-w-none lg:max-w-[75ch] content-text text-center md:text-left text-body-inverted opacity-50'>
          Audiophile is an all in one stop to fulfill your audio needs.
          We&apos;re a small team of music lovers and sound specialists who are
          devoted to helping you get the most out of personal audio. Come and
          visit our demo facility - we&apos;re open 7 days a week.
        </p>
        <span className='md:col-1 content-text text-body-inverted opacity-50'>
          Copyright 2021. All Rights Reserved
        </span>
        <ul className='md:col-2 justify-self-end flex place-items-center gap-4'>
          <li>
            <a
              href={'https://www.facebook.com/'}
              target={'_blank'}
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <IconFacebook className='fill-body-inverted hover:fill-brand-primary' />
            </a>
          </li>
          <li>
            <a
              href={'twitter.com'}
              target={'_blank'}
              rel='noopener noreferrer'
              aria-label='Twitter'
            >
              <IconTwitter className='fill-body-inverted hover:fill-brand-primary' />
            </a>
          </li>
          <li>
            <a
              href={'instagram.com'}
              target={'_blank'}
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <IconInstagram className='fill-body-inverted hover:fill-brand-primary' />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
