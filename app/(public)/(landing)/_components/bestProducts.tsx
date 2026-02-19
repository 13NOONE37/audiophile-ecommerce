import { LinkButton } from '@/components/button';
import Image from 'next/image';

export function BestProducts() {
  return (
    <section className='flex flex-col gap-7.5 md:gap-8 lg:gap-12'>
      <PrimaryProduct />
      <SecondaryProduct />
      <TertiaryProduct />
    </section>
  );
}

function PrimaryProduct() {
  const altText =
    'Black speaker with a white horn tweeter at the top and a black woofer below. The sleek design conveys a modern, high-quality audio aesthetic.';
  const href = '/product/ZX9-speaker';

  return (
    <div
      className='bg-brand-primary rounded-[8px] overflow-hidden grid place-items-center lg:grid-cols-[auto_1fr] gap-8 
    md:gap-16 lg:gap-34.5 
    px-6 lg:pl-29.5
    py-14 md:pb-16 md:pt-13 lg:py-0
    bg-[url("/images/home/bestProducts/zx9-speaker/pattern-circles.svg")]
    bg-no-repeat
    bg-size-[558px_558px] md:bg-size-[944px_944px]
    bg-position-[center_-121px] md:bg-position-[center_-288px] lg:bg-position-[-149px_-36px]
    '
    >
      <div className='w-[172px] md:w-[197px] lg:w-[410px] h-full relative'>
        <picture>
          <source
            media='(max-width: 768px)'
            srcSet='/images/home/bestProducts/zx9-speaker/mobile.png'
          />
          <source
            media='(max-width: 1024px)'
            srcSet='/images/home/bestProducts/zx9-speaker/tablet.png'
          />

          <Image
            src='/images/home/bestProducts/zx9-speaker/desktop.png'
            alt={altText}
            width={756}
            height={918}
            placeholder='blur'
            blurDataURL='/images/home/bestProducts/zx9-speaker/blur.jpg'
            priority
            className='w-full h-auto lg:absolute -bottom-7.5'
          />
        </picture>
      </div>
      <div className='w-full flex flex-col items-center lg:items-start lg:mt-24 lg:mb-31'>
        <h2 className='heading-1 text-body-inverted mt-6 text-center lg:text-start'>
          ZX9 <br />
          SPEAKER
        </h2>
        <p className='content-text text-body-inverted/75 mt-6 text-center lg:text-left max-w-[35ch]'>
          Upgrade to premium speakers that are phenomenally built to deliver
          truly remarkable sound.
        </p>

        <LinkButton
          variant={'secondary'}
          href={href}
          className='mt-6 md:mt-10 uppercase'
        >
          See product
        </LinkButton>
      </div>
    </div>
  );
}
function SecondaryProduct() {
  const altText =
    'Black speaker on a dark table against a plain white wall. The image conveys a minimalist, modern aesthetic with a calm, serene tone.';
  const href = '/product/ZX7-speaker';

  //In this case when have exact crop as diffrent images and container is full width we can use diffrent approach let image decide about the height and content be absolute

  return (
    <div className='rounded-[8px] overflow-hidden relative'>
      <picture>
        <source
          media='(max-width: 768px)'
          srcSet='/images/home/bestProducts/zx7-speaker/mobile.jpg'
        />
        <source
          media='(max-width: 1024px)'
          srcSet='/images/home/bestProducts/zx7-speaker/tablet.jpg'
        />

        <Image
          src='/images/home/bestProducts/zx7-speaker/desktop.jpg'
          alt={altText}
          width={1110}
          height={320}
          placeholder='blur'
          blurDataURL='/images/home/bestProducts/zx7-speaker/blur.jpg'
          priority
          className='w-full'
        />
      </picture>

      <div className='absolute inset-0'>
        <div
          className='size-full flex flex-col items-start justify-center
         pl-6 md:pl-15.5 lg:pl-24'
        >
          <h2 className='heading-4 text-body mt-6'>ZX7 SPEAKER</h2>

          <LinkButton
            variant={'outline'}
            href={href}
            className='mt-8 uppercase'
          >
            See product
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
function TertiaryProduct() {
  const altText =
    'A pair of sleek, wireless earbuds rest inside a round charging case on a dark surface. The earbuds and case are stylish, conveying a modern, high-tech feel.';
  const href = '/product/YX1-earphones';

  return (
    <div
      className='h-full 
    grid 
    grid-rows-[1fr_1fr] md:grid-rows-none 
    md:grid-cols-[1fr_1fr] 
    gap-6 md:gap-3 lg:gap-7.5'
    >
      <div className='rounded-[8px] overflow-hidden relative'>
        <picture>
          <source
            media='(max-width: 768px)'
            srcSet='/images/home/bestProducts/yx1-earphones/mobile.jpg'
          />
          <source
            media='(max-width: 1024px)'
            srcSet='/images/home/bestProducts/yx1-earphones/tablet.jpg'
          />

          <Image
            src='/images/home/bestProducts/yx1-earphones/desktop.jpg'
            alt={altText}
            width={540}
            height={320}
            placeholder='blur'
            blurDataURL='/images/home/bestProducts/yx1-earphones/blur.jpg'
            priority
            className='w-full'
          />
        </picture>
      </div>

      <div
        className='rounded-[8px]
        bg-surface-card 
        size-full 
        flex flex-col 
        items-start justify-center
        pl-6 md:pl-15.5 lg:pl-24'
      >
        <h2 className='heading-4 text-body mt-6'>YX1 EARPHONES</h2>

        <LinkButton variant={'outline'} href={href} className='mt-8 uppercase'>
          See product
        </LinkButton>
      </div>
    </div>
  );
}
