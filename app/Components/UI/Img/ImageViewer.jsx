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
      <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
    );
  }

  // Create thumbnail buttons
  let thumbnailButtons = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let buttonClass = "relative min-w-24 w-24 h-24 rounded-lg overflow-hidden transition-all duration-200 ";
    
    if (isActive) {
      buttonClass += "ring-2 ring-blue-500 ring-offset-2 shadow-lg";
    } else {
      buttonClass += "hover:shadow-md opacity-70 hover:opacity-100";
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

  // Create mobile dots
  let mobileDots = [];
  for (let i = 0; i < displayImages.length; i++) {
    let isActive = current === i;
    let dotClass = "transition-all duration-200 ";
    
    if (isActive) {
      dotClass += "w-8 h-2 bg-gray-800 rounded-full";
    } else {
      dotClass += "w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full";
    }

    mobileDots.push(
      <button
        key={i}
        onClick={() => handleThumbnailClick(i)}
        className={dotClass}
      />
    );
  }

  // Create fullscreen dots
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
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">
            Gallery
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
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

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="relative">
            {/* Main Image Container */}
            <div 
              ref={containerRef}
              className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-xl"
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

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium">
                {current + 1} / {displayImages.length}
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:bg-black/60 disabled:opacity-50"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:bg-black/60 disabled:opacity-50"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:bg-black/60"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-6 px-4">
              <button
                onClick={handlePrev}
                className="p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full shadow-sm transition-all duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {mobileDots}
              </div>
              
              <button
                onClick={handleNext}
                className="p-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full shadow-sm transition-all duration-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          {/* Main Selected Image */}
          <div 
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-lg group mb-8"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
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
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  className="p-1 text-white hover:bg-white/20 rounded transition-all duration-200 disabled:opacity-50"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-white text-xs font-medium px-2">
                  {zoomPercentage}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3}
                  className="p-1 text-white hover:bg-white/20 rounded transition-all duration-200 disabled:opacity-50"
                >
                  <ZoomIn size={14} />
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full transition-all duration-200 hover:bg-black/60"
              >
                <Maximize2 size={14} />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {current + 1} of {displayImages.length}
            </div>

            {/* Hint Text */}
            {zoomLevel === 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Double-click to zoom
              </div>
            )}
          </div>

          {/* Horizontal Sliding Thumbnails */}
          <div className="relative group">
            {/* Navigation Buttons */}
            <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 px-4 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handlePrev}
                className="bg-white shadow-lg border border-gray-200 px-3 py-3 rounded-full text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="bg-white shadow-lg border border-gray-200 px-3 py-3 rounded-full text-gray-700 hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Scrollable Thumbnails Container */}
            <div className="flex overflow-x-auto gap-4 px-16 py-4 no-scrollbar scroll-smooth">
              {thumbnailButtons}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto p-4">
            <button
              onClick={toggleFullscreen}
              className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-sm text-white rounded-full border border-white/20 transition-all duration-200 hover:bg-white/20 z-10"
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

            {/* Fullscreen Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
              <button onClick={handlePrev} className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {fullscreenDots}
              </div>
              <button onClick={handleNext} className="p-2 text-white hover:bg-white/20 rounded-full transition-all duration-200">
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