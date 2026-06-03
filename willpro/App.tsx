

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProgressBar from './components/ProgressBar.tsx';
import JurisdictionStep from './components/JurisdictionStep.tsx';
import TestatorStep from './components/TestatorStep.tsx';
import ExecutorStep from './components/ExecutorStep.tsx';
import GuardianshipStep from './components/GuardianshipStep.tsx';
import AssetsStep from './components/AssetsStep.tsx';
import DistributionStep from './components/DistributionStep.tsx';
import ResiduaryStep from './components/ResiduaryStep.tsx';
import ReviewStep from './components/ReviewStep.tsx';
import AuditLogModal from './components/AuditLogModal.tsx';
import PreviewPanel from './components/PreviewPanel.tsx';
import VersionModal from './components/VersionModal.tsx';
import { saveDraft, getMostRecentDraft, deleteDraft, Draft } from './db';
import { useLogout } from './AuthGate';

export interface FormData {
    jurisdiction: string;
    testatorName: string;
    testatorAddress: string;
    testatorDob: string;
    executorName: string;
    alternateExecutorName: string;
    hasMinorChildren: boolean;
    guardianName: string;
    alternateGuardianName: string;
    realEstate: { description: string; location: string }[];
    gifts: { beneficiary: string; item: string }[];
    residuaryBeneficiaryName: string;
}

export interface AuditLog {
    timestamp: string;
    event: string;
}

const Logo = () => (
    <div className="logo" aria-label="WillPro Logo">
        <svg height="64" viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
          {/* Shield/Monogram Icon */}
          <g transform="translate(15, 15)">
            {/* Shield Base */}
            <path d="M 25 5 C 10 5, 5 12, 5 22 L 5 35 C 5 45, 15 48, 25 50 C 35 48, 45 45, 45 35 L 45 22 C 45 12, 40 5, 25 5 Z" 
                  fill="#B58A3D"/>
            
            {/* W and P Monogram */}
            <path d="M 12 15 L 15 35 L 20 25 L 25 35 L 28 15 M 28 15 L 28 35 M 28 15 L 38 15 C 40 15, 42 17, 42 19 L 42 21 C 42 23, 40 25, 38 25 L 28 25" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"/>
            
            {/* Fountain pen nib detail */}
            <circle cx="25" cy="28" r="1" fill="white"/>
          </g>
          
          {/* WillPro Wordmark */}
          <g transform="translate(80, 25)">
            <text x="0" y="25" 
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                  fontSize="24" 
                  fontWeight="600" 
                  fill="#374151">Will</text>
            
            <text x="45" y="25" 
                  fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
                  fontSize="24" 
                  fontWeight="300" 
                  fill="#B58A3D">Pro</text>
          </g>
        </svg>
    </div>
);


