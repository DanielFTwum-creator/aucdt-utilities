import React from 'react';

interface StructureBuilderProps {
  structure: string[];
  setStructure: React.Dispatch<React.SetStateAction<string[]>>;
  disabled: boolean;
}

const getNumberedPart = (part: string, structure: string[], currentIndex: number): string => {
    const count = structure.slice(0, currentIndex + 1).filter(p => p === part).length;
    const isNumbered = ['Verse', 'Chorus', 'Bridge'].includes(part);
    return isNumbered ? `${part} ${count}` : part;
};

const StructureBuilder: React.FC<StructureBuilderProps> = ({ structure, setStructure, disabled }) => {
  const availableParts = ['Intro', 'Verse', 'Chorus', 'Bridge', 'DJ Toast', 'Instrumental Break', 'Outro'];

  const addPart = (part: string) => {
    setStructure([...structure, part]);
  };

  const removePart = (indexToRemove: number) => {
    setStructure(structure.filter((_, index) => index !== indexToRemove));
  };

  const movePart = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newStructure = [...structure];
      [newStructure[index - 1], newStructure[index]] = [newStructure[index], newStructure[index - 1]];
      setStructure(newStructure);
    }
    if (direction === 'down' && index < structure.length - 1) {
      const newStructure = [...structure];
      [newStructure[index + 1], newStructure[index]] = [newStructure[index], newStructure[index + 1]];
      setStructure(newStructure);
    }
  };

  const shuffleStructure = () => {
    if (structure.length < 2) return;
    const shuffled = [...structure];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setStructure(shuffled);
  };


  return (
    <div className="bg-black/30 p-6 rounded-3xl border border-white/5" role="group" aria-labelledby="builder-title">
      <div className="mb-6">
          <p id="builder-title" className="text-xs font-black uppercase tracking-widest text-title/60 mb-3">Riddim Architecture</p>
          <div className="flex flex-wrap gap-2 items-center" role="toolbar" aria-label="Add song parts">
          {availableParts.map(part => (
              <button
              key={part}
              onClick={() => addPart(part)}
              disabled={disabled}
              className="px-4 py-2 bg-green-800/40 hover:bg-green-700/60 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-tighter rounded-xl border border-green-500/20 shadow-sm transition-all duration-200"
              aria-label={`Add ${part}`}
              >
              + {part}
              </button>
          ))}
            <button
              onClick={shuffleStructure}
              disabled={disabled || structure.length < 2}
              className="px-4 py-2 bg-purple-800/40 hover:bg-purple-700/60 disabled:bg-gray-800 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-tighter rounded-xl border border-purple-500/20 shadow-sm transition-all duration-200"
              title="Shuffle song structure"
              aria-label="Shuffle entire song structure"
            >
              🔀 Shuffle
            </button>
          </div>
      </div>

      <div className="space-y-2" role="list" aria-label="Current song structure">
          {structure.length > 0 ? (
              structure.map((part, index) => (
                  <div key={index} className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-2xl transition-all" role="listitem">
                      <span className="font-black text-xs uppercase tracking-widest text-title">
                          {getNumberedPart(part, structure, index)}
                      </span>
                      <div className="flex items-center space-x-3">
                          <button onClick={() => movePart(index, 'up')} disabled={index === 0 || disabled} className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors p-1" aria-label={`Move ${part} up`}>↑</button>
                          <button onClick={() => movePart(index, 'down')} disabled={index === structure.length - 1 || disabled} className="text-gray-400 hover:text-white disabled:opacity-30 transition-colors p-1" aria-label={`Move ${part} down`}>↓</button>
                          <button onClick={() => removePart(index)} disabled={disabled} className="text-red-500/60 hover:text-red-400 disabled:opacity-30 transition-colors text-xl leading-none p-1 font-bold" aria-label={`Remove ${part}`}>&times;</button>
                      </div>
                  </div>
              ))
          ) : (
              <p className="text-center text-gray-600 text-[10px] py-4 uppercase font-bold tracking-widest">Select components to build your riddim</p>
          )}
      </div>
    </div>
  );
};

export default StructureBuilder;