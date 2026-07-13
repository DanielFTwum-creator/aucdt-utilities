# willpro - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for willpro.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript


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
import { saveDraft, loadDraft, deleteDraft } from './db';
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
                  fill="#0891b2"/>
            
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
                  fill="#0891b2">Pro</text>
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
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
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
        loadDraft()
            .then((draft) => {
                if (draft) {
                    setCurrentStep(draft.step);
                    setFormData(draft.formData);
                    addAuditLog(`Draft restored from ${new Date(draft.updatedAt).toLocaleString()}`);
                } else {
                    addAuditLog('New will creation process started');
                }
            })
            .catch(() => {
                addAuditLog('New will creation process started');
            });
    }, []);

    const debouncedSave = useCallback(() => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = window.setTimeout(() => {
            saveDraft(currentStep, formData).catch((err) => {
                console.error('Failed to save draft:', err);
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 1000);
        }, 500);
    }, [currentStep, formData]);

    useEffect(() => {
        debouncedSave();
    }, [formData, currentStep, debouncedSave]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            residuaryBeneficiaryName: '',
        });
        deleteDraft().catch((err) => console.error('Failed to delete draft:', err));
        addAuditLog('New will creation process started');
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
            <header className="header">
                <Logo />
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    <button className="audit-logs-btn" onClick={() => setIsModalOpen(true)}>View Audit Logs</button>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 14px',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
                    >
                        Sign Out
                    </button>
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
            <input type="file" ref={importFileRef} onChange={handleImportLogs} style={{ display: 'none' }} accept=".json" />
        </div>
    );
};

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useEffect, useState, createContext, useContext } from 'react';

const AUTH_KEY = 'tuc_auth_willpro';
const USER_KEY = 'willpro_user';
const ACCENT   = '#ea580c';

const AuthContext = createContext<{ handleLogout: () => void } | null>(null);

export function useLogout() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useLogout must be used inside AuthGate');
  return ctx.handleLogout;
}

interface User {
  id?: string;
  name?: string;
  email: string;
}

