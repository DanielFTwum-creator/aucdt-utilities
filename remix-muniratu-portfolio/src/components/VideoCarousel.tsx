import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { VIDEO_URLS } from '../constants';

export default function VideoCarousel() {
  const [currentVideos, setCurrentVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to get 4 random videos
  const getRandomVideos = () => {
    const shuffled = [...VIDEO_URLS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Initial load and 60s timer to refresh the pool of 4 videos
  useEffect(() => {
    setCurrentVideos(getRandomVideos());

    const interval = setInterval(() => {
      setCurrentVideos(getRandomVideos());
      setCurrentIndex(0); // Reset index when pool changes
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Auto-advance slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, currentVideos]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % currentVideos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + currentVideos.length) % currentVideos.length);
  };

  if (currentVideos.length === 0) return null;

  return (
    <section className="py-24 bg-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Featured Motion</h2>
          <p className="text-gray-400">Curated selection of our latest video work.</p>
        </div>

        <div className="relative max-w-4xl mx-auto aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentVideos[currentIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <video
                src={currentVideos[currentIndex]}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-8 left-8 pointer-events-none">
                <div className="flex items-center space-x-2 text-orange-500 mb-2">
                  <Play className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold tracking-widest uppercase">Now Playing</span>
                </div>
                <p className="font-mono text-xs text-gray-400 truncate max-w-md">
                  {currentVideos[currentIndex].split('/').pop()}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {currentVideos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-orange-500 w-6' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
