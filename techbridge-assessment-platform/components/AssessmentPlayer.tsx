import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Assessment, Question, View, Results } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './ui/Modal';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

interface AssessmentPlayerProps {
    assessment: Assessment;
    questions: Question[];
    setView: (view: View) => void;
    setResults: (results: Results) => void;
    addLogEntry: (eventType: string, eventData: object) => void;
}

const AssessmentPlayer: React.FC<AssessmentPlayerProps> = ({ assessment, questions, setView, setResults, addLogEntry }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useLocalStorage<{ [key: number]: string }>(`assessment-session-${assessment.id}`, {});
    const [timeLeft, setTimeLeft] = useLocalStorage<number>(`assessment-time-${assessment.id}`, assessment.duration * 60);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const timerRef = useRef<number | null>(null);
    
    const handleSubmit = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        let score = 0;
        questions.forEach((q, index) => {
            if (answers[index] === q.answer) {
                score++;
            }
        });
        const finalResults: Results = {
            score,
            total: questions.length,
            answers,
            questions,
            assessmentId: assessment.id,
            assessmentTitle: assessment.title
        };
        setResults(finalResults);
        addLogEntry('ASSESSMENT_SUBMIT', { assessmentId: assessment.id, score, total: questions.length });
        
        localStorage.removeItem(`assessment-session-${assessment.id}`);
        localStorage.removeItem(`assessment-time-${assessment.id}`);

        setView('results');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [answers, assessment.id, assessment.title, addLogEntry, questions, setResults, setView]);

    useEffect(() => {
        addLogEntry('ASSESSMENT_START', { assessmentId: assessment.id, title: assessment.title });
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addLogEntry, assessment.id, assessment.title, setTimeLeft]);
    
    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, handleSubmit]);

    const handleAnswer = (questionIndex: number, answer: string) => {
        const newAnswers = { ...answers, [questionIndex]: answer };
        setAnswers(newAnswers);
        addLogEntry('QUESTION_ANSWER', { assessmentId: assessment.id, questionIndex, answer });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (!questions || questions.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-brand-maroon mb-4">No Questions Available</h2>
                <p className="text-gray-600 mb-6">This assessment has not been configured with questions yet. Please check back later or contact an administrator.</p>
                <button onClick={() => setView('dashboard')} className="flex items-center mx-auto px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(139,21,56,0.15)]">
                <div className="flex justify-between items-center border-b border-brand-brown-light pb-4 mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-brand-maroon">{assessment.id} - {assessment.title}</h2>
                        <p className="text-sm text-gray-500">Question {currentQ + 1} of {questions.length}</p>
                    </div>
                    <div className="flex items-center font-semibold text-lg text-brand-maroon-dark bg-brand-gold-light px-4 py-2 rounded-full">
                        <Clock className="w-5 h-5 mr-2" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-brand-brown-dark mb-6">{questions[currentQ].question}</h3>
                    <div className="space-y-4">
                        {questions[currentQ].options.map(option => (
                            <div key={option} onClick={() => handleAnswer(currentQ, option)}
                                 className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${answers[currentQ] === option ? 'bg-brand-gold-light border-brand-gold' : 'border-brand-brown-light hover:border-brand-gold'}`}>
                                {option}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-brand-brown-light">
                    <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0}
                            className="flex items-center px-6 py-2 bg-white border border-brand-brown-light text-brand-brown-dark rounded-full font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>
                    {currentQ < questions.length - 1 ? (
                        <button onClick={() => setCurrentQ(q => Math.min(questions.length - 1, q + 1))}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm">
                            Next <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    ) : (
                        <button onClick={() => setConfirmSubmit(true)}
                                className="flex items-center px-6 py-2 bg-gradient-to-r from-brand-maroon to-brand-maroon-dark text-white rounded-full font-semibold text-sm">
                            Submit Assessment
                        </button>
                    )}
                </div>
            </div>
            <Modal isOpen={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <h3 className="text-lg font-bold text-brand-brown-dark mb-4">Confirm Submission</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to submit your answers? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <button onClick={() => setConfirmSubmit(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={() => handleSubmit()} className="px-4 py-2 bg-brand-maroon text-white rounded-lg hover:bg-brand-maroon-dark">Submit</button>
                </div>
            </Modal>
        </div>
    );
};

export default AssessmentPlayer;