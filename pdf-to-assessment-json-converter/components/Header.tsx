
import React from 'react';
import { BrainCircuitIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center bg-sky-500/10 text-sky-400 p-3 rounded-full mb-4 ring-1 ring-sky-500/20">
        <BrainCircuitIcon className="h-8 w-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
        PDF to Assessment JSON Converter
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
        Leverage the power of Gemini to instantly transform academic program PDFs into structured, machine-readable JSON data.
      </p>
    </header>
  );
};

export default Header;
