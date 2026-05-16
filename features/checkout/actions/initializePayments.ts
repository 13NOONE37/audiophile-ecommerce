'use server';
import { env } from '@/data/env/client';
import { env as serverEnv } from '@/data/env/server';
import { db } from '@/db/db';
import { orders } from '@/db/schema';
import {
  ActionResult,
  err,
  ErrorCode,
  ok,
} from '@/features/cart/lib/types/actionResults';
import { ajPayment } from '@/lib/arcjet/arcjet';
import { stripe } from '@/lib/stripe/stripe';
import { request } from '@arcjet/next';
import { and, eq, gt } from 'drizzle-orm';

export async function initializePayment(
  orderId: string,
  confirmationToken: string,
): Promise<ActionResult<{ url: string }>> {
  const req = await request();
  const decision = await ajPayment.protect(req, { requested: 1 });

  if (decision.isDenied()) {
    return err('Too many requests', ErrorCode.UNEXPECTED);
  }

  try {
    const order = await db.query.orders.findFirst({
      where: and(
        eq(orders.id, orderId),

        eq(orders.confirmationToken, confirmationToken),
        gt(orders.confirmationTokenExpiresAt, new Date()),
      ),
      with: {
        items: true,
      },
    });
    if (!order) return err('Order does not exist', ErrorCode.UNEXPECTED);

    const appUrl = env.NEXT_PUBLIC_APP_URL!;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      expires_at: Math.floor(Date.now() / 1000) + 60 * 30,

      customer_email: order.email,
      line_items: [
        ...order.items.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(item.priceSnapshot) * 100),
            product_data: {
              name: item.productNameSnapshot,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(serverEnv.SHIPPING_COST) * 100),
            product_data: {
              name: 'Shipping cost',
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      payment_intent_data: {
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      },
      success_url: `${appUrl}/checkout/order-confirmation/${order.confirmationToken}`,
      cancel_url: `${appUrl}/checkout/order-confirmation/${order.confirmationToken}`, //TODO: maybe page where user can cancel this order
    });

    await db
      .update(orders)
      .set({ stripeSessionId: session.id })
      .where(eq(orders.id, orderId));

    if (!session.url)
      return err('Could not process payment', ErrorCode.UNEXPECTED);

    return ok({ url: session.url });
  } catch (error) {
    console.error('[initializePayment', error);
    return err('Could not connect to payment service', ErrorCode.UNEXPECTED);
  }
}
