import { Button, LinkButton } from '@/components/button';
import { db } from '@/db/db';
import { categories, productImages, products } from '@/db/schema';
import { getCategoryIdTag } from '@/features/categories/db/cache';
import { getCategoryIdProductsTag } from '@/features/products/db/cache';
import { cn } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { cacheTag } from 'next/cache';
import Image from 'next/image';
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
  if (!category) {
    notFound();
  }

  const products = await getProductsForCategory(category.id);
  //TODO add new until functionality (we need to modify database again)
  //TODO add blur field in images but we will be pasting it to database not seperate file a lot of easier to handle
  return (
    <>
      <div className='w-full grid place-items-center bg-body py-8 md:pt-21 md:pb-24.5 lg:py-24.5'>
        <h1 className='heading-2 text-body-inverted uppercase'>
          {category.name}
        </h1>
      </div>
      <section className='max-w-(--max-width) mx-auto px-6 md:px-10 mt-16 md:mt-30 lg:mt-40 box-content'>
        <ul className='flex flex-col gap-30 lg:gap-40'>
          {products.map((product, index) => (
            <li
              key={product.id}
              className={cn(
                'flex flex-col items-center gap-8 md:gap-13 lg:gap-31',
                index % 2 == 0 ? 'lg:flex-row' : 'lg:flex-row-reverse',
              )}
            >
              <div className='relative w-full lg:w-[540px] aspect-654/704 md:aspect-[1378/704] lg:aspect-[1080/1120] rounded-[8px] overflow-hidden'>
                <picture>
                  <source
                    media='(max-width: 768px)'
                    srcSet='/images/products/zx7-speaker/default/mobile/image-category-page-preview.jpg'
                  />
                  <source
                    media='(max-width: 1024px)'
                    srcSet='/images/products/zx7-speaker/default/tablet/image-category-page-preview.jpg'
                  />

                  <Image
                    src='/images/products/zx7-speaker/default/desktop/image-category-page-preview.jpg'
                    alt={''}
                    fill
                    // placeholder='blur'
                    // blurDataURL='/images/home/bestProducts/zx9-speaker/blur.jpg'
                    priority
                    className='object-cover'
                  />
                </picture>
              </div>
              <div className='flex flex-col items-center lg:items-start'>
                <span className='overline-text text-brand-primary font-normal uppercase'>
                  New product
                </span>
                <h2 className='heading-2 text-body uppercase mt-6 md:mt-4'>
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
      description: true,
    },
    where: and(
      eq(products.categoryId, categoryId),
      eq(products.is_active, true),
    ),
    with: {
      images: {
        where: eq(productImages.role, 'main'), //Only main photos
        columns: {
          altText: true,
          path: true,
        },
      },
    },
    orderBy: (products, { asc }) => [asc(products.createdAt)],
  });

  return productsList;
}
