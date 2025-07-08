'use client';
import React, { useState, useContext } from 'react';
import { ChevronDown, Router } from 'lucide-react';
import { FilterContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';
import { QueryContext } from '@/app/Context/contextProvider';
function SortBy() {
const  {setQuery}  =useContext(QueryContext);
  const router = useRouter();
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

  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { label: 'Newest', value: 'newest' },
    { label: 'Price: Low to High', value: 'lowtohigh' },
    { label: 'Price: High to Low', value: 'hightolow' },
    { label: 'Most Popular', value: 'popular' },
  ];

  const handleSelect = async (option) => {
    setSelectedSortBy(option.value);
    setIsOpen(false);

    
   
     const query = new URLSearchParams({
    category: selectedCategory,
    subcategory: selectedSubCategory,
    size:selectedSizes,
    minPrice:selectedMinPrice,
    highPrice:selectedHighPrice,
    sortBy:selectedSortBy,
  }).toString();
      
  setQuery(query);
  
    
   
    
  };

  return (
    <div className="relative inline-block text-left group w-fit">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center md:w-52 h-[42px] justify-between font-bold gap-2 px-4 py-2 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
      >
        Sort By <ChevronDown size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-52 rounded-md shadow-md right-0 bg-white border border-gray-200">
          <ul className="py-2 text-sm text-gray-700">
            {options.map((option, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SortBy;
