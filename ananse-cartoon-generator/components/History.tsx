
import React from 'react';
import { DownloadIcon } from './Icons';
import type { HistoryItem } from '../App';

interface HistoryProps {
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDownload: (base64Image: string, filename: string) => void;
}

const History: React.FC<HistoryProps> = ({ items, onRestore, onDownload }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div 
            key={item.id} 
            className="group relative bg-brand-surface rounded-lg shadow-lg overflow-hidden animate-fade-in"
        >
          <img
            src={item.image}
            alt="Generated Ananse cartoon history"
            className="w-full h-48 object-cover"
          />
           {item.frames && (
            <div className="absolute top-2 right-2 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              Anim
            </div>
           )}
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
             <p className="text-xs text-brand-text-muted text-center mb-4 line-clamp-3">{item.prompt}</p>
             <button
                onClick={() => onRestore(item)}
                className="w-full text-center py-2 px-4 mb-2 bg-brand-primary text-white font-semibold rounded-md hover:scale-105 transform transition-transform"
            >
                Restore
            </button>
            <button
                onClick={() => onDownload(item.image, `ananse-scene-${item.id}.jpeg`)}
                className="w-full text-center py-2 px-4 flex items-center justify-center gap-2 bg-brand-secondary/80 text-brand-background font-semibold rounded-md hover:scale-105 transform transition-transform"
            >
                <DownloadIcon className="h-4 w-4"/>
                Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
