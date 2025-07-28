'use client';
import React, { useState, useContext, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { FilterContext, QueryContext } from '@/app/Context/contextProvider';
import { useRouter } from 'next/navigation';

function SortBy() {
  const [query, setQuery] = useContext(QueryContext);
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

  const selectedOptionLabel =
    options.find((opt) => opt.value === selectedSortBy)?.label || 'Sort By';

  const handleSelect = (option) => {
    setSelectedSortBy(option.value);
    setIsOpen(false);
  };


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
  }, [query]);

  return (
    <div className="relative inline-block text-left group w-fit">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="flex items-center w-auto min-w-[80px] h-[36px] justify-between font-medium gap-1.5 px-2.5 py-1.5 text-xs text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition"
  >
    <span className="truncate max-w-[60px]">{selectedOptionLabel}</span>
    <ChevronDown size={12} />
  </button>

  {isOpen && (
    <div className="absolute z-10 mt-1 w-44 rounded-md shadow-md right-0 bg-white border border-gray-200">
      <ul className="py-1 text-xs text-gray-700">
        {options.map((option, idx) => (
          <li
            key={idx}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer transition truncate"
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
