import React, { useState, useEffect, useCallback } from 'react';
import QuizSetup from './components/QuizSetup';
import QuizView from './components/QuizView';
import AuditLogView from './components/AuditLogView';
import RefreshStatus from './components/RefreshStatus';
import Spinner from './components/Spinner';
import { generateQuiz } from './services/geminiService';
import { isFirebaseEnabled, signIn, addAuditLog, getAuditLogs } from './services/firebaseService';
import { View, QuizSettings, Quiz, Question, AuditLog } from './types';

const App: React.FC = () => {
    const [view, setView] = useState<View>(View.SETUP);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<Quiz | null>(null);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        const initializeApp = async () => {
            setError(null);
            setIsLoading(true);
            try {
                if (!process.env.API_KEY) {
                    throw new Error("Gemini API key is not configured. Please set API_KEY environment variable.");
                }
                if (isFirebaseEnabled) {
                    await signIn();
                    const logs = await getAuditLogs();
                    setAuditLogs(logs);
                }
            } catch (e) {
                console.error(e);
                const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during initialization.";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        initializeApp();
    }, []);

    const handleGenerateQuiz = useCallback(async (settings: QuizSettings) => {
        setIsLoading(true);
        setError(null);
        setView(View.SETUP); // Stay on setup view while loading
        try {
            const { questions, prompt } = await generateQuiz(settings);

            const newQuiz: Quiz = {
                id: `quiz-${Date.now()}`,
                settings,
                questions,
                createdAt: new Date().toISOString()
            };

            const newLog: AuditLog = {
                id: `log-${Date.now()}`,
                timestamp: new Date().toISOString(),
                settings,
                geminiPrompt: prompt,
                geminiResponse: JSON.stringify(questions, null, 2)
            };
            
            setAuditLogs(prevLogs => [newLog, ...prevLogs]);

            if (isFirebaseEnabled) {
                await addAuditLog(newLog);
            }
            
            setQuizData(newQuiz);
            setView(View.QUIZ);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : "Failed to generate quiz.";
            setError(errorMessage);
            setView(View.SETUP);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleStartOver = () => {
        setQuizData(null);
        setView(View.SETUP);
    };

    const renderContent = () => {
        if (isLoading && view === View.SETUP) {
             return <QuizSetup onGenerate={handleGenerateQuiz} isGenerating={true} setView={setView} />;
        }
        
        if (error && view === View.SETUP) {
            return (
                <div className="max-w-2xl w-full mx-auto">
                    <QuizSetup onGenerate={handleGenerateQuiz} isGenerating={false} setView={setView} />
                    <div className="mt-4 text-center p-4 bg-red-900/20 border border-red-500 rounded-lg">
                        <h2 className="text-lg font-bold text-red-400 mb-2">Application Error</h2>
                        <p className="text-red-300 text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                </div>
            );
        }
        
        switch (view) {
            case View.QUIZ:
                return quizData ? <QuizView quiz={quizData} onComplete={handleStartOver} /> : <p>No quiz data available.</p>;
            case View.AUDIT_LOG:
                return <AuditLogView logs={auditLogs} setLogs={setAuditLogs} isPersistenceEnabled={isFirebaseEnabled} setView={setView} />;
            case View.REFRESH_STATUS:
                return <RefreshStatus setView={setView} />;
            case View.SETUP:
            default:
                return <QuizSetup onGenerate={handleGenerateQuiz} isGenerating={isLoading} setView={setView} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#142520] text-gray-300 font-sans flex flex-col items-center justify-center p-4">
            {renderContent()}
        </div>
    );
};

export default App;