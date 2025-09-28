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

export default function HomeClient() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useContext(LoaderContext);
  const { session } = useContext(UserContext);
  const router=useRouter()
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

      
      <div className="relative  md:py-8  sm:px-6 lg:px-8 text-gray-800">
        <div className="max-w-7xl mx-auto">
          
          
          <div className="relative mb-12 md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60">
            <div className="relative aspect-[2/3] sm:aspect-[16/6] lg:aspect-[21/9]">
              <Image
                src="/banner/banner.png"
                alt="Premium Fashion Collection"
                fill
                className="object-cover"
                priority
              />
             
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              
            
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-2xl mx-auto px-8 text-center lg:text-left lg:mx-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Premium Fashion Collection</span>
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
                    Discover Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Perfect Style
                    </span>
                  </h1>
                  
                  <p className="text-lg text-gray-200 mb-8 leading-relaxed max-w-lg">
                    Explore our curated collection of premium fashion items, designed for those who appreciate quality and style.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <button className="group relative px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold transition-all duration-300 hover:scale-105 overflow-hidden shadow-xl">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative flex items-center justify-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Shop Collection
                      </span>
                    </button>
                    
                    <button className="group relative px-8 py-4 bg-transparent text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm">
                      <span className="relative flex items-center justify-center gap-2">
                        <Star className="w-5 h-5" />
                        View Lookbook
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

     

     
      <div className="containers w-full px-2 md:px-8 lg:px-16 xl:px-20 py-12">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-2xl mb-6 border border-gray-200/60">
            <Star className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-600">Featured Collections</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-800 tracking-tight">
            Premium Fashion
          </h2>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6" />
          
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-600">
            Explore our handpicked collections of premium fashion items, crafted with attention to detail and designed for the modern lifestyle.
          </p>
        </div>

        
        <div className="space-y-20">
          {content?.Items?.map((data, index) => (
            <div
              key={data.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'both'
              }}
            >
              <CardContainer prop={data} />
            </div>
          ))}
        </div>

       
        <div className="text-center mt-24">
          <div className="inline-block p-10 bg-white/70 backdrop-blur-sm rounded-3xl border border-gray-200/60 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-black mb-4 text-gray-800">
              Ready to Explore More?
            </h3>
            
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              Discover thousands of premium products across all categories and find your perfect style.
            </p>
            
            <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 overflow-hidden shadow-xl hover:shadow-2xl">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <button  onClick={()=>router.push('./Catagories')} className="relative flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                
                Browse All Collections
                <TrendingUp className="w-6 h-6" />
              </button>
            </button>
          </div>
        </div>
      </div>


      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Smooth transitions */
        * {
          transition-property: background-color, border-color, color, fill, stroke, transform, box-shadow;
          transition-duration: 300ms;
          transition-timing-function: ease-out;
        }
      `}</style>
    </div>
  );
}