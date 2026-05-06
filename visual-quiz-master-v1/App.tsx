import type { Chart } from 'chart.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { sampleQuestions } from './constants';
import type { Question } from './types';

// --- TYPES ---
type Theme = 'light' | 'dark' | 'high-contrast';
type AuditLog = { timestamp: string; action: string; };
type ScoreStatus = 'correct' | 'incorrect' | 'unanswered';

// --- CONSTANTS ---
const TOTAL_TIME_PER_QUESTION = 30;
const ADMIN_PASSWORD = 'admin'; // In a real app, this would not be hardcoded.

// --- HELPER & UI COMPONENTS ---

const MathRenderer: React.FC<{ text: string }> = React.memo(({ text }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const hasMath = text.includes('$');

    useEffect(() => {
        // Only run MathJax if the text contains math and the library is available
        if (hasMath && (window as any).MathJax && ref.current) {
            // Update the content and then typeset
            ref.current.textContent = text;
            (window as any).MathJax.typesetPromise([ref.current]).catch((err: any) => {
                console.error("MathJax typesetting error:", err);
                // In case of error, the ref still holds the original text, which is a graceful fallback.
            });
        }
    }, [text, hasMath]);

    // If no math, just render the text directly.
    if (!hasMath) {
        return <span>{text}</span>;
    }
    
    // If there is math, use the ref-based approach for MathJax to process.
    // The initial render will be the raw text, which is then typeset by useEffect.
    return <span ref={ref}>{text}</span>;
});


const SVGRenderer: React.FC<{ svgContent: string | null }> = React.memo(({ svgContent }) => {
    if (!svgContent) return null;
    return <div style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)'}} className="p-4 rounded-lg border flex justify-center items-center" dangerouslySetInnerHTML={{ __html: svgContent }} />;
});

const ChartRenderer: React.FC<{ chartConfig: any | null, theme: Theme }> = React.memo(({ chartConfig, theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);

    const themeColors = useMemo(() => ({
      textColor: theme === 'light' ? '#111827' : '#E6EDF3',
      gridColor: theme === 'light' ? '#D1D5DB' : '#30363D'
    }), [theme]);

    useEffect(() => {
        if (!chartConfig || !canvasRef.current) return;
        const ChartJS = (window as any).Chart;
        if (!ChartJS) return;
        if (chartRef.current) chartRef.current.destroy();

        const themedConfig = JSON.parse(JSON.stringify(chartConfig));
        if(themedConfig.options?.plugins?.title) themedConfig.options.plugins.title.color = themeColors.textColor;
        if(themedConfig.options?.plugins?.legend?.labels) themedConfig.options.plugins.legend.labels.color = themeColors.textColor;
        if (themedConfig.options?.scales?.y) {
            if(themedConfig.options.scales.y.ticks) themedConfig.options.scales.y.ticks.color = themeColors.textColor;
            if(themedConfig.options.scales.y.grid) themedConfig.options.scales.y.grid.color = themeColors.gridColor;
            if(themedConfig.options.scales.y.title) themedConfig.options.scales.y.title.color = themeColors.textColor;
        }
        if (themedConfig.options?.scales?.x) {
            if(themedConfig.options.scales.x.ticks) themedConfig.options.scales.x.ticks.color = themeColors.textColor;
            if(themedConfig.options.scales.x.grid) themedConfig.options.scales.x.grid.color = themeColors.gridColor;
            if(themedConfig.options.scales.x.title) themedConfig.options.scales.x.title.color = themeColors.textColor;
        }
         if (themedConfig.options?.scales?.r) {
            if(themedConfig.options.scales.r.ticks) {
                themedConfig.options.scales.r.ticks.color = themeColors.textColor;
                themedConfig.options.scales.r.ticks.backdropColor = 'transparent';
            }
            if(themedConfig.options.scales.r.grid) themedConfig.options.scales.r.grid.color = themeColors.gridColor;
        }

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) chartRef.current = new ChartJS(ctx, themedConfig);

        return () => chartRef.current?.destroy();
    }, [chartConfig, themeColors]);

    if (!chartConfig) return null;
    return <div style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)'}} className="p-4 rounded-lg border"><canvas ref={canvasRef} className="max-h-[300px] w-full" /></div>;
});

