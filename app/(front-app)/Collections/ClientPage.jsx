"use client";

import { useState, useContext, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FilterContext,
  GridContext,
  SlideBarContext,
} from "@/app/Context/contextProvider";
import { useProducts } from "@/Hooks/useProdcuts";
import Loader from "@/app/Components/Loader/loader";
import Filter from "@/app/Components/Opeartions/filter";
import SortBy from "@/app/Components/Opeartions/SortBY";
import Card from "@/app/Components/UI/Card/Card";
import Nextpage from "@/app/Components/UI/NextPage/Nextpage";
import EmptyMesseges from "@/app/Components/UI/Messeges/EmptyMesseges";
import CollectionsNav from "@/app/Components/pages/Collections/CollectionsNav";

const SLIDE_TRANSITION_DELAY = 500;

export default function ClientPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [grid] = useContext(GridContext);
  const [isSlide, setIsSlide] = useContext(SlideBarContext);

  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedMinPrice,
    selectedHighPrice,
    selectedSortBy,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedSizes,
    setSelectedMinPrice,
    setSelectedHighPrice,
    setSelectedSortBy,
    setQ,
    q,
  } = useContext(FilterContext);

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const subcategory = searchParams.get("subcategory") || "";
    const size = searchParams.get("size")?.split(",").filter(Boolean) || [];
    const minPrice = searchParams.get("minPrice") || "";
    const highPrice = searchParams.get("highPrice") || "";
    const sortBy = searchParams.get("sortBy") || "";
    const searchQ = searchParams.get("q") || "";
    const pg = Number(searchParams.get("page") || 1);

    setSelectedCategory(category);
    setSelectedSubCategory(subcategory);
    setSelectedSizes(size);
    setSelectedMinPrice(minPrice);
    setSelectedHighPrice(highPrice);
    setSelectedSortBy(sortBy);
    setCurrentPage(pg);
    setQ(searchQ);
    setSearchQuery(searchQ);
  }, [
    searchParams,
    setSelectedCategory,
    setSelectedSubCategory,
    setSelectedSizes,
    setSelectedMinPrice,
    setSelectedHighPrice,
    setSelectedSortBy,
    setQ,
  ]);

  const { products, loading, pagination } = useProducts(
    {
      selectedCategory,
      selectedSubCategory,
      selectedSizes,
      selectedMinPrice,
      selectedHighPrice,
      selectedSortBy,
    },
    currentPage,
    q
  );

  useEffect(() => {
    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.set("category", selectedCategory);
    if (selectedSubCategory)
      queryParams.set("subcategory", selectedSubCategory);
    if (selectedSizes.length) queryParams.set("size", selectedSizes.join(","));
    if (selectedMinPrice) queryParams.set("minPrice", selectedMinPrice);
    if (selectedHighPrice) queryParams.set("highPrice", selectedHighPrice);
    if (selectedSortBy) queryParams.set("sortBy", selectedSortBy);
    if (currentPage) queryParams.set("page", currentPage);
    if (q) queryParams.set("q", q);

    const queryString = queryParams.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedMinPrice,
    selectedHighPrice,
    selectedSortBy,
    currentPage,
    q,
  ]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        setQ(e.target.value);
        setCurrentPage(1);
      }
    },
    [setQ]
  );
  const handleFilterSlide = useCallback(
    (route) => {
      if (isSlide !== "false") {
        setIsSlide("false");
        setTimeout(() => {
          setIsSlide(route);
        }, SLIDE_TRANSITION_DELAY);
      } else {
        setIsSlide(route);
      }
    },
    [isSlide, setIsSlide]
  );

  const handleClearSearch = useCallback(() => {
    setQ("");
    setSearchQuery("");
    setCurrentPage(1);
  }, [setQ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    selectedSubCategory,
    selectedSizes,
    selectedMinPrice,
    selectedHighPrice,
    selectedSortBy,
    q,
  ]);

  const shouldShowProducts = (selectedCategory && selectedSubCategory) || q;
  const hasProducts = products.length > 0;
  if (loading) return <Loader />;
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
      <CollectionsNav
        handleFilterSlide={handleFilterSlide}
        handleKeyDown={handleKeyDown}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        handleClearSearch={handleClearSearch}
      />
      <div className="separator w-full h-px bg-gradient-to-r from-transparent via-slate-400/60 to-transparent mb-8 hidden lg:flex relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/30 to-transparent blur-sm"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full opacity-60"></div>
      </div>
      {!shouldShowProducts ? (
        <EmptyMesseges
          icon="🏬"
          title="Selection Required"
          message="Please select both category and subcategory, or enter a search query to view products."
        />
      ) : !hasProducts ? (
        <EmptyMesseges
          icon="🚫"
          title="No Products Found"
          message="No products found matching your current filters or search query."
          actionText="Try adjusting your filters or search terms"
        />
      ) : (
        <div
          className={`items w-full grid mt-5 justify-center gap-2 sm:gap-6 ${grid} lg:grid-cols-4 xl:grid-cols-4 transition-all duration-300`}
        >
          {products.map((product) => (
            <div key={product._id} className="mt-5">
              <Card prop={product} />
            </div>
          ))}
        </div>
      )}
      {pagination.totalFilteredProducts > 0 && (
        <div className="w-full flex justify-center items-center mt-12 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <Nextpage
              setCurrentPage={setCurrentPage}
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
