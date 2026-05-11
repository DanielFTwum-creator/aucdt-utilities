import React from 'react';

export default function FluidBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0f0518] z-0 pointer-events-none" aria-hidden="true">
      {/* Camera drift container */}
      <div className="absolute inset-[-10%] w-[120%] h-[120%] animate-zoom-drift origin-center">
        
        {/* Orange warmth pulsing in upper left */}
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] rounded-full bg-[#ff7e5f] blur-[120px] animate-pulse-slow mix-blend-screen opacity-50"></div>
        
        {/* Pink glow */}
        <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#ec008c] blur-[100px] animate-pulse-slower mix-blend-screen opacity-30"></div>

        <div className="absolute inset-0 transform -rotate-12 scale-125">
          <svg 
            className="absolute w-[200%] h-[100%] -left-[50%] top-0" 
            viewBox="0 0 4000 1000" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2e0854" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6a0572" stopOpacity="1" />
              </linearGradient>
              
              <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ab336a" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ff7e5f" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="grad-cyan" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00c6ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0072ff" stopOpacity="0.9" />
              </linearGradient>
              
              <filter id="glow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Deep Violet-Purple Layer */}
            <g className="animate-wave-1">
              <path 
                d="M 0 600 Q 250 450 500 600 T 1000 600 T 1500 600 T 2000 600 T 2500 600 T 3000 600 T 3500 600 T 4000 600 L 4000 1200 L 0 1200 Z" 
                fill="url(#grad-purple)" 
              />
            </g>

            {/* Soft Pink Layer */}
            <g className="animate-wave-2">
              <path 
                d="M 0 700 Q 300 550 600 700 T 1200 700 T 1800 700 T 2400 700 T 3000 700 T 3600 700 T 4200 700 L 4200 1200 L 0 1200 Z" 
                fill="url(#grad-pink)" 
                className="mix-blend-overlay"
              />
            </g>

            {/* Cyan/Teal Layer with caustic shimmer */}
            <g className="animate-wave-3">
              <path 
                d="M 0 800 Q 350 650 700 800 T 1400 800 T 2100 800 T 2800 800 T 3500 800 T 4200 800 L 4200 1200 L 0 1200 Z" 
                fill="url(#grad-cyan)" 
                className="mix-blend-screen"
              />
              {/* Caustic shimmer edge */}
              <path 
                d="M 0 800 Q 350 650 700 800 T 1400 800 T 2100 800 T 2800 800 T 3500 800 T 4200 800" 
                fill="none"
                stroke="#ffffff"
                strokeWidth="4"
                strokeOpacity="0.5"
                filter="url(#glow)"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
