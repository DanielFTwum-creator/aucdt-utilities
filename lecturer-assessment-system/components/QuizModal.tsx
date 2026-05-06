
import React, { useState, useEffect, useMemo } from 'react';
import type { Course } from '../types';

interface QuizModalProps {
    course: Course;
    onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ course, onClose }) => {
    const quiz = course.quiz!;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(quiz.questions.length).fill(null));
    const [timeLeft, setTimeLeft] = useState(quiz.duration);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished]);

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setAnswers(newAnswers);
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };

    const score = useMemo(() => {
        if (!isFinished) return 0;
        return answers.reduce((correctCount, answer, index) => {
            if (answer === quiz.questions[index].correctAnswerIndex) {
                return correctCount + 1;
            }
            return correctCount;
        }, 0);
    }, [isFinished, answers, quiz.questions]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-lg p-6 animate-fade-in-up">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-brand-primary">{course.name} Quiz</h2>
                    {!isFinished && <div className="text-lg font-mono bg-brand-primary/10 text-brand-primary px-3 py-1 rounded">{formatTime(timeLeft)}</div>}
                </div>

                {isFinished ? (
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-brand-accent">Quiz Completed!</h3>
                        <p className="my-4 text-xl">Your Score:</p>
                        <p className="text-5xl font-extrabold text-brand-primary">{score} / {quiz.questions.length}</p>
                        <button onClick={onClose} className="mt-6 w-full bg-brand-primary text-brand-text-light py-2 px-4 rounded-md hover:opacity-90 transition-colors">
                            Close
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="text-sm text-gray-500 mb-2">Question {currentQuestionIndex + 1} of {quiz.questions.length}</div>
                        <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button key={index} onClick={() => handleAnswerSelect(index)}
                                    className={`w-full text-left p-3 rounded-md border-2 transition-colors
                                        ${answers[currentQuestionIndex] === index 
                                            ? 'bg-brand-secondary border-brand-secondary text-brand-text-primary' 
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <button onClick={handleNext} disabled={answers[currentQuestionIndex] === null}
                            className="mt-6 w-full bg-brand-primary text-brand-text-light py-2 px-4 rounded-md hover:opacity-90 disabled:bg-gray-400 transition-colors">
                            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;