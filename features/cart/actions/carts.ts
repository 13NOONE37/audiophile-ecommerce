'use server';

import { db } from '@/db/db';
import { cartItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { clearCartItems, getCartItems, setCartItemQuantity } from '../db/carts';
import { getOrCreateCart } from '../lib/getOrCreateCart';
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

  const cart = await getOrCreateCart();

  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.variantId, variantId),
    ),
  });

  if (existingItem) {
    await db
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id));
  } else {
    await db.insert(cartItems).values({
      cartId: cart.id,
      variantId,
      quantity,
    });
  }

  return { error: false };
}

export async function getCartItemsAction() {
  return getCartItems();
}

export async function setCartItemQuantityAction(
  unsafeCartItemId: unknown,
  unsafeQuantity: unknown,
) {
  const parsed = setCartItemQuantitySchema.safeParse({
    cartItemId: unsafeCartItemId,
    quantity: unsafeQuantity,
  });

  if (!parsed.success) {
    return { error: true, message: 'Invalid quantity payload' };
  }

  const { cartItemId, quantity } = parsed.data;
  if (quantity === 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
    return { error: false };
  }

  const success = await setCartItemQuantity(cartItemId, quantity);

  if (!success) {
    return { error: true, message: 'Cart item not found' };
  }

  return { error: false };
}

export async function clearCartAction() {
  await clearCartItems();
  return { error: false };
}
