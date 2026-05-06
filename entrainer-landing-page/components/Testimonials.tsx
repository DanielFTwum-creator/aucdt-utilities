
import React, { useState, useEffect } from 'react';
import { testimonials } from '../constants';

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">What Others Say About Us</h2>
        </div>
        <div className="relative max-w-3xl mx-auto h-48">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute w-full text-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <p className="text-xl italic text-gray-700 mb-4">"{testimonial.quote}"</p>
              <h3 className="font-semibold text-lg text-[#325766]">
                {testimonial.author}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
