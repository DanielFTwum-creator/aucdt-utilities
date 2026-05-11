import React from 'react';
import { QuizQuestion } from '../../types';
import { RestartIcon } from '../Icons';

interface QuizResultsProps {
    questions: QuizQuestion[];
    userAnswers: (number | null)[];
    onRestart: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ questions, userAnswers, onRestart }) => {
    const score = userAnswers.reduce((acc, answer, index) => {
        return answer === questions[index].correctAnswerIndex ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    const getFeedback = () => {
        if (percentage === 100) return "Perfect Score! You're a biochemistry master!";
        if (percentage >= 80) return "Excellent work! You have a strong grasp of the material.";
        if (percentage >= 60) return "Good job! A little more review could make you an expert.";
        if (percentage >= 40) return "You're on your way! Keep studying and try again.";
        return "Keep learning! Every attempt is a step forward.";
    };
    
    return (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <div className="text-center border-b border-[var(--color-border-primary)] pb-6 mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Quiz Complete!</h1>
                <p className="text-[var(--color-text-secondary)] mt-2">{getFeedback()}</p>
                <div className="mt-6">
                    <p className="text-lg text-[var(--color-text-secondary)]">Your Score</p>
                    <p className="text-6xl font-bold text-[var(--color-text-accent)]">{score}<span className="text-3xl text-[var(--color-text-tertiary)] font-medium">/{questions.length}</span></p>
                    <p className="text-2xl font-semibold text-[var(--color-text-accent)]">({percentage}%)</p>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Review Your Answers</h2>
                <div className="space-y-6">
                    {questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.correctAnswerIndex;
                        return (
                            <div key={index} className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-primary)]">
                                <p className="font-semibold text-[var(--color-text-secondary)] flex items-start">
                                    <span className="mr-2">{index + 1}.</span>
                                    <span>{q.questionText}</span>
                                </p>
                                <div className={`mt-3 pl-6 border-l-2 ml-2 ${isCorrect ? 'border-[var(--color-success)]' : 'border-[var(--color-error)]'}`}>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        Your answer: 
                                        <span className={`font-semibold ${isCorrect ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'}`}>
                                            {userAnswer !== null ? q.options[userAnswer] : 'Not Answered'}
                                        </span>
                                    </p>
                                    {!isCorrect && (
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            Correct answer: <span className="font-semibold text-[var(--color-success)]">{q.options[q.correctAnswerIndex]}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={onRestart}
                className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-3 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition"
            >
                <RestartIcon className="w-5 h-5" />
                Take Another Quiz
            </button>
        </div>
    );
};