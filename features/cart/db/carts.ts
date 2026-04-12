import { db } from '@/db/db';
import { UserError } from '@/lib/errors';
import { cartItems, carts, productImages, productVariants } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { cacheTag, updateTag } from 'next/cache';
import { getCartCookie } from '../lib/cookies';
import { getOrCreateCart } from '../lib/getOrCreateCart';
import { getCartIdTag } from './cache';
import { env } from '@/data/env/client';

export async function getCartDB() {
  const cartId = await getCartCookie();
  if (!cartId) return null;
  return getCartByIdCached(cartId);
}

async function getCartByIdCached(cartId: string) {
  'use cache';
  cacheTag(getCartIdTag(cartId));
  return db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  });
}

export async function getCartItemsDB() {
  const cart = await getCartDB();
  if (!cart) return null;
  return getCartItemsCached(cart.id);
}

async function getCartItemsCached(cartId: string) {
  'use cache';
  cacheTag(getCartIdTag(cartId));
  return db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      variant: {
        columns: {
          price: true,
          stock: true,
        },
        with: {
          product: {
            columns: {
              short_name: true,
              name: true,
            },
            with: {
              images: {
                where: and(eq(productImages.role, 'cart')),
              },
            },
          },
        },
      },
    },
    orderBy: (cartItems, { asc }) => [asc(cartItems.variantId)],
  });
}

export async function addToCartDB(variantId: string, quantity: number) {
  const cart = await getOrCreateCart();
  const variantRecord = await db.query.productVariants.findFirst({
    columns: { stock: true },
    where: eq(productVariants.id, variantId),
  });
  const stock = variantRecord?.stock ?? 0;
  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.variantId, variantId),
    ),
  });

  if (existingItem) {
    if (
      existingItem.quantity + quantity >
      Number(env.NEXT_PUBLIC_MAX_ITEMS_PER_PRODUCT)
    ) {
      throw new UserError(
        `Quantity exceeds per-product limit (${env.NEXT_PUBLIC_MAX_ITEMS_PER_PRODUCT}).`,
      );
    }
    if (existingItem.quantity + quantity > stock) {
      throw new UserError(`Requested quantity exceeds stock.`);
    }

    const updatedItem = await db
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id))
      .returning();
    if (!updatedItem) throw new Error('Failed to update cart item');
  } else {
    if (quantity > stock) {
      throw new UserError(`Requested quantity exceeds stock.`);
    }
    const newItem = await db
      .insert(cartItems)
      .values({
        cartId: cart.id,
        variantId,
        quantity,
      })
      .returning();
    if (!newItem) {
      throw new Error('Failed to add item to cart');
    }
  }

  updateTag(getCartIdTag(cart.id));
}
export async function setCartItemQuantityDB(
  cartItemId: string,
  quantity: number,
) {
  // Validate stock before updating quantity
  const item = await db.query.cartItems.findFirst({
    where: eq(cartItems.id, cartItemId),
    columns: { variantId: true, cartId: true },
  });

  if (!item) throw new Error('Cart item not found');

  const variantRecord = await db.query.productVariants.findFirst({
    columns: { stock: true },
    where: eq(productVariants.id, item.variantId),
  });
  const stock = variantRecord?.stock ?? 0;
  if (quantity > stock) {
    throw new UserError(
      `Requested quantity exceeds stock. Only ${stock} left.`,
      {
        available: stock,
      },
    );
  }

  const updatedItem = await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId))
    .returning();

  if (updatedItem == null)
    throw new Error('Failed to update cart item quantity');

  updateTag(getCartIdTag(updatedItem[0].cartId));
  return updatedItem;
}

export async function removeCartItemDB(cartItemId: string) {
  const cart = await getCartDB();
  if (!cart) return null;

  const cartId = cart.id;
  const deletedItem = await db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, cartItemId)))
    .returning();

  if (!deletedItem || deletedItem.length === 0) {
    throw new Error('Failed to remove cart item');
  }

  updateTag(getCartIdTag(cartId));
  return deletedItem;
}
export async function clearCartItemsDB() {
  const cart = await getCartDB();
  if (!cart) return null;

  const cartId = cart.id;

  const deletedItems = await db
    .delete(cartItems)
    .where(eq(cartItems.cartId, cartId))
    .returning();

  if (deletedItems == null) throw new Error('Failed to clear cart');

  updateTag(getCartIdTag(cartId));
  return deletedItems;
}
