import { cookies } from 'next/headers';

const CART_COOKIE_NAME = 'cartId';
const MAX_AGE = 60 * 60 * 24 * 30; //30 days

export async function getOrCreateCartId(): Promise<string> {
  const cookieStore = await cookies();
  const exisiting = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (exisiting) return exisiting;

  const newId = crypto.randomUUID();
  cookieStore.set(CART_COOKIE_NAME, newId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });

  return newId;
}

export async function getCartId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value ?? null;
}
