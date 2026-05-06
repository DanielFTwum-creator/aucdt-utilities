import React from 'react';

interface StepProps {
    formData: { testatorName: string; testatorAddress: string; testatorDob: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const TestatorStep = ({ formData, handleChange, handleNext, handleBack }: StepProps) => {
    return (
        <div className="testator-step">
            <h2 className="step-title">Testator Information</h2>
            <p className="step-subtitle">Please enter your personal details as the person creating the will.</p>

            <div className="form-section">
                <label htmlFor="testatorName" className="form-label">Full Legal Name</label>
                <input type="text" id="testatorName" name="testatorName" className="form-input" value={formData.testatorName} onChange={handleChange} required />
            </div>
            <div className="form-section">
                <label htmlFor="testatorAddress" className="form-label">Full Address</label>
                <input type="text" id="testatorAddress" name="testatorAddress" className="form-input" value={formData.testatorAddress} onChange={handleChange} required />
            </div>
            <div className="form-section">
                <label htmlFor="testatorDob" className="form-label">Date of Birth</label>
                <input type="date" id="testatorDob" name="testatorDob" className="form-input" value={formData.testatorDob} onChange={handleChange} required />
            </div>
            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default TestatorStep;