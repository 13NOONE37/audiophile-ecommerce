import { env } from '@/data/env/server';
import { db } from '@/db/db';
import { getCategoryGlobalTag } from '@/features/categories/db/cache';
import { getProductGlobalTag } from '@/features/products/db/cache';
import { sql } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await db.execute(sql`SELECT 1`);

    revalidateTag(getCategoryGlobalTag(), 'max');
    revalidateTag(getProductGlobalTag(), 'max');

    return Response.json({
      ok: true,
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cron/revalidate]', error);
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
