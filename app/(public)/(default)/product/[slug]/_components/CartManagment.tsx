'use client';

import { Button } from '@/components/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { env } from '@/data/env/client';
import { addToCart } from '@/features/cart/actions/carts';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function CartManagment({
  variantId,
  stock,
}: {
  variantId: string;
  stock: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className='min-h-14.5 md:h-14.5 flex flex-row justify-start gap-4 mt-8 lg:mt-12'>
      <QuantitySelectInput
        value={quantity}
        setValue={(value) => {
          setQuantity(value);
        }}
        disabled={stock === 0 || isPending}
        max={stock}
        className='h-full'
      />

      <Button
        variant='primary'
        className='uppercase inline-flex items-center gap-2'
        disabled={isPending || stock === 0}
        onClick={() => {
          startTransition(async () => {
            const result = await addToCart(variantId, quantity);

            if (result.success) {
              toast.success('Added to cart');
              router.refresh();
            } else {
              toast.error(result.error);
            }
          });
        }}
      >
        {isPending && <LoadingSpinner size='sm' />}
        Add to cart
      </Button>
    </div>
  );
}
