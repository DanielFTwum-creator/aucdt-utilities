import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] whitespace-nowrap px-3 py-2 text-[10px] font-label uppercase tracking-widest 
            bg-white dark:bg-tuc-ink text-tuc-ink dark:text-tuc-gold border border-tuc-gold/30 shadow-xl animate-fade-in pointer-events-none transition-colors duration-500"
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-tuc-gold/30" />
        </div>
      )}
    </div>
  );
};
