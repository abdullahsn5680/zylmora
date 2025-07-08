import UpdateProductClient from './UpdateProductClient';
import { Suspense } from 'react';
export default function UpdateProductPage() {
  return (
    <div className="p-4">
       <Suspense fallback={<div>Loading page...</div>}>
      <UpdateProductClient />
      </Suspense>
    </div>
  );
}
