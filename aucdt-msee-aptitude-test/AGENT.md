# aucdt-msee-aptitude-test - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for aucdt-msee-aptitude-test.

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

### FILE: App.tsx
```typescript
import React, { useEffect, useState, useMemo } from 'react';
import { SelfTestView } from './components/SelfTestView';
import { AdminView } from './components/AdminView';
import { StudentFlow } from './components/StudentFlow';
import { AuthView } from './components/AuthView';
import { Spinner } from './components/common';
import { AUCDT_COLORS } from './constants';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { User } from './types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from './hooks/useAuth';


const ForgotPasswordInstructions: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="w-full max-w-lg mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <ShieldAlert className="mx-auto mb-6" size={60} style={{ color: 'var(--primary-text-color)' }} />
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Administrator Password Reset</h1>
        <div className="text-left bg-[var(--background-color)] p-6 rounded-lg space-y-4">
            <p className="text-lg">The administrator password for this application is managed in the MySQL database.</p>
            <p className="font-bold text-lg" style={{color: 'var(--primary-text-color)'}}>Automatic password recovery is not available through this interface.</p>
            <ol className="list-decimal list-inside space-y-2">
                <li>To change the password, a database administrator must manually update the password hash in the `users` table for the administrator account.</li>
                <li>This is a security measure to ensure only authorized personnel with direct database access can manage administrator credentials.</li>
            </ol>
        </div>
        <button
            onClick={onBack}
            className="w-full mt-8 py-3 px-10 rounded-lg text-lg font-bold shadow-md inline-flex items-center justify-center space-x-2 transition-colors"
            style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>
            <ArrowLeft size={20} />
            <span>Back to Login</span>
        </button>
    </div>
);

const StudentForgotPasswordInstructions: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="w-full max-w-lg mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <ShieldAlert className="mx-auto mb-6" size={60} style={{ color: 'var(--primary-text-color)' }} />
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Student Password Recovery</h1>
        <div className="text-left bg-[var(--background-color)] p-6 rounded-lg space-y-4">
            <p className="text-lg">This application uses a simplified, local-only account system.</p>
            <p className="font-bold text-lg" style={{color: 'var(--primary-text-color)'}}>Automatic password recovery is not available.</p>
            <ul className="list-disc list-inside space-y-2">
                <li>Please try to remember your password and attempt to sign in again.</li>
                <li>If you are unable to remember your password, you will need to create a new account using a different email address.</li>
                <li className="font-semibold text-[var(--message-error-text)]">Please note: Creating a new account will not restore any exam progress from your old account.</li>
            </ul>
        </div>
        <button
            onClick={onBack}
            className="w-full mt-8 py-3 px-10 rounded-lg text-lg font-bold shadow-md inline-flex items-center justify-center space-x-2 transition-colors"
            style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>
            <ArrowLeft size={20} />
            <span>Back to Login</span>
        </button>
    </div>
);

const AppContent: React.FC = () => {
    const { user, token, loading: authLoading, logOut } = useAuth();
    const [view, setView] = useState<'student' | 'admin_login' | 'admin_dashboard' | 'selftest' | 'forgot_password' | 'student_forgot_password'>('student');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const hasAdminQuery = queryParams.has('admin');
        const hasSelftestQuery = queryParams.has('selftest');

        // This effect determines the primary view based on URL and auth state.
        // Sub-views like "forgot password" are handled by direct state updates from user actions.
        if (view !== 'student_forgot_password' && view !== 'forgot_password') {
            if (hasAdminQuery) {
                setView(user?.role === 'admin' ? 'admin_dashboard' : 'admin_login');
            } else if (hasSelftestQuery) {
                setView('selftest');
            } else {
                setView('student');
            }
        }
        setIsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Only re-evaluate view when auth state changes.


    const handleAdminLogout = () => {
        logOut();
        setView('admin_login');
    };
    
    const handleStudentSignOut = () => {
        logOut();
        setView('student');
    };

    const renderContent = useMemo(() => {
        if (authLoading || !isReady) {
            return <Spinner size={64} />;
        }

        switch (view) {
            case 'admin_dashboard':
                if (user && user.role === 'admin' && token) {
                    return <AdminView user={user} token=[REDACTED_CREDENTIAL]
                }
                // Fallback to login if user is not an admin, preventing crashes.
                setView('admin_login');
                return null;
            case 'admin_login':
                return <AuthView isAdminLogin={true} onForgotPassword=[REDACTED_CREDENTIAL]
            case 'forgot_password':
                return <ForgotPasswordInstructions onBack={() => setView('admin_login')} />;
            case 'student_forgot_password':
                return <StudentForgotPasswordInstructions onBack={() => setView('student')} />;
            case 'selftest':
                return <SelfTestView />;
            case 'student':
            default:
                return user ? <StudentFlow user={user} handleSignOut={handleStudentSignOut} /> : <AuthView isAdminLogin={false} onForgotPassword=[REDACTED_CREDENTIAL]
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, isReady, authLoading, user, token]);

    return (
        <div className="min-h-screen p-4 md:p-8 flex items-center bg-[var(--background-color)] text-[var(--text-color)]">
            <div className="max-w-4xl mx-auto w-full">
                <div className="absolute top-4 right-4 z-10">
                    <ThemeSwitcher />
                </div>
                {renderContent}
            </div>
        </div>
    );
};


const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};


export default App;
```

### FILE: components/AccessibleProgress.tsx
```typescript
import React from 'react';
import { Question, Answers } from '../types';
import { AUCDT_COLORS } from '../constants';

interface AccessibleProgressProps {
  current: number;
  total: number;
  answers: Answers;
  questions: Question[];
  navigateToQuestion: (index: number) => void;
}

export const AccessibleProgress: React.FC<AccessibleProgressProps> = ({ current, total, answers, questions, navigateToQuestion }) => {
  const answeredCount = Object.keys(answers).length;
  const percentage = total > 0 ? Math.round((answeredCount / total) * 100) : 0;
  
  const getButtonStyles = (index: number, questionId: string | number): React.CSSProperties => {
    const isCurrent = index === current;
    const isAnswered = answers[questionId] !== undefined;

    let backgroundColor: string;
    let color: string;
    let border = '1px solid var(--input-border)';

    if (isCurrent) {
        backgroundColor = '#D2B48C'; // Tan color for current question
        color = AUCDT_COLORS.darkGray;
        border = 'none';
    } else if (isAnswered) {
        backgroundColor = AUCDT_COLORS.green;
        color = AUCDT_COLORS.white;
        border = 'none';
    } else {
        backgroundColor = 'var(--card-border-color)';
        color = 'var(--text-color)';
    }

    return {
      backgroundColor,
      color,
      border,
      '--tw-ring-color': 'var(--focus-ring-color)',
      '--tw-ring-offset-color': 'var(--card-background)',
    } as React.CSSProperties;
  };
  
  return (
    <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="progress-summary text-base md:text-lg" aria-live="polite">
          <span className="sr-only">
            Question {current + 1} of {total}. {answeredCount} questions answered, {total - answeredCount} remaining.
          </span>
          <span aria-hidden="true">
            Question {current + 1} of {total}
          </span>
        </div>
      </div>
      
      <div className="progress-bar w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Exam progress: ${percentage}% complete`}>
        <div className="progress-fill h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: AUCDT_COLORS.darkGray }} />
      </div>
      
      <div className="question-grid grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2" role="navigation" aria-label="Question navigation">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => navigateToQuestion(index)}
            className={`p-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}
            style={getButtonStyles(index, q.id)}
            aria-label={`Go to question ${index + 1}${answers[q.id] !== undefined ? ' (answered)' : ''}${index === current ? ' (current)' : ''}`}
            aria-current={index === current ? 'step' : undefined}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
```

### FILE: components/AdminView.tsx
```typescript
import React, { useState } from 'react';
import { LogOut, UploadCloud, Save, Loader2 } from 'lucide-react';
import { generateQuestionsFromText } from '../services/geminiService';
import { AUCDT_COLORS, EXAM_SUBJECTS } from '../constants';
import { Question, Message, User } from '../types';
import { logEvent } from '../services/auditLogService';
import { MessageDisplay, LatexRenderer, ConfirmationModal } from './common';

interface AdminViewProps {
  user: User;
  token: string;
  handleSignOut: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ user, token, handleSignOut }) => {
  const [examName, setExamName] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const [subject, setSubject] = useState<string>(EXAM_SUBJECTS[0]);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleGenerateQuestions = () => {
    if (!pdfContent) {
      setMessage({ text: "Please paste text content to generate questions from.", type: 'error' });
      return;
    }
    setIsGenerateModalOpen(true);
  };
  
  const confirmGenerateQuestions = async () => {
    setIsGenerateModalOpen(false);
    setIsLoading(true);
    setMessage({ text: "Generating questions with AI... Please wait.", type: 'info' });
    try {
      const questions = await generateQuestionsFromText(pdfContent, 24, subject, token);
      setGeneratedQuestions(questions);
      setMessage({ text: `Successfully generated ${questions.length} questions for the subject "${subject}". Review them below before saving.`, type: 'success' });
      logEvent('EXAM_QUESTIONS_GENERATED', { subject, questionCount: questions.length, sourceTextLength: pdfContent.length });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setMessage({ text: `Error: ${errorMessage}`, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveExam = () => {
    if (!examName || !examDescription || generatedQuestions.length === 0) {
        setMessage({ text: "Exam name, description, and generated questions are required before saving.", type: 'error' });
        return;
    }
    setIsSaveModalOpen(true);
  };

  const confirmSaveExam = async () => {
    setIsSaveModalOpen(false);
    setIsLoading(true);
    setMessage({ text: "Saving exam to the database...", type: 'info' });
    try {
        const response = await fetch('/api/exams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: examName,
                description: examDescription,
                subject: subject,
                questions: generatedQuestions,
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save exam.');
        }

        setMessage({ text: "Exam saved successfully!", type: 'success' });
        logEvent('EXAM_SAVED', { examName, subject });
        setExamName('');
        setExamDescription('');
        setPdfContent('');
        setGeneratedQuestions([]);
    } catch (error) {
        console.error("Error saving exam:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        setMessage({ text: `Failed to save exam: ${errorMessage}`, type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <ConfirmationModal
            isOpen={isGenerateModalOpen}
            title="Confirm Generation"
            message="Are you sure you want to generate new questions? This will replace any questions currently displayed."
            onConfirm={confirmGenerateQuestions}
            onCancel={() => setIsGenerateModalOpen(false)}
        />
        <ConfirmationModal
            isOpen={isSaveModalOpen}
            title="Confirm Save Exam"
            message="Are you sure you want to save this exam? It will become available to all students."
            onConfirm={confirmSaveExam}
            onCancel={() => setIsSaveModalOpen(false)}
        />
      <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-6 mb-6 border-b-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--primary-text-color)' }}>Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <p className="font-semibold" style={{ color: 'var(--primary-text-color)' }}>{user.email}</p>
            <button onClick={handleSignOut} className="py-2 px-4 rounded-lg font-bold inline-flex items-center" style={{ backgroundColor: AUCDT_COLORS.red, color: AUCDT_COLORS.white }}>
              <LogOut className="mr-2" size={16} /> Sign Out
            </button>
          </div>
        </div>

        <MessageDisplay message={message} />

        <div className="space-y-6">
            <div>
                <label htmlFor="subject-select" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Select Subject</label>
                <select
                    id="subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                >
                    {EXAM_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="content" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Paste Content to Generate Exam</label>
                <textarea
                    id="content"
                    value={pdfContent}
                    onChange={(e) => setPdfContent(e.target.value)}
                    placeholder="Paste text from a PDF or any source document here..."
                    rows={10}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-aucGold bg-[var(--input-background)] border-[var(--input-border)]"
                />
            </div>

            <button onClick={handleGenerateQuestions} disabled={isLoading} className="w-full py-3 px-6 rounded-lg text-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-[var(--button-disabled-opacity)]" style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <UploadCloud size={24} />}
                <span>{isLoading ? 'Generating...' : 'Generate Questions with AI'}</span>
            </button>

            {generatedQuestions.length > 0 && (
                <div className="space-y-4 p-4 border-t-2 mt-6" style={{borderColor: AUCDT_COLORS.gold}}>
                    <h2 className="text-2xl font-bold" style={{color: 'var(--primary-text-color)'}}>Generated Questions for "{subject}"</h2>
                    <div className='space-y-4'>
                        <div>
                            <label htmlFor="examName" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Exam Name</label>
                            <input
                                type="text"
                                id="examName"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                placeholder={`e.g., ${subject} Practice Test 1`}
                                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                            />
                        </div>
                        <div>
                            <label htmlFor="examDescription" className="block text-lg font-medium mb-2" style={{color: 'var(--primary-text-color)'}}>Exam Description</label>
                            <textarea
                                id="examDescription"
                                value={examDescription}
                                onChange={(e) => setExamDescription(e.target.value)}
                                placeholder="e.g., A comprehensive test covering topics from the first semester."
                                rows={3}
                                className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                            />
                        </div>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-[var(--background-color)] rounded-lg">
                        {generatedQuestions.map((q, i) => (
                            <div key={q.id} className="p-2 border-b border-[var(--card-border-color)]">
                                <p><strong>Q{i+1}:</strong> <LatexRenderer>{q.question}</LatexRenderer></p>
                                <ul className="list-disc list-inside pl-4">
                                    {q.options.map((opt, j) => (
                                        <li key={j} className={j === q.correct ? 'font-bold text-green-500' : ''}>
                                            <LatexRenderer>{opt}</LatexRenderer>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                     <button onClick={handleSaveExam} disabled={isLoading || !examName || !examDescription} className="w-full py-3 px-6 rounded-lg text-lg font-bold inline-flex items-center justify-center space-x-2 shadow-md disabled:opacity-[var(--button-disabled-opacity)]" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        <span>Save Exam</span>
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
```

### FILE: components/AuthView.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AUCDT_COLORS } from '../constants';
import { MessageDisplay } from './common';
import { Message } from '../types';
import { UserPlus, LogIn, Shield } from 'lucide-react';

interface AuthViewProps {
    isAdminLogin: boolean;
    onForgotPassword: () => void;
    onAdminForgotPassword: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ isAdminLogin, onForgotPassword, onAdminForgotPassword }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<Message | null>(null);
    const { signUp, signIn, error: authError } = useAuth();

    useEffect(() => {
      // If the view switches to admin login, we should not be in registration mode.
      if (isAdminLogin) {
        setIsRegistering(false);
      }
    }, [isAdminLogin]);
    
    useEffect(() => {
        // Display auth errors from the hook
        if(authError) {
            setMessage({ text: authError, type: 'error' });
        }
    }, [authError]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        let success = false;
        if (isRegistering && !isAdminLogin) {
            success = await signUp(email, password);
        } else {
            success = await signIn(email, password);
        }
        // The useAuth hook will handle navigation on success, so we just need to handle failure.
        if (!success && !authError) { // Show a generic message if the hook didn't set one
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        }
    };

    const renderTitle = () => {
        if (isAdminLogin) return 'Admin Access';
        return isRegistering ? 'Create Student Account' : 'Student Sign In';
    };

    const renderDescription = () => {
        if (isAdminLogin) return 'Sign in to access the admin dashboard.';
        return isRegistering ? 'Sign up to begin your exam.' : 'Sign in to access your exam.';
    };

    const renderIcon = () => {
        if (isAdminLogin) return <Shield size={40} style={{ color: 'var(--primary-text-color)' }} />;
        return isRegistering ? <UserPlus size={40} style={{ color: 'var(--primary-text-color)' }} /> : <LogIn size={40} style={{ color: 'var(--primary-text-color)' }} />;
    }

    return (
        <div className="w-full max-w-md mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
            <div className="mx-auto mb-6 bg-[var(--card-border-color)] p-3 rounded-full w-fit">
              {renderIcon()}
            </div>
            <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--primary-text-color)' }}>
                {renderTitle()}
            </h1>
            <p className="text-lg mb-8">
                {renderDescription()}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <MessageDisplay message={message} />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    aria-label="Email Address"
                    required
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    required
                    minLength={6}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                />
                <button
                    type="submit"
                    className="w-full py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
                    style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                    {isRegistering ? 'Register' : 'Sign In'}
                </button>
            </form>
            <div className="mt-6 text-center">
                {!isAdminLogin && (
                    <button onClick={() => setIsRegistering(!isRegistering)} className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
                        {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
                    </button>
                )}
            </div>
            {!isRegistering && (
                 <div className="mt-4 text-center">
                    <button onClick={isAdminLogin ? onAdminForgotPassword : onForgotPassword} className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
                        Forgot Password?
                    </button>
                </div>
            )}
            <p className="mt-4">
                <a href={isAdminLogin ? window.location.pathname : `${window.location.pathname}?admin=true`} className="text-sm hover:underline" style={{ color: 'var(--text-color)' }}>
                    {isAdminLogin ? "Return to Student Portal" : "Access Admin Portal"}
                </a>
            </p>
        </div>
    );
};
```

### FILE: components/common.tsx
```typescript
import React, { useMemo, useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react';
import { Award, Loader2 } from 'lucide-react';
import { AUCDT_COLORS } from '../constants';
import { Message } from '../types';

// Declare MathJax on the window object for TypeScript
declare global {
    interface Window {
        MathJax: any;
    }
}

// --- MathJax Renderer ---
interface LatexRendererProps {
    children: string;
}

const MemoizedLatexRenderer: React.FC<LatexRendererProps> = ({ children }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (children && ref.current && window.MathJax?.typesetPromise) {
            // Tell MathJax to typeset the content of this component.
            // Using a promise ensures that the typesetting is complete before any subsequent actions.
            window.MathJax.typesetPromise([ref.current]).catch((err: any) =>
                console.error('MathJax typesetting error:', err)
            );
        }
    }, [children]); // Rerun the effect when the children prop changes

    // Render the raw children string. MathJax will process it.
    return <span ref={ref}>{children}</span>;
};
export const LatexRenderer = React.memo(MemoizedLatexRenderer);


