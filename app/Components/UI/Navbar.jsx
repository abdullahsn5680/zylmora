"use client";

import { Heart, Package, Search, ShoppingBag, User2, X, Maximize, Minimize } from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterContext, QueryContext } from "@/app/Context/contextProvider";
import Announcemnt from "../alerts/announcemnt";
import { openFullscreen, closeFullscreen } from "@/lib/provideFullScreen";

function Navbar({categories}) {

  const [confirmCategory, setConfirmCategory] = useState("");
  const [query, setQuery] = useContext(QueryContext);
  const [fullScreen, setFullScreen] = useState(false);
  const [sq, setSq] = useState("");
  const [hovered, setHovered] = useState(null);
  const timeoutRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedSizes,
    selectedMinPrice,
    selectedHighPrice,
    selectedSortBy,
  } = useContext(FilterContext);


  const KeyDown = (e) => {
    if (e.key === "Enter") {
      const queryParams = new URLSearchParams();
      if (selectedCategory) queryParams.set("category", selectedCategory);
      if (selectedSubCategory) queryParams.set("subcategory", selectedSubCategory);
      if (sq) queryParams.set("q", sq);
      router.push(`/Collections?${queryParams.toString()}`);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSq(q);
  }, [searchParams]);

 
  const handleMouseEnter = (id) => {
    clearTimeout(timeoutRef.current);
    setHovered(id);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(null), 400);
  };


  const performAction = (cat, sub) => {
    const queryParams = new URLSearchParams();
    if (cat) queryParams.set("category", cat);
    if (sub) queryParams.set("subcategory", sub);
    setSq("");
    router.push(`/Collections?${queryParams.toString()}`);
  };


  const handleRemove = () => {
    const queryParams = new URLSearchParams();
    setSq("");
    if (selectedCategory) queryParams.set("category", selectedCategory);
    if (selectedSubCategory) queryParams.set("subcategory", selectedSubCategory);
    if (selectedSizes.length) queryParams.set("size", selectedSizes);
    if (selectedMinPrice) queryParams.set("minPrice", selectedMinPrice);
    if (selectedHighPrice) queryParams.set("highPrice", selectedHighPrice);
    if (selectedSortBy) queryParams.set("sortBy", selectedSortBy);
    setQuery(queryParams.toString());
    router.push(`?${queryParams.toString()}`);
  };

  
  const handleFullscreen = () => {
    if (!fullScreen) {
      openFullscreen();
      setFullScreen(true);
    } else {
      closeFullscreen();
      setFullScreen(false);
    }
  };

  return (
    <div className="relative">
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 transition-all duration-300 w-full relative z-20 flex flex-col lg:flex-row justify-between items-center font-semibold px-6 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border-b border-slate-700/50 backdrop-blur-sm">
        
       
        <div className="options w-full lg:w-auto overflow-x-auto lg:overflow-visible mb-4 lg:mb-0">
          <ul className="flex gap-3 lg:gap-6 min-w-max lg:min-w-0">
            {categories.map((category) => (
              <li
                key={category._id}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(category._id)}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  onMouseEnter={() => setConfirmCategory(category.name)}
                  className="cursor-pointer text-sm px-3 py-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] relative overflow-hidden backdrop-blur-sm border border-transparent hover:border-slate-600"
                >
                  {category.name}
                  <div className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 transition-all duration-300"></div>
                </div>

                {hovered === category._id && (
                  <div
                    className="absolute top-full left-0 flex flex-col bg-white/95 backdrop-blur-md text-slate-800 text-sm font-medium mt-2 min-w-[180px] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] z-30 p-2 border border-slate-200/50 animate-slide-down"
                    onMouseEnter={() => handleMouseEnter(category._id)}
                  >
                    {category.subs?.map((sub, index) => (
                      <div
                        key={index}
                        onClick={() => performAction(confirmCategory, sub)}
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-900 p-3 w-full rounded-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-sm border border-transparent hover:border-indigo-100"
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

      
        <div className="brandName cursor-pointer w-full lg:w-auto text-center text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent hover:scale-105 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          <Link href="/">ZYLMORA<span className="text-indigo-400">✦</span>STORE</Link>
        </div>

       
        <div className="buttonsc w-full lg:w-auto flex items-center justify-between lg:justify-end gap-4">
          <ul className="flex gap-2">
            <li className="hover:text-indigo-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700/50 cursor-pointer">
              {!fullScreen ? (
                <Maximize onClick={handleFullscreen} className="w-5 h-5" />
              ) : (
                <Minimize onClick={handleFullscreen} className="w-5 h-5" />
              )}
            </li>
            <li className="hover:text-indigo-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700/50">
              <Link href="/Profile">
                <User2 className="w-5 h-5" />
              </Link>
            </li>
            <li className="hover:text-indigo-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700/50">
              <Link href="/Profile/Orders">
                <Package className="w-5 h-5" />
              </Link>
            </li>
            <li className="hover:text-indigo-300 transition-all duration-300 hover:scale-110 p-2 rounded-lg hover:bg-slate-700/50">
              <Link href="/Profile/Cart">
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </li>
          </ul>

         
          <div className="searchbar flex items-center bg-white/95 backdrop-blur-md text-slate-800 rounded-xl px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] transition-all duration-300 hover:scale-[1.02] border border-slate-200/50 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              onKeyDown={KeyDown}
              type="text"
              value={sq || ""}
              onChange={(e) => setSq(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent outline-none px-3 text-sm placeholder-slate-400 w-full"
            />
            {sq && (
              <>
                <div className="w-px h-5 bg-slate-300 mx-2 flex-shrink-0"></div>
                <button
                  onClick={handleRemove}
                  className="flex-shrink-0 p-1 rounded-full hover:bg-slate-100 transition-colors duration-200 group"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Announcement */}
      <div className="announcement w-full shadow-sm">
        <Announcemnt />
      </div>
    </div>
  );
}

export default Navbar;
