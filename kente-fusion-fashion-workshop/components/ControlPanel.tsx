import React from 'react';
import { DesignState, DesignElement, KenteColor } from '../types';
import { DESIGN_CATEGORIES, KENTE_COLORS, ACCESSORIES } from '../constants';
import RadioGroup from './RadioGroup';
import CheckboxGroup from './CheckboxGroup';

interface ControlPanelProps {
  designState: DesignState;
  onUpdate: (category: keyof DesignState, value: DesignElement | KenteColor | DesignElement[] | KenteColor[] | null) => void;
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  hasSavedDesign: boolean;
  isLoading: boolean;
}

type MultiSelectCategory = 'kenteColors' | 'accessories';

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  designState, 
  onUpdate, 
  onReset, 
  onSave, 
  onLoad, 
  hasSavedDesign, 
  isLoading 
}) => {

  const handleSingleSelectChange = (category: keyof DesignState, value: DesignElement) => {
    onUpdate(category, value);
  };

  const handleMultiSelectChange = (category: MultiSelectCategory, option: DesignElement | KenteColor) => {
    if (category === 'kenteColors') {
      const currentColors = designState.kenteColors;
      const isSelected = currentColors.some((item) => item.id === option.id);

      let newColors: KenteColor[];
      if (isSelected) {
        newColors = currentColors.filter((item) => item.id !== option.id);
      } else {
        newColors = [...currentColors, option as KenteColor];
      }
      onUpdate('kenteColors', newColors);
    } else if (category === 'accessories') {
      const currentAccessories = designState.accessories;
      const isSelected = currentAccessories.some((item) => item.id === option.id);

      let newAccessories: DesignElement[];
      if (isSelected) {
        newAccessories = currentAccessories.filter((item) => item.id !== option.id);
      } else {
        newAccessories = [...currentAccessories, option as DesignElement];
      }
      onUpdate('accessories', newAccessories);
    }
  };

  const getSelectedItems = () => {
    const items: (DesignElement | KenteColor)[] = [];
    if (designState.silhouette) items.push(designState.silhouette);
    if (designState.kentePlacement) items.push(designState.kentePlacement);
    if (designState.materialFusion) items.push(designState.materialFusion);
    if (designState.versatility) items.push(designState.versatility);
    items.push(...designState.kenteColors);
    items.push(...designState.accessories);
    return items;
  };

  const selectedItems = getSelectedItems();

  return (
    <aside className="w-full md:w-2/5 lg:w-1/4 bg-[#2D2D2D] p-8 shadow-2xl overflow-y-auto border-r border-gray-800 md:rounded-tr-3xl md:rounded-br-3xl flex flex-col h-full">
      <div className="flex-grow">
        <h2 className="text-3xl font-playfair-display uppercase letter-spacing-wide text-[#D4A017] mb-8 text-center">Design Controls</h2>
        <p className="font-cormorant-garamond text-[#FAF5EB] mb-8 text-center text-md italic">
          Select elements to craft your unique Kente fusion masterpiece.
        </p>

        <div className="space-y-8 pb-10">
          {DESIGN_CATEGORIES.map((category) => {
            if (category.type === 'single') {
              const currentSelected = designState[category.id as keyof DesignState] as DesignElement | null;
              return (
                <RadioGroup
                  key={category.id}
                  label={category.name}
                  name={category.id}
                  options={category.options as DesignElement[]}
                  selectedValue={currentSelected}
                  onChange={(value) => handleSingleSelectChange(category.id as keyof DesignState, value)}
                />
              );
            } else if (category.id === 'kenteColors') {
              const currentSelectedColors = designState.kenteColors;
              return (
                <CheckboxGroup
                  key={category.id}
                  label={category.name}
                  name={category.id}
                  options={KENTE_COLORS}
                  selectedValues={currentSelectedColors}
                  onChange={(value) => handleMultiSelectChange(category.id as MultiSelectCategory, value as KenteColor)}
                  renderColorSwatch={true}
                />
              );
            } else if (category.type === 'multiple') {
              const currentSelected = designState[category.id as keyof DesignState] as DesignElement[];
              return (
                <CheckboxGroup
                  key={category.id}
                  label={category.name}
                  name={category.id}
                  options={category.options as DesignElement[]}
                  selectedValues={currentSelected}
                  onChange={(value) => handleMultiSelectChange(category.id as MultiSelectCategory, value as DesignElement)}
                />
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-[#2D2D2D] p-6 mt-auto border-t border-gray-700 shadow-inner-xl z-20">
        {selectedItems.length > 0 && (
          <div className="mb-4 text-sm font-inter text-gray-400">
            <h4 className="font-playfair-display uppercase text-[#D4A017] text-sm mb-2">Selected Elements:</h4>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {selectedItems.map((item) => (
                <span
                  key={item.id}
                  className="bg-[#D4A017] bg-opacity-20 text-[#D4A017] font-cormorant-garamond text-sm px-3 py-1 rounded-full border border-[#D4A017] transition-all duration-300"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            onClick={onSave}
            className="bg-[#1A1A1A] text-[#D4A017] border border-[#D4A017] font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:bg-[#D4A017] hover:text-[#1A1A1A] text-sm"
          >
            Save Design
          </button>
          <button
            onClick={onLoad}
            disabled={!hasSavedDesign}
            className={`font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm border
              ${hasSavedDesign 
                ? 'bg-[#1A1A1A] text-[#FAF5EB] border-gray-600 hover:border-[#D4A017] hover:text-[#D4A017]' 
                : 'bg-gray-800 text-gray-600 border-transparent cursor-not-allowed'}`}
          >
            Load Saved
          </button>
        </div>

        <button
          onClick={onReset}
          disabled={isLoading}
          className={`w-full bg-[#D4A017] text-[#1A1A1A] font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform shadow-lg
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EACD8F] hover:scale-105'}`}
        >
          Reset All
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;