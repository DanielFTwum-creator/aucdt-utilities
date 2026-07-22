import React from 'react';

interface CareProLogoProps {
  className?: string;
  size?: number;
}

export default function CareProLogo({ className = '', size = 40 }: CareProLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      id="carepro-clinical-svg-logo"
    >
      <defs>
        {/* Deep Slate/Navy Background Gradient */}
        <radialGradient id="logo-bg-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        
        {/* Vivid Rose/Coral Gradient for the Medical Cross */}
        <linearGradient id="logo-cross-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>

        {/* Mint to Emerald Gradient for the Pulse Wave */}
        <linearGradient id="logo-pulse-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Neo-brutalist Drop Shadows */}
        <filter id="logo-neo-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="10" dy="10" stdDeviation="0" floodColor="#000000" floodOpacity="1" />
        </filter>

        {/* Sleek Neon Glow */}
        <filter id="logo-soft-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Thick Outer Neo-brutalist Frame */}
      <rect x="16" y="16" width="480" height="480" rx="64" fill="#000000" />
      
      {/* Glossy Main Canvas */}
      <rect x="16" y="16" width="468" height="468" rx="56" fill="url(#logo-bg-glow)" stroke="#0f172a" strokeWidth="8" />

      {/* Clinical Shield Emblem of Techbridge University College */}
      <path
        d="M 256,60 
           C 350,60 425,85 425,85 
           C 425,85 435,260 380,365 
           C 335,450 256,470 256,470 
           C 256,470 177,450 132,365 
           C 77,260 87,85 87,85 
           C 87,85 162,60 256,60 Z"
        fill="#1e293b"
        stroke="#000000"
        strokeWidth="10"
        filter="url(#logo-neo-shadow)"
      />

      {/* Inner Glowing Shield Border */}
      <path
        d="M 256,78 
           C 338,78 403,100 403,100 
           C 403,100 411,250 365,343 
           C 324,418 256,438 256,438 
           C 256,438 188,418 147,343 
           C 101,250 109,100 109,100 
           C 109,100 174,78 256,78 Z"
        fill="none"
        stroke="#34d399"
        strokeWidth="5"
        strokeDasharray="10 8"
        opacity="0.9"
      />

      {/* Medical Cross with 3D Bevel/Shadowing Details */}
      <g transform="translate(0, -12)">
        {/* Cross Base Shadow */}
        <path
          d="M 216,144 L 296,144 L 296,224 L 376,224 L 376,304 L 296,304 L 296,384 L 216,384 L 216,304 L 136,304 L 136,224 L 216,224 Z"
          fill="#000000"
        />
        
        {/* Main Cross Body */}
        <path
          d="M 220,140 L 292,140 L 292,220 L 372,220 L 372,292 L 292,292 L 292,372 L 220,372 L 220,292 L 140,292 L 140,220 L 220,220 Z"
          fill="url(#logo-cross-grad)"
          stroke="#000000"
          strokeWidth="8"
        />

        {/* Clean Specular Reflection Highlight */}
        <path
          d="M 220,140 L 250,140 L 250,220 L 140,220 L 140,235 L 235,235 L 235,170 L 292,170 L 292,140 Z"
          fill="#ffffff"
          opacity="0.25"
        />
      </g>

      {/* ECG Heartbeat / Vital Pulse wave intersecting the shield */}
      <path
        d="M 105,245 
           L 175,245 
           L 190,215 
           L 205,275 
           L 225,95 
           L 255,395 
           L 275,210 
           L 290,265 
           L 305,245 
           L 407,245"
        fill="none"
        stroke="#000000"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 105,245 
           L 175,245 
           L 190,215 
           L 205,275 
           L 225,95 
           L 255,395 
           L 275,210 
           L 290,265 
           L 305,245 
           L 407,245"
        fill="none"
        stroke="url(#logo-pulse-grad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#logo-soft-glow)"
      />

      {/* Academic / TUC Digital Node Accents */}
      {/* Top Left Star */}
      <g transform="translate(150, 125)">
        <path d="M 0,-14 L 4,-4 L 14,0 L 4,4 L 0,14 L -4,4 L -14,0 L -4,-4 Z" fill="#fbbf24" stroke="#000000" strokeWidth="2.5" />
      </g>
      {/* Top Right Star */}
      <g transform="translate(362, 125)">
        <path d="M 0,-14 L 4,-4 L 14,0 L 4,4 L 0,14 L -4,4 L -14,0 L -4,-4 Z" fill="#fbbf24" stroke="#000000" strokeWidth="2.5" />
      </g>
      
      {/* Interactive Dot Accents */}
      <circle cx="256" cy="115" r="6" fill="#38bdf8" stroke="#000000" strokeWidth="2" />
      <circle cx="210" cy="418" r="5" fill="#38bdf8" />
      <circle cx="256" cy="428" r="7" fill="#34d399" stroke="#000000" strokeWidth="2" />
      <circle cx="302" cy="418" r="5" fill="#38bdf8" />
    </svg>
  );
}
