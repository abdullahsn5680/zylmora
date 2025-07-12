import UpdateProductClient from './UpdateProductClient';
import { Suspense } from 'react';
import Loader from '@/app/Components/Loader/loader';

export default function UpdateProductPage() {
  return (
    <div className="p-4">
       <Suspense fallback={<div><Loader/></div>}>
      <UpdateProductClient />
      </Suspense>
    </div>
  );
}
