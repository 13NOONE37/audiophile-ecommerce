import { ProductImage } from '@/components/ProductImage';
import { db } from '@/db/db';
import { ORDER_STATUSES, orders, productImages } from '@/db/schema';
import { uuidSchema } from '@/features/checkout/schema/checkout';
import IconOrderConfirmation from '@/icons/IconOrderConfirmation';
import { formatPrice } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { and, eq, gt } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!uuidSchema.safeParse(token).success) notFound();

  const order = await getOrderByToken(token);

  if (!order) notFound();
  return (
    <section className='py-4 md:py-12 lg:py-20'>
      <a
        href={'/'}
        className='content-text text-black/50 hover:text-brand-primary cursor-pointer'
      >
        Go Home
      </a>

      <div className='mt-6 lg:mt-9'>
        <IconOrderConfirmation />
        <h1 className='heading-2 text-body uppercase mt-3'>
          Thank you for your order
        </h1>

        <p className='content-text text-body/50 mt-1'>
          You will receive an email confirmation shortly.
        </p>
      </div>

      <div className='heading-5 flex items-center mt-6 lg:mt-9'>
        <h2 className='text-body'>Order status:</h2>
        <span
          className={cn(
            ' text-correct uppercase',
            order.status === ORDER_STATUSES.CANCELLED ||
              (order.status === ORDER_STATUSES.FAILED && 'text-error'),
            order.status === ORDER_STATUSES.PENDING && 'text-warning',
          )}
        >
          {order.status}
        </span>
      </div>

      <div className='mt-6 rounded-lg overflow-hidden flex flex-col md:flex-row'>
        {/* Items list */}
        <div className='bg-surface-card flex-1 p-6'>
          <ul className='flex flex-col gap-4'>
            {order.items.map((item) => (
              <li
                key={item.id}
                className='grid grid-cols-[48px_1fr_auto] gap-4 items-center'
              >
                {item.variant && (
                  <ProductImage
                    product={item.variant.product}
                    role='cart'
                    width={48}
                    height={48}
                  />
                )}

                <div className='flex flex-col'>
                  <span className='text-sm font-bold uppercase text-black'>
                    {item.productNameSnapshot} ({item.skuSnapshot})
                  </span>
                  <span className='text-xs font-bold text-black/50'>
                    {formatPrice(Number(item.priceSnapshot))}
                  </span>
                </div>
                <span className='text-sm font-bold text-black/50'>
                  x{item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Grand total */}
        <div className='bg-black flex flex-col justify-center gap-2 p-6 md:min-w-[198px]'>
          <span className='text-sm font-medium text-white/50 uppercase'>
            Grand Total
          </span>
          <span className='text-lg font-bold text-white uppercase'>
            {formatPrice(Number(order.totalAmount))}
          </span>
        </div>
      </div>
    </section>
  );
}

async function getOrderByToken(token: string) {
  return await db.query.orders.findFirst({
    with: {
      items: {
        with: {
          variant: {
            with: {
              product: {
                with: {
                  images: {
                    where: eq(productImages.role, 'cart'),
                  },
                },
              },
            },
          },
        },
      },
    },
    where: and(
      eq(orders.confirmationToken, token),
      gt(orders.confirmationTokenExpiresAt, new Date()),
    ),
  });
}
