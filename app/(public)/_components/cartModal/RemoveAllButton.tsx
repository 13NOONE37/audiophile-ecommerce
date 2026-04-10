'use client';

import { clearCartItems } from '@/features/cart/actions/carts';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function RemoveAllButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await clearCartItems();
          router.refresh();
        });
      }}
      disabled={isPending}
      className='text-sm font-medium text-black/50 hover:text-brand-primary underline cursor-pointer disabled:opacity-50'
    >
      Remove all
    </button>
  );
}
