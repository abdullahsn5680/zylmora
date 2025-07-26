'use client';

import { ChevronDown, Funnel, X } from 'lucide-react';
import React, { useState, useContext, useEffect,useMemo } from 'react';
import { FilterContext, QueryContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';

function Filter() {
  const [query, setQuery] = useContext(QueryContext);
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

  const sizes = ['XS', 'S', 'M', 'L', 'XL','XXL'];
  const [showPrice, setShowPrice] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [selectedLocalSizes, setSelectedLocalSizes] = useState([]);

  const router = useRouter();
  
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
    if (size.length) {
      setSelectedSizes(size);
      setSelectedLocalSizes(size);
    }
    if (minPrice) {
      setSelectedMinPrice(minPrice);
      setMin(minPrice);
    }
    if (highPrice) {
      setSelectedHighPrice(highPrice);
      setMax(highPrice);
    }
    if (sortBy) setSelectedSortBy(sortBy);
    if (!category) setSelectedCategory('');
if (!subcategory) setSelectedSubCategory('');
if (!minPrice) {
  setSelectedMinPrice('');
  setMin('');
}
if (!highPrice) {
  setSelectedHighPrice('');
  setMax('');
}
if (!sortBy) setSelectedSortBy('');
if (!size.length) {
  setSelectedSizes([]);
  setSelectedLocalSizes([]);
}

  }, [query, router]);

  const applyFilters = async () => {
    setSelectedMinPrice(min);
    setSelectedHighPrice(max);
    setSelectedSizes(selectedLocalSizes);
    setShowPrice(false);
    setShowSize(false);

    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSubCategory) queryParams.set('subcategory', selectedSubCategory);
    if (selectedLocalSizes.length > 0) queryParams.set('size', selectedLocalSizes.join(','));
    if (min) queryParams.set('minPrice', min);
    if (max) queryParams.set('highPrice', max);
    if (selectedSortBy) queryParams.set('sortBy', selectedSortBy);

    window.history.replaceState(null, '', `?${queryParams.toString()}`);
    setQuery(queryParams.toString()); 
  };

  const handleReset = () => {
    setSelectedSizes([]);
    setSelectedSortBy('');
    setSelectedMinPrice('');
    setSelectedHighPrice('');
  };

  const clearAllFilters = () => {
    
    setSelectedSizes([]);
    setSelectedLocalSizes([]);
    setSelectedSortBy('');
    setSelectedMinPrice('');
    setSelectedHighPrice('');
    setMin('');
    setMax('');
    
    setShowPrice(false);
    setShowSize(false);
    
  
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedSubCategory) queryParams.set('subcategory', selectedSubCategory);
    
    window.history.replaceState(null, '', `?${queryParams.toString()}`);
    setQuery(queryParams.toString());
  };


const hasActiveFilters = useMemo(() => {
  const min = typeof selectedMinPrice === 'string' ? selectedMinPrice.trim() : '';
  const max = typeof selectedHighPrice === 'string' ? selectedHighPrice.trim() : '';
  const sort = typeof selectedSortBy === 'string' ? selectedSortBy.trim() : '';
  const sizes = Array.isArray(selectedSizes) ? selectedSizes.filter(s => s.trim() !== '') : [];

  console.log("CHECKING FILTERS:", {
    sizes,
    min,
    max,
    sort,
    result:
      sizes.length > 0 || min !== '' || max !== '' || sort !== ''
  });

  return sizes.length > 0 || min !== '' || max !== '' || sort !== '';
}, [selectedSizes, selectedMinPrice, selectedHighPrice, selectedSortBy]);



  return (
    <div className="w-full p-4 flex gap-4 sm:flex-row sm:items-start sm:justify-start">
      <div className="md:flex hidden md:flex-row flex-col items-center gap-2 font-[700] justify-center text-gray-700 text-md h-12 sm:h-[35px]">
        <Funnel className="w-6 h-6" />
        <span>Refined By</span>
      </div>

  

      <div className="hidden sm:block relative">
        <button
          onClick={() => {
            setShowPrice(!showPrice);
            setShowSize(false);
          }}
          className="border border-gray-300 px-4 py-2 justify-between rounded-md flex font-bold items-center gap-2 text-gray-900 w-fit md:w-60"
        >
          Price <ChevronDown size={16} />
        </button>

        {showPrice && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg p-4 w-fit shadow-lg">
            <span className="block mb-2 text-lg font-medium text-gray-800">Price</span>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Rs</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                />
              </div>
              <span className="text-sm text-gray-500">to</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">Rs</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              onClick={applyFilters}
              className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="hidden sm:block relative">
        <button
          onClick={() => {
            setShowSize(!showSize);
            setShowPrice(false);
          }}
          className="border border-gray-300 px-4 py-2 rounded-md flex justify-between items-center gap-2 text-gray-900 font-bold w-60"
        >
          Size <ChevronDown size={16} />
        </button>

        {showSize && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg p-4 w-64 shadow-lg">
            <div className="flex flex-wrap gap-2 mb-4">
              {sizes.map((size, idx) => (
                <span
                  key={idx}
                  onClick={() => {
                    setSelectedLocalSizes((prev) =>
                      prev.includes(size)
                        ? prev.filter((s) => s !== size)
                        : [...prev, size]
                    );
                  }}
                  className={`cursor-pointer px-3 py-1 border rounded-md text-sm ${
                    selectedLocalSizes.includes(size)
                      ? 'bg-red-100 border-red-400'
                      : 'hover:bg-red-100 border-gray-300'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
            <button
              onClick={applyFilters}
              className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800"
            >
              Apply
            </button>
          </div>
        )}
      </div>
      

      <div className=" lg:hidden flex  flex-col gap-4 w-full h-screen">
     <div className="">
            {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="border border-red-300 px-4 py-2 rounded-md flex justify-between text-white w-full  items-center gap-2 bg-red-600 font-bold md:w-60"
        >
         
          Clear Filters
           <X size={16} />
        </button>
      )}
      </div>
        <div className="border border-gray-300 rounded-lg p-4 w-full">
          <span className="block mb-2 text-lg font-medium text-gray-800">Price</span>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Rs</span>
              <input
                type="number"
                placeholder="Min"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
            <span className="text-sm text-gray-500">to</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Rs</span>
              <input
                type="number"
                placeholder="Max"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Apply
          </button>
        </div>
       
        <div className="border border-gray-300 rounded-lg p-4 w-full">
          <span className="block mb-2 text-lg font-medium text-gray-800">Size</span>
          <ul className="flex flex-wrap gap-3 mb-4">
            {sizes.map((size, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSelectedLocalSizes((prev) =>
                    prev.includes(size)
                      ? prev.filter((s) => s !== size)
                      : [...prev, size]
                  );
                }}
                className={`border cursor-pointer rounded-md px-4 py-2 transition text-sm ${
                  selectedLocalSizes.includes(size)
                    ? 'bg-red-100 border-red-400 text-gray-900'
                    : 'hover:bg-red-100 border-gray-300 text-gray-700'
                }`}
              >
                {size}
              </li>
            ))}
          </ul>
          <button
            onClick={applyFilters}
            className="w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800"
          >
            Apply
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Filter;