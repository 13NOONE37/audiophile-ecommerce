import { env } from '@/data/env/server';
import { db } from '@/db/db';
import { orders, productVariants } from '@/db/schema';
import { sendOrderConfirmationEmail } from '@/lib/resend/email';
import { stripe } from '@/lib/stripe/stripe';
import { eq, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      env.STRIPE_WEBHOOK_KEY!,
    );
  } catch (error) {
    console.error('[Stripe webhook] Invalid signature', error);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) break;

        const order = await db.query.orders.findFirst({
          where: eq(orders.id, orderId),
          with: { items: true },
        });

        if (!order || order.status === 'paid') break;

        await db.transaction(async (tx) => {
          await tx
            .update(orders)
            .set({ status: 'paid' })
            .where(eq(orders.id, orderId));

          // await sendOrderConfirmationEmail({
          //   to: order.email,
          //   orderNumber: order.orderNumber,
          //   items: order.items.map((item) => ({
          //     priceAtPurchase: Number(item.priceSnapshot),
          //     quantity: item.quantity,
          //     productName: item.productNameSnapshot,
          //   })),
          //   totalAmount: Number(order.totalAmount),
          //   firstName: order.firstName,
          //   address: {
          //     city: order.city,
          //     zip: order.zip,
          //     street: order.street,
          //   },
          // });
        });
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object;
        const fullSession = await stripe.checkout.sessions.retrieve(session.id);
        const orderId = fullSession.metadata?.orderId;

        if (!orderId) break;

        const order = await db.query.orders.findFirst({
          where: eq(orders.id, orderId),
          with: { items: true },
        });

        if (!order || order.status !== 'pending') break;

        await db.transaction(async (tx) => {
          await Promise.all(
            order.items.map((item) =>
              tx
                .update(productVariants)
                .set({ stock: sql`stock + ${item.quantity}` })
                .where(eq(productVariants.id, item.variantIdSnapshot)),
            ),
          );

          await tx
            .update(orders)
            .set({ status: 'failed' })
            .where(eq(orders.id, orderId));
        });
        break;
      }
    }
  } catch (error) {
    console.error('[stripe webhook]', error);
    // Zwróć 200 żeby Stripe nie ponawiał — loguj błąd osobno
  }
  return new Response('OK', { status: 200 });
}
