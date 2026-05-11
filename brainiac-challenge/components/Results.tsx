


import React, { useMemo } from 'react';
import { UserAnswer } from '../types.ts';
import { Button, Card } from './ui.tsx';
import KatexRenderer from './KatexRenderer.tsx';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 inline-block mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 inline-block mr-2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;

interface ResultsProps {
  answers: UserAnswer[];
  totalQuestions: number;
  onTryAgain: () => void;
  onNewChallenge: () => void;
}

export const Results = ({ answers, totalQuestions, onTryAgain, onNewChallenge }: ResultsProps) => {
  const { score, feedback, correctCount, totalCount } = useMemo(() => {
    const correct = answers.filter(a => a.isCorrect).length;
    const total = totalQuestions; // Use the total number of questions for accurate scoring
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    let feedbackMessage = "Keep practicing!";
    if (percentage === 100) feedbackMessage = "Perfect Score! Absolutely brilliant!";
    else if (percentage >= 80) feedbackMessage = "Excellent work! You're a true Brainiac!";
    else if (percentage >= 60) feedbackMessage = "Great job! You've got a strong grasp on this.";
    else if (percentage >= 40) feedbackMessage = "Good effort! A little more practice will make perfect.";
    
    return { score: percentage, feedback: feedbackMessage, correctCount: correct, totalCount: total };
  }, [answers, totalQuestions]);

  return (
    <div className="max-w-6xl mx-auto p-4" data-testid="results-view">
      <Card className="text-center">
        <h1 className="text-2xl font-bold text-gray-200 mb-2">Challenge Complete!</h1>
        <p data-testid="score-feedback" className="text-xl text-yellow-500 mb-6">{feedback}</p>
        
        <div className="my-8">
            <div className={`relative w-48 h-48 mx-auto rounded-full flex items-center justify-center text-5xl font-extrabold bg-gradient-to-tr from-green-500/20 to-yellow-500/20`}>
                <div className="absolute inset-2 bg-black/30 rounded-full flex items-center justify-center">
                    <span data-testid="score-percentage" className="text-yellow-500">{score}%</span>
                </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-gray-200">You answered {correctCount} out of {totalCount} correctly.</p>
        </div>

        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4 mb-8">
          <Button data-testid="try-again-button" onClick={onTryAgain} variant="secondary">Try Again</Button>
          <Button data-testid="new-challenge-button" onClick={onNewChallenge} variant="primary">New Challenge</Button>
        </div>
      </Card>
      
      <Card className="mt-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Review Your Answers</h2>
        <ul className="space-y-4">
          {answers.map((ans, index) => {
            const { question } = ans;
            const options = question.options;
            const correctAnswerText = options[question.correct];
            const correctAnswerPrefix = String.fromCharCode(65 + question.correct);

            const selectedAnswerIndex = options.findIndex(opt => opt === ans.selectedAnswer);
            const selectedAnswerPrefix = selectedAnswerIndex > -1 ? String.fromCharCode(65 + selectedAnswerIndex) : '?';
            
            const hasImageOnLeft = !!question.imageUrl;

            return (
                <li key={index} data-testid={`review-item-${question.id}`} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <div className={`grid gap-8 ${hasImageOnLeft ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                        {hasImageOnLeft && (
                             <div className="h-fit bg-[#0d1f1a] p-4 rounded-lg border border-white/10 flex flex-col self-start">
                                <h3 className="text-xs font-semibold text-gray-400 mb-4 text-center uppercase tracking-widest">Visual Reference</h3>
                                <img src={question.imageUrl} alt={`Visual for question ${question.id}`} className="rounded-lg max-w-full h-auto object-contain" />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold text-lg mb-4 text-gray-200">
                                <KatexRenderer text={question.question} />
                            </p>
                            <div className="text-md text-gray-300 space-y-2">
                                {ans.isCorrect ? (
                                    <p data-testid={`review-item-${question.id}-correct`} className="flex items-center bg-green-900/40 p-3 rounded-md">
                                        <CheckCircleIcon /> 
                                        Correct Answer: 
                                        <span className="font-bold ml-2 text-green-300">
                                            {correctAnswerPrefix}. <KatexRenderer text={correctAnswerText} />
                                        </span>
                                    </p>
                                ) : (
                                <>
                                    <p data-testid={`review-item-${question.id}-incorrect`} className="flex items-center bg-red-900/40 p-3 rounded-md">
                                        <XCircleIcon /> 
                                        Your Answer: 
                                        <span className="font-bold ml-2 text-red-300">
                                            {selectedAnswerPrefix}. <KatexRenderer text={ans.selectedAnswer} />
                                        </span>
                                    </p>
                                    <p className="flex items-center bg-green-900/40 p-3 rounded-md">
                                        <CheckCircleIcon /> 
                                        Correct Answer: 
                                        <span className="font-bold ml-2 text-green-300">
                                            {correctAnswerPrefix}. <KatexRenderer text={correctAnswerText} />
                                        </span>
                                    </p>
                                </>
                                )}
                            </div>
                        </div>
                    </div>
                </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};