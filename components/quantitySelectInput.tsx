'use client';
import { cn } from '@/lib/utils';
import { Dispatch, SetStateAction, useState } from 'react';

export function QuantitySelectInput({
  value,
  setValue,
  className,
}: {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState(String(value));

  const handleDecrease = () => {
    const next = value - 1;
    setValue(next);
    setInputValue(String(next));
  };
  const handleIncrease = () => {
    const next = value + 1;
    setValue(next);
    setInputValue(String(next));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    const parsed = Number(raw);
    if (raw !== '' && !isNaN(parsed)) {
      setValue(parsed);
    }
  };

  const handleBlur = () => {
    if (inputValue === '' || isNaN(Number(inputValue))) {
      setInputValue(String(value));
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
        className='text-[#b5b5b5] cursor-pointer transition-all duration-300 ease-in-out hover:text-brand-primary active:text-brand-primary disabled:cursor-default disabled:text-[#b5b5b5] focus:bg-[#d9d9d9] outline-none border-none bg-transparent'
        onClick={handleDecrease}
        disabled={value <= 1}
      >
        −
      </button>
      <input
        type='number'
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className='font-inherit text-center w-full h-full outline-none border-none bg-transparent focus:bg-[#d9d9d9] [&::-webkit-outer-spin-button]:[-webkit-appearance:none] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:[-webkit-appearance:none] [&::-webkit-inner-spin-button]:m-0 [appearance:textfield]'
      />
      <button
        className='text-[#b5b5b5] cursor-pointer transition-all duration-300 ease-in-out hover:text-brand-primary active:text-brand-primary focus:bg-[#d9d9d9] outline-none border-none bg-transparent'
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  );
}
