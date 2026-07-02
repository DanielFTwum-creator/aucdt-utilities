
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateDescription } from './services/geminiService';
import type { FormData } from './types';
import { DESCRIPTION_TEMPLATE } from './constants';
import { SparklesIcon } from './components/ui/icons';
import { Menu, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    songTitle: 'Run Away Riddim Mix',
    artistName: 'Kudjo Twum',
    youtubeHandle: '@KudjoTwum',
    genres: 'Dub Reggae, Dark Pop, Electropop, Dancehall',
    influences: 'Bob Marley and The Wailers, Steel Pulse, Third World',
    vibeKeywords: 'Eerie, driving, anthemic, confessional, raw',
    chorusLine: 'Yuh cyan run \'way from yuhself!',
    lyrics: DESCRIPTION_TEMPLATE.split('--- LYRICS --')[1].trim(),
    credits: 'Produced/Mixed/Vocals: Kudjo Twum\nArtwork: Kudjo Twum',
  });
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const currentUser = user?.email || 'unknown';

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedDescription('');
    try {
      const result = await generateDescription(formData);
      setGeneratedDescription(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8" role="banner">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex justify-between w-full md:w-auto items-center">
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-3">
                <SparklesIcon className="w-8 h-8 lg:w-10 lg:h-10 text-blue-400" />
                YT Genie
              </h1>
              <button 
                className="md:hidden p-2 text-gray-400 hover:text-white" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            <div className={`w-full md:w-auto flex flex-col md:flex-row items-center gap-3 md:gap-4 transition-all duration-300 ${isMobileMenuOpen ? 'h-auto opacity-100 mt-4' : 'h-0 opacity-0 overflow-hidden md:h-auto md:opacity-100 md:mt-0'}`}>
              <div className="flex flex-col items-center md:items-end">
                <span className="text-[10px] md:text-xs opacity-50 block uppercase tracking-wider text-gray-400">Identity: {currentUser}</span>
                <button onClick={logout} className="text-[10px] md:text-xs font-black text-pink-500 hover:text-pink-400 hover:underline uppercase mt-1 md:mt-0 transition-colors" aria-label="Terminate current session">Terminate Session</button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="mt-2 text-sm sm:text-lg text-gray-400">
              Craft the perfect YouTube description for your music with AI.
            </p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          <OutputDisplay
            description={generatedDescription}
            isLoading={isLoading}
            error={error}
          />
        </main>
         <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Google Gemini. Designed for musicians, by engineers.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
