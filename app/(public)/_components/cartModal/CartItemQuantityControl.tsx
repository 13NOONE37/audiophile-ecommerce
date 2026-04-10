'use client';

import { setCartItemQuantity } from '@/features/cart/actions/carts';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function CartItemQuantityControl({
  cartItemId,
  initialQuantity,
}: {
  cartItemId: string;
  initialQuantity: number;
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  return (
    <QuantitySelectInput
      value={quantity}
      setValue={(next) => {
        const resolved = typeof next === 'function' ? next(quantity) : next;
        const normalized = Math.max(1, Math.floor(resolved));

        setQuantity(normalized);
        startTransition(async () => {
          await setCartItemQuantity(cartItemId, normalized);
          router.refresh();
        });
      }}
      allowZero
      disabled={isPending}
      className='h-8 w-24'
    />
  );
}
