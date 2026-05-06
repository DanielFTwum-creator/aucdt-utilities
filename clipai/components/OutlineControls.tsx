import React from 'react';
import { OutlineStyle } from '../types';

interface OutlineControlsProps {
  color: string;
  thickness: number;
  outlineStyle: OutlineStyle;
  onColorChange: (color: string) => void;
  onThicknessChange: (thickness: number) => void;
  onOutlineStyleChange: (style: OutlineStyle) => void;
  hasMedia: boolean;
}

const OutlineControls: React.FC<OutlineControlsProps> = ({
  color,
  thickness,
  outlineStyle,
  onColorChange,
  onThicknessChange,
  onOutlineStyleChange,
  hasMedia,
}) => {
  return (
    <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 hc-bg">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text">
          Outline Style
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
          <button
            onClick={() => onOutlineStyleChange('solid')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              outlineStyle === 'solid' ? 'bg-white dark:bg-gray-600 shadow text-purple-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700'
            }`}
            aria-pressed={outlineStyle === 'solid'}
          >
            Solid Color
          </button>
          <button
            onClick={() => onOutlineStyleChange('texture')}
            disabled={!hasMedia}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              outlineStyle === 'texture' ? 'bg-white dark:bg-gray-600 shadow text-purple-700 dark:text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700'
            }`}
            aria-pressed={outlineStyle === 'texture'}
            title={!hasMedia ? "Upload media to use it as a texture" : "Use media as texture"}
          >
            Media Texture
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="outlineColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text">
          Outline Color
        </label>
        <div className="mt-1 flex items-center gap-3">
          <input
            id="outlineColor"
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-10 h-10 p-1 border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            disabled={outlineStyle === 'texture'}
            title={outlineStyle === 'texture' ? 'Outline style is set to Media Texture' : 'Select an outline color'}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">
            {outlineStyle === 'texture' ? 'Using media as texture.' : 'Select a solid color.'}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="outlineThickness" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text">
          Outline Thickness{' '}
          <span className="text-gray-500 dark:text-gray-400 font-normal">({thickness}px)</span>
        </label>
        <input
          id="outlineThickness"
          type="range"
          min="1"
          max="50"
          value={thickness}
          onChange={(e) => onThicknessChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mt-2"
          title="Adjust outline thickness"
          aria-valuemin={1}
          aria-valuemax={50}
          aria-valuenow={thickness}
        />
      </div>
    </div>
  );
}

export default OutlineControls;