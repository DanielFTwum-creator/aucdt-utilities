import React, { useState } from 'react';
import type { FormData } from '../App.tsx';

interface StepProps {
    formData: FormData;
    handleListChange: (listName: 'realEstate', data: { description: string; location: string }) => void;
    handleRemoveItem: (listName: 'realEstate', index: number) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const AssetsStep = ({ formData, handleListChange, handleRemoveItem, handleNext, handleBack }: StepProps) => {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const handleAddProperty = () => {
        if (description && location) {
            handleListChange('realEstate', { description, location });
            setDescription('');
            setLocation('');
        }
    };

    return (
        <div className="assets-step">
            <h2 className="step-title">Real Estate Assets</h2>
            <p className="step-subtitle">List any real estate you own, such as houses or land.</p>
            
            <div className="add-item-box">
                <div className="form-section">
                    <label htmlFor="propertyDescription" className="form-label">Property Description (e.g., "House on 4 plots")</label>
                    <input type="text" id="propertyDescription" className="form-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Oyarifa (4 plots)" />
                </div>
                <div className="form-section">
                    <label htmlFor="propertyLocation" className="form-label">Location (e.g., "City, Country")</label>
                    <input type="text" id="propertyLocation" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Accra, Ghana" />
                </div>
                 <button className="btn-primary" onClick={handleAddProperty} style={{width: '100%'}}>Add Property</button>
            </div>
            
            <div className="item-list-container">
                <h3 className="form-label">Listed Properties</h3>
                {formData.realEstate.length === 0 ? (
                    <p>No properties added yet.</p>
                ) : (
                    formData.realEstate.map((property, index) => (
                        <div key={index} className="item-list-item">
                           <div>
                                <strong>{property.description}</strong>
                                <br/>
                                <span style={{fontSize: '14px', color: '#6b7280'}}>{property.location}</span>
                           </div>
                            <button onClick={() => handleRemoveItem('realEstate', index)} className="item-list-remove-btn">Remove</button>
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

export default AssetsStep;