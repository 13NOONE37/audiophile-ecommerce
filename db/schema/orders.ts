import {
  numeric,
  pgEnum,
  pgSequence,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { relations, sql } from 'drizzle-orm';
import { orderItems } from './orderItems';
import { timestamp } from 'drizzle-orm/pg-core';

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  SHIPPED: 'shipped',
  CANCELLED: 'cancelled',
} as const;

const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'failed',
  'shipped',
  'cancelled',
]);
export const orderSeq = pgSequence('order_seq');

export const orders = pgTable('orders', {
  id: id,
  orderNumber: text('order_number').notNull().unique().default(sql`
    'ORD-' ||
    lpad(nextval('order_seq')::text, 6, '0')
  `),
  stripeSessionId: text('stripe_session_id'),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  confirmationToken: uuid('confirmation_token').notNull().defaultRandom(),
  confirmationTokenExpiresAt: timestamp('confirmation_token_expires_at', {
    withTimezone: true,
  })
    .notNull()
    .default(sql`now() + interval '2 days'`), //2 days

  // Delivery info
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  zip: text('zip').notNull(),
  city: text('city').notNull(),
  country: text('country').default('Polska').notNull(),

  createdAt: createdAt,
});

export const OrderRelations = relations(orders, ({ one, many }) => ({
  items: many(orderItems),
}));
