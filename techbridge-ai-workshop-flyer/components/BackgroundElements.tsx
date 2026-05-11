import React, { useEffect, useState } from 'react';
import { BACKGROUND_VIDEOS } from '../constants';

export const BackgroundElements: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Select a random video on mount
    const randomVideo = BACKGROUND_VIDEOS[Math.floor(Math.random() * BACKGROUND_VIDEOS.length)];
    setVideoSrc(randomVideo);
  }, []);

  return (
    <>
      {/* Dynamic Video Background */}
      {videoSrc && (
        <div className="video-bg absolute inset-0 overflow-hidden z-0 rounded-xl bg-[#050505]">
           <video 
             autoPlay 
             muted 
             loop 
             playsInline 
             onCanPlay={() => setVideoLoaded(true)}
             className={`w-full h-full object-cover scale-110 blur-[3px] transition-opacity duration-1000 ease-in-out ${videoLoaded ? 'opacity-50' : 'opacity-0'}`}
           >
             <source src={videoSrc} type="video/mp4" />
           </video>
        </div>
      )}

      {/* Gradient Overlays for Readability (Ghana Night Sky Theme) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0505]/90 via-[#05100a]/70 to-[#000000]/95 z-0 pointer-events-none mix-blend-multiply" />
      <div className="absolute inset-0 bg-[var(--bg-flyer)] opacity-30 z-0 pointer-events-none mix-blend-overlay" />

      {/* Digital Kente / Adinkra Pattern Overlay */}
      <div className="kente-pattern-bg absolute inset-0 pointer-events-none z-0 mix-blend-screen" />

      {/* --- CULTURAL SYMBOLS (ADINKRA) --- */}
      
      {/* Symbol 1: Mate Masie (Wisdom/Knowledge) - Top Right */}
      <div className="adinkra-bg absolute -top-10 -right-10 w-96 h-96 opacity-10 pointer-events-none z-0 rotate-12 animate-pulse">
        <svg viewBox="0 0 100 100" fill="var(--accent-gold)">
           <rect x="10" y="35" width="35" height="20" rx="5" />
           <rect x="55" y="35" width="35" height="20" rx="5" />
           <rect x="10" y="60" width="35" height="20" rx="5" />
           <rect x="55" y="60" width="35" height="20" rx="5" />
        </svg>
      </div>

      {/* Symbol 2: Gye Nyame (Supremacy) - Bottom Left */}
      <div className="adinkra-bg absolute -bottom-20 -left-20 w-[500px] h-[500px] opacity-10 pointer-events-none z-0 -rotate-12">
        <svg viewBox="0 0 24 24" fill="var(--accent-green)">
           {/* Simplified Representation of Gye Nyame shape */}
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>

      {/* Geometric Lines (Kente Colors) */}
      <div className="absolute top-0 left-0 w-48 h-1 bg-gradient-to-r from-[var(--accent-red)] to-transparent z-10" />
      <div className="absolute top-0 right-0 w-48 h-1 bg-gradient-to-l from-[var(--accent-gold)] to-transparent z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-1 bg-gradient-to-r from-[var(--accent-green)] to-transparent z-10" />
      <div className="absolute bottom-0 right-0 w-48 h-1 bg-gradient-to-l from-[var(--accent-green)] to-transparent z-10" />

      <div className="absolute top-0 left-0 h-48 w-1 bg-gradient-to-b from-[var(--accent-red)] to-transparent z-10" />
      <div className="absolute top-0 right-0 h-48 w-1 bg-gradient-to-b from-[var(--accent-gold)] to-transparent z-10" />
      
      {/* Floating Accent Dots */}
      <div className="glow-orb absolute top-44 left-16 w-1.5 h-1.5 rounded-full opacity-60 animate-pulse" style={{ backgroundColor: 'var(--accent-gold)' }} />
      <div className="glow-orb absolute top-72 right-20 w-1 h-1 rounded-full opacity-50" style={{ backgroundColor: 'var(--accent-red)' }} />
      <div className="glow-orb absolute bottom-64 left-10 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: 'var(--accent-green)' }} />
    </>
  );
};