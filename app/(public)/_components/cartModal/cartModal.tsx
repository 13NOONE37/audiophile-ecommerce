'use client';
import React, { useState } from 'react';
import { LinkButton } from '@/components/button';
import CartItemsDisplay from './cartItemsDisplay';
import { formatPrice } from '@/lib/formatters';
import {
  CartItemsWithDetails,
  clearCartItems,
} from '@/features/cart/actions/carts';

const CartModal = ({
  showCart,
  ref,
}: {
  showCart: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  if (!ref) return null;

  const [itemCount, setItemCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleItemsChange = (items: CartItemsWithDetails) => {
    setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
    setTotalPrice(
      items.reduce(
        (sum, item) => sum + Number(item.variant.price) * item.quantity,
        0,
      ),
    );
  };

  const handleRemoveAll = async () => {
    const result = await clearCartItems();
    if (!result.error) {
      setItemCount(0);
      setTotalPrice(0);
    }
  };

  return (
    <div
      className={`fixed 
          top-28.5 lg:top-32.5 
          left-0 xs:left-6 md:left-auto
          right-0 xs:right-6 md:right-10 
          md:w-96 
          bg-white rounded-lg`}
      ref={ref}
    >
      <div className='px-3 py-8 xs:px-8  h-full flex flex-col'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <span className='text-lg font-bold tracking-wide uppercase text-black'>
            Cart({itemCount})
          </span>
          <button
            onClick={handleRemoveAll}
            className='text-sm font-medium text-black/50 hover:text-brand-primary underline cursor-pointer'
          >
            Remove all
          </button>
        </div>

        {/* Items */}
        <div className='flex-1 overflow-auto mb-8'>
          <CartItemsDisplay onItemsChange={handleItemsChange} />
        </div>

        {/* Summary */}
        <div className='flex justify-between items-center mb-6'>
          <span className='text-sm font-medium text-black/50 uppercase'>
            Total
          </span>
          <span className='text-lg font-bold text-black uppercase'>
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* CTA Button */}
        <LinkButton href='/checkout' className='w-full uppercase text-center'>
          Checkout
        </LinkButton>
      </div>
    </div>
  );
};
CartModal.displayName = 'CartModal';
export default CartModal;
