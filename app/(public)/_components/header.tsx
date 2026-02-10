'use client';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/shared/desktop/logo.svg';
import IconHamburger from '@/icons/IconHamburger';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import IconCart from '@/icons/IconCart';
import Categories from './categories';
import { cn } from '@/lib/utils';
import { UseDetectOutsideClick } from '@/hooks/UseDetectOutsideClick';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const hamburgerRef = useRef(null);
  const handleHamburger = (e: MouseEvent<HTMLButtonElement>) => {
    setIsMenuOpen((prev) => !prev);
  };
  UseDetectOutsideClick(menuRef, () => {
    setIsMenuOpen(false);
  }, [hamburgerRef]);

  //? Code for blocking scroll while displaying menu
  // useEffect(() => {
  //   if (isMenuOpen) {
  //     document.body.classList.add('overflow-y-hidden', 'lg:overflow-y-auto');
  //   } else {
  //     document.body.classList.remove('overflow-y-hidden', 'lg:overflow-y-auto');
  //   }

  //   return () => {
  //     document.body.classList.remove('overflow-y-hidden', 'lg:overflow-y-auto');
  //   };
  // }, [isMenuOpen]);

  return (
    <>
      <header className='bg-surface-card-dark px-6 md:px-10 z-1000'>
        <div className='max-w-(--max-width) mx-auto grid grid-cols-[auto_1fr_auto] place-items-center py-8 relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-body-inverted before:opacity-20'>
          <button
            className='cursor-pointer lg:hidden'
            aria-label={'Open navigation'}
            onClick={handleHamburger}
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
          <div className=''>
            {/* {cart.items.length > 0 ? (
              <span className={styles.cartCount}>{cart.items.length}</span>
            ) : (
              ''
            )} */}
            <button
              className='cursor-pointer'
              // className={cx(styles.cart, {
              //   [styles.cart__disabled]: isMenuOpen,
              // })}
              aria-label={'Open cart'}
              // onClick={(e) => {
              //   e.stopPropagation();
              //   toggleCart(!showCart);
              // }}
            >
              <IconCart className='fill-body-inverted' />
            </button>
          </div>
        </div>
      </header>
      <div
        className={cn(
          'absolute w-full bottom-0 top-[91px] z-999 collapse overflow-auto transition-all duration-75 ease-in lg:hidden',
          isMenuOpen ? 'bg-body/40 visible' : 'hidden',
        )}
      >
        <nav
          // className={cn('lg:hidden', isMenuOpen ? 'visible' : 'hidden')}
          aria-hidden={isMenuOpen}
          ref={menuRef}
        >
          <Categories />
        </nav>
      </div>
      {/* <FocusTrap
        active={showCart}
        focusTrapOptions={{
          allowOutsideClick: true,
        }}
      >
        <CartModal showCart={showCart} ref={cartRef} />
      </FocusTrap>

      <FocusTrap
        active={isMenuOpen}
        focusTrapOptions={{
          allowOutsideClick: true,
        }}
      >
        <div
          className={cx(styles.mobileNavigationContainer, {
            [styles['mobileNavigationContainer__show']]: isMenuOpen,
          })}
        >
          <nav
            className={styles.mobileNavigation}
            aria-hidden={isMenuOpen}
            ref={menuRef}
          >
            <Categories className={styles.categories} />
          </nav>
        </div>
      </FocusTrap> */}
    </>
  );
}
// 'use client';
// import React, { FC, useContext, useEffect, useRef, useState } from 'react';
// import cx from 'classnames';
// import styles from './header.module.css';
// import Link from 'next/link';

// import Logo from '../../../public/images/shared/desktop/logo.svg';
// import Image from 'next/image';
// import IconHamburger from '@/icons/IconHamburger';
// import IconCart from '@/icons/IconCart';
// import Categories from '../categories/categories';
// import CartContext from '@/providers/cartProvider/cartProvider';
// import useDetectOutsideClick from '@/hooks/useDetectOutsideClick';
// import CartModal from './cartModal/cartModal';
// import FocusTrap from 'focus-trap-react';

// interface HeaderProps {
//   className?: string[];
// }
// const Header: FC<HeaderProps> = ({ className = [] }) => {
//   const cart = useContext(CartContext);

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [showCart, setShowCart] = useState(false);

//   const menuRef = useRef<HTMLDivElement>(null);
//   const cartRef = useRef<HTMLDivElement>(null);

//   const toggleMenu = (force: boolean) => {
//     setIsMenuOpen(force);
//   };
//   const toggleCart = (force: boolean) => {
//     setShowCart(force);
//   };

//   useDetectOutsideClick(menuRef, toggleMenu);
//   useDetectOutsideClick(cartRef, toggleCart);

//   return (
//     <>
//       <header className={cx(styles.header, ...className)}>
//         <div className={styles.content}>
//           <button
//             className={styles.hamburger}
//             aria-label={'Open navigation'}
//             onClick={(e) => {
//               e.stopPropagation();
//               toggleCart(false);
//               toggleMenu(!isMenuOpen);
//             }}
//           >
//             <IconHamburger />
//           </button>
//           <Link href={'/'} className={styles.logo} aria-label="Go to home page">
//             <Image src={Logo} alt={'Audiophile logo'} />
//           </Link>

//           <nav className={styles.navigation}>
//             <ul>
//               <li>
//                 <Link href={'/'}>Home</Link>
//               </li>
//               <li>
//                 <Link href={'/headphones'}>Headphones</Link>
//               </li>
//               <li>
//                 <Link href={'/speakers'}>Speakers</Link>
//               </li>
//               <li>
//                 <Link href={'/earphones'}>Earphones</Link>
//               </li>
//             </ul>
//           </nav>

//           <div className={styles.cartContainer}>
//             {cart.items.length > 0 ? (
//               <span className={styles.cartCount}>{cart.items.length}</span>
//             ) : (
//               ''
//             )}
//             <button
//               className={cx(styles.cart, {
//                 [styles.cart__disabled]: isMenuOpen,
//               })}
//               aria-label={'Open cart'}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleCart(!showCart);
//               }}
//             >
//               <IconCart />
//             </button>
//           </div>
//         </div>
//       </header>
//       <FocusTrap
//         active={showCart}
//         focusTrapOptions={{
//           allowOutsideClick: true,
//         }}
//       >
//         <CartModal showCart={showCart} ref={cartRef} />
//       </FocusTrap>

//       <FocusTrap
//         active={isMenuOpen}
//         focusTrapOptions={{
//           allowOutsideClick: true,
//         }}
//       >
//         <div
//           className={cx(styles.mobileNavigationContainer, {
//             [styles['mobileNavigationContainer__show']]: isMenuOpen,
//           })}
//         >
//           <nav
//             className={styles.mobileNavigation}
//             aria-hidden={isMenuOpen}
//             ref={menuRef}
//           >
//             <Categories className={styles.categories} />
//           </nav>
//         </div>
//       </FocusTrap>
//     </>
//   );
// };

// export default Header;
