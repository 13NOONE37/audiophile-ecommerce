import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';

export function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: {
  variant: 'primary' | 'secondary';
} & ComponentPropsWithoutRef<'button'>) {
  const baseStyle =
    'subtitle-text text-body-inverted py-4 px-7.5 cursor-pointer';
  const variants = {
    primary: 'bg-brand-primary',
    secondary: '',
  };
  return (
    <button className={cn(baseStyle, variants[variant], className)}>
      {children}
    </button>
  );
}
