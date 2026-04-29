'use server';

import { revalidateTag } from 'next/cache';
import {
  getOrCreateCart,
  insertCartItem,
  removeCartItems,
  updateCartItemQuantity,
} from '../db/carts';
import { getOrCreateCartId } from '../lib/cartCookie';
import {
  ActionResult,
  err,
  ErrorCode,
  ok,
  okVoid,
} from '../lib/types/actionResults';
import { addToCartSchema, updateQuantitySchema } from '../schemas/carts';
import { getCartIdTag } from '../db/cache';
import { DomainError } from '../lib/errors/domainErrors';
//TODO: update functions to take cartId as parameter
export async function addToCart(
  variantId: string,
  quantity = 1,
): Promise<ActionResult<void>> {
  const parsed = addToCartSchema.safeParse({ variantId, quantity });
  if (!parsed.success) {
    return err(
      'Incorrect data',
      ErrorCode.VALIDATION_ERROR,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const cartId = await getOrCreateCartId();
    const cart = await getOrCreateCart(cartId);
    await insertCartItem(cart.id, parsed.data.variantId, parsed.data.quantity);

    revalidateTag(getCartIdTag(cart.id), 'max');
    return okVoid('Added to cart');
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error.message, error.code);
    }
    console.error('[addToCart] Unexpected error:', error);
    return err('Something went wrong, try again', ErrorCode.UNEXPECTED);
  }
}
export async function updateQuantity(
  cartItemId: string,
  quantity: number,
): Promise<ActionResult<void>> {
  const parsed = updateQuantitySchema.safeParse({ cartItemId, quantity });
  if (!parsed.success) {
    return err(
      'Incorrect data',
      ErrorCode.VALIDATION_ERROR,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const cartId = await getOrCreateCartId();
    const cart = await getOrCreateCart(cartId);
    await updateCartItemQuantity(
      cart.id,
      parsed.data.cartItemId,
      parsed.data.quantity,
    );

    revalidateTag(getCartIdTag(cart.id), 'max');
    return okVoid('Quantity updated');
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error.message, error.code);
    }
    console.error('[updateQuantity] Unexpected error:', error);
    return err('Something went wrong, try again', ErrorCode.UNEXPECTED);
  }
}
export async function clearCartItems(): Promise<ActionResult<void>> {
  try {
    const cartId = await getOrCreateCartId();
    const cart = await getOrCreateCart(cartId);
    await removeCartItems(cart.id);

    revalidateTag(getCartIdTag(cart.id), 'max');
    return okVoid('Cart cleared');
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error.message, error.code);
    }
    console.error('[clearCartItems] Unexpected error:', error);
    return err('Something went wrong, try again', ErrorCode.UNEXPECTED);
  }
}
