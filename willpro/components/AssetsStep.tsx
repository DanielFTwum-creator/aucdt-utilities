import React, { useEffect, useRef, useState } from 'react';
import { Building2, MapPin, Home, Trash2 } from 'lucide-react';
import type { FormData } from '../App.tsx';

// Visual-only enhancement flag. When false, the original layout renders unchanged.
const ENABLE_ENHANCED_UI = true;

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
    const [showErrors, setShowErrors] = useState(false);
    const listEndRef = useRef<HTMLDivElement>(null);

    // Page background consistency (#F0EDE6) while this enhanced step is mounted.
    useEffect(() => {
        if (!ENABLE_ENHANCED_UI) return;
        document.body.classList.add('wp-enhanced-page');
        return () => document.body.classList.remove('wp-enhanced-page');
    }, []);

    const handleAddProperty = () => {
        if (description && location) {
            handleListChange('realEstate', { description, location });   // preserve existing array logic
            setDescription('');
            setLocation('');
            setShowErrors(false);
            // Scroll the newly added item into view after it renders.
            setTimeout(() => listEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        } else {
            setShowErrors(true);
        }
    };

    // --- Original (flag off) ---------------------------------------------
    if (!ENABLE_ENHANCED_UI) {
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
                    <button className="btn-primary" onClick={handleAddProperty} style={{ width: '100%' }}>Add Property</button>
                </div>
                <div className="item-list-container">
                    <h3 className="form-label">Listed Properties</h3>
                    {formData.realEstate.length === 0 ? (
                        <p>No properties added yet.</p>
                    ) : (
                        formData.realEstate.map((property, index) => (
                            <div key={index} className="item-list-item">
                                <div><strong>{property.description}</strong><br /><span style={{ fontSize: '14px', color: '#6b7280' }}>{property.location}</span></div>
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
    }

    // --- Enhanced --------------------------------------------------------
    const descInvalid = showErrors && !description;
    const locInvalid = showErrors && !location;
    const count = formData.realEstate.length;

    return (
        <div className="assets-step wp-enhanced">
            <h2 className="step-title">Real Estate Assets</h2>
            <p className="step-subtitle">List any real estate you own, such as houses or land.</p>

            {/* Entry form zone */}
            <div className={`wp-field${descInvalid ? ' invalid' : ''}`}>
                <Building2 className="wp-lead-icon" size={16} aria-hidden="true" />
                <input
                    type="text" id="propertyDescription"
                    className={`wp-input${description ? ' has-value' : ''}`}
                    value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Oyarifa, 4 plots" aria-label="Property Description"
                />
                <label htmlFor="propertyDescription" className="wp-float-label">Property Description</label>
                {descInvalid && <div className="wp-helper">Property description is required.</div>}
            </div>

            <div className={`wp-field${locInvalid ? ' invalid' : ''}`}>
                <MapPin className="wp-lead-icon" size={16} aria-hidden="true" />
                <input
                    type="text" id="propertyLocation"
                    className={`wp-input${location ? ' has-value' : ''}`}
                    value={location} onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Accra, Ghana" aria-label="Location"
                />
                <label htmlFor="propertyLocation" className="wp-float-label">Location</label>
                {locInvalid && <div className="wp-helper">Location is required.</div>}
            </div>

            <hr className="wp-section-divider" />

            <button type="button" className="wp-add-btn" onClick={handleAddProperty}>+ Add Property</button>

            {/* Listed properties zone */}
            <div className="item-list-container" style={{ marginTop: 24 }}>
                <h3 className="wp-list-header">
                    Listed Properties
                    <span className="wp-count-badge">{count}</span>
                </h3>

                {count === 0 ? (
                    <div className="wp-empty-state">
                        <Home size={28} color="#D9D3C8" aria-hidden="true" />
                        <p>No properties added yet</p>
                    </div>
                ) : (
                    formData.realEstate.map((property, index) => (
                        <div key={index} className="wp-prop-row">
                            <Home className="wp-prop-icon" size={16} aria-hidden="true" />
                            <div>
                                <div className="wp-prop-name">{property.description}</div>
                                <div className="wp-prop-loc">{property.location}</div>
                            </div>
                            <button
                                onClick={() => handleRemoveItem('realEstate', index)}
                                className="wp-prop-remove" aria-label="Remove property"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))
                )}
                <div ref={listEndRef} />
            </div>

            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default AssetsStep;
