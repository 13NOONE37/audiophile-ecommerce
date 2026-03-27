import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { products } from './products';
import { relations } from 'drizzle-orm';

export const productVariants = pgTable(
  'product_variants',
  {
    id: id,
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 12 }).notNull().unique(), //We will write it as zx9-II_BLK "_" will be used as separator
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
export const ProductVariantRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);
