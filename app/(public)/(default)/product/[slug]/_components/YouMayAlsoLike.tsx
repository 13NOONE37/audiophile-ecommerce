import { LinkButton } from '@/components/button';
import { productRecommendations, products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import Image from 'next/image';

type RecommendationWithProduct = InferSelectModel<
  typeof productRecommendations
> & {
  recommended: InferSelectModel<typeof products>;
};

export function YouMayAlsoLike({
  recommendations,
}: {
  recommendations: RecommendationWithProduct[];
}) {
  return (
    <section>
      <h2 className='heading-3 text-body uppercase'>You may also like</h2>
      <ul>
        {recommendations.map((rec) => (
          <li key={rec.recommended.id}>
            <div
              className='flex justify-center
                            bg-surface-card 
                            w-full lg:w-[540px] 
                            aspect-654/704 md:aspect-[1378/704] lg:aspect-[1080/1120] 
                            rounded-[8px] overflow-hidden'
            >
              <Image
                src='/images/products/zx7-speaker/default/preview/image-category-page-preview.jpg'
                alt={''}
                width={1080}
                height={1120}
                // placeholder='blur'
                // blurDataURL='/images/home/bestProducts/zx9-speaker/blur.jpg'
                priority
                className='object-fit h-full w-auto'
              />
            </div>
            {rec.recommended.name}
            <LinkButton
              href={`/product/${rec.recommended.slug}`}
              className='uppercase'
            >
              See Product
            </LinkButton>
          </li>
        ))}
      </ul>
    </section>
  );
}
