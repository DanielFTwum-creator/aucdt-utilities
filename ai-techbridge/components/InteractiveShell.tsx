
import React, { useState } from 'react';
import { RESEARCH_TOPICS, TECHBRIDGE_GOLD, TECHBRIDGE_PRIMARY } from '../constants';

interface InteractiveShellProps {
  onViewPlaceholder: () => void;
}

const InteractiveShell: React.FC<InteractiveShellProps> = ({ onViewPlaceholder }) => {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);

  // Identify active topic characteristics
  const activeTopic = RESEARCH_TOPICS.find(t => t.id === hoveredTopic);
  
  // Morph Factor: Determines how much the shell deforms towards the topic.
  // -1 for left, 1 for right, 0 for neutral.
  const morphDirection = activeTopic ? (activeTopic.align === 'start' ? 1 : -1) : 0;
  
  // Vertical Pull: Based on topic Y position relative to center (250)
  // This stretches or compresses the shell vertically to "reach" for the node.
  // We clamp it slightly to prevent extreme distortion.
  const pullY = activeTopic ? Math.max(-40, Math.min(40, (activeTopic.y - 250) / 8)) : 0;
  
  // --- Dynamic Control Points for Organic Shape Shifting ---
  
  // Top Bulb (The Tip): Sways significantly towards the topic and stretches vertically
  // Enhanced range for more dramatic "reaching"
  const topCurveX = 190 + (morphDirection * 50); 
  const topCurveY = 140 + (pullY * 1.5);
  
  // Mid Section (The Body): Moves to support the tip
  const midCurveX = 160 + (morphDirection * 30);
  const midCurveY = 220 + (pullY * 0.5);

  // Base: Anchored but tilts slightly to counterbalance
  const bottomCurveX = 100 + (morphDirection * 20);
  
  // Left Side Bulge: Counter-movement to preserve "volume"
  const leftBulgeX = 10 + (morphDirection * -20); 
  const leftBulgeY = 140 + (pullY * 0.2);

  // Reactive Transform Logic (Lean, Skew, Translate)
  // When hovering, the entire shell leans and shifts towards the topic
  const leanRotation = morphDirection * 12; // Increased rotation
  const leanSkew = morphDirection * 5;
  const shiftX = morphDirection * 25; // Physical shift towards the side
  const shiftY = activeTopic ? (activeTopic.y - 250) / 12 : 0;

  const handleKeyDown = (e: React.KeyboardEvent, topicId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setHoveredTopic(topicId);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[1/1.2] flex items-center justify-center p-8">
      {/* Dynamic Status HUD */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center -translate-y-48"
        aria-live="polite"
      >
        <div className={`transition-all duration-700 ease-out flex flex-col items-center transform ${hoveredTopic ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-4 scale-95'}`}>
          <div className="bg-techbridge-burgundy-dark/90 backdrop-blur-2xl text-techbridge-gold-light px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-techbridge-gold/40 shadow-[0_0_40px_rgba(212,175,55,0.25)] mb-2">
            {activeTopic ? `Active Node: ${activeTopic.text}` : 'System Idle'}
          </div>
          <div className="h-0.5 w-16 bg-techbridge-gold/50 rounded-full animate-pulse"></div>
        </div>
      </div>

      <svg 
        viewBox="0 0 400 500" 
        className="w-full h-full overflow-visible drop-shadow-[0_20px_60px_rgba(139,21,56,0.15)]"
        aria-label="Interactive Research Map: Use Tab keys to navigate through research topics."
        role="application"
      >
        <defs>
          <filter id="wireframe-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={TECHBRIDGE_GOLD} stopOpacity="0.9" />
            <stop offset="100%" stopColor={TECHBRIDGE_PRIMARY} stopOpacity="0.4" />
          </linearGradient>
          
           <linearGradient id="core-grad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={TECHBRIDGE_PRIMARY} stopOpacity="0.05" />
            <stop offset="100%" stopColor={TECHBRIDGE_GOLD} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* REACTIVE GROUP: Handles Interaction Transforms (Lean, Skew, Rotate, Translate) */}
        <g 
          className="transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ 
            transform: `translate(200px, 250px) translate(${shiftX}px, ${shiftY}px) rotate(${leanRotation}deg) skewX(${leanSkew}deg) translate(-200px, -250px)`,
            transformOrigin: '200px 250px'
          }}
        >
          {/* ANIMATED GROUP: Handles Continuous Pulse (Scale/Opacity) */}
          <g className="animate-shell-breathe origin-center">
            
            {/* 1. The Morphing Base Shell Body */}
            <path 
              d={`
                M100,250 
                C120,250 140,240 ${midCurveX},${midCurveY} 
                C${180 + morphDirection * 10},${200 + pullY * 0.2} ${topCurveX},${170 + pullY * 0.5} ${topCurveX},${topCurveY} 
                C${topCurveX},${100 + pullY * 0.5} ${170 - morphDirection * 10},70 140,50 
                C110,30 70,30 40,50 
                C10,70 0,100 ${leftBulgeX},${leftBulgeY} 
                C${20 + morphDirection * -5},180 50,220 ${bottomCurveX},250 Z
              `}
              fill="url(#core-grad)"
              stroke={TECHBRIDGE_GOLD}
              strokeWidth="0.5"
              className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              transform="translate(100, 125)"
            />

            {/* 2. The Inner "Pulse" Wireframe - Synchronized Animation */}
            {/* Control points are slightly offset to create 3D depth effect during morph */}
            <path 
              d={`
                M100,240 
                C115,240 130,230 ${midCurveX-10},${midCurveY-10} 
                C${170 + morphDirection * 8},190 ${topCurveX-10},${165 + pullY * 0.4} ${topCurveX-10},${140 + pullY * 1.2} 
                C${topCurveX-10},${110 + pullY * 0.4} 165,85 140,70 
                C115,55 85,55 60,70 
                C35,85 20,110 ${leftBulgeX+10},${leftBulgeY} 
                C${leftBulgeX+10},175 40,210 100,240 Z
              `}
              fill="none"
              stroke="url(#gold-grad)"
              className={`transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] animate-wireframe-pulse`}
              strokeDasharray="4 4"
              transform="translate(100, 125)"
              filter="url(#wireframe-glow)"
            />
            
            {/* 3. Internal Geometry Lines (Ribs) - Also morphing */}
            {[20, 60, 100, 140, 180, 220].map((offset, i) => (
               <path 
                 key={i}
                 d={`M${100 - (offset/3)},${240 - (offset/4)} Q${100 + (morphDirection * 15)},${200 - (offset/2) + (pullY/2)} ${100 + (offset/3) + (morphDirection * 20)},${240 - (offset/4)}`}
                 fill="none"
                 stroke={TECHBRIDGE_GOLD}
                 strokeWidth="0.5"
                 opacity="0.15"
                 transform="translate(100, 125)"
                 className="transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
               />
            ))}
          </g>
        </g>

        {/* Research Nodes & Connections */}
        {RESEARCH_TOPICS.map((topic) => {
          const isLeft = topic.align === 'end';
          const isCurrent = hoveredTopic === topic.id;
          
          // Determine connection point on the shell based on morph state
          // We attach to the edge that is closest, shifting with the morph
          const shellConnectionX = isLeft 
             ? 130 + (morphDirection * 25) + shiftX 
             : 270 + (morphDirection * 25) + shiftX;
             
          // Control points for the bezier curve connection
          const cp1x = isLeft ? shellConnectionX - 50 : shellConnectionX + 50;
          const cp2x = isLeft ? topic.x + 50 : topic.x - 50;

          return (
            <g 
              key={topic.id} 
              className="cursor-pointer group outline-none"
              onMouseEnter={() => setHoveredTopic(topic.id)}
              onMouseLeave={() => setHoveredTopic(null)}
              onFocus={() => setHoveredTopic(topic.id)}
              onBlur={() => setHoveredTopic(null)}
              onClick={() => {
                if (topic.link === '#') {
                  onViewPlaceholder();
                } else {
                  window.open(topic.link, '_blank');
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, topic.id)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${topic.text} research node`}
              aria-pressed={isCurrent}
            >
              {/* Flux Connector */}
              <path 
                d={`M ${shellConnectionX} ${250 + shiftY} C ${cp1x} ${250 + shiftY}, ${cp2x} ${topic.y}, ${topic.x} ${topic.y}`}
                fill="none"
                stroke={isCurrent ? "url(#gold-grad)" : "#E6D5C7"}
                strokeWidth={isCurrent ? "2.5" : "0.5"}
                strokeDasharray={isCurrent ? "none" : "3 5"}
                opacity={isCurrent ? "1" : "0.3"}
                className="transition-all duration-500 ease-out"
                style={{ filter: isCurrent ? 'drop-shadow(0 0 5px rgba(212,175,55,0.5))' : 'none' }}
              />

              {/* Node Marker */}
              <g transform={`translate(${topic.x}, ${topic.y})`}>
                <circle 
                  r={isCurrent ? "6" : "4"} 
                  fill={isCurrent ? TECHBRIDGE_GOLD : "#fff"}
                  className="transition-all duration-300"
                  stroke={TECHBRIDGE_PRIMARY}
                  strokeWidth={isCurrent ? 2 : 0}
                  style={{ filter: isCurrent ? 'drop-shadow(0 0 8px rgba(212,175,55,0.8))' : 'none' }}
                />
                {isCurrent && (
                  <circle r="16" fill="none" stroke={TECHBRIDGE_GOLD} strokeWidth="1.5" opacity="0.6" className="animate-ping" />
                )}
              </g>

              {/* Label */}
              <text
                x={topic.x + (isLeft ? -20 : 20)}
                y={topic.y}
                textAnchor={topic.align}
                alignmentBaseline="middle"
                className={`text-[12px] font-black transition-all duration-300 ${isCurrent ? 'fill-techbridge-gold scale-110' : 'fill-white'}`}
                style={{ 
                   textShadow: isCurrent ? '0 0 20px rgba(212,175,55,1)' : '0 2px 4px rgba(0,0,0,0.8)',
                   transformBox: 'fill-box',
                   transformOrigin: 'center'
                }}
              >
                {topic.text}
              </text>
              
              {/* Hit Area */}
              <circle cx={topic.x} cy={topic.y} r="35" fill="transparent" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default InteractiveShell;
