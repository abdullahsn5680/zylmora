'use client'
import React,{useRef,useState,useEffect} from 'react'
import Card from '../../UI/Card/Card';
import { safeFetch } from '@/Utils/safeFetch';
import {ChevronLeft, ChevronRight} from 'lucide-react'

function RelatedProdcuts({prop}) {
    const {pid ,category,subcategory} =prop
    const scrollRef = useRef(null);
    const [relatedProducts, setRP] = useState([]);
       useEffect(() => {
    if (!pid || !category || !subcategory) return;

    const getRp = async () => {
      const Query = new URLSearchParams({
        category: category,
        subcategory: subcategory,
      });
      const res = await safeFetch(`/api/RelatedProducts/?${Query.toString()}`);
      const data = res
      if (data.success) {
        const related = data.products.filter(p => p.pid !== pid);
        setRP(related);
      }
    };

    getRp();
  }, [pid, category, subcategory]);

  return (
 <div className="related_products max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
       
         <div className="mb-8 flex items-center justify-between bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div>
            <h3 className="text-xl flex gap-2 items-center lg:text-3xl font-bold text-slate-800 mb-2 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="#FF6B6B">
  <path d="M16 4L8 12v28a4 4 0 004 4h24a4 4 0 004-4V12l-8-8H16zm8 34a6 6 0 100-12 6 6 0 000 12zM12 14h24v4H12v-4z"/>
</svg>
 Related Products</h3>
            <p className="text-sm lg:text-base text-slate-600">
              Discover similar products you might like
            </p>
          </div>
       
        </div>

     <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit transition-all hover:shadow-lg">
  
  <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white via-white/95 via-white/80 via-white/60 via-white/30 to-transparent z-1"></div>
  
  <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white via-white/95 via-white/80 via-white/60 via-white/30 to-transparent z-1"></div>

  <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 z-2 -translate-y-1/2">
    <button 
      onClick={() => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })}
      className="bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-sm hover:shadow-lg px-3 py-3 rounded-md transition-all duration-300 border border-slate-200"
    >
      <ChevronLeft size={20} />
    </button>
    <button 
      onClick={() => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })}
      className="bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-sm hover:shadow-lg px-3 py-3 rounded-md transition-all duration-300 border border-slate-200"
    >
      <ChevronRight size={20} />
    </button>
  </div>

  
  <div ref={scrollRef} className="flex overflow-x-auto gap-4 lg:gap-6 px-6 lg:px-24 no-scrollbar scroll-smooth">
    {relatedProducts.length > 0 ? (
      relatedProducts.map((item) => (
        <div className="py-4 lg:py-6 transition-transform hover:scale-105" key={item._id}>
          <Card prop={item} isRelated={true} />
        </div>
      ))
    ) : (
      <div className="flex justify-center items-center h-full w-full py-12">
        <div className="text-center space-y-4">
          <div className="text-4xl">🛍️</div>
          <h4 className="text-xl font-semibold text-slate-800">No Related Products</h4>
          <p className="text-slate-500 text-sm">Check back later for similar items</p>
        </div>
      </div>
    )}
  </div>
</div>
      </div>
  )
}

export default RelatedProdcuts