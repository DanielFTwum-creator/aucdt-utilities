import React from 'react';
import { DesignElement } from '../types';

interface RadioGroupProps {
  label: string;
  name: string;
  options: DesignElement[];
  selectedValue: DesignElement | null;
  onChange: (value: DesignElement) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ label, name, options, selectedValue, onChange }) => {
  return (
    <div className="mb-6 bg-[#2D2D2D] p-6 rounded-xl shadow-deep border border-gray-700">
      <h3 className="text-xl font-playfair-display uppercase letter-spacing-wide mb-4 text-[#D4A017]">{label}</h3>
      <div className="space-y-4">
        {options.map((option) => (
          <label 
            key={option.id} 
            className={`flex flex-col p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform
              bg-[#1A1A1A] border border-gray-800 shadow-md hover:scale-102 hover:shadow-lg
              ${selectedValue?.id === option.id ? 'border-[#D4A017] ring-2 ring-[#D4A017] ring-opacity-70 shadow-gold-glow-sm' : ''}`
            }
            aria-checked={selectedValue?.id === option.id}
            role="radio"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(option); }}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selectedValue?.id === option.id}
              onChange={() => onChange(option)}
              className="sr-only" // Visually hide the radio input
              aria-label={option.name}
            />
            <span className="text-lg font-cormorant-garamond font-semibold text-[#FAF5EB] group-hover:text-[#D4A017] transition-colors duration-200">
              {option.name}
            </span>
            <span className="text-sm font-inter text-gray-400 mt-1">
              {option.description}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;