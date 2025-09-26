'use client';
import React, { createContext, useContext, useState } from 'react';
import PopLoader from '@/app/Components/alerts/popLoader';
export const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loader, setLoader] = useState({
    isVisible: false,
    title: "Loading...",
    message: "We're working on your request. Almost there!",
    showProgress: true,
    autoProgress: true,
    initialProgress: 0,
    onComplete: null
  });
  const showLoader = (options = {}) => {
    setLoader({ 
      ...loader,
      isVisible: true,
      ...options
    });
  };
  const hideLoader = () => {
    setLoader(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <PopLoader {...loader} />
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) throw new Error('useLoader must be used within LoaderProvider');
  return context;
}
