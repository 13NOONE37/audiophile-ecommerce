import { AdjustedItem } from '@/features/checkout/types/checkout';
import IconError from '@/icons/IconError';

export function AdjustmentBanner({ items }: { items: AdjustedItem[] }) {
  return (
    <div
      className='mt-8 bg-surface-card rounded-[8px] p-6  md:px-7 lg:px-12 flex gap-4 items-start'
      data-purpose='adjustment-banner'
      role='alert'
    >
      <div className=''>
        <IconError className='fill-brand-primary' />
      </div>
      <div>
        <h3 className='subtitle-text text-body font-black uppercase mb-2'>
          Availability of items has changed
        </h3>
        <ul className='text-sm text-body/60 space-y-1 list-disc list-inside'>
          {items.map((item) => (
            <li key={item.name} className='font-bold text-black/80'>
              {item.availableQty === 0
                ? `"${item.name}" — removed due to warehouse stock levels`
                : `"${item.name}" — quantity lowered from ${item.requestedQty} to ${item.availableQty}`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
