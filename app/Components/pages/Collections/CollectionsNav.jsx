import React from 'react'
import { Ban, Funnel, Search, X } from 'lucide-react';
import SortBy from '../../Opeartions/SortBY';
function CollectionsNav({handleFilterSlide,handleKeyDown,setSearchQuery,searchQuery,handleClearSearch}) {
  return (
      <div className="operations lg:hidden mt-5 flex z-1 justify-between items-center py-3 px-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl mb-8 transition-all duration-500 hover:-translate-y-1">
        <button
          onClick={() => handleFilterSlide('filter')}
          className="flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-900 transition-all duration-300 group"
          aria-label="Open filters"
        >
          <div className="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95 shadow-sm">
            <Funnel className="w-4 h-4 transition-transform duration-300 group-hover:rotate-3" />
          </div>
          <span className="hidden xs:inline transition-all duration-300 group-hover:translate-x-1 text-xs font-medium">
            Filter
          </span>
        </button>

        <div className="searchbar flex items-center bg-white text-slate-800 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200 flex-1 mx-2 max-w-[140px]">
          <Search className="w-3.5 h-3.5 text-slate-600" />
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="bg-transparent outline-none px-2 text-xs placeholder-slate-500 w-full flex-1 min-w-0"
          />
          {searchQuery && (
            <>
              <div className="w-px h-4 bg-slate-300/60" role="separator"></div>
              <button
                onClick={handleClearSearch}
                className="ml-1 p-0.5 rounded-full hover:bg-slate-100 transition-colors duration-200 group"
                aria-label="Clear search"
                type="button"
              >
                <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-px h-4 bg-slate-300/60" role="separator"></div>
          <div className="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">
            <SortBy />
          </div>
        </div>
      </div>

  )
}

export default CollectionsNav
