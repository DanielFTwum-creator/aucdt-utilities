
import React from 'react';

const Spinner: React.FC<{ status?: string }> = ({ status }) => {
  return (
    <div role="status" className="flex flex-col justify-center items-center my-8 gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#D4AF37] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-white/5 rounded-full animate-pulse"></div>
      </div>
      {status && (
        <p className="text-xs font-black uppercase tracking-widest text-[#D4AF37] animate-pulse">
          {status}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
