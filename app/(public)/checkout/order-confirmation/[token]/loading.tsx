import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <section className='grid place-items-center mt-4 md:mt-8.5 lg:mt-20'>
      <LoadingSpinner />
    </section>
  );
}
