
import React, { useState, useEffect, useRef } from 'react';
import { screenshots } from '../constants';

const ScreenshotCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1
        ),
      3000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex]);

  return (
    <section className="bg-gray-100 py-20 overflow-hidden">
      <div className="relative w-full h-96">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * (100 / screenshots.length)}%)`, width: `${screenshots.length * 100}%` }}
        >
          {screenshots.map((screenshot, index) => (
            <div key={index} className="w-full h-full flex justify-center items-center" style={{ width: `${100/screenshots.length}%` }}>
              <img 
                src={screenshot.url} 
                alt={screenshot.alt}
                className="max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScreenshotCarousel;
