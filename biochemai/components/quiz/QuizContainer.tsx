import React, { useState, useCallback } from 'react';
import { LearningLevel, QuizQuestion } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import { getQuizQuestionCount } from '../../services/adminService';
import { QuizSetup } from './QuizSetup';
import { QuizActive } from './QuizActive';
import { QuizResults } from './QuizResults';

type QuizState = 'setup' | 'loading' | 'active' | 'results' | 'error';

export const QuizContainer: React.FC = () => {
    const [quizState, setQuizState] = useState<QuizState>('setup');
    const [topic, setTopic] = useState('');
    const [learningLevel, setLearningLevel] = useState<LearningLevel>(LearningLevel.Undergraduate);
    const [numQuestions, setNumQuestions] = useState<number>(() => getQuizQuestionCount());
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
    const [error, setError] = useState<string>('');

    const handleStartQuiz = useCallback(async () => {
        setQuizState('loading');
        setError('');
        try {
            const fetchedQuestions = await generateQuiz(topic, learningLevel, numQuestions);
            if (fetchedQuestions.length === 0) {
              throw new Error("The generated quiz has no questions. Please try a different topic.");
            }
            setQuestions(fetchedQuestions);
            setUserAnswers(new Array(fetchedQuestions.length).fill(null));
            setQuizState('active');
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate quiz. ${errorMessage} Please try again.`);
            setQuizState('error');
        }
    }, [topic, learningLevel, numQuestions]);

    const handleAnswer = (questionIndex: number, answerIndex: number) => {
        setUserAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[questionIndex] = answerIndex;
            return newAnswers;
        });
    };
    
    const handleFinish = () => {
        setQuizState('results');
    };

    const handleRestart = () => {
        setQuizState('setup');
        setTopic('');
        setNumQuestions(getQuizQuestionCount());
        setQuestions([]);
        setUserAnswers([]);
        setError('');
    };
    
    const renderContent = () => {
        switch(quizState) {
            case 'loading':
                return (
                    <div className="text-center p-10 bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Generating Your Quiz...</h2>
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-3 h-3 bg-[var(--color-accent-primary)] rounded-full dot-1"></div>
                            <div className="w-3 h-3 bg-[var(--color-accent-primary)] rounded-full dot-2"></div>
                            <div className="w-3 h-3 bg-[var(--color-accent-primary)] rounded-full dot-3"></div>
                        </div>
                        <p className="text-[var(--color-text-secondary)] mt-4">BioChemAI is preparing {numQuestions} questions for you.</p>
                    </div>
                );
            case 'active':
                return <QuizActive questions={questions} userAnswers={userAnswers} onAnswer={handleAnswer} onFinish={handleFinish} />;
            case 'results':
                return <QuizResults questions={questions} userAnswers={userAnswers} onRestart={handleRestart} />;
            case 'error':
                 return (
                    <div className="text-center p-10 bg-red-500/10 rounded-2xl max-w-2xl mx-auto border border-[var(--color-error)]">
                        <h2 className="text-xl font-semibold text-[var(--color-error)] mb-2">Oops! Something went wrong.</h2>
                        <p className="text-[var(--color-error)] mb-6">{error}</p>
                        <button
                            onClick={handleRestart}
                            className="px-6 py-2 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] transition"
                        >
                            Try Again
                        </button>
                    </div>
                );
            case 'setup':
            default:
                return (
                    <QuizSetup 
                        topic={topic}
                        setTopic={setTopic}
                        learningLevel={learningLevel}
                        setLearningLevel={setLearningLevel}
                        numQuestions={numQuestions}
                        setNumQuestions={setNumQuestions}
                        onStart={handleStartQuiz}
                    />
                );
        }
    };

    return (
        <div className="w-full">
            {renderContent()}
        </div>
    );
};