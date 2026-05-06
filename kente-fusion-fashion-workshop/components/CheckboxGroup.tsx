import React from 'react';
import { DesignElement, KenteColor } from '../types';

interface CheckboxGroupProps {
  label: string;
  name: string;
  options: (DesignElement | KenteColor)[];
  selectedValues: (DesignElement | KenteColor)[];
  onChange: (value: DesignElement | KenteColor) => void;
  renderColorSwatch?: boolean;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  options,
  selectedValues,
  onChange,
  renderColorSwatch = false,
}) => {
  const isSelected = (option: DesignElement | KenteColor) =>
    selectedValues.some((selected) => selected.id === option.id);

  return (
    <div className="mb-6 bg-[#2D2D2D] p-6 rounded-xl shadow-deep border border-gray-700">
      <h3 className="text-xl font-playfair-display uppercase letter-spacing-wide mb-4 text-[#D4A017]">{label}</h3>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option) => {
          const isColor = 'hex' in option;
          const kenteColor = option as KenteColor;
          const designElem = option as DesignElement;

          return (
            <label
              key={option.id}
              className={`group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform
                bg-[#1A1A1A] border border-gray-800 shadow-md hover:scale-[1.02] hover:shadow-lg
                ${isSelected(option) ? 'border-[#D4A017] ring-1 ring-[#D4A017] ring-opacity-70 shadow-gold-glow-sm bg-[#252525]' : ''}`
              }
              aria-checked={isSelected(option)}
              role="checkbox"
              tabIndex={0}
              title={isColor ? `Symbolism: ${kenteColor.symbolism}` : undefined}
              onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onChange(option); }}
            >
              <input
                type="checkbox"
                name={name}
                value={option.id}
                checked={isSelected(option)}
                onChange={() => onChange(option)}
                className="sr-only"
                aria-label={option.name}
              />
              
              {renderColorSwatch && isColor && (
                <div
                  className="w-10 h-10 rounded-full border-2 border-gray-600 shadow-inner mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: kenteColor.hex }}
                >
                  <div className="w-full h-full rounded-full opacity-0 hover:opacity-100 bg-black bg-opacity-10 transition-opacity duration-200"></div>
                </div>
              )}

              {!renderColorSwatch && label === 'Accessorizing for Impact' && (
                <span className="mr-3 text-2xl w-8 text-center" role="img" aria-label={option.name}>
                  {option.name === 'Minimalist Heels' && '👠'}
                  {option.name === 'Statement Gold Jewelry' && '✨'}
                  {option.name === 'Coordinated Headwrap' && '👳'}
                  {option.name === 'Chic Clutch' && '👜'}
                  {option.name === 'Geometric Earrings' && '💎'}
                </span>
              )}

              <div className="flex flex-col">
                <span className={`text-lg font-cormorant-garamond font-semibold text-[#FAF5EB] transition-colors duration-200 ${isSelected(option) ? 'text-[#D4A017]' : 'group-hover:text-[#EACD8F]'}`}>
                  {option.name}
                </span>
                <span className="text-xs font-inter text-gray-500 line-clamp-1 group-hover:text-gray-400">
                  {isColor ? kenteColor.symbolism : designElem.description}
                </span>
              </div>

              {isSelected(option) && (
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-[#D4A017]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckboxGroup;