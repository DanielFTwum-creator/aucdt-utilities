import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface OnboardingCarouselProps {
  onComplete: () => void;
  onStartDemo: () => void;
}

export function OnboardingCarousel({ onComplete, onStartDemo }: OnboardingCarouselProps) {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: '📖 Welcome to Verb Discovery',
      description: 'Learn English verbs by researching, creating, and presenting your own verb profiles!',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '🔍 Step 1: Choose a Verb',
      description: 'Pick from our categories or enter your own verb. Use the dice 🎲 for a random choice!',
      icon: '✨',
      color: 'from-blue-500 to-purple-600',
    },
    {
      title: '📚 Step 2: Research',
      description: 'Find the definition, origin, example sentences, and interesting facts about your verb.',
      icon: '🔎',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: '🎨 Step 3: Create Profile Card',
      description: 'Design a colourful Manila card with your verb. Print it to display or submit!',
      icon: '🖨️',
      color: 'from-pink-500 to-red-600',
    },
    {
      title: '🎤 Step 4: Practice & Present',
      description: 'Use the timer to practice speaking for 2-3 minutes. Then present to your class!',
      icon: '⏱️',
      color: 'from-red-500 to-orange-600',
    },
    {
      title: '✅ Ready to Begin?',
      description: 'Try the demo mode to explore all features, or start your own verb discovery journey!',
      icon: '🚀',
      color: 'from-orange-500 to-yellow-600',
    },
  ];

  const currentSlide = slides[slide];

  return (
    <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={onComplete}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Skip onboarding"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Gradient Header */}
        <div className={`bg-gradient-to-r ${currentSlide.color} text-white p-8 text-center min-h-48 flex flex-col items-center justify-center`}>
          <div className="text-6xl mb-4">{currentSlide.icon}</div>
          <h2 className="text-2xl font-bold">{currentSlide.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 text-center leading-relaxed">{currentSlide.description}</p>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === slide ? 'bg-gray-800 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {slide > 0 && (
              <button
                type="button"
                onClick={() => setSlide(slide - 1)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}

            {slide < slides.length - 1 ? (
              <button
                type="button"
                onClick={() => setSlide(slide + 1)}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={onStartDemo}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  🎮 Try Demo Mode
                </button>
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Start My Journey
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">Slide {slide + 1} of {slides.length}</p>
        </div>
      </div>
    </div>
  );
}
