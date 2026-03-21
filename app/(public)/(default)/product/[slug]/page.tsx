import { db } from '@/db/db';
import { products } from '@/db/schema';
import { getProductIdTag } from '@/features/products/db/cache';
import { eq } from 'drizzle-orm';
import { cacheTag } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetails } from './_components/productDetails';
import Image from 'next/image';
import { NewProductBadge } from '@/app/(public)/_components/newProductBadge';
import { Button } from '@/components/button';
import { formatPrice } from '@/lib/formatters';
import { ProductGallery } from './_components/productGallery';

export async function generateStaticParams() {
  const allProducts = await db.query.products.findMany({
    columns: { slug: true },
    where: eq(products.is_active, true),
  });

  return allProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProduct(slug);
  if (!product) notFound();

  //We do not support variants yet, so we can just take the price from the first variant, but in the future we will need to create state here that will decide which information display depends on variant
  const currentVariantIndex = 0;
  return (
    <div className='max-w-(--max-width) mx-auto px-6 md:px-10 box-content mt-4 md:mt-8.5 lg:mt-20'>
      <Link
        href={product.category ? `/category/${product.category.slug}` : '/'}
        className='content-text text-body/50'
      >
        Go Back
      </Link>
      <section className='grid md:grid-cols-[1fr_auto] lg:grid-cols-[540px_1fr] md:place-items-center gap-8 md:gap-17.5 lg:gap-31 mt-6 lg:mt-14'>
        <div className='md:min-w-[280px] md:aspect-280/480 lg:aspect-auto grid place-items-center rounded-[8px] overflow-hidden bg-surface-card'>
          <Image
            src={
              '/images/products/zx7-speaker/default/desktop/image-product.jpg'
            }
            alt={product.name}
            width={1080}
            height={1120}
          />
        </div>
        <div className='flex flex-col'>
          <NewProductBadge
            isNew={product.is_new}
            newUntil={product.new_until}
            className='mb-6 md:mb-4'
          />
          <h1 className='heading-2 text-body whitespace-pre-line'>
            {product.name}
          </h1>
          <p className='content-text text-body mt-6 md:mt-8 max-w-[60ch] whitespace-pre-line'>
            {product.description}
          </p>
          <span className='heading-6 text-body text-[18px] mt-6 md:mt-8'>
            {formatPrice(Number(product.variants[currentVariantIndex].price))}
          </span>
          <div className='flex flex-row justify-start gap-4 mt-8 lg:mt-12'>
            <Button variant='secondary' className='uppercase'>
              - 0 +
            </Button>
            <Button variant='primary' className='uppercase'>
              Add to cart
            </Button>
          </div>
        </div>
      </section>
      <div className='mt-22 md:mt-30 lg:mt-40'>
        <ProductDetails
          features={product.features}
          inTheBox={product.inTheBox}
        />
      </div>

      <div className='mt-22 md:mt-30 lg:mt-40'>
        <ProductGallery />
      </div>
      <div className='mt-22 md:mt-30 lg:mt-40'>
        {/* TODO: Implement "you may also like" section */}
        <section>you may also like</section>
      </div>
    </div>
  );
}

async function getProduct(slug: string) {
  'use cache';
  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      name: true,
      description: true,
      features: true,
      inTheBox: true,
      is_new: true,
      new_until: true,
    },
    where: eq(products.slug, slug),
    with: {
      category: true,
      images: true,
      variants: true,
    },
  });

  if (!product) return null;

  cacheTag(getProductIdTag(product.id));

  return product;
}
