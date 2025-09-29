'use client';
import { safeFetch } from '@/Utils/safeFetch';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './Context/contextProvider';
import Banner from '@/app/Components/UI/Banner';
import CardContainer from '@/app/Components/UI/Container/CardContainer';
import Loader from '@/app/Components/Loader/loader';
import { LoaderContext } from '@/app/Context/contextProvider';
import { FilterContext } from './Context/contextProvider';
import { Sparkles, TrendingUp, Star, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Hero from './Components/pages/Home/Hero';
import ExploreMore from './Components/pages/Home/ExploreMore';
import MainContent from './Components/pages/Home/MainContent';

export default function HomeClient() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useContext(LoaderContext);
  const { session } = useContext(UserContext);

  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSizes,
    setSelectedSizes,
    selectedSortBy,
    setSelectedSortBy,
    selectedMinPrice,
    setSelectedMinPrice,
    selectedHighPrice,
    setSelectedHighPrice,
  } = useContext(FilterContext);


  useEffect(() => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSelectedHighPrice('');
    setSelectedMinPrice('');
    setSelectedSizes('');
    setSelectedSortBy('');
  }, []);

  useEffect(() => {
    try {
      setLoading(true);

      const fetch = async () => {
        const data = await safeFetch(`/api/getHome`, {}, 3600000, session);
        if (data) {
          setContent(data);
          setLoading(false);
        }
      };

      if (session) {
        fetch();
      } else {
        setTimeout(() => {
          fetch();
        }, 500);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
      setLoading(false);
    }
  }, [session]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-white to-gray-50">
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-green-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

     <Hero content={content} />
     <MainContent content={content}/>
     <ExploreMore/>

    </div>
  );
}