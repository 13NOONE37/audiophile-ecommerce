import { pgTable, timestamp } from 'drizzle-orm/pg-core';
import { createdAt, id } from '../schemaHelpers';
import { relations } from 'drizzle-orm';
import { cartItems } from './cartItems';

//TODO  We are cleaning carts after 72hours, in edge funcitons in database
//TODO for better patttern we could add updatedAt field and expire after 72h if no updates
export const carts = pgTable('carts', {
  id: id,
  createdAt: createdAt,
  expiresAt: timestamp('expires_at'),
});

export const CartRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));
