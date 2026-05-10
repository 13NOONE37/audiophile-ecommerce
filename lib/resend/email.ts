// lib/email.ts
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { resend } from './resend';

type SendOrderEmailParams = {
  to: string;
  orderNumber: string;
  firstName: string;
  items: {
    productName: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalAmount: number;
  address: {
    street: string;
    zip: string;
    city: string;
  };
};

export async function sendOrderConfirmationEmail(params: SendOrderEmailParams) {
  const { error } = await resend.emails.send({
    from: 'Audiphile Ecommerce <orders@audiophile-ecommerce-bice.vercel.app>',
    to: params.to,
    subject: `Order confirmation #${params.orderNumber}`,
    react: OrderConfirmationEmail(params),
  });

  if (error) {
    // Nie rzucaj — nie chcesz żeby błąd emaila cofnął transakcję DB
    console.error('[sendOrderConfirmationEmail]', error);
  }
}
