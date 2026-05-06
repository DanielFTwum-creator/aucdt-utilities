import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface OutputCardProps {
  title: string;
  content: string;
  isJson?: boolean;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, content, isJson = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">{title}</h3>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            copied
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
          }`}
        >
          {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-0 flex-grow relative bg-white">
        {isJson ? (
          <pre className="p-6 text-sm text-emerald-600 font-mono overflow-auto max-h-[400px] bg-slate-900 leading-relaxed selection:bg-emerald-900 selection:text-emerald-200">
            {content}
          </pre>
        ) : (
          <div className="p-6 text-slate-700 font-mono text-base leading-relaxed whitespace-pre-wrap min-h-[120px] bg-white selection:bg-indigo-100">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputCard;
