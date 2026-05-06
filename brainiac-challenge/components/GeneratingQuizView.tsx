

import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Engaging Gemini AI...",
    "Consulting with expert examiners...",
    "Crafting challenging questions...",
    "Designing visual diagrams...",
    "Aligning with curriculum standards...",
    "Finalizing the challenge...",
];

export const GeneratingQuizView = ({ imageGenerationStatus }: { imageGenerationStatus: string | null }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        const timerInterval = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(timerInterval);
        };
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };
    
    return (
        <div data-testid="generating-quiz-view" className="flex flex-col items-center justify-center text-center h-[70vh]">
            <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 border-4 border-[#006400] rounded-full animate-slow-spin"></div>
                <div className="absolute inset-2 border-4 border-[#B8860B] rounded-full animate-slow-spin [animation-direction:reverse]"></div>
                <div className="absolute inset-0 bg-[#0d1f1a] rounded-full flex items-center justify-center animate-pulse-glow">
                    <svg className="w-24 h-24 text-[#B8860B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-3xl font-bold text-[#B8860B] mb-4">Generating Your Challenge</h2>
            <p className="text-lg text-gray-300 transition-opacity duration-500 w-full h-8">
                {imageGenerationStatus || loadingMessages[messageIndex]}
            </p>
            <p className="text-lg font-mono text-[#B8860B] mt-4" data-testid="generation-timer">
                {formatTime(elapsed)}
            </p>
        </div>
    );
};