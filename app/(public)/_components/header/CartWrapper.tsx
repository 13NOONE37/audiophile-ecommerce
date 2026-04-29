import { getCart } from '@/features/cart/services/getCart';
import CartModal from '../cartModal/cartModal';

export async function CartWrapper() {
  const cart = await getCart();

  return <CartModal cart={cart} />;
}
