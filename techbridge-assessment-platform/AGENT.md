# techbridge-assessment-platform - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-assessment-platform.

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

### FILE: App.tsx
```typescript
import { Home, LogOut, Shield } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { initialProgrammeData } from './constants';
import { useAuditLog } from './hooks/useAuditLog';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuthService } from './services/AuthService';
import { Assessment, Programme, ProgrammeData, Results, View } from './types';

import AdminPanel from './components/AdminPanel';
import AssessmentPlayer from './components/AssessmentPlayer';
import LoginModal from './components/LoginModal';
import ProgrammeDashboard from './components/ProgrammeDashboard';
import ProgrammeDetail from './components/ProgrammeDetail';
import ResultsPage from './components/ResultsPage';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [programmeData, setProgrammeData] = useLocalStorage<ProgrammeData>('tuc-programme-data', initialProgrammeData);
    const { log, addLogEntry, setLog } = useAuditLog();

    const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
    const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
    const [results, setResults] = useState<Results | null>(null);
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(AuthService.isAuthenticated());

    // Validate stored token on mount
    useEffect(() => {
        const token = [REDACTED_CREDENTIAL]
        if (token) {
            fetch('http://localhost:5000/api/auth/validate', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (!data.valid) {
                        AuthService.logout();
                        setIsAdminLoggedIn(false);
                    }
                })
                .catch(() => {
                    // Backend unreachable — keep existing state, don't force logout
                });
        }
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setIsAdminLoggedIn(false);
        setView('dashboard');
        addLogEntry('ADMIN_LOGOUT', {});
    };

    const handleSetProgramme = (programme: Programme) => {
        setSelectedProgramme(programme);
        addLogEntry('VIEW_PROGRAMME', { programmeId: programme.id, programmeName: programme.name });
    };

    const handleSetAssessment = (assessment: Assessment) => {
        setSelectedAssessment(assessment);
        addLogEntry('SELECT_ASSESSMENT', { assessmentId: assessment.id, assessmentTitle: assessment.title });
    };

    const renderView = () => {
        if (view === 'login') {
            return <LoginModal 
                onLoginSuccess={() => {
                    setIsAdminLoggedIn(true);
                    setView('admin');
                    addLogEntry('ADMIN_LOGIN_SUCCESS', {});
                }} 
                onClose={() => setView('dashboard')}
            />
        }
        
        switch (view) {
            case 'admin':
                return isAdminLoggedIn ? <AdminPanel programmeData={programmeData} setProgrammeData={setProgrammeData} log={log} setLog={setLog} /> : <ProgrammeDashboard programmes={programmeData.programmes} setView={setView} setProgramme={handleSetProgramme} />;
            case 'programmeDetail':
                return selectedProgramme ? <ProgrammeDetail programme={selectedProgramme} setView={setView} setAssessment={handleSetAssessment} /> : <p>Programme not found.</p>;
            case 'assessment':
                return selectedAssessment ? <AssessmentPlayer assessment={selectedAssessment} questions={programmeData.questions[selectedAssessment.id] || []} setView={setView} setResults={setResults} addLogEntry={addLogEntry} /> : <p>Assessment not found.</p>;
            case 'results':
                return results ? <ResultsPage results={results} setView={setView} /> : <p>Results not available.</p>;
            case 'dashboard':
            default:
                return <ProgrammeDashboard programmes={programmeData.programmes} setView={setView} setProgramme={handleSetProgramme} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <header className="bg-white shadow-md w-full p-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center">
                    <img src="https://via.placeholder.com/40/8B1538/FFD700?text=TUC" alt="TUC Logo" className="h-10 mr-3" />
                    <h1 className="text-xl font-bold text-tuc-maroon">TUC Assessment Platform</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => setView('dashboard')} className="flex items-center px-4 py-2 rounded-full text-tuc-maroon hover:bg-tuc-gold-light transition-colors">
                        <Home className="w-5 h-5 mr-2" />
                        Home
                    </button>
                    {isAdminLoggedIn ? (
                        <>
                            <button type="button" onClick={() => setView('admin')} className="flex items-center px-4 py-2 rounded-full text-tuc-maroon hover:bg-tuc-gold-light transition-colors">
                                <Shield className="w-5 h-5 mr-2" />
                                Admin
                            </button>
                            <button type="button" onClick={handleLogout} className="flex items-center px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={() => { setView('login'); addLogEntry('ADMIN_LOGIN_ATTEMPT', {}); }} className="flex items-center px-4 py-2 rounded-full text-tuc-maroon hover:bg-tuc-gold-light transition-colors">
                            <Shield className="w-5 h-5 mr-2" />
                            Admin
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-grow p-6 md:p-10">
                {view !== 'login' && renderView()}
            </main>
            {view === 'login' && renderView()}

        </div>
    );
};

export default App;
```

### FILE: components/AdminPanel.tsx
```typescript
import { Download, FileText, RefreshCw, Trash2, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { initialProgrammeData } from '../constants';
import { LogEntry, ProgrammeData } from '../types';
import Modal from './ui/Modal';

interface AdminPanelProps {
    programmeData: ProgrammeData;
    setProgrammeData: React.Dispatch<React.SetStateAction<ProgrammeData>>;
    log: LogEntry[];
    setLog: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ programmeData, setProgrammeData, log, setLog }) => {
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState<'clearLog' | 'resetData' | null>(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportProgrammes = () => {
        const dataStr = JSON.stringify(programmeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-programmes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ text: 'TUC Programme data exported successfully.', type: 'success' });
    };

    const handleImportProgrammes = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    if (json.programmes && json.questions) {
                        setProgrammeData(json);
                        setMessage({ text: 'Programme data imported successfully.', type: 'success' });
                    } else {
                        throw new Error('Invalid file structure.');
                    }
                } catch (error: any) {
                    setMessage({ text: `Import failed: ${error.message}`, type: 'error' });
                }
            };
            reader.readAsText(file);
        } else {
            setMessage({ text: 'Please select a valid JSON file.', type: 'error' });
        }
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleExportLog = () => {
        const dataStr = JSON.stringify(log, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tuc-audit-log.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ text: 'Audit log exported successfully.', type: 'success' });
    };

    const performAction = () => {
        if (action === 'clearLog') {
            setLog([]);
            setMessage({ text: 'Audit log cleared.', type: 'success' });
        } else if (action === 'resetData') {
            setProgrammeData(initialProgrammeData);
            setMessage({ text: 'Programme data reset to default.', type: 'success' });
        }
        setShowModal(false);
        setAction(null);
    };

    const adminActions = [
        { label: 'Export Programme Data', icon: Download, action: handleExportProgrammes, color: 'blue' },
        { label: 'Import Programme Data', icon: Upload, action: () => fileInputRef.current?.click(), color: 'blue' },
        { label: 'Export Audit Log', icon: FileText, action: handleExportLog, color: 'green' },
        { label: 'Clear Audit Log', icon: Trash2, action: () => { setAction('clearLog'); setShowModal(true); }, color: 'red' },
        { label: 'Reset All Data', icon: RefreshCw, action: () => { setAction('resetData'); setShowModal(true); }, color: 'red' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold text-tuc-brown-dark mb-6">TUC Administrative Panel</h2>
            {message.text && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <input type="file" ref={fileInputRef} onChange={handleImportProgrammes} accept=".json" className="hidden" />
                {adminActions.map(act => (
                    <div key={act.label} onClick={act.action}
                         className={`bg-white p-6 rounded-xl shadow-sm cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1 border-b-4 border-${act.color}-500`}>
                        <act.icon className={`w-10 h-10 mb-3 text-${act.color}-600`} />
                        <span className="font-semibold text-tuc-brown-dark">{act.label}</span>
                    </div>
                ))}
            </div>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h3 className="text-lg font-bold text-tuc-brown-dark mb-4">Confirm Action</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to {action === 'clearLog' ? 'clear the audit log' : 'reset all programme data'}? This cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={performAction} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirm</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPanel;
```

