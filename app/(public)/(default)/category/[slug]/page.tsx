import { NewProductBadge } from '@/app/(public)/_components/newProductBadge';
import { ProductImage } from '@/components/ProductImage';
import { LinkButton } from '@/components/button';
import { db } from '@/db/db';
import { categories, productImages, products } from '@/db/schema';
import { getCategoryIdTag } from '@/features/categories/db/cache';
import { getCategoryIdProductsTag } from '@/features/products/db/cache';
import { cn } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { cacheTag } from 'next/cache';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const categories = await db.query.categories.findMany({
    columns: { slug: true },
  });

  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await getProductsForCategory(category.id);

  return (
    <>
      <div className='w-full grid place-items-center bg-body py-8 md:pt-21 md:pb-24.5 lg:py-24.5'>
        <h1 className='heading-2 text-body-inverted uppercase'>
          {category.name}
        </h1>
      </div>

      {products.length > 0 ? (
        <section className='page-max-width mt-16 md:mt-30 lg:mt-40'>
          <ul className='flex flex-col gap-30 lg:gap-40'>
            {products.map((product, index) => (
              <li
                key={product.id}
                className={cn(
                  'flex flex-col items-center gap-8 md:gap-13 lg:gap-31',
                  index % 2 == 0 ? 'lg:flex-row' : 'lg:flex-row-reverse',
                )}
              >
                <div
                  className='flex justify-center
                bg-surface-card 
                w-full lg:w-[540px] 
                aspect-654/704 md:aspect-[1378/704] lg:aspect-[1080/1120] 
                rounded-[8px] overflow-hidden'
                >
                  <ProductImage
                    product={product}
                    role='preview'
                    preload
                    className='object-fit h-full w-auto'
                  />
                </div>
                <div className='flex flex-col items-center lg:items-start'>
                  <NewProductBadge
                    isNew={product.is_new}
                    newUntil={product.new_until}
                    className='mb-6 md:mb-4'
                  />

                  <h2 className='heading-2 text-body uppercase text-center lg:text-start  whitespace-pre-wrap'>
                    {product.name}
                  </h2>
                  <p className='content-text text-body text-center lg:text-start max-w-[60ch] mt-6 md:mt-8'>
                    {product.description}
                  </p>
                  <LinkButton
                    variant='primary'
                    href={`/product/${product.slug}`}
                    className='uppercase mt-6 lg:mt-10'
                  >
                    See product
                  </LinkButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className='page-max-width grid place-items-center mt-44.5 md:mt-43 lg:mt-60'>
          <h2 className='heading-2 text-black text-center'>
            No products in this category yet
          </h2>
        </div>
      )}
    </>
  );
}

async function getCategory(slug: string) {
  'use cache';
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) return null;

  cacheTag(getCategoryIdTag(category.id));

  return category;
}

async function getProductsForCategory(categoryId: string) {
  'use cache';
  cacheTag(getCategoryIdProductsTag(categoryId));

  const productsList = await db.query.products.findMany({
    columns: {
      id: true,
      slug: true,
      name: true,
      is_new: true,
      new_until: true,
      description: true,
    },
    where: and(
      eq(products.categoryId, categoryId),
      eq(products.is_active, true),
    ),
    with: {
      images: {
        where: eq(productImages.role, 'preview'),
      },
    },
    orderBy: (products, { asc }) => [asc(products.createdAt)],
  });

  return productsList;
}
