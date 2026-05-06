import React from 'react';

interface StepProps {
    formData: { jurisdiction: string };
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleNext: () => void;
}

const JurisdictionStep = ({ formData, handleChange, handleNext }: StepProps) => {
    return (
        <div className="jurisdiction-step">
            <h2 className="step-title">Jurisdiction & Disclaimer</h2>

            <div className="disclaimer">
                <h3 className="disclaimer-title"><span className="disclaimer-icon" aria-hidden="true">⚠️</span> Important Legal Disclaimer</h3>
                <p className="disclaimer-text">
                    This utility helps you organise information for a will but does not provide legal advice.
                    All generated documents are templates and <strong>must</strong> be reviewed by a qualified solicitor
                    before execution to be legally binding.
                </p>
            </div>

            <div className="form-section">
                <label htmlFor="jurisdiction" className="form-label">Select Jurisdiction</label>
                <select id="jurisdiction" name="jurisdiction" className="form-select" value={formData.jurisdiction} onChange={handleChange}>
                    <option value="UK">United Kingdom</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Common-Law">Other (Common Law)</option>
                </select>
            </div>

            <div className="button-group" style={{ justifyContent: 'flex-end' }}>
                <button className="continue-btn" onClick={handleNext}>Agree & Continue</button>
            </div>
        </div>
    );
};

export default JurisdictionStep;