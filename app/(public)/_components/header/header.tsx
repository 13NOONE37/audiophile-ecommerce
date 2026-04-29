import HeaderClient from './headerClient';
import { CartWrapper } from './CartWrapper';
import { Suspense } from 'react';

export default function Header({ className }: { className?: string }) {
  return (
    <HeaderClient className={className}>
      <Suspense>
        <CartWrapper />
      </Suspense>
    </HeaderClient>
  );
}
