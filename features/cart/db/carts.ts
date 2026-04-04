import { db } from '@/db/db';
import { cartItems, carts, productImages } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getCartCookie } from '../lib/cookies';

export type CartListItem = {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  productName: string;
  productSlug: string;
  price: number;
  imagePath: string | null;
  imageAltText: string | null;
};

export async function getCart() {
  const cartId = await getCartCookie();
  if (!cartId) return null;

  return db.query.carts.findFirst({
    where: eq(carts.id, cartId),
  });
}

export async function getCartItems(): Promise<CartListItem[]> {
  const existingCart = await getCart();
  if (!existingCart) return [];

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.cartId, existingCart.id),
    with: {
      variant: {
        columns: {
          id: true,
          price: true,
        },
        with: {
          product: {
            columns: {
              name: true,
              slug: true,
            },
            with: {
              images: {
                where: and(eq(productImages.role, 'cart')),
                columns: {
                  path: true,
                  altText: true,
                  position: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return items.map((item) => {
    const cartImage = item.variant.product.images.find(
      (image) => (image.position ?? 0) === 0,
    );

    return {
      id: item.id,
      cartId: item.cartId,
      variantId: item.variantId,
      quantity: item.quantity,
      productName: item.variant.product.name,
      productSlug: item.variant.product.slug,
      price: Number(item.variant.price),
      imagePath: cartImage?.path ?? null,
      imageAltText: cartImage?.altText ?? null,
    };
  });
}

export async function setCartItemQuantity(
  cartItemId: string,
  quantity: number,
) {}

export async function clearCartItems(cartId: string) {}
