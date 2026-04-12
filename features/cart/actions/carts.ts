'use server';

import {
  addToCartDB,
  clearCartItemsDB,
  getCartItemsDB,
  removeCartItemDB,
  setCartItemQuantityDB,
} from '../db/carts';
import { UserError } from '@/lib/errors';
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

  try {
    await addToCartDB(variantId, quantity);
    return { error: false };
  } catch (err) {
    if (err instanceof UserError) {
      return { error: true, message: err.message, details: err.data };
    }
    return {
      error: true,
      message: 'Could not add product to cart. Please try again.',
    };
  }
}

export async function getCartItems() {
  try {
    return await getCartItemsDB();
  } catch (err) {
    return null;
  }
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
  try {
    console.log(quantity);
    if (quantity === 0) {
      const success = await removeCartItemDB(cartItemId);
      if (!success) {
        return { error: true, message: 'Cart item not found' };
      }
      return { error: false };
    }
    const success = await setCartItemQuantityDB(cartItemId, quantity);

    if (!success) {
      return { error: true, message: 'Cart item not found' };
    }

    return { error: false };
  } catch (err) {
    if (err instanceof UserError) {
      return { error: true, message: err.message, details: err.data };
    }
    return {
      error: true,
      message: 'Could not update quantity. Please try again.',
    };
  }
}

export async function clearCartItems() {
  try {
    await clearCartItemsDB();
    return { error: false };
  } catch (err) {
    return {
      error: true,
      message: 'Could not clear cart. Please try again.',
    };
  }
}
