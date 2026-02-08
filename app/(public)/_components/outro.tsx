import React, { FC } from 'react';

import styles from './outro.module.css';

import ImageMobile from '@/public/images/shared/mobile/image-best-gear.jpg';
import ImageTablet from '@/public/images/shared/tablet/image-best-gear.jpg';
import ImageDesktop from '@/public/images/shared/desktop/image-best-gear.jpg';
import Image, { getImageProps } from 'next/image';

const Outro = () => {
  return (
    <section className='px-6'>
      <div className='flex flex-col items-center justify-start mx-auto'>
        <div className='w-50 relative'>
          <picture>
            <source
              media='(max-width: 640px)'
              srcSet='/images/shared/outro/mobile.jpg'
            />
            <source
              media='(max-width: 1024px)'
              srcSet='/images/shared/outro/tablet.jpg'
            />

            <Image
              src='/images/shared/outro/desktop.jpg'
              alt='Man with headphones on his head propably listening to music.'
              width={1600}
              height={900}
              placeholder='blur'
              blurDataURL='/images/shared/outro/blur.jpg'
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </picture>
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.heading}>
            Bringing you the <span>best</span> audio gear
          </h2>
          <p className={styles.text}>
            Located at the heart of New York City, Audiophile is the premier
            store for high end headphones, earphones, speakers, and audio
            accessories. We have a large showroom and luxury demonstration rooms
            available for you to browse and experience a wide range of our
            products. Stop by our store to meet some of the fantastic people who
            make Audiophile the best place to buy your portable audio equipment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Outro;
