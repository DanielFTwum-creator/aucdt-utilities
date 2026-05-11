
import React from 'react';
import type { HistoryEntry } from '../App';

interface HistoryProps {
  history: HistoryEntry[];
  onLoad: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onLoad, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold" style={{ color: '#D4AF37' }}>
          Song History
        </h2>
        <button
          onClick={onClear}
          className="bg-red-700 hover:bg-red-800 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
          aria-label="Clear all song history"
        >
          Clear History
        </button>
      </div>
      <ul className="space-y-3 max-h-96 overflow-y-auto pr-2" aria-label="List of previously generated songs">
        {history.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => onLoad(entry)}
              className="w-full text-left p-4 bg-gray-800/60 rounded-lg hover:bg-gray-700/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <p className="font-bold text-white truncate">
                {entry.songTitle || entry.theme}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {entry.songStructure ? `${entry.songStructure.join(' → ')}` : ''}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {entry.rhymeScheme && entry.rhymeScheme !== 'Freestyle' ? `(${entry.rhymeScheme}) ` : ''}
                {entry.djPersona ? `[${entry.djPersona}] ` : ''}
                {entry.artistName ? `${entry.artistName} - ` : ''}
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;