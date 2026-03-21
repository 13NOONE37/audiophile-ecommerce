import Image from 'next/image';

export function ProductGallery() {
  return (
    <section
      className='aspect-[327/756] md:aspect-[690/368] lg:aspect-[1110/592] 
    grid 
    grid-rows-[25%_25%_50%] md:grid-rows-[1fr_1fr]
    md:grid-cols-[40%_60%]  
    gap-5 md:gap-x-4.5 lg:gap-x-7.5 lg:gap-y-8'
    >
      <div
        className='relative w-full 
        col-1 row-1
      rounded-[8px] overflow-hidden'
      >
        <Image
          src={
            '/images/products/zx7-speaker/default/gallery/image-gallery-1.jpg'
          }
          alt={''}
          fill
          className='object-cover'
        />
      </div>
      <div
        className='relative w-full
        col-1 row-2
      rounded-[8px] overflow-hidden'
      >
        <Image
          src={
            '/images/products/zx7-speaker/default/gallery/image-gallery-2.jpg'
          }
          fill
          alt={''}
          className='object-cover'
        />
      </div>
      <div
        className='relative w-full 
        md:col-2 md:row-span-2 
      rounded-[8px] overflow-hidden'
      >
        <Image
          src={
            '/images/products/zx7-speaker/default/gallery/image-gallery-3.jpg'
          }
          fill
          alt={''}
          className='object-cover'
        />
      </div>
    </section>
  );
}
