import React, { useEffect, useRef, useState } from 'react';
import { User as UserIcon, MapPin as MapPinIcon, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

// Visual-only enhancement flag (brief: ENABLE_ENHANCED_UI). When false, the
// component renders the original static-label layout untouched.
const ENABLE_ENHANCED_UI = true;

interface StepProps {
    formData: { testatorName: string; testatorAddress: string; testatorDob: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleNext: () => void;
    handleBack: () => void;
}

const TestatorStep = ({ formData, handleChange, handleNext, handleBack }: StepProps) => {
    // --- Original (flag off) ---------------------------------------------
    if (!ENABLE_ENHANCED_UI) {
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
                    <textarea id="testatorAddress" name="testatorAddress" className="form-input" rows={3} value={formData.testatorAddress} onChange={handleChange} required style={{ resize: 'vertical' }} />
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
    }

    // --- Enhanced --------------------------------------------------------
    const [showErrors, setShowErrors] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const dobWrapRef = useRef<HTMLDivElement>(null);

    // Close the calendar popover on outside click.
    useEffect(() => {
        if (!calendarOpen) return;
        const onDoc = (e: MouseEvent) => {
            if (dobWrapRef.current && !dobWrapRef.current.contains(e.target as Node)) setCalendarOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, [calendarOpen]);

    // Emit a synthetic change so the parent's data-binding/validation hooks are
    // untouched (preserves the testatorDob field contract).
    const setDob = (iso: string) => {
        handleChange({
            target: { name: 'testatorDob', value: iso, type: 'date' },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
        setCalendarOpen(false);
    };

    const onNext = () => {
        const anyEmpty = !formData.testatorName.trim() || !formData.testatorAddress.trim() || !formData.testatorDob;
        if (anyEmpty) { setShowErrors(true); return; }
        handleNext();
    };

    const dob = formData.testatorDob ? new Date(formData.testatorDob + 'T00:00:00') : undefined;
    const dobLabel = dob ? dob.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Select date';
    const invalid = (filled: boolean) => showErrors && !filled;

    return (
        <div className="testator-step wp-enhanced">
            <h2 className="step-title">Testator Information</h2>
            <p className="step-subtitle">
                Please enter your personal details as the person creating the will.
                <span className="wp-privacy-line">🔒 Your data is encrypted and used solely to generate your will.</span>
            </p>

            {/* Full Legal Name */}
            <div className={`wp-field${invalid(!!formData.testatorName.trim()) ? ' invalid' : ''}`}>
                <UserIcon className="wp-lead-icon" size={16} aria-hidden="true" />
                <input
                    type="text" id="testatorName" name="testatorName"
                    className={`wp-input${formData.testatorName ? ' has-value' : ''}`}
                    value={formData.testatorName} onChange={handleChange} required aria-label="Full Legal Name"
                />
                <label htmlFor="testatorName" className="wp-float-label">Full Legal Name</label>
                {invalid(!!formData.testatorName.trim()) && <div className="wp-helper">Full legal name is required.</div>}
            </div>

            {/* Full Address */}
            <div className={`wp-field${invalid(!!formData.testatorAddress.trim()) ? ' invalid' : ''}`}>
                <MapPinIcon className="wp-lead-icon" size={16} aria-hidden="true" />
                <textarea
                    id="testatorAddress" name="testatorAddress" rows={3}
                    className={`wp-input${formData.testatorAddress ? ' has-value' : ''}`}
                    value={formData.testatorAddress} onChange={handleChange} required aria-label="Full Address"
                />
                <label htmlFor="testatorAddress" className="wp-float-label">Full Address</label>
                {invalid(!!formData.testatorAddress.trim()) && <div className="wp-helper">Full address is required.</div>}
            </div>

            {/* Date of Birth — popover calendar */}
            <div className={`wp-field${invalid(!!formData.testatorDob) ? ' invalid' : ''}`} ref={dobWrapRef}>
                <CalendarIcon className="wp-lead-icon" size={16} aria-hidden="true" />
                <button
                    type="button"
                    className={`wp-date-trigger${formData.testatorDob ? '' : ' placeholder'}`}
                    onClick={() => setCalendarOpen(o => !o)}
                    aria-haspopup="dialog" aria-expanded={calendarOpen} aria-label="Date of Birth"
                >
                    {dobLabel}
                </button>
                <label className="wp-float-label" style={formData.testatorDob ? { top: 0, left: 36, fontSize: 11, color: '#B8840A' } : undefined}>
                    Date of Birth
                </label>
                {calendarOpen && (
                    <div className="wp-popover" role="dialog">
                        <DayPicker
                            mode="single"
                            selected={dob}
                            defaultMonth={dob}
                            captionLayout="dropdown"
                            startMonth={new Date(1920, 0)}
                            endMonth={new Date()}
                            onSelect={(d) => { if (d) setDob(d.toISOString().slice(0, 10)); }}
                        />
                    </div>
                )}
                {invalid(!!formData.testatorDob) && <div className="wp-helper">Date of birth is required.</div>}
            </div>

            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={onNext}>
                    Next<ChevronRight className="wp-chevron" size={16} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

export default TestatorStep;
