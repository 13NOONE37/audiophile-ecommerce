import Link from 'next/link';

import Logo from '../../../public/images/shared/desktop/logo.svg';
import IconFacebook from '@/icons/IconFacebook';
import IconTwitter from '@/icons/IconTwitter';
import IconInstagram from '@/icons/IconInstagram';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className='px-6 bg-surface-card-dark'>
      <div className='max-w-(max-width) mx-auto'>
        <Image src={Logo} alt={'Audiophile site logo'} />

        <nav>
          <ul>
            <li>
              <Link href={'/'}>Home</Link>
            </li>
            <li>
              <Link href={'/headphones'}>Headphones</Link>
            </li>
            <li>
              <Link href={'/speakers'}>Speakers</Link>
            </li>
            <li>
              <Link href={'/earphones'}>Earphones</Link>
            </li>
          </ul>
        </nav>
        <p>
          Audiophile is an all in one stop to fulfill your audio needs.
          We&apos;re a small team of music lovers and sound specialists who are
          devoted to helping you get the most out of personal audio. Come and
          visit our demo facility - we&apos;re open 7 days a week.
        </p>
        <span>Copyright 2021. All Rights Reserved</span>
        <ul>
          <li>
            <a
              href={'https://www.facebook.com/'}
              target={'_blank'}
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <IconFacebook />
            </a>
          </li>
          <li>
            <a
              href={'twitter.com'}
              target={'_blank'}
              rel='noopener noreferrer'
              aria-label='Twitter'
            >
              <IconTwitter />
            </a>
          </li>
          <li>
            <a
              href={'instagram.com'}
              target={'_blank'}
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <IconInstagram />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
