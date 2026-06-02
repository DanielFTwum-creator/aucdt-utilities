import React, { useState } from 'react';
import { analyzeEthics } from '../services/geminiService';
import { Loader } from '../components/Loader';
import type { EthicalAnalysisResult } from '../types';

const SeverityBadge: React.FC<{ severity: 'Low' | 'Medium' | 'High' }> = ({ severity }) => {
    const config = {
        Low: 'bg-green-500/20 text-green-300 border-green-500/30',
        Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        High: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${config[severity]}`}>{severity} Risk</span>
};


const Module10Ethics: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A fitness app that automatically posts users\' missed workouts to their social media feed to encourage them with social pressure.');
  const [result, setResult] = useState<EthicalAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!prompt.trim()) {
      setError('Please describe a design or campaign idea.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const analysisResult = await analyzeEthics(prompt);
      setResult(analysisResult);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('API rate limit reached. Ethical analysis requires deep processing. Please wait 60 seconds and try again.');
      } else if (err.message === 'SAFETY_BLOCK') {
        setError('Your input was flagged by the safety filters. We cannot perform an ethical analysis on this content.');
      } else if (err.message === 'INVALID_KEY') {
        setError('Invalid API Key. Please check your institutional configuration.');
      } else {
        setError('An error occurred during analysis. Please try again.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg mb-8">
        <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
          Design or Campaign Idea
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe a user experience, ad campaign, or app feature..."
          className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 resize-none h-32 font-inter"
          aria-label="Enter campaign idea for ethical analysis"
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          aria-label={isLoading ? "AI is applying ethical frameworks" : "Start AI ethical risk assessment"}
          title="Click to run ethical analysis on your idea"
          className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed text-[var(--color-foreground-on-primary)] font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center font-inter"
        >
          {isLoading ? 'Analysing...' : 'Run Ethical Analysis'}
        </button>
      </div>
 
       <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] min-h-[20rem]" aria-live="polite">
        <h3 className="text-xl font-semibold mb-4 text-[var(--color-foreground)] font-playfair">Ethical Analysis Report</h3>
        {error && <p className="text-center text-red-400 font-inter">{error}</p>}
        {isLoading && <Loader text="Applying ethical frameworks..." />}
        {result ? (
          <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-[var(--color-foreground-muted)] mb-2 font-inter">Summary</h4>
                <p className="text-[var(--color-foreground-muted)] text-sm border-l-2 border-[var(--color-primary)] pl-4 italic font-inter">{result.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold text-[var(--color-foreground-muted)] mb-3">Potential Concerns</h4>
                <div className="space-y-4">
                    {result.concerns.map((concern, index) => (
                        <div key={index} className="bg-[var(--color-background-main)]/50 p-4 rounded-md border border-[var(--color-border-card)]">
                            <div className="flex justify-between items-start mb-2">
                                <h5 className="font-bold text-rose-300">{concern.issue}</h5>
                                <SeverityBadge severity={concern.severity} />
                            </div>
                            <p className="text-sm text-[var(--color-foreground-muted)]">{concern.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        ) : (
          !isLoading && <p className="text-[var(--color-foreground-muted)] text-center pt-16">The analysis report will appear here.</p>
        )}
      </div>
    </div>
  );
};

export default Module10Ethics;
