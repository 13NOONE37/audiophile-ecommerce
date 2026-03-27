import type { ChangeEvent } from 'react';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { cn } from '@/lib/utils';
import IconCashOnDelivery from '@/icons/IconCashOnDelivery';
import type { CheckoutFormState, FormErrors } from '../checkout/types';
import FormField from './_components/formField';
import RadioOption from './_components/radio';

countries.registerLocale(enLocale);

const COUNTRY_OPTIONS = Object.entries(
  countries.getNames('en', { select: 'official' }),
)
  .map(([code, name]) => ({ code, name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const ZIP_PLACEHOLDER_BY_COUNTRY: Record<string, string> = {
  AU: '2000',
  CA: 'M5V 3L9',
  DE: '10115',
  FR: '75008',
  GB: 'SW1A 1AA',
  NL: '1234 AB',
  PL: '00-001',
  US: '10001',
};

const resolveCountryCode = (value: string) => {
  const normalized = value.trim();
  if (!normalized) return 'US';

  if (/^[A-Za-z]{2}$/.test(normalized)) {
    return normalized.toUpperCase();
  }

  const countryCode = countries.getAlpha2Code(normalized, 'en');
  return countryCode ?? 'US';
};

interface Props {
  formState: CheckoutFormState;
  errors: FormErrors;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function Billing({ formState, errors, onChange }: Props) {
  const zipPlaceholder =
    ZIP_PLACEHOLDER_BY_COUNTRY[resolveCountryCode(formState.country)] ??
    ZIP_PLACEHOLDER_BY_COUNTRY.US;

  return (
    <div className='bg-white rounded-lg p-6 md:p-7 lg:p-12 flex flex-col gap-8 self-start'>
      <h1 className='text-[28px] md:text-[32px] font-bold leading-tight tracking-[2px] uppercase'>
        Checkout
      </h1>

      {/* Billing Details */}
      <section>
        <h2 className='subtitle-text text-brand-primary uppercase'>
          Billing Details
        </h2>
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            label='Name'
            name='name'
            placeholder='Alexei Ward'
            value={formState.name}
            error={errors.name}
            onChange={onChange}
          />
          <FormField
            label='Email Address'
            name='email'
            type='email'
            placeholder='alexei@mail.com'
            value={formState.email}
            error={errors.email}
            onChange={onChange}
          />
          <FormField
            label='Phone Number'
            name='phone'
            placeholder='+1 202-555-0136'
            value={formState.phone}
            error={errors.phone}
            onChange={onChange}
          />
        </div>
      </section>

      {/* Shipping Info */}
      <section>
        <h2 className='subtitle-text text-brand-primary uppercase'>
          Shipping Info
        </h2>
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <FormField
            label='Address'
            name='address'
            placeholder='1137 Williams Avenue'
            value={formState.address}
            error={errors.address}
            onChange={onChange}
            className='md:col-span-2'
          />
          <FormField
            label='ZIP Code'
            name='zip'
            placeholder={zipPlaceholder}
            value={formState.zip}
            error={errors.zip}
            onChange={onChange}
          />
          <FormField
            label='City'
            name='city'
            placeholder='New York'
            value={formState.city}
            error={errors.city}
            onChange={onChange}
          />
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
              <label
                htmlFor='country'
                className={cn(
                  'text-xs font-bold tracking-[-0.21px]',
                  errors.country ? 'text-red-500' : 'text-black',
                )}
              >
                Country
              </label>
              {errors.country && (
                <span className='text-xs font-medium text-red-500 italic'>
                  {errors.country}
                </span>
              )}
            </div>
            <input
              id='country'
              name='country'
              list='country-options'
              placeholder='United States'
              value={formState.country}
              onChange={onChange}
              autoComplete='off'
              className={cn(
                'h-14 px-6 rounded-lg border font-bold text-sm bg-white outline-none transition-colors',
                errors.country
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[#cfcfcf] focus:border-brand-primary',
              )}
            />
            <datalist id='country-options'>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.code} value={country.name} />
              ))}
            </datalist>
          </div>
        </div>
      </section>

      {/* Payment Details */}
      <section>
        <h2 className='subtitle-text text-brand-primary uppercase'>
          Payment Details
        </h2>
        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
          <span className='text-xs font-bold text-black md:self-center'>
            Payment Method
          </span>
          <div className='flex flex-col gap-4'>
            <RadioOption
              name='paymentMethod'
              value='e-money'
              label='e-Money'
              checked={formState.paymentMethod === 'e-money'}
              onChange={onChange}
            />
            <RadioOption
              name='paymentMethod'
              value='cash-on-delivery'
              label='Cash on Delivery'
              checked={formState.paymentMethod === 'cash-on-delivery'}
              onChange={onChange}
            />
          </div>
        </div>

        {formState.paymentMethod === 'e-money' ? (
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              label='e-Money Number'
              name='eMoneyNumber'
              placeholder='238521993'
              value={formState.eMoneyNumber}
              error={errors.eMoneyNumber}
              onChange={onChange}
            />
            <FormField
              label='e-Money PIN'
              name='eMoneyPin'
              placeholder='6891'
              value={formState.eMoneyPin}
              error={errors.eMoneyPin}
              onChange={onChange}
            />
          </div>
        ) : (
          <div className='mt-8 flex flex-col md:flex-row items-center gap-8'>
            <IconCashOnDelivery className='shrink-0' />
            <p className='content-text text-black/50 text-center md:text-left'>
              The &apos;Cash on Delivery&apos; option enables you to pay in cash
              when our delivery courier arrives at your residence. Just make
              sure your address is correct so that your order will not be
              cancelled.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
