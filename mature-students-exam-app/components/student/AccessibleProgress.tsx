
import React from 'react';
import { Question, Answers } from '../../types';
import { COLORS } from '../../constants';

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
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="progress-summary text-base md:text-lg" aria-live="polite" style={{ color: COLORS.aucdtDarkGray }}>
          <span className="sr-only">Question {current + 1} of {total}. {answeredCount} questions answered, {total - answeredCount} remaining.</span>
          <span aria-hidden="true">Question {current + 1} of {total}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Exam progress: ${percentage}% complete`}>
        <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: COLORS.aucdtGreen }} />
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2" role="navigation" aria-label="Question navigation">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => navigateToQuestion(index)}
            className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-110 focus:ring-[#5C4033] ${index === current ? 'ring-2 ring-offset-2 ring-[#5C4033]' : ''}`}
            style={{
              backgroundColor: index === current ? COLORS.aucdtDeepBrown : (answers[q.id] !== undefined ? COLORS.aucdtGreen : COLORS.aucdtLightGray),
              color: index === current || answers[q.id] !== undefined ? COLORS.aucdtWhite : COLORS.aucdtDeepBrown,
            }}
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
