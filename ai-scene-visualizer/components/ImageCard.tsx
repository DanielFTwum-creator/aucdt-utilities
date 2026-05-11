import React, { useState } from 'react';

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  filter?: string;
  onApplyFilter: (filter: string) => void;
}

const FILTERS = ['Original', 'Grayscale', 'Sepia', 'Invert'] as const;

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, prompt, filter, onApplyFilter }) => {
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const filterClasses: Record<string, string> = {
    'Grayscale': 'grayscale',
    'Sepia': 'sepia',
    'Invert': 'invert'
  };
  
  const currentFilterClass = filter ? filterClasses[filter] : '';
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `scene-${Date.now()}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-amber-400/10 hover:-translate-y-1">
      <div className="relative aspect-square">
        {!isLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse"></div>
        )}
        <img
          src={imageUrl}
          alt={prompt.substring(0, 50)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${currentFilterClass}`}
          onLoad={() => setIsLoaded(true)}
        />
        <button 
            onClick={handleDownload}
            title="Download Image"
            aria-label="Download Image"
            className="absolute top-3 right-3 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl opacity-75 hover:opacity-100 transition-opacity">
            ↓
        </button>
      </div>
      <div className="p-4">
        <div className="mb-3" role="group" aria-label="Image Filters">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => onApplyFilter(f)}
              aria-pressed={(filter || 'Original') === f}
              className={`px-3 py-1 text-xs font-semibold rounded-full mr-2 mb-2 transition-colors ${
                (filter || 'Original') === f 
                  ? 'bg-amber-400 text-slate-900' 
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsPromptVisible(!isPromptVisible)}
          aria-expanded={isPromptVisible}
          className="text-sm font-semibold text-amber-400 hover:text-amber-300"
        >
          {isPromptVisible ? 'Hide Prompt' : 'Show Prompt'}
        </button>
        {isPromptVisible && (
          <p className="mt-2 text-xs text-slate-400 bg-black/20 p-3 rounded-md">
            {prompt}
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
