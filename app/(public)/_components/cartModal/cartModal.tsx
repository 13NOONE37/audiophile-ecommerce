import React from 'react';
import { CartContent } from './CartContent';
import { getCart } from '@/features/cart/services/getCart';
import { Cart } from '@/features/cart/lib/types/cart';

const CartModal = async ({ cart }: { cart: Cart | null }) => {
  return (
    <div
      className={`fixed 
          top-28.5 lg:top-32.5 
          left-0 xs:left-6 md:left-auto
          right-0 xs:right-6 md:right-10 
          md:w-96 
          bg-white rounded-lg`}
    >
      <CartContent cart={cart} />
    </div>
  );
};
CartModal.displayName = 'CartModal';
export default CartModal;
