import { index, integer, pgTable, unique, uuid } from 'drizzle-orm/pg-core';
import { id } from '../schemaHelpers';
import { carts } from './carts';
import { productVariants } from './productVariants';
import { relations } from 'drizzle-orm';

export const cartItems = pgTable(
  'cart_items',
  {
    id: id,
    cartId: uuid('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    variantId: uuid('variant_id')
      .notNull()
      .references(() => productVariants.id),
    quantity: integer('quantity').notNull(),
  },
  (table) => [
    index('cart_items_cart_idx').on(table.cartId),
    unique('cart_items_variant_cart_unique').on(table.cartId, table.variantId), //They need to be unique together cartId-variantId, so we can easily modify quantity in insertCartitem
  ],
);

export const CartItemRelations = relations(cartItems, ({ one, many }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));
