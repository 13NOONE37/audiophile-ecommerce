'use client';

import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { formatPrice } from '@/lib/formatters';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

//TODO add shortname field to database or use sku without dashes; sku max 12 characters

const cartItems: CartItem[] = [
  {
    id: '1',
    name: 'XX59 MK II',
    image:
      '/images/products/zx7-speaker/default/preview/image-category-page-preview.jpg',
    price: 89.9,
    quantity: 1,
  },
  {
    id: '2',
    name: 'ZX9',
    image:
      '/images/products/zx7-speaker/default/preview/image-category-page-preview.jpg',
    price: 349.9,
    quantity: 1,
  },
  {
    id: '3',
    name: 'ZX7',
    image:
      '/images/products/zx7-speaker/default/preview/image-category-page-preview.jpg',
    price: 179.9,
    quantity: 1,
  },
];

const CartItemsDisplay = () => {
  const handleDecrease = (id: string) => {
    // TODO: Implement decrease quantity
  };

  const handleIncrease = (id: string) => {
    // TODO: Implement increase quantity
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
            src={item.image}
            alt={item.name}
            width={64}
            height={64}
            sizes='64px'
            className='w-16 h-16 rounded-[10px] row-span-2'
          />

          {/* Name */}
          <span className='text-sm font-bold uppercase text-black self-end'>
            {/* TODO: here we display SKU becasuse there is no place for full name */}
            {item.name}
          </span>

          {/* Quantity Controls */}
          <div className='row-span-2 flex items-center justify-center'>
            <QuantitySelectInput
              value={0}
              setValue={() => {}}
              className='h-8 w-24'
            />
            {/* <span className='text-xs font-medium bg-gray-200 px-3 py-1 rounded'>
              {item.quantity}
            </span> */}
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
