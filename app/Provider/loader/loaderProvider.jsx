'use client';
import React, { useContext } from 'react';
import Loader from '@/app/Components/Loader/loader';
import { LoaderContext } from '@/app/Context/contextProvider';

function LoaderProvider({ children }) {
  const [loader] = useContext(LoaderContext);

  return (
    <div className="w-full h-full">
      {children}
 {/* <div className={`${loader&&'hidden'}`}>{children}</div>
 <div className={`${loader&&'flex'} fixed w-full`}><Loader/></div> */}
    </div>
  );
}

export default LoaderProvider;
