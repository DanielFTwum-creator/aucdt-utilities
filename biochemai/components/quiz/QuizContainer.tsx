import React, { useState, useCallback } from 'react';
import { LearningLevel, QuizQuestion } from '../../types';
import { generateQuiz } from '../../services/geminiService';
import { getQuizQuestionCount } from '../../services/adminService';
import { QuizSetup } from './QuizSetup';
import { QuizActive } from './QuizActive';
import { QuizResults } from './QuizResults';
import { SVGNetworkBackground } from '../SVGNetworkBackground';
import { GlassmorphismCard } from '../GlassmorphismCard';

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
                    <GlassmorphismCard className="text-center p-10">
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">Generating Your Quiz...</h2>
                        <div className="flex justify-center items-center space-x-2">
                            <div className="w-3 h-3 bg-[var(--color-accent-primary)] rounded-full dot-1"></div>
                            <div className="w-3 h-3 bg-[var(--color-accent-primary)] rounded-full dot-2"></div>
                            <div className="w-3 h-3 bg-[var(--color-accent-primary)] rounded-full dot-3"></div>
                        </div>
                        <p className="text-[var(--color-text-secondary)] mt-4">BioChemAI is preparing {numQuestions} questions for you.</p>
                    </GlassmorphismCard>
                );
            case 'active':
                return (
                    <GlassmorphismCard>
                        <QuizActive questions={questions} userAnswers={userAnswers} onAnswer={handleAnswer} onFinish={handleFinish} />
                    </GlassmorphismCard>
                );
            case 'results':
                return (
                    <GlassmorphismCard>
                        <QuizResults questions={questions} userAnswers={userAnswers} onRestart={handleRestart} />
                    </GlassmorphismCard>
                );
            case 'error':
                 return (
                    <GlassmorphismCard className="text-center p-10 max-w-2xl mx-auto">
                        <h2 className="text-xl font-semibold text-[var(--color-error)] mb-2">Oops! Something went wrong.</h2>
                        <p className="text-[var(--color-error)] mb-6">{error}</p>
                        <button
                            onClick={handleRestart}
                            className="px-6 py-2 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] transition"
                        >
                            Try Again
                        </button>
                    </GlassmorphismCard>
                );
            case 'setup':
            default:
                return (
                    <GlassmorphismCard>
                        <QuizSetup
                            topic={topic}
                            setTopic={setTopic}
                            learningLevel={learningLevel}
                            setLearningLevel={setLearningLevel}
                            numQuestions={numQuestions}
                            setNumQuestions={setNumQuestions}
                            onStart={handleStartQuiz}
                        />
                    </GlassmorphismCard>
                );
        }
    };

    return (
        <div className="w-full relative">
            <SVGNetworkBackground accentColor="--color-accent-primary" opacity={0.07} />
            <div className="relative z-10">
                {renderContent()}
            </div>
        </div>
    );
};