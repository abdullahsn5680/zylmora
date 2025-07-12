import { Suspense } from 'react';
import ClientPage from './ClientPage'; 
import Loader from '@/app/Components/Loader/loader';
export default function Page() {
  return (
    <Suspense fallback={<div><Loader/></div>}>
      <ClientPage />
    </Suspense>
  );
}
