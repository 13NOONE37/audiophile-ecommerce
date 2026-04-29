'use client';

import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { CartItems } from '@/features/cart/lib/types/cart';

export function CartItemQuantityControl({
  item,
  onQuantityChange,
  disabled,
}: {
  item: CartItems[number];
  onQuantityChange: (qty: number) => void;
  disabled: boolean;
}) {
  return (
    <QuantitySelectInput
      value={item.quantity}
      setValue={(value) => {
        const normalized = Math.max(0, Math.floor(value));

        onQuantityChange(normalized);
      }}
      disabled={disabled}
      allowZero
      className='h-8 w-24'
    />
  );
}
