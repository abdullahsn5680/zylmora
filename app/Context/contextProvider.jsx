'use client';
import React, { useState, useEffect, createContext } from 'react';
import { useSession } from 'next-auth/react';
import { safeFetch } from '@/Utils/safeFetch';

export const SlideBarContext = createContext();
export const AuthAnimationContext = createContext();
export const CollectionContext = createContext();
export const FilterContext = createContext();
export const QueryContext = createContext();
export const UserContext = createContext();

function ContextProvider({ children }) {
  const [isSlide, setIsSlide] = useState('false');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState('default');
  const [selectedMinPrice, setSelectedMinPrice] = useState();
  const [selectedHighPrice, setSelectedHighPrice] = useState();
  const [authAnimation, setAuthAnimation] = useState(true);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState();
  

  const { data: session, status } = useSession();

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/User', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Id: session?.user?.id }),
        });

        const result = await res.json();
        if (result?.data) {
          setUser(result.data);
          
    
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
if(session){
  fetchUser();
}

  }, [session]);
  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
         const origin = window.location.origin;
        const data = await safeFetch(`/api/collections`, {}, 3600000);
        if (data.success) {
          setCategories(data.collections);
        }
      } catch (err) {
        console.error('Error fetching collections:', err);
      }
    };

    fetchCollections();
  }, []); 

  return (
    <SlideBarContext.Provider value={[isSlide, setIsSlide]}>
      <CollectionContext.Provider value={[categories, setCategories]}>
        <FilterContext.Provider
          value={{
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
          }}
        >
          <QueryContext.Provider value={[query, setQuery]}>
            <AuthAnimationContext.Provider value={[authAnimation, setAuthAnimation]}>
              <UserContext.Provider value={{ user, setUser, session, status }}>
                {children}
              </UserContext.Provider>
            </AuthAnimationContext.Provider>
          </QueryContext.Provider>
        </FilterContext.Provider>
      </CollectionContext.Provider>
    </SlideBarContext.Provider>
  );
}

export default ContextProvider;