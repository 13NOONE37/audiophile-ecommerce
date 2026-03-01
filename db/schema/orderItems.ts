import { integer, numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { id } from '../schemaHelpers';
import { orders } from './orders';

export const orderItems = pgTable('order_items', {
  id: id,
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productNameSnapshot: text('product_name_snapshot').notNull(),
  skuSnapshot: text('sku_snapshot').notNull(),
  priceSnapshot: numeric('price_snapshot', {
    precision: 10,
    scale: 2,
  }).notNull(),
  quantity: integer('quantity').notNull(),
});
