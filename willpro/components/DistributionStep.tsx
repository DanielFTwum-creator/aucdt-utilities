import React, { useState } from 'react';
import type { FormData } from '../App.tsx';

interface StepProps {
    formData: FormData;
    handleListChange: (listName: 'gifts', data: { beneficiary: string; item: string }) => void;
    handleRemoveItem: (listName: 'gifts', index: number) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const DistributionStep = ({ formData, handleListChange, handleRemoveItem, handleNext, handleBack }: StepProps) => {
    const [beneficiary, setBeneficiary] = useState('');
    const [item, setItem] = useState('');

    const handleAddGift = () => {
        if (beneficiary && item) {
            handleListChange('gifts', { beneficiary, item });
            setBeneficiary('');
            setItem('');
        }
    };

    return (
        <div className="distribution-step">
            <h2 className="step-title">Specific Gifts</h2>
            <p className="step-subtitle">List any specific items or possessions you wish to give to a particular person.</p>

            <div className="add-item-box">
                <div className="form-section">
                    <label htmlFor="beneficiaryName" className="form-label">Beneficiary's Full Name</label>
                    <input type="text" id="beneficiaryName" className="form-input" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="e.g. John Doe" />
                </div>
                <div className="form-section">
                    <label htmlFor="giftItem" className="form-label">Gift Description</label>
                    <input type="text" id="giftItem" className="form-input" value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. My collection of vinyl records" />
                </div>
                 <button className="btn-primary" onClick={handleAddGift} style={{width: '100%'}}>Add Gift</button>
            </div>

            <div className="item-list-container">
                <h3 className="form-label">Listed Gifts</h3>
                {formData.gifts.length === 0 ? (
                    <p>No gifts added yet.</p>
                ) : (
                     formData.gifts.map((gift, index) => (
                        <div key={index} className="item-list-item">
                           <div>
                                <strong>{gift.beneficiary}</strong>
                                <br/>
                                <span style={{fontSize: '14px', color: '#6b7280'}}>{gift.item}</span>
                           </div>
                            <button onClick={() => handleRemoveItem('gifts', index)} className="item-list-remove-btn">Remove</button>
                        </div>
                    ))
                )}
            </div>

            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default DistributionStep;