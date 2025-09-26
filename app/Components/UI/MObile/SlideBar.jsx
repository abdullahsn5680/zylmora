'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Plus, Minus, ShoppingBag, Filter as FilterIcon } from 'lucide-react'
import { SlideBarContext, CollectionContext, FilterContext } from '@/app/Context/contextProvider'
import Filter from '../../Opeartions/filter'

function SlideBar() {
  const [categories] = useContext(CollectionContext)
  const [isSlide, setIsSlide] = useContext(SlideBarContext)
  const [left, setLeft] = useState('left-[-100vw]')
  const [activeCategory, setActiveCategory] = useState(null)
  const [expandedSubs, setExpandedSubs] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmCategory, setConfirmCategory] = useState('')
  const router = useRouter()

  

  
  useEffect(() => {
    setLeft(isSlide !== 'false' ? 'left-0' : 'left-[-100vw]')
  }, [isSlide])

 
  const performAction = (category, subcategory) => {
    const queryParams = new URLSearchParams()
    if (category) queryParams.set('category', category)
    if (subcategory) queryParams.set('subcategory', subcategory)
    
    const query = queryParams.toString()
    window.history.replaceState(null, '', `?${query}`)
    router.push(`/Collections?${query}`)
    closeSlideBar()
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsLoading(true)
      setTimeout(() => {
        router.push(`/Collections?q=${encodeURIComponent(searchQuery)}`)
        setIsLoading(false)
        setIsSlide('false')
      }, 300)
    }
  }

 
  const closeSlideBar = () => {
    setIsSlide('false')
    setSearchQuery('')
    setActiveCategory(null)
    setExpandedSubs(new Set())
  }

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId)
    const category = categories.find(cat => cat._id === categoryId)
    if (category) {
      setConfirmCategory(category.name)
    }
  }

  const toggleSubCategory = (categoryId, subIndex) => {
    const key = `${categoryId}-${subIndex}`
    const newExpanded = new Set(expandedSubs)
    if (newExpanded.has(key)) {
      newExpanded.delete(key)
    } else {
      newExpanded.add(key)
    }
    setExpandedSubs(newExpanded)
  }

  const renderSubCategories = (subs, categoryId, level = 0) => {
    if (!subs || subs.length === 0) return null

    return subs.map((sub, idx) => {
      const hasNestedSubs = sub.subs && sub.subs.length > 0
      const subKey = `${categoryId}-${idx}`
      const isExpanded = expandedSubs.has(subKey)
      const subName = typeof sub === 'string' ? sub : sub.name
      const indentClass = level === 0 ? 'ml-0' : `ml-${Math.min(level * 4, 8)}`

      return (
        <div key={subKey} className={indentClass}>
          <div className="flex items-center">
            <button
              onClick={() => {
                if (hasNestedSubs) {
                  toggleSubCategory(categoryId, idx)
                } else {
                 
                  performAction(confirmCategory, subName)
                }
              }}
              className={`flex-1 text-left p-3 ${
                level === 0 
                  ? 'bg-slate-100/80 hover:bg-slate-800 hover:text-white' 
                  : 'bg-slate-50/80 hover:bg-slate-700 hover:text-white'
              } rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group mb-2`}
            >
              <div className="flex items-center justify-between">
                <span>{subName}</span>
                <div className="flex items-center gap-2">
                  {hasNestedSubs && (
                    <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
                      {isExpanded ? 
                        <Minus className="w-3 h-3" /> : 
                        <Plus className="w-3 h-3" />
                      }
                    </div>
                  )}
                  <div className={`w-2 h-2 ${
                    hasNestedSubs ? 'bg-blue-400' : 'bg-green-400'
                  } rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </div>
            </button>
          </div>

          {hasNestedSubs && (
            <div className={`transition-all duration-500 ease-out overflow-hidden ${
              isExpanded ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-4 space-y-1">
                {renderSubCategories(sub.subs, `${subKey}`, level + 1)}
              </div>
            </div>
          )}
        </div>
      )
    })
  }

 
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-4">
      <div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600"></div>
    </div>
  )

  return (
    <>
    
      {isSlide !== 'false' && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeSlideBar}
        />
      )}

   
      <div
        className={`fixed h-screen w-[85vw] max-w-md transition-all duration-500 ease-out top-0 ${left} z-50 bg-white/95 backdrop-blur-lg border-r border-slate-200/50 shadow-2xl`}
      >
    
        {isSlide === 'slide' && (
          <div className="h-full flex flex-col">
           
            <div className="bg-gradient-to-br from-slate-50 to-stone-50 border-b border-slate-200/50 p-6 pb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6 text-slate-600" />
                  <span className="text-xl font-bold text-slate-800">Categories</span>
                </div>
                <button 
                  onClick={closeSlideBar} 
                  className="p-2 rounded-full hover:bg-white/80 transition-colors duration-300"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <p className="text-sm text-slate-600 font-light">
                Discover our carefully curated collection
              </p>
            </div>

          
            <div className="flex-1 overflow-y-auto p-4">
              {isLoading ? (
                <LoadingSpinner />
              ) : categories?.length > 0 ? (
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div 
                      key={cat._id} 
                      className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                    
                      <div
                        onClick={() => toggleCategory(cat._id)}
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50/80 transition-colors duration-300 group"
                      >
                        <span className="font-semibold text-slate-800 group-hover:text-slate-900">
                          {cat.name}
                        </span>
                        <div className="p-1 rounded-full group-hover:bg-white/80 transition-all duration-300">
                          {activeCategory === cat._id ? 
                            <Minus className="w-4 h-4 text-slate-600" /> : 
                            <Plus className="w-4 h-4 text-slate-600" />
                          }
                        </div>
                      </div>
 
                      <div className={`h-[2px] bg-gradient-to-r from-slate-300 to-slate-500 transition-all duration-500 ${
                        activeCategory === cat._id ? 'scale-x-100' : 'scale-x-0'
                      } origin-left`} />

                      <div className={`transition-all duration-500 ease-out overflow-hidden ${
                        activeCategory === cat._id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        {cat.subs?.length > 0 ? (
                          <div className="p-4 pt-3 space-y-2">
                            {renderSubCategories(cat.subs, cat._id)}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-slate-500 text-sm">
                            No subcategories available
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-6xl mb-4">🏪</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No Categories Available</h3>
                  <p className="text-slate-600 text-sm">Categories will appear here once loaded</p>
                </div>
              )}
            </div>
          </div>
        )}

      
        {isSlide === 'search' && (
          <div className="h-full flex flex-col">
          
            <div className="bg-gradient-to-br from-slate-50 to-stone-50 border-b border-slate-200/50 p-6 pb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <Search className="w-6 h-6 text-slate-600" />
                  <span className="text-xl font-bold text-slate-800">Search</span>
                </div>
                <button 
                  onClick={closeSlideBar} 
                  className="p-2 rounded-full hover:bg-white/80 transition-colors duration-300"
                  aria-label="Close Search"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <p className="text-sm text-slate-600 font-light">
                Find exactly what you're looking for
              </p>
            </div>

            <div className="p-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search products, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    className="flex-grow outline-none bg-transparent text-slate-800 placeholder:text-slate-400 font-medium"
                  />
              
                </div>
              </div>

              {isLoading && <LoadingSpinner />}

              <div className="mt-6 space-y-2">
                <h4 className="text-sm font-semibold text-slate-600 mb-3">Popular Searches</h4>
                {['Shirts', 'Pants', 'Trousers'].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(item)}
                    className="block w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-700 font-medium transition-colors duration-300"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

     
        {isSlide === 'filter' && (
          <div className="h-full flex flex-col">
          
            <div className="bg-gradient-to-br from-slate-50 to-stone-50 border-b border-slate-200/50 p-6 pb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <FilterIcon className="w-6 h-6 text-slate-600" />
                  <span className="text-xl font-bold text-slate-800">Filters</span>
                </div>
                <button 
                  onClick={closeSlideBar} 
                  className="p-2 rounded-full hover:bg-white/80 transition-colors duration-300"
                  aria-label="Close Filter"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <p className="text-sm text-slate-600 font-light">
                Refine your search results
              </p>
            </div>

           
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-sm">
                <Filter />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default SlideBar