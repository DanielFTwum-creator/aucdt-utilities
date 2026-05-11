import React, { useState } from 'react';
import { generateVideo } from '../services/geminiService';
import { Loader } from '../components/Loader';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const Module2VideoProduction: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A cinematic shot of a robot tending to a glowing, digital garden on a spaceship');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!API_KEY) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-primary)]/50 font-inter">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4 font-playfair">API Key Required</h2>
        <p className="text-[var(--color-foreground-muted)]">
          Video generation requires a Gemini API key with VEO access. Please set <code className="font-mono text-sm bg-[var(--color-background-card-hover)] px-1 rounded">VITE_GEMINI_API_KEY</code> in your <code className="font-mono text-sm bg-[var(--color-background-card-hover)] px-1 rounded">.env.local</code> file and restart the dev server.
        </p>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setVideoUrl('');
    try {
      const url = await generateVideo(prompt);
      setVideoUrl(url);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('API Rate limit reached. Video generation is resource-intensive. Please wait a few minutes and try again.');
      } else if (err.message === 'SAFETY_BLOCK') {
        setError('Your video prompt was flagged by the safety filters. Please rephrase and try again.');
      } else if (err.message === 'MODEL_NOT_FOUND' || err.message === 'INVALID_KEY' || err.message.includes('Requested entity was not found')) {
        setError('Video generation failed. The institutional API key may lack VEO permissions. Please contact your administrator.');
      } else {
        setError('An unexpected error occurred during video generation. Please check the console.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg">
        <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
          Video Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic eagle soaring over a futuristic city"
          className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 resize-none h-24 font-inter"
          aria-label="Describe the video you want to generate"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label={isLoading ? "AI is generating your video preview" : "Start AI video production process"}
          title="Click to generate video based on your prompt"
          className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed text-[var(--color-foreground-on-primary)] font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center font-inter"
        >
          {isLoading ? 'Generating Video...' : 'Generate Video'}
        </button>
      </div>

      <div className="mt-8" aria-live="polite">
        {error && <p className="text-center text-red-400">{error}</p>}
        {isLoading && <Loader text="AI is directing your masterpiece... This may take a few minutes." />}
        {videoUrl && (
          <div className="bg-[var(--color-background-card)] p-4 rounded-lg border border-[var(--color-border-card)]">
            <h3 className="text-lg font-semibold mb-4 text-center text-[var(--color-foreground)]">Generated Video</h3>
            <video src={videoUrl} controls autoPlay loop className="rounded-md w-full max-w-2xl mx-auto shadow-2xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Module2VideoProduction;
