'use client';

import { Button } from '@/components/button';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { addToCart } from '@/features/cart/actions/carts';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export function CartManagment({ variantId }: { variantId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await addToCart(variantId, quantity);
            if (!result.error) router.refresh();
          });
        }}
      >
        {isPending ? '...' : 'Add to cart'}
      </Button>
    </div>
  );
}
