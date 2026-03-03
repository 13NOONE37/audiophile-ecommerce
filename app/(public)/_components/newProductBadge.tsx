'use client';

import { useEffect, useState } from 'react';

export function NewProductBadge({
  isNew,
  newUntil,
}: {
  isNew: boolean;
  newUntil: Date | null;
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
    <span className='overline-text text-brand-primary font-normal uppercase'>
      New product
    </span>
  );
}
