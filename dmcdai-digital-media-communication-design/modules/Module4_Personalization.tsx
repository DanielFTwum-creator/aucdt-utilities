import React, { useState } from 'react';
import { personalizeContent } from '../services/geminiService';
import { Loader } from '../components/Loader';
import type { PersonalizationResult } from '../types';

const Module4Personalization: React.FC = () => {
  const [audience, setAudience] = useState<string>('Gen Z students interested in sustainable fashion');
  const [product, setProduct] = useState<string>('Eco-friendly recycled denim backpack');
  const [result, setResult] = useState<PersonalizationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!audience.trim() || !product.trim()) {
      setError('Please provide both an audience description and a product name.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await personalizeContent(audience, product);
      setResult(data);
    } catch (err: any) {
      setError('An error occurred during personalization. Please check your configuration.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full space-y-8 animate-fade-in">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-[var(--color-foreground)] font-playfair">Audience Personalization Engine</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="audience" className="text-sm font-medium text-[var(--color-foreground-muted)] font-inter">Target Audience</label>
            <textarea
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] h-32 resize-none font-inter"
              placeholder="e.g., Tech-savvy parents under 40"
              aria-label="Describe the target audience for personalization"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product" className="text-sm font-medium text-[var(--color-foreground-muted)] font-inter">Product/Service Description</label>
            <textarea
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] h-32 resize-none font-inter"
              placeholder="e.g., A smart home security camera with AI detection"
              aria-label="Describe the product or service to personalize"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label={isLoading ? 'AI is crafting personalized variants' : 'Generate personalized content variants'}
          className="mt-6 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg text-[var(--color-foreground-on-primary)] font-bold transition duration-300 font-inter"
        >
          {isLoading ? 'Crafting Personalizations...' : 'Generate Personalized Variants'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-live="polite">
        {isLoading && <div className="lg:col-span-3 py-12"><Loader text="Simulating audience empathy..." /></div>}
        {error && <p className="lg:col-span-3 text-center text-red-400 font-inter">{error}</p>}
        {result?.variants.map((variant, idx) => (
          <div key={idx} className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg flex flex-col">
            <div className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-bold self-start mb-4 uppercase tracking-wider font-bebas">
              {variant.persona}
            </div>
            <p className="text-[var(--color-foreground)] font-inter leading-relaxed mb-6 flex-1 italic text-lg">
              "{variant.copy}"
            </p>
            <div className="mt-auto border-t border-[var(--color-border-card)] pt-4">
              <h4 className="text-xs font-bold text-[var(--color-foreground-muted)] uppercase mb-2 font-inter tracking-widest">Psychological Rationale</h4>
              <p className="text-sm text-[var(--color-foreground-muted)] font-inter leading-tight">
                {variant.rationale}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Module4Personalization;
