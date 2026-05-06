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