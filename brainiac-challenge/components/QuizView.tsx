import React, { useState } from 'react';
import { Quiz } from '../types';
import QuestionCard from './QuestionCard';

interface QuizViewProps {
    quiz: Quiz;
    onComplete: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsQuizFinished(true);
        }
    };
    
    if (isQuizFinished) {
        const percentage = Math.round((score / quiz.questions.length) * 100);
        return (
            <div className="text-center max-w-lg mx-auto p-8 bg-[#1a2e28] rounded-lg shadow-2xl">
                <h2 className="text-4xl font-bold text-white mb-4">Challenge Complete!</h2>
                <p className="text-xl text-gray-300 mb-2">You scored:</p>
                <p className="text-6xl font-extrabold text-yellow-400 mb-6">{score} / {quiz.questions.length}</p>
                <p className="text-3xl font-bold text-green-400 mb-8">{percentage}%</p>
                <button
                    onClick={onComplete}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a2e28] focus:ring-green-500 transition-colors"
                >
                    Create Another Quiz
                </button>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-baseline mb-4 px-2">
                 <h2 className="text-xl font-semibold text-white">Topic: {quiz.settings.topic}</h2>
                 <div className="text-lg font-medium text-gray-400">
                    <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <span className="mx-2">|</span>
                    <span>Score: {score}</span>
                </div>
            </div>
            
            <QuestionCard
                key={currentQuestionIndex}
                question={currentQuestion}
                onAnswer={handleAnswer}
                onNext={handleNextQuestion}
            />
        </div>
    );
};

export default QuizView;