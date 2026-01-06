
import React from 'react';
import { Construction, ArrowLeft, MoveRight } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div className="py-32 flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-tuc-dark min-h-[70vh] animate-fade-in-up">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-tuc-gold/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700">
          <Construction size={64} className="text-tuc-maroon dark:text-tuc-gold" />
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <span className="text-tuc-gold font-black uppercase tracking-[0.4em] text-[10px]">TUC Digital Transformation</span>
        <h1 className="text-4xl md:text-6xl font-black text-tuc-maroon dark:text-white uppercase tracking-tighter leading-none">
          {title || 'Bridge Under Construction'}
        </h1>
        <p className="text-lg text-tuc-slate dark:text-gray-400 font-medium leading-relaxed">
          We are currently engineering the digital experience for <strong>{title || 'this section'}</strong>. As part of our commitment to technical excellence, we're building a platform that bridges global standards with Ghanaian innovation.
        </p>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row gap-6">
        <a 
          href="#/" 
          className="inline-flex items-center gap-3 bg-tuc-maroon text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-xl hover:-translate-y-1"
        >
          <ArrowLeft size={18} /> Return to Home
        </a>
        <a 
          href="https://portal.aucdt.edu.gh/admissions/#/home"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 text-tuc-maroon dark:text-tuc-gold px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest border-2 border-tuc-maroon dark:border-tuc-gold hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-lg hover:-translate-y-1"
        >
          Admission Portal <MoveRight size={18} />
        </a>
      </div>

      <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 w-full max-w-sm">
        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.5em]">
          Design and Build a Nation!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
