import { integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { products } from './products';
import { productVariants } from './productVariants';

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
  position: integer('position').default(0),
  createdAt: createdAt,
});
