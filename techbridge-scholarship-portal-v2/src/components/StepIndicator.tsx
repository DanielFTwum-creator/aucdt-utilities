import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const StepIndicator: React.FC<Props> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full py-6 mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps}>
      <div className="max-w-3xl mx-auto px-4">
        {/* Editorial Header */}
        <div className="flex justify-between items-end mb-4">
            <div>
                <span className="font-sans text-xs font-bold text-tuc-red uppercase tracking-widest block mb-1 hc-text-accent">
                    Application Progress
                </span>
                <h2 className="font-serif text-2xl font-bold text-tuc-blue dark:text-white hc-text">
                    {steps[currentStep - 1]}
                </h2>
            </div>
            <div className="text-right">
                <span className="font-mono text-sm font-medium text-[#94A3B8] hc-text">
                    Step <span className="text-tuc-blue dark:text-tuc-blue-300 font-bold text-lg hc-text-accent">{currentStep}</span> / {totalSteps}
                </span>
            </div>
        </div>

        {/* Corporate Linear Progress */}
        <div className="relative h-2 w-full bg-[#E2E8F0] dark:bg-[#1E293B] rounded-full overflow-hidden hc-bg">
             <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-tuc-blue to-tuc-blue-400 transition-all duration-1000 ease-out shadow-brand-glow hc-bg-fill"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
             ></div>
        </div>
        
        {/* Subtle Next Step Preview */}
        {currentStep < totalSteps && (
            <div className="mt-2 text-right">
                <span className="text-xs text-[#94A3B8] italic hc-text">
                    Up Next: {steps[currentStep]}
                </span>
            </div>
        )}
      </div>
    </div>
  );
};