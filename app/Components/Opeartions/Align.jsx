'use client'
import { GridContext } from '@/app/Context/contextProvider';
import { AlignJustify } from 'lucide-react';
import React from 'react';
import { useContext } from 'react';
function Align() {

 const [grid,setGrid]=useContext(GridContext)

  return (
    <div className="text-slate-500 flex gap-2">
     
      <div onClick={()=>{setGrid('grid-cols-1')}} className="border-2 p-1 border-slate-600 rounded cursor-pointer">
       
        <AlignJustify />
      </div>

  
      <div onClick={()=>{setGrid('grid-cols-2')}} className="border-2 p-1 border-slate-600 rounded cursor-pointer rotate-90">
        <AlignJustify />
      </div>
    </div>
  );
}

export default Align;
