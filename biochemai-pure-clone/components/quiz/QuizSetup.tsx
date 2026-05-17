import React from 'react';
import { LearningLevel } from '../../types';
import { LEARNING_LEVELS } from '../../constants';
import { TrophyIcon } from '../Icons';

interface QuizSetupProps {
    topic: string;
    setTopic: (topic: string) => void;
    learningLevel: LearningLevel;
    setLearningLevel: (level: LearningLevel) => void;
    numQuestions: number;
    setNumQuestions: (count: number) => void;
    onStart: () => void;
}

export const QuizSetup: React.FC<QuizSetupProps> = ({ topic, setTopic, learningLevel, setLearningLevel, numQuestions, setNumQuestions, onStart }) => {
    const isStartDisabled = !topic.trim();

    return (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <div className="text-center mb-6">
                <TrophyIcon className="w-16 h-16 mx-auto text-[var(--color-accent-primary)] mb-3" />
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Biochemistry Quiz Mode</h1>
                <p className="text-[var(--color-text-secondary)] mt-2">Test your knowledge! Enter a topic and select your level to begin.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        Quiz Topic
                    </label>
                    <input
                        type="text"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., Cellular Respiration, DNA Replication"
                        className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200"
                    />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="learning-level-quiz" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Learning Level
                        </label>
                        <select
                            id="learning-level-quiz"
                            value={learningLevel}
                            onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
                            className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200"
                        >
                            {LEARNING_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="num-questions" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            id="num-questions"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(parseInt(e.target.value, 10) || 1)}
                            min="1"
                            max="20"
                            className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>
                
                <button
                    onClick={onStart}
                    disabled={isStartDisabled}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-[var(--color-text-on-accent)] bg-[var(--color-accent-primary)] rounded-lg hover:bg-[var(--color-accent-primary-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent-primary)] focus:ring-offset-[var(--color-bg-primary)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};