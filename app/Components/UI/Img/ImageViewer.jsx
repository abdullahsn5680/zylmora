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
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-slate-600 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
      </div>
    );
  }

  let thumbnailButtons = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let buttonClass = "relative min-w-28 w-28 h-28 rounded-xl overflow-hidden transition-all duration-500 hover:scale-110 ";
    
    if (isActive) {
      buttonClass += "ring-4 ring-slate-800 ring-offset-4 ring-offset-white shadow-2xl scale-105";
    } else {
      buttonClass += "hover:shadow-2xl opacity-60 hover:opacity-100 border-2 border-slate-200 hover:border-slate-400";
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
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        )}
      </button>
    );
  }

  let mobileDots = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let dotClass = "transition-all duration-500 ";
    
    if (isActive) {
      dotClass += "w-10 h-2.5 bg-gradient-to-r from-slate-700 to-slate-900 rounded-full shadow-lg";
    } else {
      dotClass += "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-500 rounded-full hover:scale-125";
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
    let dotClass = "transition-all duration-500 ";
    
    if (isActive) {
      dotClass += "w-8 h-2.5 bg-white rounded-full shadow-lg";
    } else {
      dotClass += "w-2.5 h-2.5 bg-white/40 rounded-full hover:bg-white/80 hover:scale-125";
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

  let cursorClass = "w-full h-full object-contain transition-all duration-500 ";
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
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 lg:py-8 bg-gradient-to-br from-slate-50 via-white to-slate-100 min-h-screen">
        <div className="text-center mb-8 lg:mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-3xl"></div>
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/50">
            <div className="inline-block">
              <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-slate-600 via-slate-800 to-slate-900 bg-clip-text text-transparent mb-2 tracking-tight">
                Gallery
              </h2>
              <div className="h-1.5 bg-gradient-to-r from-transparent via-slate-800 to-transparent rounded-full"></div>
            </div>
            <p className="text-slate-500 text-sm mt-4 font-medium">Explore and interact with your collection</p>
          </div>
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
              className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl border border-slate-200 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md z-20">
                  <LoadingSpinner />
                </div>
              )}
              
              <img
                ref={imageRef}
                src={displayImages[current]}
                alt={`Image ${current + 1}`}
                className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
                style={imageStyle}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                onLoad={handleImageLoad}
                draggable={false}
              />

              <div className="absolute top-4 right-4 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg border border-white/10">
                {current + 1} / {displayImages.length}
              </div>

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-110 border border-slate-200/50"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-110 border border-slate-200/50"
                >
                  <ZoomOut size={18} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-800 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-slate-200/50"
                >
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 px-4">
              <button
                onClick={handlePrev}
                className="p-4 bg-gradient-to-br from-white to-slate-50 text-slate-800 hover:from-slate-800 hover:to-slate-900 hover:text-white hover:scale-110 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200"
              >
                <ChevronLeft size={22} />
              </button>
              
              <div className="flex gap-2.5">
                {mobileDots}
              </div>
              
              <button
                onClick={handleNext}
                className="p-4 bg-gradient-to-br from-white to-slate-50 text-slate-800 hover:from-slate-800 hover:to-slate-900 hover:text-white hover:scale-110 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div 
            ref={containerRef}
            className="relative w-full max-w-5xl mx-auto aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-2xl border-2 border-slate-200/50 group mb-10 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-md z-20">
                <LoadingSpinner />
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

            <div className="absolute top-5 right-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-10px] group-hover:translate-y-0">
              <div className="flex items-center gap-1 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-white/10">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-110"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="text-white text-sm font-bold px-3 min-w-[50px] text-center">
                  {zoomPercentage}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-1.5 text-white hover:bg-white/20 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-110"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2.5 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-xl border border-white/10"
              >
                <Maximize2 size={16} />
              </button>
            </div>

            <div className="absolute bottom-5 left-5 bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-md text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 font-semibold shadow-xl border border-white/10 translate-y-[10px] group-hover:translate-y-0">
              {current + 1} of {displayImages.length}
            </div>

            {zoomLevel === 1 && (
              <div className="absolute bottom-5 right-5 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 font-medium shadow-xl border border-white/10 translate-y-[10px] group-hover:translate-y-0">
                Double-click to zoom • Drag to pan
              </div>
            )}
          </div>

          <div className="relative group bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-xl border-2 border-slate-200/50 hover:shadow-2xl transition-all duration-500">
            <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-6 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={handlePrev}
                className="bg-gradient-to-br from-white to-slate-50 text-slate-800 hover:from-slate-800 hover:to-slate-900 hover:text-white hover:scale-110 shadow-xl hover:shadow-2xl px-4 py-4 rounded-xl transition-all duration-300 border-2 border-slate-200"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="bg-gradient-to-br from-white to-slate-50 text-slate-800 hover:from-slate-800 hover:to-slate-900 hover:text-white hover:scale-110 shadow-xl hover:shadow-2xl px-4 py-4 rounded-xl transition-all duration-300 border-2 border-slate-200"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="flex overflow-x-auto gap-5 px-20 py-6 no-scrollbar scroll-smooth">
              {thumbnailButtons}
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto p-6">
            <button
              onClick={toggleFullscreen}
              className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-110 z-10 shadow-2xl"
            >
              <X size={26} />
            </button>
            
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={displayImages[current]}
                alt={`Image ${current + 1}`}
                className="max-w-full max-h-full object-contain cursor-pointer transition-all duration-500 rounded-xl shadow-2xl"
                style={imageStyle}
                onMouseDown={handleMouseDown}
                onDoubleClick={handleDoubleClick}
                draggable={false}
              />
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/20 shadow-2xl">
              <button 
                onClick={handlePrev} 
                className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-3">
                {fullscreenDots}
              </div>
              <button 
                onClick={handleNext} 
                className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-xl border border-white/20 font-semibold shadow-2xl">
              {current + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ImageViewer;