'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  title: string;
  images: {
    src: string;
    alt: string;
  }[];
}

const ImageGallery = ({ title, images }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsLoading(true);
    setError(null);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setIsLoading(true);
    setError(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      if (distance > 50) {
        nextImage();
      } else if (distance < -50) {
        prevImage();
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative">
        <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          No images available
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  if (isMobile) {
    return (
      <div className="relative max-w-[800px] mx-auto">
        <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
        <div className="flex flex-col gap-6">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img.src}
              alt={img.alt}
              width={800}
              height={400}
              className="w-full object-cover rounded-lg"
              unoptimized
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-[800px] mx-auto">
      <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ borderRadius: '12px' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12"></div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            {error}
          </div>
        )}
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={800}
            height={400}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${!isMobile ? 'cursor-pointer' : ''}`}
            onClick={() => !isMobile && setIsPopupOpen(true)}
            onLoad={() => {
              console.log('Image loaded successfully:', currentImage.src);
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error('Image load error:', {
                src: currentImage.src,
                error: e
              });
              setError(`Failed to load image: ${currentImage.src}`);
              setIsLoading(false);
            }}
            priority={currentIndex === 0}
            unoptimized
          />
        </div>
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 transition-colors group"
          aria-label="Previous image"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
              stroke="white"
              className="group-hover:stroke-black transition-colors"
            />
          </svg>
          <style jsx>{`
            .group:hover {
              background-color: #ffe03b !important;
            }
          `}</style>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10 transition-colors group"
          aria-label="Next image"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
              stroke="white"
              className="group-hover:stroke-black transition-colors"
            />
          </svg>
          <style jsx>{`
            .group:hover {
              background-color: #ffe03b !important;
            }
          `}</style>
        </button>
      </div>
      <p className="hidden md:block text-center text-sm text-white mt-2">Click image to zoom</p>
      <div className="mt-4 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsLoading(true);
              setError(null);
            }}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-black' : 'bg-gray-300'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
      
      {isPopupOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" 
          onClick={() => setIsPopupOpen(false)}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center p-4" 
            
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={e => e.stopPropagation()}
              
            >
              <button
                className="absolute -top-14 right-0 bg-black text-white rounded-full p-2 shadow z-10 transition-colors group"
                onClick={() => setIsPopupOpen(false)}
                aria-label="Close"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M6 18L18 6M6 6l12 12" 
                    stroke="white"
                    className="group-hover:stroke-black transition-colors"
                  />
                </svg>
                <style jsx>{`
                  .group:hover {
                    background-color: #ffe03b !important;
                  }
                `}</style>
              </button>
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                width={1200}
                height={600}
                className="w-full h-full object-contain"
                unoptimized
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10 transition-colors group"
                aria-label="Previous image"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 19l-7-7 7-7"
                    stroke="white"
                    className="group-hover:stroke-black transition-colors"
                  />
                </svg>
                <style jsx>{`
                  .group:hover {
                    background-color: #ffe03b !important;
                  }
                `}</style>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full z-10 transition-colors group"
                aria-label="Next image"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                    stroke="white"
                    className="group-hover:stroke-black transition-colors"
                  />
                </svg>
                <style jsx>{`
                  .group:hover {
                    background-color: #ffe03b !important;
                  }
                `}</style>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 