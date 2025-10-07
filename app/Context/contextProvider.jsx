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
export const LoaderContext = createContext();
export const GridContext = createContext();
export const AlertContext =createContext();
function ContextProvider({ children }) {
  const [isSlide, setIsSlide] = useState('false');
  const [grid,setGrid]=useState('grid-cols-2')
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState('');
  const [selectedMinPrice, setSelectedMinPrice] = useState();
  const [selectedHighPrice, setSelectedHighPrice] = useState();
  const [authAnimation, setAuthAnimation] = useState(true);
  const [query, setQuery] = useState('');
    const [q, setQ] = useState('');
  const [user, setUser] = useState();
  const [loader,setLoader]=useState(true)

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
            q,
            setQ,
          }}
        >
          <QueryContext.Provider value={[query,setQuery]}>
            <AuthAnimationContext.Provider value={[authAnimation, setAuthAnimation]}>
              <UserContext.Provider value={{ user, setUser, session, status }}>
                <LoaderContext.Provider value={[loader,setLoader]}>
                  <GridContext.Provider value={[grid,setGrid]}>
                {children}
                </GridContext.Provider>
                </LoaderContext.Provider>
              </UserContext.Provider>
            </AuthAnimationContext.Provider>
          </QueryContext.Provider>
        </FilterContext.Provider>
      </CollectionContext.Provider>
    </SlideBarContext.Provider>
  );
}

export default ContextProvider;