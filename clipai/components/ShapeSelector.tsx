import React from 'react';
import { ShapeId, ClippingMode } from '../types';
import { ShapeConfig } from '../types';

interface ShapeSelectorProps {
  shapes: ShapeConfig[];
  shapeIcons: Record<ShapeId, React.FC<{ selected: boolean }>>;
  currentShape: ShapeId | 'custom';
  onShapeSelect: (shape: ShapeId) => void;
  clippingMode: ClippingMode;
  onClippingModeChange: (mode: ClippingMode) => void;
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  shapes,
  shapeIcons,
  currentShape,
  onShapeSelect,
  clippingMode,
  onClippingModeChange,
}) => {
  return (
    <div role="region" aria-labelledby="step2-heading">
      <h2 id="step2-heading" className="text-lg font-semibold text-gray-900 dark:text-white hc-text">
        Step 2: Choose a Shape & Style
      </h2>
      
      <div className="mt-4 grid grid-cols-4 gap-2">
        {shapes.map(({ id, name }) => {
          const Icon = shapeIcons[id];
          return (
            <button
              key={id}
              onClick={() => onShapeSelect(id)}
              className={`group flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
                currentShape === id ? 'bg-purple-100 dark:bg-purple-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={`Select ${name} shape`}
              aria-pressed={currentShape === id}
            >
              <Icon selected={currentShape === id} />
              <span
                className={`mt-1 text-xs font-medium ${
                  currentShape === id ? 'text-purple-800 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1" role="radiogroup">
        <button
          onClick={() => onClippingModeChange('fill')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            clippingMode === 'fill'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Fill shape with image"
          role="radio"
          aria-checked={clippingMode === 'fill'}
        >
          Fill
        </button>
        <button
          onClick={() => onClippingModeChange('outline')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            clippingMode === 'outline'
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          title="Create an outline of the shape"
          role="radio"
          aria-checked={clippingMode === 'outline'}
        >
          Outline
        </button>
      </div>
    </div>
  );
}

export default ShapeSelector;