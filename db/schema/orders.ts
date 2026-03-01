import { numeric, pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { orderItems } from './orderItems';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'failed',
  'shipped',
  'cancelled',
]);

export const orders = pgTable('orders', {
  id: id,
  orderNumber: text('order_number').notNull().unique(),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),

  // Delivery info
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone').notNull(),
  street: text('street').notNull(),
  houseNumber: text('house_number').notNull(),
  apartmentNumber: text('apartment_number'),
  zip: text('zip').notNull(),
  city: text('city').notNull(),
  region: text('region'),
  country: text('country').default('Polska').notNull(),
  notes: text('notes'),

  createdAt: createdAt,
});

export const OrderRelations = relations(orders, ({ one, many }) => ({
  items: many(orderItems, { relationName: 'order_items' }),
}));
