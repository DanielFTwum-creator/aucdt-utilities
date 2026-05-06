import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    const steps = ['Jurisdiction', 'Testator', 'Executor', 'Guardian', 'Assets', 'Gifts', 'Residue', 'Review'];
    const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

    return (
        <div className="progress-container" aria-label={`Step ${currentStep} of ${totalSteps}`}>
            <div className="progress-steps">
                <div className="progress-line" style={{ width: progressWidth }}></div>
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    
                    let statusClass = '';
                    if (isActive) statusClass = 'active';
                    if (isCompleted) statusClass = 'completed';

                    return (
                        <div key={stepNumber} className={`step ${statusClass}`}>
                            <div className="step-number" aria-hidden="true">
                               {isCompleted ? '✓' : stepNumber}
                            </div>
                            <div className="step-label">{label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;