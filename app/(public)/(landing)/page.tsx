import Categories from '../_components/categories';
import Outro from '../_components/outro';

export default function HomePage() {
  return (
    <>
      <div className='mt-23 md:mt-37 lg:mt-50'>
        <Categories />
      </div>
      <div className='mb-30 md:mb-24 lg:mb-50 mt-24 md:mt-30 lg:mt-50'>
        <Outro />
      </div>
    </>
  );
}
