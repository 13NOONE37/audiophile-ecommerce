import { integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { products } from './products';
import { relations } from 'drizzle-orm';

export const productRecomendations = pgTable('product_recomendations', {
  id: id,
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  recommendedId: uuid('recommended_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  position: integer('position').default(0),

  createdAt: createdAt,
});

export const ProductRecomendationRelations = relations(
  productRecomendations,
  ({ one }) => ({
    product: one(products, {
      fields: [productRecomendations.productId],
      references: [products.id],
    }),
    recommended: one(products, {
      fields: [productRecomendations.recommendedId],
      references: [products.id],
    }),
  }),
);
