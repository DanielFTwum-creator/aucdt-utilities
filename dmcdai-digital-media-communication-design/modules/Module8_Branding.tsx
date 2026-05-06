import React, { useState } from 'react';
import { generateBrandingIdentity } from '../services/geminiService';
import { Loader } from '../components/Loader';
import type { BrandingResult } from '../types';

const Module8Branding: React.FC = () => {
    const [brandName, setBrandName] = useState<string>('Lumina Academy');
    const [values, setValues] = useState<string>('Innovation, Accessibility, Enlightenment');
    const [result, setResult] = useState<BrandingResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerate = async () => {
        if (!brandName.trim() || !values.trim()) {
            setError('Please provide both a brand name and core values.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await generateBrandingIdentity(brandName, values);
            setResult(data);
        } catch (err: any) {
            setError('Failed to generate brand identity. Please try again.');
            console.error(err);
        }
        setIsLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in font-inter">
            <div className="bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-border-card)] shadow-2xl">
                <h3 className="text-2xl font-bold mb-8 text-[var(--color-foreground)] font-playfair border-l-4 border-[var(--color-primary)] pl-4">Institutional Identity Designer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label htmlFor="brand-name" className="text-sm font-bold text-[var(--color-foreground-muted)] uppercase tracking-widest">Institution/Brand Name</label>
                        <input
                            id="brand-name"
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-4 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                            placeholder="e.g., Techbridge University"
                            aria-label="Enter the institution or brand name"
                        />
                    </div>
                    <div className="space-y-4">
                        <label htmlFor="brand-values" className="text-sm font-bold text-[var(--color-foreground-muted)] uppercase tracking-widest">Core Educational Values</label>
                        <input
                            id="brand-values"
                            type="text"
                            value={values}
                            onChange={(e) => setValues(e.target.value)}
                            className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-4 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                            placeholder="e.g., Academic Rigor, Inclusion, Digital First"
                            aria-label="Enter core educational or brand values"
                        />
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    aria-label={isLoading ? 'AI is synthesizing brand identity' : 'Generate brand identity framework'}
                    className="mt-8 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-lg text-[var(--color-foreground-on-primary)] font-bebas text-2xl tracking-widest transition duration-500"
                >
                    {isLoading ? 'Synthesizing Brand DNA...' : 'Generate Identity Framework'}
                </button>
            </div>

            <div aria-live="polite">
            {isLoading && <div className="py-20"><Loader text="Harmonizing institutional values..." /></div>}
            {error && <p className="text-center text-red-400 py-10 font-bold">{error}</p>}

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Brand Manifesto */}
                    <div className="lg:col-span-2 bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-border-card)] border-t-4 border-t-[var(--color-primary)]">
                        <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">Brand Manifesto</h4>
                        <p className="text-xl italic font-playfair text-[var(--color-foreground)] leading-relaxed">
                            "{result.manifesto}"
                        </p>
                        
                        <div className="mt-10 pt-10 border-t border-[var(--color-border-card)]">
                            <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">Logo & Symbology Concept</h4>
                            <p className="text-[var(--color-foreground-muted)] text-sm leading-relaxed whitespace-pre-line">
                                {result.logoConcept}
                            </p>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div className="space-y-6">
                        <div className="bg-[var(--color-background-card)] p-8 rounded-lg border border-[var(--color-border-card)] h-full">
                           <h4 className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest mb-6">Institutional Palette</h4>
                           <div className="space-y-6">
                               {result.colorPalette.map((color, idx) => (
                                   <div key={idx} className="flex gap-4 items-center group">
                                       <div 
                                           className="w-16 h-16 rounded-lg shadow-inner flex-shrink-0 transition-transform group-hover:scale-110 duration-300" 
                                           style={{ backgroundColor: color.hex }}
                                       />
                                       <div className="flex-1">
                                           <div className="flex justify-between items-center">
                                               <span className="font-bold text-[var(--color-foreground)] text-sm">{color.name}</span>
                                               <span className="text-[var(--color-foreground-muted)] font-mono text-xs">{color.hex}</span>
                                           </div>
                                           <p className="text-[var(--color-foreground-muted)] text-xs mt-1 italic">{color.reason}</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Module8Branding;
