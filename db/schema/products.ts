import { updatedAt } from './../schemaHelpers';
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { categories } from './categories';
import { productImages } from './productImages';
import { relations } from 'drizzle-orm';
import { productVariants } from './productVariants';

export const products = pgTable(
  'products',
  {
    id: id,
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    features: text('features'),
    inTheBox: jsonb('in_the_box').$type<
      {
        quantity: number;
        label: string;
      }[]
    >(),
    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),
    is_new: boolean('is_new').default(false).notNull(),
    new_until: timestamp('new_until', { withTimezone: true }),
    is_active: boolean('is_active').default(true).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt,
  },
  (table) => [index('products_slug_idx').on(table.slug)],
);

export const ProductRelations = relations(products, ({ one, many }) => ({
  images: many(productImages),
  variants: many(productVariants),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
