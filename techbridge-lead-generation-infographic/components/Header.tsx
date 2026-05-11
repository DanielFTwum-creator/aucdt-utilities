
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-br from-[#8B1538] to-[#A52A4A] text-center p-12 text-yellow-400 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FFD700', stopOpacity: 0.3 }} />
              <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 0 }} />
            </linearGradient>
            <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          {/* Animated Lines */}
          <g className="lines">
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#line-gradient)" strokeWidth="1" />
            <line x1="90%" y1="20%" x2="10%" y2="80%" stroke="url(#line-gradient)" strokeWidth="1" />
            <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="url(#line-gradient)" strokeWidth="0.5" />
            <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="url(#line-gradient)" strokeWidth="0.5" />
            <line x1="20%" y1="90%" x2="80%" y2="10%" stroke="url(#line-gradient)" strokeWidth="0.5" />
            <line x1="80%" y1="90%" x2="20%" y2="10%" stroke="url(#line-gradient)" strokeWidth="0.5" />
          </g>

          {/* Animated Nodes */}
          <g className="nodes">
            <circle cx="10%" cy="20%" r="4" fill="url(#node-gradient)" />
            <circle cx="90%" cy="80%" r="5" fill="url(#node-gradient)" />
            <circle cx="50%" cy="5%" r="3" fill="url(#node-gradient)" />
            <circle cx="95%" cy="50%" r="6" fill="url(#node-gradient)" />
            <circle cx="20%" y="90%" r="4" fill="url(#node-gradient)" />
            <circle cx="80%" cy="10%" r="5" fill="url(#node-gradient)" />
            <circle cx="30%" cy="60%" r="3" fill="url(#node-gradient)" />
            <circle cx="70%" cy="40%" r="6" fill="url(#node-gradient)" />
          </g>
        </svg>
      </div>
      
      <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-yellow-400 drop-shadow-[3px_3px_4px_rgba(0,0,0,0.3)]">
              TUC
          </h1>
          <p className="mt-2 text-lg md:text-xl font-light text-white opacity-95">
              Techbridge University College
          </p>
      </div>

      <style>{`
        .lines line {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: draw-line 15s linear infinite;
        }
        .lines line:nth-child(2) { animation-delay: -3s; }
        .lines line:nth-child(3) { animation-delay: -6s; animation-duration: 20s; }
        .lines line:nth-child(4) { animation-delay: -9s; animation-duration: 20s;}
        .lines line:nth-child(5) { animation-delay: -12s; }
        .lines line:nth-child(6) { animation-delay: -15s; }

        @keyframes draw-line {
          to {
            stroke-dashoffset: -500;
          }
        }

        .nodes circle {
          animation: pulse-node 8s ease-in-out infinite;
          transform-origin: center center;
        }
        .nodes circle:nth-child(2) { animation-delay: -1s; }
        .nodes circle:nth-child(3) { animation-delay: -2s; }
        .nodes circle:nth-child(4) { animation-delay: -3s; }
        .nodes circle:nth-child(5) { animation-delay: -4s; }
        .nodes circle:nth-child(6) { animation-delay: -5s; }
        .nodes circle:nth-child(7) { animation-delay: -6s; }
        .nodes circle:nth-child(8) { animation-delay: -7s; }

        @keyframes pulse-node {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
