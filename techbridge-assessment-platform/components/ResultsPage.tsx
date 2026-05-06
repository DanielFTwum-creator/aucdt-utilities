
import React, { useState, useEffect } from 'react';
import { Results, View } from '../types';
import { generateFeedback } from '../services/geminiService';
import { Home, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const ReviewAnswers: React.FC<{ results: Results, setReviewMode: (mode: boolean) => void }> = ({ results, setReviewMode }) => (
    <div className="max-w-4xl mx-auto">
        <button onClick={() => setReviewMode(false)} className="flex items-center text-sm font-medium text-brand-maroon mb-6 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Results
        </button>
        <h2 className="text-2xl font-semibold text-brand-brown-dark mb-6">Review Your Answers for {results.assessmentId}</h2>
        <div className="space-y-6">
            {results.questions.map((q, index) => {
                const userAnswer = results.answers[index];
                const isCorrect = userAnswer === q.answer;
                return (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-semibold text-brand-brown-dark mb-4">Question {index + 1}: {q.question}</h3>
                        <div className="space-y-3">
                            {q.options.map(option => {
                                let style = 'border-gray-300';
                                if (option === q.answer) style = 'border-green-500 bg-green-50 text-green-800 font-semibold';
                                if (option === userAnswer && !isCorrect) style = 'border-red-500 bg-red-50 text-red-800';
                                
                                return (
                                    <div key={option} className={`p-3 border-2 rounded-lg flex items-center ${style}`}>
                                        {option === q.answer && <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />}
                                        {option === userAnswer && !isCorrect && <XCircle className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />}
                                        {!((option === q.answer) || (option === userAnswer && !isCorrect)) && <div className="w-5 h-5 mr-3 flex-shrink-0" />}
                                        <span>{option}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const ResultsPage: React.FC<{ results: Results, setView: (view: View) => void }> = ({ results, setView }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
    const [reviewMode, setReviewMode] = useState(false);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoadingFeedback(true);
            const generatedFeedback = await generateFeedback(results);
            setFeedback(generatedFeedback);
            setIsLoadingFeedback(false);
        };

        fetchFeedback();
    }, [results]);

    if (reviewMode) {
        return <ReviewAnswers results={results} setReviewMode={setReviewMode} />;
    }

    const percentage = results.total > 0 ? Math.round((results.score / results.total) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)] text-center">
                <h2 className="text-3xl font-bold text-brand-maroon mb-2">Assessment Complete!</h2>
                <p className="text-gray-600 mb-6">Here is a summary of your performance for {results.assessmentId}.</p>
                <div className="flex justify-center items-center my-8">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full" viewBox="0 0 36 36" transform="rotate(-90 18 18)">
                            <path className="text-brand-brown-light" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                            <path className="text-brand-maroon" strokeDasharray={`${percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"></path>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-brand-brown-dark">{percentage}%</span>
                            <span className="text-gray-500 mt-1">{results.score}/{results.total} Correct</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-brand-offwhite p-6 rounded-lg text-left my-6">
                    <h3 className="font-semibold text-brand-brown-dark mb-3">Personalised Feedback</h3>
                    {isLoadingFeedback ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                        </div>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{feedback}</p>
                    )}
                </div>

                <div className="flex justify-center space-x-4 mt-8">
                    <button onClick={() => setView('dashboard')} className="flex items-center px-6 py-2 bg-white border border-brand-brown-light text-brand-brown-dark rounded-full font-semibold text-sm hover:bg-gray-50">
                        <Home className="w-4 h-4 mr-2" /> Back to Dashboard
                    </button>
                    <button onClick={() => setReviewMode(true)} className="flex items-center px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm hover:opacity-90">
                        Review Answers <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
