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

const variantsDisabled: Record<Variant, string> = {
  primary: 'bg-brand-primary cursor-not-allowed opacity-60',
  secondary: 'bg-body cursor-not-allowed opacity-60',
  outline:
    'bg-transparent text-body ring ring-body cursor-not-allowed opacity-60',
};

export function Button({
  variant = 'primary',
  children,
  className,
  disabled,
  ...props
}: {
  variant?: Variant;
} & ComponentPropsWithoutRef<'button'>) {
  const classes = cn(
    baseStyle,
    disabled ? variantsDisabled[variant] : variants[variant],
    className,
  );

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  children,
  className,
  disabled,
  ...props
}: {
  variant?: Variant;
  disabled?: boolean;
} & ComponentPropsWithoutRef<typeof Link>) {
  const classes = cn(
    baseStyle,
    variants[variant],
    className,
    disabled ? 'pointer-events-none opacity-60' : undefined,
  );

  return (
    <Link
      className={classes}
      aria-disabled={disabled ? 'true' : undefined}
      tabIndex={disabled ? -1 : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
