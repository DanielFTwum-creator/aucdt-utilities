import React, { useState } from 'react';
import { UploadIcon } from '../constants';
import { InputType } from '../types';

interface ImageUploadSectionProps {
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlLoad: (url: string) => void;
  onSvgLoad: (svg: string) => void;
  isProcessing: boolean;
  hasImage: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  onImageUpload,
  onUrlLoad,
  onSvgLoad,
  isProcessing,
  hasImage,
  fileInputRef,
}) => {
  const [inputType, setInputType] = useState<InputType>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [svgCode, setSvgCode] = useState('');

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white hc-text">
        Step 1: Choose an Image (Optional for Outline)
      </h2>
      
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
        {(['upload', 'url', 'svg'] as InputType[]).map((type) => (
          <button
            key={type}
            onClick={() => setInputType(type)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              inputType === type
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={`Switch to ${type.charAt(0).toUpperCase() + type.slice(1)} Input`}
            aria-pressed={inputType === type}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {inputType === 'upload' && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors duration-200"
            title="Click to select an image file from your device"
            disabled={isProcessing}
          >
            <UploadIcon className="h-5 w-5" />
            <span>{hasImage ? 'Choose another image' : 'Choose an image'}</span>
             <input
                ref={fileInputRef} type="file" accept="image/*" onChange={onImageUpload}
                className="hidden" aria-hidden="true"
            />
          </button>
        )}

        {inputType === 'url' && (
          <div className="flex gap-2">
            <input
              type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="hc-bg hc-border hc-text hc-placeholder flex-grow block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              title="Enter the URL of an image"
              disabled={isProcessing}
            />
            <button
              onClick={() => onUrlLoad(imageUrl)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-gray-600 transition-colors"
              disabled={isProcessing || !imageUrl.trim()}
              title="Load image from URL"
            >
              Load
            </button>
          </div>
        )}

        {inputType === 'svg' && (
          <div className="flex flex-col gap-2">
            <textarea
              value={svgCode} onChange={(e) => setSvgCode(e.target.value)}
              placeholder='<svg width="100" height="100">...</svg>'
              className="hc-bg hc-border hc-text hc-placeholder block w-full h-24 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm resize-none"
              title="Paste your SVG code here to use it as an image"
              disabled={isProcessing}
            />
            <button
              onClick={() => onSvgLoad(svgCode)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-gray-600 transition-colors"
              disabled={isProcessing || !svgCode.trim()}
              title="Load image from SVG code"
            >
              Load
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ImageUploadSection;