
import React from 'react';
import { ThumbnailVariation } from '../data/catalog';
import { ThumbnailPreview } from './ThumbnailPreview';
import { Download, Info } from 'lucide-react';

interface ThumbnailCardProps {
  variation: ThumbnailVariation;
  sectionTitle: string;
  sectionTheme: string;
  onViewDetails: (variation: ThumbnailVariation) => void;
  customBackground?: string | null;
}

export const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ variation, sectionTitle, sectionTheme, onViewDetails, customBackground }) => {
  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 flex flex-col">
      <div className="relative cursor-pointer" onClick={() => onViewDetails(variation)}>
        <ThumbnailPreview title={sectionTitle} style={variation.style} theme={sectionTheme} customBackground={customBackground} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </button>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-zinc-100 font-medium text-sm">{variation.style}</h3>
          <span className="text-xs text-zinc-500 font-mono">{variation.fileSize}</span>
        </div>
        
        <div className="mt-auto pt-3 border-t border-zinc-800 flex justify-between items-center">
          <div className="flex gap-1">
             {/* Star rating mini visualization */}
             <div className="flex text-[10px] text-yellow-500 gap-0.5">
               {[...Array(variation.performance.desktop)].map((_, i) => <span key={i}>★</span>)}
             </div>
          </div>
          
          <button 
            onClick={() => onViewDetails(variation)}
            className="text-zinc-400 hover:text-white transition-colors"
            title="Info"
          >
            <Info size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
