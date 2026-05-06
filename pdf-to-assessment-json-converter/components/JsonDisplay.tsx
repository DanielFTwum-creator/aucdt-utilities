
import React, { useState } from 'react';
import { ProgramData } from '../types';
import { ClipboardIcon, CheckIcon, ArrowDownTrayIcon } from './IconComponents';

interface JsonDisplayProps {
  data: ProgramData[];
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assessment-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={handleCopy}
          className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Copy JSON to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-5 w-5 text-emerald-400" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
        <button
          onClick={handleDownload}
          className="p-2 bg-slate-700/80 hover:bg-slate-600 rounded-md text-slate-300 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Download JSON file"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
      <pre className="h-full w-full text-sm text-slate-300 whitespace-pre-wrap overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
};

export default JsonDisplay;
