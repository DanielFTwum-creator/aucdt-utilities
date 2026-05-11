
import React from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CopyIcon, DownloadIcon, CheckIcon } from './icons';
import { ExtractionMode } from './ExtractionModeSelector';

interface ResultsDisplayProps {
    mode: ExtractionMode;
    emails: string[];
    csvData: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ mode, emails, csvData }) => {
    const [copyAllToClipboard, hasCopiedAll] = useCopyToClipboard();
    const [downloadClicked, setDownloadClicked] = React.useState(false);

    const isEmailMode = mode === 'emails';
    const data = isEmailMode ? emails.join('\n') : csvData;
    const count = isEmailMode ? emails.length : (csvData.split('\n').filter(Boolean).length);

    const handleDownload = () => {
        if (!data) return;
        
        const blob = new Blob([data], { type: isEmailMode ? 'text/plain;charset=utf-8' : 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = isEmailMode ? 'extracted_emails.txt' : 'extracted_invoice_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setDownloadClicked(true);
        setTimeout(() => setDownloadClicked(false), 2000);
    };
    
    const handleCopyAll = () => {
        if (!data) return;
        copyAllToClipboard(data);
    };

    const title = isEmailMode ? 'Email Extraction Complete' : 'Invoice Data Extracted';
    const countText = isEmailMode
        ? `Found ${count} unique email address${count !== 1 ? 'es' : ''}.`
        : `Successfully extracted ${count} rows of data.`;

    return (
        <div className="mt-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-teal-300">{title}</h2>
            <div className="text-center mt-2 text-gray-400">
                {countText}
            </div>

            <div className="mt-6 bg-gray-900/70 p-4 rounded-lg max-h-80 overflow-y-auto border border-gray-700 shadow-inner">
                {isEmailMode ? (
                    emails.map((email, index) => <EmailItem key={index} email={email} />)
                ) : (
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{csvData}</pre>
                )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button
                    onClick={handleCopyAll}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50"
                >
                    {hasCopiedAll ? <CheckIcon /> : <CopyIcon />}
                    {hasCopiedAll ? 'Copied!' : 'Copy All'}
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-semibold text-white bg-teal-600 rounded-lg shadow-md hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-opacity-50"
                >
                    {downloadClicked ? <CheckIcon /> : <DownloadIcon />}
                    {downloadClicked ? 'Downloaded!' : `Download as ${isEmailMode ? 'TXT' : 'CSV'}`}
                </button>
            </div>
        </div>
    );
};

const EmailItem: React.FC<{ email: string }> = ({ email }) => {
    const [copy, copied] = useCopyToClipboard();

    return (
        <div
            onClick={() => copy(email)}
            className="flex justify-between items-center p-3 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 group"
        >
            <span className="font-mono text-blue-300">{email}</span>
            <span className="text-sm font-semibold transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {copied ? <CheckIcon className="text-green-400" /> : <CopyIcon className="text-gray-400" />}
            </span>
        </div>
    );
};

export default ResultsDisplay;
    