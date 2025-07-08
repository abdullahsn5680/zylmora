'use client'
import { AlignJustify } from 'lucide-react';
import React from 'react';

function Align({ slug }) {
  const category = slug;
 

  return (
    <div className="text-slate-500 flex gap-2">
      {/* Default layout icon */}
      <div className="border-2 p-1 border-slate-600 rounded cursor-pointer">
        <AlignJustify />
      </div>

      {/* Rotated layout icon */}
      <div className="border-2 p-1 border-slate-600 rounded cursor-pointer rotate-90">
        <AlignJustify />
      </div>
    </div>
  );
}

export default Align;