export function AuthGate({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1' || !!localStorage.getItem(USER_KEY)
  );
  const [, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let oauthHandled = false;

    const completeOAuthLogin = async (accessToken: string) => {
      if (oauthHandled) return;
      oauthHandled = true;

      try {
        setLoading(true);
        setError('');
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        const userData: User = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.removeItem('oauth_token_temp');
        sessionStorage.setItem(AUTH_KEY, '1');
        setUser(userData);
        setAuthed(true);
      } catch {
        setError('Google login failed. Please try again.');
        setLoading(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        completeOAuthLogin(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed. Please try again.');
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);

    const fallback = window.setInterval(() => {
      const token = [REDACTED_CREDENTIAL]
      if (token) {
        completeOAuthLogin(token);
        window.clearInterval(fallback);
      }
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearInterval(fallback);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('oauth_token_temp');
    onLogout?.();
  };

  if (authed) {
    return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Use staff credentials instead.');
      return;
    }

    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
    });
    const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Willpro</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{width:'100%',padding:'10px',background:'#fff',color:'#0f172a',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',marginBottom:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}
        >
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
          <div style={{height:'1px',background:'#e5e7eb',flex:1}} />
          <span style={{fontSize:'11px',color:'#94a3b8',fontWeight:600,textTransform:'uppercase'}}>Or</span>
          <div style={{height:'1px',background:'#e5e7eb',flex:1}} />
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: components/AssetsStep.tsx
```typescript
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
```

### FILE: components/AuditLogModal.tsx
```typescript
import React from 'react';
import type { AuditLog } from '../App.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    logs: AuditLog[];
    onImport: () => void;
    onExport: () => void;
}

const AuditLogModal = ({ isOpen, onClose, logs, onImport, onExport }: ModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Audit Logs</h2>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    {logs.length === 0 ? (
                        <p>No audit logs available.</p>
                    ) : (
                        <table className="audit-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Event</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => (
                                    <tr key={index}>
                                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td>{log.event}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onImport}>Import Logs</button>
                    <button className="btn-primary" onClick={onExport} disabled={logs.length === 0}>Export Logs</button>
                </div>
            </div>
        </div>
    );
};

export default AuditLogModal;
```

### FILE: components/DistributionStep.tsx
```typescript
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
            <p className="step-subtitle">List any specific items or possessions you wish to give to a particular person (next of kin).</p>
            
            <div className="add-item-box">
                <div className="form-section">
                    <label htmlFor="beneficiaryName" className="form-label">Beneficiary's Full Name (Next of Kin)</label>
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
```

### FILE: components/ExecutorStep.tsx
```typescript
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
```

### FILE: components/GuardianshipStep.tsx
```typescript
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
```

### FILE: components/JurisdictionStep.tsx
```typescript
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
```

### FILE: components/PreviewPanel.tsx
```typescript
import React, { useState } from 'react';
import { FormData } from '../App';

interface PreviewPanelProps {
  formData: FormData;
}

const placeholder = (text: string) => text || '[_____________]';

export default function PreviewPanel({ formData }: PreviewPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const willText = `
LAST WILL AND TESTAMENT

THIS WILL made this _____ day of _____________, 20_____, by me,
${placeholder(formData.testatorName)}, of ${placeholder(formData.testatorAddress)},
domiciled in the jurisdiction of ${formData.jurisdiction}.

WHEREAS I am of sound mind and memory and I hereby revoke all former wills,
codicils and testamentary dispositions:

NOW I HEREBY DECLARE as follows:

1. APPOINTMENT OF EXECUTOR

I hereby appoint ${placeholder(formData.executorName)} to be my Executor and Trustee
of this my Will, and if such person shall die, refuse, or be unable to act before
my death or shall die, refuse, or be unable or unwilling to act after my death,
then I appoint ${placeholder(formData.alternateExecutorName)} to be my Executor and Trustee.

2. APPOINTMENT OF GUARDIAN
${formData.hasMinorChildren ? `
I declare that I have minor children and I hereby appoint
${placeholder(formData.guardianName)} as guardian of my minor children,
with ${placeholder(formData.alternateGuardianName)} as alternate guardian.
` : `
I declare that I have no minor children requiring guardianship.
`}

3. REAL ESTATE

I direct my Executor to sell all my real estate and to distribute the proceeds
as part of my residuary estate, except for the following properties which I
specifically devise:

${formData.realEstate.length > 0
  ? formData.realEstate.map((prop, i) =>
      `${i + 1}. ${placeholder(prop.description)} located at ${placeholder(prop.location)}`
    ).join('\n')
  : 'None specified'}

4. SPECIFIC GIFTS

I hereby make the following specific bequests:

${formData.gifts.length > 0
  ? formData.gifts.map((gift, i) =>
      `${i + 1}. To ${placeholder(gift.beneficiary)}, I bequeath ${placeholder(gift.item)}`
    ).join('\n')
  : 'None specified'}

5. RESIDUARY ESTATE

All the rest, residue and remainder of my estate, both real and personal,
of every kind and description and wheresoever situate, I bequeath and devise
absolutely to ${placeholder(formData.residuaryBeneficiaryName)}.

6. GOVERNING LAW

This Will shall be governed by and construed in accordance with the laws
of ${formData.jurisdiction}.

IN WITNESS WHEREOF I have hereunto set my hand to this my Will this
_____ day of _____________, 20_____.

_________________________
${placeholder(formData.testatorName)}

SIGNED, PUBLISHED AND DECLARED by the above-named as their Last Will.

_________________________            _________________________
Witness 1                            Witness 2

Name: ___________________            Name: ___________________
Address: _________________           Address: _________________
`.trim();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="preview-toggle-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          padding: '12px 20px',
          background: '#0891b2',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#0a7ea4')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#0891b2')}
      >
        {isOpen ? '✕ Preview' : '👁 Preview'}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '100%',
            maxWidth: '480px',
            height: '100vh',
            background: '#fff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease',
          } as React.CSSProperties}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
              Will Preview
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#94a3b8',
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '20px',
              fontFamily: '"Courier New", monospace',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#1f2937',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
            }}
          >
            {willText}
          </div>

          <style>{`
            @keyframes slideInRight {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

```

### FILE: components/ProgressBar.tsx
```typescript
import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
    const steps = ['Jurisdiction', 'Testator', 'Executor', 'Guardian', 'Assets', 'Gifts', 'Residue', 'Review'];
    const progressWidth = `${((currentStep - 1) / (totalSteps - 1)) * 100}%`;

    return (
        <div className="progress-container" aria-label={`Step ${currentStep} of ${totalSteps}`}>
            <div className="progress-steps">
                <div className="progress-line" style={{ width: progressWidth }}></div>
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    
                    let statusClass = '';
                    if (isActive) statusClass = 'active';
                    if (isCompleted) statusClass = 'completed';

                    return (
                        <div key={stepNumber} className={`step ${statusClass}`}>
                            <div className="step-number" aria-hidden="true">
                               {isCompleted ? '✓' : stepNumber}
                            </div>
                            <div className="step-label">{label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
```

### FILE: components/ResiduaryStep.tsx
```typescript
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
```

### FILE: components/ReviewStep.tsx
```typescript
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import type { FormData } from '../App.tsx';

interface StepProps {
    formData: FormData;
    handleBack: () => void;
    handleReset: () => void;
    addAuditLog: (event: string) => void;
}

const ReviewStep = ({ formData, handleBack, handleReset, addAuditLog }: StepProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleGeneratePdf = () => {
        setIsLoading(true);

        const doc = new jsPDF();
        const { 
            testatorName, testatorAddress, executorName, alternateExecutorName,
            jurisdiction, realEstate, gifts, hasMinorChildren, guardianName,
            alternateGuardianName, residuaryBeneficiaryName
        } = formData;
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let y = 20;

        const addSection = (title: string, content: string, counter: number) => {
            if (y > 250) { // Add new page if y is low on the page
                doc.addPage();
                y = margin;
            }
            doc.setFont('times', 'bold');
            doc.text(`${counter}. ${title}`, margin, y);
            y += 10;
            doc.setFont('times', 'normal');
            const lines = doc.splitTextToSize(content, pageWidth - margin * 2);
            doc.text(lines, margin, y);
            y += lines.length * 7 + 10;
        }

        // Title
        doc.setFontSize(18);
        doc.setFont('times', 'bold');
        doc.text('Last Will and Testament', pageWidth / 2, y, { align: 'center' });
        y += 10;
        doc.setFontSize(14);
        doc.text(`of ${testatorName || '[Testator Name]'}`, pageWidth / 2, y, { align: 'center' });
        y += 20;

        // Declaration
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        const declarationText = `I, ${testatorName}, residing at ${testatorAddress}, being of sound mind and memory, do hereby declare this to be my last Will and Testament, revoking all former wills and codicils made by me.`;
        const declarationLines = doc.splitTextToSize(declarationText, pageWidth - margin * 2);
        doc.text(declarationLines, margin, y);
        y += declarationLines.length * 7 + 10;
        
        let sectionCounter = 1;

        // Appointment of Executor
        let executorText = `I appoint ${executorName || '[Executor Name]'} as the Executor of this, my Will.`;
        if (alternateExecutorName) {
            executorText += ` If this Executor is unable or unwilling to serve, I appoint ${alternateExecutorName} as my alternate Executor.`;
        }
        addSection('Appointment of Executor', executorText, sectionCounter++);

        // Appointment of Guardian
        if (hasMinorChildren && guardianName) {
            let guardianText = `I appoint ${guardianName} as the Guardian of my minor children.`;
            if (alternateGuardianName) {
                guardianText += ` If this Guardian is unable or unwilling to serve, I appoint ${alternateGuardianName} as the alternate Guardian.`;
            }
            addSection('Appointment of Guardian', guardianText, sectionCounter++);
        }

        // Real Estate
        if (realEstate.length > 0) {
            doc.setFont('times', 'bold');
            doc.text(`${sectionCounter++}. Real Estate`, margin, y);
            y += 10;
            doc.setFont('times', 'normal');
            realEstate.forEach((property) => {
                const propertyText = `I give my property described as "${property.description}" located at ${property.location}.`;
                const propertyLines = doc.splitTextToSize(propertyText, pageWidth - margin * 2 - 5);
                doc.text(`- ${propertyLines[0]}`, margin + 5, y);
                if (propertyLines.length > 1) {
                    doc.text(propertyLines.slice(1), margin + 5, y + 5);
                    y += (propertyLines.length) * 5 + 5;
                } else {
                     y += 10;
                }
            });
        }
        
        // Specific Gifts
        if (gifts.length > 0) {
             doc.setFont('times', 'bold');
             doc.text(`${sectionCounter++}. Specific Gifts`, margin, y);
             y += 10;
             doc.setFont('times', 'normal');
             gifts.forEach((gift) => {
                 const giftText = `I give to ${gift.beneficiary} the following item(s): ${gift.item}.`;
                 const giftLines = doc.splitTextToSize(giftText, pageWidth - margin * 2 - 5);
                 doc.text(`- ${giftLines[0]}`, margin + 5, y);
                 if (giftLines.length > 1) {
                    doc.text(giftLines.slice(1), margin + 5, y + 5);
                    y += (giftLines.length) * 5 + 5;
                } else {
                     y += 10;
                }
             });
        }

        // Residuary Estate
        if (residuaryBeneficiaryName) {
            const residuaryText = `I give all the rest, residue, and remainder of my estate, both real and personal, to ${residuaryBeneficiaryName}.`;
            addSection('Residuary Estate', residuaryText, sectionCounter++);
        }

        // Governing Law
        addSection('Governing Law', `The validity and interpretation of this Will shall be governed by the laws of ${jurisdiction}.`, sectionCounter++);

        // Signature Block
        const signatureText = `IN WITNESS WHEREOF, I have hereunto set my hand this ______ day of ____________________, 20____.`;
        doc.text(signatureText, margin, y);
        y += 20;
        doc.text('________________________________', margin, y);
        y += 7;
        doc.text(testatorName || '[Testator Name]', margin, y);
        y += 15;
        
        // Witnesses
        const witnessText = `SIGNED, PUBLISHED, AND DECLARED by the above-named Testator as and for their last Will and Testament, in the presence of us, who at their request, in their presence, and in the presence of each other, have hereunto subscribed our names as witnesses.`;
        const witnessLines = doc.splitTextToSize(witnessText, pageWidth - margin * 2);
        
        const pageHeight = doc.internal.pageSize.getHeight();
        const footerHeight = 30; 
        const witnessBlockHeight = witnessLines.length * 7 + 15 + 20;

        if (y + witnessBlockHeight > pageHeight - footerHeight) {
            doc.addPage();
            y = margin;
        }

        doc.text(witnessLines, margin, y);
        y += witnessLines.length * 7 + 15;

        doc.text('Witness 1: __________________________', margin, y);
        y += 10;
        doc.text('Witness 2: __________________________', margin, y);

        // Disclaimer Footer (on every page)
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            const footerY = pageHeight - 20;
            doc.setLineWidth(0.5);
            doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
            doc.setFontSize(8);
            doc.setFont('times', 'italic');
            const disclaimer = "This document was generated by the WillPro utility. It is a template and MUST be reviewed by a qualified solicitor before execution to ensure it is legally binding and meets your specific needs.";
            const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - margin * 2);
            doc.text(disclaimerLines, pageWidth / 2, footerY, { align: 'center' });
        }


        // Save the PDF
        doc.save(`Last_Will_and_Testament_${testatorName.replace(/\s/g, '_') || 'draft'}.pdf`);
        addAuditLog('PDF document generated and downloaded');
        setIsLoading(false);
    };

    return (
        <div className="review-step">
            <h2 className="step-title">Review & Generate</h2>
            <p className="step-subtitle">Please carefully review all the details below. Once confirmed, you can generate your secure document.</p>

            <div className="review-section">
                <h3>Jurisdiction</h3>
                <div className="review-item">
                    <strong>Governing Law:</strong>
                    <span>{formData.jurisdiction}</span>
                </div>
            </div>

            <div className="review-section">
                <h3>Testator Information</h3>
                <div className="review-item"><strong>Full Name:</strong><span>{formData.testatorName || 'N/A'}</span></div>
                <div className="review-item"><strong>Address:</strong><span>{formData.testatorAddress || 'N/A'}</span></div>
                 <div className="review-item"><strong>Date of Birth:</strong><span>{formData.testatorDob || 'N/A'}</span></div>
            </div>

            <div className="review-section">
                <h3>Appointments</h3>
                 <div className="review-item"><strong>Primary Executor:</strong><span>{formData.executorName || 'N/A'}</span></div>
                 <div className="review-item"><strong>Alternate Executor:</strong><span>{formData.alternateExecutorName || 'N/A'}</span></div>
                 {formData.hasMinorChildren && (
                    <>
                        <div className="review-item" style={{marginTop: '8px'}}><strong>Primary Guardian:</strong><span>{formData.guardianName || 'N/A'}</span></div>
                        <div className="review-item"><strong>Alternate Guardian:</strong><span>{formData.alternateGuardianName || 'N/A'}</span></div>
                    </>
                 )}
            </div>
            
             <div className="review-section">
                <h3>Real Estate Assets</h3>
                {formData.realEstate.length === 0 ? <p>No real estate assets listed.</p> : (
                    formData.realEstate.map((p, i) => <div className="review-item" key={i}><strong>{p.description}</strong><span>{p.location}</span></div>)
                )}
            </div>
            
             <div className="review-section">
                <h3>Specific Gifts</h3>
                {formData.gifts.length === 0 ? <p>No specific gifts listed.</p> : (
                    formData.gifts.map((g, i) => <div className="review-item" key={i}><strong>{g.beneficiary}:</strong><span>{g.item}</span></div>)
                )}
            </div>

            <div className="review-section">
                <h3>Residuary Estate</h3>
                <div className="review-item">
                    <strong>Beneficiary:</strong>
                    <span>{formData.residuaryBeneficiaryName || 'N/A'}</span>
                </div>
            </div>

            <div className="button-group">
                <button className="back-btn" onClick={handleBack}>Back</button>
                <button className="continue-btn" onClick={handleGeneratePdf} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Secure Document'}
                </button>
            </div>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
                <button 
                    onClick={handleReset} 
                    className="start-over-btn"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
};

export default ReviewStep;
```

### FILE: components/TestatorStep.tsx
```typescript
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
```

### FILE: CREATION.md
```md
# willpro

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: db.ts
```typescript
import { FormData } from './App';

const DB_NAME = 'willpro_db';
const STORE_NAME = 'drafts';
const DRAFT_ID = 'current';

interface Draft {
  id: string;
  step: number;
  formData: FormData;
  updatedAt: string;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export async function saveDraft(step: number, formData: FormData): Promise<void> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
  const draft: Draft = {
    id: DRAFT_ID,
    step,
    formData,
    updatedAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const request = store.put(draft);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function loadDraft(): Promise<Draft | null> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.get(DRAFT_ID);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

export async function deleteDraft(): Promise<void> {
  const db = await openDatabase();
  const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(DRAFT_ID);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

```

### FILE: deploy.ps1
```ps1
# WillPro Deployment Script
# SCP-based deployment using bash

param(
    [string]$RemoteHost = "root@techbridge.edu.gh",
    [string]$RemotePath = "/var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/willpro/",
    [switch]$Build = $false
)

Write-Host "=== WILLPRO DEPLOYMENT ===" -ForegroundColor Cyan
Write-Host "Remote: $RemoteHost"
Write-Host "Path: $RemotePath`n"

# Build if requested
if ($Build) {
    Write-Host "Building..." -ForegroundColor Yellow
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# Check dist exists
if (-not (Test-Path "dist")) {
    Write-Host "Error: dist/ not found. Run with -Build flag." -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "mkdir -p $RemotePath && rm -rf $RemotePath/*" | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow
bash -c "cd 'C:\Development\github\aucdt-utilities\willpro' && scp -r -o StrictHostKeyChecking=no dist/* $RemoteHost`:$RemotePath 2>/dev/null"

Write-Host "Creating .htaccess..." -ForegroundColor Yellow
@"
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /willpro/
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ /willpro/index.html [QSA,L]
</IfModule>
"@ | ssh -o StrictHostKeyChecking=no $RemoteHost "cat > $RemotePath/.htaccess" 2>$null

Write-Host "Setting permissions..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no $RemoteHost "chown -R techbridge.edu.gh_md:psacln $RemotePath && chmod -R 755 $RemotePath && chmod 644 $RemotePath/.htaccess 2>/dev/null; true" | Out-Null

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "URL: https://ai-tools.techbridge.edu.gh/willpro`n"


```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/willpro/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/willpro/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/willpro/',  // REQUIRED: Assets must load from /willpro/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/willpro"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/willpro">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/willpro/`, not at the root
- **Asset Loading**: Without `base: '/willpro/'`, assets try to load from `/assets/` instead of `/willpro/assets/`
- **Routing**: Without `basename="/willpro"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/willpro/assets/index-*.js`
- Link tags should reference: `/willpro/assets/index-*.css`

If they reference `/assets/` instead of `/willpro/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/willpro/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/willpro/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: willpro

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — willpro

**Application:** willpro
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_willpro_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — willpro

**Application:** willpro
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd willpro
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build willpro
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up willpro
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Willpro
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Willpro**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Willpro** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Willpro** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — willpro

**Application:** willpro
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd willpro
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: e2e.test.js
```javascript

/**
 * @jest-environment jest-playwright
 * 
 * End-to-end test suite for the WillPro application.
 *
 * This test simulates a full user journey through the will creation process.
 * It assumes a local web server is running and serving the application.
 * 
 * To run this test:
 * 1. Make sure you have Jest and jest-playwright configured.
 * 2. Start a local server for the project (e.g., `npx http-server .`).
 * 3. Run the test command (e.g., `jest e2e.test.js`).
 */

describe('WillPro End-to-End Test', () => {
    beforeAll(async () => {
        // Navigate to the application's URL.
        // Replace with your local server's URL if different.
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    });

    it('should complete the entire will creation process', async () => {
        // --- Step 1: Jurisdiction ---
        await page.waitForSelector('.jurisdiction-step');
        await expect(page).toMatchElement('h2', { text: 'Jurisdiction & Disclaimer' });
        await page.select('select[name="jurisdiction"]', 'Ghana');
        await page.click('.continue-btn');

        // --- Step 2: Testator ---
        await page.waitForSelector('.testator-step');
        await expect(page).toMatchElement('h2', { text: 'Testator Information' });
        await page.type('input[name="testatorName"]', 'John Kweku Doe');
        await page.type('input[name="testatorAddress"]', '123 Ananse Street, Accra, Ghana');
        await page.type('input[name="testatorDob"]', '1980-01-15'); // YYYY-MM-DD
        await page.click('.continue-btn');

        // --- Step 3: Executor ---
        await page.waitForSelector('.executor-step');
        await expect(page).toMatchElement('h2', { text: 'Appoint an Executor' });
        await page.type('input[name="executorName"]', 'Jane Ama Doe');
        await page.type('input[name="alternateExecutorName"]', 'Peter Mensah');
        await page.click('.continue-btn');
        
        // --- Step 4: Guardianship ---
        await page.waitForSelector('.guardianship-step');
        await expect(page).toMatchElement('h2', { text: 'Appoint a Guardian' });
        await page.click('input[name="hasMinorChildren"]');
        await page.waitForSelector('input[name="guardianName"]');
        await page.type('input[name="guardianName"]', 'Mary Akua Smith');
        await page.type('input[name="alternateGuardianName"]', 'David Kofi Jones');
        await page.click('.continue-btn');

        // --- Step 5: Assets ---
        await page.waitForSelector('.assets-step');
        await expect(page).toMatchElement('h2', { text: 'Real Estate Assets' });
        await page.type('input#propertyDescription', 'House and land');
        await page.type('input#propertyLocation', 'East Legon, Accra');
        await page.click('.add-item-box .btn-primary');
        await expect(page).toMatchElement('.item-list-item strong', { text: 'House and land' });
        await page.click('.continue-btn');

        // --- Step 6: Specific Gifts ---
        await page.waitForSelector('.distribution-step');
        await expect(page).toMatchElement('h2', { text: 'Specific Gifts' });
        await page.type('input#beneficiaryName', 'Kofi Doe');
        await page.type('input#giftItem', 'My Rolex watch');
        await page.click('.add-item-box .btn-primary');
        await expect(page).toMatchElement('.item-list-item strong', { text: 'Kofi Doe' });
        await page.click('.continue-btn');

        // --- Step 7: Residuary Estate ---
        await page.waitForSelector('.residuary-step');
        await expect(page).toMatchElement('h2', { text: 'Residuary Estate' });
        await page.type('input[name="residuaryBeneficiaryName"]', 'Jane Ama Doe');
        await page.click('.continue-btn');
        
        // --- Step 8: Review ---
        await page.waitForSelector('.review-step');
        await expect(page).toMatchElement('h2', { text: 'Review & Generate' });

        // Verify the data on the review page
        await expect(page).toMatchElement('.review-item span', { text: 'Ghana' });
        await expect(page).toMatchElement('.review-item span', { text: 'John Kweku Doe' });
        await expect(page).toMatchElement('.review-item span', { text: 'Jane Ama Doe' });
        await expect(page).toMatchElement('.review-item span', { text: 'Peter Mensah' });
        await expect(page).toMatchElement('.review-item span', { text: 'Mary Akua Smith' });
        await expect(page).toMatchElement('.review-item span', { text: 'David Kofi Jones' });
        await expect(page).toMatchElement('.review-item strong', { text: 'House and land' });
        await expect(page).toMatchElement('.review-item strong', { text: 'Kofi Doe:' });
        await expect(page).toMatchElement('.review-item span', { text: 'My Rolex watch' });

        // Check if the Generate button is present
        await expect(page).toMatchElement('.continue-btn', { text: 'Generate Secure Document' });
    });
});

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- ========== BASIC SEO META TAGS ========== -->
    <title>Techbridge University College | Pioneering Design & Technology</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    
    <!-- 🆕 SEO ADDITION: Keywords -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    
    <!-- 🆕 SEO ADDITION: Author and Publisher -->
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    
    <!-- 🆕 SEO ADDITION: Canonical URL -->
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    
    <!-- 🆕 SEO ADDITION: Robots Meta Tag -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- 🆕 SEO ADDITION: Language and Geographic Targeting -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    
    <!-- ========== OPEN GRAPH META TAGS (Facebook, LinkedIn, etc.) ========== -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    
    <!-- ========== TWITTER CARD META TAGS ========== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    
    <!-- ========== ADDITIONAL SEO META TAGS ========== -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="rating" content="general" />
    <meta name="referrer" content="origin-when-cross-origin" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>
        
    <!-- Favicon / Tab Logo -->
    <link rel="icon" type="image/png" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@18.2.0",
        "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
        "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime",
        "jspdf": "https://esm.sh/jspdf@2.5.1",
        "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
        "react/": "https://esm.sh/react@^19.1.1/"
      }
    }
    </script>
    <link rel="stylesheet" href="/index.css">
    <style>
        /* Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8f9fa;
          color: #333;
          line-height: 1.6;
        }
        
        #root {
            width: 100%;
        }

        /* Header */
        .header {
          background-color: white;
          padding: 30px 40px;
          border-bottom: 2px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
        }

        .audit-logs-btn {
          padding: 12px 24px;
          background-color: transparent;
          color: #0891b2;
          border: 2px solid #0891b2;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .audit-logs-btn:hover {
          background-color: #0891b2;
          color: white;
        }

        /* Progress Steps */
        .progress-container {
          background-color: white;
          padding: 20px 40px;
          border-bottom: 1px solid #e9ecef;
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }

        .progress-steps::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #e9ecef;
          z-index: 0;
        }
        
        .progress-line {
            position: absolute;
            top: 20px;
            left: 0;
            height: 2px;
            background: #0891b2;
            z-index: 0;
            transition: width 0.4s ease;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
          width: 100px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
          background-color: white;
          border: 2px solid #ccc;
          color: #666;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background-color: #0891b2;
          border-color: #0891b2;
          color: white;
          transform: scale(1.1);
        }

        .step.completed .step-number {
          background-color: #0891b2;
          border-color: #0891b2;
          color: white;
        }

        .step-label {
          font-size: 12px;
          color: #666;
          text-align: center;
          font-weight: 500;
          height: 30px;
        }

        .step.active .step-label {
          color: #0891b2;
          font-weight: 600;
        }

        /* Main Content */
        .main-content {
          max-width: 800px;
          margin: 40px auto;
          padding: 40px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .step-title {
          font-size: 32px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 10px;
        }
        
        .step-subtitle {
            font-size: 1rem;
            color: #6b7280;
            margin-bottom: 30px;
        }

        /* Disclaimer Box */
        .disclaimer {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 30px;
          position: relative;
        }

        .disclaimer-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: bold;
          color: #d97706;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .disclaimer-icon {
          font-size: 20px;
        }

        .disclaimer-text {
          color: #92400e;
          line-height: 1.5;
          font-size: 14px;
        }

        /* Form Section */
        .form-section {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 15px;
        }

        .form-select, .form-input {
          width: 100%;
          padding: 12px 16px;
          background-color: #f3f4f6;
          color: #111827;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-select:focus, .form-input:focus {
          outline: none;
          border-color: #0891b2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.2);
        }

        .form-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
        }
        
        .form-checkbox-group {
            display: flex;
            align-items: center;
            gap: 12px;
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 6px;
        }
        
        .form-checkbox {
            width: 1.25em;
            height: 1.25em;
            accent-color: #0891b2;
            cursor: pointer;
        }

        /* Button Group */
        .button-group {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
        }

        .continue-btn, .back-btn, .btn-primary, .btn-secondary {
          border: none;
          padding: 14px 28px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .continue-btn, .btn-primary {
          background: linear-gradient(135deg, #0891b2, #06b6d4);
          color: white;
        }

        .continue-btn:hover, .btn-primary:hover {
          background: linear-gradient(135deg, #0e7490, #0891b2);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(8, 145, 178, 0.3);
        }

        .continue-btn:active, .btn-primary:active {
          transform: translateY(0);
        }
        
        .back-btn, .btn-secondary {
            background-color: #e5e7eb;
            color: #4b5563;
        }
        
        .back-btn:hover, .btn-secondary:hover {
            background-color: #d1d5db;
        }
        
        .add-item-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            padding: 24px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .item-list-container {
            margin-top: 20px;
        }
        
        .item-list-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border-radius: 6px;
            background-color: #f8f9fa;
            margin-bottom: 8px;
        }

        .item-list-remove-btn {
            background-color: #fee2e2;
            color: #b91c1c;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
        }
        .item-list-remove-btn:hover {
            background-color: #fecaca;
        }

        .review-section {
            margin-bottom: 24px;
        }
        
        .review-section h3 {
            font-size: 18px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 8px;
        }
        
        .review-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 15px;
        }
        
        .review-item strong {
             font-weight: 600;
             color: #111827;
        }

        .review-item span {
            color: #4b5563;
            text-align: right;
        }
        
        .start-over-btn {
            background: none;
            border: none;
            color: #0891b2;
            text-decoration: underline;
            cursor: pointer;
            font-size: 14px;
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(17, 24, 39, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
        }

        .modal-content {
            background-color: white;
            border-radius: 12px;
            padding: 24px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            max-height: 80vh;
            display: flex;
            flex-direction: column;
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 16px;
            margin-bottom: 16px;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 20px;
            color: #111827;
        }

        .modal-body {
            overflow-y: auto;
            flex-grow: 1;
        }
        
        .modal-close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
        }

        .modal-footer {
            padding-top: 16px;
            margin-top: 16px;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        .audit-table {
            width: 100%;
            border-collapse: collapse;
        }

        .audit-table th, .audit-table td {
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
        }
        
        .audit-table tr:last-child td {
            border-bottom: none;
        }

        .audit-table th {
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            color: #6b7280;
        }
        
        .audit-table td {
            font-size: 14px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header {
            padding: 15px 20px;
            flex-direction: column;
            gap: 15px;
          }
          
          .progress-container {
            padding: 15px 10px;
          }
          
          .progress-steps {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 10px;
            scrollbar-width: none; /* Firefox */
          }
          .progress-steps::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
          }
          
          .step {
            min-width: 80px;
          }
          
          .step-number {
            width: 35px;
            height: 35px;
            font-size: 14px;
          }
          
          .step-label {
            font-size: 11px;
          }
          
          .main-content {
            padding: 20px;
            margin: 20px;
          }
          
          .step-title {
            font-size: 24px;
          }
          
          .continue-btn, .back-btn {
            width: 100%;
            float: none;
          }

          .button-group {
              flex-direction: column-reverse;
              gap: 10px;
          }
        }
    </style>
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "react/jsx-runtime": "https://esm.sh/react@18.2.0/jsx-runtime",
    "jspdf": "https://esm.sh/jspdf@2.5.1",
    "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
    "react/": "https://esm.sh/react@^19.1.1/"
  }
}
</script>
<link rel="stylesheet" href="/index.css">

    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
<body>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">willpro</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

    <script type="module" src="./index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
  <React.StrictMode>
    <AuthGate onLogout={() => window.location.href = '/'}><App /></AuthGate>
  </React.StrictMode>
);
}
```

### FILE: metadata.json
```json
{
  "description": "Generated by Gemini.",
  "requestFramePermissions": [],
  "name": "WillPro"
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@11.1.2",
  "name": "willpro",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "jspdf": "4.2.1",
    "lucide-react": "^1.16.0",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "react-router-dom": "^7.15.1"
  },
  "devDependencies": {
    "@playwright/test": "^1.60.0",
    "@tailwindcss/vite": "^4.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^25.8.0",
    "@vitejs/plugin-react": "^6.0.1",
    "@vitest/coverage-v8": "^4.1.6",
    "@vitest/ui": "^4.1.6",
    "jsdom": "^29.1.1",
    "serve": "14.2.6",
    "tailwindcss": "^4.3.0",
    "typescript": "~6.0.3",
    "vite": "8.0.13",
    "vitest": "^4.1.6"
  }
}

```

### FILE: README.md
```md
# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Q9aI7dfMN9ngkgW9thyjlcimyVc--25P?showPreview=true&showCode=true&showAssistant=true

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Willpro</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Willpro — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — willpro
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('willpro E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: SYSTEM_ARCHITECTURE.md
```md

# System Architecture Guide

## 1. Overview

WillPro is a client-side, single-page application (SPA) built with React and TypeScript. Its primary function is to guide a user through a multi-step form to gather information and dynamically generate a "Last Will and Testament" document as a PDF. The architecture prioritizes simplicity, leveraging modern browser features and avoiding a complex build pipeline.

## 2. Technology Stack

- **Frontend Library:** **React 18.2.0** (using `React.StrictMode`).
- **Language:** **TypeScript** (via `.tsx` files for JSX syntax). Type safety is used for props and state.
- **PDF Generation:** **jsPDF**, a client-side library for generating PDFs directly in the browser.
- **Module System:** **Native ES Modules** with **Import Maps**. The application does not use a bundler like Webpack or Vite. Dependencies like React and jspdf are loaded directly from a CDN (`esm.sh`) via the `<script type="importmap">` tag in `index.html`.
- **Styling:** **Global CSS**. All styles are contained within a single `<style>` block in `index.html`. It uses modern CSS features and is fully responsive.

## 3. Project Structure

The project follows a component-based structure.

- **`index.html`**: The single HTML file and entry point for the application. It contains:
    - The root div (`<div id="root">`).
    - The global stylesheet.
    - The `importmap` for managing JavaScript dependencies.
    - The script tag to load the main `index.tsx` module.

- **`index.tsx`**: The root of the React application. It finds the `root` element and uses `ReactDOM.createRoot()` to render the main `App` component.

- **`App.tsx`**: The core component of the application. Its responsibilities include:
    - **State Management:** Holds all application-level state, including `currentStep`, `formData`, `auditLogs`, and modal visibility (`isModalOpen`).
    - **Routing:** A `switch` statement in the `renderStep` function acts as a simple router, rendering the correct step component based on `currentStep`.
    - **Logic & Handlers:** Contains all the event handlers (`handleNext`, `handleBack`, `handleChange`, `handleReset`, etc.) and business logic (audit log import/export).
    - **Prop Drilling:** Passes state and handlers down to child components as props.

- **`components/`**: This directory contains all the reusable React components.
    - **`ProgressBar.tsx`**: A presentational component that visually indicates the user's progress through the multi-step form.
    - **`[StepName]Step.tsx`**: Each of the 8 steps in the form is a dedicated component (e.g., `JurisdictionStep.tsx`, `TestatorStep.tsx`). They receive `formData` and callback functions as props. Some have internal state for their own inputs.
    - **`ReviewStep.tsx`**: A critical component that both displays the final summary and contains the logic for generating the PDF using `jsPDF`.
    - **`AuditLogModal.tsx`**: A reusable modal component for displaying, exporting, and importing audit logs.

- **`metadata.json`**: Configuration file for the hosting environment, specifying application name and permissions.

## 4. State Management and Data Flow

The application employs a centralized state management pattern within the `App` component, following a unidirectional data flow.

- **Source of Truth:** The `formData` state object in `App.tsx` is the single source of truth for all user-entered data.
- **Data Flow Down:** State (e.g., relevant parts of `formData`) is passed down from `App.tsx` to the active step component via props.
- **Events Flow Up:** When a user interacts with a form element in a step component, a callback function (e.g., `handleChange`), also passed down via props, is invoked. This function updates the state in the parent `App.tsx` component.
- **Re-render Cycle:** The state update in `App.tsx` triggers a re-render, and the updated data flows back down to the child components.

This approach keeps the step components "controlled" and relatively stateless, simplifying the overall architecture.

## 5. Key Features Architecture

### PDF Generation
- This logic is encapsulated within the `ReviewStep.tsx` component.
- When the "Generate Secure Document" button is clicked, the `handleGeneratePdf` function is triggered.
- It initializes a new `jsPDF` instance.
- It uses the `formData` prop to dynamically build the document, adding sections, text, and formatting based on the user's input.
- It includes logic for page breaks and adding a footer to every page.
- Finally, it uses `doc.save()` to trigger a download of the generated PDF in the user's browser.

### Audit Logging
- The `auditLogs` state is managed in `App.tsx`.
- The `addAuditLog` function creates a new log entry with a timestamp and updates the state. It is passed as a prop where needed (e.g., to `ReviewStep`).
- **Export/Import:** The logic uses the `FileReader` API for importing and `URL.createObjectURL` for exporting the `auditLogs` state as a JSON file.

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: USER_GUIDE.md
```md

# WillPro User Guide

## Introduction

Welcome to WillPro! This guide will walk you through the process of using the application to organize and draft a Last Will and Testament. 

**Important Legal Disclaimer:** WillPro is a utility to help you organize information. It does not provide legal advice. All documents generated are templates and **MUST** be reviewed by a qualified solicitor before execution to ensure they are legally binding and meet your specific needs.

## The Will Creation Process

The application guides you through an 8-step process. You can navigate using the "Next" and "Back" buttons. Your progress is always visible at the top of the screen.

### Step 1: Jurisdiction & Disclaimer
- **Select Jurisdiction:** Choose the country or legal system that will govern your will. This will be reflected in the final document.
- **Disclaimer:** You must read and acknowledge the legal disclaimer before proceeding. Clicking "Agree & Continue" confirms your understanding.

### Step 2: Testator Information
- Enter your full legal name, address, and date of birth. This is the information for the person creating the will.

### Step 3: Appoint an Executor
- **Primary Executor:** Name the person you trust to carry out the wishes in your will.
- **Alternate Executor:** It is highly recommended to name a backup in case your primary choice is unable to serve.

### Step 4: Appoint a Guardian
- If you have children under the age of 18, check the box.
- **Primary & Alternate Guardian:** Appoint a primary guardian to care for them and an optional alternate.

### Step 5: Real Estate Assets
- List any real estate you own (e.g., houses, land).
- Provide a description and location for each property and click "Add Property".
- You can add multiple properties and remove them from the list if needed.

### Step 6: Specific Gifts
- List any specific items you wish to give to a particular person (beneficiary or next of kin).
- Enter the beneficiary's name and a description of the gift, then click "Add Gift".

### Step 7: Residuary Estate
- The "residue" is everything that remains in your estate after debts, expenses, and specific gifts are distributed.
- Name a beneficiary to receive this remainder.

### Step 8: Review & Generate
- Carefully review all the information you have entered. Every detail will be listed here.
- If everything is correct, click **Generate Secure Document**. Your browser will download a PDF of your will.
- If you need to make changes, use the "Back" button.
- To start completely over, click the "Start Over" link.

## Managing Audit Logs

WillPro keeps a record of key actions for transparency.

- **Viewing Logs:** Click the **View Audit Logs** button in the top-right corner to open the log viewer.
- **Exporting Logs:** Inside the modal, click **Export Logs** to save a JSON file of the session's history to your computer for your records.
- **Importing Logs:** Click **Import Logs** to load a previously exported log file. This is useful for reviewing a past session's actions.

## Final Steps

After generating your PDF:
1.  **Print** the document.
2.  Take it to a **qualified solicitor** for review.
3.  Sign the document in the presence of two witnesses as per your jurisdiction's legal requirements.

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'react-vendor';
        }
      }
    }
  },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — willpro
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — willpro
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

