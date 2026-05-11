import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-200 dark:bg-slate-800 hc:bg-black text-slate-800 dark:text-slate-300 hc:text-yellow-300 text-sm rounded-lg shadow-xl z-10 ring-1 ring-slate-300 dark:ring-slate-700 hc:ring-yellow-300">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;