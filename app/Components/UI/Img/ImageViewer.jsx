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
    <div className="more_img mt-10 w-full   mx-auto">
   <div className="w-full text-center text-3xl font-bold text-slate-700 mb-6 tracking-wide relative">
  <span className="inline-block bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent drop-shadow-md">
    More Images
  </span>
  <div className="w-20 h-1 bg-red-400 mx-auto mt-2 rounded-full"></div>
</div>
      <div className=" md:hidden flex items-center justify-center gap-4">
     
        <button
          onClick={handlePrev}
          className="bg-gray-200 hover:bg-gray-300 text-black rounded-full p-3 shadow"
        >
          <ChevronLeft size={20} />
        </button>

    
        <div className="relative w-[80%] aspect-square rounded-xl overflow-hidden border bg-gray-100 shadow-md">
          <Image
            key={current}
            src={images[current]}
            alt={`Product image ${current + 1}`}
            fill
            className="object-cover transition-all duration-500 ease-in-out"
            priority
          />
  
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {current + 1} / {images.length}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="bg-gray-200 hover:bg-gray-300 text-black rounded-full p-3 shadow"
        >
          <ChevronRight size={20} />
        </button>
      </div>

  
      <div className="hidden md:flex gap-4 w-full overflow-x-auto md:justify-center mt-6">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setCurrent(index)}
            className={`min-w-[120px] md:min-w-[150px] aspect-square rounded overflow-hidden border cursor-pointer transition-all duration-300
              ${current === index ? 'border-red-500 shadow-md' : 'border-gray-300 hover:border-red-400'}`}
          >
            <Image
              src={img}
              alt={`Product image ${index + 1}`}
              width={150}
              height={150}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageViewer;
