import parsePhoneNumberFromString from 'libphonenumber-js';
import z from 'zod';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { postcodeValidator } from 'postcode-validator';

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

export const checkoutSchema = z
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

export const uuidSchema = z.string().uuid();
