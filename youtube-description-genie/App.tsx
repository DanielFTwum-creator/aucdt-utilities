
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { OutputDisplay } from './components/OutputDisplay';
import { generateDescription } from './services/geminiService';
import type { FormData } from './types';
import { DESCRIPTION_TEMPLATE } from './constants';
import { SparklesIcon } from './components/ui/icons';

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
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10" />
            YouTube Description Genie
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Craft the perfect YouTube description for your music with AI.
          </p>
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
