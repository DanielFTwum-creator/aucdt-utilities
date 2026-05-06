
import React from 'react';
import { Spinner } from './Spinner';

interface SrsConverterProps {
    srsText: string;
    onSrsTextChange: (text: string) => void;
    onConvert: () => void;
    isConverting: boolean;
    latexOutput: string | null;
    conversionError: string | null;
}

export const SrsConverter: React.FC<SrsConverterProps> = ({
    srsText,
    onSrsTextChange,
    onConvert,
    isConverting,
    latexOutput,
    conversionError,
}) => {

    const handleDownload = () => {
        if (!latexOutput) return;
        const blob = new Blob([latexOutput], { type: 'text/x-tex;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'srs_document.tex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-4 text-[#6B1028]">SRS to LaTeX Converter</h2>
            <p className="text-center text-lg mb-8 text-gray-700">
                Paste your Software Requirements Specification text below and convert it into a professionally formatted LaTeX document adhering to TUC brand standards.
            </p>
            <div className="bg-white rounded-lg shadow-subtle p-6 md:p-8 border-l-4 border-[#D4AF37]">
                <div className="flex flex-col items-center">
                    <textarea
                        value={srsText}
                        onChange={(e) => onSrsTextChange(e.target.value)}
                        placeholder="Paste your full SRS document text here..."
                        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
                        aria-label="SRS Input Text"
                    />
                    <button
                        onClick={onConvert}
                        disabled={isConverting || !srsText}
                        className="mt-6 w-full max-w-xs px-8 py-3 bg-[#8B1538] text-white font-bold rounded-lg shadow-md hover:bg-[#6B1028] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isConverting ? 'Converting...' : 'Convert to LaTeX'}
                    </button>
                </div>
            </div>

            {isConverting && (
                <div className="mt-8 text-center">
                    <Spinner />
                    <p className="mt-4 text-lg text-[#6B1028]">Generating LaTeX document...</p>
                    <p className="text-gray-500">This might take a few moments.</p>
                </div>
            )}

            {conversionError && (
                <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-lg border border-red-300 text-center">
                    <p className="font-semibold">Conversion Failed</p>
                    <p>{conversionError}</p>
                </div>
            )}

            {latexOutput && (
                <div className="mt-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                         <h3 className="font-semibold text-xl text-[#6B1028]">Generated LaTeX Code</h3>
                         <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-[#D4AF37] text-[#2C1810] font-bold rounded-lg shadow-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B1538] transition-all duration-300"
                        >
                            Download .tex File
                        </button>
                    </div>
                    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                        <code>
                            {latexOutput}
                        </code>
                    </pre>
                </div>
            )}
        </div>
    );
};
