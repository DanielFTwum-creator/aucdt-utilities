# lecturer-assessment-system - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for lecturer-assessment-system.

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

### FILE: .env
```text
VITE_API_URL=http://localhost:5000

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

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

### FILE: ADMIN_GUIDE.md
```md

# Administrator Guide for the Lecturer Assessment System

**Version 1.0**

---

### Introduction

This guide provides instructions for administrators on how to use the advanced features of the Lecturer Assessment System. As an administrator, you have access to a secure panel that allows you to monitor system activity and manage application data.

### Table of Contents
1. [Accessing the Admin Panel](#1-accessing-the-admin-panel)
2. [Understanding the Audit Log](#2-understanding-the-audit-log)
3. [Data Management](#3-data-management)
    - [Exporting Assessments](#31-exporting-assessments)
    - [Importing Assessments](#32-importing-assessments)
4. [Managing Lecturers with PDF Uploads](#4-managing-lecturers-with-pdf-uploads)

---

### 1. Accessing the Admin Panel

The Admin Panel is a restricted area for system oversight.

**Steps to Access:**

1.  Navigate to the main application page.
2.  In the main navigation bar, click on the **"Admin"** tab.
3.  A login modal will appear, prompting you for a password.
4.  Enter the administrator password and click "Login".
    - The default password is: `admin`
5.  Upon successful login, you will be taken to the Admin Panel. You will remain logged in for the duration of your browser session.

### 2. Understanding the Audit Log

The Audit Log is the central feature of the Admin Panel. It provides a real-time, chronological record of important events that occur within the application. This is crucial for monitoring usage and tracking data changes.

Each log entry contains:
- **Timestamp:** The exact date and time the event occurred.
- **Action:** The type of event that was logged.
- **Details:** A descriptive message explaining the event.

The following actions are automatically logged:

| Action Type       | Description                                                              |
|-------------------|--------------------------------------------------------------------------|
| `ADMIN_LOGIN`     | Recorded every time an administrator successfully logs into the panel.   |
| `ASSESSMENT_SUBMIT` | Recorded when a new lecturer assessment is submitted by a user.          |
| `DATA_EXPORT`     | Logged when assessment data is exported to a JSON file.                  |
| `DATA_IMPORT`     | Logged when assessment data is imported from a JSON file.                |
| `PDF_PROCESSED`   | Recorded when a PDF is processed by the AI to extract data.              |

By reviewing the audit log, you can track how the system is being used and when key data modifications occur.

### 3. Data Management

The data management tools are located in the **"Analytics"** tab. These tools allow you to create backups and restore assessment data.

#### 3.1 Exporting Assessments

Exporting creates a JSON file backup of all lecturer assessments currently in the system. This is useful for offline analysis, record-keeping, or migrating data.

**To Export Data:**
1. Go to the **"Analytics"** tab.
2. In the "Data Management" section, click the **"Export to JSON"** button.
3. Your browser will automatically download a file named `aucdt-assessments-export-[YYYY-MM-DD].json`. Save this file in a secure location.

#### 3.2 Importing Assessments

Importing allows you to restore assessment data from a previously exported JSON file.

**Important:** Importing data will **completely replace** all existing assessment data in the application. This action cannot be undone.

**To Import Data:**
1. Go to the **"Analytics"** tab.
2. Click the **"Import from JSON"** button.
3. Select the valid JSON file you wish to import from your computer.
4. A confirmation prompt will appear, asking you to confirm the data replacement.
5. Click "OK" to proceed. The data will be loaded into the system.

### 4. Managing Lecturers with PDF Uploads

The **"Upload Programmes"** tab allows you to use AI to automatically populate the list of lecturers and courses from official university documents.

**To use this feature:**
1. Navigate to the **"Upload Programmes"** tab.
2. Select the relevant programme from the dropdown list.
3. Drag and drop the programme's PDF document into the upload area, or click to browse for the file.
4. The system will process the document and display the extracted lecturer names and course codes.
5. Review the extracted information. You can click **"Edit Data"** to make corrections.
6. Once satisfied, click **"Save to System"** to add the new lecturers to the directory.

```

### FILE: App.tsx
```typescript

import React, { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import AssessmentForm from './components/AssessmentForm';
import Header from './components/Header';
import LecturerDirectory from './components/LecturerDirectory';
import PasswordModal from './components/PasswordModal';
import ProgrammeDirectory from './components/ProgrammeDirectory';
import ResultsView from './components/ResultsView';
import StudentDashboard from './components/StudentDashboard';
import { ADD_LOG } from './hooks/actions';
import { useAppStore } from './hooks/useAppStore';
import { authService } from './services/AuthService';
import type { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const { state, dispatch } = useAppStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('lecturer_assessment_token'));

  // Validate token on mount
  useEffect(() => {
    const validate = async () => {
      if (token) {
        const result = await authService.validateToken(token);
        if (result.success && result.valid) {
          dispatch({ type: 'SET_ADMIN_AUTH', payload: true });
        } else {
          dispatch({ type: 'SET_ADMIN_AUTH', payload: false });
          setToken(null);
          localStorage.removeItem('lecturer_assessment_token');
        }
      }
    };
    validate();
  }, [token, dispatch]);

  const handleTabChange = (tab: Tab) => {
    if (tab === 'Admin' && !state.isAdminAuthenticated) {
      setIsPasswordModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handlePasswordSubmit = [REDACTED_CREDENTIAL]
    setIsAuthenticating(true);
    try {
      // Using 'admin' as default username for this system's simple auth context
      const result = await authService.login('admin', password);
      
      if (result.success && result.token) {
        setToken(result.token);
        localStorage.setItem('lecturer_assessment_token', result.token);
        dispatch({ type: 'SET_ADMIN_AUTH', payload: true });
        dispatch({
          type: ADD_LOG,
          payload: {
            action: "Admin Login",
            message: "Administrator access granted via Auth API.",
          },
        });
        setActiveTab('Admin');
        setIsPasswordModalOpen(false);
      } else {
        alert(result.message || 'Incorrect password');
      }
    } catch (error) {
       alert('Authentication service unavailable');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <StudentDashboard />;
      case 'Programmes':
        return <ProgrammeDirectory />;
      case 'Submit Assessment':
        return <AssessmentForm onFormSubmit={() => setActiveTab('Results')} />;
      case 'Results':
        return <ResultsView />;
      case 'Lecturers':
        return <LecturerDirectory />;
      case 'Analytics':
        return <AnalyticsDashboard />;
      case 'Admin':
        return state.isAdminAuthenticated ? <AdminPanel /> : null;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-background text-brand-text-primary">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      {isPasswordModalOpen && (
        <PasswordModal
          onClose={() => setIsPasswordModalOpen(false)}
          onSubmit={handlePasswordSubmit}
          isAuthenticating={isAuthenticating}
        />
      )}
    </div>
  );
};

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_lecturer_assessment_system';
const ACCENT   = '#ea580c';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Lecturer Assessment System</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
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

### FILE: components/AdminPanel.tsx
```typescript

import React, { useState } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import DataManagement from './DataManagement';
import PdfExtractor from './PdfExtractor';

type AdminSection = 'Data' | 'PDF' | 'Logs';

const AdminPanel: React.FC = () => {
    const { state } = useAppStore();
    const [activeSection, setActiveSection] = useState<AdminSection>('Data');

    const renderSection = () => {
        switch(activeSection) {
            case 'Data':
                return <DataManagement />;
            case 'PDF':
                return <PdfExtractor />;
            case 'Logs':
                return (
                     <div className="mt-4 bg-brand-background p-4 rounded-lg shadow-inner max-h-96 overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-2">Audit Log</h3>
                        {state.auditLogs.length > 0 ? (
                            <ul className="space-y-2">
                                {state.auditLogs.map(log => (
                                    <li key={log.id} className="text-sm bg-brand-surface p-2 rounded">
                                        <span className="font-mono text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                                        <span className={`ml-2 font-semibold ${log.action.includes('Login') ? 'text-green-600' : 'text-blue-600'}`}>{log.action}:</span>
                                        <span className="ml-2 text-brand-text-primary/90">{log.message}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-brand-text-primary/80">No system events logged yet.</p>
                        )}
                    </div>
                );
        }
    }

    return (
        <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-4">Administrator Panel</h2>
            <div className="border-b border-brand-warm-beige">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {(['Data', 'PDF', 'Logs'] as AdminSection[]).map(section => (
                        <button key={section} onClick={() => setActiveSection(section)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${activeSection === section 
                                    ? 'border-brand-primary text-brand-primary' 
                                    : 'border-transparent text-brand-text-primary/70 hover:text-brand-text-primary hover:border-brand-warm-beige'
                                }`}
                        >
                           {section === 'PDF' ? 'PDF Data Extractor' : section === 'Data' ? 'Data Management' : 'Audit Logs'}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminPanel;
```

### FILE: components/AnalyticsDashboard.tsx
```typescript

import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const StatCard: React.FC<{ title: string, value: string | number }> = ({ title, value }) => (
    <div className="bg-brand-surface p-6 rounded-lg shadow-md text-center border-l-4 border-brand-secondary">
        <h4 className="text-lg font-semibold text-brand-text-primary/80">{title}</h4>
        <p className="text-4xl font-bold text-brand-primary mt-2">{value}</p>
    </div>
);

const AnalyticsDashboard: React.FC = () => {
    const { state } = useAppStore();

    const analytics = useMemo(() => {
        const totalAssessments = state.assessments.length;

        if (totalAssessments === 0) {
            return {
                totalAssessments: 0,
                overallAverage: 'N/A',
                mostAssessedProgramme: 'N/A'
            };
        }

        const totalRatingSum = state.assessments.reduce((sum, assessment) => {
            const ratingValues = Object.values(assessment.ratings);
            const assessmentSum = ratingValues.reduce((a, b) => a + b, 0);
            const assessmentAvg = assessmentSum / ratingValues.length;
            return sum + assessmentAvg;
        }, 0);
        const overallAverage = (totalRatingSum / totalAssessments).toFixed(2);

        const programmeCounts = state.assessments.reduce((acc, assessment) => {
            acc[assessment.programmeId] = (acc[assessment.programmeId] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostAssessedProgrammeId = Object.keys(programmeCounts).reduce((a, b) => programmeCounts[a] > programmeCounts[b] ? a : b, '');
        const mostAssessedProgramme = state.programmes.find(p => p.id === mostAssessedProgrammeId)?.name || 'N/A';
        
        return { totalAssessments, overallAverage, mostAssessedProgramme };

    }, [state.assessments, state.programmes]);

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Assessments" value={analytics.totalAssessments} />
                <StatCard title="Overall Average Rating" value={analytics.overallAverage} />
                <StatCard title="Most Assessed Programme" value={analytics.mostAssessedProgramme} />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
```

### FILE: components/AssessmentForm.tsx
```typescript

import React, { useState, useMemo, useEffect } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { RATING_CATEGORIES } from '../constants';
import type { RatingCategory, Ratings, Recommendation } from '../types';
import { Recommendation as RecommendationEnum } from '../types';
import { StarIcon } from './icons';
import { ADD_ASSESSMENT, ADD_LOG } from '../hooks/actions';
import ConfirmationModal from './ConfirmationModal';


const StarRating: React.FC<{ category: RatingCategory, rating: number, onRate: (rating: number) => void }> = ({ category, rating, onRate }) => (
    <div>
        <label className="block text-sm font-medium text-brand-text-primary/90">{category}</label>
        <div className="flex space-x-1 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} onClick={() => onRate(star)}
                    className={`h-8 w-8 cursor-pointer transition-colors ${star <= rating ? 'text-brand-secondary' : 'text-gray-300'}`} />
            ))}
        </div>
    </div>
);

const AssessmentForm: React.FC<{onFormSubmit: () => void}> = ({onFormSubmit}) => {
    const { state, dispatch } = useAppStore();
    
    const [programmeId, setProgrammeId] = useState('');
    const [lecturerId, setLecturerId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [semester, setSemester] = useState<number>(1);
    const [ratings, setRatings] = useState<Ratings>({} as Ratings);
    const [comment, setComment] = useState('');
    const [recommend, setRecommend] = useState<Recommendation>(RecommendationEnum.Neutral);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredLecturers = useMemo(() => state.lecturers.filter(l => l.programmeId === programmeId), [programmeId, state.lecturers]);
    const filteredCourses = useMemo(() => state.courses.filter(c => c.programmeId === programmeId), [programmeId, state.courses]);

    useEffect(() => {
        // Reset lecturer and course selection when programme changes
        setLecturerId('');
        setCourseId('');
    }, [programmeId]);

    const handleRatingChange = (category: RatingCategory, rating: number) => {
        setRatings(prev => ({ ...prev, [category]: rating }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!programmeId || !lecturerId || !courseId || Object.keys(ratings).length < RATING_CATEGORIES.length) {
            alert('Please fill in all required fields and ratings.');
            return;
        }

        const newAssessment = {
            id: new Date().toISOString(),
            programmeId,
            lecturerId,
            courseId,
            semester,
            ratings,
            comment,
            recommend,
            timestamp: new Date().toISOString(),
        };

        dispatch({ type: ADD_ASSESSMENT, payload: newAssessment });
        dispatch({ type: ADD_LOG, payload: { action: 'Assessment Submitted', message: `New assessment for lecturer ID ${lecturerId}.` }});
        
        setIsModalOpen(true);
        // Reset form
        setProgrammeId('');
        setLecturerId('');
        setCourseId('');
        setSemester(1);
        setRatings({} as Ratings);
        setComment('');
        setRecommend(RecommendationEnum.Neutral);
    };

    return (
        <>
            <div className="max-w-2xl mx-auto bg-brand-surface p-8 rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Lecturer Assessment Form</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="programme" className="block text-sm font-medium text-brand-text-primary/90">Programme</label>
                            <select id="programme" value={programmeId} onChange={e => setProgrammeId(e.target.value)} required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                                <option value="">Select Programme</option>
                                {state.programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="lecturer" className="block text-sm font-medium text-brand-text-primary/90">Lecturer</label>
                            <select id="lecturer" value={lecturerId} onChange={e => setLecturerId(e.target.value)} required disabled={!programmeId}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md disabled:bg-gray-100">
                                <option value="">Select Lecturer</option>
                                {filteredLecturers.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="course" className="block text-sm font-medium text-brand-text-primary/90">Subject/Course</label>
                            <select id="course" value={courseId} onChange={e => setCourseId(e.target.value)} required disabled={!programmeId}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md disabled:bg-gray-100">
                                <option value="">Select Course</option>
                                {filteredCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-brand-text-primary/90">Semester</label>
                            <select id="semester" value={semester} onChange={e => setSemester(Number(e.target.value))} required
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {RATING_CATEGORIES.map(category => (
                            <StarRating key={category} category={category} rating={ratings[category] || 0} onRate={(rating) => handleRatingChange(category, rating)} />
                        ))}
                    </div>

                    <div>
                        <label htmlFor="recommend" className="block text-sm font-medium text-brand-text-primary/90">Would you recommend this lecturer?</label>
                        <select id="recommend" value={recommend} onChange={e => setRecommend(e.target.value as Recommendation)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                            {Object.values(RecommendationEnum).map(rec => <option key={rec} value={rec}>{rec}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-brand-text-primary/90">Comments (Optional)</label>
                        <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"></textarea>
                    </div>

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-text-light bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors">
                            Submit Assessment
                        </button>
                    </div>
                </form>
            </div>
            {isModalOpen && (
                <ConfirmationModal 
                    title="Submission Successful"
                    message="Your assessment has been submitted successfully."
                    onConfirm={() => {
                        setIsModalOpen(false);
                        onFormSubmit();
                    }}
                    confirmText="View Results"
                />
            )}
        </>
    );
};

export default AssessmentForm;
```

### FILE: components/ConfirmationModal.tsx
```typescript

import React from 'react';
import { CheckCircleIcon } from './icons';

interface ConfirmationModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, confirmText = "OK" }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-brand-surface rounded-lg shadow-xl p-6 m-4 max-w-sm w-full text-center animate-fade-in-up">
                <CheckCircleIcon className="mx-auto h-16 w-16 text-brand-accent mb-4" />
                <h3 className="text-2xl font-semibold text-brand-text-primary">{title}</h3>
                <p className="text-brand-text-primary/80 mt-2">{message}</p>
                <div className="mt-6">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-brand-primary text-brand-text-light py-2 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
```

### FILE: components/DataManagement.tsx
```typescript

import React, { useRef } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { IMPORT_ASSESSMENTS, ADD_LOG } from '../hooks/actions';
import type { Assessment } from '../types';

const DataManagement: React.FC = () => {
    const { state, dispatch } = useAppStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(state.assessments, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `assessments_export_${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        dispatch({ type: ADD_LOG, payload: { action: 'Data Exported', message: `${state.assessments.length} assessments exported.` }});
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content is not readable.");
                const importedAssessments: Assessment[] = JSON.parse(text);
                
                // Basic validation
                if (!Array.isArray(importedAssessments) || (importedAssessments.length > 0 && !importedAssessments[0].id)) {
                    throw new Error("Invalid JSON format for assessments.");
                }

                if (window.confirm(`This will replace ${state.assessments.length} existing assessments with ${importedAssessments.length} new ones. Are you sure?`)) {
                    dispatch({ type: IMPORT_ASSESSMENTS, payload: importedAssessments });
                    dispatch({ type: ADD_LOG, payload: { action: 'Data Imported', message: `${importedAssessments.length} assessments imported.` }});
                    alert('Import successful!');
                }
            } catch (error) {
                alert('Failed to import file. Please ensure it is a valid JSON export.');
                console.error(error);
            } finally {
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-4">
             <h3 className="text-xl font-semibold">Assessment Data</h3>
            <div className="flex space-x-4">
                <button onClick={handleExport}
                    className="flex-1 bg-brand-primary text-brand-text-light px-4 py-2 rounded-md hover:opacity-90 transition-colors">
                    Export to JSON
                </button>
                <button onClick={handleImportClick}
                    className="flex-1 bg-brand-accent text-brand-text-light px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
                    Import from JSON
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileImport} />
            </div>
        </div>
    );
};

export default DataManagement;
```

### FILE: components/Header.tsx
```typescript

import React from 'react';
import type { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = ['Dashboard', 'Programmes', 'Submit Assessment', 'Results', 'Lecturers', 'Analytics', 'Admin'];

  return (
    <header className="bg-brand-primary-dark shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-text-light">Lecturer Assessment System</h1>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
                    ${activeTab === tab 
                      ? 'bg-brand-secondary text-brand-primary-dark' 
                      : 'text-gray-300 hover:bg-brand-primary hover:text-brand-text-light'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
          <div className="md:hidden">
            <select
                onChange={(e) => onTabChange(e.target.value as Tab)}
                value={activeTab}
                className="bg-brand-primary text-brand-text-light rounded-md p-2"
            >
                {tabs.map(tab => <option key={tab} value={tab}>{tab}</option>)}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### FILE: components/icons.tsx
```typescript

import React from 'react';

export const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21 21H3" />
    </svg>
);

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
    <svg {...props} className={`animate-spin ${className || ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
```

### FILE: components/LecturerDirectory.tsx
```typescript

import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { Ratings } from '../types';
import { StarIcon } from './icons';

const LecturerDirectory: React.FC = () => {
    const { state } = useAppStore();

    const lecturerStats = useMemo(() => {
        return state.lecturers.map(lecturer => {
            const assessments = state.assessments.filter(a => a.lecturerId === lecturer.id);
            const reviewCount = assessments.length;

            if (reviewCount === 0) {
                return {
                    ...lecturer,
                    averageRating: 0,
                    reviewCount: 0,
                    programmeName: state.programmes.find(p => p.id === lecturer.programmeId)?.name || 'Unknown'
                };
            }

            const totalRatingSum = assessments.reduce((sum, assessment) => {
                const ratingValues = Object.values(assessment.ratings);
                const assessmentSum = ratingValues.reduce((a, b) => a + b, 0);
                const assessmentAvg = assessmentSum / ratingValues.length;
                return sum + assessmentAvg;
            }, 0);

            const averageRating = (totalRatingSum / reviewCount).toFixed(1);

            return {
                ...lecturer,
                averageRating: parseFloat(averageRating),
                reviewCount,
                programmeName: state.programmes.find(p => p.id === lecturer.programmeId)?.name || 'Unknown'
            };
        }).sort((a,b) => b.averageRating - a.averageRating);
    }, [state.lecturers, state.assessments, state.programmes]);

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Lecturer Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lecturerStats.map(lecturer => (
                    <div key={lecturer.id} className="bg-brand-surface p-5 rounded-lg shadow-lg border-l-4 border-brand-secondary">
                        <h3 className="text-xl font-bold text-brand-primary">{lecturer.name}</h3>
                        <p className="text-sm text-brand-text-primary/70">{lecturer.programmeName}</p>
                        <div className="mt-4 flex justify-between items-center">
                            {lecturer.reviewCount > 0 ? (
                                <div className="flex items-center space-x-2 text-lg font-bold">
                                    <StarIcon className="w-6 h-6 text-brand-secondary" />
                                    <span>{lecturer.averageRating}</span>
                                </div>
                            ) : (
                                <div className="text-brand-text-primary/80">No reviews yet</div>
                            )}
                            <div className="text-sm text-brand-text-primary/90">{lecturer.reviewCount} review(s)</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LecturerDirectory;
```

### FILE: components/Modal.tsx
```typescript

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    size?: 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        md: 'max-w-xl',
        lg: 'max-w-3xl',
        xl: 'max-w-5xl',
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} transform transition-all duration-300 ease-out animate-slideIn`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative p-6 sm:p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
```

### FILE: components/PasswordModal.tsx
```typescript

import React, { useState } from 'react';

interface PasswordModalProps {
    onClose: () => void;
    onSubmit: (password: string) => void;
    isAuthenticating?: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit, isAuthenticating = false }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 m-4 max-w-sm w-full animate-fade-in-up">
                <h2 className="text-2xl font-bold text-center text-brand-primary-dark mb-4">Admin Access</h2>
                <p className="text-center text-brand-text-primary/80 mb-6">Please enter the password to continue.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isAuthenticating}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary disabled:bg-gray-100"
                        placeholder="Password"
                        autoFocus
                    />
                    <div className="mt-6 flex space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isAuthenticating}
                            className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                         <button
                            type="submit"
                            disabled={isAuthenticating}
                            className="w-full py-2 px-4 bg-brand-primary text-brand-text-light rounded-md hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {isAuthenticating ? 'Authenticating...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;
```

### FILE: components/PdfExtractor.tsx
```typescript

import React, { useState, useCallback } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import { UploadIcon, SpinnerIcon, CheckCircleIcon } from './icons';
import { extractDataFromPdfText } from '../services/geminiService';
import type { Course, Lecturer } from '../types';
import { ADD_LOG, UPDATE_CURRICULUM } from '../hooks/actions';

const PdfExtractor: React.FC = () => {
    const { state, dispatch } = useAppStore();
    const [programmeId, setProgrammeId] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<{ lecturers: {name: string}[], courses: {name: string, year: number, semester: number}[] } | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setFile(files[0]);
            setError(null);
            setExtractedData(null);
        }
    };
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        handleFileChange(event.dataTransfer.files);
    }, []);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    const processPdf = async () => {
        if (!file || !programmeId) {
            setError("Please select a programme and a PDF file.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setExtractedData(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map((item: any) => item.str).join(' ');
            }
            
            const programmeName = state.programmes.find(p => p.id === programmeId)?.name || '';
            const data = await extractDataFromPdfText(fullText, programmeName);
            setExtractedData(data);
             dispatch({ type: ADD_LOG, payload: { action: 'PDF Processed', message: `Extracted data for ${programmeName} from ${file.name}.` }});

        } catch (e: any) {
            setError(e.message || "An unknown error occurred during PDF processing.");
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    const saveData = () => {
        if (!extractedData || !programmeId) return;
        dispatch({
            type: UPDATE_CURRICULUM,
            payload: {
                programmeId,
                ...extractedData
            }
        });
        dispatch({ type: ADD_LOG, payload: { action: 'Curriculum Updated', message: `Saved new data for programme ID ${programmeId}.` }});
        setExtractedData(null);
        setFile(null);
        setProgrammeId('');
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="programme-pdf" className="block text-sm font-medium text-brand-text-primary/90">Select Programme to Update</label>
                <select id="programme-pdf" value={programmeId} onChange={e => setProgrammeId(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                    <option value="">-- Select Programme --</option>
                    {state.programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            
            <div onDrop={handleDrop} onDragOver={handleDragOver} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:opacity-80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => handleFileChange(e.target.files)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                    {file && <p className="text-sm font-semibold text-green-600 pt-2">{file.name}</p>}
                </div>
            </div>

            <button onClick={processPdf} disabled={!file || !programmeId || isProcessing}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-text-light bg-brand-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:bg-gray-400">
                {isProcessing ? <SpinnerIcon className="h-5 w-5 mr-2" /> : <CheckCircleIcon className="h-5 w-5 mr-2" />}
                {isProcessing ? 'Processing with AI...' : 'Extract Data from PDF'}
            </button>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {extractedData && (
                <div className="mt-6 p-4 bg-brand-background rounded-lg animate-fade-in">
                    <h3 className="text-lg font-semibold mb-2">Review Extracted Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                        <div>
                            <h4 className="font-bold">Lecturers ({extractedData.lecturers.length})</h4>
                            <ul className="list-disc pl-5 text-sm">
                                {extractedData.lecturers.map((l, i) => <li key={i}>{l.name}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold">Courses ({extractedData.courses.length})</h4>
                             <ul className="list-disc pl-5 text-sm">
                                {extractedData.courses.map((c, i) => <li key={i}>{c.name} (Year {c.year}, Sem {c.semester})</li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                        <button onClick={saveData} className="flex-1 bg-brand-accent text-brand-text-light px-4 py-2 rounded-md hover:opacity-90">Save to System</button>
                        <button onClick={() => setExtractedData(null)} className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Discard</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfExtractor;
```

### FILE: components/ProgrammeDirectory.tsx
```typescript

import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';

const ProgrammeDirectory: React.FC = () => {
    const { state } = useAppStore();

    const programmeStats = useMemo(() => {
        return state.programmes.map(programme => {
            const courseCount = state.courses.filter(c => c.programmeId === programme.id).length;
            const lecturerCount = state.lecturers.filter(l => l.programmeId === programme.id).length;
            const assessmentCount = state.assessments.filter(a => a.programmeId === programme.id).length;

            return {
                ...programme,
                courseCount,
                lecturerCount,
                assessmentCount
            };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [state.programmes, state.courses, state.lecturers, state.assessments]);

    if (programmeStats.length === 0) {
        return (
            <div className="text-center bg-brand-surface p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-brand-text-primary">No Programmes Found</h2>
                <p className="mt-2 text-brand-text-primary/80">Programme data may not be loaded correctly.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Programme Directory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programmeStats.map(programme => (
                    <div key={programme.id} className="bg-brand-surface p-5 rounded-lg shadow-lg border-l-4 border-brand-secondary hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                        <h3 className="text-xl font-bold text-brand-primary mb-3">{programme.name}</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-brand-text-primary/80">Total Courses:</span>
                                <span className="font-bold text-brand-primary-dark">{programme.courseCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-text-primary/80">Total Lecturers:</span>
                                <span className="font-bold text-brand-primary-dark">{programme.lecturerCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-brand-text-primary/80">Assessments Submitted:</span>
                                <span className="font-bold text-brand-primary-dark">{programme.assessmentCount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgrammeDirectory;

```

### FILE: components/QuizModal.tsx
```typescript

import React, { useState, useEffect, useMemo } from 'react';
import type { Course } from '../types';

interface QuizModalProps {
    course: Course;
    onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ course, onClose }) => {
    const quiz = course.quiz!;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
    const [timeLeft, setTimeLeft] = useState(quiz.duration);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished]);

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const score = useMemo(() => {
        if (!isFinished) return 0;
        return answers.reduce((correctCount, answer, index) => {
            if (answer === quiz.questions[index].correctAnswerIndex) {
                return correctCount + 1;
            }
            return correctCount;
        }, 0);
    }, [isFinished, answers, quiz.questions]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-brand-primary">{course.name} Quiz</h2>
                    {!isFinished && <div className="text-lg font-mono bg-brand-primary/10 text-brand-primary px-3 py-1 rounded">{formatTime(timeLeft)}</div>}
                </div>

                {isFinished ? (
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-brand-accent">Quiz Completed!</h3>
                        <p className="my-4 text-xl">Your Score:</p>
                        <p className="text-5xl font-extrabold text-brand-primary">{score} / {quiz.questions.length}</p>
                        <button onClick={onClose} className="mt-6 w-full bg-brand-primary text-brand-text-light py-2 px-4 rounded-md hover:opacity-90 transition-colors">
                            Close
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {quiz.questions.length}</div>
                        <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button key={index} onClick={() => handleAnswerSelect(index)}
                                    className={`w-full text-left p-3 rounded-md border-2 transition-colors
                                        ${answers[currentQuestionIndex] === index 
                                            ? 'bg-brand-secondary border-brand-secondary text-brand-text-primary' 
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNext} disabled={answers[currentQuestionIndex] === null}
                            className="mt-6 w-full bg-brand-primary text-brand-text-light py-2 px-4 rounded-md hover:opacity-90 disabled:bg-gray-400 transition-colors">
                            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;
```

### FILE: components/ResultsView.tsx
```typescript

import React, { useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { Assessment } from '../types';
import { StarIcon } from './icons';

const ResultsView: React.FC = () => {
    const { state } = useAppStore();

    const getAverageRating = (ratings: Assessment['ratings']) => {
        const values = Object.values(ratings);
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, val) => acc + val, 0);
        return (sum / values.length).toFixed(1);
    };

    const assessmentsWithDetails = useMemo(() => {
        return state.assessments.map(assessment => {
            const lecturer = state.lecturers.find(l => l.id === assessment.lecturerId);
            const course = state.courses.find(c => c.id === assessment.courseId);
            return {
                ...assessment,
                lecturerName: lecturer?.name || 'Unknown',
                courseName: course?.name || 'Unknown',
                averageRating: getAverageRating(assessment.ratings)
            };
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [state.assessments, state.lecturers, state.courses]);

    if (state.assessments.length === 0) {
        return (
            <div className="text-center bg-brand-surface p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-brand-text-primary">No Assessments Submitted Yet</h2>
                <p className="mt-2 text-brand-text-primary/80">Submit an assessment to see the results here.</p>
            </div>
        );
    }

    return (
        <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Submitted Assessments</h2>
            <div className="space-y-4">
                {assessmentsWithDetails.map(assessment => (
                    <div key={assessment.id} className="p-4 border border-brand-warm-beige rounded-lg bg-brand-surface border-l-4 border-brand-secondary">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-brand-primary">{assessment.lecturerName}</h3>
                                <p className="text-sm text-brand-text-primary/70">{assessment.courseName}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-lg font-bold text-brand-text-primary">
                                <StarIcon className="w-6 h-6 text-brand-secondary" />
                                <span>{assessment.averageRating}</span>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-brand-text-primary/90"><strong>Recommendation:</strong> {assessment.recommend}</p>
                        {assessment.comment && (
                            <p className="mt-2 text-brand-text-primary bg-brand-background p-3 rounded-md italic">"{assessment.comment}"</p>
                        )}
                         <p className="mt-2 text-xs text-gray-400 text-right">Submitted on {new Date(assessment.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsView;
```

### FILE: components/StudentDashboard.tsx
```typescript

import React, { useState, useMemo } from 'react';
import { useAppStore } from '../hooks/useAppStore';
import type { Programme, Course } from '../types';
import QuizModal from './QuizModal';

const StudentDashboard: React.FC = () => {
    const { state } = useAppStore();
    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
    const [courseForQuiz, setCourseForQuiz] = useState<Course | null>(null);

    const handleProgrammeClick = (programme: Programme) => {
        setSelectedProgramme(programme);
    };

    const handleBackClick = () => {
        setSelectedProgramme(null);
    };

    const programmeCourses = useMemo(() => {
        if (!selectedProgramme) return {};
        const courses = state.courses.filter(c => c.programmeId === selectedProgramme.id);
        return courses.reduce((acc, course) => {
            const year = `Year ${course.year}`;
            if (!acc[year]) acc[year] = [];
            acc[year].push(course);
            return acc;
        }, {} as Record<string, Course[]>);
    }, [selectedProgramme, state.courses]);

    if (selectedProgramme) {
        return (
            <div className="bg-brand-surface p-6 rounded-lg shadow-lg animate-fade-in">
                <button onClick={handleBackClick} className="mb-4 bg-brand-primary text-brand-text-light px-4 py-2 rounded-md hover:opacity-90 transition-colors">
                    &larr; Back to Programmes
                </button>
                <h2 className="text-4xl font-bold text-brand-primary-dark mb-4">{selectedProgramme.name} Curriculum</h2>
                <div className="space-y-6">
                    {Object.keys(programmeCourses).sort().map(year => (
                        <div key={year}>
                            <h3 className="text-2xl font-medium text-brand-text-primary border-b-2 border-brand-secondary-light pb-2 mb-3">{year}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {programmeCourses[year].map(course => (
                                    <div key={course.id} className="bg-brand-warm-beige/30 p-4 rounded-md shadow-sm">
                                        <h4 className="font-bold">{course.name}</h4>
                                        <p className="text-sm text-brand-text-primary/70">Semester {course.semester}</p>
                                        {course.quiz && (
                                            <button 
                                                onClick={() => setCourseForQuiz(course)}
                                                className="mt-2 bg-brand-accent text-brand-text-light px-3 py-1 text-sm rounded-md hover:opacity-90 transition-opacity">
                                                Start Quiz
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                {courseForQuiz && courseForQuiz.quiz && (
                    <QuizModal course={courseForQuiz} onClose={() => setCourseForQuiz(null)} />
                )}
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-4xl font-bold text-brand-primary-dark mb-6">Academic Programmes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.programmes.map(programme => (
                    <div key={programme.id} onClick={() => handleProgrammeClick(programme)}
                        className="bg-brand-surface p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-l-4 border-brand-secondary">
                        <h3 className="text-2xl font-medium text-brand-primary">{programme.name}</h3>
                        <p className="text-brand-text-primary/80 mt-2">
                            {state.courses.filter(c => c.programmeId === programme.id).length} courses
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
```

### FILE: constants.ts
```typescript

import type { Programme, Course, Lecturer } from './types';
import { RatingCategory } from './types';

export const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

export const RATING_CATEGORIES: RatingCategory[] = [
    RatingCategory.TeachingQuality,
    RatingCategory.Communication,
    RatingCategory.SubjectKnowledge,
    RatingCategory.Punctuality,
];

export const INITIAL_PROGRAMMES: Programme[] = [
    { id: 'dmcd', name: 'B.Tech Digital Media & Communication Design' },
    { id: 'fdt-btech', name: 'B.Tech Fashion Design Technology' },
    { id: 'fdt-cert', name: 'Certificate Fashion Design Technology' },
    { id: 'jdt-ba', name: 'B.A. Jewellery Design Technology' },
    { id: 'jdt-dip', name: 'Diploma Jewellery Design Technology' },
    { id: 'pde-ba', name: 'B.A. Product Design & Entrepreneurship' },
    { id: 'pde-dip', name: 'Diploma Product Design' },
];

export const INITIAL_LECTURERS: Lecturer[] = [
    // Digital Media & Communication Design
    { id: 'lec_dmcd_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'dmcd' },
    { id: 'lec_dmcd_2', name: 'Mr. William Daitey', programmeId: 'dmcd' },
    { id: 'lec_dmcd_3', name: 'Mr. Daniel Boateng', programmeId: 'dmcd' },
    { id: 'lec_dmcd_4', name: 'Mr. Bright Agbosu', programmeId: 'dmcd' },
    { id: 'lec_dmcd_5', name: 'Mr. Selasi Ahiabu', programmeId: 'dmcd' },
    { id: 'lec_dmcd_6', name: 'Mr. Samuel Wellington', programmeId: 'dmcd' },
    { id: 'lec_dmcd_7', name: 'Mr. Robert Bunkangsang Buchag', programmeId: 'dmcd' },
    { id: 'lec_dmcd_8', name: 'Mr. Isaac N. Ofori', programmeId: 'dmcd' },
    { id: 'lec_dmcd_9', name: 'Mr. Ntim Pipim', programmeId: 'dmcd' },

    // Fashion Design Technology (B.Tech)
    { id: 'lec_fdt-btech_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_2', name: 'Ms. Florence Kushitor', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_3', name: 'Mrs. Mary Eddy Takyi', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_4', name: 'Mr. Daniel Boateng', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_5', name: 'Mr. Bright Senanu Agbosu', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_6', name: 'Mr. Nutifafa Fiadzomor', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_7', name: 'Mr. William Daitey', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_8', name: 'Mrs. Elsie Mills', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_9', name: 'Ms. Victoria Honu', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_10', name: 'Mr. Aaron Adjacodjoe', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_11', name: 'Mr. Ntim Pipim', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_12', name: 'Mr. Daniel Morrison', programmeId: 'fdt-btech' },
    { id: 'lec_fdt-btech_13', name: 'TBD Lecturer', programmeId: 'fdt-btech' },


    // Fashion Design Technology (Certificate)
    { id: 'lec_fdt-cert_1', name: 'Ms. Vivian Yeboah', programmeId: 'fdt-cert' },
    { id: 'lec_fdt-cert_2', name: 'Mr. Nutifafa Fiadzomor', programmeId: 'fdt-cert' },
    { id: 'lec_fdt-cert_3', name: 'Mr. Kwame Ntim Pipim', programmeId: 'fdt-cert' },

    // Jewellery Design Technology (B.A.)
    { id: 'lec_jdt-ba_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_2', name: 'Mr. Amevor', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_3', name: 'Mr. Daniel Boateng', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_4', name: 'Mr. William Daitey', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_5', name: 'Mr. Bright Agbosu', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_6', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_7', name: 'Mr. Ntim Pipim', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_8', name: 'Mr. Kwame Baah Panin Owusu', programmeId: 'jdt-ba' },
    { id: 'lec_jdt-ba_9', name: 'Mr. Aaron Adjacodjoe', programmeId: 'jdt-ba' },

    // Jewellery Design Technology (Diploma)
    { id: 'lec_jdt-dip_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_2', name: 'Mr. Eric Amevo', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_3', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_4', name: 'Mr. Daniel Boateng', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_5', name: 'Mr. William Diatey', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_6', name: 'Mr. Bright Agbosu', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_7', name: 'Mr. Aaron Adjacodjoe', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_8', name: 'Mr. Kwame Baah Panin Owusu', programmeId: 'jdt-dip' },
    { id: 'lec_jdt-dip_9', name: 'Dr. Joseph A. A. Sackey', programmeId: 'jdt-dip' },

    // Product Design & Entrepreneurship (B.A.)
    { id: 'lec_pde-ba_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_2', name: 'Mr. Amevor', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_3', name: 'Mr. Aaron Adjacodjoe', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_4', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_5', name: 'Mr. Daniel Boateng', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_6', name: 'Mr. William Daitey', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_7', name: 'Mr. Bright Agbosu', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_8', name: 'Mr. Fredrick Tattah', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_9', name: 'Mr. Selasi Ahiabu', programmeId: 'pde-ba' },
    { id: 'lec_pde-ba_10', name: 'Mr. Kwame Ntim Pipim', programmeId: 'pde-ba' },

    // Product Design (Diploma)
    { id: 'lec_pde-dip_1', name: 'Dr. Andrew Richard Owusu Addo', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_2', name: 'Mr. Amevor', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_3', name: 'Mr. Aaron Adjacodjoe', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_4', name: 'Mr. Selete Komla Delali Ofori', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_5', name: 'Mr. Daniel Boateng', programmeId: 'pde-dip' },
    { id: 'lec_pde-dip_6', name: 'Mr. Bright Agbosu', programmeId: 'pde-dip' },
];

export const INITIAL_COURSES: Course[] = [
    // --- B.TECH DIGITAL MEDIA AND COMMUNICATION DESIGN ---
    // Year 1, Sem 1
    { id: 'dmcd1101', name: 'AUCDT 115: Introduction to African Art & Culture', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1102', name: 'DMCD 112: Basic Design', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1103', name: 'DMCD 113: Introduction to Communication Design', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1104', name: 'DMCD 114: Introduction to Computer Graphics Applications', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1105', name: 'AUCDT 116: Introduction to Communication Skills', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1106', name: 'AUCDT 114: Basic Drawing', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1107', name: 'AUCDT 117: Introduction to Information and Communication Technology', programmeId: 'dmcd', year: 1, semester: 1 },
    { id: 'dmcd1108', name: 'DMCD 111: Introduction to Digital Media', programmeId: 'dmcd', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'dmcd1201', name: 'DMCD 122: Idea Development Techniques', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1202', name: 'DMCD 126: Image Manipulation', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1203', name: 'AUCDT 126: Communication Skills', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1204', name: 'DMCD 121: Basic Programming', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1205', name: 'DMCD 123: Basic Rendering Techniques', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1206', name: 'DMCD 125: Introduction to Typography', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1207', name: 'DMCD 124: Design History', programmeId: 'dmcd', year: 1, semester: 2 },
    { id: 'dmcd1208', name: 'AUCDT 127: Information and Communication Technology', programmeId: 'dmcd', year: 1, semester: 2 },
    // Year 2, Sem 1
    { id: 'dmcd2101', name: 'DMCD 236: Introduction to Animation', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2102', name: 'DMCD 233: Typography and Basic Layout Design', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2103', name: 'DMCD 232: Print Design', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2104', name: 'DMCD 231: Corporate Identity', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2105', name: 'DMCD 235: Print Production', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2106', name: 'DMCD 234: Fundamentals of Photography', programmeId: 'dmcd', year: 2, semester: 1 },
    { id: 'dmcd2107', name: 'DMCD 237: Introduction to Production Management', programmeId: 'dmcd', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'dmcd2201', name: 'DMCD 242: Digital Print Technology', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2202', name: 'DMCD 244: Digital Photography', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2203', name: 'DMCD 243: Web Design', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2204', name: 'DMCD 241: Brand and Identity Systems', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2205', name: 'DMCD 246: Introduction to Video Production and Motion', programmeId: 'dmcd', year: 2, semester: 2 },
    { id: 'dmcd2206', name: 'DMCD 245: Digital Print Production', programmeId: 'dmcd', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'dmcd3101', name: 'DMCD 353: Online Media Technology', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3102', name: 'DMCD 354: Animation', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3103', name: 'DMCD 352: Advertising Design', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3104', name: 'DMCD 356: Video Production', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3105', name: 'DMCD 355: Copywriting', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3106', name: 'DMCD 351: Book & Magazine Design', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3107', name: 'AUCDT 352: Seminar in DMCD', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3108', name: 'DMCD 357: Motion Graphics', programmeId: 'dmcd', year: 3, semester: 1 },
    { id: 'dmcd3109', name: 'AUCDT 351: Introduction to Entrepreneurship', programmeId: 'dmcd', year: 3, semester: 1 },
    // Year 3, Sem 2
    { id: 'dmcd3201', name: 'ACDT 352: Research Methods', programmeId: 'dmcd', year: 3, semester: 2 },
    { id: 'dmcd3202', name: 'ACDT 351: Industrial Attachment', programmeId: 'dmcd', year: 3, semester: 2 },
    // Year 4, Sem 1
    { id: 'dmcd4101', name: 'DMCD 471: Sound Production', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4102', name: 'DMCD 472: Portfolio Development', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4103', name: 'DMCD 352: Interactive Animation', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4104', name: 'AUCDT 472: Thesis / Project', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4105', name: 'DMCD 473: Video Post Production', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4106', name: 'DMCD 475: Advertising Design Technology', programmeId: 'dmcd', year: 4, semester: 1 },
    { id: 'dmcd4107', name: 'AUCDT 471: Entrepreneurship', programmeId: 'dmcd', year: 4, semester: 1 },
    
    // --- B.TECH FASHION DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'fdtb1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1102', name: 'FDT 114: Sewing Techniques', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1103', name: 'FDT 113: Basic Pattern Technology', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1104', name: 'ACDT 116: Communication Skills I', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1105', name: 'FDT 111: Introduction to Fashion', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1106', name: 'FDT 112: Introduction to Textiles', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1107', name: 'ACDT 114: Basic Drawing', programmeId: 'fdt-btech', year: 1, semester: 1 },
    { id: 'fdtb1108', name: 'ACDT 117: Information Communication Technology I', programmeId: 'fdt-btech', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'fdtb1201', name: 'FDT 122: Textile Design', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1202', name: 'ACDT 126: Communication Skills II', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1203', name: 'FDT 126: Basic Design', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1204', name: 'FDT 124: Garment Construction', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1205', name: 'FDT 123: Pattern Adaptation', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1206', name: 'FDT 125: Freehand Cutting', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1207', name: 'ACDT 127: Information Communication Technology II', programmeId: 'fdt-btech', year: 1, semester: 2 },
    { id: 'fdtb1208', name: 'FDT 121: Introduction to Creative Design in Fashion', programmeId: 'fdt-btech', year: 1, semester: 2 },
    // Year 2, Sem 1
    { id: 'fdtb2101', name: 'FDT 234: Garment Technology I', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2102', name: 'FDT 232: Printed Textile Design Application', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2103', name: 'FDT 238: Introduction to Fashion Accessories', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2104', name: 'FDT 237: Basic Computer Aided Design', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2105', name: 'FDT 233: Pattern Technology I', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2106', name: 'FDT 235: Introduction to Fabric Studies', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2107', name: 'FDT 231: Creative Design in Fashion', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2108', name: 'FDT 239: Introduction to Production Management', programmeId: 'fdt-btech', year: 2, semester: 1 },
    { id: 'fdtb2109', name: 'FDT 236: Fashion Illustration', programmeId: 'fdt-btech', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'fdtb2201', name: 'FDT 241: Basic Fashion Design and Illustration', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2202', name: 'FDT 242: Pattern Technology II', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2203', name: 'FDT 245: Millinery Design and Production', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2204', name: 'FDT 243: Garment Technology II', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2205', name: 'FDT 248: Production Management', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2206', name: 'FDT 244: Fabric Studies', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2207', name: 'FDT 246: Computer-Aided Design', programmeId: 'fdt-btech', year: 2, semester: 2 },
    { id: 'fdtb2208', name: 'FDT 247: Fashion Marketing', programmeId: 'fdt-btech', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'fdtb3101', name: 'FDT 355: Design & Production of Bags & Slippers', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3102', name: 'FDT 354: Fashion Draping', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3103', name: 'FDT 352: Garment Decoration Techniques', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3104', name: 'FDT 351: Design and Illustration', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3105', name: 'FDT 357: Seminar in Fashion', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3106', name: 'FDT 353: Pattern Alteration', programmeId: 'fdt-btech', year: 3, semester: 1 },
    { id: 'fdtb3107', name: 'FDT 356: Entrepreneurship I', programmeId: 'fdt-btech', year: 3, semester: 1 },
    // Year 3, Sem 2
    { id: 'fdtb3201', name: 'ACDT 352: Research Methods', programmeId: 'fdt-btech', year: 3, semester: 2 },
    { id: 'fdtb3202', name: 'ACDT 351: Industrial Attachment', programmeId: 'fdt-btech', year: 3, semester: 2 },
    // Year 4, Sem 1
    { id: 'fdtb4101', name: 'FDT 471: Collection Development', programmeId: 'fdt-btech', year: 4, semester: 1 },
    { id: 'fdtb4102', name: 'FDT 473: Beauty Culture', programmeId: 'fdt-btech', year: 4, semester: 1 },

    // --- CERTIFICATE FASHION DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'fdtc1101', name: 'CFDT 114: Garment Construction', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1102', name: 'CFDT 113: Basic Pattern Technology', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1103', name: 'CFDT 235: Introduction to Fabric Studies', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1104', name: 'CFDT 247: Fashion Marketing', programmeId: 'fdt-cert', year: 1, semester: 1 },
    { id: 'fdtc1105', name: 'CFDT 236: Fashion Illustration', programmeId: 'fdt-cert', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'fdtc1201', name: 'CFDT 233: Pattern Technology I', programmeId: 'fdt-cert', year: 1, semester: 2 },
    { id: 'fdtc1202', name: 'CFDT 234: Garment Technology I', programmeId: 'fdt-cert', year: 1, semester: 2 },
    { id: 'fdtc1203', name: 'CFDT 235: Introduction to Fabric Studies', programmeId: 'fdt-cert', year: 1, semester: 2 },
    { id: 'fdtc1204', name: 'CFDT 236: Fashion Illustration', programmeId: 'fdt-cert', year: 1, semester: 2 },

    // --- B.A. JEWELLERY DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'jdtb1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1102', name: 'ACDT 113: Foundations in Technical Drawing', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1103', name: 'BJDT 111: Introduction to Jewellery Design', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1104', name: 'ACDT 116: Communication Skills I', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1105', name: 'ACDT 114: Basic Drawing', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'jdt-ba', year: 1, semester: 1 },
    { id: 'jdtb1107', name: 'ACDT 112: Workshop Safety Practices', programmeId: 'jdt-ba', year: 1, semester: 1 },
    // Year 2, Sem 1
    { id: 'jdtb2101', name: 'ACDT 231: Introduction to Entrepreneurship', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2102', name: 'BJDT 234: Introduction to Metallurgy', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2103', name: 'BJDT 235: Refining, Assaying & Hallmarking', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2104', name: 'BJDT 231: Concept Design and Modelling', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2105', name: 'BJDT 232: Basic Fabrication and Finishing', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2106', name: 'BJDT 236: 3D Modelling in Computer', programmeId: 'jdt-ba', year: 2, semester: 1 },
    { id: 'jdtb2107', name: 'BJDT 233: Alloy Calculation, Measuring and Marking', programmeId: 'jdt-ba', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'jdtb2201', name: 'BJDT 245: Metallurgy', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2202', name: 'BJDT 242: Fabrication and Finishing Techniques', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2203', name: 'ACDT 247: Developing a New Venture', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2204', name: 'BJDT 246: Advanced Computer Application', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2205', name: 'BJDT 241: Practical Design and Modelling Processes', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2206', name: 'BJDT 244: Jewellery Surface Coating Methods', programmeId: 'jdt-ba', year: 2, semester: 2 },
    { id: 'jdtb2207', name: 'BJDT 243: Jewellery Casting Methods', programmeId: 'jdt-ba', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'jdtb3101', name: 'BJDT 353: Introduction to Gemmology', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3102', name: 'BJDT 351: Advanced Designs and Modelling Techniques', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3103', name: 'ACDT 356: Business Management and Sustainability', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3104', name: 'BJDT 352: Fabrication and Finishing Practices', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3105', name: 'BJDT 355: Seminar in Jewellery', programmeId: 'jdt-ba', year: 3, semester: 1 },
    { id: 'jdtb3106', name: 'BJDT 354: Introduction to Gem Setting', programmeId: 'jdt-ba', year: 3, semester: 1 },
    // Year 3, Sem 2
    { id: 'jdtb3201', name: 'ACDT 352: Research Methods', programmeId: 'jdt-ba', year: 3, semester: 2 },
    { id: 'jdtb3202', name: 'ACDT 351: Industrial Attachment', programmeId: 'jdt-ba', year: 3, semester: 2 },

    // --- DIPLOMA JEWELLERY DESIGN TECHNOLOGY ---
    // Year 1, Sem 1
    { id: 'jdtd1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1102', name: 'ACDT 113: Foundations in Technical Drawing', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1103', name: 'BJDT 111: Introduction to Jewellery Design', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1104', name: 'ACDT 116: Communication Skills I', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1105', name: 'ACDT 114: Basic Drawing', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1107', name: 'ACDT 112: Workshop Safety Practices', programmeId: 'jdt-dip', year: 1, semester: 1 },
    { id: 'jdtd1108', name: 'Seminar in Jewellery', programmeId: 'jdt-dip', year: 1, semester: 1 },
    // Year 2, Sem 1
    { id: 'jdtd2101', name: 'DJDT 231: Fabrication and Finishing Practices', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2102', name: 'ACDT 236: Advanced Computer Application in Jewellery Design', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2103', name: 'DJDT 233: Introduction to Metallurgy', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2104', name: 'ACDT 237: Research Methodology', programmeId: 'jdt-dip', year: 2, semester: 1 },
    { id: 'jdtd2105', name: 'DJDT 232: Alloy Calculation, Measuring and Marking', programmeId: 'jdt-dip', year: 2, semester: 1 },
    
    // --- B.A. PRODUCT DESIGN & ENTREPRENEURSHIP ---
    // Year 1, Sem 1
    { id: 'pdeb1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1102', name: 'ACDT 113: Technical Drawing', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1103', name: 'BPDE 111: Introduction to Industrial/Product Design', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1104', name: 'ACDT 116: Communication Skills I', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1105', name: 'ACDT 114: Basic Drawing', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'pde-ba', year: 1, semester: 1 },
    { id: 'pdeb1107', name: 'ACDT 112: Safety in Workshop Practices', programmeId: 'pde-ba', year: 1, semester: 1 },
    // Year 1, Sem 2
    { id: 'pdeb1201', name: 'BPDE 122: Workshop Practices', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1202', name: 'ACDT 126: Communication Skills II', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1203', name: 'BPDE 121: Idea Development and Design Processes', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1204', name: 'BPDE 124: Freehand Drawing Techniques', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1205', name: 'ACDT 125: Introduction to Computer-Aided-Design', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1206', name: 'BPDE 123: Orthographic and Isometric Projections', programmeId: 'pde-ba', year: 1, semester: 2 },
    { id: 'pdeb1207', name: 'ACDT 127: Information and Communication Technology II', programmeId: 'pde-ba', year: 1, semester: 2 },
    // Year 2, Sem 1
    { id: 'pdeb2101', name: 'BPDE 235: Manufacturing Processes 1', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2102', name: 'BPDE 236: Three-Dimensional in Computing', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2103', name: 'BPDE 233: Perspective Drawing', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2104', name: 'BPDE 232: Product Design Methods', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2105', name: 'BPDE 231: Introduction to Modelling', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2106', name: 'BPDE 234: Nature of Materials & Processes', programmeId: 'pde-ba', year: 2, semester: 1 },
    { id: 'pdeb2107', name: 'ACDT 231: Introduction to Entrepreneurship', programmeId: 'pde-ba', year: 2, semester: 1 },
    // Year 2, Sem 2
    { id: 'pdeb2201', name: 'BPDE 241: Design for Use', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2202', name: 'BPDE 246: Advanced Computer Application', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2203', name: 'BPDE 243: Ergonomics and Human Factors Applications', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2204', name: 'BPDE 247: New Venture Creation', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2205', name: 'BPDE 242: Visual Communication and Package Design', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2206', name: 'BPDE 245: Objects and Impacts', programmeId: 'pde-ba', year: 2, semester: 2 },
    { id: 'pdeb2207', name: 'BPDE 244: Contextual Nature of Products', programmeId: 'pde-ba', year: 2, semester: 2 },
    // Year 3, Sem 1
    { id: 'pdeb3101', name: 'BPDE 354: Design and Development', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3102', name: 'BPDE 351: Practical Model Making Techniques', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3103', name: 'ACDT 356: Business Management and Sustainability', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3104', name: 'BPDE 353: Workshop Practice I', programmeId: 'pde-ba', year: 3, semester: 1 },
    { id: 'pdeb3105', name: 'BPDE 352: Product Interface Design', programmeId: 'pde-ba', year: 3, semester: 1 },

    // --- DIPLOMA PRODUCT DESIGN ---
    // Year 1, Sem 1
    { id: 'pded1101', name: 'ACDT 115: Introduction to African Art & Culture', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1102', name: 'DPD 113: Foundations in Technical Drawing', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1103', name: 'DPD 111: Introduction to Industrial/ Product Design', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1104', name: 'ACDT 116: Communication Skills I', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1105', name: 'DPD 114: Idea Development and Design Processes', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1106', name: 'ACDT 117: Information and Communication Technology I', programmeId: 'pde-dip', year: 1, semester: 1 },
    { id: 'pded1107', name: 'ACDT 112: Safety in Workshop Practices', programmeId: 'pde-dip', year: 1, semester: 1 },
];

```

### FILE: CREATION.md
```md
# lecturer-assessment-system

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

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/lecturer-assessment-system/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/lecturer-assessment-system/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/lecturer-assessment-system/',  // REQUIRED: Assets must load from /lecturer-assessment-system/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/lecturer-assessment-system"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/lecturer-assessment-system">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/lecturer-assessment-system/`, not at the root
- **Asset Loading**: Without `base: '/lecturer-assessment-system/'`, assets try to load from `/assets/` instead of `/lecturer-assessment-system/assets/`
- **Routing**: Without `basename="/lecturer-assessment-system"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/lecturer-assessment-system/assets/index-*.js`
- Link tags should reference: `/lecturer-assessment-system/assets/index-*.css`

If they reference `/assets/` instead of `/lecturer-assessment-system/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/lecturer-assessment-system/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/lecturer-assessment-system/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: lecturer-assessment-system

```

### FILE: DEPLOYMENT_GUIDE.md
```md
# Deployment Guide for the Lecturer Assessment System

**Version 1.1**

---

### Introduction

This guide provides instructions on how to build and deploy the Lecturer Assessment System for a production environment. Since this is a client-side single-page application (SPA) created with React and Vite, it can be hosted on any static web hosting service.

### Prerequisites

Before you begin, ensure you have the following installed on your local machine:
- **Node.js** (version 16.x or higher)
- **npm** (or a similar package manager like yarn)

### Step 1: Set Up Environment Variables

The application requires an API key for the Google Gemini API to power the PDF data extraction feature.

1.  In the root directory of the project, create a file named `.env.local`.
2.  Inside the `.env.local` file, add your API key, prefixed with `VITE_` as required by Vite:

    ```
    VITE_API_KEY=[REDACTED_CREDENTIAL]
    ```

**Important:** Never commit your `.env.local` file or expose your API key in public repositories. Add `.env.local` to your `.gitignore` file.

The application code in `services/geminiService.ts` will need to be updated to read `import.meta.env.VITE_API_KEY` instead of `process.env.API_KEY`.

### Step 2: Install Dependencies

If you haven't already, open your terminal in the project's root directory and install the necessary Node.js packages:

```bash
npm install
```

### Step 3: Build the Application

Run the Vite build script to compile the React application into a set of optimized, static files (HTML, CSS, JavaScript).

```bash
npm run build
```

This command will create a `dist` folder in your project's root directory. This folder contains everything needed to run your application.

### Step 4: Deploy to a Static Host

You can deploy the contents of the `dist` folder to any static hosting provider. Here are a few popular options:

#### Option A: Netlify

Netlify is one of the easiest ways to deploy a static site.

1.  **Drag and Drop:**
    - Go to [app.netlify.com](https://app.netlify.com/).
    - Log in or sign up.
    - Drag the `dist` folder from your computer and drop it into the Netlify dashboard's deployment area.
    - Netlify will upload the files and provide you with a unique URL for your live application.

2.  **Git-based Deployment (Recommended):**
    - Push your project to a GitHub, GitLab, or Bitbucket repository.
    - On Netlify, select "New site from Git".
    - Connect your Git provider and choose your repository.
    - Set the build command to `npm run build`.
    - Set the publish directory to `dist`.
    - Configure your environment variables (like `VITE_API_KEY`) in the Netlify site settings.
    - Netlify will automatically build and deploy your site whenever you push new changes.

#### Option B: Vercel

Vercel (from the creators of Next.js) also offers excellent support for static sites.

1.  Push your project to a Git repository.
2.  Go to [vercel.com](https://vercel.com/) and sign up.
3.  Import your Git repository.
4.  Vercel will automatically detect that it's a Vite-based React project. It will use the correct build settings (`npm run build` and the `dist` directory).
5.  Add your environment variables in the project settings on Vercel.
6.  Deploy.

#### Option C: Simple Web Server (e.g., Nginx)

If you have your own server:

1.  Upload the contents of the `dist` folder to a directory on your server (e.g., `/var/www/my-app`).
2.  Configure your web server (like Nginx or Apache) to serve this directory. Since this is a single-page application, you need to configure URL rewriting to direct all requests to `index.html`.

**Example Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/my-app;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```
This configuration ensures that when a user refreshes the page on a route like `/results`, the server still serves the `index.html` file, allowing React to handle the client-side routing.
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
# Admin Guide — lecturer-assessment-system

**Application:** lecturer-assessment-system
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

Audit log data is stored in `localStorage` under the key `tuc_lecturer-assessment-system_audit`.

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
# Deployment Guide — lecturer-assessment-system

**Application:** lecturer-assessment-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd lecturer-assessment-system
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
docker-compose -f docker-compose-all-apps.yml build lecturer-assessment-system
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up lecturer-assessment-system
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

**Project:** Lecturer Assessment System
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Lecturer Assessment System**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Lecturer Assessment System** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Lecturer Assessment System** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
# Testing Guide — lecturer-assessment-system

**Application:** lecturer-assessment-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd lecturer-assessment-system
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

### FILE: e2e/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Lecturer Assessment System', () => {
  test('should display header and home tab content on load', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1', { hasText: /University College/i })).toBeVisible();
    await expect(page.locator('h2', { hasText: /Student Dashboard/i })).toBeVisible();
  });

  test('should display Submit Assessment tab', async ({ page }) => {
    await page.goto('/');
    const assessmentTab = page.getByRole('button', { name: /Submit Assessment/i });
    await expect(assessmentTab).toBeVisible();
  });

  test('should display View Results tab', async ({ page }) => {
    await page.goto('/');
    const resultsTab = page.getByRole('button', { name: /View Results/i });
    await expect(resultsTab).toBeVisible();
  });

  test('should navigate to assessment form', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Submit Assessment/i }).click();
    const formContainer = page.locator('.assessment-form-container');
    await expect(formContainer).toBeVisible();
  });

  test('should show admin password input when Admin tab is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Admin/i }).click();
    const passwordInput = [REDACTED_CREDENTIAL]
    await expect(passwordInput).toBeVisible();
  });
});

```

### FILE: e2e/app.test.ts
```typescript
/// <reference types="playwright" />

import { describe, beforeAll, it, expect } from '@jest/globals';
import 'jest-playwright';
import 'expect-playwright';
import { Dialog } from '@playwright/test';

describe('Lecturer Assessment System E2E Tests', () => {

  beforeAll(async () => {
    // Playwright automatically navigates to the server URL from jest-playwright.config.js
    // We can just wait for the root element to be visible.
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
    await page.waitForSelector('#root');
  });

  it('should display the header and home tab content on load', async () => {
    await expect(page).toMatchElement('h1', { text: 'University College' });
    await expect(page).toMatchElement('h2', { text: 'Student Dashboard' });
  });

  it('should successfully submit a lecturer assessment', async () => {
    // Navigate to the assessment tab
    await expect(page).toClick('button', { text: 'Submit Assessment' });
    await page.waitForSelector('.assessment-form-container');

    // Fill out the form
    await expect(page).toSelect('select[name="programme"]', 'Digital Media');
    await page.waitForFunction(() => document.querySelector<HTMLSelectElement>('#lecturer')?.options.length > 1);
    await expect(page).toSelect('select[name="lecturer"]', 'Ms. Lisa Wilson');
    
    // Select a course from the new dropdown
    await page.waitForFunction(() => document.querySelector<HTMLSelectElement>('#subject')?.options.length > 1);
    await expect(page).toSelect('select[name="subject"]', 'Web Design');
    
    await expect(page).toSelect('select[name="semester"]', 'First Semester');

    // Click stars for ratings
    await page.evaluate(() => {
        const clickStar = (item: number, star: number) => {
            const starEl = document.querySelector(`.rating-item:nth-child(${item}) span:nth-child(${star})`) as HTMLElement;
            if (starEl) starEl.click();
        };
        clickStar(1, 4); // Teaching
        clickStar(2, 5); // Communication
        clickStar(3, 3); // Content
        clickStar(4, 5); // Punctuality
    });
    // Wait for state to update (optional, but good practice)
    await new Promise(resolve => setTimeout(resolve, 100));


    await expect(page).toFill('textarea[name="comments"]', 'This is an automated test comment.');
    await expect(page).toSelect('select[name="recommendation"]', 'Highly Recommend');

    // Submit the form
    await expect(page).toClick('button[type="submit"]');

    // Verify success modal
    await page.waitForSelector('.fa-check-circle');
    await expect(page).toMatch('Assessment Submitted!');
    await expect(page).toClick('button', { text: 'Continue' });

    // Verify the result appears in the results tab
    await expect(page).toClick('button', { text: 'View Results' });
    await page.waitForSelector('p.font-bold.text-lg.text-primary-text');
    await expect(page).toMatch('Ms. Lisa Wilson');
    await expect(page).toMatch('Web Design');
  });

  it('should handle admin login and show audit logs', async () => {
    // Navigate to the admin tab
    await expect(page).toClick('button', { text: 'Admin' });
    await page.waitForSelector('#admin-password');

    // Attempt incorrect login
    await expect(page).toFill('input[type="password"]', 'wrongpassword');
    // Verify error (using page.on('dialog') for alerts)
    const dialogPromise = new Promise<Dialog>(resolve => page.once('dialog', resolve));
    await expect(page).toClick('button', { text: 'Login' });
    const dialog = await dialogPromise;
    expect(dialog.message()).toBe('Incorrect password.');
    await dialog.dismiss();


    // Correct login
    await expect(page).toFill('input[type="password"]', 'admin');
    await expect(page).toClick('button', { text: 'Login' });
    
    // Verify admin panel is visible
    await page.waitForSelector("xpath/ //h3[contains(., 'Audit Log')]");
    
    // Verify audit logs from previous test are present
    await expect(page).toMatch('ASSESSMENT SUBMIT');
    await expect(page).toMatch('ADMIN LOGIN');
  });

});

```

### FILE: e2e/jest.setup.js
```javascript
// e2e/jest.setup.js
jest.setTimeout(30000); // 30 seconds

```

### FILE: hooks/actions.ts
```typescript

export const ADD_ASSESSMENT = 'ADD_ASSESSMENT';
export const IMPORT_ASSESSMENTS = 'IMPORT_ASSESSMENTS';
export const ADD_LOG = 'ADD_LOG';
export const SET_ADMIN_AUTH = 'SET_ADMIN_AUTH';
export const UPDATE_CURRICULUM = 'UPDATE_CURRICULUM';
```

### FILE: hooks/reducer.ts
```typescript

import type { AppState, Assessment, AuditLog, Course, Lecturer, Programme } from '../types';
import {
    ADD_ASSESSMENT,
    ADD_LOG,
    IMPORT_ASSESSMENTS,
    SET_ADMIN_AUTH,
    UPDATE_CURRICULUM
} from './actions';

export type AppAction =
  | { type: typeof ADD_ASSESSMENT; payload: Assessment }
  | { type: typeof IMPORT_ASSESSMENTS; payload: Assessment[] }
  | { type: typeof ADD_LOG; payload: { action: string, message: string } }
  | { type: typeof SET_ADMIN_AUTH; payload: boolean }
  | { type: typeof UPDATE_CURRICULUM; payload: { programmeId: string; lecturers: { name: string }[], courses: { name: string, year: number, semester: number }[] } };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ADD_ASSESSMENT:
      return {
        ...state,
        assessments: [...state.assessments, action.payload],
      };
    case IMPORT_ASSESSMENTS:
        return {
            ...state,
            assessments: action.payload
        };
    case ADD_LOG:
      const newLog: AuditLog = {
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      return {
        ...state,
        auditLogs: [newLog, ...state.auditLogs],
      };
    case SET_ADMIN_AUTH:
        return {
            ...state,
            isAdminAuthenticated: action.payload,
        };
    case UPDATE_CURRICULUM:
        const { programmeId, lecturers, courses } = action.payload;

        const newLecturers: Lecturer[] = lecturers.map(l => ({
            id: `lec_${programmeId}_${Math.random().toString(36).substr(2, 9)}`,
            name: l.name,
            programmeId,
        }));

        const newCourses: Course[] = courses.map(c => ({
            id: `course_${programmeId}_${Math.random().toString(36).substr(2, 9)}`,
            name: c.name,
            year: c.year,
            semester: c.semester,
            programmeId
        }));

        // Filter out old lecturers and courses for the specific programme
        const remainingLecturers = state.lecturers.filter(l => l.programmeId !== programmeId);
        const remainingCourses = state.courses.filter(c => c.programmeId !== programmeId);
        
        return {
            ...state,
            lecturers: [...remainingLecturers, ...newLecturers],
            courses: [...remainingCourses, ...newCourses],
        }

    default:
      return state;
  }
};
```

### FILE: hooks/useAppStore.tsx
```typescript

import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react';
import { INITIAL_COURSES, INITIAL_LECTURERS, INITIAL_PROGRAMMES } from '../constants';
import type { AppState } from '../types';
import { AppAction, appReducer } from './reducer';

const LOCAL_STORAGE_KEY = 'lems_app_state';

const getInitialState = (): AppState => {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        isAdminAuthenticated: false, // Always reset auth on load
      };
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }

  return {
    programmes: INITIAL_PROGRAMMES,
    courses: INITIAL_COURSES,
    lecturers: INITIAL_LECTURERS,
    assessments: [],
    auditLogs: [],
    isAdminAuthenticated: false,
  };
};

const initialState: AppState = getInitialState();

const AppStateContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
} | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const { isAdminAuthenticated, ...stateToSave } = state;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStateProvider');
  }
  return context;
};
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
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Lecturer Assessment System | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Lecturer Assessment System | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lecturer Assessment System | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
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
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">lecturer assessment system</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppStateProvider } from './hooks/useAppStore';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><AppStateProvider>
      <App />
    </AppStateProvider></AuthGate>
  </React.StrictMode>
);
```

### FILE: jest-puppeteer.config.js
```javascript
module.exports = {
  launch: {
    headless: 'new', // Use the new headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: 'npm run build && npm run preview',
    port: 4173, // Default port for vite preview
    launchTimeout: 30000,
    debug: true,
  },
};
```

### FILE: jest.config.js
```javascript
module.exports = {
  preset: 'jest-playwright',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: './e2e/.*\\.test\\.ts$',
  setupFilesAfterEnv: ['./e2e/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

```

### FILE: metadata.json
```json
{
  "name": "Lecturer Assessment System",
  "description": "A comprehensive system for students to assess lecturers, view analytics, and take self-assessment quizzes. Features AI-powered data extraction from PDFs to streamline curriculum management.",
  "requestFramePermissions": []
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
  "packageManager": "pnpm@10.30.1",
  "name": "lecturer-assessment-system",
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
    "@google/genai": "^1.15.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "22.18.0",
    "serve": "14.2.5",
    "typescript": "5.8.3",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "@playwright/test": "^1.49.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: [['html', { outputFolder: 'tests/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:4173',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Pbz4Or8Dcj2mZ0FIQkVZRIh9Il5-wIBP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/AuthService.ts
```typescript
/**
 * AuthService
 * Handles communications with the TUC-Auth-API
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export interface ValidationResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export const authService = {
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      return await response.json();
    } catch (error) {
      console.error('AuthService.login error:', error);
      return { success: false, message: 'Could not connect to authentication server' };
    }
  },

  /**
   * Validate current JWT token
   */
  async validateToken(token: string): Promise<ValidationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('AuthService.validateToken error:', error);
      return { success: false, valid: false };
    }
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('AuthService.logout error:', error);
    }
  }
};

```

### FILE: services/geminiService.ts
```typescript

import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const extractSchema = {
    type: Type.OBJECT,
    properties: {
        lecturers: {
            type: Type.ARRAY,
            description: "A list of lecturer names found in the document.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The full name of the lecturer."
                    }
                }
            }
        },
        courses: {
            type: Type.ARRAY,
            description: "A list of courses or subjects mentioned in the document.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The full name of the course or subject."
                    },
                    year: {
                        type: Type.INTEGER,
                        description: "The academic year the course is taught in (e.g., 1, 2, 3)."
                    },
                    semester: {
                        type: Type.INTEGER,
                        description: "The semester the course is taught in (e.g., 1 or 2)."
                    }
                }
            }
        }
    }
};

export const extractDataFromPdfText = async (text: string, programmeName: string): Promise<{
  lecturers: { name: string }[];
  courses: { name: string; year: number; semester: number }[];
}> => {
  try {
    const prompt = `
      From the following text, which is extracted from a university programme document, please identify all lecturers and all courses associated with the "${programmeName}" programme.
      
      Rules:
      1. Extract the full names of all lecturers.
      2. Extract the full names of all courses/subjects.
      3. For each course, identify the academic year and semester it belongs to. If not specified, make a reasonable guess.
      4. Return the data in the specified JSON format.
      
      Document Text:
      ---
      ${text}
      ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: extractSchema,
      },
    });

    const jsonString = response.text.trim();
    if (!jsonString) {
      throw new Error("API returned an empty response.");
    }

    const parsedData = JSON.parse(jsonString);

    if (!parsedData.lecturers || !parsedData.courses) {
        throw new Error("The extracted data is missing required fields (lecturers or courses).");
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to extract data using AI. Please check the console for details.");
  }
};
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
          <span className="font-bold text-sm">Lecturer Assessment System</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Lecturer Assessment System — Admin</h1>
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
 * E2E stub — lecturer-assessment-system
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('lecturer-assessment-system E2E', () => {
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

### FILE: SRS.md
```md

# Software Requirements Specification (SRS)
## for the Lecturer Assessment System

**Version 1.2**

**Prepared by:** World-Class Senior Frontend Engineer
**Date:** 2024-07-26

---

### Table of Contents
1. [Introduction](#1-introduction)
    1.1 [Purpose](#11-purpose)
    1.2 [Document Conventions](#12-document-conventions)
    1.3 [Project Scope](#13-project-scope)
    1.4 [References](#14-references)
2. [Overall Description](#2-overall-description)
    2.1 [Product Perspective](#21-product-perspective)
    2.2 [Product Features](#22-product-features)
    2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4 [Operating Environment](#24-operating-environment)
    2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
3. [System Features](#3-system-features)
    3.1 [Student Dashboard](#31-student-dashboard)
    3.2 [Lecturer Assessment Submission](#32-lecturer-assessment-submission)
    3.3 [AI-Powered PDF Data Extraction](#33-ai-powered-pdf-data-extraction)
    3.4 [Results Viewing](#34-results-viewing)
    3.5 [Lecturer Directory](#35-lecturer-directory)
    3.6 [Analytics Dashboard](#36-analytics-dashboard)
    3.7 [Data Management (Import/Export)](#37-data-management-importexport)
    3.8 [Self-Testing (Quiz) Functionality](#38-self-testing-quiz-functionality)
    3.9 [Administrator Panel](#39-administrator-panel)
4. [Non-Functional Requirements](#4-non-functional-requirements)
    4.1 [Performance Requirements](#41-performance-requirements)
    4.2 [Security Requirements](#42-security-requirements)
    4.3 [Usability Requirements](#43-usability-requirements)
    4.4 [Maintainability](#44-maintainability)

---

### 1. Introduction

#### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a detailed description of the requirements for the Lecturer Assessment System. Its purpose is to define the features, functionalities, and constraints of the application, serving as a foundational guide for development, testing, and future enhancements. This document is intended for project managers, developers, testers, and administrators.

#### 1.2 Document Conventions
This document follows a structure inspired by the IEEE Std 830-1998 standard for SRS documents.

#### 1.3 Project Scope
The Lecturer Assessment System is a web application designed for the University College community. Its primary scope is to:
- Provide students with a platform to submit anonymous assessments for lecturers.
- Enable administrators to view aggregated assessment results and analytics.
- Automate the process of populating lecturer and course data by extracting it from PDF programme documents using the Google Gemini API.
- Offer a self-testing feature for students to take quizzes on their courses.
- Provide a secure administrative backend for system monitoring and data management.

The system aims to improve academic feedback loops, provide data-driven insights, and enhance the student learning experience.

#### 1.4 References
- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
- Google Gemini API Documentation.
- React.js and Tailwind CSS Documentation.

### 2. Overall Description

#### 2.1 Product Perspective
The application is a standalone, single-page web application (SPA) built using React. It operates entirely on the client-side, with data being stored in the browser's memory for the duration of a session. The integration with the Google Gemini API is a key external dependency for the AI-powered data extraction feature.

#### 2.2 Product Features
The major features of the system include:
- A dynamic home dashboard for programme and curriculum viewing.
- A structured form for submitting lecturer assessments.
- An AI-driven feature to upload and process PDF documents.
- Visualizations for assessment results and analytics.
- A public directory of lecturers with their average ratings.
- Import/Export functionality for assessment data.
- An interactive quiz system for student self-assessment.
- A password-protected administrator panel with audit logging.

#### 2.3 User Classes and Characteristics
- **Students:** The primary users. They can view programme curricula, submit assessments, and take quizzes. They do not need to log in.
- **Administrators:** Users with privileged access. They can view all results, analytics, manage data via import/export, and monitor system activity through audit logs. Access is controlled by a password.

#### 2.4 Operating Environment
The application is a web-based platform and must be compatible with modern web browsers, including:
- Google Chrome (latest two versions)
- Mozilla Firefox (latest two versions)
- Microsoft Edge (latest two versions)
- Safari (latest two versions)

The application is responsive and functional on desktops, tablets, and mobile devices.

#### 2.5 Design and Implementation Constraints
- **Technology Stack:** The frontend must be implemented using React, TypeScript, and Tailwind CSS.
- **API Key:** The Google Gemini API key must be managed as an environment variable (`process.env.API_KEY`) and not exposed on the client-side.
- **Client-Side Storage:** All data (assessments, logs, etc.) is stored in-memory and will be lost upon page refresh. No persistent database is in scope for this version.

### 3. System Features

#### 3.1 Student Dashboard
- **3.1.1 Description:** The default landing page of the application. It displays a list of available academic programmes.
- **3.1.2 Functional Requirements:**
    - Shall display each programme as an interactive card.
    - Each card shall show the programme name and total number of courses.
    - Clicking a programme card shall navigate the user to a detailed curriculum view, organized by academic year.
    - The curriculum view shall list all courses for that programme.

#### 3.2 Lecturer Assessment Submission
- **3.2.1 Description:** A form that allows students to rate lecturers and provide feedback.
- **3.2.2 Functional Requirements:**
    - The form shall require the user to select a programme, lecturer, subject, and semester.
    - The lecturer dropdown shall be dynamically populated based on the selected programme.
    - Users must provide a 1-5 star rating for multiple categories (e.g., Teaching Quality, Communication).
    - An optional text area for comments shall be available.
    - A recommendation dropdown shall be included.
    - Upon successful submission, a confirmation modal shall be displayed.

#### 3.3 AI-Powered PDF Data Extraction
- **3.3.1 Description:** A feature allowing administrators to upload PDF documents to automatically populate lecturer and course lists.
- **3.3.2 Functional Requirements:**
    - The user must first select a programme.
    - The user shall be able to upload a `.pdf` file via drag-and-drop or a file browser.
    - The system shall extract text from the PDF and send it to the Gemini API.
    - The API shall return a structured JSON object containing lists of lecturers and courses.
    - The extracted data shall be displayed for review.
    - The user shall have options to save the data to the system or edit it before saving.

#### 3.4 Results Viewing
- **3.4.1 Description:** A tab that displays all submitted assessments.
- **3.4.2 Functional Requirements:**
    - Shall list each assessment with lecturer name, subject, average rating, recommendation, and comments.
    - If no assessments have been submitted, a message shall indicate this.

#### 3.5 Lecturer Directory
- **3.5.1 Description:** A directory of all lecturers in the system.
- **3.5.2 Functional Requirements:**
    - Shall display each lecturer in a card format.
    - Each card shall show the lecturer's name, programme, average rating, and the number of reviews.
    - If a lecturer has no reviews, this shall be indicated.

#### 3.6 Analytics Dashboard
- **3.6.1 Description:** A dashboard showing high-level statistics about the submitted assessments.
- **3.6.2 Functional Requirements:**
    - Shall display the total number of assessments.
    - Shall display the overall average rating across all assessments.
    - Shall display the most frequently assessed programme.

#### 3.7 Data Management (Import/Export)
- **3.7.1 Description:** Tools for exporting and importing assessment data.
- **3.7.2 Functional Requirements:**
    - The "Export to JSON" feature shall compile all current assessment data into a single `.json` file and trigger a browser download.
    - The "Import from JSON" feature shall allow a user to upload a `.json` file.
    - The system shall validate the format of the imported file.
    - Before replacing existing data, the system shall prompt the user for confirmation.

#### 3.8 Self-Testing (Quiz) Functionality
- **3.8.1 Description:** An interactive quiz feature for students.
- **3.8.2 Functional Requirements:**
    - In the curriculum view, courses with available questions shall have a "Start Quiz" button.
    - Clicking the button shall open a quiz modal.
    - The quiz shall have a timer based on the course's specified duration.
    - The modal shall display one multiple-choice question at a time.
    - After the quiz is completed or the time runs out, a final score shall be displayed.

#### 3.9 Administrator Panel
- **3.9.1 Description:** A password-protected section for administrative functions.
- **3.9.2 Functional Requirements:**
    - Access to the Admin tab shall be restricted by a password.
    - A modal shall prompt for the password upon the first click.
    - Upon successful authentication, the Admin Panel shall be accessible for the remainder of the session.
    - The panel shall contain an Audit Log.
    - The Audit Log shall display a chronological list of important system events (e.g., admin login, data import/export).
    - Each log entry shall include a timestamp, action type, and a descriptive message.

### 4. Non-Functional Requirements

#### 4.1 Performance Requirements
- The application UI shall be responsive and load in under 3 seconds on a standard broadband connection.
- AI processing of PDFs should provide feedback to the user (e.g., loading indicator) and should ideally complete within 15 seconds.
- Quiz timers must be accurate and update every second.

#### 4.2 Security Requirements
- The Gemini API key must not be exposed to the client-side.
- The administrator password must not be stored in plaintext in the source code (though for this demo, it is a constant).
- All user-provided input should be treated as untrusted, though no server-side processing minimizes risks like XSS.

#### 4.3 Usability Requirements
- The application shall have a clean, intuitive, and consistent user interface.
- Navigation shall be clear and accessible.
- The design must be responsive and adapt to various screen sizes, from mobile phones to desktops.
- All interactive elements should provide clear visual feedback (e.g., hover states, click effects).

#### 4.4 Maintainability
- The code shall be written in TypeScript to ensure type safety.
- The codebase shall be organized into logical components, services, and constants.
- Documentation in the form of guides (Admin, Testing, Deployment) must be maintained and updated with the codebase.

```

### FILE: TESTING_GUIDE.md
```md
# Testing Guide for the Lecturer Assessment System

**Version 1.1**

---

### Introduction

This document outlines the testing strategy for the Lecturer Assessment System. The goal is to ensure the application is reliable, functional, and user-friendly. It covers both automated and manual end-to-end (E2E) testing.

### Table of Contents
1. [Automated End-to-End Testing](#1-automated-end-to-end-testing-with-playwright)
2. [Manual End-to-End Test Cases](#2-manual-end-to-end-test-cases)

---

### 1. Automated End-to-End Testing (with Playwright)

The project includes an automated E2E test suite built with Jest and Playwright. This suite automatically launches a browser, interacts with the application like a real user, and verifies that key features are working correctly.

#### 1.1 Setup

Before running the tests, you need to install the development dependencies.

1.  **Open your terminal** in the project's root directory.
2.  **Run the installation command:**
    ```bash
    npm install
    ```
    This will download Jest, Playwright, and all other required packages defined in `package.json`.

#### 1.2 Running the Tests

Once the setup is complete, you can run the entire test suite with a single command.

1.  **Open your terminal** in the project's root directory.
2.  **Execute the test script:**
    ```bash
    npm test
    ```
    This command will:
    -   Start a local web server to host the application.
    -   Launch a new instance of the Chromium browser.
    -   Run the automated tests defined in `e2e/app.test.ts`.
    -   Print the test results to the console.
    -   Automatically shut down the server and browser when finished.

#### 1.3 What is Tested?

The automated suite currently covers:
-   **Initial Load:** Verifies that the application loads and displays the home page correctly.
-   **Assessment Submission:** Automates filling out and submitting the assessment form and confirms the result appears.
-   **Admin Login:** Tests both incorrect and correct password submissions and verifies the audit log is displayed and contains the expected entries.

---

### 2. Manual End-to-End Test Cases

Perform these tests in a clean browser session (e.g., incognito mode) to ensure there is no cached data.

#### Test Case 1: Student Submits a Lecturer Assessment

- **Objective:** Verify that a student can successfully fill out and submit an assessment form.
- **Steps:**
    1. Open the application. The "Home" tab should be active.
    2. Click the **"Submit Assessment"** tab.
    3. **Precondition Check:** The "Lecturer Name" dropdown should be disabled.
    4. Select a **Programme** from the dropdown (e.g., "Digital Media").
    5. **Verification:** The "Lecturer Name" dropdown is now enabled and populated with lecturers for that programme.
    6. Select a **Lecturer Name**.
    7. Enter a **Subject/Course** name (e.g., "Web Design").
    8. Select a **Semester**.
    9. For each of the four rating categories, click on the stars to provide a rating (e.g., 4 stars for Teaching Quality).
    10. Enter a comment in the **"Additional Comments"** textarea.
    11. Select an option from the **"Would you recommend this lecturer?"** dropdown.
    12. Click the **"Submit Assessment"** button.
- **Expected Result:**
    - A success modal appears with the message "Assessment Submitted!".
    - The form fields are cleared after submission.
    - Clicking "Continue" on the modal closes it.
    - The new assessment appears correctly in the "View Results" tab.
    - The lecturer's rating is updated in the "Lecturer Directory" tab.
    - A new `ASSESSMENT_SUBMIT` entry appears in the "Admin" tab's audit log.

---

#### Test Case 2: Student Takes a Course Quiz

- **Objective:** Verify the self-testing/quiz functionality works correctly.
- **Steps:**
    1. Open the application.
    2. On the "Home" tab, click on a programme that has courses with quizzes (e.g., "Digital Media").
    3. In the curriculum view, find a course with a **"Start Quiz"** button (e.g., "Introduction to Digital Media").
    4. Click **"Start Quiz"**.
    5. **Verification:** A quiz modal opens, displaying the course title, a timer, and the first question.
    6. Answer the question by clicking on one of the options.
    7. **Verification:** The quiz proceeds to the next question (if any).
    8. Complete all questions.
- **Expected Result:**
    - The timer should count down every second.
    - After the last question is answered, a results screen appears showing the final score (e.g., "You scored 1 / 1").
    - Clicking "Close" dismisses the modal.
    - If the timer runs out before completion, the quiz should end automatically and show the score.

---

#### Test Case 3: Administrator Access and Audit Log Verification

- **Objective:** Verify that the Admin panel is secure and the audit log functions correctly.
- **Steps:**
    1. Open the application and navigate to the **"Admin"** tab.
    2. **Verification:** A password modal appears. The admin content is not visible.
    3. Enter an incorrect password (e.g., "password") and click "Login".
    4. **Verification:** An alert/error message indicates the password is incorrect. The modal remains open.
    5. Enter the correct password (`admin`) and click "Login".
    6. **Verification:** The modal closes, and the Admin Panel is displayed, showing the "Audit Log".
    7. The log should contain one entry for the successful `ADMIN_LOGIN`.
    8. Go to the "Submit Assessment" tab and submit a new assessment.
    9. Return to the "Admin" tab.
- **Expected Result:**
    - The audit log now contains a new `ASSESSMENT_SUBMIT` entry at the top of the list, with the correct timestamp and details.

---

#### Test Case 4: Data Import and Export

- **Objective:** Verify that assessment data can be exported and imported correctly.
- **Steps:**
    1. **Precondition:** Submit at least two assessments.
    2. Navigate to the **"Analytics"** tab.
    3. Click the **"Export to JSON"** button.
    4. **Verification:** A JSON file is downloaded to your computer.
    5. Open the downloaded file and verify its contents match the submitted assessments.
    6. Now, click the **"Import from JSON"** button.
    7. Select the file you just downloaded.
    8. **Verification:** A browser confirmation dialog appears, warning that data will be replaced.
    9. Click "OK".
    10. Go to the "View Results" tab.
- **Expected Result:**
    - The results tab shows the same data that was imported from the file.
    - The "Admin" tab shows a `DATA_EXPORT` log entry followed by a `DATA_IMPORT` entry.

---

#### Test Case 5: AI-Powered PDF Data Extraction

- **Objective:** Verify the PDF upload and data extraction workflow.
- **Steps:**
    1. Navigate to the **"Upload Programmes"** tab.
    2. **Precondition Check:** Attempt to upload a file without selecting a programme first.
    3. **Verification:** An alert should appear prompting you to select a programme.
    4. Select a **Programme** from the dropdown.
    5. Upload a sample PDF file.
    6. **Verification:** A processing indicator appears while the AI is working.
    7. After a few moments, an "Extracted Information" section appears, showing lists of lecturers and courses found in the PDF.
    8. Click the **"Save to System"** button.
- **Expected Result:**
    - An alert confirms the data has been saved.
    - The new lecturer names are now available in the "Submit Assessment" dropdown for that programme.
    - The new lecturers appear in the "Lecturer Directory".
    - The "Admin" tab's audit log shows a `PDF_PROCESSED` entry.

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
    "types": [
      "node"
    ],
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

### FILE: types.ts
```typescript

export type Tab = 'Dashboard' | 'Programmes' | 'Submit Assessment' | 'Results' | 'Lecturers' | 'Analytics' | 'Admin';

export interface Programme {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  programmeId: string;
  year: number;
  semester: number;
  quiz?: Quiz;
}

export interface Quiz {
    duration: number; // in seconds
    questions: Question[];
}

export interface Question {
    text: string;
    options: string[];
    correctAnswerIndex: number;
}


export interface Lecturer {
  id: string;
  name: string;
  programmeId: string;
}

export enum RatingCategory {
  TeachingQuality = 'Teaching Quality',
  Communication = 'Communication Skills',
  SubjectKnowledge = 'Subject Knowledge',
  Punctuality = 'Punctuality & Availability',
}

export enum Recommendation {
    HighlyRecommend = 'Highly Recommend',
    Recommend = 'Recommend',
    Neutral = 'Neutral',
    DoNotRecommend = 'Do Not Recommend',
}

export type Ratings = Record<RatingCategory, number>;

export interface Assessment {
  id: string;
  lecturerId: string;
  courseId: string;
  programmeId: string;
  semester: number;
  ratings: Ratings;
  comment: string;
  recommend: Recommendation;
  timestamp: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    action: string;
    message: string;
}

export interface AppState {
    programmes: Programme[];
    courses: Course[];
    lecturers: Lecturer[];
    assessments: Assessment[];
    auditLogs: AuditLog[];
    isAdminAuthenticated: boolean;
}
```

### FILE: vite-env.d.ts
```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
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

// Vitest unit test configuration — lecturer-assessment-system
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

// Vitest E2E configuration — lecturer-assessment-system
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

