import { FC } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import HeadphonesImage from '@/public/images/shared/desktop/image-category-thumbnail-headphones.png';
import SpeakersImage from '@/public/images/shared/desktop/image-category-thumbnail-speakers.png';
import EarphonesImage from '@/public/images/shared/desktop/image-category-thumbnail-earphones.png';
import IconArrowRight from '@/icons/IconArrowRight';
import { cn } from '@/lib/utils';

const Categories = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        'bg-body-inverted px-6 md:px-9.5 pt-21 md:pt-27 pb-9 md:pb-17',
        className,
      )}
    >
      <div className='flex flex-col justify-start items-center md:grid md:grid-cols-[1fr_1fr_1fr] gap-17 md:gap-2.5 max-w-[var(--max-width)] mx-auto'>
        <Card
          src={HeadphonesImage}
          alt={'Headphones'}
          name='Headphones'
          href='/headphones'
        />
        <Card
          src={SpeakersImage}
          alt={'Speakers'}
          name='Speakers'
          href='/speakers'
        />
        <Card
          src={EarphonesImage}
          alt={'Earphones'}
          name='Earphones'
          href='/earphones'
        />
      </div>
    </section>
  );
};
export default Categories;

const Card: FC<{
  src: StaticImageData;
  alt: string;
  name: string;
  href: string;
}> = ({ src, alt, name, href }) => {
  return (
    <Link
      href={href}
      className='relative
      bg-surface-card rounded-[10px]
    w-full md:w-auto
    flex flex-col justify-end items-center
    gap-4.25 lg:gap-3.75
    pb-5.5 lg:pb-7.5 
    pt-22
    no-underline outline-none
    group'
    >
      <div
        className=' absolute left-1/2 top-0
    -translate-x-1/2 -translate-y-[40%]
    h-[140px]
    transition-all duration-300 ease-in-out
    group-hover:-translate-y-[35%]
    group-focus:-translate-y-[35%]
    lg:h-[204px]
    '
      >
        <Image src={src} alt={alt} className='h-full w-full object-contain' />
      </div>
      <span className='heading-6 text-body uppercase'>{name}</span>
      <span
        className='flex items-center gap-3.25
    no-underline outline-none'
      >
        <span
          className='subtitle-text text-body opacity-50
    transition-all duration-300
    group-hover:text-[var(--primary)]
    group-hover:opacity-100
    group-focus:text-[var(--primary)]
    group-focus:opacity-100
    group-focus:underline
    decoration-[var(--primary)]
    decoration-2'
        >
          Shop
        </span>
        <IconArrowRight />
      </span>
    </Link>
  );
};
