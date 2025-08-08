'use client'
import { useState, useEffect, useRef, useCallback } from "react";
import { safeFetch } from "@/Utils/safeFetch";

const INITIAL_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  fromProduct: 0,
  toProduct: 0,
  totalFilteredProducts: 0,
};

export function useProducts(filters, currentPage, searchQuery) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(INITIAL_PAGINATION);

  const abortControllerRef = useRef(null);
  const lastQueryRef = useRef("");

  const generateQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.selectedCategory) params.set("category", filters.selectedCategory);
    if (filters.selectedSubCategory) params.set("subcategory", filters.selectedSubCategory);
    if (filters.selectedSizes?.length) params.set("size", filters.selectedSizes.join(","));
    if (filters.selectedMinPrice) params.set("minPrice", filters.selectedMinPrice);
    if (filters.selectedHighPrice) params.set("highPrice", filters.selectedHighPrice);
    if (filters.selectedSortBy) params.set("sortBy", filters.selectedSortBy);
    if (currentPage) params.set("page", currentPage);
    if (searchQuery) params.set("q", searchQuery);
    return params.toString();
  }, [filters, currentPage, searchQuery]);

  const fetchProducts = useCallback(async () => {
    const queryString = generateQuery();
    
  
    if (queryString === lastQueryRef.current) return;
    lastQueryRef.current = queryString;

    const shouldShowProducts = (filters.selectedCategory && filters.selectedSubCategory) || searchQuery;
    
    if (!shouldShowProducts) {
      setLoading(false);
      setProducts([]);
      setPagination(INITIAL_PAGINATION);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setLoading(true);

    try {
      console.log(`Making request: /api/getCollectionsProducts?${queryString}`);
      
      const response = await safeFetch(
        `/api/getCollectionsProducts?${queryString}`,
        { signal: abortControllerRef.current.signal },
        1
      );
      
      if (abortControllerRef.current.signal.aborted) {
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
      if (error.name !== "AbortError") {
        console.error("Error fetching products:", error);
        setProducts([]);
        setPagination(INITIAL_PAGINATION);
      }
    } finally {
      setLoading(false);
    }
  }, [generateQuery, filters.selectedCategory, filters.selectedSubCategory, searchQuery]);

 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 100); 

    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { 
    products, 
    loading, 
    pagination,
    refetch: fetchProducts 
  };
}