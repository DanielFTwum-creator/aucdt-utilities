import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onFinished: () => void;
}

export function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [caption, setCaption] = useState<string>("Tuning the Djembes...");

  useEffect(() => {
    // Dynamic caption switching based on progress milestones
    if (progress < 25) {
      setCaption("Tuning the Djembes...");
    } else if (progress < 50) {
      setCaption("Gathering the savannah winds...");
    } else if (progress < 75) {
      setCaption("Waking the Great Elephant...");
    } else if (progress < 100) {
      setCaption("Setting the heartbeat...");
    } else {
      setCaption("Ready!");
    }
  }, [progress]);

  useEffect(() => {
    const duration = 2500; // Total loading time in ms
    const intervalTime = 30; // Smooth tick interval
    const totalSteps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentProgress = Math.min(Math.round((currentStep / totalSteps) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(timer);
        // Let it linger slightly at 100% for smooth user experience, then fade out
        setTimeout(() => {
          setIsFadingOut(true);
          // Wait for the opacity fade transition to complete before unmounting
          setTimeout(() => {
            onFinished();
          }, 700);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinished]);

  return (
    <div
      id="app-loader"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-radial from-[#FDFBF7] to-[#FAF2E8] transition-opacity duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-8 text-center space-y-8 flex flex-col items-center">
        
        {/* Animated Headline */}
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-black text-[#78350F] tracking-tight">
            An Elephant on Parade
          </h1>
          <p className="font-mono text-[10px] font-bold text-amber-600 uppercase tracking-widest">
            The Heartbeat of Africa
          </p>
        </div>

        {/* Animated Walking Elephant and Progress Track Container */}
        <div className="w-full relative pt-20">
          
          {/* Walking Elephant Wrapper (Horizontally moves with progress) */}
          <div
            className="absolute bottom-[10px] -translate-x-1/2 transition-all duration-100 ease-out"
            style={{ left: `${progress}%` }}
          >
            {/* Custom SVG Elephant with modular animated parts */}
            <svg
              viewBox="0 0 200 150"
              className="w-24 h-18 text-[#78350F] fill-current drop-shadow-md"
              aria-hidden="true"
            >
              {/* Back Legs (Drawn behind body, darker shade for depth) */}
              <rect
                x="62"
                y="105"
                width="12"
                height="32"
                rx="6"
                fill="#5F260A"
                className="animate-elephant-leg-back-2"
              />
              <rect
                x="115"
                y="105"
                width="12"
                height="32"
                rx="6"
                fill="#5F260A"
                className="animate-elephant-leg-front-2"
              />

              {/* Elephant Body Group (Gentle bouncing cycle) */}
              <g className="animate-elephant-body">
                {/* Tail */}
                <path
                  d="M 46,72 Q 38,82 40,102"
                  stroke="#78350F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Main Body */}
                <path d="M 50,75 C 50,52 68,42 105,42 C 132,42 145,55 145,75 C 145,90 140,100 132,105 C 122,108 72,108 58,105 C 50,100 50,90 50,75 Z" />

                {/* Decorative Pan-African Blanket/Saddle */}
                {/* Red Base */}
                <path
                  d="M 75,44 C 80,44 120,44 125,44 C 128,75 125,82 125,82 C 115,82 85,82 75,82 Z"
                  fill="#B91C1C"
                />
                {/* Gold Stripe */}
                <path
                  d="M 85,44 C 90,44 110,44 115,44 C 117,75 115,82 115,82 C 110,82 90,82 85,82 Z"
                  fill="#D97706"
                />
                {/* Green Stripe */}
                <path
                  d="M 95,44 C 97,44 103,44 105,44 C 106,75 105,82 105,82 C 103,82 97,82 95,82 Z"
                  fill="#15803D"
                />

                {/* White Ivory Tusk */}
                <path
                  d="M 142,80 C 147,80 151,85 149,89 C 147,91 143,87 142,80 Z"
                  fill="#FFFFFF"
                />

                {/* Animated Swing Trunk */}
                <g className="animate-elephant-trunk">
                  <path d="M 135,65 C 153,62 167,72 167,88 C 167,92 163,96 159,94 C 155,92 158,85 158,85 C 158,78 148,74 135,74" />
                </g>

                {/* Animated Flap Ear (Darker shade for contrast overlay) */}
                <g className="animate-elephant-ear">
                  <path
                    d="M 115,48 C 92,48 82,68 82,88 C 82,108 97,112 112,108 C 122,103 127,83 127,63 C 127,53 122,48 115,48 Z"
                    fill="#92400E"
                  />
                </g>
              </g>

              {/* Front Legs (Drawn in front of body, lighter shade) */}
              <rect
                x="67"
                y="105"
                width="12"
                height="32"
                rx="6"
                fill="#78350F"
                className="animate-elephant-leg-back-1"
              />
              <rect
                x="120"
                y="105"
                width="12"
                height="32"
                rx="6"
                fill="#78350F"
                className="animate-elephant-leg-front-1"
              />
            </svg>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2 bg-amber-900/10 rounded-full overflow-hidden shadow-inner border border-amber-900/5">
            <div
              className="h-full bg-linear-to-r from-[#D97706] to-[#B91C1C] rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Captions & Loading Stats */}
        <div className="space-y-2 pt-2">
          <p className="font-sans text-sm font-semibold text-brand-earth italic animate-pulse">
            {caption}
          </p>
          <p className="font-mono text-xs font-bold text-slate-400">
            {progress}%
          </p>
        </div>

      </div>
    </div>
  );
}
