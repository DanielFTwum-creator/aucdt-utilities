import React from 'react';

interface StepProps {
    formData: { hasMinorChildren: boolean; guardianName: string; alternateGuardianName: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const GuardianshipStep = ({ formData, handleChange, handleNext, handleBack }: StepProps) => {
    return (
        <div className="guardianship-step">
            <h2 className="step-title">Appoint a Guardian</h2>
            <p className="step-subtitle">If you have children under the age of 18, you can appoint a guardian to care for them.</p>
            
            <div className="form-checkbox-group">
                <input 
                    type="checkbox" 
                    id="hasMinorChildren" 
                    name="hasMinorChildren" 
                    className="form-checkbox"
                    checked={formData.hasMinorChildren} 
                    onChange={handleChange}
                />
                <label htmlFor="hasMinorChildren" className="form-label" style={{ marginBottom: 0, fontWeight: 500 }}>I have minor children and wish to appoint a guardian.</label>
            </div>

            {formData.hasMinorChildren && (
                <div style={{ borderTop: '1px solid #e9ecef', paddingTop: '20px', marginTop: '20px' }}>
                    <div className="form-section">
                        <label htmlFor="guardianName" className="form-label">Guardian's Full Name</label>
                        <input type="text" id="guardianName" name="guardianName" className="form-input" value={formData.guardianName} onChange={handleChange} required={formData.hasMinorChildren} />
                    </div>
                    <div className="form-section">
                        <label htmlFor="alternateGuardianName" className="form-label">Alternate Guardian's Full Name (Optional)</label>
                        <input type="text" id="alternateGuardianName" name="alternateGuardianName" className="form-input" value={formData.alternateGuardianName} onChange={handleChange} />
                    </div>
                </div>
            )}

            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default GuardianshipStep;