import React from 'react';

interface StepProps {
    formData: { executorName: string; alternateExecutorName: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const ExecutorStep = ({ formData, handleChange, handleNext, handleBack }: StepProps) => {
    return (
        <div className="executor-step">
            <h2 className="step-title">Appoint an Executor</h2>
             <p className="step-subtitle">The executor carries out the wishes in your will. Appoint someone you trust and name an alternate in case your primary choice cannot serve.</p>
            <div className="form-section">
                <label htmlFor="executorName" className="form-label">Primary Executor's Full Name</label>
                <input type="text" id="executorName" name="executorName" className="form-input" value={formData.executorName} onChange={handleChange} required />
            </div>
             <div className="form-section">
                <label htmlFor="alternateExecutorName" className="form-label">Alternate Executor's Full Name (Optional)</label>
                <input type="text" id="alternateExecutorName" name="alternateExecutorName" className="form-input" value={formData.alternateExecutorName} onChange={handleChange} />
            </div>
            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default ExecutorStep;