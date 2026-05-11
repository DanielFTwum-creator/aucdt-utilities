
import React from 'react';
import { MailIcon, DocumentTextIcon } from './icons';

export type ExtractionMode = 'emails' | 'invoice';

interface ExtractionModeSelectorProps {
    mode: ExtractionMode;
    onModeChange: (mode: ExtractionMode) => void;
}

const ExtractionModeSelector: React.FC<ExtractionModeSelectorProps> = ({ mode, onModeChange }) => {
    const baseClasses = "flex-1 text-center py-3 px-4 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-4";
    const activeClasses = "bg-blue-600 text-white shadow-lg scale-105";
    const inactiveClasses = "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50";
    const ringClasses = "focus:ring-blue-500 focus:ring-opacity-50";

    return (
        <div className="mb-8 p-1.5 bg-gray-900/80 rounded-xl flex w-full max-w-lg mx-auto shadow-inner border border-gray-700">
            <button
                onClick={() => onModeChange('emails')}
                className={`${baseClasses} ${mode === 'emails' ? activeClasses : inactiveClasses} ${ringClasses}`}
                aria-pressed={mode === 'emails'}
            >
                <MailIcon />
                Extract Emails
            </button>
            <button
                onClick={() => onModeChange('invoice')}
                className={`${baseClasses} ${mode === 'invoice' ? activeClasses : inactiveClasses} ${ringClasses}`}
                aria-pressed={mode === 'invoice'}
            >
                <DocumentTextIcon />
                Extract Invoice Data
            </button>
        </div>
    );
};

export default ExtractionModeSelector;
    