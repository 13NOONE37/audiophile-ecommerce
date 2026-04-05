import { db } from '@/db/db';
import { cartItems, carts, productImages } from '@/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { getCartCookie } from '../lib/cookies';
import { getOrCreateCart } from '../lib/getOrCreateCart';

export async function getCartDB() {
  const cartId = await getCartCookie();
  if (!cartId) return null;

  return db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  });
}
export async function getCartItemsDB() {
  const cart = await getCartDB();
  if (!cart) return null;

  const cartId = cart.id;

  return db.query.cartItems.findMany({
    where: eq(cartItems.cartId, cartId),
    with: {
      variant: {
        columns: {
          price: true,
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

  const existingItem = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.cartId, cart.id),
      eq(cartItems.variantId, variantId),
    ),
  });

  if (existingItem) {
    const updatedItem = await db
      .update(cartItems)
      .set({ quantity: existingItem.quantity + quantity })
      .where(eq(cartItems.id, existingItem.id))
      .returning();
    if (!updatedItem) throw new Error('Failed to update cart item');
  } else {
    const newItem = await db.insert(cartItems).values({
      cartId: cart.id,
      variantId,
      quantity,
    });
    if (!newItem) throw new Error('Failed to add item to cart');
  }
}
export async function setCartItemQuantityDB(
  cartItemId: string,
  quantity: number,
) {
  const updatedItem = await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, cartItemId))
    .returning();
  if (updatedItem == null)
    throw new Error('Failed to update cart item quantity');
  return updatedItem;
}

export async function removeCartItemDB(cartItemId: string) {
  const deletedItem = await db
    .delete(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .returning();
  if (deletedItem == null) throw new Error('Failed to remove cart item');
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

  return deletedItems;
}
