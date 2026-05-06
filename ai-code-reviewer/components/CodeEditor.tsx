import React from 'react';
import { PROGRAMMING_LANGUAGES } from '../constants';
import { CodeIcon } from './icons/CodeIcon';
import { BeakerIcon } from './icons/BeakerIcon';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  onReview: () => void;
  isLoading: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  language,
  setLanguage,
  onReview,
  isLoading,
}) => {
  return (
    <div className="flex flex-col bg-slate-800 rounded-lg border border-slate-700 shadow-lg max-h-[calc(100vh-120px)] md:max-h-full">
      <div className="flex items-center justify-between p-3 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
            <CodeIcon className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-200">Your Code</h2>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-md px-3 py-1 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          aria-label="Select programming language"
        >
          {PROGRAMMING_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow p-1 overflow-hidden">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={`// Paste your ${language} code here...`}
          className="w-full h-full bg-transparent text-slate-200 p-3 font-mono text-sm resize-none focus:outline-none"
          spellCheck="false"
        />
      </div>
      <div className="p-3 border-t border-slate-700 flex-shrink-0">
        <button
          onClick={onReview}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
            <BeakerIcon className="w-5 h-5" />
            Review Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};
