import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';
import { ComponentPropsWithoutRef } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';

const baseStyle = 'subtitle-text text-body-inverted py-4 px-7.5 cursor-pointer';

const variants = {
  primary: 'bg-brand-primary hover:bg-brand-primary-light',
  secondary: 'bg-body hover:bg-[#4c4c4c]',
  outline:
    'bg-transparent text-body ring ring-body hover:bg-body hover:text-body-inverted',
};

export function Button({
  variant = 'primary',
  children,
  className,
  ...props
}: {
  variant: Variant;
} & ComponentPropsWithoutRef<'button'>) {
  return (
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  children,
  className,
  ...props
}: {
  variant: Variant;
} & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
