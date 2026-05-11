import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-64 w-full">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-lux-gray rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-lux-gold rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lux-gold font-serif text-xl tracking-widest">RENDERING</h3>
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Gemini Pro Vision Engine Active</p>
        <p className="text-xs text-gray-600 mt-1">Processing light, texture, and composition...</p>
      </div>
    </div>
  );
};