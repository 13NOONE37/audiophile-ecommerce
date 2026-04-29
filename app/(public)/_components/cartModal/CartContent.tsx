'use client';

import { clearCartItems, updateQuantity } from '@/features/cart/actions/carts';
import { formatPrice } from '@/lib/formatters';
import { ProductImage } from '@/components/ProductImage';
import { LinkButton } from '@/components/button';
import { CartItemQuantityControl } from './CartItemQuantityControl';
import { useEffect, useOptimistic, useState, useTransition } from 'react';

import { cartReducer } from '@/features/cart/lib/cartReducer';
import { Cart } from '@/features/cart/lib/types/cart';
import { toast } from 'sonner';

export function CartContent({ cart }: { cart: Cart | null }) {
  if (!cart) {
    return <div className='w-full text-center py-8'>Cart does not exist</div>;
  }
  const [optimisticCart, dispatch] = useOptimistic(cart, cartReducer);
  const [isPending, startTransition] = useTransition();

  const itemCount = optimisticCart.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = optimisticCart.items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0,
  );

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    startTransition(async () => {
      dispatch({
        type: quantity <= 0 ? 'REMOVE_ITEM' : 'UPDATE_QUANTITY',
        itemId,
        quantity,
      });

      const result = await updateQuantity(itemId, quantity);

      if (!result.success) toast.error(result.error);
    });
  };

  const handleClearCartItems = () => {
    startTransition(async () => {
      dispatch({ type: 'CLEAR' });
      const result = await clearCartItems();

      if (!result.success) toast.error(result.error);
    });
  };

  return (
    <div className='px-3 py-8 xs:px-8 h-full flex flex-col'>
      {/* Header */}
      <div className='flex justify-between items-center mb-8'>
        <span className='text-lg font-bold tracking-wide uppercase text-black'>
          Cart ({itemCount})
        </span>
        <button
          onClick={handleClearCartItems}
          disabled={isPending}
          className='text-sm font-medium text-black/50 hover:text-brand-primary underline cursor-pointer disabled:opacity-50'
        >
          Remove all
        </button>
      </div>

      {/* Items */}
      <div className='flex-1 overflow-auto mb-8'>
        {optimisticCart.items.length > 0 ? (
          <ul className='flex flex-col gap-6 overflow-auto'>
            {optimisticCart.items.map((item) => (
              <li
                key={item.id}
                className='grid grid-cols-[64px_1fr_auto] grid-rows-2 gap-x-4 gap-y-0 items-center h-16'
              >
                <ProductImage
                  product={item.variant.product}
                  role='cart'
                  width={64}
                  height={64}
                  sizes='64px'
                  className='w-16 h-16 rounded-[10px] row-span-2'
                />
                <span className='text-sm font-bold uppercase text-black self-end'>
                  {item.variant.product.short_name || item.variant.product.name}
                </span>
                <div className='row-span-2 flex items-center justify-center'>
                  <CartItemQuantityControl
                    key={item.id}
                    item={item}
                    onQuantityChange={(qty) =>
                      handleUpdateQuantity(item.id, qty)
                    }
                    disabled={false}
                  />
                </div>
                <span className='text-xs font-bold text-black/50 uppercase self-start'>
                  {formatPrice(Number(item.variant.price))}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className='w-full text-center py-8'>
            <span className='block text-sm font-medium text-black/50'>
              Your cart is empty
            </span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className='flex justify-between items-center mb-6'>
        <span className='text-sm font-medium text-black/50 uppercase'>
          Total
        </span>
        <span className='text-lg font-bold text-black uppercase'>
          {formatPrice(totalPrice, { showZeroAsNumber: true })}
        </span>
      </div>

      {/* CTA Button */}
      <LinkButton
        href='/checkout'
        className='w-full uppercase text-center'
        disabled={isPending || optimisticCart.items.length === 0}
      >
        Checkout
      </LinkButton>
    </div>
  );
}
