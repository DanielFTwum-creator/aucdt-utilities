
import React, { useMemo, useState } from 'react';
import { DIRECTORY_DATA } from '../constants';
import { Category } from '../types';

interface DirectoryHomeProps {
  onViewPlaceholder: () => void;
}

const DirectoryHome: React.FC<DirectoryHomeProps> = ({ onViewPlaceholder }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);

  const categories = Object.values(Category).filter(c => c !== Category.ALL);

  const filteredTools = useMemo(() => {
    return DIRECTORY_DATA.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === Category.ALL || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="pt-28 pb-12 px-4 md:px-8 lg:px-16 bg-techbridge-cream dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-6xl font-black dark:text-white mb-4 tracking-tighter uppercase text-techbridge-burgundy">GENAI Directory</h2>
          <div className="h-2 w-24 bg-techbridge-gold rounded-full mb-6"></div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
            TUC's official index of of specialized artificial intelligence tools for research, development, and university administration.
          </p>
        </header>

        <div className="sticky top-24 z-30 bg-techbridge-cream/80 dark:bg-slate-900/80 backdrop-blur-xl py-6 mb-12 border-b border-techbridge-beige/30">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 w-full">
              <input 
                type="text" 
                placeholder="Search tools, capabilities, or research nodes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border-2 border-techbridge-beige dark:border-slate-700 rounded-2xl px-12 py-4 font-bold text-gray-800 dark:text-white focus:border-techbridge-gold outline-none transition-all shadow-sm"
              />
              <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => setSelectedCategory(Category.ALL)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === Category.ALL 
                    ? 'bg-techbridge-burgundy text-white' 
                    : 'bg-white text-gray-500 hover:bg-techbridge-beige border border-techbridge-beige'
                }`}
              >
                All Systems
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedCategory === cat 
                      ? 'bg-techbridge-burgundy text-white' 
                      : 'bg-white text-gray-500 hover:bg-techbridge-beige border border-techbridge-beige'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.length > 0 ? (
            filteredTools.map(tool => (
              <div 
                onClick={() => {
                  if (tool.path === '#' || tool.path.includes('example.com')) {
                    onViewPlaceholder();
                  } else {
                    window.open(tool.path, '_blank');
                  }
                }}
                key={tool.id} 
                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-techbridge-beige dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col justify-between cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (tool.path === '#' || tool.path.includes('example.com')) {
                      onViewPlaceholder();
                    } else {
                      window.open(tool.path, '_blank');
                    }
                  }
                }}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-techbridge-gold/10 text-techbridge-burgundy text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-techbridge-gold/20">
                      {tool.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-techbridge-cream dark:bg-slate-700 flex items-center justify-center group-hover:bg-techbridge-burgundy group-hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-techbridge-burgundy dark:text-white mb-3 tracking-tight group-hover:text-techbridge-gold transition-colors">{tool.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{tool.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h4 className="text-2xl font-black text-techbridge-burgundy">No Matching Sub-systems</h4>
              <p className="text-gray-500 font-medium">Try broadening your search or selecting 'All Systems'</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectoryHome;
