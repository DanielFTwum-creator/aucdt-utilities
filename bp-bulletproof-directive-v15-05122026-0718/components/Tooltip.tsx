import React from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className="relative group flex flex-col items-center">
            {children}
            <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-bg-tertiary border border-border text-text-primary text-xs font-mono rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl translate-y-2 group-hover:translate-y-0">
                {content}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-border" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-tertiary -mt-[1px]" />
            </div>
        </div>
    );
};
