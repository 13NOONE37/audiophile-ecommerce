import type { Config } from 'drizzle-kit';
import { env } from '@/data/env/server';

//DB_URL on development we use direct connection but on production we will use transaction pooler

export default {
  schema: './db/schema.ts',
  out: './db/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DB_URL,
  },
} satisfies Config;
