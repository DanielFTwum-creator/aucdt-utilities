
import React, { useState, useEffect } from 'react';
import { DictionaryEntry, getEntries, searchEntries, addEntry } from '../services/dictionaryService';
import { logAction } from '../services/auditLogService';

interface PatoisDictionaryProps {
    currentUser: string | null;
}

const PatoisDictionary: React.FC<PatoisDictionaryProps> = ({ currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [entries, setEntries] = useState<DictionaryEntry[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newTerm, setNewTerm] = useState('');
    const [newDef, setNewDef] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setEntries(getEntries());
    }, []);

    useEffect(() => {
        setEntries(searchEntries(searchTerm));
    }, [searchTerm]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!newTerm.trim() || !newDef.trim()) return;

        try {
            const updated = addEntry(newTerm.trim(), newDef.trim());
            setEntries(updated);
            setNewTerm('');
            setNewDef('');
            setIsAdding(false);
            if (currentUser) {
                logAction(currentUser, 'Dictionary Term Added', { term: newTerm });
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-card p-6 rounded-[2rem] border border-white/5 shadow-inner fade-in">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase tracking-widest text-title text-xl">Patois Glossary</h3>
                <button 
                    onClick={() => setIsAdding(!isAdding)} 
                    className="text-[10px] font-black uppercase tracking-widest bg-green-900/40 hover:bg-green-900/60 text-green-400 px-4 py-2 rounded-full border border-green-500/20 transition-all"
                >
                    {isAdding ? 'Cancel' : '+ Add Term'}
                </button>
            </div>

            {isAdding && (
                <div className="mb-8 p-6 bg-black/40 rounded-2xl border border-white/10 animate-fadeIn">
                    <h4 className="text-xs font-bold uppercase text-white/60 mb-4">Contribute to the Knowledge Base</h4>
                    <form onSubmit={handleAdd} className="space-y-4">
                        <div>
                            <label htmlFor="term" className="sr-only">Term</label>
                            <input
                                id="term"
                                type="text"
                                placeholder="Patois Word/Phrase"
                                value={newTerm}
                                onChange={e => setNewTerm(e.target.value)}
                                className="w-full p-4 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder:opacity-30 focus:border-title outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="def" className="sr-only">Definition</label>
                            <input
                                id="def"
                                type="text"
                                placeholder="Definition or Context"
                                value={newDef}
                                onChange={e => setNewDef(e.target.value)}
                                className="w-full p-4 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder:opacity-30 focus:border-title outline-none transition-all"
                            />
                        </div>
                        {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                        <button 
                            type="submit" 
                            className="w-full py-3 bg-title hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl transition-colors"
                        >
                            Save Entry
                        </button>
                    </form>
                </div>
            )}

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Search dictionary..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-4 pl-12 bg-black/40 border border-white/5 rounded-2xl text-white focus:border-title/50 outline-none transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-30">🔍</span>
            </div>

            <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {entries.length > 0 ? (
                    entries.map((entry, idx) => (
                        <div key={idx} className="group p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all">
                            <h5 className="text-title font-bold text-lg mb-1 group-hover:text-yellow-300 transition-colors">{entry.term}</h5>
                            <p className="text-gray-400 text-sm leading-relaxed">{entry.definition}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-30">
                        <p className="text-xs font-bold uppercase tracking-widest">No definitions found</p>
                    </div>
                )}
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
};

export default PatoisDictionary;
