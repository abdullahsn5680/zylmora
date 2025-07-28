'use client';

import { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Ban, Funnel, Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import Filter from '@/app/Components/Opeartions/filter';
import SortBy from '@/app/Components/Opeartions/SortBY';
import Card from '@/app/Components/UI/Card/Card';
import Loader from '@/app/Components/Loader/loader';
import Nextpage from '@/app/Components/UI/NextPage/Nextpage';
import { FilterContext, GridContext, QueryContext, SlideBarContext } from '@/app/Context/contextProvider';
import { safeFetch } from '@/Utils/safeFetch';

const INITIAL_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  fromProduct: 0,
  toProduct: 0,
  totalFilteredProducts: 0,
};

const SLIDE_TRANSITION_DELAY = 500;
const DEBOUNCE_DELAY = 300; 

export default function ClientPage() {
  const [query, setQuery] = useContext(QueryContext);
  const [grid, setGrid] = useContext(GridContext);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);
  const [isSlide, setIsSlide] = useContext(SlideBarContext);
  

  const debounceRef = useRef(null);
  const currentRequestRef = useRef(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const {
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedSortBy,
    selectedMinPrice,
    selectedHighPrice,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedSizes,
    setSelectedMinPrice,
    setSelectedHighPrice,
    setSelectedSortBy,
    setQ,
    q
  } = useContext(FilterContext);


  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      const queryParams = new URLSearchParams();
      if (selectedCategory) queryParams.set('category', selectedCategory);
      if (selectedSubCategory) queryParams.set('subcategory', selectedSubCategory);
      if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());
      
      setQ(searchQuery.trim());
      const queryString = queryParams.toString();
      router.push(`/Collections?${queryString}`);
    }
  }, [selectedCategory, selectedSubCategory, searchQuery, router, setQ]);

  
  useEffect(() => {
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const size = searchParams.get('size')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice');
    const highPrice = searchParams.get('highPrice');
    const sortBy = searchParams.get('sortBy');
    const searchQ = searchParams.get('q');

    if (category) setSelectedCategory(category);
    if (subcategory) setSelectedSubCategory(subcategory);
    if (size.length) setSelectedSizes(size);
    if (minPrice) setSelectedMinPrice(minPrice);
    if (highPrice) setSelectedHighPrice(highPrice);
    if (sortBy) setSelectedSortBy(sortBy);
    if (searchQ) {
      setQ(searchQ);
      setSearchQuery(searchQ);
    }
  }, [searchParams, setSelectedCategory, setSelectedSubCategory, setSelectedSizes, 
      setSelectedMinPrice, setSelectedHighPrice, setSelectedSortBy, setQ]);

  
  useEffect(() => {
    const queryParams = new URLSearchParams();
    
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSubCategory) queryParams.set('subcategory', selectedSubCategory);
    if (selectedSizes.length) queryParams.set('size', selectedSizes.join(','));
    if (selectedMinPrice) queryParams.set('minPrice', selectedMinPrice);
    if (selectedHighPrice) queryParams.set('highPrice', selectedHighPrice);
    if (selectedSortBy) queryParams.set('sortBy', selectedSortBy);
    if (q) queryParams.set('q', q);

    const queryStr = queryParams.toString();
    setQuery(queryStr);
    
    
    const newUrl = queryStr ? `?${queryStr}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedSortBy,
    selectedMinPrice,
    selectedHighPrice,
    q,
    setQuery
  ]);
  const handleFilterSlide = useCallback((route) => {
    if (isSlide !== 'false') {
      setIsSlide('false');
      setTimeout(() => {
        setIsSlide(route);
      }, SLIDE_TRANSITION_DELAY);
    } else {
      setIsSlide(route);
    }
  }, [isSlide, setIsSlide]);

  
  useEffect(() => {
    const shouldShowProducts = (selectedCategory && selectedSubCategory) || q;
    
    if (!shouldShowProducts) {
      setLoading(false);
      setProducts([]);
      setPagination(INITIAL_PAGINATION);
      return;
    }

    if (!query) {
      setLoading(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (currentRequestRef.current) {
      currentRequestRef.current.abort();
    }

   
    debounceRef.current = setTimeout(() => {
      const abortController = new AbortController();
      currentRequestRef.current = abortController;

      const fetchProducts = async () => {
        setLoading(true);
        
        try {
          console.log(`Making request: /api/getCollectionsProducts?${query}`);
          
          const response = await safeFetch(
            `/api/getCollectionsProducts?${query}`, 
            { signal: abortController.signal }, 
            3600000
          );
        
          if (abortController.signal.aborted) {
            console.log('Request was cancelled');
            return;
          }
          
          if (response?.success && Array.isArray(response.products)) {
            setProducts(response.products);
            setPagination({
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              fromProduct: response.fromProduct,
              toProduct: response.toProduct,
              totalFilteredProducts: response.totalFilteredProducts,
            });
          } else {
            setProducts([]);
            setPagination(INITIAL_PAGINATION);
          }
        } catch (error) {

          if (!abortController.signal.aborted) {
            console.error('Error fetching products:', error);
            setProducts([]);
            setPagination(INITIAL_PAGINATION);
          }
        } finally {
          if (!abortController.signal.aborted) {
            setLoading(false);
          }
          
          if (currentRequestRef.current === abortController) {
            currentRequestRef.current = null;
          }
        }
      };

      fetchProducts();
    }, DEBOUNCE_DELAY);

  
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (currentRequestRef.current) {
        currentRequestRef.current.abort();
        currentRequestRef.current = null;
      }
    };
  }, [query, q, selectedCategory, selectedSubCategory]);

  
  const handleClearSearch = useCallback(() => {
    const queryParams = new URLSearchParams();
    
    setQ('');
    setSearchQuery('');
    
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSubCategory) queryParams.set('subcategory', selectedSubCategory);
    if (selectedSizes.length) queryParams.set('size', selectedSizes.join(','));
    if (selectedMinPrice) queryParams.set('minPrice', selectedMinPrice);
    if (selectedHighPrice) queryParams.set('highPrice', selectedHighPrice);
    if (selectedSortBy) queryParams.set('sortBy', selectedSortBy);

    const queryStr = queryParams.toString();
    setQuery(queryStr);
    
    const newUrl = queryStr ? `?${queryStr}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [selectedCategory, selectedSubCategory, selectedSizes, selectedMinPrice, 
      selectedHighPrice, selectedSortBy, setQ, setQuery]);

 
  const shouldShowProducts = (selectedCategory && selectedSubCategory) || q;
  const hasProducts = products.length > 0;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-3 w-full mx-auto flex flex-col bg-slate-50 min-h-screen">
     
      <div className="filters w-full hidden mt-10 z-1 lg:flex items-center justify-between bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl p-6 mb-8 transition-all duration-500 hover:-translate-y-1">
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

   
      <div className="operations lg:hidden mt-5 flex z-1 justify-between items-center py-3 px-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl mb-8 transition-all duration-500 hover:-translate-y-1">
        <button
          onClick={() => handleFilterSlide('filter')}
          className="flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-900 transition-all duration-300 group"
          aria-label="Open filters"
        >
          <div className="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 shadow-sm">
            <Funnel className="w-4 h-4 transition-transform duration-300 group-hover:rotate-3" />
          </div>
          <span className="hidden xs:inline transition-all duration-300 group-hover:translate-x-1 text-xs font-medium">
            Filter
          </span>
        </button>

      
        <div className="searchbar flex items-center bg-white text-slate-800 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200 flex-1 mx-2 max-w-[140px]">
          <Search className="w-3.5 h-3.5 text-slate-600" />
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-xs placeholder-slate-500 w-full flex-1 min-w-0"
          />
          {searchQuery && (
            <>
              <div className="w-px h-4 bg-slate-300/60" role="separator"></div>
              <button
                onClick={handleClearSearch}
                className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors duration-200 group"
                aria-label="Clear search"
                type="button"
              >
                <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-slate-300/60" role="separator"></div>
          <div className="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">
            <SortBy />
          </div>
        </div>
      </div>
   <div className={`items w-full grid mt-5 justify-center gap-2 sm:gap-6 ${grid} lg:grid-cols-4 xl:grid-cols-4 transition-all duration-300`}>
        {!shouldShowProducts ? (
          <EmptyStateMessage
            icon="🏬"
            title="Selection Required"
            message="Please select both category and subcategory, or enter a search query to view products."
          />
        ) : !hasProducts ? (
          <EmptyStateMessage
            icon="🚫"
            title="No Products Found"
            message="No products found matching your current filters or search query."
            actionText="Try adjusting your filters or search terms"
          />
        ) : (
          products.map((product) => (
            <div key={product._id} className="mt-5">
              <Card prop={product} />
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

function EmptyStateMessage({ icon, title, message, actionText }) {
  return (
    <div className="col-span-full flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-lg border border-slate-200/50 transition-all duration-300 hover:shadow-xl">
      <div className="text-6xl mb-4 opacity-60" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-500 text-center max-w-md">
        {message}
      </p>
      {actionText && (
        <div className="mt-10 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm">
          {actionText}
        </div>
      )}
    </div>
  );
}