import React from 'react';
import { LEARNING_LEVELS } from '../constants';
import { LearningLevel } from '../types';
import { SendIcon, MicrophoneIcon } from './Icons';

interface InputFooterProps {
  currentQuestion: string;
  setCurrentQuestion: (value: string) => void;
  learningLevel: LearningLevel;
  setLearningLevel: (value: LearningLevel) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  isListening: boolean;
  onVoiceInput: () => void;
}

export const InputFooter: React.FC<InputFooterProps> = ({
  currentQuestion,
  setCurrentQuestion,
  learningLevel,
  setLearningLevel,
  handleSubmit,
  isLoading,
  isListening,
  onVoiceInput,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="shrink-0 px-4 sm:px-6 lg:px-8 pt-2 pb-6">
        <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-[var(--color-border-primary)]">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="mb-4">
                        <label htmlFor="learning-level" className="block text-sm font-medium mb-2 text-[var(--color-text-secondary)]">
                            Select Your Learning Level
                        </label>
                        <select
                            id="learning-level"
                            value={learningLevel}
                            onChange={(e) => setLearningLevel(e.target.value as LearningLevel)}
                            disabled={isLoading}
                            className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200 cursor-pointer hover:border-[var(--color-border-focus)] disabled:opacity-50"
                        >
                            {LEARNING_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={currentQuestion}
                            onChange={(e) => setCurrentQuestion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? "Listening..." : "Ask a biochemistry question..."}
                            maxLength={2000}
                            disabled={isLoading}
                            className="w-full bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] rounded-xl px-4 py-4 pr-28 text-base focus:ring-2 focus:ring-[var(--color-border-focus)] focus:border-transparent transition-all duration-200 hover:border-[var(--color-border-focus)] disabled:opacity-50"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button
                                type="button"
                                onClick={onVoiceInput}
                                disabled={isLoading}
                                className="text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] p-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={isListening ? "Stop listening" : "Use microphone"}
                            >
                                <MicrophoneIcon className={`w-5 h-5 transition-colors ${isListening ? 'text-[var(--color-error)] animate-pulse' : ''}`} />
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !currentQuestion.trim()}
                                className="bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary-hover)] text-[var(--color-text-on-accent)] p-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:bg-[var(--color-text-tertiary)] disabled:hover:scale-100 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-[var(--color-text-secondary)] text-center">
                        💡 Conversations are automatically saved in your browser
                    </p>
                </form>
            </div>
        </div>
    </div>
  );
};