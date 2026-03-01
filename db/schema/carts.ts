import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';

export const carts = pgTable('carts', {
  id: id,
  createdAt: createdAt,
  expiresAt: timestamp('expires_at'),
});
