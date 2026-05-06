import React, { useState, useEffect } from 'react';
import { ShowcaseImage } from '../types';

interface ShowcaseProps {
  images: ShowcaseImage[];
}

export const Showcase: React.FC<ShowcaseProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full mb-10 overflow-hidden relative rounded-xl border border-[var(--border-color)] group shadow-2xl">
      
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] bg-black">
        {images.map((img, idx) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={img.url} 
              alt={img.caption} 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-root)] via-transparent to-transparent" />
          </div>
        ))}
        
        {/* Holographic Scanline Overlay (Aesthetic Only) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 z-10"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 255, 127, 0.1) 50%)',
            backgroundSize: '100% 4px'
          }}
        />
      </div>

      {/* Controls / Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end z-20">
        <div className="flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'w-8 bg-[var(--accent-gold)]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <div className="text-right">
          {/* Badge completely removed as requested */}
          <p className="text-lg font-playfair font-bold text-white leading-none drop-shadow-md">
            {images[activeIndex].caption}
          </p>
        </div>
      </div>
    </div>
  );
};