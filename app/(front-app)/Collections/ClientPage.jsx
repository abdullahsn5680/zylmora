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
    <div className="px-3 w-full mx-auto  flex flex-col">
 
      <div className="filters w-full hidden lg:flex items-center justify-between">
        <Filter />
        <SortBy />
      </div>

      <div className="seprator w-full h-[1px] bg-slate-300 mt-5 hidden lg:flex"></div>

     
      <div className="oprations lg:hidden flex justify-between items-center py-3">
        <div className="flex gap-1 text-slate-700 font-bold">
          <Funnel onClick={()=>{performanFilter('filter')}} className="w-6 h-6" />
          Filter
        </div>
        <Align Funtion={[grid, setGrid]} />
        <SortBy />
      </div>

      <div
        className={`items w-full grid  mt-5  justify-center items-center gap-3  ${grid} lg:grid-cols-4 xl:grid-cols-4`}
      >
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
