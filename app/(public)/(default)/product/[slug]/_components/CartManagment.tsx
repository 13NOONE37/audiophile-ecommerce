'use client';

import { Button } from '@/components/button';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { addToCart } from '@/features/cart/actions/carts';
import { useState } from 'react';

export function CartManagment({ variantId }: { variantId: string }) {
  const [quantity, setQuantity] = useState(1);

  //TODO pending state tu i w koszyku
  return (
    <div className='min-h-14.5 md:h-14.5 flex flex-row justify-start gap-4 mt-8 lg:mt-12'>
      <QuantitySelectInput
        value={quantity}
        setValue={setQuantity}
        className='h-full'
      />
      <Button
        variant='primary'
        className='uppercase'
        onClick={async () => {
          const result = await addToCart(variantId, quantity);
          if (!result.error) {
            window.dispatchEvent(new Event('cart-updated'));
          }
        }}
      >
        Add to cart
      </Button>
    </div>
  );
}
