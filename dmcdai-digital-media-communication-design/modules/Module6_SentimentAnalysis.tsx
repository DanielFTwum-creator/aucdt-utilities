import React, { useState } from 'react';
import { analyzeSentiment } from '../services/geminiService';
import { Loader } from '../components/Loader';
import type { SentimentAnalysisResult } from '../types';

const SentimentMeter: React.FC<{ sentiment: 'Positive' | 'Negative' | 'Neutral', confidence: number }> = ({ sentiment, confidence }) => {
    const sentimentConfig = {
        Positive: { color: 'bg-green-500', icon: '🙂' },
        Neutral: { color: 'bg-gray-500', icon: '😐' },
        Negative: { color: 'bg-red-500', icon: '😠' },
    };
    const { color, icon } = sentimentConfig[sentiment];
    const width = `${Math.round(confidence * 100)}%`;

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className={`text-2xl font-bold ${color.replace('bg-', 'text-')}`}>{sentiment} {icon}</span>
                <span className="text-sm font-mono text-[var(--color-foreground-muted)]">Confidence: {width}</span>
            </div>
            <div className="w-full bg-[var(--color-background-card-hover)] rounded-full h-4">
                <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width }}></div>
            </div>
        </div>
    );
};

const Module6SentimentAnalysis: React.FC = () => {
  const [text, setText] = useState<string>('Just tried the new coffee shop downtown. The latte was incredible, but the service was a bit slow.');
  const [result, setResult] = useState<SentimentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyse.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const analysisResult = await analyzeSentiment(text);
      setResult(analysisResult);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('API Rate limit reached. The Free Tier is currently at capacity. Please wait 60 seconds and try again.');
      } else if (err.message === 'SAFETY_BLOCK') {
        setError('Your text was flagged by the safety filters. We cannot analyse sentiment for this content.');
      } else if (err.message === 'INVALID_KEY') {
        setError('Invalid API Key. Please check your institutional configuration.');
      } else if (err.message === 'MODEL_NOT_FOUND') {
        setError('The specified AI model was not found. The institutional API profile is being synchronized. Please try again in a few moments.');
      } else if (err.message === 'GATEWAY_TIMEOUT') {
        setError('The AI service is taking longer than expected to respond. This can happen during peak hours. Please try a simpler prompt.');
      } else {
        setError('An unexpected error occurred during analysis. Please try again.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg">
        <label htmlFor="text" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
          Text to Analyse
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a customer review, social media post, etc."
          className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 resize-none h-48 font-inter"
          aria-label="Enter text for sentiment analysis"
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          aria-label={isLoading ? "AI is quantifying the sentiment" : "Start AI sentiment analysis process"}
          title="Click to analyse the sentiment of your text"
          className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed text-[var(--color-foreground-on-primary)] font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center font-inter"
        >
          {isLoading ? 'Analysing...' : 'Analyse Sentiment'}
        </button>
      </div>
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg" aria-live="polite">
        <h3 className="text-xl font-semibold mb-4 text-[var(--color-foreground)] font-playfair">Analysis Findings</h3>
        {error && <p className="text-center text-red-400 font-inter">{error}</p>}
        {isLoading && <Loader text="Quantifying the vibe..." />}
        {result ? (
          <div className="space-y-6">
            <SentimentMeter sentiment={result.sentiment} confidence={result.confidence} />
            <div>
              <h4 className="font-semibold text-[var(--color-foreground-muted)] font-inter">Explanation</h4>
              <p className="text-[var(--color-foreground-muted)] mt-2 text-sm italic border-l-2 border-[var(--color-primary)] pl-4 font-inter">{result.explanation}</p>
            </div>
          </div>
        ) : (
          !isLoading && <p className="text-[var(--color-foreground-muted)] text-center pt-16">Results will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default Module6SentimentAnalysis;
