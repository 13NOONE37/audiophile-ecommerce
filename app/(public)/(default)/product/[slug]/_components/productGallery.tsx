import { ProductImage, ProductWithImages } from '@/components/ProductImage';
import Image from 'next/image';

export function ProductGallery({ product }: { product: ProductWithImages }) {
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
        <ProductImage
          product={product}
          role='gallery'
          position={0}
          fill
          className='object-cover'
        />
      </div>
      <div
        className='relative w-full
        col-1 row-2
      rounded-[8px] overflow-hidden'
      >
        <ProductImage
          product={product}
          role='gallery'
          position={1}
          fill
          className='object-cover'
        />
      </div>
      <div
        className='relative w-full 
        md:col-2 md:row-span-2 
      rounded-[8px] overflow-hidden'
      >
        <ProductImage
          product={product}
          role='gallery'
          position={2}
          fill
          className='object-cover'
        />
      </div>
    </section>
  );
}
