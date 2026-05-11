import React from 'react';

interface Creation {
  id: number;
  prompt: string;
  imageUrl: string;
}

interface HistorySidebarProps {
  creations: Creation[];
  onThumbnailClick: (id: number) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ creations, onThumbnailClick }) => {
  if (creations.length === 0) {
    return null;
  }

  return (
    <aside className="fixed top-0 right-0 h-screen w-56 bg-slate-900/50 backdrop-blur-lg border-l border-white/10 p-4 pt-8 hidden xl:flex flex-col gap-4 overflow-y-auto">
      <h3 className="text-lg font-bold text-slate-200 text-center mb-2">History</h3>
      {creations.map(creation => (
        <div 
          key={creation.id}
          onClick={() => onThumbnailClick(creation.id)}
          className="aspect-square w-full rounded-lg bg-cover bg-center cursor-pointer relative group overflow-hidden border-2 border-transparent hover:border-amber-400 transition-all flex-shrink-0"
          style={{ backgroundImage: `url(${creation.imageUrl})` }}
          aria-label={`View creation: ${creation.prompt.substring(0, 30)}...`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onThumbnailClick(creation.id)}
        >
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-white text-xs text-center">{creation.prompt.substring(0, 60)}...</p>
          </div>
        </div>
      ))}
    </aside>
  );
};

export default HistorySidebar;
