import { cn } from '@/lib/utils';
import { ChangeEvent } from 'react';

interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: RadioOptionProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-4 h-14 px-6 rounded-lg border font-bold text-sm cursor-pointer transition-colors',
        checked
          ? 'border-brand-primary'
          : 'border-[#cfcfcf] hover:border-brand-primary',
      )}
    >
      <input
        type='radio'
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className='accent-brand-primary w-4 h-4'
      />
      {label}
    </label>
  );
}
