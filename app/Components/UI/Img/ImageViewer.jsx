'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function ImageViewer({ images }) {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="more_img mt-16 w-full max-w-6xl mx-auto px-4">
    
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-900 mb-4 tracking-wide">
          More Images
        </h2>
        <div className="w-24 h-0.5 bg-gray-900 mx-auto"></div>
      </div>


      <div className="md:hidden flex items-center justify-center gap-4 mb-8">
       

        <div className="relative w-[90%] aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-lg">
    
          <Image
            key={current}
            src={images[current]}
            alt={`Product image ${current + 1}`}
            fill
            className="object-contain transition-all duration-500 ease-in-out hover:scale-105"
            priority
          />
          
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full font-medium">
            {current + 1} / {images.length}
          </div>
        </div>

     
      </div>

      <div className="hidden md:block">
       
        <div className="flex gap-6 w-full overflow-x-auto justify-center px-4">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`min-w-[140px] w-[140px] h-[140px] rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                current === index 
                  ? 'border-gray-900 shadow-lg ring-2 ring-gray-200' 
                  : 'border-gray-300 hover:border-gray-500 shadow-sm'
              }`}
            >
              <Image
                src={img}
                alt={`Product thumbnail ${index + 1}`}
                width={140}
                height={140}
                className="object-contain w-full h-full bg-gray-50"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="md:hidden flex justify-between w-[90%] mx-auto  mt-4 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-full p-3 shadow-sm transition-all duration-200">
            <button
          onClick={handlePrev}
          className="bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-full p-3 shadow-sm transition-all duration-200"
        >
          <ChevronLeft size={15} />
       
        </button>
              <div className=" flex justify-center items-center gap-2">    {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              current === index 
                ? 'bg-gray-900 w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}</div>
           <button
          onClick={handleNext}
          className="bg-white border-2  border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 rounded-full p-3 shadow-sm transition-all duration-200"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default ImageViewer;