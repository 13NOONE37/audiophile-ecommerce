import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DB_URL: z.string().min(1),
    DB_SSL_CA: z.string().optional(),
    RESEND_API_KEY: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_KEY: z.string().min(1),
    SHIPPING_COST: z.string().min(1),
    ARCJET_KEY: z.string().min(1),
    CRON_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
