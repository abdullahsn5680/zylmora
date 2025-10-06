'use client';
import {  useMemo } from 'react';
import dynamic from 'next/dynamic';
import HeroSkeleton from './Components/pages/Home/HeroSkeleton';
import MainContentSkeleton from './Components/pages/Home/MainContentSkeleton';
import ExploreMoreSkeleton from './Components/pages/Home/ExploreMoreSkeleton';

const Hero = dynamic(() => import('./Components/pages/Home/Hero'), {
  loading: () => <div><HeroSkeleton/></div>,
});
const MainContent = dynamic(() => import('./Components/pages/Home/MainContent'), {
  loading: () => <div className="p-10 text-center"><MainContentSkeleton/></div>,
});
const ExploreMore = dynamic(() => import('./Components/pages/Home/ExploreMore'), {
  loading: () => <div className="p-10 text-center"><ExploreMoreSkeleton/></div>,
});


export default function HomeClient({content}) {




  return (

    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>
      <Hero content={content} />
      <MainContent content={content} />
      <ExploreMore />
    </div>
  );
}
