import { integer, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { products } from './products';
import { relations } from 'drizzle-orm';

export const productRecommendations = pgTable('product_recommendations', {
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

export const ProductRecommendationRelations = relations(
  productRecommendations,
  ({ one }) => ({
    product: one(products, {
      fields: [productRecommendations.productId],
      references: [products.id],
      relationName: 'productRecommendations',
    }),
    recommended: one(products, {
      fields: [productRecommendations.recommendedId],
      references: [products.id],
      relationName: 'recommendedProduct',
    }),
  }),
);
