"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/Components/Loader/loader";
import { UserContext } from "@/app/Context/contextProvider";

function ProductsTablePage() {
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("grid");
  const { session, status } = useContext(UserContext);
  const isAdmin = session?.user?.role;

  useEffect(() => {
    if (status !== "loading") {
      if (!session) router.replace("/Authentication");
      if (!isAdmin) router.replace("/");
    }
  }, [status]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoader(true);
      let url = `/api/searchProducts?page=${currentPage}&limit=${itemsPerPage}`;
      if (isSearching && search.trim()) {
        url += `&q=${encodeURIComponent(search.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } else {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setTimeout(() => setLoader(false), 300);
    }
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    setIsSearching(search.trim().length > 0);
    fetchProducts();
  };

  const clearSearch = () => {
    setSearch("");
    setIsSearching(false);
    setCurrentPage(1);
    setTimeout(() => fetchProducts(), 100);
  };

  const confirmDelete = async () => {
    try {
      setLoader(true);
      const res = await fetch(`/api/Products?id=${deleteProductId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== deleteProductId));
        setTotal(prev => prev - 1);
      } else {
        alert("Delete failed: " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleteProductId(null);
      setTimeout(() => setLoader(false), 300);
    }
  };

  const calculateDiscount = (price, cut_price) => {
    if (!price || !cut_price) return 0;
    return Math.round(((price - cut_price) / price) * 100);
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  if (loader) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => history.back()}
            className="group mb-6 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                Products Dashboard
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">
                    {total.toLocaleString()} Products
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
                  <span className="text-sm font-medium text-slate-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl shadow-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  viewMode === "table"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Table View
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid View
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products, categories, vendors..."
                  className="w-full pl-14 pr-4 py-4 bg-white border-2 border-purple-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-slate-700 font-medium placeholder:text-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Search
              </button>
              
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 font-semibold transition-all"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-violet-50 px-5 py-3 rounded-2xl border border-purple-100">
              <label className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                Items:
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border-2 border-purple-200 rounded-xl px-4 py-2 text-slate-700 bg-white cursor-pointer hover:border-purple-400 transition-colors outline-none font-medium"
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {isSearching && (
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-purple-700 bg-purple-50 px-4 py-2 rounded-xl w-fit">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Found {products.length} results for "{search}"
            </div>
          )}
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                    {[
                      { key: "image", label: "Image", width: "w-24" },
                      { key: "title", label: "Product", width: "min-w-[220px]" },
                      { key: "category", label: "Category", width: "w-32" },
                      { key: "subcategory", label: "Subcategory", width: "w-36" },
                      { key: "price", label: "Price", width: "w-28" },
                      { key: "cut_price", label: "Sale", width: "w-28" },
                      { key: "discount", label: "Discount", width: "w-28" },
                      { key: "sold", label: "Sold", width: "w-24" },
                      { key: "stock", label: "Stock", width: "w-24" },
                      { key: "actions", label: "Actions", width: "w-44" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className={`${col.width} px-6 py-5 text-left text-sm font-bold uppercase tracking-wide`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product, idx) => (
                      <tr
                        key={product._id}
                        className="border-b border-purple-100 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 transition-all"
                      >
                        <td className="px-6 py-5">
                          <div className="relative group">
                            <img
                              src={product.image || product.main_image}
                              alt={product.title}
                              className="w-20 h-20 object-cover rounded-2xl border-2 border-purple-200 shadow-lg group-hover:scale-110 transition-transform"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold text-slate-900 mb-1">
                            {product.title}
                          </div>
                          {product.Vendor && (
                            <div className="text-xs text-slate-500 font-medium">
                              by {product.Vendor}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-medium text-slate-700">
                            {product.subcategory}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-400 line-through font-medium">
                          Rs.{product.price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 text-base font-bold text-slate-900">
                          Rs.{product.cut_price?.toLocaleString()}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md">
                            {calculateDiscount(product.price, product.cut_price)}% OFF
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-green-600">
                            {product.sold}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-700">
                            {product.stock - product.sold}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const Query = new URLSearchParams({
                                  product: product._id,
                                });
                                router.push(`/Admin/UpdateProduct?${Query.toString()}`);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteProductId(product._id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="text-slate-500 text-xl font-semibold">
                            {isSearching ? `No results found for "${search}"` : "No products available"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 overflow-hidden transition-all transform hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || product.main_image}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {calculateDiscount(product.price, product.cut_price) > 0 && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                        {calculateDiscount(product.price, product.cut_price)}% OFF
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg">
                      {product.category}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 text-lg">
                      {product.title}
                    </h3>
                    
                    {product.Vendor && (
                      <p className="text-xs text-slate-500 mb-3 font-medium">
                        by {product.Vendor}
                      </p>
                    )}
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-slate-900">
                        Rs.{product.cut_price?.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        Rs.{product.price?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Sold: {product.sold}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        Stock: {product.stock - product.sold}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const Query = new URLSearchParams({
                            product: product._id,
                          });
                          router.push(`/Admin/UpdateProduct?${Query.toString()}`);
                        }}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteProductId(product._id)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-semibold rounded-xl hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-500 text-2xl font-semibold">
                  {isSearching ? `No results found for "${search}"` : "No products available"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-sm font-medium text-slate-600">
                Showing <span className="font-bold text-purple-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to{" "}
                <span className="font-bold text-purple-600">
                  {Math.min(currentPage * itemsPerPage, total)}
                </span>{" "}
                of <span className="font-bold text-purple-600">{total.toLocaleString()}</span> products
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    currentPage === 1
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-2">
                  {getPaginationRange().map((page, idx) => (
                    page === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="px-4 py-3 text-slate-400 font-bold"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-5 py-3 rounded-xl font-bold transition-all ${
                          currentPage === page
                            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg scale-110"
                            : "bg-white text-slate-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-violet-100 hover:scale-105 shadow-md hover:shadow-lg border-2 border-purple-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    currentPage === totalPages
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-scaleIn">
            <div className="p-8">
              <div className="flex items-center justify-center w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-rose-100 rounded-full mb-6 animate-bounce">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-slate-900 mb-3">
                Delete Product?
              </h3>
              <p className="text-center text-slate-600 mb-8 leading-relaxed">
                Are you sure you want to permanently delete this product? This action cannot be undone and all data will be lost.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteProductId(null)}
                  className="flex-1 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-2xl shadow-red-500/50 transform hover:-translate-y-0.5"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ProductsTablePage;