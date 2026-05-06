
import React, { useState, useEffect } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
  label: string;
}

const NODES: Node[] = [
  { id: 'user', label: 'User Interaction', x: 50, y: 150, width: 220, height: 100, color: '#0f172a' },
  { id: 'nav', label: 'Navigation Engine', x: 350, y: 50, width: 200, height: 70, color: '#334155' },
  { id: 'workshop', label: 'AI Synthesis Tool', x: 350, y: 165, width: 200, height: 70, color: '#C97064' },
  { id: 'audit', label: 'Audit Logging', x: 350, y: 280, width: 200, height: 70, color: '#475569' },
  { id: 'gemini', label: 'Google Gemini 3.0', x: 650, y: 120, width: 200, height: 70, color: '#4f46e5' },
  { id: 'state', label: 'Global State Manager', x: 650, y: 240, width: 200, height: 70, color: '#1e293b' },
  { id: 'render', label: 'Dynamic Slide UI', x: 950, y: 150, width: 220, height: 100, color: '#C97064' },
];

const LINKS: Link[] = [
  { source: 'user', target: 'nav', value: 15, label: 'Keyboard/Click events' },
  { source: 'user', target: 'workshop', value: 25, label: 'Prompts & Templates' },
  { source: 'user', target: 'audit', value: 10, label: 'Admin Telemetry' },
  { source: 'nav', target: 'state', value: 12, label: 'Slide Index Updates' },
  { source: 'workshop', target: 'gemini', value: 20, label: 'Secure API Payload' },
  { source: 'workshop', target: 'state', value: 8, label: 'Synthesis History' },
  { source: 'audit', target: 'state', value: 10, label: 'Log Persistence' },
  { source: 'gemini', target: 'workshop', value: 20, label: 'Text/Image response' },
  { source: 'state', target: 'render', value: 45, label: 'React Prop Injection' },
];

export const SankeyDiagram: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getNode = (id: string) => NODES.find(n => n.id === id)!;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[4rem] border-4 border-slate-100 shadow-inner overflow-hidden relative">
      <div className="absolute top-10 left-10 flex flex-col gap-2">
        <h4 className="text-slate-400 font-black uppercase tracking-widest text-sm">Interaction Flow v3.2</h4>
        <div className="h-1 w-24 bg-[#C97064]/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#C97064] animate-pulse w-1/2"></div>
        </div>
      </div>

      <svg viewBox="0 0 1250 450" className="w-full h-full max-h-[600px] drop-shadow-2xl">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Links */}
        {LINKS.map((link, idx) => {
          const source = getNode(link.source);
          const target = getNode(link.target);
          const startX = source.x + source.width;
          const startY = source.y + source.height / 2;
          const endX = target.x;
          const endY = target.y + target.height / 2;
          const cpX1 = startX + (endX - startX) * 0.4;
          const cpX2 = startX + (endX - startX) * 0.6;

          const isHighlighted = hoveredNode === link.source || hoveredNode === link.target || hoveredLink === idx;

          return (
            <g key={`link-${idx}`} className="transition-all duration-500">
              <path
                d={`M ${startX} ${startY} C ${cpX1} ${startY}, ${cpX2} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke={isHighlighted ? '#C97064' : '#e2e8f0'}
                strokeWidth={link.value}
                strokeDasharray={animate ? "0" : "1000"}
                strokeDashoffset={animate ? "0" : "1000"}
                className={`transition-all duration-1000 ease-out cursor-pointer ${isHighlighted ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
                onMouseEnter={() => setHoveredLink(idx)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{ filter: isHighlighted ? 'url(#glow)' : 'none' }}
              />
              {isHighlighted && (
                <g className="animate-in fade-in zoom-in-95 duration-300">
                  <rect 
                    x={(startX + endX) / 2 - 80} 
                    y={(startY + endY) / 2 - 40} 
                    width="160" 
                    height="30" 
                    rx="15" 
                    fill="white" 
                    className="shadow-xl"
                  />
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 - 20}
                    textAnchor="middle"
                    className="fill-slate-800 text-[10px] font-black font-sans uppercase tracking-widest"
                  >
                    {link.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const isDirectlyHovered = hoveredNode === node.id;
          const isRelatedToHoveredLink = hoveredLink !== null && (LINKS[hoveredLink].source === node.id || LINKS[hoveredLink].target === node.id);
          const isActive = isDirectlyHovered || isRelatedToHoveredLink;

          return (
            <g
              key={node.id}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              transform={isActive ? 'scale(1.05)' : 'scale(1)'}
              style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                rx="24"
                fill={isActive ? '#C97064' : node.color}
                className="transition-colors duration-500 shadow-2xl"
              />
              <text
                x={node.x + node.width / 2}
                y={node.y + node.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-sm font-black font-sans uppercase tracking-tighter pointer-events-none"
              >
                {node.label}
              </text>
              {isActive && (
                <rect 
                   x={node.x - 4} 
                   y={node.y - 4} 
                   width={node.width + 8} 
                   height={node.height + 8} 
                   rx="28" 
                   fill="none" 
                   stroke="#C97064" 
                   strokeWidth="2" 
                   className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="mt-12 flex gap-12 text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-slate-900 border-2 border-white"></div> Session Entry
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#C97064] border-2 border-white"></div> UI Controller
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-[#4f46e5] border-2 border-white"></div> Cloud Intelligence
        </div>
      </div>
    </div>
  );
};
