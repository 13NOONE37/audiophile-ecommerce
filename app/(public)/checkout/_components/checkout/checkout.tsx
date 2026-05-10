'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Billing from '../billing/billing';
import Summary from '../summary/summary';
import type { CheckoutFormState, FormErrors } from './types';
import { Cart } from '@/features/cart/lib/types/cart';
import {
  placeOrder,
  validateAndAdjustCart,
} from '@/features/checkout/actions/checkout';
import { toast } from 'sonner';
import { checkoutSchema } from '@/features/checkout/schema/checkout';
import { ErrorCode } from '@/features/cart/lib/types/actionResults';
import { Button } from '@/components/button';
import { initializePayment } from '@/features/checkout/actions/initializePayments';
import { env } from '@/data/env/client';

const VAT_RATE = Number(env.NEXT_PUBLIC_VAT_RATE);
const SHIPPING_COST = Number(env.NEXT_PUBLIC_SHIPPING_COST);
const INITIAL_FORM_STATE: CheckoutFormState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  zip: '',
  city: '',
  country: '',
};

export default function CheckoutPage({ cart }: { cart: Cart }) {
  const router = useRouter();
  const [formState, setFormState] =
    useState<CheckoutFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});

  const totalPrice =
    cart?.items.reduce(
      (sum, item) => sum + Number(item.variant.price) * item.quantity,
      0,
    ) ?? 0;
  const shippingPrice = totalPrice > 0 ? SHIPPING_COST : 0;
  const vatPrice = Math.round(totalPrice * VAT_RATE);
  const grandTotalPrice = totalPrice + shippingPrice;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(formState);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const err of result.error.issues) {
        const field = err.path[0] as keyof CheckoutFormState;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setFormState((prev) => ({
      ...prev,
      phone: result.data.phone,
      zip: result.data.zip,
      country: result.data.country,
    }));

    //Call server action
    const orderResult = await placeOrder(result.data);
    if (!orderResult.success) {
      if (orderResult.code === ErrorCode.PRODUCT_OUT_OF_STOCK)
        return toast.error(orderResult.error, {
          duration: 10000,
          action: (
            <Button
              variant='secondary'
              onClick={validateAndAdjustCart}
              className='p-2 w-30 uppercase'
            >
              Adjust
            </Button>
          ),
        });

      return toast.error(orderResult.error);
    }

    //Initialize payment
    const paymentResult = await initializePayment(orderResult.data.orderId);
    if (!paymentResult.success) {
      toast.error(paymentResult.error);
      router.push(
        `/checkout/order-confirmation/${orderResult.data.confirmationToken}`,
      );
      return;
    }

    router.push(paymentResult.data.url);

    //Initialize payment
    //---if failed redirect to confirmation page where is information that status is pending and button to payment page(we need to design this version of confirmation page)
    //Proceed payment
    ///---failed: restore stock
    ///---success: change status, send mail
    //show confirmation(ze względu na strukturę projektu jako MVP musimy to zrobić jako osobną podstronę order-confirmation/[orderId] i tam wyświetlić potwierdzenie)

    // console.log(orderResult.data.orderId);
    // setShowConfirmation(true);
  };

  useEffect(() => {
    validateAndAdjustCart();
  }, []);

  return (
    <div className='py-4 md:py-12 lg:py-20'>
      <button
        type='button'
        onClick={() => router.back()}
        className='content-text text-black/50 hover:text-brand-primary cursor-pointer'
      >
        Go Back
      </button>

      <form
        onSubmit={handleSubmit}
        noValidate
        className='grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 mt-6 lg:mt-9'
      >
        <Billing
          formState={formState}
          errors={errors}
          onChange={handleChange}
        />
        <Summary
          items={cart.items}
          totalPrice={totalPrice}
          shippingPrice={shippingPrice}
          vatPrice={vatPrice}
          grandTotalPrice={grandTotalPrice}
        />
      </form>
    </div>
  );
}
