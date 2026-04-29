import { db } from '@/db/db';
import { cartItems, carts, productImages, productVariants } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import {
  CartItemNotFoundError,
  CartNotFoundError,
  OutOfStockError,
  ProductNotFoundError,
} from '../lib/errors/domainErrors';

export async function findCart(cartId: string) {
  return db.query.carts.findFirst({ where: eq(carts.id, cartId) });
}

export async function findCartWithItems(cartId: string) {
  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, cartId),
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: {
                with: {
                  images: {
                    where: and(eq(productImages.role, 'cart')),
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!cart) return null;
  return cart;
}
export async function getOrCreateCart(cartId: string) {
  const exisiting = await findCart(cartId);
  if (exisiting) return exisiting;

  return db
    .insert(carts)
    .values({ id: cartId })
    .returning()
    .then((r) => r[0]);
}

export async function insertCartItem(
  cartId: string,
  variantId: string,
  quantity: number,
) {
  const [variant, existingItem] = await Promise.all([
    db.query.productVariants.findFirst({
      where: eq(productVariants.id, variantId),
      with: {
        product: {
          columns: {
            name: true,
          },
        },
      },
    }),
    db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.variantId, variantId),
      ),
    }),
  ]);
  if (!variant) throw new ProductNotFoundError();

  const currentQty = existingItem?.quantity ?? 0;
  const totalQty = currentQty + quantity;

  if (variant.stock < totalQty)
    throw new OutOfStockError(
      variant.product.name,
      variant.stock - currentQty,
      'add',
    );

  return db
    .insert(cartItems)
    .values({ cartId, variantId, quantity })
    .onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.variantId],
      set: { quantity: sql`cart_items.quantity + ${quantity}` },
    });
}

export async function removeCartItem(cartId: string, cartItemId: string) {
  return db
    .delete(cartItems)
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, cartItemId)));
}

export async function updateCartItemQuantity(
  cartId: string,
  cartItemId: string,
  quantity: number,
) {
  if (quantity <= 0) return removeCartItem(cartId, cartItemId);

  const existingItem = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.cartId, cartId), eq(cartItems.id, cartItemId)),
    columns: {
      quantity: true,
    },
    with: {
      variant: {
        columns: {
          stock: true,
        },
        with: {
          product: {
            columns: { name: true },
          },
        },
      },
    },
  });

  if (!existingItem) throw new CartItemNotFoundError();

  const isIncreasing = quantity > existingItem.quantity;
  if (isIncreasing && existingItem.variant.stock < quantity)
    throw new OutOfStockError(
      existingItem.variant.product.name,
      existingItem.variant.stock,
      'update',
    );

  return db
    .update(cartItems)
    .set({
      quantity,
    })
    .where(and(eq(cartItems.cartId, cartId), eq(cartItems.id, cartItemId)));
}

export async function removeCart(cartId: string) {
  return db.delete(carts).where(eq(carts.id, cartId));
}
export async function removeCartItems(cartId: string) {
  return db.delete(cartItems).where(eq(cartItems.cartId, cartId));
}
