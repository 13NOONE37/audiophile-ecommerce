'use server';
import { Resend } from 'resend';
import {
  ActionResult,
  err,
  ErrorCode,
  ok,
} from '@/features/cart/lib/types/actionResults';
import {
  AdjustedItem,
  PlaceOrderResult,
  StockValidationResult,
} from '../types/checkout';
import {
  DomainError,
  OutOfStockError,
  ProductNotFoundError,
} from '@/features/cart/lib/errors/domainErrors';
import { getCartId } from '@/features/cart/lib/cartCookie';

import { findCartWithItems, removeCartItem } from '@/features/cart/db/carts';
import { revalidateTag } from 'next/cache';
import { getCartIdTag } from '@/features/cart/db/cache';
import { updateQuantity } from '@/features/cart/actions/carts';
import { cookies } from 'next/headers';
import ADJUSTMENT_COOKIE_NAME, { generateOrderNumber } from '../lib/checkout';
import { db } from '@/db/db';
import { carts, orderItems, orders, productVariants } from '@/db/schema';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import { checkoutSchema } from '../schema/checkout';
import { env } from '@/data/env/server';
import OrderConfirmationEmail from '@/components/emails/OrderConfirmationEmail';

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

export async function placeOrder(
  formData: unknown,
): Promise<ActionResult<PlaceOrderResult>> {
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return err(
      'Incorrect data',
      ErrorCode.VALIDATION_ERROR,
      parsed.error.flatten().fieldErrors,
    );
  }

  try {
    const cartId = await getCartId();
    if (!cartId) return err('Cart not found', ErrorCode.CART_NOT_FOUND);

    const cart = await findCartWithItems(cartId);
    if (!cart?.items.length)
      return err('Cart is empty', ErrorCode.CART_NOT_FOUND);

    const variantsIds = cart.items.map((item) => item.variantId);

    const { confirmationToken, orderId } = await db.transaction(async (tx) => {
      // We query variants and block it until transaction end - ok for MVP
      const variants = await tx
        .select()
        .from(productVariants)
        .where(inArray(productVariants.id, variantsIds))
        .for('update');

      // Stock validation
      for (const item of cart.items) {
        const variant = variants.find((v) => v.id === item.variantId);
        if (!variant) {
          throw new ProductNotFoundError();
        }
        if (variant.stock < item.quantity) {
          throw new OutOfStockError(
            item.variant.product.short_name ?? item.variant.product.name,
            variant.stock,
            'update',
          );
        }
      }
      // Lower Stock
      await Promise.all(
        cart.items.map((item) =>
          tx
            .update(productVariants)
            .set({
              stock: sql`${productVariants.stock} - ${item.quantity}`,
            })
            .where(
              and(
                eq(productVariants.id, item.variantId),
                gte(productVariants.stock, item.quantity),
              ),
            ),
        ),
      );

      // Create order
      const [order] = await tx
        .insert(orders)
        .values({
          status: 'pending',
          orderNumber: generateOrderNumber(),
          totalAmount: String(
            cart.items.reduce(
              (sum, item) => sum + Number(item.variant.price) * item.quantity,
              0,
            ),
          ),
          confirmationTokenExpiresAt: new Date(Date.now() + 60 * 60 * 100),
          firstName: parsed.data.name,
          lastName: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          city: parsed.data.city,
          country: parsed.data.country,
          zip: parsed.data.zip,
          houseNumber: '0',
          street: parsed.data.address,
        })
        .returning();

      // Create order items
      await tx.insert(orderItems).values(
        cart.items.map((item) => ({
          orderId: order.id,
          priceSnapshot: item.variant.price,
          productNameSnapshot: item.variant.product.name,
          variantIdSnapshot: item.variant.id,
          skuSnapshot: item.variant.sku,
          quantity: item.quantity,
        })),
      );

      // Clear Cart
      await tx.delete(carts).where(eq(carts.id, cartId));

      return { confirmationToken: order.confirmationToken, orderId: order.id };
    });

    revalidateTag(getCartIdTag(cartId), 'max');
    return ok({ confirmationToken: confirmationToken, orderId: orderId });
  } catch (error) {
    if (error instanceof DomainError) {
      return err(error.message, error.code);
    }

    console.error('[placeOrder]', error);
    return err('Coś poszło nie tak', ErrorCode.UNEXPECTED);
  }
}
