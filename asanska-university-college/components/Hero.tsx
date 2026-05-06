import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from './Icons';

const slides = [
    {
        image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/hero-student.png',
        headline: "Unleash Your Creativity",
        subheadline: "Master the art of fashion design in our state-of-the-art studios.",
        alt: "Fashion design student at AsanSka University"
    },
    {
        image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/what-to-expect-product.png',
        headline: "Innovate and Fabricate",
        subheadline: "Bring your ideas to life in our fully-equipped product design workshops.",
        alt: "Hands-on product design work with wooden pieces"
    },
    {
        image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/program-digital.png',
        headline: "Shape the Digital Narrative",
        subheadline: "Lead the next wave of digital media and communication design.",
        alt: "Student working on a digital design project on a computer"
    },
    {
        image: 'https://storage.googleapis.com/aistudio-hosting/aucdt-assets/gallery-workshop.png',
        headline: "Join a Vibrant Community",
        subheadline: "Collaborate with fellow creative thinkers and build your professional network.",
        alt: "Students collaborating in a workshop"
    }
];

const Hero: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };
    
    useEffect(() => {
        if (isPlaying) {
            const timer = setInterval(nextSlide, 7000);
            return () => clearInterval(timer);
        }
    }, [currentIndex, isPlaying, nextSlide]);

    const currentSlide = slides[currentIndex];

    return (
        <section className="relative w-full h-[90vh] max-h-[800px] overflow-hidden bg-aucdt-primary">
            <div className="absolute inset-0 w-full h-full">
                {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image}
                        alt={slide.alt}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-40' : 'opacity-0'}`}
                    />
                ))}
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
                <div key={currentIndex} className="animate-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight drop-shadow-2xl">
                       {currentSlide.headline}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-lg">
                        {currentSlide.subheadline}
                    </p>
                    <div className="mt-8">
                        <a href="#programs" className="inline-block bg-aucdt-secondary text-aucdt-primary font-bold py-4 px-10 rounded-full text-lg hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Explore Programmes
                        </a>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-aucdt-secondary scale-125' : 'bg-white/50 hover:bg-white'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute z-20 top-1/2 -translate-y-1/2 left-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                aria-label="Previous Slide"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute z-20 top-1/2 -translate-y-1/2 right-4 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                aria-label="Next Slide"
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
            
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute z-20 bottom-6 right-6 p-2 bg-black/30 rounded-full text-white hover:bg-black/50 transition-colors"
                aria-label={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
            >
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>

            <style>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </section>
    );
};

export default Hero;
