import React, { useState, useCallback, useEffect } from 'react';
import { InputFormEnhanced } from './components/InputFormEnhanced';
import { OutputDisplay } from './components/OutputDisplay';
import { generateDescription, checkAPIAvailability } from './services/geminiServiceEnhanced';
import type { FormData } from './types';
import { DESCRIPTION_TEMPLATE } from './constants';
import { SparklesIcon, InfoIcon, AlertTriangleIcon } from './components/ui/iconsEnhanced';

const AppEnhanced: React.FC = () => {
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
  const [apiStatus, setApiStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  // Check API availability on component mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const isAvailable = await checkAPIAvailability();
        setApiStatus(isAvailable ? 'available' : 'unavailable');
      } catch (error) {
        setApiStatus('unavailable');
      }
    };

    checkAPI();
  }, []);

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('youtube-genie-form-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setShowWelcomeMessage(false);
      } catch (error) {
        console.warn('Failed to load saved form data');
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('youtube-genie-form-data', JSON.stringify(formData));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedDescription('');
    
    try {
      const result = await generateDescription(formData);
      setGeneratedDescription(result);
      setShowWelcomeMessage(false);
      
      // Track successful generation
      const stats = JSON.parse(localStorage.getItem('youtube-genie-stats') || '{"generations": 0, "lastUsed": null}');
      stats.generations += 1;
      stats.lastUsed = new Date().toISOString();
      localStorage.setItem('youtube-genie-stats', JSON.stringify(stats));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error('Generation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleClearForm = () => {
    setFormData({
      songTitle: '',
      artistName: '',
      youtubeHandle: '@',
      genres: '',
      influences: '',
      vibeKeywords: '',
      chorusLine: '',
      lyrics: '',
      credits: '',
    });
    setGeneratedDescription('');
    setError(null);
    localStorage.removeItem('youtube-genie-form-data');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10" />
            YouTube Description Genie
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full ml-2">Enhanced</span>
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Craft the perfect YouTube description for your music with AI.
          </p>
          
          {/* API Status Indicator */}
          <div className="mt-4 flex items-center justify-center">
            {apiStatus === 'checking' && (
              <div className="flex items-center text-yellow-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                Checking AI service...
              </div>
            )}
            {apiStatus === 'available' && (
              <div className="flex items-center text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                AI service ready
              </div>
            )}
            {apiStatus === 'unavailable' && (
              <div className="flex items-center text-red-400 text-sm">
                <AlertTriangleIcon className="w-4 h-4 mr-2" />
                AI service unavailable - Demo mode only
              </div>
            )}
          </div>

          {/* Welcome Message */}
          {showWelcomeMessage && (
            <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-start">
                <InfoIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="text-blue-300 font-semibold mb-2">Welcome to the Enhanced Version!</h3>
                  <p className="text-blue-200 text-sm">
                    This enhanced version includes input validation, better error handling, auto-save functionality, 
                    and improved user experience. Your form data is automatically saved as you type.
                  </p>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InputFormEnhanced
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

        {/* Additional Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handleClearForm}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-600 hover:border-gray-500 rounded-md transition-colors duration-200"
            disabled={isLoading}
          >
            Clear Form
          </button>
          <button
            onClick={() => setShowWelcomeMessage(!showWelcomeMessage)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 border border-gray-600 hover:border-gray-500 rounded-md transition-colors duration-200"
          >
            {showWelcomeMessage ? 'Hide' : 'Show'} Welcome Message
          </button>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Enhanced version with improved validation, error handling, and user experience.</p>
          <p className="mt-1">Powered by Google Gemini. Designed for musicians, by engineers.</p>
        </footer>
      </div>
    </div>
  );
};

export default AppEnhanced;

