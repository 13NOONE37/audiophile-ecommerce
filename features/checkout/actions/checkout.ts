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

import {
  findCartWithItems,
  removeCartItem,
  updateCartItemQuantity,
} from '@/features/cart/db/carts';
import { revalidateTag } from 'next/cache';
import { getCartIdTag } from '@/features/cart/db/cache';
import { cookies } from 'next/headers';
import ADJUSTMENT_COOKIE_NAME from '../lib/checkout';
import { db } from '@/db/db';
import {
  cartItems,
  carts,
  orderItems,
  orders,
  productVariants,
} from '@/db/schema';
import { and, eq, gte, inArray, sql } from 'drizzle-orm';
import { checkoutSchema } from '../schema/checkout';
import { env } from '@/data/env/server';
import { request } from '@arcjet/next';
import { ajCheckout } from '@/lib/arcjet/arcjet';

export async function validateAndAdjustCart(): Promise<
  ActionResult<StockValidationResult>
> {
  const req = await request();
  const decision = await ajCheckout.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return err('Too many attempts, wait a moment', ErrorCode.UNEXPECTED);
    }
    return err('Request blocked', ErrorCode.UNEXPECTED);
  }

  try {
    const cartId = await getCartId();
    if (!cartId) return err('Cart not found', ErrorCode.CART_NOT_FOUND);

    const cart = await findCartWithItems(cartId);
    if (!cart?.items.length)
      return err('Cart is empty', ErrorCode.CART_NOT_FOUND);

    const adjustedItems: AdjustedItem[] = [];

    //check every item
    await db.transaction(async (tx) => {
      const variantIds = cart.items.map((item) => item.variantId);

      const freshVariants = await tx
        .select({
          id: productVariants.id,
          stock: productVariants.stock,
        })
        .from(productVariants)
        .where(inArray(productVariants.id, variantIds))
        .for('update');
      // We take fresh because cart may be older if e.g. we are waiting for our transaction; and by .for('update') we are blocking it for whole transaction

      for (const item of cart.items) {
        const variant = freshVariants.find((v) => v.id === item.variantId);

        if (!variant) {
          await tx
            .delete(cartItems)
            .where(
              and(eq(cartItems.cartId, cart.id), eq(cartItems.id, item.id)),
            );

          adjustedItems.push({
            name: item.variant.product.short_name ?? item.variant.product.name,
            availableQty: 0,
            requestedQty: item.quantity,
          });
          continue;
        }

        if (variant.stock === 0) {
          await tx
            .delete(cartItems)
            .where(
              and(eq(cartItems.cartId, cart.id), eq(cartItems.id, item.id)),
            );

          adjustedItems.push({
            name: item.variant.product.short_name ?? item.variant.product.name,
            availableQty: 0,
            requestedQty: item.quantity,
          });

          continue;
        }

        if (item.quantity > variant.stock) {
          await tx
            .update(cartItems)
            .set({ quantity: variant.stock })
            .where(
              and(eq(cartItems.cartId, cart.id), eq(cartItems.id, item.id)),
            );

          adjustedItems.push({
            name: item.variant.product.short_name ?? item.variant.product.name,
            availableQty: variant.stock,
            requestedQty: item.quantity,
          });
        }
      }
    });

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
  const req = await request();
  const decision = await ajCheckout.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return err('Too many attempts, wait a moment', ErrorCode.UNEXPECTED);
    }
    return err('Request blocked', ErrorCode.UNEXPECTED);
  }

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
          totalAmount: String(
            cart.items.reduce(
              (sum, item) => sum + Number(item.variant.price) * item.quantity,
              0,
            ) + Number(env.SHIPPING_COST),
          ),
          confirmationTokenExpiresAt: new Date(
            Date.now() + 60 * 60 * 24 * 14 * 1000,
          ), //2 weeks
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          address: parsed.data.address,
          zip: parsed.data.zip,
          city: parsed.data.city,
          country: parsed.data.country,
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
