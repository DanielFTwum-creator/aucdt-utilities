import React, { useState } from 'react';
import { QuizSettings, AcademicLevel, Difficulty, View } from '../types';
import { ACADEMIC_LEVELS, DIFFICULTY_LEVELS, TOPICS, TIME_LIMITS } from '../constants';
import Spinner from './Spinner';

interface QuizSetupProps {
    onGenerate: (settings: QuizSettings) => void;
    isGenerating: boolean;
    setView: (view: View) => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onGenerate, isGenerating, setView }) => {
    const [topic, setTopic] = useState<string>(TOPICS[0]);
    const [customTopic, setCustomTopic] = useState<string>('');
    const [level, setLevel] = useState<AcademicLevel>(AcademicLevel.HIGH);
    const [numQuestions, setNumQuestions] = useState<number>(5);
    const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);
    const [timeLimit, setTimeLimit] = useState<string>(TIME_LIMITS[1]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalTopic = topic === 'Custom' ? customTopic : topic;
        if (!finalTopic) {
            alert('Please select or enter a topic.');
            return;
        }
        onGenerate({
            topic: finalTopic,
            level,
            numQuestions,
            difficulty,
            timeLimit,
        });
    };

    const baseInputClasses = "mt-1 block w-full bg-transparent border border-yellow-800/50 rounded-lg py-2 px-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm";

    const renderSelect = <T extends string,>(id: string, label: string, value: T, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: T[]) => (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className={`${baseInputClasses} pr-10`}
            >
                {options.map(opt => <option key={opt} value={opt} className="bg-[#1a2e28] text-gray-200">{opt}</option>)}
            </select>
        </div>
    );

    return (
        <div className="max-w-2xl w-full mx-auto bg-[#1a2e28] rounded-xl shadow-2xl overflow-hidden">
            <img 
                src="https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Workspace desk setup"
                className="w-full h-48 object-cover"
            />
            <div className="p-8">
                <h2 className="text-3xl font-bold text-center text-yellow-400 mb-2">Brainiac Challenge</h2>
                <p className="text-center text-gray-300 mb-8">Create your own AI-powered quiz, with a focus on West Africa.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderSelect('level', 'Academic Level', level, (e) => setLevel(e.target.value as AcademicLevel), ACADEMIC_LEVELS)}
                    
                    {renderSelect('topic', 'Topic', topic, (e) => setTopic(e.target.value), TOPICS)}

                    {topic === 'Custom' && (
                        <div>
                            <label htmlFor="custom-topic" className="block text-sm font-medium text-gray-300">Custom Topic</label>
                            <input
                                type="text"
                                id="custom-topic"
                                value={customTopic}
                                onChange={(e) => setCustomTopic(e.target.value)}
                                className={baseInputClasses}
                                placeholder="e.g., The French Revolution"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="num-questions" className="block text-sm font-medium text-gray-300">Number of Questions</label>
                        <input
                            type="number"
                            id="num-questions"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Math.max(1, Math.min(20, parseInt(e.target.value, 10) || 1)))}
                            min="1"
                            max="20"
                            className={baseInputClasses}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderSelect('difficulty', 'Difficulty', difficulty, (e) => setDifficulty(e.target.value as Difficulty), DIFFICULTY_LEVELS)}
                        {renderSelect('time-limit', 'Time Limit', timeLimit, (e) => setTimeLimit(e.target.value), TIME_LIMITS)}
                    </div>

                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a2e28] focus:ring-green-500 disabled:bg-green-800 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGenerating ? (
                                <>
                                    <Spinner />
                                    <span className="ml-2">Generating Challenge...</span>
                                </>
                            ) : 'Start Challenge'}
                        </button>
                         <button
                            type="button"
                            onClick={() => setView(View.AUDIT_LOG)}
                            className="w-full flex justify-center items-center py-3 px-4 border border-yellow-600 rounded-lg shadow-sm text-sm font-bold text-yellow-500 hover:bg-yellow-600 hover:text-[#142520] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a2e28] focus:ring-yellow-500 transition-colors"
                        >
                            View Audit Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizSetup;