import React, { useState } from 'react';
import { clsx } from 'clsx';
import { useThemeStore } from '../themeStore';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, text, position = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const { isDark, isHighContrast } = useThemeStore();

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent',
  };

  const bgColor = isHighContrast ? 'bg-yellow-400 text-black' : isDark ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white';
  const arrowColor = isHighContrast ? 'border-t-yellow-400' : isDark ? 'border-t-slate-700' : 'border-t-slate-900';

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </div>
      {visible && (
        <div
          className={clsx(
            'absolute z-50 px-2 py-1 text-xs font-medium rounded whitespace-nowrap pointer-events-none',
            positionClasses[position],
            bgColor
          )}
          role="tooltip"
        >
          {text}
          <div className={clsx('absolute w-0 h-0', arrowClasses[position], arrowColor)} />
        </div>
      )}
    </div>
  );
}
