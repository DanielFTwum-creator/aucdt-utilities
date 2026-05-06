import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://picsum.photos/1920/1080?random=1',
    title: 'ADMISSIONS OPEN',
    subtitle: 'Shape Your Future at CKT-UTAS',
    cta: 'Check Details',
    link: '#admissions'
  },
  {
    id: 2,
    image: 'https://picsum.photos/1920/1080?random=2',
    title: 'ACADEMIC CALENDAR',
    subtitle: '2024/2025 Academic Year',
    cta: 'View Calendar',
    link: '#calendar'
  },
  {
    id: 3,
    image: 'https://picsum.photos/1920/1080?random=3',
    title: 'RESEARCH EXCELLENCE',
    subtitle: 'Innovating for Development',
    cta: 'Explore Research',
    link: '#research'
  }
];

const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  }, [current, length]);

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
        nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover transform scale-105 transition-transform duration-[10000ms]"
            style={{ transform: index === current ? 'scale(1.1)' : 'scale(1.0)' }}
          />
          
          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                <div className={`max-w-2xl transition-all duration-1000 delay-300 transform ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <h2 className="text-secondary font-bold tracking-widest text-sm md:text-base mb-2 uppercase">{slide.subtitle}</h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                        {slide.title}
                    </h1>
                    <a 
                        href={slide.link} 
                        className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-primary-dark font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                        {slide.cta}
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors hidden md:block"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-colors hidden md:block"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
            <button 
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? 'bg-secondary w-8' : 'bg-white/50 hover:bg-white'}`}
            />
        ))}
      </div>
    </section>
  );
};

export default Hero;