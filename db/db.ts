import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { env } from '@/data/env/server';

function buildSslConfig() {
  // if (process.env.NODE_ENV !== 'production') return false; //Comment if you want to connect without CA, but you have to also disable SSL in supabase
  if (!env.DB_SSL_CA) return { rejectUnauthorized: true };

  const ca = env.DB_SSL_CA.includes('-----BEGIN')
    ? env.DB_SSL_CA
    : Buffer.from(env.DB_SSL_CA, 'base64').toString();

  return {
    rejectUnauthorized: true,
    ca,
  };
}

const pool = new Pool({
  connectionString: env.DB_URL,

  ssl: buildSslConfig(),
  // process.env.NODE_ENV === 'production'
  //   ? { rejectUnauthorized: true }
  //   : false,
});

export const db = drizzle(pool, { schema });
