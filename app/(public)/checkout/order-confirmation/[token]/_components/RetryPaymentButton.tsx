'use client';
import { Button } from '@/components/button';
import { initializePayment } from '@/features/checkout/actions/initializePayments';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

export function RetryPaymentButton({
  orderId,
  confirmationToken,
  className = '',
}: {
  orderId: string;
  confirmationToken: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRetry = () => {
    startTransition(async () => {
      const result = await initializePayment(orderId, confirmationToken);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      router.push(result.data.url);
    });
  };

  return (
    <Button onClick={handleRetry} disabled={isPending} className={className}>
      {isPending ? 'Redirecting...' : 'Complete payment'}
    </Button>
  );
}
