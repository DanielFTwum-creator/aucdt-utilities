
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../constants.ts';

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Handle video playback logic when the active slide changes
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === current) {
          video.play().catch(() => {
            // Silently fail if autoplay is blocked, poster will show
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [current]);

  const nextSlide = () => setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrent(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section 
      className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-tuc-forest font-display"
      aria-roledescription="carousel"
      aria-label="TUC Main Highlights"
    >
      {/* Slides Container */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={slide.id} 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
            aria-hidden={idx !== current}
          >
            {/* Background Layer - Always renders image as fallback/base */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
              style={{ 
                backgroundImage: `url(${slide.image})`,
                backgroundColor: '#630f12' // Institutional maroon fallback
              }} 
            />

            {/* Video Layer - Only renders if video property exists */}
            {slide.video && (
              <video
                ref={el => { videoRefs.current[idx] = el; }}
                className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${
                  idx === current ? 'opacity-100' : 'opacity-0'
                }`}
                muted
                loop
                playsInline
                poster={slide.image}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            )}
            
            {/* Overlay - Uses custom color if provided, otherwise default gradient */}
            <div className={`absolute inset-0 z-10 ${slide.overlayColor ? slide.overlayColor : 'bg-gradient-to-r from-tuc-forest/95 via-tuc-forest/50 to-transparent'}`} />
            
            {/* Content Layer */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="max-w-3xl space-y-8 text-left">
                <div className="overflow-hidden">
                   <span className="inline-block text-tuc-gold font-black tracking-[0.4em] uppercase text-xs sm:text-sm animate-slide-in-left">
                     {slide.title}
                   </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </h1>
                
                <div className="flex flex-wrap gap-4 sm:gap-6 pt-4 animate-fade-in-up animation-delay-400">
                  {slide.ctaText && slide.ctaLink && (
                    <a 
                      href={slide.ctaLink} 
                      className="inline-flex items-center gap-3 sm:gap-4 bg-tuc-gold text-tuc-charcoal px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white transition-all shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      {slide.ctaText} <ArrowRight size={20} />
                    </a>
                  )}
                  {/* Keep "Our Story" secondary CTA only on first slide or if specifically desired, here limiting to avoid clutter on department slides */}
                  {idx === 0 && (
                    <a 
                      href="#/about/story" 
                      className="inline-flex items-center gap-3 sm:gap-4 bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-white/20 transition-all focus:outline-none focus:ring-4 focus:ring-white/50"
                    >
                      Our Story
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 z-30 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="p-3 sm:p-4 bg-white/10 hover:bg-tuc-gold hover:text-tuc-forest text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto shadow-lg focus:outline-none focus:ring-4 focus:ring-tuc-gold"
          aria-label="Previous slide"
          title="Previous slide"
        >
          <ChevronLeft size={24} className="sm:w-8 sm:h-8" aria-hidden="true" />
        </button>
        <button 
          onClick={nextSlide}
          className="p-3 sm:p-4 bg-white/10 hover:bg-tuc-gold hover:text-tuc-forest text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto shadow-lg focus:outline-none focus:ring-4 focus:ring-tuc-gold"
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRight size={24} className="sm:w-8 sm:h-8" aria-hidden="true" />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-3 sm:space-x-4">
        {HERO_SLIDES.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)} 
            className={`h-1.5 sm:h-2 transition-all duration-500 rounded-full focus:outline-none focus:ring-2 focus:ring-tuc-gold focus:ring-offset-2 focus:ring-offset-tuc-forest ${
              idx === current ? 'w-12 sm:w-16 bg-tuc-gold shadow-[0_0_15px_rgba(212,160,23,0.6)]' : 'w-3 sm:w-4 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
            title={`Go to slide ${idx + 1}`}
            aria-current={idx === current ? 'true' : 'false'}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
