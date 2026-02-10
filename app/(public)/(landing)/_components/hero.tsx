import Image from 'next/image';
import Header from '../../_components/header';
import styles from './homeHero/homeHero.module.css';
const Hero = () => {
  //? naprawić overflow - trzeba zmienić strukturę ponieważ aktualnie zasłania nam menu kontekstowe; trzeba będzie prawdopodbnie przenieść background do własnej sekcji która będzie zajmowała 100% przestrzeni i miała overflow hidden a header i teksty będą w osobnych
  //? pozycja bg na ekranach
  //? pozycja tekstu
  //? 2 warianty komponentu see product wraz z animacjami
  return (
    <div className='bg-surface-card-dark relative overflow-hidden'>
      <div
        className='absolute 
      left-1/2 -translate-x-1/2
      top-3.5 md:-top-9.5
      min-w-full 
      w-[577px] md:w-[768px] lg:w-[708px] 
      aspect-[4/5]
      opacity-50
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
      <Header className='bg-transparent' />

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
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </p>
          <button className='mt-7 md:mt-10 bg-brand-primary p-4'>
            SEE PRODUCT
          </button>
          {/* <LinkButton
            style={'primary'}
            href={'/product/xx99-mark-II-headphones'}
            additionalClassnames={[styles.cta]}
          >
            See product
          </LinkButton> */}
        </div>
      </section>
    </div>
  );
};

export default Hero;
