'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { postcodeValidator } from 'postcode-validator';
import { z } from 'zod';
import Billing from '../billing/billing';
import Summary from '../summary/summary';
import ConfirmationModal from '../confirmation/confirmation-modal';
import type { CheckoutFormState, FormErrors } from './types';
import { Cart } from '@/features/cart/lib/types/cart';
import { validateAndAdjustCart } from '@/features/checkout/actions/checkout';
import { StockValidationResult } from '@/features/checkout/types/checkout';
import { ActionResult } from '@/features/cart/lib/types/actionResults';
import { AdjustmentBanner } from '../adjustmentBanner/adjustmentBanner';

// ─── Validation Schema ────────────────────────────────────────────────────────

countries.registerLocale(enLocale);

const resolveCountryCode = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return null;

  if (/^[A-Za-z]{2}$/.test(normalized)) {
    return normalized.toUpperCase();
  }

  const countryCode = countries.getAlpha2Code(normalized, 'en');
  return countryCode ?? null;
};

const normalizePostalCode = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, ' ');

const checkoutSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Required')
      .max(32, 'Must be 32 characters or less'),
    email: z.string().min(1, 'Required').email('Invalid email address'),
    phone: z
      .string()
      .min(1, 'Required')
      .transform((value) => value.trim())
      .refine((value) => {
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber?.isValid() ?? false;
      }, 'Invalid phone number')
      .transform((value) => parsePhoneNumberFromString(value)!.number),
    address: z.string().min(1, 'Required'),
    zip: z.string().min(1, 'Required').transform(normalizePostalCode),
    city: z.string().min(1, 'Required'),
    country: z
      .string()
      .min(1, 'Required')
      .transform((value) => value.trim()),
  })
  .superRefine((data, ctx) => {
    const countryCode = resolveCountryCode(data.country);

    if (!countryCode) {
      ctx.addIssue({
        code: 'custom',
        path: ['country'],
        message: 'Select a valid country',
      });
    }

    if (countryCode && !postcodeValidator(data.zip, countryCode)) {
      ctx.addIssue({
        code: 'custom',
        path: ['zip'],
        message: 'Invalid ZIP/postal code for selected country',
      });
    }
  });

const VAT_RATE = 0.2;
const SHIPPING_COST = 50;

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
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    setFormState(INITIAL_FORM_STATE);
    router.push('/');
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

      {showConfirmation && (
        <ConfirmationModal
          items={cart.items}
          grandTotalPrice={grandTotalPrice}
          onClose={handleConfirmationClose}
        />
      )}
    </div>
  );
}