### FILE: components/AssessmentPlayer.tsx
```typescript
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Assessment, Question, View, Results } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './ui/Modal';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

interface AssessmentPlayerProps {
    assessment: Assessment;
    questions: Question[];
    setView: (view: View) => void;
    setResults: (results: Results) => void;
    addLogEntry: (eventType: string, eventData: object) => void;
}

const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({ assessment, questions, setView, setResults, addLogEntry }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useLocalStorage<{ [key: number]: string }>(`assessment-session-${assessment.id}`, {});
    const [timeLeft, setTimeLeft] = useLocalStorage<number>(`assessment-time-${assessment.id}`, assessment.duration * 60);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const timerRef = useRef<number | null>(null);
    
    const handleSubmit = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                score++;
            }
        });
        const finalResults: Results = {
            score,
            total: questions.length,
            answers,
            questions,
            assessmentId: assessment.id,
            assessmentTitle: assessment.title
        };
        setResults(finalResults);
        addLogEntry('ASSESSMENT_SUBMIT', { assessmentId: assessment.id, score, total: questions.length });
        
        localStorage.removeItem(`assessment-session-${assessment.id}`);
        localStorage.removeItem(`assessment-time-${assessment.id}`);

        setView('results');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, assessment.id, assessment.title, addLogEntry, questions, setResults, setView]);

    useEffect(() => {
        addLogEntry('ASSESSMENT_START', { assessmentId: assessment.id, title: assessment.title });
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addLogEntry, assessment.id, assessment.title, setTimeLeft]);
    
    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, handleSubmit]);

    const handleAnswer = (questionIndex: number, answer: string) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);
        addLogEntry('QUESTION_ANSWER', { assessmentId: assessment.id, questionIndex, answer });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-brand-maroon mb-4">No Questions Available</h2>
                <p className="text-gray-600 mb-6">This assessment has not been configured with questions yet. Please check back later or contact an administrator.</p>
                <button onClick={() => setView('dashboard')} className="flex items-center mx-auto px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                <div className="flex justify-between items-center border-b border-brand-brown-light pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-maroon">{assessment.id} - {assessment.title}</h2>
                        <p className="text-sm text-gray-500">Question {currentQ + 1} of {questions.length}</p>
                    </div>
                    <div className="flex items-center font-semibold text-lg text-brand-maroon-dark bg-brand-gold-light px-4 py-2 rounded-full">
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-brand-brown-dark mb-6">{questions[currentQ].question}</h3>
                    <div className="space-y-4">
                        {questions[currentQ].options.map(option => (
                            <div key={option} onClick={() => handleAnswer(currentQ, option)}
                                 className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${answers[currentQ] === option ? 'bg-brand-gold-light border-brand-gold' : 'border-brand-brown-light hover:border-brand-gold'}`}>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-brand-brown-light">
                    <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
                            className="flex items-center px-6 py-2 bg-white border border-brand-brown-light text-brand-brown-dark rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>
                    {currentQ < questions.length - 1 ? (
                        <button onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm">
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    ) : (
                        <button onClick={() => setConfirmSubmit(true)}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm">
                            Submit Assessment
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <h3 className="text-lg font-bold text-brand-brown-dark mb-4">Confirm Submission</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to submit your answers? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setConfirmSubmit(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={() => handleSubmit()} className="px-4 py-2 bg-brand-maroon text-white rounded-lg hover:bg-brand-maroon-dark">Submit</button>
                </div>
            </Modal>
        </div>
    );
};

export default AssessmentPlayer;
```

### FILE: components/LoginModal.tsx
```typescript

import React, { useState } from 'react';
import { AuthService } from '../services/AuthService';
import Modal from './ui/Modal';

interface LoginModalProps {
    onLoginSuccess: () => void;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, onClose }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const result = await AuthService.login(username, password);
        
        if (result.success) {
            onLoginSuccess();
        } else {
            setError(result.message || 'Login failed');
        }
        setIsLoading(false);
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <h3 className="text-xl font-bold text-tuc-brown-dark mb-4">TUC Admin Access</h3>
                <p className="text-gray-600 mb-6">Enter your credentials to access the administration panel.</p>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tuc-gold focus:border-tuc-gold"
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tuc-gold focus:border-tuc-gold"
                        placeholder="Password"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex justify-end space-x-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button type="submit" disabled={isLoading} className="px-4 py-2 bg-tuc-maroon text-white rounded-lg hover:bg-tuc-maroon-dark disabled:opacity-50">
                        {isLoading ? 'Verifying...' : 'Login'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LoginModal;

```

### FILE: components/ProgrammeDashboard.tsx
```typescript
import React from 'react';
import { Programme, View } from '../types';
import ProgrammeIcon from './ProgrammeIcon';

interface ProgrammeDashboardProps {
    setView: (view: View) => void;
    setProgramme: (programme: Programme) => void;
    programmes: Programme[];
}

const ProgrammeDashboard: React.FC<ProgrammeDashboardProps> = ({ setView, setProgramme, programmes }) => (
    <div>
        <h2 className="text-3xl font-bold text-brand-brown-dark mb-6">Academic Programmes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programmes.map(prog => (
                <div key={prog.id} onClick={() => { setProgramme(prog); setView('programmeDetail'); }}
                     className="bg-white p-6 rounded-xl shadow-[0_4px_12px_rgba(139,21,56,0.1)] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-l-4 border-brand-gold">
                    <ProgrammeIcon programmeId={prog.id} className="w-10 h-10 text-brand-maroon mb-3" />
                    <h3 className="text-xl font-bold text-brand-maroon">{prog.name}</h3>
                    <p className="text-gray-600 text-sm mt-2">View available assessments for this programme.</p>
                </div>
            ))}
        </div>
    </div>
);

export default ProgrammeDashboard;

```

### FILE: components/ProgrammeDetail.tsx
```typescript
import React from 'react';
import { Programme, Assessment, View } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface ProgrammeDetailProps {
    programme: Programme;
    setView: (view: View) => void;
    setAssessment: (assessment: Assessment) => void;
}

const ProgrammeDetail: React.FC<ProgrammeDetailProps> = ({ programme, setView, setAssessment }) => (
    <div>
        <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-medium text-brand-maroon mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
        </button>
        <h2 className="text-3xl font-bold text-brand-brown-dark mb-2">{programme.name}</h2>
        <p className="text-gray-500 mb-8">Select an assessment to begin.</p>
        
        <div className="space-y-8">
            {Object.entries(programme.assessments).map(([year, assessments]) => (
                <div key={year}>
                    <h3 className="text-xl font-semibold text-brand-maroon-dark capitalize mb-4 border-b-2 border-brand-brown-light pb-2">
                        {year.replace('year', 'Year ')}
                    </h3>
                    <div className="space-y-3">
                        {assessments.map(asm => (
                            <div key={asm.id} onClick={() => { setAssessment(asm); setView('assessment'); }}
                                 className="bg-white p-4 rounded-lg shadow-sm cursor-pointer flex justify-between items-center transition-all duration-200 hover:bg-brand-offwhite hover:shadow-md">
                                <div className="flex items-center">
                                    <span className="text-xs font-mono bg-brand-brown-light text-brand-maroon-dark px-2 py-1 rounded-md mr-4 w-24 text-center">
                                        {asm.id}
                                    </span>
                                    <div>
                                        <h4 className="font-semibold text-brand-brown-dark">{asm.title}</h4>
                                        <p className="text-xs text-gray-500">{asm.questions} Questions | {asm.duration} Minutes</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-brand-gold" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ProgrammeDetail;
```

### FILE: components/ProgrammeIcon.tsx
```typescript
import React from 'react';

interface ProgrammeIconProps {
    programmeId: string;
    className?: string;
}

const ProgrammeIcon: React.FC<ProgrammeIconProps> = ({ programmeId, className = 'w-10 h-10 mb-3' }) => {
    switch (programmeId) {
        case 'jd': // Jewellery Design
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Jewellery Design Icon</title>
                    <path d="M12 2L14.5 9H9.5L12 2Z" fill="#D4AF37"/>
                    <path d="M6 9L12 22L18 9H6Z" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.5 9H14.5" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'dm': // Digital Media
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Digital Media Icon</title>
                    <rect x="3" y="4" width="18" height="12" rx="2" stroke="#8B1538" strokeWidth="2"/>
                    <path d="M7 20H17" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 16V20" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="8" cy="9" r="1" fill="#D4AF37"/>
                    <path d="M12 9H16" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 12H14" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            );
        case 'fd': // Fashion Design
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Fashion Design Icon</title>
                    <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" fill="#D4AF37"/>
                    <path d="M8 7H16L17 14H7L8 7Z" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 14L9 22H15L17 14" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        case 'pd': // Product Design
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Product Design Icon</title>
                    <circle cx="12" cy="12" r="3" stroke="#D4AF37" strokeWidth="2"/>
                    <path d="M12 2V5" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 19V22" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 12H2" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M22 12H19" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19.0711 4.92896L16.9497 7.05029" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7.05029 16.9497L4.92896 19.0711" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19.0711 19.0711L16.9497 16.9497" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7.05029 7.05029L4.92896 4.92896" stroke="#8B1538" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        default:
            return (
                <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <title>Default Icon</title>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2 2 0 0 1 6 2z" stroke="#8B1538" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
    }
};

export default ProgrammeIcon;

```

### FILE: components/ResultsPage.tsx
```typescript

import React, { useState, useEffect } from 'react';
import { Results, View } from '../types';
import { generateFeedback } from '../services/geminiService';
import { Home, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const ReviewAnswers: React.FC<{ results: Results, setReviewMode: (mode: boolean) => void }> = ({ results, setReviewMode }) => (
    <div className="max-w-4xl mx-auto">
        <button onClick={() => setReviewMode(false)} className="flex items-center text-sm font-medium text-brand-maroon mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
        </button>
        <h2 className="text-2xl font-semibold text-brand-brown-dark mb-6">Review Your Answers for {results.assessmentId}</h2>
        <div className="space-y-6">
            {results.questions.map((q, index) => {
                const userAnswer = results.answers[index];
                const isCorrect = userAnswer === q.answer;
                return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold text-brand-brown-dark mb-4">Question {index + 1}: {q.question}</h3>
                        <div className="space-y-3">
                            {q.options.map(option => {
                                let style = 'border-gray-300';
                                if (option === q.answer) style = 'border-green-500 bg-green-50 text-green-800 font-semibold';
                                if (option === userAnswer && !isCorrect) style = 'border-red-500 bg-red-50 text-red-800';
                                
                                return (
                                    <div key={option} className={`p-3 border-2 rounded-lg flex items-center ${style}`}>
                                        {option === q.answer && <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />}
                                        {option === userAnswer && !isCorrect && <XCircle className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />}
                                        {!((option === q.answer) || (option === userAnswer && !isCorrect)) && <div className="w-5 h-5 mr-3 flex-shrink-0" />}
                                        <span>{option}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const ResultsPage: React.FC<{ results: Results, setView: (view: View) => void }> = ({ results, setView }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
    const [reviewMode, setReviewMode] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoadingFeedback(true);
            const generatedFeedback = await generateFeedback(results);
            setFeedback(generatedFeedback);
            setIsLoadingFeedback(false);
        };

        fetchFeedback();
    }, [results]);

    if (reviewMode) {
        return <ReviewAnswers results={results} setReviewMode={setReviewMode} />;
    }

    const percentage = results.total > 0 ? Math.round((results.score / results.total) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)] text-center">
                <h2 className="text-3xl font-bold text-brand-maroon mb-2">Assessment Complete!</h2>
                <p className="text-gray-600 mb-6">Here is a summary of your performance for {results.assessmentId}.</p>
                <div className="flex justify-center items-center my-8">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90 18 18)">
                            <path className="text-brand-brown-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                            <path className="text-brand-maroon" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-brand-brown-dark">{percentage}%</span>
                            <span className="text-gray-500 mt-1">{results.score}/{results.total} Correct</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-brand-offwhite p-6 rounded-lg text-left my-6">
                    <h3 className="font-semibold text-brand-brown-dark mb-3">Personalised Feedback</h3>
                    {isLoadingFeedback ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                        </div>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{feedback}</p>
                    )}
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setView('dashboard')} className="flex items-center px-6 py-2 bg-white border border-brand-brown-light text-brand-brown-dark rounded-full font-semibold text-sm hover:bg-gray-50">
                        <Home className="w-4 h-4 mr-2" /> Back to Dashboard
                    </button>
                    <button onClick={() => setReviewMode(true)} className="flex items-center px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm hover:opacity-90">
                        Review Answers <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;

```

### FILE: components/ui/Modal.tsx
```typescript

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div 
                className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full m-4 transform transition-all" 
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;

```

### FILE: constants.ts
```typescript
import { ProgrammeData } from './types';

export const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

export const initialProgrammeData: ProgrammeData = {
  "programmes": [
    {
      "id": "jd",
      "name": "Jewellery Design",
      "assessments": {
        "year1": [
          { "id": "BJDT111", "title": "Introduction to Jewellery Design", "duration": 15, "questions": 0 },
          { "id": "ACDT112", "title": "Workshop Safety Practices", "duration": 10, "questions": 0 },
          { "id": "ACDT113", "title": "Foundations in Technical Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication and Study Skills I", "duration": 10, "questions": 0 },
          { "id": "BJDT121", "title": "Experimental Jewellery Practices", "duration": 15, "questions": 0 },
          { "id": "BJDT122", "title": "Workshop Practice Basics", "duration": 10, "questions": 0 },
          { "id": "BJDT123", "title": "Orthographic and Isometric Projections", "duration": 15, "questions": 0 },
          { "id": "BJDT125", "title": "Introduction to Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "ACDT125", "title": "Introduction to Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication and Study Skills II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "BJDT231", "title": "Concept Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "BJDT232", "title": "Fabrication and Finishing Basics", "duration": 15, "questions": 0 },
          { "id": "BJDT233", "title": "Alloy Calculation, Measuring and Marking", "duration": 15, "questions": 0 },
          { "id": "BJDT234", "title": "Introduction to Metallurgy", "duration": 15, "questions": 0 },
          { "id": "BJDT235", "title": "Assaying. Refining and Hallmarking", "duration": 15, "questions": 0 },
          { "id": "BJDT236", "title": "3D Modelling in Computing", "duration": 15, "questions": 0 },
          { "id": "ACDT237", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "BJDT241", "title": "Concept Design and Modelling", "duration": 15, "questions": 0 },
          { "id": "BJDT242", "title": "Fabrication and Finishing Techniques", "duration": 15, "questions": 0 },
          { "id": "BJDT243", "title": "Jewellery Casting Methods", "duration": 15, "questions": 0 },
          { "id": "BJDT244", "title": "Jewellery Surface Coating Methods", "duration": 15, "questions": 0 },
          { "id": "BJDT245", "title": "Advanced Metallurgy", "duration": 15, "questions": 0 },
          { "id": "BJDT246", "title": "Advanced Computer Application", "duration": 15, "questions": 0 },
          { "id": "BJDT247", "title": "New Venture Creation", "duration": 10, "questions": 0 }
        ],
        "year3": [
            { "id": "BJDT351", "title": "Advanced Design & Modelling Techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT352", "title": "Fabrication and Finishing techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT353", "title": "Introduction to Gemmology", "duration": 15, "questions": 0 },
            { "id": "BJDT354", "title": "Introduction to Gem Setting", "duration": 15, "questions": 0 },
            { "id": "BJDT355", "title": "Seminar", "duration": 15, "questions": 0 },
            { "id": "ACDT356", "title": "Business Management and Sustenance", "duration": 10, "questions": 0 },
            { "id": "ACDT357", "title": "Operations Management", "duration": 10, "questions": 0 },
            { "id": "BJDT361", "title": "Model Making and Fabrication", "duration": 10, "questions": 0 },
            { "id": "BJDT362", "title": "Jewellery Production", "duration": 20, "questions": 0 },
            { "id": "BJDT363", "title": "Advanced Gemmology", "duration": 15, "questions": 0 },
            { "id": "BJDT364", "title": "General Gem Setting Techniques", "duration": 15, "questions": 0 },
            { "id": "BJDT365", "title": "Ethical and Legal Issues in Jewellery", "duration": 10, "questions": 0 },
            { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 }
        ],
        "year4": [
            { "id": "BJDT471", "title": "Host Entity Evaluation Report", "duration": 30, "questions": 0 },
            { "id": "BJDT472", "title": "Industrial Activity Report", "duration": 20, "questions": 0 },
            { "id": "BJDT481", "title": "Post Industrial Attachment Seminars", "duration": 15, "questions": 0 },
            { "id": "BJDT482", "title": "Studio Research in Jewellery Design", "duration": 20, "questions": 0 },
            { "id": "BJDT483", "title": "Jewellery Exhibition and Portfolio", "duration": 15, "questions": 0 },
            { "id": "BJDT484", "title": "Project Management in Jewellery Design", "duration": 15, "questions": 0 },
            { "id": "BJDT485", "title": "Project Work", "duration": 15, "questions": 0 },
            { "id": "ACDT486", "title": "Accounting & Finance for Entrepreneurs", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "dm",
      "name": "Digital Media",
      "assessments": {
        "year1": [
          { "id": "DMCD111", "title": "Introduction to Digital Media", "duration": 15, "questions": 1 },
          { "id": "DMCD112", "title": "Basic Design", "duration": 15, "questions": 0 },
          { "id": "DMCD113", "title": "Introduction to Communication Design", "duration": 15, "questions": 0 },
          { "id": "DMCD114", "title": "Introduction to Computer Applications", "duration": 15, "questions": 0 },
          { "id": "ACDT114-DM", "title": "Basic Drawing", "duration": 15, "questions": 0 },
          { "id": "ACDT115-DM", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116-DM", "title": "Communication and Study Skills I", "duration": 10, "questions": 0 },
          { "id": "DMCD121", "title": "Basic Programming", "duration": 15, "questions": 0 },
          { "id": "DMCD122", "title": "Idea Development Techniques", "duration": 15, "questions": 0 },
          { "id": "DMCD123", "title": "Basic Rendering Techniques", "duration": 15, "questions": 0 },
          { "id": "DMCD124", "title": "Design History", "duration": 15, "questions": 0 },
          { "id": "ACDT124", "title": "Typography", "duration": 15, "questions": 0 },
          { "id": "ACDT125-DM", "title": "Image Manipulation", "duration": 15, "questions": 0 },
          { "id": "ACDT126-DM", "title": "Communication and Study Skills II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "DMCD231", "title": "Logos, Symbols & Trademarks", "duration": 15, "questions": 0 },
          { "id": "DMCD232", "title": "Print Design", "duration": 15, "questions": 0 },
          { "id": "DMCD233", "title": "Advanced Typography", "duration": 15, "questions": 0 },
          { "id": "DMCD234", "title": "Photography", "duration": 15, "questions": 0 },
          { "id": "DMCD235", "title": "Print Production", "duration": 15, "questions": 0 },
          { "id": "DMCD236", "title": "Design Seminar", "duration": 15, "questions": 0 },
          { "id": "ACDT231", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "DMCD241", "title": "Brand & Identity Systems", "duration": 15, "questions": 0 },
          { "id": "DMCD242", "title": "Advanced Print Design", "duration": 15, "questions": 0 },
          { "id": "DMCD243", "title": "Web Design", "duration": 15, "questions": 0 },
          { "id": "DMCD244", "title": "Advanced Photography", "duration": 15, "questions": 0 },
          { "id": "DMCD245", "title": "Advanced Print Production", "duration": 15, "questions": 0 }
        ],
        "year3": [
          { "id": "DMCD351", "title": "First Practical Training & Internship", "duration": 20, "questions": 0 },
          { "id": "DMCD352", "title": "Book & Magazine Design", "duration": 15, "questions": 0 },
          { "id": "DMCD353", "title": "Advertising Design", "duration": 15, "questions": 0 },
          { "id": "DMCD354", "title": "Online Media Technology", "duration": 15, "questions": 0 },
          { "id": "DMCD355", "title": "Animation", "duration": 15, "questions": 0 },
          { "id": "ACDT351", "title": "Business Management and Sustenance", "duration": 10, "questions": 0 },
          { "id": "DMCD361", "title": "Copywriting", "duration": 15, "questions": 0 },
          { "id": "DMCD362", "title": "Advanced Advertising Design", "duration": 15, "questions": 0 },
          { "id": "DMCD363", "title": "Video Production", "duration": 15, "questions": 0 },
          { "id": "DMCD364", "title": "Advanced Animation", "duration": 15, "questions": 0 },
          { "id": "ACDT361", "title": "Research Methods", "duration": 15, "questions": 0 },
          { "id": "DMCD365", "title": "Sound Production (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD366", "title": "Motion Graphics (Elective)", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "DMCD471", "title": "Second Practical Training & Internship", "duration": 20, "questions": 0 },
          { "id": "DMCD472", "title": "Project & Report Writing I", "duration": 15, "questions": 0 },
          { "id": "DMCD473", "title": "Professional Portfolio Development I", "duration": 15, "questions": 0 },
          { "id": "DMCD474", "title": "Contracts & Copyright (Elective)", "duration": 15, "questions": 0 },
          { "id": "ACDT471", "title": "Accounting & Finance for Entrepreneurs (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD481", "title": "Project & Report Writing II", "duration": 15, "questions": 0 },
          { "id": "DMCD482", "title": "Professional Portfolio Development II", "duration": 15, "questions": 0 },
          { "id": "DMCD483", "title": "Ethics and Career Planning (Elective)", "duration": 15, "questions": 0 },
          { "id": "DMCD484", "title": "Taxes and Regulations (Elective)", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "fd",
      "name": "Fashion Design",
      "assessments": {
        "year1": [
          { "id": "FDT151", "title": "Introduction to Fashion", "duration": 15, "questions": 1 },
          { "id": "FDT153", "title": "Introduction to Textile Design", "duration": 15, "questions": 0 },
          { "id": "FDT155", "title": "Pattern Making", "duration": 15, "questions": 0 },
          { "id": "FDT157", "title": "Sewing Techniques", "duration": 15, "questions": 0 },
          { "id": "FDT159", "title": "Introduction to Textiles", "duration": 15, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 15, "questions": 0 },
          { "id": "ACDT117", "title": "Information Communication Technology I", "duration": 15, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication and Study Skills I", "duration": 15, "questions": 0 },
          { "id": "FDT150", "title": "Introduction to Creative Design in Fashion", "duration": 15, "questions": 0 },
          { "id": "FDT152", "title": "Textile Design", "duration": 15, "questions": 0 },
          { "id": "FDT154", "title": "Pattern Adaptation", "duration": 15, "questions": 0 },
          { "id": "FDT156", "title": "Garment Construction", "duration": 15, "questions": 0 },
          { "id": "FDT158", "title": "Freehand Cutting", "duration": 15, "questions": 0 },
          { "id": "FDT160", "title": "Basic Design", "duration": 15, "questions": 0 },
          { "id": "ACDT127", "title": "Information Communication Technology II", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication and Study Skills II", "duration": 15, "questions": 0 },
          { "id": "WEL150", "title": "Industrial Attachment I", "duration": 15, "questions": 0 }
        ],
        "year2": [
          { "id": "FDT251", "title": "Creative Design in Fashion", "duration": 15, "questions": 0 },
          { "id": "FDT253", "title": "Printed Textile Design Application", "duration": 15, "questions": 0 },
          { "id": "FDT255", "title": "Pattern Technology I", "duration": 15, "questions": 0 },
          { "id": "FDT257", "title": "Garment Technology I", "duration": 15, "questions": 0 },
          { "id": "FDT259", "title": "Introduction to Fabric Studies", "duration": 15, "questions": 0 },
          { "id": "FDT261", "title": "Fashion Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT263", "title": "Basic Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "FDT265", "title": "Introduction to Fashion Accessories", "duration": 15, "questions": 0 },
          { "id": "FDT267", "title": "Introduction to Production Management", "duration": 15, "questions": 0 },
          { "id": "FDT250", "title": "Basic Fashion Design and Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT252", "title": "Pattern Technology II", "duration": 15, "questions": 0 },
          { "id": "FDT254", "title": "Garment Technology II", "duration": 15, "questions": 0 },
          { "id": "FDT256", "title": "Fabric Studies", "duration": 15, "questions": 0 },
          { "id": "FDT258", "title": "Millinery Design and Production", "duration": 15, "questions": 0 },
          { "id": "FDT260", "title": "Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "FDT262", "title": "Fashion Marketing", "duration": 15, "questions": 0 },
          { "id": "FDT264", "title": "Production Management", "duration": 15, "questions": 0 },
          { "id": "WEL250", "title": "Industrial Attachment", "duration": 15, "questions": 0 }
        ],
        "year3": [
          { "id": "FDT351", "title": "Design and Illustration", "duration": 15, "questions": 0 },
          { "id": "FDT353", "title": "Garment Decoration Techniques", "duration": 15, "questions": 0 },
          { "id": "FDT355", "title": "Pattern Alteration", "duration": 15, "questions": 0 },
          { "id": "FDT357", "title": "Fashion Draping", "duration": 15, "questions": 0 },
          { "id": "FDT359", "title": "Design and Production of Bags and Slippers", "duration": 15, "questions": 0 },
          { "id": "FDT361", "title": "Entrepreneurship I", "duration": 15, "questions": 0 },
          { "id": "FDT363", "title": "Seminar in Fashion", "duration": 15, "questions": 0 },
          { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 },
          { "id": "WEL350", "title": "Industrial Attachment III", "duration": 15, "questions": 0 },
          { "id": "FDT352", "title": "Research Methods/Seminar", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "FDT451", "title": "Collection Development", "duration": 15, "questions": 0 },
          { "id": "FDT453", "title": "Quality Control in Garment Production", "duration": 15, "questions": 0 },
          { "id": "FDT455", "title": "Beauty Culture", "duration": 15, "questions": 0 },
          { "id": "FDT457", "title": "Entrepreneurship II", "duration": 15, "questions": 0 },
          { "id": "FDT459", "title": "Thesis/ Project I", "duration": 15, "questions": 0 },
          { "id": "FDT450", "title": "Final Collection Development", "duration": 15, "questions": 0 },
          { "id": "FDT452", "title": "Portfolio Development and Exhibition", "duration": 15, "questions": 0 },
          { "id": "FDT454", "title": "Salesmanship and Sales Management", "duration": 15, "questions": 0 },
          { "id": "FDT460", "title": "Fashion Merchandising", "duration": 15, "questions": 0 },
          { "id": "FDT464", "title": "Thesis/ Project II", "duration": 15, "questions": 0 }
        ]
      }
    },
    {
      "id": "pd",
      "name": "Product Design",
      "assessments": {
        "year1": [
          { "id": "BPDE111", "title": "Introduction to Industrial/Product Design", "duration": 15, "questions": 1 },
          { "id": "ACDT112", "title": "Safety In Workshop Practices", "duration": 10, "questions": 0 },
          { "id": "ACDT113", "title": "Technical Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT114", "title": "Basic Drawing", "duration": 10, "questions": 0 },
          { "id": "ACDT115", "title": "Introduction to African Art & Culture", "duration": 15, "questions": 0 },
          { "id": "ACDT116", "title": "Communication Skills I", "duration": 10, "questions": 0 },
          { "id": "ACDT117", "title": "Information Communication Technology I", "duration": 10, "questions": 0 },
          { "id": "BPDE121", "title": "Idea Development and Design Processes", "duration": 15, "questions": 0 },
          { "id": "BPDE122", "title": "Workshop Practices", "duration": 15, "questions": 0 },
          { "id": "BPDE123", "title": "Orthographic and Isometric Projections", "duration": 15, "questions": 0 },
          { "id": "BPDE125", "title": "Freehand Drawing Techniques", "duration": 15, "questions": 0 },
          { "id": "ACDT125", "title": "Introduction to Computer Aided Design", "duration": 15, "questions": 0 },
          { "id": "ACDT126", "title": "Communication Skills II", "duration": 10, "questions": 0 },
          { "id": "ACDT127", "title": "Information Communication Technology II", "duration": 10, "questions": 0 }
        ],
        "year2": [
          { "id": "BPDE231", "title": "Introduction to Modelling", "duration": 15, "questions": 0 },
          { "id": "BPDE232", "title": "Product Design Methods", "duration": 15, "questions": 0 },
          { "id": "BPDE233", "title": "Perspective Drawing", "duration": 15, "questions": 0 },
          { "id": "BPDE234", "title": "Nature of Materials and Processes", "duration": 15, "questions": 0 },
          { "id": "BPDE235", "title": "Manufacturing Processes I", "duration": 15, "questions": 0 },
          { "id": "BPDE236", "title": "Three-Dimensional Design in Computing", "duration": 15, "questions": 0 },
          { "id": "BPDE237", "title": "Introduction to Entrepreneurship", "duration": 10, "questions": 0 },
          { "id": "BPDE241", "title": "Design for Use", "duration": 15, "questions": 0 },
          { "id": "BPDE242", "title": "Visual Communication and Package Design", "duration": 15, "questions": 0 },
          { "id": "BPDE243", "title": "Ergonomics and Human Factors Applications", "duration": 15, "questions": 0 },
          { "id": "BPDE244", "title": "Contextual Nature of Products", "duration": 15, "questions": 0 },
          { "id": "BPDE245", "title": "Objects and Impacts", "duration": 15, "questions": 0 },
          { "id": "BPDE246", "title": "Advanced Computer Application", "duration": 15, "questions": 0 },
          { "id": "ACDT247", "title": "New Venture Creation", "duration": 10, "questions": 0 }
        ],
        "year3": [
          { "id": "BPDE351", "title": "Practical Model Making Techniques", "duration": 15, "questions": 0 },
          { "id": "BPDE352", "title": "Product Interface Design", "duration": 15, "questions": 0 },
          { "id": "BPDE353", "title": "Workshop Practice I", "duration": 15, "questions": 0 },
          { "id": "BPDE354", "title": "Design and Development", "duration": 15, "questions": 0 },
          { "id": "BPDE355", "title": "Seminar", "duration": 15, "questions": 0 },
          { "id": "ACDT356", "title": "Business Management and Sustainability", "duration": 10, "questions": 0 },
          { "id": "BPDE361", "title": "Mass Production Technology", "duration": 15, "questions": 0 },
          { "id": "BPDE362", "title": "Rendering for Presentation", "duration": 15, "questions": 0 },
          { "id": "BPDE363", "title": "Workshop Practice II", "duration": 15, "questions": 0 },
          { "id": "BPDE364", "title": "Design and Sustainability", "duration": 15, "questions": 0 },
          { "id": "BPDE365", "title": "Ethical and Legal Issues", "duration": 10, "questions": 0 },
          { "id": "ACDT367", "title": "Research Methods", "duration": 15, "questions": 0 }
        ],
        "year4": [
          { "id": "BPDE471", "title": "Industrial Attachment", "duration": 20, "questions": 0 },
          { "id": "BPDE472", "title": "Project Report I", "duration": 20, "questions": 0 },
          { "id": "BPDE481", "title": "Industrial Attachment Seminars", "duration": 15, "questions": 0 },
          { "id": "BPDE482", "title": "Studio Research in Product Design", "duration": 15, "questions": 0 },
          { "id": "BPDE483", "title": "Exhibition Design", "duration": 15, "questions": 0 },
          { "id": "BPDE484", "title": "Project Report II", "duration": 15, "questions": 0 },
          { "id": "ACDT485", "title": "Accounting and Finance for Entrepreneurs", "duration": 15, "questions": 0 }
        ]
      }
    }
  ],
  "questions": {
    "DMCD111": [
        { "question": "What does RGB stand for in digital colour models?", "options": ["Red, Green, Blue", "Red, Grey, Black", "Royal Gold Banner", "Raster Graphics Buffer"], "answer": "Red, Green, Blue" }
    ],
    "FDT151": [
        { "question": "Which of these is a natural fibre?", "options": ["Cotton", "Polyester", "Nylon", "Rayon"], "answer": "Cotton" }
    ],
    "BPDE111": [
        { "question": "What is the primary focus of ergonomics?", "options": ["User comfort and efficiency", "Aesthetics", "Material cost", "Manufacturing speed"], "answer": "User comfort and efficiency" }
    ]
  }
};
```

### FILE: CREATION.md
```md
# techbridge-assessment-platform

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

This application is deployed behind an Nginx reverse proxy at the path `/tuc-assessment-platform/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/tuc-assessment-platform/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/tuc-assessment-platform/',  // REQUIRED: Assets must load from /tuc-assessment-platform/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/tuc-assessment-platform"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/tuc-assessment-platform">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/tuc-assessment-platform/`, not at the root
- **Asset Loading**: Without `base: '/tuc-assessment-platform/'`, assets try to load from `/assets/` instead of `/tuc-assessment-platform/assets/`
- **Routing**: Without `basename="/tuc-assessment-platform"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/tuc-assessment-platform/assets/index-*.js`
- Link tags should reference: `/tuc-assessment-platform/assets/index-*.css`

If they reference `/assets/` instead of `/tuc-assessment-platform/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/tuc-assessment-platform/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/tuc-assessment-platform/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: tuc-assessment-platform

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
# Admin Guide — tuc-assessment-platform

**Application:** tuc-assessment-platform
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

Audit log data is stored in `localStorage` under the key `tuc_tuc-assessment-platform_audit`.

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
# Deployment Guide — tuc-assessment-platform

**Application:** tuc-assessment-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd tuc-assessment-platform
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
docker-compose -f docker-compose-all-apps.yml build tuc-assessment-platform
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up tuc-assessment-platform
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

**Project:** Tuc Assessment Platform
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Tuc Assessment Platform**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Tuc Assessment Platform** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Tuc Assessment Platform** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Test suite present | âŒ Non-compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Tailwind CSS 4.x
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
# Testing Guide — tuc-assessment-platform

**Application:** tuc-assessment-platform
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd tuc-assessment-platform
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

### FILE: hooks/useAuditLog.ts
```typescript

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LogEntry } from '../types';

export const useAuditLog = () => {
  const [log, setLog] = useLocalStorage<LogEntry[]>('aucdt-audit-log', []);

  const addLogEntry = useCallback((eventType: string, eventData: object) => {
    const newEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      ...eventData
    };
    setLog(prevLog => [...prevLog, newEntry]);
  }, [setLog]);

  return { log, addLogEntry, setLog };
};

```

### FILE: hooks/useLocalStorage.ts
```typescript

import { useState } from 'react';

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
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
    <meta property="og:title" content="Tuc Assessment Platform | Techbridge University College" />
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
    <meta name="twitter:title" content="Tuc Assessment Platform | Techbridge University College" />
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
    <title>Tuc Assessment Platform | Techbridge University College</title>

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
        <div class="tuc-status">tuc assessment platform</div>
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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "TUC Assessment Platform",
  "description": "An interactive academic assessment platform for Techbridge University College (TUC). It allows students to take tests, receive AI-powered feedback, and provides an administrative panel for data management.",
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
  "name": "techbridge-assessment-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "pnpm install && vite",
    "build": "vite build",
    "lint": "pnpm install && eslint .",
    "preview": "pnpm install && vite preview",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@google/genai": "^1.15.0",
    "@vitejs/plugin-react": "^4.7.0",
    "lucide-react": "^0.542.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "serve": "14.2.5",
    "tailwindcss": "^3.4.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.3",
    "vite": "7.3.1",
    "@playwright/test": "^1.49.0",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
# AUCDT Skills Evaluation System - Development Guide

This guide provides instructions for setting up, running, developing, and deploying the AUCDT Skills Evaluation System.

## Table of Contents

1.  [Development Environment Setup](#1-development-environment-setup)
2.  [pnpm Installation & Configuration](#2-pnpm-installation--configuration)
3.  [Project Setup & Development](#3-project-setup--development)
4.  [End-to-End Testing with Playwright](#4-end-to-end-testing-with-playwright)
5.  [Development Tools & IDE Setup](#5-development-tools--ide-setup)
6.  [Local Testing & Debugging](#6-local-testing--debugging)
7.  [Git Workflow & Version Control](#7-git-workflow--version-control)
8.  [Build & Testing Scripts](#8-build--testing-scripts)
9.  [Cross-Platform Compatibility](#9-cross-platform-compatibility)
10. [Performance Optimization](#10-performance-optimization)
11. [Deployment Preparation](#11-deployment-preparation)

---

### 1. Development Environment Setup

To get started, you'll need to install the following tools on your machine:

*   **Node.js (LTS):** The application's tooling relies on the Node.js runtime. We recommend using the latest Long-Term Support (LTS) version.
    *   **Recommendation:** Use a version manager like [nvm](https://github.com/nvm-sh/nvm) (for macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (for Windows) to easily switch between Node.js versions.
*   **pnpm:** This project uses `pnpm` as its primary package manager for its performance and disk space efficiency.
*   **Git:** Essential for version control. Download and install Git from the [official website](https://git-scm.com/downloads).
*   **Code Editor:** A modern code editor is crucial for a good development experience.
    *   **Recommendation:** [Visual Studio Code (VS Code)](https://code.visualstudio.com/) is highly recommended due to its excellent JavaScript/TypeScript support and extensive extension ecosystem.
*   **Web Browser:** A modern web browser for running and debugging the application.
    *   **Recommendation:** Google Chrome or Mozilla Firefox, along with their respective developer tools.

### 2. pnpm Installation & Configuration

This project uses `pnpm` to manage dependencies. `pnpm` is a fast, disk-space-efficient package manager that creates a non-flat `node_modules` directory, preventing issues with phantom dependencies.

1.  **Installation:** Once Node.js is installed, open your terminal and run the following command to install `pnpm` globally:
    ```bash
    npm install -g pnpm
    ```
2.  **Verification:** Verify the installation by checking the version:
    ```bash
    pnpm --version
    ```
3.  **Configuration:** The project does not require any special `pnpm` configuration. All required settings are handled by the default `pnpm` setup.

### 3. Project Setup & Development

Follow these steps to get the application running on your local machine.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies:**
    Use `pnpm` to install all project and development dependencies.
    ```bash
    pnpm install
    ```

3.  **Set Up Environment Variables:**
    The application uses the Google Gemini API for generating feedback and requires an API key.
    *   The execution environment is expected to make this key available as `process.env.API_KEY`. In a browser-only context without a build step, `process.env` is not directly available.
    *   For local development, you will need to use a local server that can simulate this environment. A simple approach is to use a tool that can serve static files and inject environment variables.

4.  **Run the Local Development Server:**
    The project consists of static files and does not have a built-in development server. You must serve the files using a simple HTTP server to avoid browser security restrictions (`CORS` errors).
    *   We recommend using the `http-server` package.
    *   Run the following command from the project's root directory:
        ```bash
        npx http-server .
        ```
    *   Open your browser and navigate to the local address provided by the server (e.g., `http://127.0.0.1:8080`).

### 4. End-to-End Testing with Playwright

The project includes an end-to-end (E2E) test suite using **Jest** and **Playwright**. These tests simulate real user interactions in a Chromium browser to verify the application's core functionality from start to finish.

*   **Purpose:** The test suite validates the student assessment flow and the admin login process.
*   **Installation:** The test dependencies are listed under `devDependencies` in `package.json`. Install them by running:
    ```bash
    pnpm install
    ```
*   **Running Tests:** To execute the E2E test suite, run the following command from the project root:
    ```bash
    pnpm test
    ```
    This command will start a temporary web server, launch a headless browser, run the tests defined in `tests/e2e.test.js`, and output the results to your terminal.

### 5. Development Tools & IDE Setup

Using **VS Code** is highly recommended. Enhance your development experience by installing these extensions:

*   **ESLint:** Integrates ESLint into VS Code to highlight problems and help you fix them.
*   **Prettier - Code formatter:** Enforces a consistent code style across the entire codebase.
*   **Tailwind CSS IntelliSense:** Provides autocompletion, syntax highlighting, and linting for Tailwind CSS classes.
*   **GitLens:** Supercharges the Git capabilities built into VS Code, helping you visualize code authorship and history.

### 6. Local Testing & Debugging

*   **Browser Developer Tools:** Use your browser's built-in DevTools (`F12`) for debugging. The **Console** tab is useful for viewing log output, the **Network** tab for inspecting API calls, and the **Elements** tab for examining the DOM.
*   **React Developer Tools:** Install the [React Developer Tools extension](https://react.dev/learn/react-developer-tools) for your browser. It allows you to inspect the React component hierarchy, view component props and state, and profile performance.
*   **Local Storage Inspection:** The application state (e.g., in-progress assessments, audit logs) is persisted in Local Storage. Use the **Application** tab in your browser's DevTools to view and clear this data during testing.

### 7. Git Workflow & Version Control

We recommend a simple, effective branching strategy to keep the codebase clean and manageable.

*   **Branching Strategy:** Use a feature-branch workflow.
    1.  Create a new branch from `main` for every new feature or bug fix (e.g., `feat/add-new-programme` or `fix/results-page-bug`).
    2.  Commit your changes to this branch.
    3.  Push the branch and open a Pull Request (PR) to merge it back into `main`.
    4.  Require at least one code review before merging a PR.
*   **Commit Messages:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This creates an explicit and easily readable commit history.
    *   Example: `feat: add AI feedback generation on results page`
    *   Example: `fix: correct logo aspect ratio in header`

### 8. Build & Testing Scripts

The project is currently configured to run directly in the browser via ES modules and an `importmap`, so it **does not have a build process** (e.g., Webpack, Vite) or a unit testing suite. The primary testing mechanism is the E2E suite described above.

**Future Recommendations:**
*   **Unit/Integration Testing:** Introduce a testing framework like [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component-level tests.
*   **Build Tool:** Integrate a build tool like [Vite](https://vitejs.dev/) to enable features like Hot Module Replacement (HMR) for a better development experience, and to bundle and optimize the application for production.

### 9. Cross-Platform Compatibility

*   **Browsers:** The application is built with modern web technologies and is intended for use on the latest versions of major browsers like Chrome, Firefox, Safari, and Edge. Internet Explorer 11 is not supported.
*   **Responsiveness:** The UI is built with Tailwind CSS and is designed to be responsive. Always test your changes on various screen sizes, from mobile phones to large desktops, using the browser's device emulation tools.

### 10. Performance Optimization

*   **Memoization:** The application uses `React.useCallback` in key areas (like `AssessmentPlayer.tsx`) to prevent unnecessary re-renders. Continue to apply memoization techniques (`useCallback`, `useMemo`, `React.memo`) where appropriate.
*   **Code Splitting:** If the application grows, consider implementing code splitting with `React.lazy()` and `Suspense`. This can be integrated once a build tool like Vite is added to the project, allowing different views (e.g., Admin Panel) to be loaded on demand.
*   **Image Optimization:** Ensure all new image assets are compressed and served in modern formats like WebP where possible.

### 11. Deployment Preparation

The application is a set of static files and can be deployed to any modern static hosting platform.

*   **Hosting Providers:** Platforms like Vercel, Netlify, or Cloudflare Pages are excellent choices.
*   **Environment Variables:** The biggest deployment consideration is the `API_KEY`. Your chosen hosting provider **must** support a mechanism to securely set server-side environment variables and make them available to the application. A simple static file server will not work. You will need a platform that can run functions at the edge or serverlessly to inject the key at runtime, fulfilling the project's security requirements.
*   **Pre-Deployment Checklist:**
    1.  Ensure all code is formatted (`Prettier`) and linted (`ESLint`).
    2.  Remove any temporary code or `console.log` statements.
    3.  Verify that all features work as expected in a production-like environment.
    4.  Confirm the Git `main` branch is up-to-date.
```

### FILE: services/AuthService.ts
```typescript
const API_URL = 'http://localhost:5000/api/auth';

export const AuthService = {
    login: async (username: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('tuc_auth_token', data.token);
                localStorage.setItem('tuc_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Could not connect to TUC Auth API' };
        }
    },

    logout: () => {
        localStorage.removeItem('tuc_auth_token');
        localStorage.removeItem('tuc_user');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('tuc_auth_token');
    },

    getToken: () => {
        return localStorage.getItem('tuc_auth_token');
    }
};

```

### FILE: services/geminiService.ts
```typescript

import { GoogleGenAI } from "@google/genai";
import { Results } from "../types";

const API_KEY = [REDACTED_CREDENTIAL]

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFeedback = async (results: Results): Promise<string> => {
  if (!API_KEY) {
    return "AI feedback is not configured because the API key is missing.\n\nBased on your results, focus on reviewing the topics where you made mistakes. Great effort!";
  }

  const incorrectAnswers = results.questions
    .map((q, i) => ({ ...q, userAnswer: results.answers[i] }))
    .filter(q => q.userAnswer !== q.answer);

  const prompt = `A student took an assessment titled "${results.assessmentId} - ${results.assessmentTitle}". They scored ${results.score} out of ${results.total}. 
Here are the questions they got wrong and the answers they chose:
${incorrectAnswers.map(q => `- Question: "${q.question}", Their Answer: "${q.userAnswer}", Correct Answer: "${q.answer}"`).join('\n')}

Provide encouraging, personalised feedback in British English. Explain why some of their incorrect answers might have been wrong and offer brief, constructive advice for improvement. Keep it concise and supportive. Start with "Well done on completing the assessment!".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "There was an issue generating your feedback. Please try again later. Well done on completing the assessment!";
  }
};

```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_assessment_platform';
const ACCENT   = '#3b82f6';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge Assessment Platform</h1>
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

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4012;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = [REDACTED_CREDENTIAL]
const DB_NAME = process.env.DB_NAME || 'assessment_platform';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id VARCHAR(255) PRIMARY KEY, assessment_name VARCHAR(255),
        assessment_type VARCHAR(100), max_score INT,
        created_by VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id VARCHAR(255) PRIMARY KEY, assessment_id VARCHAR(255),
        student_id VARCHAR(255), score INT, percentage DECIMAL(5,2),
        status ENUM('passed', 'failed', 'pending') DEFAULT 'pending',
        taken_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assessment_id) REFERENCES assessments(id),
        INDEX idx_assessment (assessment_id), INDEX idx_student (student_id)
      )
    `);
    conn.release();
    console.log('Assessment Platform DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'assessment-platform' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/assessment') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const assId = `ass_${Date.now()}`;
          await conn.query(
            'INSERT INTO assessments (id, assessment_name, assessment_type, max_score, created_by) VALUES (?, ?, ?, ?, ?)',
            [assId, data.name || '', data.type || '', data.max_score || 100, data.created_by || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, assessment_id: assId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/submit-result') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const resultId = `res_${Date.now()}`;
          const pct = ((data.score / data.max_score) * 100).toFixed(2);
          await conn.query(
            'INSERT INTO assessment_results (id, assessment_id, student_id, score, percentage, status) VALUES (?, ?, ?, ?, ?, ?)',
            [resultId, data.assessment_id || '', data.student_id || '', data.score || 0, pct, data.score >= 50 ? 'passed' : 'failed']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, result_id: resultId, passed: data.score >= 50 }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/results')) {
      const conn = await pool.getConnection();
      const [results] = await conn.query('SELECT * FROM assessment_results ORDER BY taken_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Assessment Platform API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

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
          <span className="font-bold text-sm">Tuc Assessment Platform</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Tuc Assessment Platform — Admin</h1>
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

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

describe('tuc-assessment-platform', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tests/e2e.test.js
```javascript
const { chromium } = require('@playwright/test');
const express = require('express');
const path = require('path');
const fs = require('fs');
const getPort = require('get-port');

describe('TUC Assessment Platform E2E Tests', () => {
    let browser;
    let page;
    let server;
    let port;

    beforeAll(async () => {
        // Find an available port
        port = await getPort();
        const app = express();
        // Serve static files from the project root
        app.use(express.static(path.join(__dirname, '..')));
        server = app.listen(port);

        browser = await chromium.launch({ 
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
        server.close();
    });

    it('should allow a student to navigate and complete an assessment', async () => {
        // 1. Navigate to the homepage
        await page.goto(`http://localhost:${port}/`);
        
        // 2. Verify the dashboard is visible
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        
        // 3. Click on the "Digital Media" programme
        await page.click('h3 ::-p-text(Digital Media)');

        // 4. Verify the programme detail page is loaded
        await page.waitForSelector('h2 ::-p-text(Digital Media)');
        
        // 5. Click on an assessment with questions
        await page.click('span ::-p-text(DMCD111)');

        // 6. Verify the assessment player is visible
        await page.waitForSelector('h2 ::-p-text(DMCD111 - Introduction to Digital Media)');
        await page.waitForSelector('h3 ::-p-text(What does RGB stand for in digital colour models?)');

        // 7. Answer the question
        await page.click('div ::-p-text(Red, Green, Blue)');

        // 8. Submit the assessment
        await page.click('button ::-p-text(Submit Assessment)');

        // 9. Confirm submission in the modal
        await page.waitForSelector('h3 ::-p-text(Confirm Submission)');
        await page.click('button ::-p-text(Submit)');

        // 10. Verify the results page is displayed
        await page.waitForSelector('h2 ::-p-text(Assessment Complete!)');
        const scoreText = await page.$eval('div.absolute span.text-5xl', el => el.textContent);
        
        // 11. Check the score
        expect(scoreText).toBe('100%');
    });

    it('should allow an admin to log in and view the admin panel', async () => {
        // 1. Navigate to the homepage
        await page.goto(`http://localhost:${port}/`);
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        
        // 2. Click the admin button
        const adminButtonSelector = 'button ::-p-text(Admin)';
        await page.waitForSelector(adminButtonSelector);
        await page.click(adminButtonSelector);

        // 3. Verify login modal appears
        await page.waitForSelector('h3 ::-p-text(Admin Access)');

        // 4. Enter password and log in
        await page.type('input[type="password"]', 'admin');
        await page.click('button[type="submit"]');

        // 5. Verify the admin panel is visible
        await page.waitForSelector('h2 ::-p-text(Administrative Panel)');
        const adminPanelTitle = await page.$eval('h2', el => el.textContent);
        expect(adminPanelTitle).toBe('Administrative Panel');

        // 6. Navigate back home
        await page.click('button ::-p-text(Home)');
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        const homeTitle = await page.$eval('h2', el => el.textContent);
        expect(homeTitle).toBe('Academic Programmes');
    });

    it('should show an error for incorrect admin password', async () => {
        // 1. Navigate to the homepage
        await page.goto(`http://localhost:${port}/`);
        await page.waitForSelector('h2 ::-p-text(Academic Programmes)');
        
        // 2. Click the admin button
        const adminButtonSelector = 'button ::-p-text(Admin)';
        await page.waitForSelector(adminButtonSelector);
        await page.click(adminButtonSelector);

        // 3. Verify login modal appears
        await page.waitForSelector('h3 ::-p-text(Admin Access)');

        // 4. Enter incorrect password and attempt to log in
        await page.type('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');

        // 5. Verify error message is displayed
        await page.waitForSelector('p ::-p-text(Incorrect password. Please try again.)');
        const errorMessage = await page.$eval('.text-red-500', el => el.textContent);
        expect(errorMessage).toBe('Incorrect password. Please try again.');
    });
});

describe('Data Integrity Tests', () => {
    let initialProgrammeData;

    beforeAll(() => {
        const constantsPath = path.join(__dirname, '..', 'constants.ts');
        let fileContent = fs.readFileSync(constantsPath, 'utf8');

        // This extracts the object assigned to initialProgrammeData without needing a TS transpiler.
        const objectString = fileContent.substring(fileContent.indexOf('{'), fileContent.lastIndexOf(';') + 1);
        initialProgrammeData = new Function(`return ${objectString}`)();
    });

    it('should contain all Jewellery Design courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'BJDT111', 'ACDT112', 'ACDT113', 'ACDT114', 'ACDT115', 'ACDT116', 'BJDT121', 'BJDT122', 'BJDT123', 'BJDT125', 'ACDT125', 'ACDT126',
            'BJDT231', 'BJDT232', 'BJDT233', 'BJDT234', 'BJDT235', 'BJDT236', 'ACDT237', 'BJDT241', 'BJDT242', 'BJDT243', 'BJDT244', 'BJDT245', 'BJDT246', 'BJDT247',
            'BJDT351', 'BJDT352', 'BJDT353', 'BJDT354', 'BJDT355', 'ACDT356', 'ACDT357', 'BJDT361', 'BJDT362', 'BJDT363', 'BJDT364', 'BJDT365', 'ACDT367',
            'BJDT471', 'BJDT472', 'BJDT481', 'BJDT482', 'BJDT483', 'BJDT484', 'BJDT485', 'ACDT486'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'jd');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));
        
        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });
    
    it('should contain all Digital Media courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'DMCD111', 'DMCD112', 'DMCD113', 'DMCD114', 'ACDT114-DM', 'ACDT115-DM', 'ACDT116-DM', 'DMCD121', 'DMCD122', 'DMCD123', 'DMCD124', 'ACDT124', 'ACDT125-DM', 'ACDT126-DM',
            'DMCD231', 'DMCD232', 'DMCD233', 'DMCD234', 'DMCD235', 'DMCD236', 'ACDT231', 'DMCD241', 'DMCD242', 'DMCD243', 'DMCD244', 'DMCD245',
            'DMCD351', 'DMCD352', 'DMCD353', 'DMCD354', 'DMCD355', 'ACDT351', 'DMCD361', 'DMCD362', 'DMCD363', 'DMCD364', 'ACDT361', 'DMCD365', 'DMCD366',
            'DMCD471', 'DMCD472', 'DMCD473', 'DMCD474', 'ACDT471', 'DMCD481', 'DMCD482', 'DMCD483', 'DMCD484'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'dm');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));
        
        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });

    it('should contain all Fashion Design courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'FDT151', 'FDT153', 'FDT155', 'FDT157', 'FDT159', 'ACDT114', 'ACDT117', 'ACDT115', 'ACDT116', 'FDT150', 'FDT152', 'FDT154', 'FDT156', 'FDT158', 'FDT160', 'ACDT127', 'ACDT126', 'WEL150',
            'FDT251', 'FDT253', 'FDT255', 'FDT257', 'FDT259', 'FDT261', 'FDT263', 'FDT265', 'FDT267', 'FDT250', 'FDT252', 'FDT254', 'FDT256', 'FDT258', 'FDT260', 'FDT262', 'FDT264', 'WEL250',
            'FDT351', 'FDT353', 'FDT355', 'FDT357', 'FDT359', 'FDT361', 'FDT363', 'ACDT367', 'WEL350', 'FDT352',
            'FDT451', 'FDT453', 'FDT455', 'FDT457', 'FDT459', 'FDT450', 'FDT452', 'FDT454', 'FDT460', 'FDT464'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'fd');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));

        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });

    it('should contain all Product Design courses from the PDF', () => {
        const expectedCourseCodes = new Set([
            'BPDE111', 'ACDT112', 'ACDT113', 'ACDT114', 'ACDT115', 'ACDT116', 'ACDT117', 'BPDE121', 'BPDE122', 'BPDE123', 'BPDE125', 'ACDT125', 'ACDT126', 'ACDT127',
            'BPDE231', 'BPDE232', 'BPDE233', 'BPDE234', 'BPDE235', 'BPDE236', 'BPDE237', 'BPDE241', 'BPDE242', 'BPDE243', 'BPDE244', 'BPDE245', 'BPDE246', 'ACDT247',
            'BPDE351', 'BPDE352', 'BPDE353', 'BPDE354', 'BPDE355', 'ACDT356', 'BPDE361', 'BPDE362', 'BPDE363', 'BPDE364', 'BPDE365', 'ACDT367',
            'BPDE471', 'BPDE472', 'BPDE481', 'BPDE482', 'BPDE483', 'BPDE484', 'ACDT485'
        ]);

        const programme = initialProgrammeData.programmes.find(p => p.id === 'pd');
        const actualCourseCodes = new Set(Object.values(programme.assessments).flat().map(asm => asm.id));
        
        expect(actualCourseCodes).toEqual(expectedCourseCodes);
    });
});

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
    "noEmit": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  }
}
```

### FILE: types.ts
```typescript

export interface Assessment {
  id: string;
  title: string;
  duration: number;
  questions: number;
}

export interface Programme {
  id: string;
  name: string;
  assessments: {
    [year: string]: Assessment[];
  };
}

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface ProgrammeData {
  programmes: Programme[];
  questions: {
    [assessmentId: string]: Question[];
  };
}

export interface Results {
  score: number;
  total: number;
  answers: { [key: number]: string };
  questions: Question[];
  assessmentId: string;
  assessmentTitle: string;
}

export interface LogEntry {
    timestamp: string;
    eventType: string;
    [key: string]: any;
}

export type View = 'dashboard' | 'programmeDetail' | 'assessment' | 'results' | 'admin' | 'login';

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
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
      plugins: [react(), tailwindcss()],
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

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.e2e.ts'],
    testTimeout: 30000,
  },
});

```

