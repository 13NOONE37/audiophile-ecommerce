'use client';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';

export function QuantitySelectInput({
  value,
  setValue,
  allowZero = false,
  disabled = false,
  max = 5,
  className,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  allowZero?: boolean;
  max?: number;
  disabled?: boolean;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleDecrease = () => {
    const next = value - 1;
    if (next < (allowZero ? 0 : 1)) return;

    setValue(next);
    setInputValue(String(next));
  };
  const handleIncrease = () => {
    const next = value + 1;
    if (next > max) {
      toast('Quantity exceeds maximum', {
        description: `The maximum allowed quantity is ${max}.`,
      });
      return;
    }

    setValue(next);
    setInputValue(String(next));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
  };

  const handleBlur = () => {
    const parsed = Number(inputValue);
    if (
      inputValue === '' ||
      isNaN(parsed) ||
      parsed < (allowZero ? 0 : 1) ||
      parsed > max
    ) {
      setInputValue(String(value));
    } else {
      setValue(parsed);
    }
  };
  return (
    <div
      className={cn(
        'w-[120px] h-12 bg-surface-card grid grid-cols-3 subtitle-text text-center',
        className,
      )}
    >
      <button
        className='text-[#b5b5b5] cursor-pointer transition-all duration-300 ease-in-out hover:text-brand-primary active:text-brand-primary focus:bg-[#d9d9d9] outline-none border-none bg-transparent disabled:cursor-default disabled:text-[#b5b5b5] disabled:hover:text-[#b5b5b5] disabled:active:text-[#b5b5b5] disabled:focus:bg-transparent disabled:bg-transparent'
        onClick={handleDecrease}
        disabled={disabled || value <= (allowZero ? 0 : 1)}
      >
        −
      </button>
      <input
        type='number'
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className='font-inherit text-center w-full h-full outline-none border-none bg-transparent focus:bg-[#d9d9d9] disabled:cursor-not-allowed disabled:opacity-60 [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:m-0 [appearance:textfield]'
        disabled={disabled}
      />
      <button
        className='text-[#b5b5b5] cursor-pointer transition-all duration-300 ease-in-out hover:text-brand-primary active:text-brand-primary focus:bg-[#d9d9d9] outline-none border-none bg-transparent disabled:cursor-default disabled:text-[#b5b5b5] disabled:hover:text-[#b5b5b5] disabled:active:text-[#b5b5b5] disabled:focus:bg-transparent disabled:bg-transparent'
        onClick={handleIncrease}
        disabled={disabled}
      >
        +
      </button>
    </div>
  );
}
