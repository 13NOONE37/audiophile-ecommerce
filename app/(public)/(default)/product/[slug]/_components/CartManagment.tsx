'use client';

import { Button } from '@/components/button';
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
        setValue={setQuantity}
        disabled={stock === 0}
        max={Math.min(Number(env.NEXT_PUBLIC_MAX_ITEMS_PER_PRODUCT), stock)}
        className='h-full'
      />

      <Button
        variant='primary'
        className='uppercase'
        disabled={isPending || stock === 0}
        onClick={() => {
          startTransition(async () => {
            const result = await addToCart(variantId, quantity);
            if (result.error) {
              toast.error(result.message);
            } else router.refresh();
          });
        }}
      >
        {isPending ? '...' : 'Add to cart'}
      </Button>
    </div>
  );
}
