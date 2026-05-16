import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '@/data/env/server';

const pool = new Pool({
  connectionString: env.DB_URL,

  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : false,
});

export const db = drizzle(pool, { schema });
