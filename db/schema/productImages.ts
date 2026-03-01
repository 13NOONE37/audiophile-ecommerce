import { integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { products } from './products';
import { productVariants } from './productVariants';

export const imageRoleEnum = pgEnum('image_role', [
  'main',
  'preview',
  'gallery',
  'cart',
]);
export const imageTypeEnum = pgEnum('image_type', [
  'desktop',
  'tablet',
  'mobile',
]);

export const productImages = pgTable('product_images', {
  id: id,
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id, {
    onDelete: 'cascade',
  }),
  path: text('path').notNull(),
  altText: text('alt_text'),
  role: imageRoleEnum('role').notNull().default('main'),
  type: imageTypeEnum('type').notNull().default('desktop'),
  position: integer('position').default(0),
  createdAt: createdAt,
});
