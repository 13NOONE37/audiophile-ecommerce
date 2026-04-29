import CheckoutPage from './_components/checkout/checkout';
import { Suspense } from 'react';
import { getCart } from '@/features/cart/services/getCart';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LinkButton } from '@/components/button';
import { cookies } from 'next/headers';
import { AdjustedItem } from '@/features/checkout/types/checkout';
import { AdjustmentBanner } from './_components/adjustmentBanner/adjustmentBanner';
import ADJUSTMENT_COOKIE_NAME from '@/features/checkout/lib/checkout';

export default function CheckoutContentPage() {
  return (
    <Suspense
      fallback={
        <div className='w-full grid place-items-center mt-4 md:mt-8.5 lg:mt-20'>
          <LoadingSpinner />
        </div>
      }
    >
      <CheckoutWrapper />
    </Suspense>
  );
}

async function CheckoutWrapper() {
  const cookieStore = await cookies();
  const adjustmentCookie = cookieStore.get(ADJUSTMENT_COOKIE_NAME);

  const adjustedItems: AdjustedItem[] = adjustmentCookie
    ? JSON.parse(adjustmentCookie.value)
    : [];

  const cart = await getCart();
  if (!cart?.items.length) {
    return (
      <div className='w-full grid place-items-center text-center px-4 mt-4 md:mt-8.5 lg:mt-20'>
        <h2 className='heading-3 mb-4'>Your cart is empty</h2>
        <p className='text-content text-body mb-6'>
          Looks like you haven't added anything to your cart yet.
        </p>
        <LinkButton href='/' variant='primary'>
          Start Shopping
        </LinkButton>
      </div>
    );
  }
  return (
    <>
      {adjustedItems.length > 0 && <AdjustmentBanner items={adjustedItems} />}
      <CheckoutPage cart={cart} />
    </>
  );
}

//TODO: we check if it is avaible in transaction and create order(status pending), if not we return error that somebody was faster and modify cart with toast
//TODO: payment procedure

//TODO: webhook: payment_success → UPDATE order SET status = 'paid'; we sent email and display confirmation page with order details;
//TODO: webhook: payment_failed  → UPDATE order SET status = 'failed' → UPDATE stock SET stock = stock + quantity  ← zwrot stocku
