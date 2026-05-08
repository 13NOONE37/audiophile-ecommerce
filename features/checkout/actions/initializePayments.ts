import { env } from '@/data/env/client';
import {
  ActionResult,
  err,
  ErrorCode,
  ok,
} from '@/features/cart/lib/types/actionResults';
import { stripe } from '@/lib/stripe/stripe';

export async function initializePayment(
  orderId: string,
): Promise<ActionResult<{ url: string }>> {
  return ok({ url: '' });
  //   try {
  //     const order: any = {};
  //     // const order = await getOrderById(orderId);
  //     if (!order) return err('Order does not exist', ErrorCode.UNEXPECTED);

  //     const appUrl = env.NEXT_PUBLIC_APP_URL!;

  //     const session = await stripe.checkout.sessions.create({
  //       mode: 'payment',
  //       payment_method_types: ['card', 'blik', 'p24'],
  //       customer_email: order.email,
  //       line_items: order.items.map((item) => ({
  //         quantity: item.quantity,
  //         price_data: {
  //           currency: 'usd',
  //           unit_amount: Math.round(item.price * 100),
  //           product_data: {
  //             name: item.product.name,
  //           },
  //         },
  //       })),
  //       metadata: {
  //         orderId: order.id,
  //         orderNumber: order.orderNumber,
  //       },
  //       success_url: `${appUrl}/order-confirmation/${order.confirmationToken}`,
  //       cancel_url: `${appUrl}/checkout?cancelled=true`,
  //     });

  //     if (!session.url)
  //       return err('Could not process payment', ErrorCode.UNEXPECTED);

  //     return ok({ url: session.url });
  //   } catch (error) {
  //     console.error('[initializePayment', error);
  //     return err('Could not connect to payment service', ErrorCode.UNEXPECTED);
  //   }
}
