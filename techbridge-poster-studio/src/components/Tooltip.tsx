import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  isDarkMode?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  children, 
  position = 'top',
  isDarkMode = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top': return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom': return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left': return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right': return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default: return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    const colorClass = isDarkMode ? 'border-white' : 'border-slate-900';
    switch (position) {
      case 'top': return `top-full left-1/2 -translate-x-1/2 border-t-${isDarkMode ? 'white' : 'slate-900'}`;
      case 'bottom': return `bottom-full left-1/2 -translate-x-1/2 border-b-${isDarkMode ? 'white' : 'slate-900'}`;
      case 'left': return `left-full top-1/2 -translate-y-1/2 border-l-${isDarkMode ? 'white' : 'slate-900'}`;
      case 'right': return `right-full top-1/2 -translate-y-1/2 border-r-${isDarkMode ? 'white' : 'slate-900'}`;
      default: return `top-full left-1/2 -translate-x-1/2 border-t-${isDarkMode ? 'white' : 'slate-900'}`;
    }
  };

  return (
    <div 
      className="relative flex items-center w-full"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.95, 
              x: position === 'left' ? 10 : position === 'right' ? -10 : 0,
              y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 
            }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`absolute z-[100] pointer-events-none whitespace-nowrap px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md ${getPositionClasses()} ${
              isDarkMode 
                ? 'bg-white/95 text-slate-900 border border-white' 
                : 'bg-slate-900/95 text-white border border-slate-800'
            }`}
          >
            {text}
            <div className={`absolute border-4 border-transparent ${getArrowClasses()}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
