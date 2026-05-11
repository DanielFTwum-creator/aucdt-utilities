import React from 'react';
import { Sun, Contrast, RotateCcw } from 'lucide-react';

interface ImageFiltersProps {
  filters: {
    grayscale: number;
    sepia: number;
    invert: number;
    brightness: number;
    contrast: number;
  };
  onFilterChange: (filters: ImageFiltersProps['filters']) => void;
}

const initialFilters = {
  grayscale: 0,
  sepia: 0,
  invert: 0,
  brightness: 100,
  contrast: 100,
};

const ImageFilters: React.FC<ImageFiltersProps> = ({ filters, onFilterChange }) => {
  const handlePresetClick = (preset: 'grayscale' | 'sepia' | 'invert') => {
    onFilterChange({
      ...filters,
      [preset]: filters[preset] > 0 ? 0 : 100,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: parseInt(value, 10),
    });
  };

  const handleReset = () => {
    onFilterChange(initialFilters);
  };

  const presets = [
    { name: 'Grayscale', key: 'grayscale' as const },
    { name: 'Sepia', key: 'sepia' as const },
    { name: 'Invert', key: 'invert' as const },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Image Filters</h4>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          aria-label="Reset all image filters"
          title="Reset all filters to their default values"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {presets.map(preset => (
          <button
            key={preset.key}
            onClick={() => handlePresetClick(preset.key)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filters[preset.key] > 0
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-pressed={filters[preset.key] > 0}
            title={`Toggle ${preset.name} filter`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <div className="space-y-2">
          <label htmlFor="brightness" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Sun size={16} className="mr-2" />
            Brightness ({filters.brightness}%)
          </label>
          <input
            id="brightness"
            name="brightness"
            type="range"
            min="50"
            max="200"
            value={filters.brightness}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Image brightness"
            title="Adjust image brightness"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contrast" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Contrast size={16} className="mr-2" />
            Contrast ({filters.contrast}%)
          </label>
          <input
            id="contrast"
            name="contrast"
            type="range"
            min="50"
            max="200"
            value={filters.contrast}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Image contrast"
            title="Adjust image contrast"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageFilters;
