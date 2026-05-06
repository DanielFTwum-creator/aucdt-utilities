

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QuizData, UserAnswer, Question, QuizSettings } from '../types.ts';
import { Button, Card } from './ui.tsx';
import KatexRenderer from './KatexRenderer.tsx';
import { QuestionNavigator } from './QuestionNavigator.tsx';

interface QuizProps {
  quizData: QuizData;
  settings: QuizSettings;
  onQuizComplete: (answers: UserAnswer[]) => void;
}

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const Quiz = ({ quizData, settings, onQuizComplete }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const { timeLimit } = settings;
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const answeredIndices = useMemo(() => Object.keys(answers).map(Number), [answers]);
  const isLastQuestion = useMemo(() => currentQuestionIndex === totalQuestions - 1, [currentQuestionIndex, totalQuestions]);

  const handleSubmit = useCallback(() => {
    const finalAnswers = Object.values(answers);
    onQuizComplete(finalAnswers);
  }, [answers, onQuizComplete]);

  useEffect(() => {
    if (!timeLimit || timeLimit <= 0) return;

    const timer = setInterval(() => {
        setTimeLeft(prevTime => {
            if (prevTime <= 1) {
                clearInterval(timer);
                handleSubmit();
                return 0;
            }
            return prevTime - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, handleSubmit]);

  const handleSelectOption = (option: string) => {
    if (!currentQuestion) return;
    
    const correctAnswerString = currentQuestion.options[currentQuestion.correct];
    const answer: UserAnswer = {
      question: currentQuestion,
      selectedAnswer: option,
      isCorrect: option === correctAnswerString,
    };

    setAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: answer,
    }));
  };

  const handleNavigation = (index: number) => {
    if(index >= 0 && index < totalQuestions) {
        setCurrentQuestionIndex(index);
    }
  }

  const handleNextOrSubmit = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
        let nextIndex = -1;
        for (let i = 0; i < totalQuestions; i++) {
            if (!answers.hasOwnProperty(i)) {
                nextIndex = i;
                break;
            }
        }
        if(nextIndex === -1) {
            nextIndex = currentQuestionIndex + 1;
        }
        handleNavigation(nextIndex < totalQuestions ? nextIndex : currentQuestionIndex + 1);

    } else {
        handleSubmit();
    }
  }

  const formatTime = (seconds: number) => {
      if (seconds <= 0) return '00:00';
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progressPercentage = totalQuestions > 0 ? ((answeredIndices.length) / totalQuestions) * 100 : 0;
  
  if (!currentQuestion) {
      return (
          <div className="max-w-3xl mx-auto p-4">
              <Card><p className="text-center text-gray-300">Loading quiz...</p></Card>
          </div>
      );
  }
  
  const hasImageOnLeft = !!currentQuestion.imageUrl;

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col gap-6" data-testid="quiz-view">
      <Card className="mb-0">
        <div className="flex justify-between items-center mb-2">
            <p data-testid="question-counter" className="text-sm font-semibold text-gray-400">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
            {timeLimit > 0 && (
                <div data-testid="quiz-timer" className={`flex items-center font-mono text-lg font-bold rounded-full px-3 py-1 transition-colors duration-300 ${timeLeft < 60 && timeLeft > 0 ? 'text-yellow-300 bg-yellow-900/50 animate-pulse' : 'text-gray-300 bg-black/30'}`}>
                    <ClockIcon />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            )}
        </div>
        <div className="w-full bg-black/30 rounded-full h-1.5 mb-4">
            <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <QuestionNavigator 
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            answeredIndices={answeredIndices}
            onNavigate={handleNavigation}
        />
      </Card>

      <div className={`grid gap-8 ${hasImageOnLeft ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {hasImageOnLeft && (
              <div className="md:sticky md:top-8 h-fit bg-[#0d1f1a] p-4 rounded-lg border border-white/10 flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Visual Reference</h3>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 16 16">
                         <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                     </svg>
                   </div>
                  <img src={currentQuestion.imageUrl} alt={`Visual for question ${currentQuestion.id}`} className="rounded-lg max-w-full h-auto object-contain" />
              </div>
          )}
          
          <div className={hasImageOnLeft ? 'md:col-start-2' : ''}>
               <Card>
                <h2 data-testid={`question-text-${currentQuestion.id}`} className="text-2xl font-bold mb-8 text-gray-100 leading-tight">
                    <KatexRenderer text={currentQuestion.question} />
                </h2>
                
                <div className="space-y-4 mb-8">
                    {currentQuestion.options.map((option, index) => {
                    const optionPrefix = String.fromCharCode(65 + index);
                    const isSelected = answers[currentQuestionIndex]?.selectedAnswer === option;
                    return (
                        <button
                            key={index}
                            data-testid={`option-${currentQuestion.id}-${index}`}
                            onClick={() => handleSelectOption(option)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-lg
                            ${isSelected
                                ? 'bg-green-800/50 text-white border-green-500 shadow-lg' 
                                : 'bg-[#081410] text-gray-200 border-gray-700 hover:border-green-600'}`}
                        >
                            <div className="flex items-start">
                                <span className="font-bold text-lg mr-4 text-gray-400">{optionPrefix}.</span>
                                <span className="flex-1"><KatexRenderer text={option} /></span>
                            </div>
                        </button>
                    )
                    })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button data-testid="next-button" onClick={handleNextOrSubmit} className="w-full text-xl py-3">
                        {isLastQuestion ? 'Submit Answers' : 'Next Question'}
                    </Button>
                    {!isLastQuestion && (
                        <Button data-testid="submit-button" onClick={handleSubmit} variant="secondary" className="w-full text-xl py-3">
                        Submit Answers
                        </Button>
                    )}
                </div>
               </Card>
          </div>
      </div>
    </div>
  );
};