const App = () => {
    const handleLogout = useLogout();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        jurisdiction: 'UK',
        testatorName: '',
        testatorAddress: '',
        testatorDob: '',
        executorName: '',
        alternateExecutorName: '',
        hasMinorChildren: false,
        guardianName: '',
        alternateGuardianName: '',
        realEstate: [],
        gifts: [],
        residuaryBeneficiaryName: '',
    });
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
        const storedLogs = localStorage.getItem('tuc_willpro_audit');
        if (storedLogs) {
            try {
                return JSON.parse(storedLogs);
            } catch (e) {
                console.error('Failed to parse stored audit logs:', e);
            }
        }
        return [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [currentDraftId, setCurrentDraftId] = useState<string>(() => Date.now().toString());
    const [currentFilename, setCurrentFilename] = useState<string>('');
    const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const importFileRef = useRef<HTMLInputElement>(null);
    const saveTimeoutRef = useRef<number | null>(null);

    const totalSteps = 8;

    const addAuditLog = (event: string) => {
        const newLog = {
            timestamp: new Date().toISOString(),
            event,
        };
        setAuditLogs(prevLogs => [...prevLogs, newLog]);
    };

    useEffect(() => {
        localStorage.setItem('tuc_willpro_audit', JSON.stringify(auditLogs));
    }, [auditLogs]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        const stored = localStorage.getItem('willpro_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse user session:', e);
            }
        }

        getMostRecentDraft()
            .then((draft) => {
                if (draft) {
                    setCurrentStep(draft.step);
                    setFormData(draft.formData);
                    setCurrentDraftId(draft.id);
                    setCurrentFilename(draft.filename || '');
                    addAuditLog(`Draft restored from ${new Date(draft.updatedAt).toLocaleString()}`);
                } else {
                    setAuditLogs([{
                        timestamp: new Date().toISOString(),
                        event: 'New will creation process started',
                    }]);
                }
            })
            .catch(() => {
                setAuditLogs([{
                    timestamp: new Date().toISOString(),
                    event: 'New will creation process started',
                }]);
            });
    }, []);

    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = window.setTimeout(() => {
            saveDraft(currentDraftId, currentStep, formData, currentFilename).catch((err) => {
                console.error('Failed to save draft:', err);
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 1000);
        }, 500);
    }, [currentStep, formData, currentDraftId, currentFilename]);

    useEffect(() => {
        debouncedSave();
    }, [formData, currentStep, debouncedSave]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        
        setFormData(prev => ({ 
            ...prev, 
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
        }));
    };

    const handleListChange = (listName: 'realEstate' | 'gifts', data: any) => {
        setFormData(prev => ({
            ...prev,
            [listName]: [...prev[listName], data]
        }));
    };

    const handleRemoveItem = (listName: 'realEstate' | 'gifts', index: number) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index)
        }));
    };
    
    const handleReset = () => {
        setCurrentStep(1);
        setFormData({
            jurisdiction: 'UK',
            testatorName: '',
            testatorAddress: '',
            testatorDob: '',
            executorName: '',
            alternateExecutorName: '',
            hasMinorChildren: false,
            guardianName: '',
            alternateGuardianName: '',
            realEstate: [],
            gifts: [],
        });
        deleteDraft(currentDraftId).catch((err) => console.error('Failed to delete draft:', err));
        setAuditLogs([{
            timestamp: new Date().toISOString(),
            event: 'New will creation process started',
        }]);
    };

    const handleSaveAs = () => {
        const name = prompt('Enter a name for this version:', currentFilename || 'Untitled Draft');
        if (name !== null) {
            const newId = Date.now().toString();
            setCurrentDraftId(newId);
            setCurrentFilename(name);
            saveDraft(newId, currentStep, formData, name).then(() => {
                addAuditLog(`Saved as new version: ${name}`);
            });
        }
    };

    const handleLoadDraft = (draft: Draft) => {
        setCurrentDraftId(draft.id);
        setCurrentFilename(draft.filename || '');
        setCurrentStep(draft.step);
        setFormData(draft.formData);
        addAuditLog(`Loaded version: ${draft.filename || 'Untitled Draft'}`);
    };

    const handleExportLogs = () => {
        const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'audit_logs.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addAuditLog('Audit logs exported');
    };

    const handleImportLogs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string;
                    const importedLogs = JSON.parse(content);
                    if (Array.isArray(importedLogs)) {
                        setAuditLogs(importedLogs);
                        addAuditLog(`Audit logs imported from ${file.name}`);
                    }
                } catch (error) {
                    console.error("Failed to parse audit log file", error);
                    alert("Error: Could not import logs. The file might be corrupted or in the wrong format.");
                }
            };
            reader.readAsText(file);
        }
    };
    
    const triggerImport = () => {
        importFileRef.current?.click();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <JurisdictionStep formData={formData} handleChange={handleChange} handleNext={handleNext} />;
            case 2:
                return <TestatorStep formData={formData} handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} />;
            case 3:
                return <ExecutorStep formData={formData} handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} />;
            case 4:
                return <GuardianshipStep formData={formData} handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} />;
            case 5:
                return <AssetsStep formData={formData} handleListChange={handleListChange} handleRemoveItem={handleRemoveItem} handleNext={handleNext} handleBack={handleBack} />;
            case 6:
                return <DistributionStep formData={formData} handleListChange={handleListChange} handleRemoveItem={handleRemoveItem} handleNext={handleNext} handleBack={handleBack} />;
            case 7:
                 return <ResiduaryStep formData={formData} handleChange={handleChange} handleNext={handleNext} handleBack={handleBack} />;
            case 8:
                return <ReviewStep formData={formData} handleBack={handleBack} handleReset={handleReset} addAuditLog={addAuditLog} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="app-container">
            <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Logo />
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {isSaved && (
                        <span style={{
                            fontSize: '12px',
                            color: '#10b981',
                            opacity: isSaved ? 1 : 0,
                            transition: 'opacity 0.3s',
                        }}>
                            ✓ Saved
                        </span>
                    )}
                    
                    <button 
                        className="wp-btn-primary" 
                        onClick={handleSaveAs}
                        style={{ 
                            background: 'linear-gradient(135deg, var(--wp-color-primary), var(--wp-color-primary-hover))', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: 'var(--wp-radius-button)', 
                            fontSize: '13px', 
                            fontWeight: 600, 
                            cursor: 'pointer', 
                            boxShadow: '0 2px 8px rgba(166, 124, 55, 0.2)' 
                        }}
                    >
                        Save As
                    </button>

                    {/* Consolidated User Profile Trigger with Dropdown */}
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                        <div 
                            className="user-profile-trigger" 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '10px', 
                                cursor: 'pointer', 
                                padding: '6px 14px', 
                                borderRadius: '8px', 
                                border: '1px solid rgba(181, 138, 61, 0.22)', 
                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                transition: 'all 0.2s ease',
                                userSelect: 'none'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--wp-color-primary)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(166, 124, 55, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                if (!isDropdownOpen) {
                                    e.currentTarget.style.borderColor = 'rgba(181, 138, 61, 0.22)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <div style={{ 
                                width: '30px', 
                                height: '30px', 
                                borderRadius: '50%', 
                                backgroundColor: 'var(--wp-color-primary-tint)', 
                                color: 'var(--wp-color-primary)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 800, 
                                fontSize: '12px' 
                            }}>
                                {user ? (user.name ? user.name.substring(0, 2).toUpperCase() : user.email.substring(0, 2).toUpperCase()) : 'G'}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: '1.2' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--wp-color-text-main)' }}>
                                    {user ? (user.name || user.email.split('@')[0]) : 'Guest'}
                                </span>
                                <span style={{ fontSize: '10px', color: 'var(--wp-color-text-muted)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {currentFilename || 'Untitled Draft'}
                                </span>
                            </div>
                            <span style={{ 
                                fontSize: '10px', 
                                color: 'var(--wp-color-primary)', 
                                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                                transition: 'transform 0.2s ease',
                                marginLeft: '2px'
                            }}>
                                ▼
                            </span>
                        </div>

                        {isDropdownOpen && (
                            <div 
                                className="profile-dropdown" 
                                style={{ 
                                    position: 'absolute', 
                                    right: 0, 
                                    top: 'calc(100% + 8px)',
                                    width: '220px', 
                                    backgroundColor: '#FFFFFF', 
                                    border: '1px solid rgba(181, 138, 61, 0.2)', 
                                    borderRadius: '8px', 
                                    boxShadow: '0 10px 25px rgba(166, 124, 55, 0.12)', 
                                    zIndex: 100, 
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    overflow: 'hidden',
                                    animation: 'modalSlideUp 0.2s ease-out'
                                }}
                            >
                                <div style={{ 
                                    padding: '12px 16px', 
                                    borderBottom: '1px solid rgba(181, 138, 61, 0.1)', 
                                    backgroundColor: 'rgba(181, 138, 61, 0.03)' 
                                }}>
                                    <div style={{ fontSize: '10px', color: 'var(--wp-color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Version</div>
                                    <div style={{ fontSize: '13px', color: 'var(--wp-color-text-main)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                        {currentFilename || 'Untitled Draft'}
                                    </div>
                                </div>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => { setIsDropdownOpen(false); setIsVersionModalOpen(true); }} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        width: '100%', 
                                        padding: '12px 16px', 
                                        border: 'none', 
                                        background: 'none', 
                                        textAlign: 'left', 
                                        cursor: 'pointer', 
                                        fontSize: '13px', 
                                        fontWeight: 600, 
                                        color: 'var(--wp-color-text-main)',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--wp-color-primary-tint)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    📂 Versions
                                </button>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => { setIsDropdownOpen(false); setIsModalOpen(true); }} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        width: '100%', 
                                        padding: '12px 16px', 
                                        border: 'none', 
                                        background: 'none', 
                                        textAlign: 'left', 
                                        cursor: 'pointer', 
                                        fontSize: '13px', 
                                        fontWeight: 600, 
                                        color: 'var(--wp-color-text-main)',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--wp-color-primary-tint)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    📜 Audit Logs
                                </button>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => { setIsDropdownOpen(false); handleLogout(); }} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px', 
                                        width: '100%', 
                                        padding: '12px 16px', 
                                        border: 'none', 
                                        background: 'none', 
                                        borderTop: '1px solid #F1F5F9', 
                                        textAlign: 'left', 
                                        cursor: 'pointer', 
                                        fontSize: '13px', 
                                        fontWeight: 600, 
                                        color: '#EF4444',
                                        transition: 'background-color 0.15s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    🚪 Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            <main className="main-content">
                {renderStep()}
            </main>
            <PreviewPanel formData={formData} />
            <AuditLogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                logs={auditLogs}
                onExport={handleExportLogs}
                onImport={triggerImport}
            />
            <VersionModal
                isOpen={isVersionModalOpen}
                onClose={() => setIsVersionModalOpen(false)}
                onLoad={handleLoadDraft}
                currentDraftId={currentDraftId}
            />
            <input type="file" ref={importFileRef} onChange={handleImportLogs} style={{ display: 'none' }} accept=".json" />
        </div>
    );
};

export default App;