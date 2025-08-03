'use client';
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Maximize2 } from 'lucide-react';

function ImageViewer({ images }) {
  const [current, setCurrent] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Sample images for demo
  const defaultImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&h=800&fit=crop&q=80'
  ];

  let displayImages = defaultImages;
  if (images) {
    displayImages = images;
  }

  function handlePrev() {
    let newCurrent = current - 1;
    if (newCurrent < 0) {
      newCurrent = displayImages.length - 1;
    }
    setCurrent(newCurrent);
    resetZoom();
  }

  function handleNext() {
    let newCurrent = current + 1;
    if (newCurrent >= displayImages.length) {
      newCurrent = 0;
    }
    setCurrent(newCurrent);
    resetZoom();
  }

  function resetZoom() {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }

  function handleZoomIn() {
    if (zoomLevel < 3) {
      let newZoom = zoomLevel + 0.5;
      if (newZoom > 3) {
        newZoom = 3;
      }
      setZoomLevel(newZoom);
    }
  }

  function handleZoomOut() {
    if (zoomLevel > 1) {
      let newZoom = zoomLevel - 0.5;
      if (newZoom < 1) {
        newZoom = 1;
      }
      setZoomLevel(newZoom);
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  }

  function handleMouseDown(e) {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
      e.preventDefault();
    }
  }

  function handleMouseMove(e) {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxX = (zoomLevel - 1) * 200;
      const maxY = (zoomLevel - 1) * 150;
      
      let finalX = newX;
      let finalY = newY;
      
      if (finalX > maxX) finalX = maxX;
      if (finalX < -maxX) finalX = -maxX;
      if (finalY > maxY) finalY = maxY;
      if (finalY < -maxY) finalY = -maxY;
      
      setPosition({ x: finalX, y: finalY });
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleDoubleClick() {
    if (zoomLevel === 1) {
      setZoomLevel(2);
    } else {
      resetZoom();
    }
  }

  function handleThumbnailClick(index) {
    if (index !== current) {
      setCurrent(index);
      resetZoom();
    }
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
    resetZoom();
  }

  function handleImageLoad() {
    setIsLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (isFullscreen) {
        setIsFullscreen(false);
      } else if (zoomLevel > 1) {
        resetZoom();
      }
    }
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      handleZoomIn();
    }
    if (e.key === '-') {
      e.preventDefault();
      handleZoomOut();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

  function LoadingSpinner() {
    return (
      <div className="w-8 h-8 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
    );
  }

  let thumbnailButtons = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let buttonClass = "relative min-w-24 w-24 h-24 rounded-md overflow-hidden transition-all duration-300 hover:scale-105 ";
    
    if (isActive) {
      buttonClass += "ring-2 ring-slate-800 ring-offset-2 shadow-lg";
    } else {
      buttonClass += "hover:shadow-lg opacity-70 hover:opacity-100 border border-slate-200";
    }

    thumbnailButtons.push(
      <button
        key={i}
        onClick={() => handleThumbnailClick(i)}
        className={buttonClass}
      >
        <img
          src={displayImages[i]}
          alt={`Thumbnail ${i + 1}`}
          className="w-full h-full object-cover"
        />
      </button>
    );
  }


  let mobileDots = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let dotClass = "transition-all duration-300 ";
    
    if (isActive) {
      dotClass += "w-8 h-2 bg-slate-800 rounded-full";
    } else {
      dotClass += "w-2 h-2 bg-slate-300 hover:bg-slate-400 rounded-full";
    }

    mobileDots.push(
      <button
        key={i}
        onClick={() => handleThumbnailClick(i)}
        className={dotClass}
      />
    );
  }


  let fullscreenDots = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let dotClass = "transition-all duration-300 ";
    
    if (isActive) {
      dotClass += "w-6 h-2 bg-white rounded-full";
    } else {
      dotClass += "w-2 h-2 bg-white/50 rounded-full hover:bg-white/70";
    }

    fullscreenDots.push(
      <button
        key={i}
        onClick={() => handleThumbnailClick(i)}
        className={dotClass}
      />
    );
  }

  let imageStyle = {
    transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`
  };

  let cursorClass = "w-full h-full object-contain transition-all duration-300 ";
  if (isDragging) {
    cursorClass += "cursor-grabbing";
  } else if (zoomLevel > 1) {
    cursorClass += "cursor-grab";
  } else {
    cursorClass += "cursor-pointer";
  }

  let zoomPercentage = Math.round(zoomLevel * 100);

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 lg:py-8">
       
        <div className="text-center mb-8 lg:mb-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-4 tracking-wide">
            Gallery
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-slate-300 to-slate-800 mx-auto rounded-full"></div>
        </div>

        <style jsx>{`
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

      
        <div className="md:hidden">
          <div className="relative">
           
            <div 
              ref={containerRef}
              className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                  <LoadingSpinner />
                </div>
              )}
              
              <img
                ref={imageRef}
                src={displayImages[current]}
                alt={`Image ${current + 1}`}
                className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
                style={imageStyle}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                onLoad={handleImageLoad}
                draggable={false}
              />

              
              <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                {current + 1} / {displayImages.length}
              </div>

            
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-2 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-2 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white rounded-md transition-all duration-300 border border-slate-200"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

         
            <div className="flex justify-between items-center mt-6 px-4">
              <button
                onClick={handlePrev}
                className="p-3 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {mobileDots}
              </div>
              
              <button
                onClick={handleNext}
                className="p-3 bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 rounded-md shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

          <div className="hidden md:block">
         
          <div 
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 shadow-sm border border-slate-100 group mb-8 hover:shadow-lg transition-all duration-300"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              ref={imageRef}
              src={displayImages[current]}
              alt={`Image ${current + 1}`}
              className={cursorClass}
              style={imageStyle}
              onMouseDown={handleMouseDown}
              onDoubleClick={handleDoubleClick}
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-md">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1 text-white hover:bg-white/20 rounded transition-all duration-300 disabled:opacity-50"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-white text-xs font-medium px-2">
                  {zoomPercentage}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-1 text-white hover:bg-white/20 rounded transition-all duration-300 disabled:opacity-50"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-slate-800/90 backdrop-blur-sm text-white rounded-md transition-all duration-300 hover:bg-slate-700/90"
              >
                <Maximize2 size={14} />
              </button>
            </div>

           
            <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {current + 1} of {displayImages.length}
            </div>

          
            {zoomLevel === 1 && (
              <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Double-click to zoom
              </div>
            )}
          </div>

         
          <div className="relative group bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
       
            <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handlePrev}
                className="bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-sm hover:shadow-lg px-3 py-3 rounded-md transition-all duration-300 border border-slate-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="bg-slate-100 text-slate-800 hover:bg-slate-800 hover:text-white hover:scale-105 shadow-sm hover:shadow-lg px-3 py-3 rounded-md transition-all duration-300 border border-slate-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>

         
            <div className="flex overflow-x-auto gap-4 px-16 py-4 no-scrollbar scroll-smooth">
              {thumbnailButtons}
            </div>
          </div>
        </div>
      </div>

     
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto p-4">
            <button
              onClick={toggleFullscreen}
              className="absolute top-6 right-6 p-3 bg-slate-100/20 backdrop-blur-sm text-white rounded-md border border-white/20 transition-all duration-300 hover:bg-slate-100/30 z-10"
            >
              <X size={24} />
            </button>
            
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={displayImages[current]}
                alt={`Image ${current + 1}`}
                className="max-w-full max-h-full object-contain cursor-pointer"
                style={imageStyle}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                draggable={false}
              />
            </div>

            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-800/20 backdrop-blur-md px-6 py-3 rounded-md border border-white/20">
              <button onClick={handlePrev} className="p-2 text-white hover:bg-white/20 rounded-md transition-all duration-300">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {fullscreenDots}
              </div>
              <button onClick={handleNext} className="p-2 text-white hover:bg-white/20 rounded-md transition-all duration-300">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageViewer;