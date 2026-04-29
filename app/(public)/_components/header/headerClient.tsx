'use client';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/shared/desktop/logo.svg';
import IconHamburger from '@/icons/IconHamburger';
import { useEffect, useRef, useState } from 'react';
import IconCart from '@/icons/IconCart';
import Categories from '../categories';
import { cn } from '@/lib/utils';
import { UseDetectOutsideClick } from '@/hooks/UseDetectOutsideClick';
import { FocusTrap } from 'focus-trap-react';
import CartModal from '../cartModal/cartModal';
import { blockBodyScroll, enableBodyScroll } from '@/lib/bodyScroll';
import { Cart } from '@/features/cart/lib/types/cart';

export default function HeaderClient({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  // Menu handling
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  UseDetectOutsideClick(menuRef, () => setIsMenuOpen(false), [hamburgerRef]);
  useEffect(() => {
    if (isMenuOpen) blockBodyScroll();
    else {
      enableBodyScroll();
    }

    return () => {
      enableBodyScroll();
    };
  }, [isMenuOpen]);

  // Cart handling
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
  const cartButtonRef = useRef<HTMLButtonElement | null>(null);
  UseDetectOutsideClick(cartRef, () => setIsCartOpen(false), [cartButtonRef]);
  useEffect(() => {
    if (isCartOpen) blockBodyScroll();
    else enableBodyScroll();

    return () => {
      enableBodyScroll();
    };
  }, [isCartOpen]);

  return (
    <>
      <FocusTrap
        active={isMenuOpen || isCartOpen}
        focusTrapOptions={{
          allowOutsideClick: true,
        }}
      >
        <div>
          <header
            className={cn('bg-surface-card-dark md:px-10 z-50', className)}
          >
            <div className='page-max-width md:px-0 grid grid-cols-[auto_1fr_auto] place-items-center py-8 relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-body-inverted before:opacity-20'>
              <button
                className='cursor-pointer lg:hidden'
                aria-label={'Open navigation'}
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                  setIsCartOpen(false);
                }}
                ref={hamburgerRef}
              >
                <IconHamburger className='fill-body-inverted' />
              </button>
              <Link
                href={'/'}
                className='md:place-self-start md:ml-10.5 lg:ml-0'
                aria-label='Go to home page'
              >
                <Image src={Logo} alt={'Audiophile logo'} />
              </Link>
              <nav className='hidden lg:block'>
                <ul className='flex gap-8.5 subtitle-text text-body-inverted uppercase'>
                  <li>
                    <Link href={'/'} className='hover:text-brand-primary'>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={'/category/headphones'}
                      className='hover:text-brand-primary'
                    >
                      Headphones
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={'/category/speakers'}
                      className='hover:text-brand-primary'
                    >
                      Speakers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={'/category/earphones'}
                      className='hover:text-brand-primary'
                    >
                      Earphones
                    </Link>
                  </li>
                </ul>
              </nav>
              <div className='grid place-items-center'>
                {/*TODO: {cart.items.length > 0 ? (
              <span className={styles.cartCount}>{cart.items.length}</span>
            ) : (
              ''
            )} */}
                <button
                  className='cursor-pointer'
                  aria-label={'Open cart'}
                  onClick={() => {
                    setIsCartOpen((prev) => !prev);
                    setIsMenuOpen(false);
                  }}
                  ref={cartButtonRef}
                >
                  <IconCart className='fill-body-inverted' />
                </button>
              </div>
            </div>
          </header>
          {/* Mobile menu */}
          <div
            className={cn(
              'fixed w-full bottom-0 top-[89px] z-40 collapse overflow-auto transition-all duration-75 ease-in lg:hidden',
              isMenuOpen ? 'bg-body/40 visible' : 'hidden',
            )}
          >
            <nav ref={menuRef}>
              <Categories
                className='px-6 md:px-9.5 pt-21 md:pt-27 pb-9 md:pb-17'
                onLinkClick={() => setIsMenuOpen(false)}
              />
            </nav>
          </div>

          {/* Cart modal */}
          <div
            className={cn(
              'fixed w-full bottom-0 top-[89px] z-40 collapse overflow-auto transition-all duration-75 ease-in',
              isCartOpen ? 'bg-body/40 visible' : 'hidden',
            )}
          >
            <div ref={cartRef}>{children}</div>
          </div>
        </div>
      </FocusTrap>
    </>
  );
}
