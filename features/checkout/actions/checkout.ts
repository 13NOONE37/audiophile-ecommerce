'use server';

import {
  ActionResult,
  err,
  ErrorCode,
  ok,
} from '@/features/cart/lib/types/actionResults';
import { AdjustedItem, StockValidationResult } from '../types/checkout';
import { DomainError } from '@/features/cart/lib/errors/domainErrors';
import { getCartId } from '@/features/cart/lib/cartCookie';

import { findCartWithItems, removeCartItem } from '@/features/cart/db/carts';
import { revalidateTag } from 'next/cache';
import { getCartIdTag } from '@/features/cart/db/cache';
import { updateQuantity } from '@/features/cart/actions/carts';
import { cookies } from 'next/headers';
import ADJUSTMENT_COOKIE_NAME from '../lib/checkout';

export async function validateAndAdjustCart(): Promise<
  ActionResult<StockValidationResult>
> {
  try {
    const cartId = await getCartId();
    if (!cartId) return err('Cart not found', ErrorCode.CART_NOT_FOUND);

    const cart = await findCartWithItems(cartId);
    if (!cart?.items.length)
      return err('Cart is empty', ErrorCode.CART_NOT_FOUND);

    const adjustedItems: AdjustedItem[] = [];

    //check every item
    await Promise.all(
      cart.items.map(async (item) => {
        const currentStock = item.variant.stock;

        if (currentStock === 0) {
          //Unavaible - delete item
          await removeCartItem(item.cartId, item.id);
          adjustedItems.push({
            name: item.variant.product.short_name ?? item.variant.product.name,
            availableQty: 0,
            requestedQty: item.quantity,
          });
        } else if (item.quantity > currentStock) {
          //Too much - adjust quantity
          const updatedQuantity = currentStock;

          await updateQuantity(item.id, updatedQuantity);
          adjustedItems.push({
            name: item.variant.product.short_name ?? item.variant.product.name,
            availableQty: updatedQuantity,
            requestedQty: item.quantity,
          });
        }
      }),
    );

    if (adjustedItems.length > 0) {
      // We are saving adjustedItems to cookie to show the banner on the checkout page.
      const cookieStore = await cookies();
      cookieStore.set(ADJUSTMENT_COOKIE_NAME, JSON.stringify(adjustedItems), {
        maxAge: 20,
        httpOnly: true,
        path: '/',
      });
    }

    revalidateTag(getCartIdTag(cartId), 'max');
    return ok({ isValid: true, adjustedItems });
  } catch (error) {
    if (error instanceof DomainError) return err(error.message, error.code);
    console.error('[validateAndAdjustCart]', error);
    return err('Something went wrong', ErrorCode.UNEXPECTED);
  }
}
