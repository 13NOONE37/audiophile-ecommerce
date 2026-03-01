import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DB_URL: z.string().min(1),
    // // Baza danych
    // DB_PASSWORD: z.string().min(1),
    // DB_USER: z.string().min(1),
    // DB_NAME: z.string().min(1),
    // DB_HOST: z.string().min(1),
    // // Clerk (auth) - sekrety serwera
    // CLERK_SECRET_KEY: z.string().min(1),
    // CLERK_WEBHOOK_SECRET: z.string().min(1),
    // // Inne klucze i ustawienia serwerowe
    // ARCJET_KEY: z.string().min(1),
    // // Opcjonalne do testów — może być niezdefiniowane
    // TEST_IP_ADDRESS: z.string().min(1).optional(),
    // // Kupony Stripe (identyfikatory)
    // STRIPE_PPP_50_COUPON_ID: z.string().min(1),
    // STRIPE_PPP_40_COUPON_ID: z.string().min(1),
    // STRIPE_PPP_30_COUPON_ID: z.string().min(1),
    // STRIPE_PPP_20_COUPON_ID: z.string().min(1),
    // // Klucze Stripe - serwerowe
    // STRIPE_SECRET_KEY: z.string().min(1),
    // STRIPE_WEBHOOK_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
