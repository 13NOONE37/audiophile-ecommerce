import { getCartItems } from '@/features/cart/actions/carts';
import CheckoutPage from './_components/checkout/checkout';
import { Suspense } from 'react';

async function CheckoutContent() {
  const cartItems = await getCartItems();
  if (!cartItems) return null;

  return <CheckoutPage cartItems={cartItems} />;
}

export default function CheckoutRoute() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}
