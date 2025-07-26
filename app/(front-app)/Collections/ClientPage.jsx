'use client';

import { useContext, useState, useEffect } from 'react';
import { Funnel } from 'lucide-react';

import Align from '@/app/Components/Opeartions/Align';
import Filter from '@/app/Components/Opeartions/filter';
import SortBy from '@/app/Components/Opeartions/SortBY';
import Card from '@/app/Components/UI/Card/Card';
import Loader from '@/app/Components/Loader/loader';
import Nextpage from '@/app/Components/UI/NextPage/Nextpage';
import { FilterContext, GridContext, QueryContext, SlideBarContext } from '@/app/Context/contextProvider';
import { safeFetch } from '@/Utils/safeFetch';
export default function ClientPage() {
  const [query, setQuery] = useContext(QueryContext);
  const [grid,setGrid]=useContext(GridContext)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    fromProduct: 0,
    toProduct: 0,
    totalFilteredProducts: 0,
  });
 const [isSlide, setIsSlide] = useContext(SlideBarContext)
  const {
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedSortBy,
    selectedMinPrice,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedSizes,
    selectedHighPrice,
    setSelectedMinPrice,
    setSelectedHighPrice,
    setSelectedSortBy,
    
  } = useContext(FilterContext);


useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const subcategory = params.get('subcategory');
  const size = params.get('size')?.split(',') || [];
  const minPrice = params.get('minPrice');
  const highPrice = params.get('highPrice');
  const sortBy = params.get('sortBy');

  if (category) setSelectedCategory(category);
  if (subcategory) setSelectedSubCategory(subcategory);
  if (size.length) setSelectedSizes(size);
  if (minPrice) setSelectedMinPrice(minPrice);
  if (highPrice) setSelectedHighPrice(highPrice);
  if (sortBy) setSelectedSortBy(sortBy);
}, []);

useEffect(() => {
  if (!selectedCategory || !selectedSubCategory) {
    setQuery('');
    return;
  }

  const queryParams = new URLSearchParams({
    category: selectedCategory,
    subcategory: selectedSubCategory,
    size: selectedSizes?.join(',') || '',
    minPrice: selectedMinPrice?.toString() || '',
    highPrice: selectedHighPrice?.toString() || '',
    sortBy: selectedSortBy?.toString() || '',
  });

  const queryStr = queryParams.toString();

  setQuery(queryStr);
  window.history.replaceState(null, '', `?${queryStr}`);
}, [
  selectedCategory,
  selectedSubCategory,
  selectedSizes,
  selectedSortBy,
  selectedMinPrice,
  selectedHighPrice,
]);

  const performanFilter = (route) => {
    if (isSlide !=='false') {
      setIsSlide('false');
      setTimeout(() => {
        setIsSlide(route);
      }, 500);
    } else {
if(isSlide == 'false'){setIsSlide(route);}
      
    }
  };
  useEffect(() => {
    if (!query) return;

    const getData = async () => {
      setLoading(true);
      try {
        const res = await safeFetch(`/api/getCollectionsProducts?${query}`, {}, 360000);
        const data = res;

        if (data?.success && Array.isArray(data.products)) {
          setProducts(data.products);
          setPagination({
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            fromProduct: data.fromProduct,
            toProduct: data.toProduct,
            totalFilteredProducts: data.totalFilteredProducts,
          });
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="px-3 w-full mx-auto flex flex-col bg-slate-50 min-h-screen">

  <div className="filters w-full hidden mt-10 lg:flex items-center justify-between bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl p-6 mb-8 transition-all duration-500 hover:-translate-y-1">
    <div className="flex-1 mr-6">
      <Filter />
    </div>
    <div className="flex-shrink-0">
      <SortBy />
    </div>
  </div>

  
  <div className="separator w-full h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent mb-8 hidden lg:flex relative">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/30 to-transparent blur-sm"></div>
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full opacity-60"></div>
  </div>

  
  <div className="operations lg:hidden mt-5 flex z-10 justify-between items-center py-4 px-5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl mb-8 transition-all duration-500 hover:-translate-y-1">
    <button
      onClick={() => performanFilter('filter')}
      className="flex items-center gap-3 text-slate-700 font-semibold hover:text-slate-900 transition-all duration-300 group"
    >
      <div className="p-2.5 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 shadow-sm">
        <Funnel className="w-5 h-5 transition-transform duration-300 group-hover:rotate-3" />
      </div>
      <span className="hidden sm:inline transition-all duration-300 group-hover:translate-x-1 text-sm font-medium">Filter</span>
    </button>
    
    <div className="flex items-center gap-4">
      <Align Funtion={[grid, setGrid]} />
      <div className="w-px h-6 bg-slate-300/60"></div>
      <SortBy />
    </div>
  </div>

  
  <div className={`items w-full grid mt-5 justify-center gap-4 sm:gap-6 ${grid} lg:grid-cols-4 xl:grid-cols-4 transition-all duration-300`}>
    {!selectedCategory || !selectedSubCategory ? (
      <div className="col-span-full flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-lg border border-slate-200/50 transition-all duration-300 hover:shadow-xl">
        <div className="text-6xl mb-4 opacity-60">🏬</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Selection Required</h3>
        <p className="text-slate-500 text-center max-w-md">
          Please select both category and subcategory to view products.
        </p>
      </div>
    ) : products.length === 0 ? (
      <div className="col-span-full flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-lg border border-slate-200/50 transition-all duration-300 hover:shadow-xl">
        <div className="text-6xl mb-4 opacity-60">🚫</div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Collection Found</h3>
        <p className="text-slate-500 text-center max-w-md">
          No products found for this category/subcategory combination.
        </p>
        <div className="mt-4 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm">
          Try adjusting your filters
        </div>
      </div>
    ) : (
      products.map((data) => (
        <div key={data._id} className="group">
          <Card prop={data} />
        </div>
      ))
    )}
  </div>

  {pagination.totalFilteredProducts > 0 && (
    <div className="w-full flex justify-center items-center mt-12 mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 hover:shadow-xl transition-all duration-300">
        <Nextpage
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          from={pagination.fromProduct}
          to={pagination.toProduct}
          total={pagination.totalFilteredProducts}
        />
      </div>
    </div>
  )}
</div>
  );
}
