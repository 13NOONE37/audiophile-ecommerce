'use client';

import {
  CartItemsWithDetails,
  getCartItems,
  setCartItemQuantity,
} from '@/features/cart/actions/carts';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { formatPrice } from '@/lib/formatters';
import { useEffect, useState } from 'react';
import { ProductImage } from '@/components/ProductImage';
import { env } from '@/data/env/client';

const CartItemsDisplay = ({
  onItemsChange,
}: {
  onItemsChange?: (items: CartItemsWithDetails) => void;
}) => {
  const [cartItems, setCartItems] = useState<CartItemsWithDetails>([]);
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const items = await getCartItems();
        if (cancelled) return;
        const safeItems = items ?? [];
        setCartItems(safeItems);
        onItemsChange?.(safeItems);
      } catch (err) {
        console.error('Failed to load cart items', err);
        if (cancelled) return;
        setCartItems([]);
        onItemsChange?.([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [onItemsChange]);

  const handleSetQuantity = async (id: string, nextQuantity: number) => {
    const normalizedQuantity = Math.max(0, Math.floor(nextQuantity));
    console.log(normalizedQuantity);
    const result = await setCartItemQuantity(id, normalizedQuantity);

    if (result.error) return;

    setCartItems((prev) => {
      const nextItems = prev.map((item) =>
        item.id === id ? { ...item, quantity: normalizedQuantity } : item,
      );
      onItemsChange?.(nextItems);
      return nextItems;
    });
  };

  return cartItems.length > 0 ? (
    <ul className='flex flex-col gap-6 overflow-auto'>
      {cartItems.map((item) => (
        <li
          key={item.id}
          className='grid grid-cols-[64px_1fr_auto] grid-rows-2 gap-x-4 gap-y-0 items-center h-16'
        >
          {/* Image */}
          <ProductImage
            product={item.variant.product}
            role='cart'
            width={64}
            height={64}
            sizes='64px'
            className='w-16 h-16 rounded-[10px] row-span-2'
          />

          {/* Name */}
          <span className='text-sm font-bold uppercase text-black self-end'>
            {item.variant.product.short_name || item.variant.product.name}
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
              max={Math.min(
                Number(env.NEXT_PUBLIC_MAX_ITEMS_PER_PRODUCT),
                item.variant.stock,
              )}
              allowZero
              className='h-8 w-24'
            />
          </div>

          {/* Price */}
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
  );
};

export default CartItemsDisplay;
