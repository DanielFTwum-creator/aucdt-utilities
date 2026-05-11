import React from 'react';
import { KenteColor } from '../types';

interface ColorSymbolismDisplayProps {
  colors: KenteColor[];
}

const ColorSymbolismDisplay: React.FC<ColorSymbolismDisplayProps> = ({ colors }) => {
  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#2D2D2D] p-8 rounded-2xl shadow-lg mt-12 border border-gray-700 animate-[fade-in_1.2s_ease-out]">
      <h3 className="text-2xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-6">Selected Kente Colors & Symbolism</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {colors.map((color) => (
          <div key={color.hex} className="flex flex-col items-center bg-[#1A1A1A] p-6 rounded-xl shadow-md border border-gray-800 transition-all duration-300 hover:scale-105">
            <div
              className="w-20 h-20 rounded-full border-4 border-[#D4A017] border-opacity-50 shadow-gold-glow-sm mb-4 transition-all duration-300 hover:scale-110"
              style={{ backgroundColor: color.hex }}
            ></div>
            <p className="text-xl font-playfair-display font-semibold text-[#FAF5EB] mb-2">{color.name}</p>
            <p className="text-sm font-cormorant-garamond text-gray-400 text-center italic">{color.symbolism}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorSymbolismDisplay;