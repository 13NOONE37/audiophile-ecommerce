export function ProductDetails({
  features,
  inTheBox,
}: {
  features: string | null;
  inTheBox: { label: string; quantity: number }[] | null;
}) {
  return (
    <section className='grid lg:grid-cols-[1fr_auto] gap-22 md:gap-30 lg:gap-31'>
      <div className='flex flex-col'>
        <h2 className='heading-3 text-body uppercase'>Features</h2>
        <p className='text-content text-body/50 whitespace-pre-line mt-6 md:mt-8'>
          {features}
        </p>
      </div>
      <div className='flex flex-col md:flex-row lg:flex-col'>
        <h2 className='heading-3 text-body uppercase'>In The Box</h2>
        <ul className='text-content text-body md:ml-42.5 lg:ml-0 mt-6 md:mt-0 lg:mt-8'>
          {inTheBox?.map((item) => (
            <li key={item.label}>
              <span className='text-brand-primary'>{item.quantity}x </span>
              <span className='text-body/50 ml-6'>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
