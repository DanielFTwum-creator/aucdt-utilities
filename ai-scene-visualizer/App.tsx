import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import ImageCard from './components/ImageCard';
import AuthForm from './components/AuthForm';
import { generateImage } from './services/geminiService';
import { sceneDescriptions } from './data/sceneDescriptions';
import { buildPromptFromScene } from './utils/promptBuilder';
import HistorySidebar from './components/HistorySidebar';

interface Creation {
  id: number;
  prompt: string;
  imageUrl: string;
  filter?: string;
}

const examplePrompts = [
    "A serene Japanese garden at sunset with cherry blossoms gently falling, a wooden arched bridge over a peaceful koi pond, and misty mountains in the distance.",
    "A vibrant cyberpunk street market at night, with neon signs reflecting on wet pavement, floating holographic advertisements, and crowds of people in futuristic clothing.",
    "A majestic medieval fantasy castle perched on a cliff, with dragon silhouettes flying around tall spires, a full moon illuminating stone walls, and magical blue lights in the windows."
];

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('1024');
  
  const galleryRef = useRef<HTMLDivElement>(null);

  // Check for logged-in user on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('ai-scene-visualizer-currentUser');
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, []);

  // Load user's creations when they log in
  useEffect(() => {
    if (currentUser) {
      try {
        const storedCreations = localStorage.getItem(`creations_${currentUser}`);
        if (storedCreations) {
          setCreations(JSON.parse(storedCreations));
        }
      } catch (e) {
        console.error("Failed to load creations from localStorage", e);
        setCreations([]);
      }
    } else {
      setCreations([]); // Clear creations on logout
    }
  }, [currentUser]);

  // Save creations to localStorage whenever they change
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(`creations_${currentUser}`, JSON.stringify(creations));
      } catch (e) {
        console.error("Failed to save creations to localStorage", e);
      }
    }
  }, [creations, currentUser]);


  const handleVisualize = useCallback(async () => {
    if (prompt.trim().length < 10) {
        setError("Please provide a more detailed description (at least 10 characters).");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImage(prompt, `${resolution}x${resolution}`);
      setCreations(prevCreations => [
        { id: Date.now(), prompt, imageUrl },
        ...prevCreations,
      ]);
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [prompt, resolution]);

  const handleLoginSuccess = (username: string) => {
    localStorage.setItem('ai-scene-visualizer-currentUser', username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('ai-scene-visualizer-currentUser');
    setCurrentUser(null);
  }
  
  const handleFillExample = (text: string) => {
    setPrompt(text);
  };

  const handleGenerateFromScene = () => {
    const randomScene = sceneDescriptions[Math.floor(Math.random() * sceneDescriptions.length)];
    const generatedPrompt = buildPromptFromScene(randomScene);
    setPrompt(generatedPrompt);
  };

  const handleApplyFilter = (id: number, filter: string) => {
    setCreations(creations.map(c => c.id === id ? { ...c, filter: filter === 'Original' ? undefined : filter } : c));
  };
  
  const handleThumbnailClick = (id: number) => {
    const element = document.getElementById(`creation-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a temporary highlight effect
      element.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-900');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'ring-offset-slate-900');
      }, 2500);
    }
  };


  if (!currentUser) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }
  
  const isGenerateDisabled = prompt.trim().length < 10 || isLoading;

  return (
    <>
      <div className="min-h-screen text-slate-200 font-sans p-4 sm:p-6 md:p-8">
        <div className="container max-w-4xl mx-auto">
          <Header currentUser={currentUser} onLogout={handleLogout} onShowGallery={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })} />

          <main className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl">
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert" aria-live="assertive">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            {/* Steps */}
            <div className="flex justify-center gap-5 sm:gap-10 mb-10">
                <div className="text-center opacity-100"><div className="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-amber-400">1</div><div className="text-sm text-slate-300">Describe</div></div>
                <div className="text-center opacity-100"><div className="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-amber-400">2</div><div className="text-sm text-slate-300">Configure</div></div>
                <div className={`text-center transition-opacity ${isLoading ? 'opacity-100' : 'opacity-60'}`}><div className="w-10 h-10 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-amber-400">3</div><div className="text-sm text-slate-300">Generate</div></div>
            </div>

            {/* Input Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3"><h3 className="text-lg font-semibold text-slate-100">Describe Your Scene</h3><span className="text-sm text-slate-400">{prompt.length} / 500 characters</span></div>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} maxLength={500} placeholder="A serene Japanese garden at sunset with cherry blossoms, a wooden bridge over a koi pond, and distant mountains..." className="w-full min-h-[140px] p-4 bg-black/30 border-2 border-white/10 rounded-xl text-slate-200 text-base resize-vertical transition-colors focus:outline-none focus:border-amber-400 focus:bg-black/40 placeholder:text-slate-500"></textarea>
                <div className="flex gap-2 flex-wrap mt-3">
                    {examplePrompts.map((ex, i) => (
                        <button key={i} onClick={() => handleFillExample(ex)} className="px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-xs transition-all hover:bg-amber-400/20 hover:-translate-y-0.5">💫 Try: {ex.split(' ').slice(0, 4).join(' ')}...</button>
                    ))}
                     <button onClick={handleGenerateFromScene} className="px-4 py-2 bg-purple-400/10 border border-purple-400/30 rounded-full text-purple-300 text-xs transition-all hover:bg-purple-400/20 hover:-translate-y-0.5">🎲 Generate from Scene</button>
                </div>
            </div>

            {/* Resolution Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Choose Resolution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['256', '512', '1024'] as const).map(res => {
                  const details = {
                    '256': { name: '⚡ Fast', meta: '⏱️ ~20s', quality: '💎 Basic'},
                    '512': { name: '⭐ Standard', meta: '⏱️ ~40s', quality: '💎 Good'},
                    '1024': { name: '👑 HD', meta: '⏱️ ~60s', quality: '💎 Great'}
                  }[res];
                  return (
                    <div key={res} className="relative">
                      <input type="radio" id={res} name="resolution" value={res} checked={resolution === res} onChange={() => setResolution(res)} className="absolute opacity-0"/>
                      <label htmlFor={res} className={`block p-5 bg-white/5 border-2 rounded-xl cursor-pointer transition-all text-center ${resolution === res ? 'border-amber-400 bg-amber-400/10' : 'border-white/10 hover:bg-white/10 hover:-translate-y-0.5'}`}>
                        <div className="font-bold text-slate-100 text-base mb-1">{details.name}</div>
                        <div className="text-slate-400 text-sm mb-2">{res} × {res}</div>
                        <div className="flex justify-center gap-3 text-xs text-slate-500"><span className="flex items-center gap-1">{details.meta}</span><span className="flex items-center gap-1">{details.quality}</span></div>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-500/10 border-l-4 border-blue-400 p-4 rounded-r-lg mb-8">
                <div className="flex items-start gap-3"><span className="text-xl flex-shrink-0">💡</span><div className="text-sm text-slate-300 leading-relaxed"><strong>Pro tip:</strong> Include details about lighting, mood, colors, and composition for better results.</div></div>
            </div>
            
            {/* Generate Button */}
            <div className="text-center mb-6">
                <button onClick={handleVisualize} disabled={isGenerateDisabled} aria-busy={isLoading} className="py-4 px-12 bg-gradient-to-r from-amber-400 to-amber-500 border-none rounded-xl text-slate-900 text-lg font-bold cursor-pointer transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center gap-3 mx-auto">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <><span>✨</span><span>Generate Scene</span><span>→</span></>
                  )}
                </button>
            </div>
          </main>
          
          <div ref={galleryRef} className="pt-12">
            {creations.length > 0 && (
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-100">Your Creations</h2>
                <p className="text-slate-400 mt-2">Here are the scenes you've visualized. They are saved in this browser.</p>
              </div>
            )}
            <div id="gallery" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creations.map(creation => (
                <div id={`creation-${creation.id}`} key={creation.id} className="transition-all duration-300 rounded-xl">
                  <ImageCard 
                    imageUrl={creation.imageUrl}
                    prompt={creation.prompt}
                    filter={creation.filter}
                    onApplyFilter={(filter) => handleApplyFilter(creation.id, filter)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <footer className="text-center py-8 mt-8 border-t border-white/10">
            <p className="text-slate-500 text-sm">
                Powered by Google Gemini AI • 
                <a href="/admin.html" target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-400 hover:text-amber-400 transition-colors">
                    Admin Panel
                </a>
            </p>
        </footer>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center" aria-label="Scene generating" role="dialog" aria-modal="true">
              <div className="text-center">
                  <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-6"></div>
                  <div className="text-slate-100 text-xl mb-2">Creating your scene...</div>
                  <div className="text-slate-400 text-base">This usually takes between 30-60 seconds</div>
              </div>
          </div>
      )}

      {/* History Sidebar */}
      <HistorySidebar creations={creations} onThumbnailClick={handleThumbnailClick} />
    </>
  );
};

export default App;