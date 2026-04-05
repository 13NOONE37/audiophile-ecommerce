import { getCartItems } from '@/features/cart/actions/carts';
import CheckoutPage from './_components/checkout/checkout';

export default async function CheckoutRoute() {
  const cartItems = await getCartItems();
  if (!cartItems) return null;

  return <CheckoutPage cartItems={cartItems} />;
}
