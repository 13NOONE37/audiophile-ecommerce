import { cn } from '@/lib/utils';

export default function PriceRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className='flex justify-between items-center'>
      <span className='text-sm font-medium text-black/50 uppercase'>
        {label}
      </span>
      <span
        className={cn(
          'text-sm font-bold uppercase',
          highlight ? 'text-brand-primary' : 'text-black',
        )}
      >
        {value}
      </span>
    </div>
  );
}
