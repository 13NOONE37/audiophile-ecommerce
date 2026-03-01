import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { products } from './products';

export const productVariants = pgTable(
  'product_variants',
  {
    id: id,
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: text('sku').notNull().unique(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').default(0).notNull(),
    attributes: jsonb('attributes'),
    createdAt: createdAt,
  },
  (table) => [
    index('variants_product_idx').on(table.productId),
    index('variants_sku_idx').on(table.sku),
  ],
);
