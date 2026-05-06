import React from 'react';

interface StepProps {
    formData: { residuaryBeneficiaryName: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const ResiduaryStep = ({ formData, handleChange, handleNext, handleBack }: StepProps) => {
    return (
        <div className="residuary-step">
            <h2 className="step-title">Residuary Estate</h2>
             <p className="step-subtitle">The residuary estate is everything that remains after all debts, expenses, and specific gifts have been distributed. Appoint a beneficiary to receive this "rest and remainder."</p>
            <div className="form-section">
                <label htmlFor="residuaryBeneficiaryName" className="form-label">Residuary Beneficiary's Full Name</label>
                <input type="text" id="residuaryBeneficiaryName" name="residuaryBeneficiaryName" className="form-input" value={formData.residuaryBeneficiaryName} onChange={handleChange} required />
            </div>
            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleNext}>Review</button>
            </div>
        </div>
    );
};

export default ResiduaryStep;