
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm border-b border-slate-700 p-4 sticky top-0 z-10">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-3">
        <SparklesIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-slate-100">
          AI Code Reviewer
        </h1>
      </div>
    </header>
  );
};
