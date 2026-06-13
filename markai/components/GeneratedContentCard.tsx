
import React from 'react';
// Fix: Import types from App.tsx where they are now defined.
import { GeneratedContent } from '../types';
import { PLATFORM_DETAILS } from '../constants';
import { Wand2, Eye } from 'lucide-react';
import Spinner from './Spinner';

type ContentWithStatus = GeneratedContent & { 
  isGeneratingImage?: boolean; 
  generationError?: string | null;
};

interface GeneratedContentCardProps {
  content: ContentWithStatus;
  index: number;
  onSchedule: () => void;
  onPreview: () => void;
  onGenerateImage: (prompt: string, index: number) => void;
  isSchedulingEnabled: boolean;
  isImageGenerationEnabled: boolean;
}

const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({ content, index, onSchedule, onPreview, onGenerateImage, isSchedulingEnabled, isImageGenerationEnabled }) => {
  const platformDetail = PLATFORM_DETAILS.find(p => p.id === content.platform);
  const placeholderImageUrl = `https://picsum.photos/seed/${encodeURIComponent(content.imagePrompt)}/800/450`;
  const imageUrl = content.generatedImageUrl || placeholderImageUrl;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content.content);
  };

  return (
    <div data-testid="generated-content-card" className="bg-secondary rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-transparent hover:border-accent-primary/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {platformDetail && <platformDetail.icon className="h-8 w-8 text-accent-primary" />}
            <h3 className="text-xl font-bold ml-3 text-primary">{content.platform} Post</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPreview}
              aria-label={`Preview this ${content.platform} post`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-secondary/10 text-accent-secondary text-sm font-semibold hover:bg-accent-secondary/20 transition-colors"
            >
              <Eye className="h-5 w-5" />
              <span>Preview</span>
            </button>
            {isSchedulingEnabled && (
              <button
                onClick={onSchedule}
                aria-label={`Schedule this ${content.platform} post`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-sm font-semibold hover:bg-accent-primary/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Schedule</span>
              </button>
            )}
            <button 
              onClick={copyToClipboard}
              aria-label="Copy content to clipboard"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-secondary hover:text-accent-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7">
            {content.platform === 'Email' && content.variants && content.variants.length > 0 && (
                <div className="mb-5 p-4 rounded-xl border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
                    <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Suggested Subject Lines (A/B Test)</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {content.variants.map((variant, i) => <li key={i}>{variant}</li>)}
                    </ul>
                </div>
            )}
            <p className="text-secondary whitespace-pre-wrap leading-relaxed max-w-prose">{content.content}</p>
          </div>
          <div className="md:col-span-5 space-y-3">
            <div className="aspect-w-16 aspect-h-9 relative">
              <img src={imageUrl} alt={content.imagePrompt} className="rounded-lg object-cover w-full h-full" />
              {content.isGeneratingImage && (
                <div className="absolute inset-0 bg-secondary/80 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                  <Spinner className="w-10 h-10 text-accent-primary" />
                  <p className="mt-2 text-sm font-semibold text-secondary">Generating...</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="text-xs text-secondary italic">
                Suggested Image: "{content.imagePrompt}"
              </p>
              {isImageGenerationEnabled && (
                <button
                  onClick={() => onGenerateImage(content.imagePrompt, index)}
                  disabled={content.isGeneratingImage}
                  className="mt-2 flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-accent-secondary/10 text-accent-secondary text-sm font-semibold hover:bg-accent-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {content.isGeneratingImage ? <Spinner className="w-4 h-4" /> : <Wand2 className="h-4 w-4" />}
                  <span>Generate Image</span>
                </button>
              )}
              {content.generationError && <p className="text-xs text-red-500 mt-2">{content.generationError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedContentCard;