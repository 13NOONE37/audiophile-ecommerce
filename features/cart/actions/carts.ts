'use server';

import {
  addToCartDB,
  clearCartItemsDB,
  getCartItemsDB,
  removeCartItemDB,
  setCartItemQuantityDB,
} from '../db/carts';
import { addToCartSchema, setCartItemQuantitySchema } from '../schemas/carts';

export async function addToCart(
  unsafeVariantId: unknown,
  unsafeQuantity: unknown,
) {
  const parsed = addToCartSchema.safeParse({
    variantId: unsafeVariantId,
    quantity: unsafeQuantity,
  });

  if (!parsed.success) {
    return { error: true, message: 'Invalid cart payload' };
  }

  const { variantId, quantity } = parsed.data;

  await addToCartDB(variantId, quantity);

  return { error: false };
}

export async function getCartItems() {
  return await getCartItemsDB();
}
export type CartItemsWithDetails = NonNullable<
  Awaited<ReturnType<typeof getCartItemsDB>>
>;

export async function setCartItemQuantity(
  unsafeCartItemId: unknown,
  unsafeQuantity: unknown,
) {
  const parsed = setCartItemQuantitySchema.safeParse({
    cartItemId: unsafeCartItemId,
    quantity: unsafeQuantity,
  });

  if (!parsed.success)
    return { error: true, message: 'Invalid quantity payload' };

  const { cartItemId, quantity } = parsed.data;
  if (quantity === 0) {
    await removeCartItemDB(cartItemId);
    return { error: false };
  }
  const success = await setCartItemQuantityDB(cartItemId, quantity);

  if (!success) {
    return { error: true, message: 'Cart item not found' };
  }

  return { error: false };
}

export async function clearCartItems() {
  await clearCartItemsDB();
  return { error: false };
}
