import Image from 'next/image';
const Outro = () => {
  return (
    <section className=''>
      <div
        className='flex 
      flex-col lg:flex-row-reverse 
      items-center 
      lg:justify-between 
      lg:gap-31  
      mx-auto'
      >
        <div
          className='w-full lg:w-135 
        rounded-[8px] 
        overflow-hidden'
        >
          <picture>
            <source
              media='(max-width:768px)'
              srcSet='/images/shared/outro/mobile.jpg'
            />
            <source
              media='(max-width: 1024px)'
              srcSet='/images/shared/outro/tablet.jpg'
            />

            <Image
              src='/images/shared/outro/desktop.jpg'
              alt='Man with headphones on his head propably listening to music.'
              width={540}
              height={588}
              placeholder='blur'
              blurDataURL='/images/shared/outro/blur.jpg'
              priority
              className='w-full h-auto'
            />
          </picture>
        </div>
        <div
          className='flex flex-col items-center lg:items-start
        mt-10 md:mt-17 lg:mt-0'
        >
          <h2
            className='heading-2 uppercase text-body 
          text-center lg:text-left 
          max-w-[15ch] md:max-w-[20ch]'
          >
            Bringing you the <span className='text-brand-primary'>best</span>{' '}
            audio gear
          </h2>
          <p
            className='content-text 
          text-body/50 
          text-center lg:text-left
           max-w-(--max-p-width) 
           mt-8'
          >
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
