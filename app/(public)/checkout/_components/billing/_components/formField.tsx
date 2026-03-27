import { ChangeEvent } from 'react';
import { CheckoutFormState } from '../../checkout/types';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: keyof CheckoutFormState;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
}

export default function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className='flex justify-between items-center'>
        <label
          htmlFor={name}
          className={cn(
            'text-xs font-bold tracking-[-0.21px]',
            error ? 'text-red-500' : 'text-black',
          )}
        >
          {label}
        </label>
        {error && (
          <span className='text-xs font-medium text-red-500 italic'>
            {error}
          </span>
        )}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'h-14 px-6 rounded-lg border font-bold text-sm caret-brand-primary outline-none transition-colors',
          'placeholder:font-medium placeholder:text-black/40',
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-[#cfcfcf] focus:border-brand-primary',
        )}
      />
    </div>
  );
}
