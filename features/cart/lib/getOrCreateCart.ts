import { db } from '@/db/db';
import { carts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCartCookie, setCartCookie } from './cookies';

export async function getOrCreateCart() {
  const cartId = await getCartCookie();

  if (cartId) {
    const existingCart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    });

    if (existingCart) return existingCart;
  }

  //TODO consider for vulnerabilites
  const [newCart] = await db
    .insert(carts)
    .values({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })
    .returning();

  await setCartCookie(newCart.id);

  return newCart;
}
