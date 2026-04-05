import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FocusTrap } from 'focus-trap-react';
import IconOrderConfirmation from '@/icons/IconOrderConfirmation';
import { Button } from '@/components/button';
import { formatPrice } from '@/lib/formatters';
import { UseDetectOutsideClick } from '@/hooks/UseDetectOutsideClick';
import { blockBodyScroll, enableBodyScroll } from '@/lib/bodyScroll';
import { CartItemsWithDetails } from '@/features/cart/actions/carts';
import { ProductImage } from '@/components/ProductImage';

interface Props {
  items: CartItemsWithDetails;
  grandTotalPrice: number;
  onClose: () => void;
}

export default function ConfirmationModal({
  items,
  grandTotalPrice,
  onClose,
}: Props) {
  const [showMore, setShowMore] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  UseDetectOutsideClick(modalRef, onClose);

  useEffect(() => {
    blockBodyScroll();
    return () => {
      enableBodyScroll();
    };
  }, []);

  const visibleItems = showMore ? items : items.slice(0, 1);
  const hiddenCount = items.length - 1;

  return (
    <FocusTrap focusTrapOptions={{ allowOutsideClick: true }}>
      <div className='fixed inset-0 bg-black/40 z-50 grid place-items-center overflow-auto p-6'>
        <div
          ref={modalRef}
          className='bg-white rounded-lg p-8 md:p-12 w-full max-w-[540px]'
        >
          <IconOrderConfirmation />

          <h4 className='text-[24px] font-bold leading-7 tracking-[0.86px] uppercase mt-6'>
            Thank you
            <br />
            for your order
          </h4>

          <p className='content-text text-black/50 mt-4'>
            You will receive an email confirmation shortly.
          </p>

          <div className='mt-6 rounded-lg overflow-hidden flex flex-col md:flex-row'>
            {/* Items list */}
            <div className='bg-surface-card flex-1 p-6'>
              <ul className='flex flex-col gap-4'>
                {visibleItems.map((item) => (
                  <li
                    key={item.variantId}
                    className='grid grid-cols-[48px_1fr_auto] gap-4 items-center'
                  >
                    <ProductImage
                      product={item.variant.product}
                      role='cart'
                      width={48}
                      height={48}
                    />

                    <div className='flex flex-col'>
                      <span className='text-sm font-bold uppercase text-black'>
                        {item.variant.product.short_name}
                      </span>
                      <span className='text-xs font-bold text-black/50'>
                        {formatPrice(Number(item.variant.price))}
                      </span>
                    </div>
                    <span className='text-sm font-bold text-black/50'>
                      x{item.quantity}
                    </span>
                  </li>
                ))}
              </ul>

              {items.length > 1 && (
                <div className='mt-4 border-t border-black/10 pt-3 text-center'>
                  <button
                    type='button'
                    onClick={() => setShowMore((v) => !v)}
                    className='text-xs font-bold text-black/50 hover:text-brand-primary transition-colors cursor-pointer'
                  >
                    {showMore
                      ? 'View less'
                      : `and ${hiddenCount} other item(s)`}
                  </button>
                </div>
              )}
            </div>

            {/* Grand total */}
            <div className='bg-black flex flex-col justify-center gap-2 p-6 md:min-w-[198px]'>
              <span className='text-sm font-medium text-white/50 uppercase'>
                Grand Total
              </span>
              <span className='text-lg font-bold text-white uppercase'>
                {formatPrice(grandTotalPrice)}
              </span>
            </div>
          </div>

          <Button onClick={onClose} className='w-full mt-6 uppercase'>
            Back to Home
          </Button>
        </div>
      </div>
    </FocusTrap>
  );
}
