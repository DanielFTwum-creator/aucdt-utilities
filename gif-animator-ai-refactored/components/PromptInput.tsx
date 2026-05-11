import React from 'react';
import Spinner from './Spinner';

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

interface PromptInputProps {
    prompt: string;
    isLoading: boolean;
    onPromptChange: (prompt: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
    prompt,
    isLoading,
    onPromptChange,
    onSubmit
}) => {
    return (
        <form onSubmit={onSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder="e.g., a happy robot waving"
                    className="flex-grow bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    aria-label="Animation prompt"
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="h-5 w-5 mr-2" />
                            Animate
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default PromptInput;

