import { AdminPanel } from './components/admin/AdminPanel';
import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../components/Spinner';
import { SparklesIcon, AnanseIcon, DownloadIcon, HistoryIcon, NextSceneIcon, CopyIcon } from '../components/Icons';
import History from '../components/History';

const INITIAL_PROMPT = \`Ananse: Walking slowly but steadily back toward the village, the empty pot tucked under his arm, his expression humble but determined.\`;

const App = () => {
  const [view, setView] = useState(() => window.location.hash.startsWith('#/admin') ? 'admin' : 'main');

  useEffect(() => {
    const handleHash = () => setView(window.location.hash.startsWith('#/admin') ? 'admin' : 'main');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToAdmin = () => { window.location.hash = '#/admin'; };
  const navigateToMain = () => { window.location.hash = '#/'; };

  const [prompt, setPrompt] = useState(INITIAL_PROMPT);
  const [isLoading, setIsLoading] = useState(false);

  if (view === 'admin') return <AdminPanel onLogout={navigateToMain} />;

  return (
    <div className=\"min-h-screen bg-[#0F0C07] text-[#F5ECD7] font-serif p-8\">
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999, opacity: 0.1 }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.1'}>
        <button onClick={navigateToAdmin} style={{ fontSize: '10px', background: '#C8A84B', color: '#000', padding: '2px 5px', border: 'none', cursor: 'pointer' }}>ADM</button>
      </div>
      <header className=\"text-center mb-12 border-b border-[#C8A84B]/20 pb-8\">
        <h1 className=\"text-5xl font-black text-[#C8A84B] uppercase tracking-widest\">Ananse Cartoon Generator</h1>
        <p className=\"italic opacity-60 mt-2\">Institutional Narrative Engine</p>
      </header>
      <main className=\"max-w-4xl mx-auto bg-[#141210] p-12 border border-[#C8A84B]/30 shadow-2xl\">
        <p className=\"text-xl leading-relaxed mb-8 italic\">\"Wisdom is like a baobab tree; no one individual can embrace it with both arms.\"</p>
        <div className=\"space-y-6\">
            <label className=\"block font-bold uppercase tracking-widest text-[#C8A84B] text-xs\">Scene Narrative</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className=\"w-full h-40 bg-black/40 border border-[#C8A84B]/20 p-6 text-lg outline-none focus:border-[#C8A84B]\" />
            <button className=\"w-full bg-[#C8A84B] text-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-all\">Generate Digital Folktale</button>
        </div>
      </main>
    </div>
  );
};

export default App;
