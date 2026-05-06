import React from 'react';
import { ClippingMode } from '../types';

interface ClippingModeSelectorProps {
    clippingMode: ClippingMode;
    setClippingMode: (mode: ClippingMode) => void;
    outlineColor: string;
    setOutlineColor: (color: string) => void;
    outlineThickness: number;
    setOutlineThickness: (thickness: number) => void;
    image: HTMLImageElement | null;
}

const ClippingModeSelector: React.FC<ClippingModeSelectorProps> = ({
    clippingMode,
    setClippingMode,
    outlineColor,
    setOutlineColor,
    outlineThickness,
    setOutlineThickness,
    image,
}) => {
    return (
        <fieldset>
            <legend className="sr-only">Clipping Mode</legend>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1" role="radiogroup">
                <button 
                    onClick={() => setClippingMode('fill')} 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${clippingMode === 'fill' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`} 
                    title="Fill shape with image"
                    role="radio"
                    aria-checked={clippingMode === 'fill'}
                >
                    Fill
                </button>
                <button 
                    onClick={() => setClippingMode('outline')} 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${clippingMode === 'outline' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`} 
                    title="Create an outline of the shape"
                    role="radio"
                    aria-checked={clippingMode === 'outline'}
                >
                    Outline
                </button>
            </div>

            {clippingMode === 'outline' && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-4 hc-bg">
                    <div>
                        <label htmlFor="outlineColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text">Outline Color</label>
                        <div className="mt-1 flex items-center gap-3">
                            <input
                                id="outlineColor"
                                type="color"
                                value={outlineColor}
                                onChange={(e) => setOutlineColor(e.target.value)}
                                className="w-10 h-10 p-1 border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={!!image}
                                title={image ? "Outline uses the uploaded image as a texture" : "Select an outline color"}
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400 hc-text-secondary">{image ? "Using image as texture." : "Select a color."}</span>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="outlineThickness" className="block text-sm font-medium text-gray-700 dark:text-gray-300 hc-text">
                            Outline Thickness <span className="text-gray-500 dark:text-gray-400 font-normal">({outlineThickness}px)</span>
                        </label>
                        <input
                            id="outlineThickness"
                            type="range"
                            min="1"
                            max="50"
                            value={outlineThickness}
                            onChange={(e) => setOutlineThickness(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer mt-2"
                            title="Adjust outline thickness"
                            aria-valuemin={1}
                            aria-valuemax={50}
                            aria-valuenow={outlineThickness}
                        />
                    </div>
                </div>
            )}
        </fieldset>
    );
};

export default ClippingModeSelector;