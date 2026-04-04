'use client';

import {
  getCartItemsAction,
  setCartItemQuantityAction,
} from '@/features/cart/actions/carts';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { formatPrice } from '@/lib/formatters';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface CartItem {
  id: string;
  productName: string;
  short_name?: string;
  imagePath: string | null;
  imageAltText: string | null;
  price: number;
  quantity: number;
}

const CartItemsDisplay = ({
  onItemsChange,
}: {
  onItemsChange?: (items: CartItem[]) => void;
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const loadItems = useCallback(async () => {
    const items = await getCartItemsAction();
    setCartItems(items);
    onItemsChange?.(items);
  }, [onItemsChange]);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      if (!mounted) return;
      await loadItems();
    };

    const onCartUpdated = () => {
      void refresh();
    };

    void refresh();
    window.addEventListener('cart-updated', onCartUpdated);

    return () => {
      mounted = false;
      window.removeEventListener('cart-updated', onCartUpdated);
    };
  }, [loadItems]);

  const handleSetQuantity = async (id: string, nextQuantity: number) => {
    const normalizedQuantity = Math.max(1, Math.floor(nextQuantity));
    const result = await setCartItemQuantityAction(id, normalizedQuantity);

    if (result.error) return;

    setCartItems((prev) => {
      const nextItems = prev.map((item) =>
        item.id === id ? { ...item, quantity: normalizedQuantity } : item,
      );
      onItemsChange?.(nextItems);
      return nextItems;
    });
    window.dispatchEvent(new Event('cart-updated'));
  };

  return cartItems.length > 0 ? (
    <ul className='flex flex-col gap-6 overflow-auto'>
      {cartItems.map((item) => (
        <li
          key={item.id}
          className='grid grid-cols-[64px_1fr_auto] grid-rows-2 gap-x-4 gap-y-0 items-center h-16'
        >
          {/* Image */}
          <Image
            src={
              item.imagePath ??
              '/images/products/zx7-speaker/default/preview/image-category-page-preview.jpg'
            }
            alt={item.imageAltText ?? item.productName}
            width={64}
            height={64}
            sizes='64px'
            className='w-16 h-16 rounded-[10px] row-span-2'
          />

          {/* Name */}
          <span className='text-sm font-bold uppercase text-black self-end'>
            {item.short_name || item.productName}
          </span>

          {/* Quantity Controls */}
          <div className='row-span-2 flex items-center justify-center'>
            <QuantitySelectInput
              value={item.quantity}
              setValue={(next) => {
                const resolved =
                  typeof next === 'function' ? next(item.quantity) : next;
                void handleSetQuantity(item.id, resolved);
              }}
              className='h-8 w-24'
            />
          </div>

          {/* Price */}
          <span className='text-xs font-bold text-black/50 uppercase self-start'>
            {formatPrice(item.price)}
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
  );
};

export default CartItemsDisplay;
