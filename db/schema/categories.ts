import { createdAt, id } from '../schemaHelpers';
import { index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const categories = pgTable(
  'categories',
  {
    id: id,
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    parentId: uuid('parent_id'),
    createdAt: createdAt,
  },
  (table) => [index('categories_slug_idx').on(table.slug)],
);
