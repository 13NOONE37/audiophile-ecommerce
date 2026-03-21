'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function NewProductBadge({
  isNew,
  newUntil,
  className,
}: {
  isNew: boolean;
  newUntil: Date | null;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isNew || !newUntil) {
      setIsVisible(false);
      return;
    }

    setIsVisible(new Date() <= new Date(newUntil));
  }, [isNew, newUntil]);

  if (!isVisible) return null;
  return (
    <span
      className={cn(
        'overline-text text-brand-primary font-normal uppercase',
        className,
      )}
    >
      New product
    </span>
  );
}
