import { useState } from 'react';
import React from 'react';
import { PREDEFINED_TRAITS } from '../constants';
import { Trait } from '../types';
import { Search } from 'lucide-react';

export default function TraitPool({ onSelect }: { onSelect: (trait: Trait) => void }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTraits = PREDEFINED_TRAITS.filter(t => 
    t.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      // Check if it exists
      const exists = PREDEFINED_TRAITS.find(t => t.label.toLowerCase() === searchTerm.toLowerCase());
      if (!exists) {
        onSelect({ id: searchTerm.toLowerCase().replace(/\s+/g, '-'), label: searchTerm, emoji: '⭐' });
        setSearchTerm('');
      }
    }
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search for traits or type to add custom..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-bar w-full bg-white/5 border border-border p-4 rounded-xl text-lg text-text-main"
      />
      <div className="trait-grid grid grid-cols-4 gap-3 overflow-y-auto">
        {filteredTraits.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            className="trait-card flex items-center gap-3 p-4 border border-border bg-white/[0.02] rounded-xl cursor-pointer hover:bg-white/5 hover:border-text-dim"
          >
            <span className="trait-emoji text-xl text-text-main">{t.emoji}</span>
            <span className="trait-name text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>
      <p style={{color: 'var(--color-text-dim)', fontSize: '11px'}}>Displaying {filteredTraits.length} of {PREDEFINED_TRAITS.length} standard traits. Press Enter to add as a custom trait.</p>
    </>
  );
}
