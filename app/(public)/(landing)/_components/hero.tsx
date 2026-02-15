import Image from 'next/image';
import Header from '../../_components/header';
import styles from './homeHero/homeHero.module.css';
import { Button } from '@/components/button';
const Hero = () => {
  //? naprawić overflow - trzeba zmienić strukturę ponieważ aktualnie zasłania nam menu kontekstowe; trzeba będzie prawdopodbnie przenieść background do własnej sekcji która będzie zajmowała 100% przestrzeni i miała overflow hidden a header i teksty będą w osobnych
  //? pozycja bg na ekranach
  return (
    <div className='bg-[#131313] relative'>
      {/* Background image⬇️ */}
      <div className='inset-0 absolute overflow-hidden'>
        <div className='size-full max-w-[1198px] mx-auto relative'>
          <div
            className='absolute 
      left-1/2 lg:left-auto 
      lg:right-0
      -translate-x-1/2 lg:translate-x-0
      -top-3.5 md:-top-9.5 lg
      w-[577px] md:w-[768px] lg:w-[708px] 
      aspect-4/5
      '
          >
            <Image
              src='/images/home/hero/desktop.jpg'
              alt='Black headphones model - XX99 Mark II Headphones'
              fill
              placeholder='blur'
              blurDataURL='/images/home/hero/blur.jpg'
              priority
              className='object-cover'
            />
          </div>
        </div>
      </div>

      {/* Header⬇️ */}
      <Header className='bg-transparent' />

      {/* Content⬇️ */}
      <div className='max-w-(--max-width) mx-auto px-6 md:px-10 box-content relative'>
        <HeroContent />
      </div>
    </div>
  );
};

export default Hero;

function HeroContent() {
  return (
    <section className='relative'>
      {/* <div
          className='w-full lg:w-135 
               rounded-lg 
               overflow-hidden'
        >
          <picture>
            <source
              media='(max-width:768px)'
              srcSet='/images/home/hero/mobile.jpg'
            />
            <source
              media='(max-width: 1024px)'
              srcSet='/images/home/hero/tablet.jpg'
            />

            <Image
              src='/images/home/hero/desktop.jpg'
              alt='Black headphones model - XX99 Mark II Headphones'
              width={708}
              height={886}
              placeholder='blur'
              blurDataURL='/images/home/hero/blur.jpg'
              priority
              // style={{ width: '100%', height: 'auto' }}
            />
          </picture>
        </div> */}
      <div
        className='flex flex-col 
          items-center lg:items-start
          pt-27 md:pt-31.5 lg:pt-32
          pb-28 md:pb-42 lg:pb-39.5
          '
      >
        <span
          className='overline-text font-normal uppercase text-body-inverted/50 
            text-center lg:text-left'
        >
          New product
        </span>
        <h1
          className='heading-1 uppercase text-body-inverted 
            text-center lg:text-left
            mt-4 md:mt-6
            '
        >
          XX99 Mark II
          <br /> Headphones
        </h1>
        <p
          className='content-text text-body-inverted/75 
              max-w-[40ch]
            text-center lg:text-left
            mt-6'
        >
          Experience natural, lifelike audio and exceptional build quality made
          for the passionate music enthusiast.
        </p>
        <Button variant='primary' className='uppercase mt-7 md:mt-10'>
          See product
        </Button>
        {/* <LinkButton
            style={'primary'}
            href={'/product/xx99-mark-II-headphones'}
            additionalClassnames={[styles.cta]}
          >
            See product
          </LinkButton> */}
      </div>
    </section>
  );
}
