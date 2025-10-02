'use client';

import dynamic from 'next/dynamic';

const SlideBar = dynamic(() => import('@/app/Components/UI/MObile/SlideBar'), { ssr: false });

export default function SlideBarWrapper() {
  return <SlideBar />;
}
