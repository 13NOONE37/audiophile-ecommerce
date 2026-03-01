import { numeric, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { orders } from './orders';

export const payments = pgTable('payments', {
  id: id,
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(), // "przelewy24"
  providerTransactionId: text('provider_transaction_id'),
  status: text('status').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: createdAt,
});
