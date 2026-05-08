import { numeric, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { orderItems } from './orderItems';
import { timestamp } from 'drizzle-orm/pg-core';

const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'failed',
  'shipped',
  'cancelled',
]);
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  SHIPPED: 'shipped',
  CANCELLED: 'cancelled',
} as const;
export const orders = pgTable('orders', {
  id: id,
  orderNumber: text('order_number').notNull().unique(),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  confirmationToken: uuid('confirmation_token').notNull().defaultRandom(),
  confirmationTokenExpiresAt: timestamp('confirmation_token_expires_at', {
    withTimezone: true,
  })
    .notNull()
    .default(new Date(Date.now() + 60 * 60 * 1000)), //1 hour

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
  items: many(orderItems),
}));
