import { LinkButton } from '@/components/button';
import { ProductImage, ProductWithImages } from '@/components/ProductImage';
import { productRecommendations, products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type RecommendedProduct = Pick<
  InferSelectModel<typeof products>,
  'id' | 'name' | 'short_name' | 'slug'
> &
  ProductWithImages;

type RecommendationWithProduct = InferSelectModel<
  typeof productRecommendations
> & {
  recommended: RecommendedProduct;
};

export function YouMayAlsoLike({
  recommendations,
}: {
  recommendations: RecommendationWithProduct[];
}) {
  return (
    <section>
      <h2 className='heading-3 text-body uppercase text-center'>
        You may also like
      </h2>
      <ul
        className='grid  
      md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
      gap-14 md:gap-3 lg:gap-7.5 
      mt-10 md:mt-14 lg:mt-16'
      >
        {recommendations.map((rec) => (
          <li key={rec.recommended.id} className='flex flex-col items-center'>
            <div
              className='flex justify-center
              bg-surface-card
              aspect-[2.725/1] md:aspect-[1/1.426] lg:aspect-[1.10/1] 
              rounded-[8px] overflow-hidden'
            >
              <ProductImage
                product={rec.recommended}
                role='preview'
                className='object-contain h-full w-auto'
              />
            </div>
            <span className='heading-5 text-body uppercase mt-7.5 md:mt-10'>
              {rec.recommended.short_name || rec.recommended.name}
            </span>
            <LinkButton
              href={`/product/${rec.recommended.slug}`}
              className='uppercase mt-7.5'
            >
              See Product
            </LinkButton>
          </li>
        ))}
      </ul>
    </section>
  );
}
