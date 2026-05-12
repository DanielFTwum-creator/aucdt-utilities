import React from 'react';

interface ProgressBarProps {
    progress: number;
    completedCount: number;
    totalCount: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, completedCount, totalCount }) => {
    return (
        <div role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Overall project progress">
            <div className="flex justify-between items-end mb-2">
                <span className="font-mono text-xs font-bold text-text-muted uppercase tracking-widest">
                    Overall Progress
                </span>
                <span className="font-mono text-sm text-accent-primary font-bold">
                    {completedCount} / {totalCount} Phases
                </span>
            </div>
            <div className="h-3 w-full bg-bg-tertiary rounded-full overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary relative transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" 
                         style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} 
                    />
                </div>
            </div>
        </div>
    );
};