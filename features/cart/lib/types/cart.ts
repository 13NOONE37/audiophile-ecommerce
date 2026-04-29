import { findCartWithItems } from '../../db/carts';

export type Cart = NonNullable<Awaited<ReturnType<typeof findCartWithItems>>>;

export type CartItems = Cart['items'];

export type CartOptimisticAction =
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'CLEAR' };
