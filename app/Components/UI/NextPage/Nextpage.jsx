'use client';
import React from 'react';

function Nextpage({ currentPage, totalPages, from, to, total, onNext }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="text-slate-600 w-full text-center">
        Showing {from} - {to} of {total} total
      </div>
      {currentPage < totalPages && (
        <div className="w-full flex justify-center items-center">
          <button
            onClick={onNext}
            type="button"
            className="text-gray-900 self-center flex h-12 w-70 justify-center items-center hover:text-white border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-extrabold border-2 rounded-lg text-sm py-1 px-2 md:px-5 md:py-2.5 text-center"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

export default Nextpage;
