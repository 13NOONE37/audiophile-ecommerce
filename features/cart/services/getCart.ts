import { cacheTag } from 'next/cache';
import { getCartId } from '../lib/cartCookie';
import { getCartIdTag } from '../db/cache';
import { findCartWithItems } from '../db/carts';
import { validateAndAdjustCart } from '@/features/checkout/actions/checkout';
import { ActionResult } from '../lib/types/actionResults';
import {
  AdjustedItem,
  StockValidationResult,
} from '@/features/checkout/types/checkout';
import { Cart } from '../lib/types/cart';

export async function getCart() {
  const cartId = await getCartId();
  if (!cartId) return null;

  return getCachedCart(cartId);
}

async function getCachedCart(cartId: string) {
  'use cache';
  cacheTag(getCartIdTag(cartId));
  return findCartWithItems(cartId);
}

// export async function getAdjustedCart() {
//   const cartId = await getCartId();
//   if (!cartId) return null;

//   const cart = await findCartWithItems(cartId);
//   if (!cart?.items.length) return null;

//   const validationResult = await validateAndAdjustCart();

//   const adjustedCart = await findCartWithItems(cartId);

//   return {
//     cart: adjustedCart,
//     validationResult: validationResult,
//   };
// }
