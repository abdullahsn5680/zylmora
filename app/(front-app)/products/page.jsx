import { Suspense } from 'react';
import ProdcutPage from './Productpage';
import Loader from '@/app/Components/Loader/loader';
export default function Page() {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <ProdcutPage/>
    </Suspense>
  );
}
