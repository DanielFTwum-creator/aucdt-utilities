
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../constants.ts';

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent(prev => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrent(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section 
      className="relative w-full h-[700px] overflow-hidden bg-tuc-dark font-display"
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
            {/* Background Layer */}
            {slide.video && idx === current ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={slide.image}
              >
                <source src={slide.video} type="video/mp4" />
              </video>
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${slide.image})` }} 
              />
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-tuc-maroon/90 via-tuc-maroon/40 to-transparent z-10" />
            
            {/* Content Layer */}
            <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex items-center">
              <div className="max-w-3xl space-y-8">
                <div className="overflow-hidden">
                   <span className="inline-block text-tuc-gold font-black tracking-[0.4em] uppercase text-sm animate-slide-in-left">
                     {slide.title}
                   </span>
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter uppercase animate-fade-in-up animation-delay-200">
                  {slide.subtitle}
                </h1>
                
                <div className="flex flex-wrap gap-6 pt-4 animate-fade-in-up animation-delay-400">
                  <a 
                    href={slide.ctaLink} 
                    className="inline-flex items-center gap-4 bg-tuc-gold text-tuc-maroon px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-2xl focus:ring-4 focus:ring-tuc-gold"
                  >
                    {slide.ctaText} <ArrowRight size={20} />
                  </a>
                  <a 
                    href="#/about/story" 
                    className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
                  >
                    Our Story
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-6 z-30 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="p-4 bg-white/10 hover:bg-tuc-gold hover:text-tuc-maroon text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="p-4 bg-white/10 hover:bg-tuc-gold hover:text-tuc-maroon text-white rounded-full backdrop-blur-xl transition-all pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-4">
        {HERO_SLIDES.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)} 
            className={`h-2 transition-all duration-500 rounded-full ${
              idx === current ? 'w-16 bg-tuc-gold shadow-[0_0_15px_rgba(255,203,5,0.6)]' : 'w-4 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
