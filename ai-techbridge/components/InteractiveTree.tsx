
import React, { useState } from 'react';
import { RESEARCH_TOPICS, TECHBRIDGE_GOLD, TECHBRIDGE_PRIMARY } from '../constants';

const InteractiveShell: React.FC = () => {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[1/1.2] flex items-center justify-center p-8">
      {/* Decorative pulse indicator */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center -translate-y-32">
        <div className="bg-techbridge-burgundy-dark/90 backdrop-blur-xl text-techbridge-gold-light px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse border border-techbridge-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          Discover research topics
        </div>
      </div>

      <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-visible">
        <defs>
          <filter id="shell-glow">
            <feGaussianBlur stdDeviation="8" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        
        {/* Stylized Conch Shell Path - Centered and Enlarged */}
        <g transform="translate(200, 250) scale(1.4) translate(-100, -125)">
          <path 
            d="M100,250 C120,250 140,240 160,220 C180,200 190,170 190,140 C190,100 170,70 140,50 C110,30 70,30 40,50 C10,70 0,100 10,140 C20,180 50,220 100,250 Z M100,250 C80,250 60,240 40,220 C20,200 10,170 10,140 C10,100 30,70 60,50 C90,30 130,30 160,50 C190,70 200,100 190,140 C180,180 150,220 100,250 Z M100,200 C115,200 130,190 145,170 C160,150 165,130 165,110 C165,85 150,65 130,55 C110,45 90,45 70,55 C50,65 35,85 35,110 C35,130 40,150 55,170 C70,190 85,200 100,200 Z M100,160 C110,160 120,150 130,135 C140,120 145,105 145,90 C145,75 135,60 120,55 C105,50 95,50 80,55 C65,60 55,75 55,90 C55,105 60,120 70,135 C80,150 90,160 100,160 Z"
            fill={TECHBRIDGE_PRIMARY}
            className="transition-all duration-1000 cursor-pointer hover:fill-techbridge-burgundy-dark opacity-95 hover:opacity-100"
            style={{ filter: 'drop-shadow(0 0 30px rgba(139, 21, 56, 0.6))' }}
          />
          {/* Shell detail accents */}
          <path d="M100,250 Q100,150 100,50" stroke={TECHBRIDGE_GOLD} strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M10,140 Q100,140 190,140" stroke={TECHBRIDGE_GOLD} strokeWidth="0.5" fill="none" opacity="0.4" />
        </g>

        {/* Labels and Connectors positioned tighter to the shell silhouette */}
        {RESEARCH_TOPICS.map((topic) => {
          /**
           * Positioning Logic:
           * We base the vertical position on topic.y (scaled).
           * We bring X closer to the center (200) based on alignment.
           */
          const scaledY = 100 + (topic.y * 1.0); // Vertical distribution
          
          // Tightening the X gap to bring links closer to the shell
          const shellX = topic.align === 'end' 
            ? 120 + (topic.x * 0.2)  // Brings left side closer to center
            : 280 + ((topic.x - 200) * 0.2); // Brings right side closer to center

          return (
            <g 
              key={topic.id} 
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
            >
              {/* Connection dot */}
              <circle 
                cx={shellX + (topic.align === 'start' ? -12 : 12)} 
                cy={scaledY} 
                r="4.5" 
                fill={hoveredTopic === topic.id ? TECHBRIDGE_GOLD : "#fff"}
                className={`transition-all duration-500 stroke-techbridge-burgundy stroke-2 ${hoveredTopic === topic.id ? 'scale-150' : ''}`}
              />
              
              {/* Label Text */}
              <text
                x={shellX}
                y={scaledY}
                textAnchor={topic.align}
                alignmentBaseline="middle"
                className={`text-[13px] tracking-tight transition-all duration-500 select-none ${
                  hoveredTopic === topic.id 
                    ? 'fill-techbridge-gold font-black scale-110 translate-x-1' 
                    : topic.anchor ? 'fill-techbridge-gold font-black' : 'fill-white font-bold opacity-90'
                }`}
                style={{ 
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  transform: hoveredTopic === topic.id ? `translateX(${topic.align === 'end' ? '-5px' : '5px'})` : 'none'
                }}
              >
                {topic.text}
              </text>
              
              {/* Interactive invisible hit area */}
              <circle cx={shellX} cy={scaledY} r="30" fill="transparent" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default InteractiveShell;
