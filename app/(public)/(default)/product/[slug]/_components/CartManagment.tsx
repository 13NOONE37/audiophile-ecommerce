'use client';

import { Button } from '@/components/button';
import { QuantitySelectInput } from '@/components/quantitySelectInput';
import { useState } from 'react';

export function CartManagment() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className='min-h-14.5 md:h-14.5 flex flex-row justify-start gap-4 mt-8 lg:mt-12'>
      <QuantitySelectInput
        value={quantity}
        setValue={setQuantity}
        className='h-full'
      />
      <Button variant='primary' className='uppercase'>
        Add to cart
      </Button>
    </div>
  );
}
