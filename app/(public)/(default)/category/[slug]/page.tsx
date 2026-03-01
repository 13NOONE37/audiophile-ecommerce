import { db } from '@/db/db';
import { categories, productImages, products } from '@/db/schema';
import { getCategoryIdTag } from '@/features/categories/db/cache';
import { getCategoryIdProductsTag } from '@/features/products/db/cache';
import { eq } from 'drizzle-orm';
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
  if (!category) {
    notFound();
  }

  const products = await getProductsForCategory(category.id);

  return (
    <div>
      <h1 className='bg-body w-full text-heading-2 text-body-inverted uppercase'>
        {category.name}
      </h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
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
    where: eq(products.categoryId, categoryId),
    with: {
      images: {
        where: eq(productImages.role, 'main'), //Only main photos
        columns: {
          altText: true,
          path: true,
        },
      },
    },
  });

  return productsList;
}
