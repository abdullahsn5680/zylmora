'use client';
import { ChevronDown, Funnel } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { FilterContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
import { QueryContext } from '@/app/Context/contextProvider';
function Filter() {
  const {setQuery}=useContext(QueryContext)
  
  
  const router=useRouter();
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

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const [showPrice, setShowPrice] = useState(false);
  const [showSize, setShowSize] = useState(false);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [selectedLocalSizes, setSelectedLocalSizes] = useState([]);

  const applyFilters = async () => {
    setSelectedMinPrice(min);
    setSelectedHighPrice(max);
    setSelectedSizes(selectedLocalSizes);
    setShowPrice(false)
    setShowSize(false)
   
const query = new URLSearchParams();

if (selectedCategory) query.append('category', selectedCategory);
if (selectedSubCategory) query.append('subcategory', selectedSubCategory);
if (selectedLocalSizes.length > 0) query.append('size', selectedLocalSizes.join(','));
if (min) query.append('minPrice', min);
if (max) query.append('highPrice', max);
if (selectedSortBy) query.append('sortBy', selectedSortBy);

setQuery(query.toString())
   
    
  };


  return (
    <div className="w-full p-4 flex gap-4 sm:flex-row sm:items-start sm:justify-start">
     
      <div className="flex items-center gap-2 font-[700] justify-center text-gray-700 text-md h-12 sm:h-[35px]">
        <Funnel className="w-6 h-6" />
        <span>Refined By</span>
      </div>

   
      <div className="hidden sm:block relative">
        <button
          onClick={() => {
            setShowPrice(!showPrice);
            setShowSize(false);
          }}
          className="border border-gray-300 px-4 py-2 justify-between rounded-md flex font-bold items-center gap-2 text-gray-900 w-60"
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

     
      <div className="sm:hidden flex flex-col gap-4 w-full">
  
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

        {/* Size Mobile */}
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
