'use client';
import { useEffect, useContext, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FilterContext } from './Context/contextProvider';
import HeroSkeleton from './Components/pages/Home/HeroSkeleton';
import MainContentSkeleton from './Components/pages/Home/MainContentSkeleton';
import ExploreMoreSkeleton from './Components/pages/Home/ExploreMoreSkeleton';

const Hero = dynamic(() => import('./Components/pages/Home/Hero'), {
  loading: () => <HeroSkeleton />,
});
const MainContent = dynamic(() => import('./Components/pages/Home/MainContent'), {
  loading: () => <MainContentSkeleton />,
});
const ExploreMore = dynamic(() => import('./Components/pages/Home/ExploreMore'), {
  loading: () => <ExploreMoreSkeleton />,
});

export default function HomeClient({ content }) {
  const {
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedSizes,
    setSelectedSortBy,
    setSelectedMinPrice,
    setSelectedHighPrice,
  } = useContext(FilterContext);

  useEffect(() => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedHighPrice('');
    setSelectedMinPrice('');
    setSelectedSizes([]);
    setSelectedSortBy('');
  }, []);

 

  if (!content)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        <HeroSkeleton />
        <MainContentSkeleton />
        <ExploreMoreSkeleton />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <Hero content={content} />
      <MainContent content={content} />
      <ExploreMore />
    </div>
  );
}