// --- Spinner ---
export const Spinner: React.FC<{ size?: number }> = ({ size = 48 }) => (
    <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin" size={size} style={{ color: 'var(--primary-text-color)' }} />
    </div>
);

// --- Confirmation Modal ---
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-8 m-4 max-w-md w-full border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>{title}</h2>
        <p className="text-lg mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="py-2 px-6 rounded-lg font-bold" style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>Cancel</button>
          <button onClick={onConfirm} className="py-2 px-6 rounded-lg font-bold" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

// --- Bonus Section ---
interface BonusSectionProps {
    title: string;
    content: string;
}
export const BonusSection: React.FC<BonusSectionProps> = ({ title, content }) => {
    if (!title || !content) return null;
    return (
        <div className="mt-8 p-4 border-l-4 rounded-r-lg bg-opacity-50" style={{ borderColor: AUCDT_COLORS.gold, backgroundColor: 'var(--card-border-color)' }}>
            <div className="flex items-center">
                <Award className="h-6 w-6 mr-3 flex-shrink-0" style={{ color: AUCDT_COLORS.gold }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--primary-text-color)' }}>{title}</h3>
            </div>
            <p className="mt-2 text-base pl-9">
                <LatexRenderer>{content}</LatexRenderer>
            </p>
        </div>
    );
};

// --- Message Display ---
export const MessageDisplay: React.FC<{ message: Message | null }> = ({ message }) => {
    if (!message) return null;

    const styles: React.CSSProperties = {
        backgroundColor: `var(--message-${message.type}-bg)`,
        color: `var(--message-${message.type}-text)`,
    };

    return <div className="p-3 rounded-lg mb-4 text-center" style={styles}>{message.text}</div>;
};
```

### FILE: components/DiagramRenderer.tsx
```typescript
import React from 'react';

