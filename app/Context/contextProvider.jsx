'use client';
import React, { useState, useEffect, createContext } from 'react';
import { useSession } from 'next-auth/react';

export const SlideBarContext = createContext();
export const AuthAnimationContext = createContext();
export const CollectionContext = createContext();
export const FilterContext = createContext();
export const QueryContext = createContext();
export const UserContext = createContext();

function ContextProvider({ children }) {
  const [isSlide, setIsSlide] = useState(false);
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

  const { data: session } = useSession();
  const [fetchedUser, setFetchedUser] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.id || fetchedUser) return;

      try {
        const res = await fetch('/api/User', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Id: session.user.id }),
        });

        const result = await res.json();
        if (result?.data) {
          setUser(result.data);
          setFetchedUser(true);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [session?.user?.id, fetchedUser]);


  useEffect(() => {
    const cached = localStorage.getItem('collections');
    if (cached) {
      setCategories(JSON.parse(cached));
      return;
    }

    const fetchCollections = async () => {
      try {
        const res = await fetch('/api/collections');
        const data = await res.json();
        if (data.success) {
          setCategories(data.collections);
          localStorage.setItem('collections', JSON.stringify(data.collections));
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
          }}>
          <QueryContext.Provider value={[query, setQuery]}>
            <AuthAnimationContext.Provider value={[authAnimation, setAuthAnimation]}>
              <UserContext.Provider value={[user, setUser]}>
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
