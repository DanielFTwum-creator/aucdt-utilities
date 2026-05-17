import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import { CheckIcon, XIcon } from '../Icons';

interface QuizActiveProps {
    questions: QuizQuestion[];
    userAnswers: (number | null)[];
    onAnswer: (questionIndex: number, answerIndex: number) => void;
    onFinish: () => void;
}

export const QuizActive: React.FC<QuizActiveProps> = ({ questions, userAnswers, onAnswer, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const question = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const selectedAnswer = userAnswers[currentQuestionIndex];
    const isAnswered = selectedAnswer !== null;

    const handleSelectAnswer = (answerIndex: number) => {
        if (isAnswered) return;
        onAnswer(currentQuestionIndex, answerIndex);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            onFinish();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const getOptionClasses = (index: number) => {
        const baseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer flex items-center justify-between";
        if (!isAnswered) {
            return `${baseClasses} bg-[var(--color-bg-primary)] border-[var(--color-border-secondary)] hover:border-[var(--color-border-focus)] hover:bg-[var(--color-bg-tertiary)]`;
        }
        
        const isCorrect = index === question.correctAnswerIndex;
        const isSelected = index === selectedAnswer;

        if (isCorrect) {
            return `${baseClasses} bg-green-500/20 border-[var(--color-success)] text-[var(--color-success)] font-semibold cursor-default`;
        }
        if (isSelected && !isCorrect) {
            return `${baseClasses} bg-red-500/20 border-[var(--color-error)] text-[var(--color-error)] font-semibold cursor-default`;
        }
        return `${baseClasses} bg-[var(--color-bg-tertiary)] border-[var(--color-border-primary)] text-[var(--color-text-secondary)] cursor-default`;
    };

    return (
        <div className="max-w-3xl mx-auto p-6 sm:p-8 bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <div className="mb-6">
                <p className="text-sm font-semibold text-[var(--color-text-accent)]">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mt-1">{question.questionText}</h2>
            </div>

            <div className="space-y-4">
                {question.options.map((option, index) => (
                    <button key={index} onClick={() => handleSelectAnswer(index)} disabled={isAnswered} className={getOptionClasses(index)}>
                        <span>{option}</span>
                        {isAnswered && index === question.correctAnswerIndex && <CheckIcon className="w-6 h-6 text-[var(--color-success)]" />}
                        {isAnswered && index === selectedAnswer && index !== question.correctAnswerIndex && <XIcon className="w-6 h-6 text-[var(--color-error)]" />}
                    </button>
                ))}
            </div>

            {isAnswered && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <div className="p-4 bg-[var(--color-bg-tertiary)] rounded-lg border border-[var(--color-border-primary)]">
                        <h3 className="font-bold text-[var(--color-text-primary)] mb-1">Explanation</h3>
                        <p className="text-[var(--color-text-secondary)]">{question.explanation}</p>
                    </div>
                    {question.imageSuggestion && (
                        <div className="p-4 bg-[var(--color-bg-info)]/40 rounded-lg border border-[var(--color-accent-primary)]/30">
                            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                                <span>🖼️</span> Visual Aid
                            </h3>
                            <p className="text-[var(--color-text-secondary)] italic">{question.imageSuggestion}</p>
                        </div>
                    )}
                </div>
            )}

            {isAnswered && (
                 <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        onClick={handlePrevious}
                        disabled={isFirstQuestion}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] rounded-lg hover:bg-[var(--color-border-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-text-tertiary)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] transition"
                    >
                        {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                    </button>
                 </div>
            )}
        </div>
    );
};