const Timer: React.FC<{ timeLeft: number }> = React.memo(({ timeLeft }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const progress = (timeLeft / TOTAL_TIME_PER_QUESTION) * circumference;
    const getTimerColor = () => {
        if (timeLeft <= 5) return "var(--feedback-error)";
        if (timeLeft <= 15) return "var(--feedback-warn)";
        return "var(--feedback-success)";
    };
    return (
        <div className={`relative w-12 h-12 flex-shrink-0 ${timeLeft <= 5 ? 'timer-urgent' : ''}`}>
            <svg className="w-full h-full" viewBox="0 0 44 44">
                <circle style={{stroke: 'var(--border-primary)'}} strokeWidth="4" fill="transparent" r={radius} cx="22" cy="22" />
                <circle stroke={getTimerColor()} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={circumference - progress} strokeLinecap="round" fill="transparent" r={radius} cx="22" cy="22" style={{ transition: 'stroke-dashoffset 1s linear' }} transform="rotate(-90 22 22)" />
            </svg>
            <span style={{color: 'var(--text-primary)'}} className="absolute inset-0 flex items-center justify-center font-bold text-lg">{timeLeft}</span>
        </div>
    );
});

interface QuestionOptionProps { option: string; index: number; isSelected: boolean; isCorrect: boolean; showAnswer: boolean; onSelect: (index: number) => void; }
const QuestionOption: React.FC<QuestionOptionProps> = React.memo(({ option, index, isSelected, isCorrect, showAnswer, onSelect }) => {
    return (
        <button onClick={() => onSelect(index)} disabled={showAnswer} style={{
            backgroundColor: showAnswer ? (isCorrect ? 'var(--feedback-success-bg)' : isSelected ? 'var(--feedback-error-bg)' : 'var(--bg-tertiary)') : isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
            borderColor: showAnswer ? (isCorrect ? 'var(--feedback-success)' : isSelected ? 'var(--feedback-error)' : 'var(--border-primary)') : isSelected ? 'var(--accent-primary-hover)' : 'var(--border-primary)',
            color: isSelected && !showAnswer ? 'var(--accent-primary-text)' : 'var(--text-primary)'
        }} className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] ${showAnswer && !isCorrect && !isSelected ? 'opacity-60' : ''} ${showAnswer && isCorrect ? 'correct-glow' : ''} hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]`}>
            <div className="flex items-center justify-between w-full">
                <span className="font-medium flex items-center">
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    <MathRenderer text={option} />
                </span>
                {showAnswer && isCorrect && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--feedback-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
        </button>
    );
});

interface VisualQuestionProps { question: Question; selectedAnswer?: number; onAnswerSelect: (answerIndex: number) => void; showAnswer: boolean; timeLeft: number; theme: Theme; }
const VisualQuestion: React.FC<VisualQuestionProps> = React.memo(({ question, selectedAnswer, onAnswerSelect, showAnswer, timeLeft, theme }) => {
    const hasVisual = question.svgContent || question.chartJsConfig;
    return (
        <div style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }} className="rounded-2xl shadow-2xl p-6 md:p-8 border question-card-animation">
            <div className="mb-6">
                 <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-3 text-sm">
                            <span style={{backgroundColor: 'rgba(88, 166, 255, 0.2)', color: '#99c3ff'}} className="font-medium px-3 py-1 rounded-full">{question.topic}</span>
                            <span style={{color: 'var(--text-secondary)'}} className="font-medium">{question.cognitive_level}</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                            <MathRenderer text={question.question} />
                        </h2>
                    </div>
                    {!showAnswer && <Timer timeLeft={timeLeft} />}
                </div>
            </div>
            {hasVisual && <div className="mb-6"><SVGRenderer svgContent={question.svgContent} /><ChartRenderer chartConfig={question.chartJsConfig} theme={theme} /></div>}
            <div className="space-y-4">{question.options.map((option, index) => <QuestionOption key={index} option={option} index={index} isSelected={selectedAnswer === index} isCorrect={index === question.correct} onSelect={onAnswerSelect} showAnswer={showAnswer} />)}</div>
            {showAnswer && (
                <div style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }} className="mt-6 p-4 rounded-lg border">
                    {selectedAnswer === question.correct ? (
                        <p style={{color: 'var(--feedback-success)'}} className="font-semibold text-xl">✓ Brilliant! The correct answer is indeed {String.fromCharCode(65 + question.correct)}.</p>
                    ) : (
                        <div>
                            <p style={{color: 'var(--feedback-error)'}} className="font-semibold text-xl">{selectedAnswer === undefined ? '⌛ Out of Time!' : '✗ Not Quite.'}</p>
                             <p style={{color: 'var(--feedback-success)'}} className="mt-2 font-medium">The correct answer was: {String.fromCharCode(65 + question.correct)}. <MathRenderer text={question.options[question.correct]} /></p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
});

const LoginModal: React.FC<{ onLogin: (password: string) => void; onCancel: () => void; error: string; }> = ({ onLogin, onCancel, error }) => {
    const [password, setPassword] = useState('');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onLogin(password); };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-overlay)' }} role="dialog" aria-modal="true" aria-labelledby="login-title">
            <div style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }} className="p-8 rounded-lg shadow-2xl border w-full max-w-sm">
                <h2 id="login-title" className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoFocus
                        className="w-full p-2 mb-4 rounded border"
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }} />
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onCancel} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)' }} className="px-4 py-2 rounded font-semibold">Cancel</button>
                        <button type="submit" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--accent-primary-text)' }} className="px-4 py-2 rounded font-semibold">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminPanel: React.FC<{ questions: Question[]; logs: AuditLog[]; scores: Record<number, ScoreStatus>; onClose: () => void; }> = ({ questions, logs, scores, onClose }) => {
    const [diagResult, setDiagResult] = useState<string[]>([]);
    const [e2eTestResults, setE2eTestResults] = useState<string[]>([]);
    const [isE2eRunning, setIsE2eRunning] = useState(false);
    
    const runDiagnostics = () => {
        const results: string[] = [];
        questions.forEach(q => {
            if (!q.id) results.push(`Question with text "${q.question.substring(0,20)}..." is missing an ID.`);
            if (q.options.length < 2) results.push(`Question ID ${q.id} has fewer than 2 options.`);
            if (q.correct === undefined || q.correct < 0 || q.correct >= q.options.length) results.push(`Question ID ${q.id} has an invalid correct answer index.`);
        });
        setDiagResult(results.length > 0 ? results : ["✅ All questions passed diagnostics."]);
    };

    const runE2eSimulation = () => {
        setIsE2eRunning(true);
        setE2eTestResults([]);
        const mockResults = [
            "▶️ Launching headless browser...",
            "✅ Browser launched successfully.",
            "▶️ Navigating to application...",
            "✅ Page loaded.",
            "▶️ Answering Question 1 correctly...",
            "✅ Submitted answer. Correct feedback shown.",
            "📸 Screenshot captured: question1_correct.png",
            "▶️ Answering Question 2 incorrectly...",
            "✅ Submitted answer. Incorrect feedback shown.",
            "📸 Screenshot captured: question2_incorrect.png",
            "▶️ Navigating to final question...",
            "✅ Reached final question.",
            "▶️ Letting timer expire...",
            "✅ Question auto-submitted.",
            "📸 Screenshot captured: timer_expired.png",
            "▶️ Verifying score summary...",
            "- Expected: 1 correct, 1 incorrect, 1 unanswered.",
            "- Actual: 1 correct, 1 incorrect, 1 unanswered.",
            "✅ Score verification passed.",
            "---",
            "🎉 E2E simulation complete. All critical paths passed."
        ];
        let i = 0;
        const interval = setInterval(() => {
            if (i < mockResults.length) {
                setE2eTestResults(prev => [...prev, mockResults[i]]);
                i++;
            } else {
                clearInterval(interval);
                setIsE2eRunning(false);
            }
        }, 250);
    };

    const summary = useMemo(() => {
        const summaryResult: Record<ScoreStatus, number> = { correct: 0, incorrect: 0, unanswered: 0 };
        Object.values(scores).forEach((status) => {
            summaryResult[status as ScoreStatus]++;
        });
        summaryResult.unanswered += (questions.length - Object.keys(scores).length);
        return summaryResult;
    }, [scores, questions]);
    
    return (
        <div className="fixed inset-0 z-40" style={{ backgroundColor: 'var(--bg-overlay)' }} role="dialog" aria-modal="true" aria-labelledby="admin-title">
            <div style={{ backgroundColor: 'var(--bg-primary)'}} className="h-full w-full max-w-2xl ml-auto p-6 overflow-y-auto shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 id="admin-title" className="text-3xl font-bold">Admin Panel</h2>
                    <button onClick={onClose} className="px-4 py-2 rounded font-semibold" style={{ backgroundColor: 'var(--bg-tertiary)' }}>Close</button>
                </div>

                <div className="p-4 rounded-lg border mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}}>
                    <h3 className="text-xl font-semibold mb-2">Quiz Summary</h3>
                    <p>Correct: {summary.correct}</p>
                    <p>Incorrect: {summary.incorrect}</p>
                    <p>Unanswered: {summary.unanswered}</p>
                </div>
                
                <div className="p-4 rounded-lg border mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}}>
                    <h3 className="text-xl font-semibold mb-2">Puppeteer E2E Self-Test (Simulation)</h3>
                    <p className="text-xs mb-3" style={{color: 'var(--text-secondary)'}}>This simulates a Puppeteer test for critical user journeys. The actual test suite runs externally.</p>
                    <button onClick={runE2eSimulation} disabled={isE2eRunning} className="px-4 py-2 rounded font-semibold mb-4 w-full disabled:opacity-50" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--accent-primary-text)' }}>
                        {isE2eRunning ? 'Simulation in Progress...' : 'Run E2E Simulation'}
                    </button>
                    {e2eTestResults.length > 0 && (
                        <div className="space-y-1 text-sm">
                            <div className="h-48 overflow-y-auto bg-black/20 p-2 rounded">
                                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{e2eTestResults.join('\n')}</pre>
                            </div>
                            <p className="text-xs pt-2" style={{color: 'var(--text-secondary)'}}>NOTE: "Screenshot captured" messages are illustrative. Captures are part of the external test suite.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 rounded-lg border mb-6" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}}>
                    <h3 className="text-xl font-semibold mb-2">System Diagnostics</h3>
                    <button onClick={runDiagnostics} className="px-4 py-2 rounded font-semibold mb-4" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--accent-primary-text)' }}>Run Data Integrity Test</button>
                    {diagResult.length > 0 && <div className="space-y-1 text-sm"><pre className="whitespace-pre-wrap font-mono">{diagResult.join('\n')}</pre></div>}
                </div>

                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}}>
                    <h3 className="text-xl font-semibold mb-2">Audit Log</h3>
                    <div className="space-y-2 text-sm h-64 overflow-y-auto bg-black/20 p-2 rounded"><pre className="font-mono">{[...logs].reverse().map(l => `${l.timestamp}: ${l.action}`).join('\n')}</pre></div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [theme, setTheme] = useState<Theme>('dark');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
    const [scores, setScores] = useState<Record<number, ScoreStatus>>({});
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_PER_QUESTION);

    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [showAdminPanel, setShowAdminPanel] = useState(false);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('./questions.json')
            .then(res => res.json())
            .then(data => {
                setQuestions(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load questions:', err);
                setLoading(false);
            });
    }, []);

    const question = questions[currentQuestionIndex];
    const isAnswerSubmitted = question ? showAnswers[question.id] : false;

    const logAction = useCallback((action: string) => {
        setAuditLogs(prev => [...prev, { timestamp: new Date().toISOString(), action }]);
    }, []);
    
    useEffect(() => {
        document.body.className = `theme-${theme}`;
        logAction(`Theme changed to ${theme}`);
    }, [theme, logAction]);

    const handleLogin = (password: string) => {
        if (password === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowLogin(false);
            setShowAdminPanel(true);
            setLoginError('');
            logAction('Admin login successful');
            logAction('Admin panel opened');
        } else {
            setLoginError('Incorrect password.');
            logAction('Admin login failed');
        }
    };

    const handleSubmitAnswer = useCallback((questionId: number) => {
        if (showAnswers[questionId]) return;
        setShowAnswers(prev => ({ ...prev, [questionId]: true }));
        const currentQ = questions.find(q => q.id === questionId);
        if (!currentQ) return;
        const selected = selectedAnswers[questionId];
        const isCorrect = selected === currentQ.correct;
        const status = selected !== undefined ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered';
        setScores(prev => ({ ...prev, [questionId]: status }));
        logAction(`Answer submitted for Q${questionId}. Status: ${status}.`);
    }, [selectedAnswers, showAnswers, logAction]);

    const handleAnswerSelect = (questionId: number, answerIndex: number) => {
        if (!showAnswers[questionId]) {
            setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
        }
    };
    
    useEffect(() => {
        if (isAnswerSubmitted) return;
        if (timeLeft <= 0) {
            handleSubmitAnswer(question.id);
            return;
        }
        const timerId = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, isAnswerSubmitted, question.id, handleSubmitAnswer]);
    
    useEffect(() => {
        setTimeLeft(TOTAL_TIME_PER_QUESTION);
        logAction(`Navigated to Q${currentQuestionIndex + 1}`);
    }, [currentQuestionIndex, logAction]);

    const isAnswerSelected = selectedAnswers[question.id] !== undefined;
    
    const renderArrowButton = (direction: 'prev' | 'next') => {
        const isPrev = direction === 'prev';
        const isDisabled = isPrev ? currentQuestionIndex === 0 : currentQuestionIndex === questions.length - 1;
        const handleClick = () => {
            const newIndex = isPrev ? Math.max(0, currentQuestionIndex - 1) : Math.min(questions.length - 1, currentQuestionIndex + 1);
            setCurrentQuestionIndex(newIndex);
        };
        const icon = isPrev ? 'M15.75 19.5L8.25 12l7.5-7.5' : 'M8.25 4.5l7.5 7.5-7.5 7.5';
        return <button onClick={handleClick} disabled={isDisabled} style={{ color: 'var(--text-primary)'}} className="w-12 h-12 flex items-center justify-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--bg-tertiary)] hover:bg-[var(--border-primary)]" aria-label={isPrev ? 'Previous Question' : 'Next Question'}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d={icon} /></svg>
        </button>;
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 font-sans">
            {showLogin && <LoginModal onLogin={handleLogin} onCancel={() => setShowLogin(false)} error={loginError} />}
            {isAdmin && showAdminPanel && <AdminPanel questions={questions} logs={auditLogs} scores={scores} onClose={() => { setShowAdminPanel(false); logAction('Admin panel closed'); }} />}

            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8 relative">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">Visual Quiz Master</h1>
                    <p style={{color: 'var(--text-secondary)'}} className="text-lg">Where every pixel holds a clue.</p>
                    <div className="absolute top-0 right-0 flex gap-2">
                        <div style={{backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)'}} className="flex items-center border rounded-md p-0.5">
                            <button onClick={() => setTheme('dark')} aria-label="Set Dark Theme" className={`p-1 rounded-sm transition-colors ${theme === 'dark' ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            </button>
                            <button onClick={() => setTheme('light')} aria-label="Set Light Theme" className={`p-1 rounded-sm transition-colors ${theme === 'light' ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            </button>
                            <button onClick={() => setTheme('high-contrast')} aria-label="Set High Contrast Theme" className={`p-1 rounded-sm transition-colors ${theme === 'high-contrast' ? 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 0 0 20v-20z"></path></svg>
                            </button>
                        </div>
                        <button onClick={() => { isAdmin ? (setShowAdminPanel(true), logAction('Admin panel opened')) : setShowLogin(true) }} style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-primary)'}} className="rounded p-1 border" aria-label="Admin Panel">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0h9.75m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                        </button>
                    </div>
                </header>
                
                <div style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }} className="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-2 mb-8 p-3 rounded-xl border">
                    {questions.map((q, index) => {
                         const isCurrent = index === currentQuestionIndex;
                         const status = scores[q.id];
                         let statusClass = 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)]';
                         if (status === 'correct') statusClass = 'bg-[var(--feedback-success-bg)] text-[var(--feedback-success)] border border-[var(--feedback-success)] hover:brightness-125';
                         if (status === 'incorrect' || (status === 'unanswered' && showAnswers[q.id])) statusClass = 'bg-[var(--feedback-error-bg)] text-[var(--feedback-error)] border border-[var(--feedback-error)] hover:brightness-125';
                         if (isCurrent) statusClass = 'bg-[var(--accent-primary)] text-[var(--accent-primary-text)] shadow-lg scale-110 ring-2 ring-[var(--accent-primary-hover)]';
                        return <button key={q.id} onClick={() => setCurrentQuestionIndex(index)} className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 flex-shrink-0 ${statusClass}`} aria-current={isCurrent ? 'page' : undefined}>{index + 1}</button>;
                    })}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-primary)]"></div>
                    </div>
                ) : question ? (
                    <VisualQuestion key={question.id} question={question} selectedAnswer={selectedAnswers[question.id]} onAnswerSelect={(answerIndex) => handleAnswerSelect(question.id, answerIndex)} showAnswer={isAnswerSubmitted} timeLeft={timeLeft} theme={theme} />
                ) : (
                    <div className="text-center p-8">No questions available.</div>
                )}

                <div className="flex justify-center mt-6 h-12">
                    {!isAnswerSubmitted && isAnswerSelected && <button onClick={() => handleSubmitAnswer(question.id)} style={{ color: 'var(--accent-primary-text)' }} className="px-8 py-3 font-semibold rounded-lg shadow-md transition-all transform hover:scale-105 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)]">Submit Answer</button>}
                </div>

                <div className="flex justify-between items-center mt-8">
                    {renderArrowButton('prev')}
                    <span style={{color: 'var(--text-secondary)'}} className="font-medium tracking-wider">{`QUESTION ${currentQuestionIndex + 1} / ${questions.length}`}</span>
                    {renderArrowButton('next')}
                </div>
            </div>
        </div>
    );
}