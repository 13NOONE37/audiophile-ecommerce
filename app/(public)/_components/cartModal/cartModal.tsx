import React from 'react';

const CartModal = ({
  showCart,
  ref,
  children,
}: {
  showCart: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) => {
  if (!ref) return null;

  return (
    <div
      className={`fixed 
          top-28.5 lg:top-32.5 
          left-0 xs:left-6 md:left-auto
          right-0 xs:right-6 md:right-10 
          md:w-96 
          bg-white rounded-lg`}
      ref={ref}
    >
      {children}
    </div>
  );
};
CartModal.displayName = 'CartModal';
export default CartModal;
