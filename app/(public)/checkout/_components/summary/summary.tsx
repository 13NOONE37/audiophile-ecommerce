import Image from 'next/image';
import { Button } from '@/components/button';
import { formatPrice } from '@/lib/formatters';
import PriceRow from './_components/priceRow';
import { CartItemsWithDetails } from '@/features/cart/actions/carts';
import { ProductImage } from '@/components/ProductImage';

interface Props {
  items: CartItemsWithDetails;
  totalPrice: number;
  vatPrice: number;
  shippingPrice: number;
  grandTotalPrice: number;
}

export default function Summary({
  items,
  totalPrice,
  vatPrice,
  shippingPrice,
  grandTotalPrice,
}: Props) {
  return (
    <div className='bg-white rounded-lg p-6 md:p-8 flex flex-col gap-8 self-start'>
      <h3 className='heading-6 uppercase'>Summary</h3>

      {items.length > 0 ? (
        <ul className='flex flex-col gap-6'>
          {items.map((item) => (
            <li
              key={item.variantId}
              className='grid grid-cols-[64px_1fr_auto] gap-4 items-center'
            >
              <ProductImage
                product={item.variant.product}
                role='cart'
                width={64}
                height={64}
                sizes='64px'
                className='rounded-[10px]'
              />

              <div className='flex flex-col'>
                <span className='text-sm font-bold uppercase text-black'>
                  {item.variant.product.short_name || item.variant.product.name}
                </span>
                <span className='text-sm font-bold text-black/50'>
                  {formatPrice(Number(item.variant.price))}
                </span>
              </div>
              <span className='text-sm font-bold text-black/50'>
                x{item.quantity}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <span className='text-sm font-medium text-black/50'>
          Your cart is empty
        </span>
      )}

      <div className='flex flex-col gap-2'>
        <PriceRow label='Total' value={formatPrice(totalPrice)} />
        <PriceRow label='Shipping' value={formatPrice(shippingPrice)} />
        <PriceRow label='VAT (included)' value={formatPrice(vatPrice)} />
        <div className='mt-4'>
          <PriceRow
            label='Grand Total'
            value={formatPrice(grandTotalPrice)}
            highlight
          />
        </div>
      </div>

      <Button
        type='submit'
        disabled={items.length === 0}
        className='w-full uppercase'
      >
        Continue & Pay
      </Button>
    </div>
  );
}
