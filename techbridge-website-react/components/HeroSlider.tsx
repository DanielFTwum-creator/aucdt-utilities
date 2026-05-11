import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    image: "https://aucdt.edu.gh/wp-content/uploads/2020/08/Product-Design-material-test.jpg",
    preTitle: "Department of",
    title: "Product Design",
    link: "#",
    overlayColor: "bg-black/50"
  },
  {
    id: 2,
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/09/Student-ring-design.jpg",
    preTitle: "Department of",
    title: "Jewellery Design",
    link: "#",
    overlayColor: "bg-black/50"
  },
  {
    id: 3,
    image: "https://aucdt.edu.gh/wp-content/uploads/2023/04/Digital-Media-and-Communication-Design-Banner.jpg",
    preTitle: "Department of",
    title: "Digital Media and Communication Design",
    link: "#",
    overlayColor: "bg-black/50"
  },
  {
    id: 4,
    image: "https://aucdt.edu.gh/wp-content/uploads/2022/06/aucdt-fashion3.jpg",
    preTitle: "Welcome to the Department of",
    title: "Fashion Design",
    link: "#",
    overlayColor: "bg-black/50"
  }
];

const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] lg:h-[600px] overflow-hidden group bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
          
          {/* Pattern Overlay (simulated) */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>

          {/* Colour Overlay */}
          <div className={`absolute inset-0 ${slide.overlayColor}`}></div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container px-4 text-center text-white">
              <div className={`transform transition-all duration-700 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h3 className="text-xl md:text-3xl font-light mb-2 text-tuc-gold">{slide.preTitle}</h3>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 uppercase tracking-tight">{slide.title}</h1>
                <a 
                  href={slide.link} 
                  className="inline-block border-2 border-white text-white px-8 py-3 rounded hover:bg-white hover:text-tuc-maroon transition-all duration-300 font-medium uppercase text-sm tracking-wider"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-tuc-gold hover:text-tuc-maroon text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={32} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-tuc-gold hover:text-tuc-maroon text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Next Slide"
      >
        <ChevronRight size={32} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-tuc-gold w-8' : 'bg-white/50 hover:bg-white'
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;