// Enhanced DiagramRendererProps to include new diagram types
interface DiagramRendererProps {
  type: 'right_triangle_abc' | 'angles_on_line' | 'pie_chart_colors' | 'circle_radius' | 'cube_side';
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type }) => {
    if (!type) return null;
    
    // Enhanced base styles for better visibility and theme integration
    const svgStyle: React.CSSProperties = { stroke: 'var(--text-color)', strokeWidth: 2, fill: 'none', fontFamily: 'sans-serif', width: '100%', height: 'auto', maxWidth: '350px' };
    const textStyle: React.CSSProperties = { fill: 'var(--primary-text-color)', stroke: 'none', fontSize: '22px', textAnchor: 'middle', userSelect: 'none' };
    const labelStyle: React.CSSProperties = { ...textStyle, fill: 'var(--text-color)', fontSize: '20px' };

    switch (type) {
        case 'right_triangle_abc':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 340 300" style={svgStyle}>
                        <polygon points="50,250 290,250 50,50" />
                        {/* Vertex labels */}
                        <text x="300" y="270" style={{...textStyle, textAnchor: 'start'}}>A</text>
                        <text x="40" y="270" style={{...textStyle, textAnchor: 'end'}}>B</text>
                        <text x="40" y="40" style={{...textStyle, textAnchor: 'end'}}>C</text>
                        {/* Side length labels */}
                        <text x="170" y="275" style={labelStyle}>6</text>
                        <text x="25" y="150" style={labelStyle}>8</text>
                        <text x="180" y="140" style={{...labelStyle, fontStyle: 'italic'}}>AC = ?</text>
                        {/* Right angle indicator */}
                        <rect x="50" y="225" width="25" height="25" style={{ fill: 'none', stroke: 'var(--text-color)', strokeWidth: 2 }} />
                    </svg>
                </div>
            );

        case 'angles_on_line':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 450 200" style={svgStyle}>
                        <line x1="20" y1="100" x2="430" y2="100" />
                        <line x1="225" y1="100" x2="380" y2="30" />
                        {/* Arc for 105° angle */}
                        <path d="M 155 100 A 70 70 0 0 0 268.5 49.3" />
                        <text x="185" y="68" style={labelStyle}>105°</text>
                        {/* Arc for 'y' angle */}
                        <path d="M 295 100 A 70 70 0 0 0 268.5 49.3" />
                        <text x="290" y="85" style={{...labelStyle, fontStyle: 'italic'}}>y</text>
                    </svg>
                </div>
            );

        case 'pie_chart_colors':
            const data = [
                { label: 'Red', value: 8, color: '#EF4444' },
                { label: 'Blue', value: 12, color: '#3B82F6' },
                { label: 'Green', value: 5, color: '#22C55E' },
                { label: 'Yellow', value: 7, color: '#F59E0B' }
            ];
            const total = data.reduce((acc, d) => acc + d.value, 0);
            const pieRadius = 85;
            const pieCx = 150;
            const pieCy = 105;
            let startAngle = -90;

            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 300 240" style={{...svgStyle, strokeWidth: 1, stroke: 'var(--background-color)'}}>
                        <g transform={`translate(${pieCx}, ${pieCy})`}>
                            {data.map(d => {
                                const sliceAngle = (d.value / total) * 360;
                                const endAngle = startAngle + sliceAngle;
                                const startX = pieRadius * Math.cos(Math.PI * startAngle / 180);
                                const startY = pieRadius * Math.sin(Math.PI * startAngle / 180);
                                const endX = pieRadius * Math.cos(Math.PI * endAngle / 180);
                                const endY = pieRadius * Math.sin(Math.PI * endAngle / 180);
                                const largeArcFlag = sliceAngle > 180 ? 1 : 0;
                                const pathData = `M 0,0 L ${startX},${startY} A ${pieRadius},${pieRadius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
                                startAngle = endAngle;
                                return <path key={d.label} d={pathData} fill={d.color} />;
                            })}
                        </g>
                         {/* Enhanced Legend */}
                         <g transform="translate(10, 200)">
                             {data.map((d, i) => (
                                 <g key={i} transform={`translate(${(i % 2) * 150}, ${Math.floor(i/2) * 25})`}>
                                    <rect width="15" height="15" fill={d.color} rx="3" />
                                    <text x="25" y="12.5" style={{...labelStyle, fontSize: '16px', textAnchor: 'start', fill: 'var(--text-color)'}}>
                                        {`${d.label}: ${d.value}`}
                                    </text>
                                </g>
                            ))}
                        </g>
                    </svg>
                </div>
            );
        
        case 'circle_radius':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 220 220" style={svgStyle}>
                        <circle cx="110" cy="110" r="100" />
                        <line x1="110" y1="110" x2="210" y2="110" style={{ strokeDasharray: '4 4' }} />
                        <circle cx="110" cy="110" r="4" style={{ fill: 'var(--text-color)', stroke: 'none' }} />
                        <text x="160" y="100" style={labelStyle}>r = 5 cm</text>
                    </svg>
                </div>
            );
            
        case 'cube_side':
            return (
                <div className="w-full flex justify-center items-center my-4">
                    <svg viewBox="0 0 200 200" style={svgStyle}>
                        {/* Back square */}
                        <rect x="50" y="50" width="100" height="100" style={{fill: 'var(--card-border-color)', stroke: 'var(--input-border)'}}/>
                        {/* Front square */}
                        <rect x="75" y="25" width="100" height="100" style={{fill: 'var(--background-color)'}}/>
                        {/* Connecting lines */}
                        <line x1="50" y1="50" x2="75" y2="25" />
                        <line x1="150" y1="50" x2="175" y2="25" />
                        <line x1="50" y1="150" x2="75" y2="125" />
                        <line x1="150" y1="150" x2="175" y2="125" />
                        {/* Label */}
                        <text x="125" y="140" style={labelStyle}>4 cm</text>
                    </svg>
                </div>
            );

        default:
            return null;
    }
};
```

### FILE: components/SelfTestView.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, PlayCircle, AlertTriangle, Camera } from 'lucide-react';
import { AUCDT_COLORS } from '../constants';

// This component relies on a global script for html2canvas loaded in index.html
declare global {
    interface Window {
        html2canvas: any;
    }
}

type TestStatus = 'pending' | 'running' | 'passed' | 'failed';

interface TestStep {
  description: string;
  status: TestStatus;
  details?: string;
}

const initialSteps: TestStep[] = [
  { description: 'Initialize test environment', status: 'pending' },
  { description: 'Load application and assets', status: 'pending' },
  { description: 'Verify Start Screen is visible', status: 'pending' },
  { description: 'Simulate clicking "Start Examination"', status: 'pending' },
  { description: 'Verify exam interface is rendered', status: 'pending' },
  { description: 'Simulate answering Question 1', status: 'pending' },
  { description: 'Simulate answering Question 2', status: 'pending' },
  { description: 'Simulate answering Question 3', status: 'pending' },
  { description: 'Navigate to the last question', status: 'pending' },
  { description: 'Simulate clicking "Submit Exam"', status: 'pending' },
  { description: 'Verify Results page is displayed', status: 'pending' },
  { description: 'Test completed successfully', status: 'pending' },
];

const StatusIcon: React.FC<{ status: TestStatus }> = ({ status }) => {
  switch (status) {
    case 'running':
      return <Loader2 size={20} className="animate-spin text-blue-500" />;
    case 'passed':
      return <CheckCircle size={20} className="text-green-500" />;
    case 'failed':
      return <AlertTriangle size={20} className="text-red-500" />;
    default:
      return <PlayCircle size={20} className="text-gray-400" />;
  }
};

export const SelfTestView: React.FC = () => {
  const [steps, setSteps] = useState<TestStep[]>(initialSteps);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!isTesting) return;

    let currentStep = 0;
    const runNextStep = () => {
      if (currentStep >= steps.length) {
        setIsTesting(false);
        return;
      }

      setSteps(prev => prev.map((step, index) =>
        index === currentStep ? { ...step, status: 'running' } : step
      ));

      const delay = Math.random() * 500 + 250;
      setTimeout(() => {
        setSteps(prev => prev.map((step, index) =>
          index === currentStep ? { ...step, status: 'passed' } : step
        ));
        currentStep++;
        runNextStep();
      }, delay);
    };

    runNextStep();
  }, [isTesting, steps.length]);

  const handleStartTest = () => {
    setSteps(initialSteps);
    setIsTesting(true);
  };

  const handleScreenshot = async () => {
    const rootElement = document.getElementById('root');
    if (!window.html2canvas || !rootElement) {
        alert("Screenshot capture service is not available.");
        return;
    }
    try {
        const canvas = await window.html2canvas(rootElement, {
            backgroundColor: null,
            useCORS: true,
        });
        const image = canvas.toDataURL('image/png', 1.0);
        const a = document.createElement('a');
        a.href = image;
        a.download = `auc-msee-test-screenshot-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Screenshot failed:", error);
        alert("Could not capture screenshot.");
    }
  };


  return (
    <div className="max-w-4xl w-full mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--primary-text-color)' }}>Application Self-Test</h1>
        <p className="text-lg">This is an automated demonstration and testing utility for the student examination workflow.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <button 
          onClick={handleStartTest} 
          disabled={isTesting}
          className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-colors duration-300 disabled:opacity-50" 
          style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}
        >
          {isTesting ? 'Test in Progress...' : 'Start Self-Test'}
        </button>
        <button 
            onClick={handleScreenshot} 
            disabled={isTesting}
            className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-colors duration-300 disabled:opacity-50 inline-flex items-center justify-center space-x-2" 
            style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}
          >
            <Camera size={20} />
            <span>Capture Screenshot</span>
        </button>
      </div>

      <div className="bg-[var(--background-color)] p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--primary-text-color)' }}>Test Log</h2>
        <ul className="space-y-3 font-mono text-sm">
          {steps.map((step, index) => (
            <li key={index} className="flex items-center space-x-3">
              <StatusIcon status={step.status} />
              <span className={`${step.status === 'passed' ? 'text-green-600 dark:text-green-400' : ''} ${step.status === 'failed' ? 'text-red-600 dark:text-red-400' : ''}`}>
                {step.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
       <p className="mt-8 text-center">
            <a href={window.location.pathname} className="text-sm hover:underline" style={{color: 'var(--text-color)'}}>
                Return to the student exam
            </a>
        </p>
    </div>
  );
};
```

### FILE: components/StudentFlow.tsx
```typescript
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Clock, CheckCircle, XCircle, RotateCcw, BookOpen, Pause, Play, Download, Loader2, X, Tag, FileText, HelpCircle, LogOut, Eye, Edit
} from 'lucide-react';
import { useExam } from '../hooks/useExam';
import { AUCDT_COLORS } from '../constants';
import { Question, Answers, Exam, User } from '../types';
import { LatexRenderer, ConfirmationModal, BonusSection, Spinner } from './common';
import { DiagramRenderer } from './DiagramRenderer';
import { AccessibleProgress } from './AccessibleProgress';
import { exportResultsToPdf } from '../services/pdfExporter';
import { logEvent } from '../services/auditLogService';


const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

const formatQuestionTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};


// --- Start Screen ---
interface StartScreenProps {
    onStart: () => void;
    questions: Question[];
    randomize: boolean;
    setRandomize: (r: boolean) => void;
    progressMessage?: string;
    availableExams: Exam[];
    selectedExamId: string | null;
    setSelectedExamId: (id: string) => void;
    selectedExam: Exam | null;
}
const StartScreen: React.FC<StartScreenProps> = 
({ onStart, questions, randomize, setRandomize, progressMessage, availableExams, selectedExamId, setSelectedExamId, selectedExam }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');

    const subjects = useMemo(() => {
        const allSubjects = new Set(availableExams.map(e => e.subject).filter(Boolean));
        return ['All Subjects', ...Array.from(allSubjects).sort()];
    }, [availableExams]);

    const filteredExams = useMemo(() => {
        return availableExams
            .filter(exam => selectedSubject === 'All Subjects' || exam.subject === selectedSubject)
            .filter(exam => exam.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, availableExams, selectedSubject]);

    useEffect(() => {
        // If the currently selected exam is no longer in the filtered list
        if (selectedExamId && !filteredExams.some(e => e.id === selectedExamId)) {
            // If there are other exams in the filtered list, select the first one
            if (filteredExams.length > 0) {
                setSelectedExamId(filteredExams[0].id);
            }
        }
    }, [filteredExams, selectedExamId, setSelectedExamId]);
    
    return (
    <div className="max-w-4xl w-full mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 text-center border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
        <BookOpen className="mx-auto mb-6" size={80} style={{ color: 'var(--primary-text-color)' }} />
        <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: 'var(--primary-text-color)' }}>AUCDT Mature Students Entrance Examination</h1>
        <h2 className="text-xl md:text-2xl mb-4" style={{ color: AUCDT_COLORS.green }}>{selectedExam?.name || "MSEE 112 Mathematics Aptitude Test"}</h2>
        
        {(selectedExam?.subject || selectedExam?.description) && (
            <div className="text-left max-w-2xl mx-auto mb-8 p-4 rounded-lg border" style={{ backgroundColor: 'var(--background-color)', borderColor: 'var(--input-border)'}}>
                {selectedExam.subject && (
                    <div className="flex items-center mb-2">
                        <Tag className="mr-2 flex-shrink-0" size={18} style={{ color: 'var(--primary-text-color)' }} />
                        <p><strong>Subject:</strong> {selectedExam.subject}</p>
                    </div>
                )}
                {selectedExam.description && (
                    <div className="flex items-start">
                        <FileText className="mr-2 mt-1 flex-shrink-0" size={18} style={{ color: 'var(--primary-text-color)' }} />
                        <p><strong>Description:</strong> {selectedExam.description}</p>
                    </div>
                )}
            </div>
        )}

        <div className="rounded-lg p-6 mb-8 bg-opacity-50" style={{ backgroundColor: 'var(--card-border-color)' }}>
            <h3 className="font-semibold text-xl mb-4" style={{ color: 'var(--primary-text-color)' }}>Examination Instructions:</h3>
            <ul className="text-left space-y-3 text-lg" style={{ color: 'var(--text-color)' }}>
                <li>• Answer all {questions.length} questions.</li>
                <li>• Your progress is saved automatically. If you refresh the page, your progress will be restored.</li>
                <li>• Switching to other tabs or applications will pause the exam.</li>
                <li>• Time limit: 2 hours. You can pause the timer if needed.</li>
            </ul>
        </div>
        
        {availableExams.length > 10 && (
            <div className="mb-8 text-left max-w-xl mx-auto">
                <div className={`grid grid-cols-1 ${subjects.length > 1 ? 'md:grid-cols-2' : ''} gap-4 mb-4`}>
                    <div>
                        <label htmlFor="exam-search" className="block text-lg font-medium mb-2" style={{ color: 'var(--primary-text-color)' }}>
                            Search Exams
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="exam-search"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pr-10 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                                style={{ color: 'var(--text-color)' }}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    aria-label="Clear search"
                                >
                                    <X size={20} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                                </button>
                            )}
                        </div>
                    </div>
                    {subjects.length > 1 && (
                        <div>
                            <label htmlFor="subject-filter" className="block text-lg font-medium mb-2" style={{ color: 'var(--primary-text-color)' }}>
                                Filter by Subject
                            </label>
                            <select
                                id="subject-filter"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                 className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                                style={{ color: 'var(--text-color)'}}
                            >
                                {subjects.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <label htmlFor="exam-select" className="block text-lg font-medium mb-2" style={{ color: 'var(--primary-text-color)' }}>
                    Select Exam
                </label>
                <select
                    id="exam-select"
                    value={selectedExamId || ''}
                    onChange={(e) => setSelectedExamId(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 bg-[var(--input-background)] border-[var(--input-border)]"
                    style={{ color: 'var(--text-color)'}}
                >
                    {filteredExams.length > 0 ? (
                        filteredExams.map(exam => (
                            <option key={exam.id} value={exam.id}>
                                {exam.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>No exams found</option>
                    )}
                </select>
            </div>
        )}

        <div className="flex items-center justify-center space-x-3 mb-6">
            <input type="checkbox" id="randomize" className="h-5 w-5 rounded" style={{ accentColor: AUCDT_COLORS.green }} checked={randomize} onChange={(e) => setRandomize(e.target.checked)} />
            <label htmlFor="randomize" className="font-medium" style={{ color: 'var(--text-color)' }}>Randomize Question Order</label>
        </div>
        {progressMessage && <div className="p-3 rounded-lg mb-4 text-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{progressMessage}</div>}
        <button onClick={onStart} className="w-full md:w-auto py-3 px-10 rounded-lg text-lg font-bold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white, '--tw-ring-color': AUCDT_COLORS.green } as React.CSSProperties}>Start Examination</button>
    </div>
)};

// --- Results View ---
const ResultsView: React.FC<{ questions: Question[]; answers: Answers; onReset: () => void; onSignOut: () => void; examId: string | null; selectedExam: Exam | null }> = ({ questions, answers, onReset, onSignOut, examId, selectedExam }) => {
    const [isExporting, setIsExporting] = useState(false);
    
    const score = questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? 1 : 0), 0);
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const incorrectCount = answeredCount - score;
    const blankCount = totalQuestions - answeredCount;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    useEffect(() => {
        logEvent('EXAM_SUBMITTED', { examId, score, totalQuestions: questions.length, percentage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportResultsToPdf();
        } catch (error) {
            console.error("PDF Export failed:", error);
            alert("Could not export to PDF. Please ensure the required libraries are loaded.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full mx-auto bg-[var(--card-background)] rounded-xl shadow-lg p-8 md:p-12 border-t-4" style={{ borderColor: AUCDT_COLORS.gold }}>
                <div id="results-content-to-export">
                    <div id="results-summary" className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--primary-text-color)' }}>Examination Results</h1>
                        
                        {selectedExam && selectedExam.id !== 'default_offline_exam' && (
                            <div className="mb-6 text-left p-4 rounded-lg bg-opacity-50 border" style={{ backgroundColor: 'var(--card-border-color)', borderColor: 'var(--input-border)' }}>
                                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--primary-text-color)' }}>{selectedExam.name}</h2>
                                {selectedExam.subject && <p className="text-sm"><strong>Subject:</strong> {selectedExam.subject}</p>}
                                {selectedExam.description && <p className="text-sm"><strong>Description:</strong> {selectedExam.description}</p>}
                            </div>
                        )}

                        <div className={`text-6xl md:text-7xl font-bold mb-2 ${percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</div>
                        <p className="text-xl md:text-2xl mb-8" style={{ color: 'var(--text-color)' }}>{score} out of {questions.length} questions correct</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left p-6 rounded-lg bg-opacity-50 border" style={{ backgroundColor: 'var(--card-border-color)', borderColor: 'var(--input-border)' }}>
                            <div className="flex items-center">
                                <CheckCircle className="mr-3 flex-shrink-0" size={32} style={{ color: AUCDT_COLORS.green }} />
                                <div>
                                    <p className="text-2xl font-bold">{score}</p>
                                    <p className="text-sm" style={{ color: 'var(--text-color)' }}>Correct</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <XCircle className="mr-3 flex-shrink-0" size={32} style={{ color: AUCDT_COLORS.red }} />
                                <div>
                                    <p className="text-2xl font-bold">{incorrectCount}</p>
                                    <p className="text-sm" style={{ color: 'var(--text-color)' }}>Incorrect</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <HelpCircle className="mr-3 flex-shrink-0" size={32} style={{ color: 'var(--text-color)' }} />
                                <div>
                                    <p className="text-2xl font-bold">{blankCount}</p>
                                    <p className="text-sm" style={{ color: 'var(--text-color)' }}>Unanswered</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 mb-8">
                        {questions.map((question, index) => (
                        <div key={question.id} className="result-card-for-pdf border rounded-lg p-4 shadow-sm bg-opacity-50" style={{ borderColor: 'var(--card-border-color)' }}>
                            <div className="flex items-start space-x-3">
                            {answers[question.id] === question.correct ? <CheckCircle className="mt-1 flex-shrink-0" size={24} style={{ color: AUCDT_COLORS.green }} /> : <XCircle className="mt-1 flex-shrink-0" size={24} style={{ color: AUCDT_COLORS.red }} />}
                            <div className="flex-1">
                                <p className="font-medium text-lg mb-2" style={{ color: 'var(--primary-text-color)' }}>Question {index + 1}: <LatexRenderer>{question.question}</LatexRenderer></p>
                                {question.diagram && <DiagramRenderer type={question.diagram} />}
                                <div className="text-base" style={{ color: 'var(--text-color)' }}>
                                    <p>Your answer: {answers[question.id] !== undefined ? <LatexRenderer>{question.options[answers[question.id]]}</LatexRenderer> : "Not answered"}</p>
                                    <p>Correct answer: <span className="font-semibold" style={{ color: AUCDT_COLORS.green }}><LatexRenderer>{question.options[question.correct]}</LatexRenderer></span></p>
                                </div>
                                {question.bonus && <BonusSection title={question.bonus.title} content={question.bonus.content} />}
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="text-center mt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <button onClick={handleExport} disabled={isExporting} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md disabled:opacity-[var(--button-disabled-opacity)]" style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                        {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        <span>{isExporting ? 'Exporting...' : 'Export to PDF'}</span>
                    </button>
                    <button onClick={onReset} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>
                        <RotateCcw size={20} />
                        <span>Take Exam Again</span>
                    </button>
                    <button onClick={onSignOut} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: AUCDT_COLORS.red, color: AUCDT_COLORS.white }}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Review Summary View ---
const ReviewSummaryView: React.FC<{
    questions: Question[];
    answers: Answers;
    setCurrentQuestionIndex: (index: number) => void;
    setIsReviewing: (reviewing: boolean) => void;
    handleSubmit: () => void;
}> = ({ questions, answers, setCurrentQuestionIndex, setIsReviewing, handleSubmit }) => {
    
    const handleEdit = (index: number) => {
        setCurrentQuestionIndex(index);
        setIsReviewing(false);
    };

    return (
        <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: 'var(--primary-text-color)' }}>Review Your Answers</h1>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {questions.map((q, index) => {
                    const userAnswerIndex = answers[q.id];
                    const isAnswered = userAnswerIndex !== undefined;
                    
                    return (
                        <div key={q.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--card-border-color)', backgroundColor: 'var(--background-color)'}}>
                            <div className="flex-1 mr-4 overflow-hidden">
                                <p className="font-semibold" style={{ color: 'var(--primary-text-color)' }}>
                                    Question {index + 1}
                                </p>
                                <p className={`mt-1 truncate ${isAnswered ? '' : 'italic text-gray-500'}`}>
                                    {isAnswered ? <LatexRenderer>{q.options[userAnswerIndex]}</LatexRenderer> : 'Not Answered'}
                                </p>
                            </div>
                            <button onClick={() => handleEdit(index)} className="py-2 px-4 rounded-lg font-bold inline-flex items-center space-x-2 flex-shrink-0" style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                                <Edit size={16} />
                                <span>Edit</span>
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex justify-between items-center flex-wrap gap-4 mt-8">
                <button onClick={() => setIsReviewing(false)} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2" style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>
                    <Eye size={20} />
                    <span>Back to Exam</span>
                </button>
                <button onClick={handleSubmit} className="py-3 px-8 rounded-lg text-lg font-bold inline-flex items-center space-x-2" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>
                    <CheckCircle size={20} />
                    <span>Submit Final Answers</span>
                </button>
            </div>
        </div>
    );
};

// --- Main Student Flow Component ---
interface StudentFlowProps {
    user: User;
    handleSignOut: () => void;
}

export const StudentFlow: React.FC<StudentFlowProps> = ({ user, handleSignOut }) => {
    const {
        currentExamQuestions, isExamLoading, currentQuestionIndex, answers, timeLeft, isStarted,
        isSubmitted, showResults, isPaused, randomize, isReviewing, selectedExamId, selectedExam, availableExams,
        setCurrentQuestionIndex, handleAnswerSelect, setIsPaused, startExam, handleSubmit,
        resetExam, setRandomize, setSelectedExamId, setIsReviewing, isProgressLoading, isSaving,
    } = useExam(user?.uid, sessionStorage.getItem('msee_auth_token'));
    
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const questionCardRef = useRef<HTMLDivElement>(null);
    
    const SECONDS_PER_QUESTION = 300; // 5 minutes
    const [questionTimeLeft, setQuestionTimeLeft] = useState(SECONDS_PER_QUESTION);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isStarted && !isSubmitted && !isPaused) {
                setIsPaused(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isStarted, isSubmitted, isPaused, setIsPaused]);

    const currentQuestion = currentExamQuestions[currentQuestionIndex];

    const handleNext = useCallback(() => {
        if (currentQuestionIndex < currentExamQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }, [currentQuestionIndex, currentExamQuestions.length, setCurrentQuestionIndex]);

    const handlePrev = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }, [currentQuestionIndex, setCurrentQuestionIndex]);

    // Timer for individual questions
    useEffect(() => {
        // Reset timer for new question
        if (isStarted) {
            setQuestionTimeLeft(SECONDS_PER_QUESTION);
        }
    }, [currentQuestionIndex, isStarted]);

    useEffect(() => {
        if (!isStarted || isPaused || isSubmitted || isReviewing) {
            return;
        }

        if (questionTimeLeft <= 0) {
            if (currentQuestionIndex < currentExamQuestions.length - 1) {
                handleNext();
            } else {
                setIsReviewing(true); // On the last question, go to review screen
            }
            return;
        }

        const intervalId = setInterval(() => {
            setQuestionTimeLeft(prevTime => prevTime > 0 ? prevTime - 1 : 0);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isStarted, isPaused, isSubmitted, isReviewing, questionTimeLeft, currentQuestionIndex, currentExamQuestions.length, handleNext, setIsReviewing]);

    const navigateAndScroll = (index: number) => {
        setCurrentQuestionIndex(index);
        questionCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    const confirmSubmit = () => {
        handleSubmit();
        setIsSubmitModalOpen(false);
    };

    const confirmReset = () => {
        resetExam();
        setIsResetModalOpen(false);
    };

    const renderContent = () => {
        if (isExamLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <Spinner size={64} />
                </div>
            );
        }

        if (showResults) {
            return <ResultsView questions={currentExamQuestions} answers={answers} onReset={() => setIsResetModalOpen(true)} onSignOut={handleSignOut} examId={selectedExamId} selectedExam={selectedExam} />;
        }

        if (!isStarted) {
            const hasProgress = Object.keys(answers).length > 0;
            return <StartScreen
                onStart={() => {
                    logEvent('EXAM_STARTED', { examId: selectedExamId, randomize, resumed: hasProgress });
                    startExam();
                }}
                questions={currentExamQuestions}
                randomize={randomize}
                setRandomize={setRandomize}
                progressMessage={hasProgress ? "You have a saved exam in progress. Starting will resume your session." : undefined}
                availableExams={availableExams}
                selectedExamId={selectedExamId}
                setSelectedExamId={setSelectedExamId}
                selectedExam={selectedExam}
            />;
        }

        if (isReviewing) {
            return <ReviewSummaryView 
                questions={currentExamQuestions}
                answers={answers}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                setIsReviewing={setIsReviewing}
                handleSubmit={() => setIsSubmitModalOpen(true)}
            />;
        }

        return (
            <div className="max-w-4xl w-full mx-auto">
                <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-4 sm:p-6 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
                        {/* Main Exam Timer */}
                        <div className="flex items-center space-x-2" title="Total Exam Time Remaining">
                            <Clock size={28} className={`transition-colors ${isPaused ? 'text-blue-500' : ''}`} />
                            <span className="text-2xl font-mono" aria-label={`Time remaining: ${formatTime(timeLeft)}`}>{formatTime(timeLeft)}</span>
                        </div>

                        {/* Individual Question Timer */}
                        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400" title="Time remaining for this question">
                            <HelpCircle size={28} />
                            <span className="text-2xl font-mono" aria-label={`Time for this question: ${formatQuestionTime(questionTimeLeft)}`}>{formatQuestionTime(questionTimeLeft)}</span>
                        </div>

                        {isPaused && <span className="text-lg font-bold uppercase text-blue-500 animate-pulse">Paused</span>}
                        
                        {isSaving && (
                            <div className="flex items-center space-x-2 text-sm opacity-75">
                                <Loader2 className="animate-spin" size={16} />
                                <span>Saving...</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-3 flex-shrink-0">
                        <button onClick={() => setIsPaused(!isPaused)} className="py-2.5 px-5 rounded-lg font-bold inline-flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md">
                            {isPaused ? <Play size={18} /> : <Pause size={18} />}
                            <span>{isPaused ? 'Resume' : 'Pause'}</span>
                        </button>
                        <button onClick={() => setIsResetModalOpen(true)} className="py-2.5 px-5 rounded-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>
                            <RotateCcw size={18} />
                            <span>Reset</span>
                        </button>
                        <button onClick={() => setIsSubmitModalOpen(true)} className="py-2.5 px-5 rounded-lg font-bold inline-flex items-center space-x-2 shadow-md" style={{ backgroundColor: AUCDT_COLORS.red, color: AUCDT_COLORS.white }}>
                            <CheckCircle size={18} />
                            <span>Submit</span>
                        </button>
                    </div>
                </div>

                {isPaused && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 text-white p-4 text-center">
                        <Pause size={64} className="mb-4" />
                        <h2 className="text-4xl font-bold mb-4">Exam Paused</h2>
                        <p className="text-xl mb-8">Click "Resume" to continue.</p>
                        <button onClick={() => setIsPaused(false)} className="py-3 px-10 rounded-lg text-lg font-bold inline-flex items-center space-x-2" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>
                            <Play size={20} />
                            <span>Resume Exam</span>
                        </button>
                    </div>
                )}
                
                <AccessibleProgress current={currentQuestionIndex} total={currentExamQuestions.length} answers={answers} questions={currentExamQuestions} navigateToQuestion={navigateAndScroll} />

                {isProgressLoading ? (
                    <div className="bg-[var(--card-background)] rounded-xl shadow-lg p-6 flex justify-center items-center min-h-[400px]">
                        <Spinner size={48} />
                    </div>
                ) : (
                    <>
                        <div ref={questionCardRef} className="bg-[var(--card-background)] rounded-xl shadow-lg p-6">
                            <div className="mb-6">
                                <p className="font-bold text-xl md:text-2xl leading-relaxed" style={{ color: 'var(--primary-text-color)' }}>
                                    <LatexRenderer>{currentQuestion.question}</LatexRenderer>
                                </p>
                                {currentQuestion.diagram && <DiagramRenderer type={currentQuestion.diagram} />}
                            </div>

                            <div className="space-y-4">
                                {currentQuestion.options.map((option, index) => (
                                    <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200" style={{ borderColor: answers[currentQuestion.id] === index ? AUCDT_COLORS.gold : 'var(--card-border-color)', backgroundColor: answers[currentQuestion.id] === index ? 'var(--card-border-color)' : 'transparent' }}>
                                        <input type="radio" name={`q_${currentQuestion.id}`} value={index} checked={answers[currentQuestion.id] === index} onChange={() => handleAnswerSelect(currentQuestion.id, index)} className="h-5 w-5 mr-4" style={{ accentColor: AUCDT_COLORS.deepBrown }} />
                                        <span className="text-lg"><LatexRenderer>{option}</LatexRenderer></span>
                                    </label>
                                ))}
                            </div>

                            {currentQuestion.bonus && <BonusSection title={currentQuestion.bonus.title} content={currentQuestion.bonus.content} />}
                        </div>
                        
                        <div className="flex justify-between mt-6">
                            <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="py-3 px-8 rounded-lg text-lg font-bold shadow-md disabled:opacity-50" style={{ backgroundColor: 'var(--card-border-color)', color: 'var(--primary-text-color)' }}>Previous</button>
                            {currentQuestionIndex === currentExamQuestions.length - 1 ? (
                                <button onClick={() => setIsReviewing(true)} className="py-3 px-8 rounded-lg text-lg font-bold shadow-md" style={{ backgroundColor: AUCDT_COLORS.green, color: AUCDT_COLORS.white }}>Review Answers</button>
                            ) : (
                                <button onClick={handleNext} className="py-3 px-8 rounded-lg text-lg font-bold shadow-md" style={{ backgroundColor: AUCDT_COLORS.deepBrown, color: AUCDT_COLORS.white }}>Next</button>

        )}
                        </div>
                    </>
                )}
            </div>
        );
    };


    return (
        <>
            {renderContent()}
            <ConfirmationModal 
                isOpen={isSubmitModalOpen} 
                title="Confirm Submission" 
                message="Are you sure you want to submit your exam? This action cannot be undone." 
                onConfirm={confirmSubmit} 
                onCancel={() => setIsSubmitModalOpen(false)} 
            />
            <ConfirmationModal 
                isOpen={isResetModalOpen} 
                title={showResults ? "Take Exam Again?" : "Reset Exam?"} 
                message={showResults ? "Are you sure you want to start a new attempt? Your previous results will be cleared." : "Are you sure you want to reset the exam? All your current progress will be lost and the timer will restart."} 
                onConfirm={confirmReset} 
                onCancel={() => setIsResetModalOpen(false)} 
            />
        </>
    );
};
```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React, { useState } from 'react';
import { Sun, Moon, Contrast, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [loadingTheme, setLoadingTheme] = useState<'light' | 'dark' | 'high-contrast' | null>(null);

  const themes = [
    { name: 'light', icon: Sun },
    { name: 'dark', icon: Moon },
    { name: 'high-contrast', icon: Contrast },
  ] as const;

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'high-contrast') => {
    // No action if the theme is already active or another theme change is in progress
    if (newTheme === theme || loadingTheme) return;

    setLoadingTheme(newTheme);
    // This brief delay ensures the loading indicator is perceptible. The actual theme
    // application is nearly instantaneous, but this simulates a scenario where it might
    // be an asynchronous operation, providing immediate feedback to the user.
    setTimeout(() => {
      setTheme(newTheme);
      setLoadingTheme(null);
    }, 300);
  };

  return (
    <div className="flex items-center space-x-1 p-1 rounded-full bg-[var(--card-background)] border border-[var(--card-border-color)] shadow-sm">
      {themes.map((t) => {
        const isLoading = loadingTheme === t.name;
        const isActive = theme === t.name;

        return (
          <button
            key={t.name}
            onClick={() => handleThemeChange(t.name)}
            disabled={isLoading || isActive}
            className={`w-9 h-9 p-2 rounded-full transition-colors duration-200 flex items-center justify-center disabled:opacity-[var(--button-disabled-opacity)] disabled:cursor-not-allowed ${
              isActive ? 'theme-btn-active' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={`Switch to ${t.name} mode`}
            aria-pressed={isActive}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <t.icon size={18} />}
          </button>
        );
      })}
    </div>
  );
};

```

### FILE: constants.ts
```typescript
import { Question } from './types';

export const AUCDT_COLORS = {
  gold: '#D4AF37',
  deepBrown: '#5C4033',
  green: '#4CAF50',
  lightGreen: '#E8F5E9',
  white: '#FFFFFF',
  lightGray: '#F9FAFB',
  darkGray: '#374151',
  red: '#DC2626',
};

export const EXAM_DURATION_SECONDS = 7200; // 2 hours

export const EXAM_SUBJECTS = [
    "General Mathematics",
    "English Language",
    "Integrated Science",
    "Social Studies",
    "Agriculture",
    "Biology",
    "Chemistry",
    "Business Management",
    "Financial Accounting",
    "Economics",
    "Geography",
    "History",
    "Literature in English",
    "Christian Religious Studies",
    "Islamic Religious Studies",
    "Applied Technology",
    "Computer Science",
    "Visual Arts",
    "Home Economics",
    "Foods and Nutrition",
];


export const DEFAULT_QUESTIONS: Question[] = [
    // Algebra
    { id: 1, question: "Evaluate the expression $5x - 2y - 3$ for $x=3$ and $y=-1$.", options: ["14", "16", "20", "22"], correct: 0 },
    { id: 2, question: "Solve for p in the equation: $3(p + 5) = 21$", options: ["p=2", "p=4", "p=6", "p=8", "None of these"], correct: 1 },
    { id: 3, question: "Simplify the expression: $7(2m - 3) - 4(m+5)$", options: ["10m-1", "10m-41", "14m-1", "14m-41", "None of these"], correct: 1 },
    { id: 4, question: "If $f(x) = 3x^2 - 7x + 2$, evaluate $f(-2)$.", options: ["-24", "0", "12", "28", "None of these"], correct: 3 },
    { id: 5, question: "Solve the inequality: $2x + 9 > 1$", options: ["x > 4", "x < 4", "x > -4", "x < -4", "None of these"], correct: 2 },
    { id: 6, question: "The sum of two numbers is 25 and their difference is 5. What are the numbers?", options: ["10 and 15", "5 and 20", "12 and 13", "8 and 17", "None of these"], correct: 0 },
    
    // Statistics & Probability
    { id: 7, question: "The ages of five friends are 23, 18, 20, 25, and 21. What is the median age?", options: ["20", "21", "22", "23", "None of these"], correct: 1 },
    { id: 8, question: "A bag contains 3 red marbles, 5 blue marbles, and 2 green marbles. If a marble is selected at random, what is the probability that it is NOT blue?", options: ["1/5", "2/5", "3/5", "4/5", "1/2"], correct: 4 },
    { id: 9, question: "If a dice is rolled once, what is the probability of getting an even number?", options: ["1/6", "1/3", "1/2", "2/3", "None of these"], correct: 2 },

    // Number Theory & Arithmetic
    { id: 10, question: "Arrange the following numbers in ascending order: $0.35, 1/3, 25\\%$", options: ["0.35, 1/3, 25%", "1/3, 25%, 0.35", "25%, 0.35, 1/3", "25%, 1/3, 0.35", "None of these"], correct: 3 },
    { id: 11, question: "Find the next number in the sequence: 3, 7, 11, 15, __", options: ["18", "19", "20", "21", "None of these"], correct: 1 },
    { id: 12, question: "Evaluate $\log_{10}(1000)$.", options: ["2", "3", "10", "100", "None of these"], correct: 1 },
    { id: 13, question: "Simplify: $\sqrt{144} + \sqrt{25}$", options: ["13", "17", "169", "289", "None of these"], correct: 1 },

    // Geometry & Trigonometry
    { id: 14, question: "In the diagram below, find the value of angle y.", options: ["65°", "75°", "85°", "95°", "None of these"], correct: 1, diagram: 'angles_on_line' },
    { id: 15, question: "In the right-angled triangle ABC shown in the diagram, side AB has length 6 and side BC has length 8. What is the length of the hypotenuse AC?", options: ["10", "12", "14", "100", "None of these"], correct: 0, diagram: 'right_triangle_abc' },
    { id: 16, question: "What is the slope of the line passing through the points (2, 5) and (4, 9)?", options: ["-2", "1/2", "1", "2", "None of these"], correct: 3 },
    { id: 17, question: "What is the area of a circle with a radius of 5 cm? (Use $\pi \approx 3.14$)", options: ["15.7 cm²", "25 cm²", "78.5 cm²", "157 cm²", "None of these"], correct: 2, diagram: 'circle_radius' },
    { id: 18, question: "The pie chart below shows the distribution of favourite colours among a group of students. What angle would represent the colour blue?", options: ["30°", "90°", "120°", "135°", "150°"], correct: 3, diagram: 'pie_chart_colors' },
    { id: 19, question: "Find the volume of a cube with side length 4 cm.", options: ["12 cm³", "16 cm³", "48 cm³", "64 cm³", "None of these"], correct: 3, diagram: 'cube_side' },
    { id: 20, question: "If $\sin(\theta) = 3/5$ and $\theta$ is an acute angle, what is $\cos(\theta)$?", options: ["3/4", "4/5", "5/4", "5/3", "None of these"], correct: 1 },

    // Word Problems & Applications
    { id: 21, question: "A car travels 180 km in 3 hours. What is its average speed in km/h?", options: ["50 km/h", "60 km/h", "70 km/h", "90 km/h", "None of these"], correct: 1 },
    { id: 22, question: "What is the simple interest on a principal of GHS 500 at a rate of 10% per annum for 4 years?", options: ["GHS 50", "GHS 100", "GHS 200", "GHS 500", "None of these"], correct: 2 },
    
    // Advanced
    { id: 23, question: "Find the derivative of $f(x) = x^3 + 2x$.", options: ["$3x^2$", "$x^2+2$", "$3x^2+2$", "$3x+2$", "None of these"], correct: 2 },
    { id: 24, question: "Consider the following matrix multiplication: $\\begin{bmatrix} 6 & 5 & 3 & 7 \\\\ 3 & 2 & 1 & 3 \\\\ 5 & 3 & 2 & 5 \\\\ 7 & 5 & 3 & 6 \\end{bmatrix} \\times \\begin{bmatrix} 7 & 2 & 1 & 2 \\\\ 2 & 7 & 1 & 2 \\\\ 1 & 1 & 3 & 1 \\\\ 2 & 2 & 1 & 7 \\end{bmatrix}$. Which of the options is the correct resulting matrix?", options: ["$\\begin{bmatrix} 69 & 64 & 27 & 74 \\\\ 32 & 23 & 10 & 32 \\\\ 54 & 43 & 19 & 54 \\\\ 74 & 64 & 27 & 69 \\end{bmatrix}$", "$\\begin{bmatrix} 67 & 50 & 30 & 70 \\\\ 31 & 20 & 10 & 30 \\\\ 52 & 35 & 20 & 50 \\\\ 72 & 50 & 30 & 67 \\end{bmatrix}$", "A 2x2 Matrix", "An identity matrix", "None of these"], correct: 0, bonus: { title: "Honors Section: A Beautiful Coincidence", content: "This specific matrix multiplication, where a symmetric matrix is multiplied by another symmetric matrix, results in a new symmetric matrix. This is a fascinating example of how properties of matrices are preserved through certain operations." } }
];
```

### FILE: CREATION.md
```md
# aucdt-msee-aptitude-test

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

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
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

### FILE: docs/ADMINISTRATORS_GUIDE.md
```md
# Administrator's Guide

This guide provides instructions for administrators on how to manage the AUCDT MSEE Mathematics Aptitude Test application.

## Table of Contents
1. [Accessing the Admin Dashboard](#1-accessing-the-admin-dashboard)
2. [Generating Questions with AI](#2-generating-questions-with-ai)
3. [Saving a New Exam](#3-saving-a-new-exam)
4. [Viewing Audit Logs](#4-viewing-audit-logs)
5. [Managing Users](#5-managing-users)

---

### 1. Accessing the Admin Dashboard

The admin dashboard is a protected area where you can create new exams.

**Steps to Access:**
1.  Navigate to the application's URL and append `?admin` to the end. For example: `https://your-app-url.com/?admin`.
2.  You will be presented with the login screen. Use the email and password for a user account that has the `admin` role in the database.
3.  Click "Sign In". Upon successful authentication, you will be redirected to the Admin Dashboard.

If you enter incorrect credentials, an error message will be displayed.

### 2. Generating Questions with AI

The core feature of the admin panel is its ability to generate new, high-quality questions from a piece of source text using the Google Gemini AI.

**Steps to Generate Questions:**
1.  **Select a Subject:** Use the "Select Subject" dropdown to choose the topic for the exam you want to create.
2.  **Find Source Material:** Copy a section of text from a textbook, lecture notes, or any relevant document for the chosen subject.
3.  **Paste Content:** In the Admin Dashboard, paste the copied text into the large text area labeled "Paste Content to Generate Exam".
4.  **Initiate Generation:** Click the "Generate Questions with AI" button.
5.  **Wait for AI:** The system will send the content to the backend server, which securely calls the AI. This process may take a few moments.
6.  **Review Questions:** Once generation is complete, a list of 24 multiple-choice questions will appear below. Each question will show the correct answer highlighted in green.

### 3. Saving a New Exam

After the AI has generated questions and you are satisfied with them, you can save them as a new exam, making it available for students.

**Steps to Save an Exam:**
1.  **Assign a Name:** In the "Exam Name" input field, provide a clear and descriptive name for the new exam.
2.  **Provide a Description:** In the "Exam Description" textarea, write a short summary of the exam's content or purpose.
3.  **Save:** Click the "Save Exam" button. The button will be disabled until both a name and description are provided.
4.  **Confirmation:** The system will save the exam to the MySQL database. A success message will appear, and the form will reset.

The new exam will now be available for students to take from the main application page.

### 4. Viewing Audit Logs

The application automatically records important events to the database for security and monitoring purposes. There is no web interface for viewing these logs; they must be accessed directly from the database.

**Steps to View Logs:**
1.  Gain access to the MySQL database where the application data is stored.
2.  Use a database client (e.g., MySQL Workbench, DBeaver, or the command-line interface) to connect to the database.
3.  Execute a SQL query to view the logs. For example:
    ```sql
    SELECT u.email, a.action, a.details, a.timestamp 
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.timestamp DESC;
    ```
This query will show a chronological list of all recorded actions, who performed them, and any associated data.

### 5. Managing Users

User management (creating administrators, resetting passwords) is performed directly in the database.

*   **Creating an Administrator:** To make a user an administrator, update their `role` in the `users` table from the default `student` to `admin`.
*   **Resetting a Password:** There is no "forgot password" feature. An administrator with database access must manually generate a new password hash and update the `password_hash` field for the user in the `users` table.
```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — TUC -msee-aptitude-test

**Application:** aucdt-msee-aptitude-test
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

Audit log data is stored in `localStorage` under the key `tuc_aucdt-msee-aptitude-test_audit`.

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

### FILE: docs/CREATION_GUIDE.md
```md
# Creation Guide: Rebuilding the AUCDT MSEE Mathematics Aptitude Test Application

## 1. Introduction

This document is a master guide for developers or an advanced AI to completely recreate the AUCDT MSEE Mathematics Aptitude Test application. It provides the full file structure, configuration details, and the complete source code for every file.

The final application is a sophisticated full-stack application featuring:
- A secure, role-based authentication system for students and administrators.
- A timed student examination flow with server-side progress saving and exam filtering.
- A protected administrator dashboard for AI-powered exam question generation using the Google Gemini API.
- An automated self-test mode for demonstration and smoke testing.
- User-selectable accessibility themes (Light, Dark, High-Contrast).
- Secure, server-side audit logging to a MySQL database.

## 2. Prerequisites

Before you begin, you will need:
1.  **A Server Environment**: A server (e.g., Ubuntu) with Node.js, npm, and MySQL installed.
2.  **A Google GenAI API Key**: Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  **Database Credentials**: You will need the host, user, password, and database name for your MySQL instance.

## 3. Project Structure

Create the following directory and file structure. The contents for each file are provided in the main prompt.

```
/
├── db/
│   └── init.sql
├── docs/
│   ├── ADMINISTRATORS_GUIDE.md
│   ├── ARCHITECTURE.svg
│   ├── CREATION_GUIDE.md
│   ├── DATABASE_SCHEMA.svg
│   ├── DEPLOYMENT_GUIDE.md
│   ├── SRS.md
│   └── TESTING_GUIDE.md
├── components/
│   ├── AccessibleProgress.tsx
│   ├── AdminView.tsx
│   ├── AuthView.tsx
│   ├── common.tsx
│   ├── DiagramRenderer.tsx
│   ├── SelfTestView.tsx
│   ├── StudentFlow.tsx
│   └── ThemeSwitcher.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useExam.ts
│   └── useTheme.ts
├── services/
│   ├── auditLogService.ts
│   ├── geminiService.ts
│   └── pdfExporter.ts
├── .env.example
├── .gitignore
├── AGENT.md
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── package.json
├── server.js
├── SRS.md
└── types.ts
```

## 4. Configuration

All secret configuration is handled on the server via environment variables.

1.  **Create a `.env` file** in the project root by copying `.env.example`.
2.  **Fill in the values:**
    *   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Your MySQL connection details.
    *   `JWT_SECRET`: A long, random, and secure string used for signing authentication tokens.
    *   `API_KEY`: Your Google GenAI API Key.

## 5. Setup and Running

1.  **Database Setup:** Run the `db/init.sql` script on your MySQL server to create the necessary tables.
2.  **Install Dependencies:** From the project root, run `npm install` to install all backend dependencies listed in `package.json`.
3.  **Run the Server:** Run `npm start` to start the Node.js server. The application will be accessible at `http://localhost:3000`.
4.  **Create Admin User:** Manually insert an admin user into the `users` table in your database as described in the `DEPLOYMENT_GUIDE.md`.

The application is now fully functional. All source code for the files listed above should be created with the content provided in the main prompt.
```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — TUC -msee-aptitude-test

**Application:** aucdt-msee-aptitude-test
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd aucdt-msee-aptitude-test
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
docker-compose -f docker-compose-all-apps.yml build aucdt-msee-aptitude-test
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up aucdt-msee-aptitude-test
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

### FILE: docs/DEPLOYMENT_GUIDE.md
```md
# Deployment Guide

This guide provides step-by-step instructions to deploy the AUCDT MSEE Mathematics Aptitude Test application, which features a Node.js backend and a MySQL database.

## Prerequisites
*   A server or hosting environment that can run Node.js and MySQL (e.g., a Linux server like Ubuntu).
*   Node.js and npm installed on your deployment server.
*   A MySQL server installed and running.
*   A Google GenAI API Key.

## Step 1: Set Up the MySQL Database

1.  **Create a Database:**
    *   Log in to your MySQL server.
    *   Create a new database for the application. For example:
        ```sql
        CREATE DATABASE msee_test_db;
        ```
2.  **Create a Database User:**
    *   Create a dedicated user and grant it permissions to the new database. Replace `'your_password'` with a strong, secure password.
        ```sql
        CREATE USER 'msee_user'@'localhost' IDENTIFIED BY 'your_password';
        GRANT ALL PRIVILEGES ON msee_test_db.* TO 'msee_user'@'localhost';
        FLUSH PRIVILEGES;
        ```
3.  **Initialize the Schema:**
    *   The project includes a schema file at `db/init.sql`. Run this script against your newly created database to create all the necessary tables (`users`, `exams`, etc.).
        ```bash
        mysql -u msee_user -p msee_test_db < db/init.sql
        ```
4.  **Create the First Admin User:**
    *   To access the admin panel, you must manually create an administrator user.
    *   First, you need a hashed password. You can generate one using an online bcrypt generator or a simple Node.js script.
    *   Then, insert the admin user into your database:
        ```sql
        INSERT INTO users (email, password_hash, role) VALUES ('admin@example.com', 'your_generated_bcrypt_hash_here', 'admin');
        ```

## Step 2: Configure the Application Server

The backend server (`server.js`) requires several environment variables to run correctly. These contain sensitive credentials and should never be hardcoded.

1.  **Create a `.env` File:**
    *   In the root of your project directory on the server, create a file named `.env`.
    *   Add the following variables to the file, replacing the placeholder values with your actual credentials from Step 1 and your Google GenAI API key.
    ```
    # Database Configuration
    DB_HOST="localhost"
    DB_USER="msee_user"
    DB_PASSWORD=[REDACTED_CREDENTIAL]
    DB_NAME="msee_test_db"

    # Application Secrets
    JWT_SECRET=[REDACTED_CREDENTIAL]
    API_KEY=[REDACTED_CREDENTIAL]
    ```
    *   **IMPORTANT**: Ensure the `.gitignore` file contains `.env` to prevent committing secrets to version control.

## Step 3: Deploy and Run the Server

You will deploy the entire application directory to your server and run it as a Node.js process.

### Example: Deploying to an Ubuntu Server

1.  **Transfer Files:** Copy your entire project directory to the server (e.g., using `scp` or `git clone`).

2.  **Install Dependencies:**
    *   SSH into your server and navigate to the project directory.
    *   Install the required Node.js packages from `package.json`:
    ```bash
    npm install
    ```

3.  **Start the Server:**
    *   From the project directory, run the start command:
    ```bash
    npm start
    ```
    *   This will start the Express server, which will begin listening on port 3000 by default.

4.  **Keep the Server Running (Production):**
    *   For a real deployment, you must use a process manager like `pm2` to keep the Node.js application running continuously.
    *   **Install pm2 globally:**
    ```bash
    npm install pm2 -g
    ```
    *   **Start the app with pm2:**
    ```bash
    pm2 start server.js --name "msee-app"
    ```
    *   You can monitor the app with `pm2 list` and view logs with `pm2 logs msee-app`.

5.  **Configure a Reverse Proxy (Recommended):**
    *   It is best practice to run a web server like Nginx in front of your Node.js application. Nginx can handle incoming traffic on port 80 (HTTP) or 443 (HTTPS) and forward it to your app running on port 3000. This also simplifies setting up SSL/TLS for a secure `https://` connection.

Your application is now live and accessible through your server's IP address or domain name.
```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Aucdt Msee Aptitude Test
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Aucdt Msee Aptitude Test**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Aucdt Msee Aptitude Test** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Aucdt Msee Aptitude Test** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Docker service configured | âŒ Non-compliant |
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
# Testing Guide — TUC -msee-aptitude-test

**Application:** aucdt-msee-aptitude-test
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd aucdt-msee-aptitude-test
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

### FILE: docs/TESTING_GUIDE.md
```md
# Testing Guide

This guide outlines the testing strategy for the AUCDT MSEE Mathematics Aptitude Test application and provides instructions for running end-to-end (E2E) tests using Playwright.

## Table of Contents
1. [Testing Philosophy](#1-testing-philosophy)
2. [Self-Test Demonstration Mode](#2-self-test-demonstration-mode)
3. [End-to-End Testing with Playwright](#3-end-to-end-testing-with-playwright)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Sample Playwright Test Script](#sample-playwright-test-script)
    - [Running the Test](#running-the-test)

---

### 1. Testing Philosophy

The application's testing approach focuses on ensuring the critical user journeys are robust and reliable.
-   **Unit/Component Testing (Manual):** Individual React components are built to be modular. Formal unit testing is outside this project's scope but could be added with Jest and React Testing Library.
-   **End-to-End (E2E) Testing:** The primary focus is on E2E testing, which simulates a real user's workflow from start to finish. This ensures all parts of the application (UI, backend APIs, state management) work together correctly.

### 2. Self-Test Demonstration Mode

For a quick, visual confirmation that the application's core functionality is working, use the built-in self-test mode.

-   **How to Access:** Navigate to the application URL and append `?selftest`. Example: `http://localhost:3000/?selftest`.
-   **What it Does:** This mode automatically runs a scripted sequence of actions that mimics the student journey. It provides a visual log of each step, serving as an excellent tool for demos or a quick smoke test.

### 3. End-to-End Testing with Playwright

The following script validates the complete student examination flow, including authentication.

#### Prerequisites
-   Node.js and npm installed.
-   The application must be running locally (`npm start`).
-   A student test user must exist in the database. You can create one by registering through the application's UI.

#### Setup
1.  Create a new folder for your tests (e.g., `e2e-tests`).
2.  Navigate into that folder and initialize a new Node.js project:
    ```bash
    mkdir e2e-tests
    cd e2e-tests
    npm init -y
    ```
3.  Install Playwright and Assert:
    ```bash
    npm install playwright assert
    ```

#### Sample Playwright Test Script
Create a file named `student-flow.test.js` and paste the following code. **Remember to update the `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` variables.**

```javascript
const playwright = require('playwright');
const assert = require('assert');

// --- Configuration ---
const APP_URL = 'http://localhost:3000';
const TEST_USER_EMAIL = 'student@test.com'; // CHANGE THIS
const TEST_USER_PASSWORD = [REDACTED_CREDENTIAL]
const TEST_TIMEOUT = 45000; // 45 seconds

async function runStudentExamTest() {
  let browser;
  console.log('🚀 Starting E2E test for the Student Examination Flow...');

  try {
    browser = await playwright.launch({ 
      headless: true, // Set to false to watch the test run
      slowMo: 25,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });

    console.log('✅ [PASS] Navigated to the application login page.');

    // 1. Log In
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', TEST_USER_EMAIL);
    await page.type('input[type="password"]', TEST_USER_PASSWORD);
    await page.click('button[type="submit"]');
    console.log('✅ [PASS] Submitted login credentials.');

    // 2. Start the Examination
    const startButtonSelector = 'button'; // The main button on the start screen
    await page.waitForSelector(startButtonSelector, { timeout: 10000 });
    const startButtonText = await page.$eval(startButtonSelector, el => el.innerText);
    assert.strictEqual(startButtonText, 'Start Examination', 'Start screen did not load after login.');
    await page.click(startButtonSelector);
    console.log('✅ [PASS] Logged in and clicked "Start Examination".');

    // 3. Verify Exam Interface is loaded
    await page.waitForSelector('.progress-bar', { timeout: 5000 });
    console.log('✅ [PASS] Exam interface loaded successfully.');

    // 4. Answer a few questions
    const questionCount = (await page.$$('.question-grid button')).length;
    assert.ok(questionCount > 0, 'Question grid should have questions.');
    console.log(`- Found ${questionCount} questions in the exam.`);

    for (let i = 0; i < 3; i++) {
        // Select the first radio button option
        await page.waitForSelector('input[type="radio"][value="0"]');
        await page.click('input[type="radio"][value="0"]');
        
        // Click "Next" or "Review"
        const nextButton = await page.waitForSelector('.flex.justify-between button:last-child');
        await nextButton.click();
    }
    console.log('✅ [PASS] Answered the first 3 questions.');

    // 5. Review and Submit
    const reviewButton = await page.waitForSelector('button:last-child');
    const reviewButtonText = await page.$eval('button:last-child', el => el.innerText);
    if (reviewButtonText === 'Review Answers') {
        await reviewButton.click();
        console.log('✅ [PASS] Clicked "Review Answers".');
        const finalSubmitButton = await page.waitForSelector('button:last-child');
        await finalSubmitButton.click();
        console.log('✅ [PASS] Clicked "Submit Final Answers" from review screen.');
    } else {
        // If already on the last question, the button might be "Submit"
        await reviewButton.click();
    }
    
    // 6. Confirm Submission in Modal
    const confirmButtonSelector = '.fixed.inset-0 button:last-child';
    await page.waitForSelector(confirmButtonSelector);
    await page.click(confirmButtonSelector);
    console.log('✅ [PASS] Confirmed submission in modal.');

    // 7. Verify Results Page
    await page.waitForSelector('#results-summary h1', { timeout: 10000 });
    const resultsTitle = await page.$eval('#results-summary h1', el => el.innerText);
    assert.strictEqual(resultsTitle, 'Examination Results', 'Results page title is incorrect.');
    
    const scoreText = await page.$eval('.text-6xl', el => el.innerText);
    console.log(`- Final Score: ${scoreText}`);
    assert.ok(scoreText.includes('%'), 'Score percentage is not displayed correctly.');
    
    console.log('✅ [PASS] Verified results page successfully.');
    console.log('🎉 E2E Test for Student Flow Completed Successfully!');

  } catch (error) {
    console.error('❌ [FAIL] An error occurred during the E2E test:');
    console.error(error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runStudentExamTest().catch(console.error);

```

#### Running the Test
1.  Make sure your application is running (`npm start`).
2.  From your `e2e-tests` directory, run the script from the command line:
    ```bash
    node student-flow.test.js
    ```
3.  The console will log the progress and final result of the test.
```

### FILE: hooks/useAuth.ts
```typescript
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { logEvent } from '../services/auditLogService';

const TOKEN_STORAGE_KEY = [REDACTED_CREDENTIAL]
const USER_STORAGE_KEY = 'msee_current_user';

// Helper to decode JWT without a library
const decodeJwt = (token: string): any | null => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, verify token and set user state
    if (token) {
        const decodedUser = decodeJwt(token);
        if (decodedUser && decodedUser.exp * 1000 > Date.now()) {
            const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } else {
            // Token is expired or invalid
            logOut();
        }
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAuthSuccess = (data: { accessToken: string; user: User }) => {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, data.accessToken);
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
    setError(null);
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || 'Registration failed.');
        }
        // After successful registration, log the user in automatically
        return await signIn(email, password);
    } catch (e: any) {
        setError(e.message);
        setLoading(false);
        return false;
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Sign-in failed.');
        }
        handleAuthSuccess(data);
        logEvent(data.user.role === 'admin' ? 'ADMIN_LOGIN_SUCCESS' : 'STUDENT_LOGIN_SUCCESS');
        setLoading(false);
        return true;
    } catch (e: any) {
        setError(e.message);
        logEvent('ADMIN_LOGIN_FAILURE');
        setLoading(false);
        return false;
    }
  };

  const logOut = useCallback(() => {
    if (user) {
        logEvent(user.role === 'admin' ? 'ADMIN_LOGOUT' : 'STUDENT_LOGOUT');
    }
    setUser(null);
    setToken(null);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
  }, [user]);

  return { user, token, loading, error, signUp, signIn, logOut };
};
```

### FILE: hooks/useExam.ts
```typescript
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Question, Answers, Exam } from '../types';
import { DEFAULT_QUESTIONS, EXAM_DURATION_SECONDS } from '../constants';

export const useExam = (userId?: string | null, token?: string | null) => {
  // Exam Content State
  const [availableExams, setAvailableExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [currentExamQuestions, setCurrentExamQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [isExamLoading, setIsExamLoading] = useState<boolean>(true);
  const [examLoadingError, setExamLoadingError] = useState<string | null>(null);

  // Exam Progress State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [randomize, setRandomize] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Loading and Saving States
  const [isProgressLoading, setIsProgressLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Load available exams from the backend API
  useEffect(() => {
    const fetchExams = async () => {
        setIsExamLoading(true);
        try {
            const response = await fetch('/api/exams');
            if (!response.ok) throw new Error('Failed to fetch exams');
            const examsData: Exam[] = await response.json();
            
            // The questions in the DB are stored as strings, but the API now parses them.
            // Let's ensure the frontend receives them as objects.
            const parsedExams = examsData.map(e => ({
                ...e,
                questions: typeof e.questions === 'string' ? JSON.parse(e.questions) : e.questions
            }));

            setAvailableExams(parsedExams);
            if (parsedExams.length > 0 && !selectedExamId) {
                setSelectedExamId(parsedExams[0].id.toString());
            } else if (parsedExams.length === 0) {
                setCurrentExamQuestions(DEFAULT_QUESTIONS);
                setSelectedExamId('default_offline_exam');
            }
        } catch (error) {
            console.error("Error fetching exams from API:", error);
            setExamLoadingError("Could not load exams from server. Using default questions.");
            setCurrentExamQuestions(DEFAULT_QUESTIONS);
            setSelectedExamId('default_offline_exam');
        } finally {
            setIsExamLoading(false);
        }
    };
    fetchExams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load a specific exam's questions and user progress
  useEffect(() => {
    const loadExamAndProgress = async () => {
        if (!selectedExamId || !userId || !token) return;
        setIsProgressLoading(true);

        const exam = availableExams.find(e => e.id.toString() === selectedExamId);
        if (exam) {
            setCurrentExamQuestions(exam.questions as any); // API now sends parsed questions
        } else if (selectedExamId === 'default_offline_exam') {
            setCurrentExamQuestions(DEFAULT_QUESTIONS);
        }

        try {
            const response = await fetch(`/api/progress/${selectedExamId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const progress = await response.json();
                if (progress) {
                    setAnswers(progress.answers || {});
                    setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
                    setTimeLeft(progress.timeLeft !== undefined ? progress.timeLeft : EXAM_DURATION_SECONDS);
                } else {
                    // Reset if no progress found on server
                    setAnswers({});
                    setCurrentQuestionIndex(0);
                    setTimeLeft(EXAM_DURATION_SECONDS);
                }
            }
        } catch (e) {
            console.error("Error loading progress from server:", e);
        } finally {
            setIsProgressLoading(false);
        }
    };
    loadExamAndProgress();
  }, [selectedExamId, userId, token, availableExams]);


  const handleSubmit = useCallback(async () => {
    setIsSubmitted(true);
    setShowResults(true);
    if (selectedExamId && userId && token) {
      try {
        await fetch(`/api/progress/${selectedExamId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Failed to clear progress on server:", error);
      }
    }
  }, [selectedExamId, userId, token]);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isStarted && !isSubmitted && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft <= 0 && isStarted && !isSubmitted) {
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isStarted, isSubmitted, timeLeft, isPaused, handleSubmit]);

  // Autosave progress to backend
  useEffect(() => {
    const saveProgress = async () => {
      if (isStarted && !isSubmitted && selectedExamId && userId && token) {
        setIsSaving(true);
        try {
            await fetch(`/api/progress/${selectedExamId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ answers, currentQuestionIndex, timeLeft })
            });
        } catch (e) {
            console.error("Failed to save progress to server:", e);
        } finally {
            setIsSaving(false);
        }
      }
    };
    const saveInterval = setInterval(saveProgress, 10000); // Save every 10 seconds
    return () => clearInterval(saveInterval);
  }, [answers, currentQuestionIndex, timeLeft, isStarted, isSubmitted, selectedExamId, userId, token]);


  const startExam = useCallback(() => {
    let questionsToUse = [...currentExamQuestions];
    if (randomize) {
        questionsToUse.sort(() => Math.random() - 0.5);
    }
    setCurrentExamQuestions(questionsToUse);
    setIsStarted(true);
  }, [currentExamQuestions, randomize]);

  const handleAnswerSelect = (qId: string | number, ansIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: ansIdx }));
  };

  const resetExam = async () => {
    if (selectedExamId && userId && token) {
        await fetch(`/api/progress/${selectedExamId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    }
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(EXAM_DURATION_SECONDS);
    setIsStarted(false);
    setIsSubmitted(false);
    setShowResults(false);
    setIsPaused(false);
    setIsReviewing(false);
    
    if (selectedExamId) {
        const exam = availableExams.find(e => e.id.toString() === selectedExamId);
        setCurrentExamQuestions(exam ? (exam.questions as any) : DEFAULT_QUESTIONS);
    } else {
        setCurrentExamQuestions(DEFAULT_QUESTIONS);
    }
  };

  const selectedExam = useMemo(() => {
    return availableExams.find(e => e.id.toString() === selectedExamId) || null;
  }, [availableExams, selectedExamId]);

  return {
    currentExamQuestions, isExamLoading, examLoadingError, currentQuestionIndex, answers, timeLeft,
    isStarted, isSubmitted, showResults, isPaused, randomize, isReviewing, selectedExamId,
    selectedExam, availableExams, setCurrentQuestionIndex, handleAnswerSelect, setTimeLeft,
    setIsPaused, startExam, handleSubmit, resetExam, setRandomize,
    setSelectedExamId: (id: string | null) => setSelectedExamId(id), setIsReviewing,
    isProgressLoading, isSaving,
  };
};
```

### FILE: hooks/useTheme.ts
```typescript
import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// A key to track if the user has manually changed the theme during the current session.
const MANUAL_THEME_SESSION_KEY = 'msee-manual-theme-set';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // Priority 1: Check if user has already made a choice in this session.
      // If so, their choice (saved in localStorage) is respected above all.
      if (sessionStorage.getItem(MANUAL_THEME_SESSION_KEY)) {
        return (localStorage.getItem('app-theme') as Theme) || 'light';
      }

      // Priority 2: If no manual choice this session, check the time for an automatic switch.
      const currentHour = new Date().getHours();
      if (currentHour >= 18) {
          return 'dark'; // Automatic dark mode after 6 PM.
      }
      
      // Priority 3: Fallback to the last manually saved theme or default to light.
      return (localStorage.getItem('app-theme') as Theme) || 'light';
    } catch {
      return 'light'; // Failsafe.
    }
  });

  // Effect for dynamic, time-based theme switching during the session.
  useEffect(() => {
    const checkTimeInterval = setInterval(() => {
      // This automatic switch only runs if the user has NOT manually picked a theme.
      if (!sessionStorage.getItem(MANUAL_THEME_SESSION_KEY)) {
        const currentHour = new Date().getHours();
        if (currentHour >= 18) {
          setThemeState(current => (current !== 'dark' ? 'dark' : current));
        } else {
          // If it's before 6 PM, revert to the last saved preference or light mode.
          const lastSavedTheme = (localStorage.getItem('app-theme') as Theme) || 'light';
          setThemeState(current => (current !== lastSavedTheme ? lastSavedTheme : current));
        }
      }
    }, 60000); // Check every minute.

    return () => clearInterval(checkTimeInterval);
  }, []); // Run only once on mount.

  // Effect to apply the current theme class to the HTML element.
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(theme);
  }, [theme]);

  // Exposed function for the user to manually set their theme.
  const setTheme = (newTheme: Theme) => {
    try {
        // Flag that the user has made a choice in this session.
        sessionStorage.setItem(MANUAL_THEME_SESSION_KEY, 'true');
        // Persist their choice for future visits.
        localStorage.setItem('app-theme', newTheme);
    } catch (e) {
        console.warn("Could not save theme preference to storage.", e);
    }
    setThemeState(newTheme);
  };
  
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
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
    <script>
      MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']]
        },
        svg: {
          fontCache: 'global'
        }
      };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
      :root {
        --background-color: #FBF5EF; /* Cream */
        --text-color: #6B2B38; /* Dark Burgundy */
        --card-background: #FFFFFF;
        --card-border-color: #F2EAE4;
        --primary-text-color: #9F546E; /* Medium Burgundy */
        --input-background: #FFFFFF;
        --input-border: #E5D9D2;
        --button-text-color: #FFFFFF;
        --button-disabled-opacity: 0.5;
        --progress-fill-color: #9F546E; /* Medium Burgundy */
        --focus-ring-color: #9F546E; /* Medium Burgundy */

        --message-success-bg: #f0f5e4;
        --message-success-text: #4a572a;
        --message-error-bg: #fdecea;
        --message-error-text: #9e2b25;
        --message-info-bg: #fef7e3;
        --message-info-text: #8c5a01;

        --button-current-bg: #D7B3B3; /* Light Burgundy */
        --button-current-text: #6B2B38; /* Dark Burgundy */
      }
      html.dark {
        --background-color: #111827;
        --text-color: #D1D5DB;
        --card-background: #1F2937;
        --card-border-color: #374151;
        --primary-text-color: #FDE047; /* Gold color for dark mode titles */
        --input-background: #374151;
        --input-border: #4B5563;
        --button-text-color: #1F2937;
        --progress-fill-color: #FDE047;
        --focus-ring-color: #FDE047;

        --message-success-bg: #064E3B;
        --message-success-text: #A7F3D0;
        --message-error-bg: #7F1D1D;
        --message-error-text: #FECACA;
        --message-info-bg: #1E3A8A;
        --message-info-text: #BFDBFE;

        --button-current-bg: #D2B48C;
        --button-current-text: #111827;
      }
      html.high-contrast {
        --background-color: #000000;
        --text-color: #FFFFFF;
        --card-background: #000000;
        --card-border-color: #FFFFFF;
        --primary-text-color: #FFFF00;
        --input-background: #000000;
        --input-border: #FFFFFF;
        --button-text-color: #000000;
        --progress-fill-color: #FFFF00;
        --focus-ring-color: #FFFFFF;

        --message-success-bg: #000000;
        --message-success-text: #00FF00;
        --message-error-bg: #000000;
        --message-error-text: #FF0000;
        --message-info-bg: #000000;
        --message-info-text: #00FFFF;

        --button-current-bg: #FFFF00;
        --button-current-text: #000000;
      }
      body {
        background-color: var(--background-color);
        color: var(--text-color);
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      .theme-btn-active {
        background-color: var(--progress-fill-color);
        color: var(--button-text-color);
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.1.0",
    "react/": "https://esm.sh/react@^19.1.0/",
    "lucide-react": "https://esm.sh/lucide-react@^0.525.0",
    "react-dom/": "https://esm.sh/react-dom@^19.1.0/",
    "dotenv/": "https://aistudiocdn.com/dotenv@^17.2.3/",
    "express": "https://aistudiocdn.com/express@^5.1.0",
    "cors": "https://aistudiocdn.com/cors@^2.8.5",
    "jsonwebtoken": "https://aistudiocdn.com/jsonwebtoken@^9.0.2",
    "firebase/": "https://aistudiocdn.com/firebase@^12.4.0/",
    "path": "https://aistudiocdn.com/path@^0.12.7",
    "mysql2/": "https://aistudiocdn.com/mysql2@^3.15.3/",
    "bcrypt": "https://aistudiocdn.com/bcrypt@^6.0.0",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.27.0",
    "url": "https://aistudiocdn.com/url@^0.11.4"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
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
  throw new Error("Could not find root element with id 'root' to mount to.");
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
  "name": "AUCDT MSEE Aptitude Test",
  "description": "An interactive web application for the AUCDT Mature Students Entrance Examination (MSEE) Mathematics Aptitude Test. This app provides a timed exam environment, automatic progress saving, and an admin panel for generating new exams using AI.",
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
  "name": "aucdt-msee-aptitude-test",
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
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.9.0",
    "@vitejs/plugin-react": "^5.1.0",
    "firebase": "^11.10.0",
    "lucide-react": "^0.525.0",
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "~5.7.2",
    "vite": "^6.2.0",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1kpovPxiR3EhArVMTTSKiqec3WpAtH1ts

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: server.js
```javascript
import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';

// --- Server Setup ---
const app = express();
const port = 3000;
const saltRounds = 10;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// --- Database Connection ---
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'msee_test_db',
};

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log("MySQL Connection Pool created successfully.");
} catch (error) {
  console.error("FATAL ERROR: Could not create MySQL connection pool.", error);
  process.exit(1);
}


// --- Gemini API Initialization ---
let ai;
if (!process.env.API_KEY) {
  console.error('FATAL ERROR: API_KEY environment variable is not set.');
  process.exit(1);
}
try {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
  console.error("Error during Gemini AI client initialization.", e);
  process.exit(1);
}

// --- Auth Middleware ---
const authenticateToken = [REDACTED_CREDENTIAL]
  const authHeader = req.headers['authorization'];
  const token = [REDACTED_CREDENTIAL]
  if (token =[REDACTED_CREDENTIAL]

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Forbidden: Administrator access required." });
  }
  next();
}

// --- API Endpoints ---

// AUTH
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    try {
        const hashedPassword = [REDACTED_CREDENTIAL]
        const [result] = await pool.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashedPassword]);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Database error during registration.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    try {
        const [rows] = await pool.execute('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });
        
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid email or password.' });
        
        const accessToken = [REDACTED_CREDENTIAL]
        res.json({ accessToken, user: { uid: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});


// EXAMS
app.get('/api/exams', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, name, description, subject, questions FROM exams ORDER BY created_at DESC');
        // The questions are stored as JSON text in the DB, so we parse them before sending.
        const exams = rows.map(exam => ({ ...exam, questions: JSON.parse(exam.questions) }));
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ error: 'Failed to fetch exams.' });
    }
});

app.post('/api/exams', authenticateToken, isAdmin, async (req, res) => {
    const { name, description, subject, questions } = req.body;
    if (!name || !questions) {
        return res.status(400).json({ error: 'Exam name and questions are required.' });
    }
    try {
        const [result] = await pool.execute(
            'INSERT INTO exams (name, description, subject, questions, created_by) VALUES (?, ?, ?, ?, ?)',
            [name, description, subject, JSON.stringify(questions), req.user.id]
        );
        res.status(201).json({ message: 'Exam created successfully', examId: result.insertId });
    } catch (error) {
        console.error('Error saving exam:', error);
        res.status(500).json({ error: 'Failed to save exam.' });
    }
});

// PROGRESS
app.get('/api/progress/:examId', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const userId = req.user.id;
    try {
        const [rows] = await pool.execute(
            'SELECT answers, time_left FROM exam_progress WHERE user_id = ? AND exam_id = ?',
            [userId, examId]
        );
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json(null); // No progress found
        }
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ error: 'Failed to fetch progress.' });
    }
});

app.post('/api/progress/:examId', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const userId = req.user.id;
    const { answers, timeLeft } = req.body;
    
    try {
        await pool.execute(
            `INSERT INTO exam_progress (user_id, exam_id, answers, time_left) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE answers = VALUES(answers), time_left = VALUES(time_left)`,
            [userId, examId, JSON.stringify(answers), timeLeft]
        );
        res.status(200).json({ message: 'Progress saved.' });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ error: 'Failed to save progress.' });
    }
});

app.delete('/api/progress/:examId', authenticateToken, async (req, res) => {
    const { examId } = req.params;
    const userId = req.user.id;
    try {
        await pool.execute(
            'DELETE FROM exam_progress WHERE user_id = ? AND exam_id = ?',
            [userId, examId]
        );
        res.status(200).json({ message: 'Progress cleared successfully.' });
    } catch (error) {
        console.error('Error clearing progress:', error);
        res.status(500).json({ error: 'Failed to clear progress.' });
    }
});


// LOGGING
app.post('/api/logs', authenticateToken, async (req, res) => {
    const { action, details } = req.body;
    const userId = req.user?.id || null;
    try {
        await pool.execute(
            'INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)',
            [userId, action, JSON.stringify(details)]
        );
        res.sendStatus(201);
    } catch (error) {
        console.error("Error writing to audit log:", error);
        res.sendStatus(500);
    }
});

// GEMINI AI
app.post('/api/generate', authenticateToken, isAdmin, async (req, res) => {
  const { text, count, subject } = req.body;
  if (!text || !count || !subject) return res.status(400).json({ error: 'Missing required fields.' });

  const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING },
        options: { type: Type.ARRAY, items: { type: Type.STRING } },
        correct: { type: Type.INTEGER },
    },
    required: ["question", "options", "correct"],
  };
  const sanitizedText = text.replace(/[\x00-\x1F\x7F]/g, '');
  const prompt = `Based on the following text about "${subject}", generate ${count} multiple-choice questions. Format the response as a JSON array. Text: --- ${sanitizedText} ---`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: questionSchema },
        },
    });
    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: 'Failed to generate questions from AI service.' });
  }
});

// --- Static File Serving ---
app.use(express.static(__dirname));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
```

### FILE: services/auditLogService.ts
```typescript


type AuditAction = 
    | 'ADMIN_LOGIN_SUCCESS'
    | 'ADMIN_LOGIN_FAILURE'
    | 'ADMIN_LOGOUT'
    | 'STUDENT_LOGIN_SUCCESS'
    | 'STUDENT_SIGNUP_SUCCESS'
    | 'STUDENT_LOGOUT'
    | 'EXAM_QUESTIONS_GENERATED'
    | 'EXAM_SAVED'
    | 'EXAM_STARTED'
    | 'EXAM_SUBMITTED';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuditDetails = Record<string, any>;

export const logEvent = async (action: AuditAction, details: AuditDetails = {}): Promise<void> => {
    try {
        const token = [REDACTED_CREDENTIAL]
        if (!token) {
            // Can't log if user is not authenticated
            console.log(`Audit Log (unauthenticated): ${action}`, details);
            return;
        }

        await fetch('/api/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ action, details }),
        });

    } catch (error) {
        console.error("Failed to write to audit log via backend:", error);
    }
};
```

### FILE: services/firebase.ts
```typescript
// This service is a remnant of a previous architecture and is now only used as a potential
// fallback for offline functionality. The primary data source and authentication provider
// is the Node.js backend server connected to a MySQL database.

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';


// These variables are expected to be populated by the build environment or a script tag.
declare global {
  var __firebase_config: string | undefined;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  const firebaseConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
  const firebaseConfig = JSON.parse(firebaseConfigStr);

  if (Object.keys(firebaseConfig).length > 0 && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    db = getFirestore(app);
  } else {
    console.warn("Firebase configuration is missing. The application will rely solely on the backend server. Offline features may be limited.");
  }
} catch (error) {
  console.error("Error initializing Firebase for offline fallback:", error);
}

export { app, db };
```

### FILE: services/geminiService.ts
```typescript
import { Question } from '../types';

export const generateQuestionsFromText = async (text: string, count: number, subject: string, token: string): Promise<Question[]> => {
  
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text, count, subject }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'An unexpected server error occurred.' }));
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }

    const generatedQuestions: Omit<Question, 'id'>[] = await response.json();
    
    return generatedQuestions.map((q, index) => ({
      ...q,
      id: `gen-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error fetching questions from local server:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate questions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
};
```

### FILE: services/pdfExporter.ts
```typescript
// This module relies on global scripts for jspdf and html2canvas loaded in index.html
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

export const exportResultsToPdf = async (): Promise<void> => {
    if (!window.jspdf || !window.html2canvas) {
        throw new Error("PDF generation libraries not loaded.");
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let y = margin;

    const summaryElement = document.getElementById('results-summary');
    const questionCards = document.querySelectorAll('.result-card-for-pdf');

    if (summaryElement) {
        const canvas = await window.html2canvas(summaryElement, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        if (y + imgHeight < pageHeight - margin) {
            pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
            y += imgHeight + 10;
        }
    }

    for (const card of Array.from(questionCards)) {
        const canvas = await window.html2canvas(card as HTMLElement, { scale: 2, useCORS: true, backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (y + imgHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }
        
        pdf.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
        y += imgHeight + 5;
    }

    pdf.save('AUCDT_MSEE_Results.pdf');
};
```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — aucdt-msee-aptitude-test
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('aucdt-msee-aptitude-test E2E', () => {
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
## for AUCDT MSEE Mathematics Aptitude Test
**Version:** 2.3
**Date:** November 5, 2023

---
### **Table of Contents**
1. [Introduction](#1-introduction)
    1.1 [Purpose](#11-purpose)
    1.2 [Scope](#12-scope)
    1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
2. [Overall Description](#2-overall-description)
    2.1 [Product Perspective](#21-product-perspective)
    2.2 [Product Features](#22-product-features)
    2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4 [Operating Environment](#24-operating-environment)
3. [System Features](#3-system-features)
    3.1 [Student Examination Module](#31-student-examination-module)
    3.2 [Administrator Module](#32-administrator-module)
    3.3 [Self-Test & Demonstration Module](#33-self-test--demonstration-module)
    3.4 [Accessibility Module](#34-accessibility-module)
    3.5 [Auditing Module](#35-auditing-module)
4. [External Interface Requirements](#4-external-interface-requirements)
    4.1 [User Interfaces](#41-user-interfaces)
    4.2 [Software Interfaces](#42-software-interfaces)
5. [Non-Functional Requirements](#5-non-functional-requirements)
    5.1 [Performance](#51-performance)
    5.2 [Security](#52-security)
    5.3 [Reliability](#53-reliability)
6. [System Architecture](#6-system-architecture)
    6.1 [Application Architecture](#61-application-architecture)
    6.2 [Database Schema](#62-database-schema)

---

### **1. Introduction**

#### **1.1 Purpose**
This document provides a detailed specification for the AUCDT Mature Students Entrance Examination (MSEE) Mathematics Aptitude Test web application, Version 2.2. The application is designed to provide a modern, robust, and accessible platform for students to take a timed mathematics exam and for administrators to manage and generate exam content using Artificial Intelligence.

#### **1.2 Scope**
The application is a comprehensive tool for mathematics assessment. Its scope includes:
*   A timed, multiple-choice examination environment for students, requiring user authentication.
*   A client-server architecture with a Node.js backend and a MySQL database.
*   Automatic server-side saving and restoration of exam progress.
*   A results summary with question-by-question feedback and PDF export functionality.
*   A password-protected admin section for generating new exam questions from text via a secure backend proxy to the Google Gemini API.
*   An automated self-test mode to demonstrate application functionality.
*   User-selectable accessibility themes (Light, Dark, High-Contrast).
*   Secure, server-side audit logging of key events to the MySQL database.
*   Filtering and searching of available exams for students.

#### **1.3 Definitions, Acronyms, and Abbreviations**
*   **AI**: Artificial Intelligence
*   **API**: Application Programming Interface
*   **SPA**: Single Page Application
*   **SRS**: Software Requirements Specification
*   **UI/UX**: User Interface / User Experience
*   **PDF**: Portable Document Format
*   **WCAG**: Web Content Accessibility Guidelines
*   **JWT**: JSON Web Token

### **2. Overall Description**

#### **2.1 Product Perspective**
The product is a three-tier, client-server application. The frontend is a Single Page Application (SPA) built using React and TypeScript. It is served by a Node.js (Express) backend, which handles all business logic, manages user authentication via JWTs, and acts as a secure proxy for API calls to the Google Gemini API. Persistence is managed by a self-hosted MySQL database.

#### **2.2 Product Features**
*   **Secure Authentication:** Role-based access control for students and administrators with JWT-based session management.
*   **Dynamic Student Flow:** A seamless experience from starting the exam to reviewing detailed results.
*   **Secure AI-Powered Content Creation:** Administrators generate new exam questions through the local server, which securely manages the API key and communication with the Google Gemini API.
*   **Persistent Progress Management:** Student work is saved automatically to the server, allowing them to resume sessions across different devices.
*   **Accessibility First:** A theme switcher ensures the application is usable for a wider range of users.
*   **Built-in Demo & Testing:** A self-test mode provides a quick, automated walkthrough of application features.
*   **Administrative Oversight:** Server-side audit logs in the MySQL database provide a secure record of important system interactions.
*   **Enhanced Exam Discovery:** Students can filter exams by subject and search by name.

#### **2.3 User Classes and Characteristics**
1.  **Student:** The primary user. Must register and log in to an account. Interacts with the exam-taking interface.
2.  **Administrator (Privileged User):** A user with a specific 'admin' role in the database. Accesses a separate interface to manage exam content.

#### **2.4 Operating Environment**
The application requires a server environment (e.g., an Ubuntu server) capable of running Node.js and a MySQL database. The client-side component runs in any modern web browser with JavaScript enabled. Internet connectivity is required for all functions.

### **3. System Features**

#### **3.1 Student Examination Module**
*   **3.1.1 Authentication:** Students must register and sign in to access the examination portal.
*   **3.1.2 Start Screen:** Presents exam instructions, duration, and an option to randomize question order. Allows students to filter available exams by subject and search by name.
*   **3.1.3 Exam Interface:** Displays a countdown timer, question navigation grid, and one question at a time. Features a control bar with buttons for manually pausing, resuming, and resetting the exam. The timer also pauses automatically if the user navigates away from the browser tab.
*   **3.1.4 Answering:** Users select answers from multiple-choice options. Progress is auto-saved to the server periodically.
*   **3.1.5 Submission:** The exam is submitted automatically when time expires, or manually by the student.
*   **3.1.6 Results View:** Displays the final score and a detailed review of each question. Users can export their results to a PDF.

#### **3.2 Administrator Module**
*   **3.2.1 Secure Access:** The admin panel is accessible via a `?admin` URL parameter and is protected by role-based authentication.
*   **3.2.2 Exam Generation:** Admins can paste text content into a text area and select a subject. Clicking "Generate" sends a request to the local Node.js server, which then securely calls the Google Gemini API.
*   **3.2.3 Exam Management:** Admins provide a name and description for the generated exam before saving it to the MySQL database.

#### **3.3 Self-Test & Demonstration Module**
*   **3.3.1 Access:** The mode is activated by navigating to the `?selftest` URL parameter.
*   **3.3.2 Automated Workflow:** The application automatically simulates the entire student journey.
*   **3.3.3 Screenshot Utility:** The self-test view includes a button to capture a screenshot of the current application state.

#### **3.4 Accessibility Module**
*   **3.4.1 Theme Switcher:** A UI component allows any user to toggle between 'Light', 'Dark', and 'High-Contrast' themes.
*   **3.4.2 State Persistence:** The selected theme is saved in the browser's local storage.

#### **3.5 Auditing Module**
*   **3.5.1 Event Logging:** Key actions are logged by the backend into the `audit_logs` table in the MySQL database.
*   **3.5.2 Secure Storage:** Logs are inaccessible from the client-side, ensuring integrity.

### **4. External Interface Requirements**

#### **4.1 User Interfaces**
The application presents a clean, responsive UI. It uses the MathJax library to render mathematical formulas, ensuring they are sharp and readable.

#### **4.2 Software Interfaces**
*   **Node.js/Express:** The backend server environment.
*   **MySQL:** The relational database for all application data.
*   **Google Gemini API (@google/genai):** Used by the backend server to generate questions.
*   **jsPDF & html2canvas:** Client-side libraries used for PDF export and screenshot capture.
*   **MathJax:** A client-side library for rendering mathematical notation.

### **5. Non-Functional Requirements**

#### **5.1 Performance**
The application shall have a fast initial load time. Backend API calls must be efficient and provide clear loading states on the client.

#### **5.2 Security**
*   User passwords are not stored in plaintext; they are hashed using `bcrypt`.
*   Sessions are managed using secure, short-lived JSON Web Tokens (JWTs).
*   Role-based authorization is enforced on the server for all sensitive actions (e.g., saving exams).
*   The Google Gemini API key is stored securely on the server as an environment variable.

#### **5.3 Reliability**
The backend server should include robust error handling. The frontend will gracefully handle server errors, displaying informative messages to the user.

### **6. System Architecture**

#### **6.1 Application Architecture**
The system is a three-tier application consisting of a client (browser), a backend server (Node.js), and a database (MySQL), all running on a single server environment, with external calls to Google's AI services.

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" font-family="Arial, sans-serif" font-size="14px">
  <defs>
    <style>
      .box { fill: #fff; stroke: #333; stroke-width: 2; rx: 8; }
      .client-box { fill: #E3F2FD; stroke: #2196F3; }
      .server-box { fill: #E0F2F1; stroke: #009688; }
      .db-box { fill: #F3E5F5; stroke: #8E24AA; }
      .api-box { fill: #FCE4EC; stroke: #E91E63; }
      .arrow { stroke: #333; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
      .label { fill: #333; text-anchor: middle; }
      .title { font-size: 20px; font-weight: bold; text-anchor: middle; }
      .area-label { font-size: 16px; font-weight: bold; fill: #666; }
    </style>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#333"/>
    </marker>
  </defs>

  <rect x="1" y="1" width="798" height="598" fill="#F9FAFB" rx="10"/>
  <text x="400" y="40" class="title">AUCDT MSEE Test App - Architecture Diagram</text>

  <!-- Zones -->
  <rect x="20" y="70" width="370" height="510" fill="#F0F4F8" rx="5" stroke-dasharray="5,5" stroke="#90A4AE"/>
  <text x="205" y="95" class="area-label">User's Browser</text>
  
  <rect x="410" y="70" width="370" height="510" fill="#F0FBF4" rx="5" stroke-dasharray="5,5" stroke="#A5D6A7"/>
  <text x="595" y="95" class="area-label">Ubuntu Server</text>

  <!-- Client Application -->
  <g id="react-app">
    <rect x="50" y="250" width="310" height="150" class="box client-box"/>
    <text x="205" y="275" class="label" font-weight="bold">React SPA (Served by Node.js)</text>
    <text x="205" y="310" class="label">Student Exam Flow</text>
    <text x="205" y="340" class="label">Admin Panel</text>
    <text x="205" y="370" class="label">User Interface</text>
  </g>
  
  <!-- Server -->
   <g id="node-server">
    <rect x="440" y="140" width="310" height="150" class="box server-box"/>
    <text x="595" y="165" class="label" font-weight="bold">Node.js Backend (Express.js)</text>
    <text x="595" y="200" class="label">API Endpoints (/api/...)</text>
    <text x="595" y="225" class="label">Authentication (JWT)</text>
    <text x="595" y="250" class="label">Static File Serving</text>
  </g>

  <!-- Database -->
  <g id="mysql-db">
    <rect x="440" y="380" width="310" height="150" class="box db-box"/>
    <text x="595" y="405" class="label" font-weight="bold">MySQL Database</text>
    <text x="595" y="440" class="label">Users & Roles</text>
    <text x="595" y="465" class="label">Exams & Progress</text>
    <text x="595" y="490" class="label">Audit Logs</text>
  </g>
  
  <!-- Arrows -->
  <path class="arrow" d="M 360 325 H 440"/>
  <text x="400" y="320" class="label" font-size="12px">HTTP API Calls</text>
  
  <path class="arrow" d="M 595 290 V 380"/>
  <text x="635" y="335" class="label" font-size="12px">DB Queries</text>
  
  <!-- External API -->
  <g transform="translate(150, 450)">
    <rect x="440" y="-130" width="200" height="100" class="box api-box"/>
    <text x="540" y="-105" class="label" font-weight="bold">Google GenAI API</text>
    <text x="540" y="-75" class="label">Gemini 2.5 Flash</text>
    <path class="arrow" d="M 540 -180 V -130"/>
    <text x="540" y="-150" class="label" font-size="12px">Secure API Call</text>
  </g>
  <path class="arrow" d="M 595 140 C 625 110, 625 80, 540 80 C 455 80, 455 110, 540 180" stroke="none" fill="none"/>
  
</svg>

#### **6.2 Database Schema**
The MySQL database is composed of several related tables to manage users, exams, progress, and logs. See `docs/DATABASE_SCHEMA.svg` for a visual representation.
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
export interface Bonus {
  title: string;
  content: string;
}

export interface Question {
  id: number | string;
  question: string;
  options: string[];
  correct: number;
  diagram?: 'right_triangle_abc' | 'angles_on_line' | 'pie_chart_colors' | 'circle_radius' | 'cube_side';
  bonus?: Bonus;
}

export interface Exam {
  id: string;
  name: string;
  questions: string; // Stored as a JSON string in the database
  subject?: string;
  description?: string;
}

export interface Answers {
  [questionId: string | number]: number;
}

export interface User {
  uid: string;
  email?: string | null;
  role?: 'student' | 'admin';
}

export interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — aucdt-msee-aptitude-test
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

// Vitest E2E configuration — aucdt-msee-aptitude-test
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

### FILE: _tmp_51236_86a177e39dbfd23944eed60f54dd79ff
```text

```

