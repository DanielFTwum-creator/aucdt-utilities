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