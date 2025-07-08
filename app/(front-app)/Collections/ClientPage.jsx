'use client';
import { useContext, useState, useEffect, useRef } from 'react';
import { Funnel } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Align from '@/app/Components/Opeartions/Align';
import Filter from '@/app/Components/Opeartions/filter';
import SortBy from '@/app/Components/Opeartions/SortBY';
import Card from '@/app/Components/UI/Card/Card';
import Loader from '@/app/Components/Loader/loader';
import Nextpage from '@/app/Components/UI/NextPage/Nextpage';
import { FilterContext, QueryContext } from '@/app/Context/contextProvider';

export default function ClientPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  const [query, setQuery] = useContext(QueryContext);
  const [grid, setGrid] = useState('grid-col-2');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevSubCat = useRef(null);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    fromProduct: 0,
    toProduct: 0,
    totalFilteredProducts: 0,
  });

  const {
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedSortBy,
    selectedMinPrice,
    setSelectedCategory,
    setSelectedSubCategory,
    selectedHighPrice,
  } = useContext(FilterContext);

  useEffect(() => {
    if (category && subcategory) {
      setSelectedCategory(category);
      setSelectedSubCategory(subcategory);
    }
  }, [category, subcategory]);

  useEffect(() => {
    if (!selectedCategory || !selectedSubCategory) {
      setQuery('');
      return;
    }

    const q = new URLSearchParams({
      category: selectedCategory,
      subcategory: selectedSubCategory,
      size: selectedSizes || '',
      minPrice: selectedMinPrice || '',
      highPrice: selectedHighPrice || '',
      sortBy: selectedSortBy || '',
    });

    setQuery(q.toString());
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedSortBy,
    selectedMinPrice,
    selectedHighPrice,
    setQuery,
  ]);

  useEffect(() => {
    if (!selectedCategory || !selectedSubCategory || !query) return;
    if (prevSubCat.current === selectedSubCategory) return;
    prevSubCat.current = selectedSubCategory;

    const getData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/getCollectionsProducts?${query}`);
        const data = await res.json();

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
  }, [query, selectedCategory, selectedSubCategory]);

  if (loading) return <Loader />;

  return (
    <div className="px-1 w-full flex flex-col">
      {/* <div className="filters w-full hidden md:flex items-center justify-between">
        <Filter />
        <SortBy />
      </div>
      <div className="seprator w-full h-[1px] bg-slate-300 mt-5 hidden md:flex"></div> */}
      {/* <div className="oprations md:hidden flex justify-between  items-center py-3">
        <div className="flex gap-1 text-slate-700 font-bold">
          <Funnel className="w-6 h-6" />
          Filter
        </div>
        <Align Funtion={[grid, setGrid]} />
        <SortBy />
      </div> */}
      <div className={`items w-full grid mx-auto  xl:grid-cols-4 mt-5 md:grid-cols-3 grid-cols-2  justify-center items-center gap-4`}>
        {!selectedCategory || !selectedSubCategory ? (
          <p className="col-span-full text-center text-gray-500">
            Please select both category and subcategory.
          </p>
        ) : products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products found for this category/subcategory.
          </p>
        ) : (
          products.map((data) => <Card key={data._id} prop={data} />)
        )}
      </div>
      {pagination.totalFilteredProducts > 0 && (
        <div className="w-full justify-center items-center mt-10">
          <Nextpage
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            from={pagination.fromProduct}
            to={pagination.toProduct}
            total={pagination.totalFilteredProducts}
          />
        </div>
      )}
    </div>
  );
}
