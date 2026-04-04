import { cookies } from 'next/headers';

export const CART_COOKIE = 'cartId';

export async function getCartCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value;
}

export async function setCartCookie(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    path: '/',
  });
}
