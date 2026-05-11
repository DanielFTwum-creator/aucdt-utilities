import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from './Icons';

interface ExportModalProps {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, isLoading, title, content, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-stone-600">Generating content...</p>
            </div>
          ) : (
            <textarea
              readOnly
              value={content}
              className="w-full h-64 p-3 bg-stone-100 border border-stone-300 rounded-md resize-none custom-scrollbar"
            />
          )}
        </div>
        {!isLoading && content && (
            <div className="p-4 border-t border-stone-200">
            <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:bg-green-400"
            >
                {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            </div>
        )}
      </div>
    </div>
  );
};