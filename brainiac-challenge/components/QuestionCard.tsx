import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

declare const DOMPurify: any;

interface QuestionCardProps {
    question: Question;
    onAnswer: (isCorrect: boolean) => void;
    onNext: () => void;
    isPreview?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, onNext, isPreview = false }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [localIsAnswered, setLocalIsAnswered] = useState(false);
    const isAnswered = isPreview || localIsAnswered;

    const katexRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (question.katexContent && katexRef.current && (window as any).katex) {
            (window as any).katex.render(question.katexContent, katexRef.current, {
                throwOnError: false,
                displayMode: true
            });
        }
    }, [question.katexContent]);

    useEffect(() => {
        if (question.chartData && chartRef.current && (window as any).Chart) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new (window as any).Chart(ctx, {
                    type: question.chartData.type,
                    data: question.chartData.data,
                    options: question.chartData.options,
                });
            }
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [question.chartData]);

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setLocalIsAnswered(true);
        onAnswer(question.options[index].isCorrect);
    };

    const getButtonClass = (index: number) => {
        const baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 disabled:opacity-80";
        if (!isAnswered) {
            return `${baseClass} border-emerald-700 bg-emerald-800/50 hover:bg-emerald-700/50 hover:border-yellow-500`;
        }
        if (question.options[index].isCorrect) {
            return `${baseClass} border-green-500 bg-green-900/50 text-white font-semibold`;
        }
        if (index === selectedOption) {
            return `${baseClass} border-red-500 bg-red-900/50 text-white font-semibold`;
        }
        return `${baseClass} border-emerald-800 bg-emerald-900/50`;
    };

    return (
        <div className="bg-[#1a2e28] p-6 md:p-8 rounded-lg shadow-xl">
            <p className="text-xl md:text-2xl font-medium text-gray-200 mb-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(question.questionText) }}></p>
            
            {question.katexContent && <div ref={katexRef} className="my-6 text-xl text-center text-white bg-[#142520] p-4 rounded-md"></div>}

            {question.chartData && <div className="my-6 p-4 bg-white rounded-md"><canvas ref={chartRef}></canvas></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(index)}
                        disabled={isAnswered}
                        className={getButtonClass(index)}
                    >
                        {option.text}
                    </button>
                ))}
            </div>

            {isAnswered && (
                <div className="mt-6 p-4 bg-[#142520] rounded-lg animate-fade-in">
                    <h3 className="font-bold text-lg text-yellow-400 mb-2">Explanation</h3>
                    <p className="text-gray-300">{question.explanation}</p>
                    {!isPreview && (
                        <button
                            onClick={onNext}
                            className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#142520] focus:ring-green-500"
                        >
                            Next Question
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default QuestionCard;