import React, { useState, useEffect, useCallback } from 'react';
import type { PresentationData } from '../types';
import Slide from './Slide';

interface PreviewProps {
  data: PresentationData;
}

const Preview: React.FC<PreviewProps> = ({ data }) => {
  const { frontmatter, slides } = data;
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length + 1; // +1 for the title slide

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    // Attach to the parent document to capture keys globally when preview is focused
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);
  
  // Reset to first slide if content changes and current slide is out of bounds
  useEffect(() => {
    if (currentSlide >= totalSlides) {
        setCurrentSlide(totalSlides - 1);
    }
  }, [totalSlides, currentSlide]);


  return (
    <div className="flex flex-col h-full bg-gray-200 dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden qa-preview-wrapper">
       <div className="app-wrapper">
        <div className="header">
            <span className="header-title" title={frontmatter.title?.replace(/<br>/g, ' ')}>
              {frontmatter.title?.replace(/<br>/g, ' ') || 'Presentation'} • AUCDT
            </span>
            <div className="header-info">
                <span className="header-counter">
                  <span>{currentSlide + 1}</span> / <span>{totalSlides}</span>
                </span>
                <span className="header-nav">← → or Space</span>
            </div>
        </div>

        <div className="slides-container">
            <Slide
              isTitleSlide={true}
              isActive={currentSlide === 0}
              content={frontmatter}
            />
            {slides.map((slide, index) => (
              <Slide
                key={slide.id}
                isTitleSlide={false}
                isActive={currentSlide === index + 1}
                content={slide.content}
              />
            ))}
        </div>

        <div className="footer">
            AUCDT - Excellence in Design & Technology
        </div>
    </div>
    </div>
  );
};

export default Preview;
