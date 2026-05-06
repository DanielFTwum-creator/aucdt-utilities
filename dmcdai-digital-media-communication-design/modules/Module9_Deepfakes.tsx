import React, { useState } from 'react';
import { analyzeAuthenticity } from '../services/geminiService';
import { Loader } from '../components/Loader';
import type { AuthenticityResult } from '../types';

const Module9Deepfakes: React.FC = () => {
    const [mediaClaim, setMediaClaim] = useState<string>('A video of the Prime Minister making an inflammatory statement about local taxes, circulated on WhatsApp yesterday. The audio seems slightly out of sync with the lip movements.');
    const [result, setResult] = useState<AuthenticityResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleAnalyze = async () => {
        if (!mediaClaim.trim()) {
            setError('Please describe the media or claim you wish to analyse for authenticity.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await analyzeAuthenticity(mediaClaim);
            setResult(data);
        } catch (err: any) {
            setError('Analysis failed. Please verify your institutional AI configuration.');
            console.error(err);
        }
        setIsLoading(false);
    };

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case 'Likely Authentic': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Potentially Synthetic': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'Highly Suspicious': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-[var(--color-primary)]';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in font-inter">
            <div className="bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-border-card)] shadow-2xl relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M0 0h100v100H0z" fill="currentColor"/></svg>
                </div>

                <h3 className="text-2xl font-bold mb-6 text-[var(--color-foreground)] font-playfair tracking-tight">AI Forensics & Authenticity Lab</h3>
                <p className="text-[var(--color-foreground-muted)] text-sm mb-6 leading-relaxed">
                    Enter a detailed description of digital media (video, audio, or image) or a specific claim to perform a simulated forensic AI analysis. This tool identifies typical artifacts of synthetic generation.
                </p>
                
                <div className="space-y-4">
                    <textarea
                        value={mediaClaim}
                        onChange={(e) => setMediaClaim(e.target.value)}
                        className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-6 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none min-h-[160px] resize-none font-inter leading-relaxed"
                        placeholder="Describe the suspicious media content or claim..."
                    />
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="w-full bg-[var(--color-primary)] hover:bg-[#b6963a] py-4 rounded-lg text-[var(--color-foreground-on-primary)] font-bebas text-2xl tracking-[0.2em] transition-all transform active:scale-[0.98] duration-300"
                    >
                        {isLoading ? 'Running Forensic Scan...' : 'Execute Authenticity Check'}
                    </button>
                </div>
            </div>

            {isLoading && <div className="py-20"><Loader text="Detecting adversarial artifacts..." /></div>}
            {error && <div className="bg-red-500/10 border border-red-500/20 p-4 rounded text-red-500 text-center font-bold">{error}</div>}

            {result && (
                <div className="space-y-6" aria-live="polite">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Score Card */}
                        <div className="bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-border-card)] flex flex-col items-center justify-center space-y-4">
                            <span className="text-xs font-bold text-[var(--color-foreground-muted)] uppercase tracking-widest">Authenticity Score</span>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[var(--color-background-input)]" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                        strokeDasharray={364.4} 
                                        strokeDashoffset={364.4 - (364.4 * result.score) / 100}
                                        className={getVerdictColor(result.verdict).split(' ')[0]} 
                                    />
                                </svg>
                                <span className="absolute text-3xl font-bebas text-[var(--color-foreground)]">{result.score}%</span>
                            </div>
                        </div>

                        {/* Verdict Card */}
                        <div className={`bg-[var(--color-background-card)] p-8 rounded-lg border-2 ${getVerdictColor(result.verdict)} flex flex-col items-center justify-center space-y-2`}>
                            <span className="text-xs font-bold uppercase tracking-widest opacity-80">Initial Scan Verdict</span>
                            <span className="text-3xl font-playfair font-bold text-center">{result.verdict}</span>
                        </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-border-card)]">
                        <h4 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest mb-6 border-b border-[var(--color-border-card)] pb-2 flex items-center gap-2">
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>
                           Forensic Findings
                        </h4>
                        
                        <div className="space-y-6">
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {result.flags.map((flag, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-foreground)]">
                                        <span className={`w-2 h-2 rounded-full ${getScoreColor(result.score)}`}></span>
                                        {flag}
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-8 p-6 bg-[var(--color-background-input)] rounded-lg border-l-4 border-[var(--color-primary)]">
                                <p className="text-[var(--color-foreground-muted)] text-sm leading-relaxed italic">
                                    {result.analysis}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Module9Deepfakes;
