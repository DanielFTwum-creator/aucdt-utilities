import React, { useState, useRef } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  block?: boolean;
}

export function Tooltip({ text, children, position = 'top', block = false }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      setCoords({
        top: position === 'top' ? rect.top : rect.bottom,
        left: rect.left + rect.width / 2,
      });
    }
    setVisible(true);
  };

  return (
    <div
      ref={ref}
      className={block ? 'flex flex-col' : 'inline-flex'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: 'fixed',
            top: position === 'top' ? coords.top - 8 : coords.top + 8,
            left: coords.left,
            transform: position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0%)',
            zIndex: 9999,
          }}
          className="pointer-events-none relative whitespace-nowrap bg-zinc-800 border border-zinc-700 text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded font-mono shadow-xl z-[9999]"
        >
          {text}
          <div className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${
            position === 'top'
              ? 'bottom-[-4px] border-t-4 border-t-zinc-700'
              : 'top-[-4px] border-b-4 border-b-zinc-700'
          }`} />
        </div>
      )}
    </div>
  );
}
