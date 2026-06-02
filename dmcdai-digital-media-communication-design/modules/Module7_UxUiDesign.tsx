import React, { useState } from 'react';
import { generateUiFromPrompt } from '../services/geminiService';
import { Loader } from '../components/Loader';
import type { UiComponent } from '../types';

const renderUiComponent = (component: UiComponent, key: string): React.ReactNode => {
    const { type, props, children, content } = component;
    const tailwindMap: Record<string, string> = {
        container: 'p-4 border border-dashed border-[var(--color-border-card)] rounded-md flex flex-col gap-4',
        text: 'text-[var(--color-foreground-muted)] font-inter',
        button: 'bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] px-4 py-2 rounded-md hover:bg-[#b6963a] font-semibold font-inter',
        input: 'bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-[var(--color-foreground)] w-full font-inter',
        image: 'bg-[var(--color-background-card-hover)] rounded-md h-32 w-full flex items-center justify-center text-[var(--color-foreground-muted)] font-inter',
    };
 
    const className = `${tailwindMap[type] || ''} ${props?.className || ''}`;
 
    if (type === 'image') {
        return <div key={key} className={className}>🖼️ Placeholder Image</div>;
    }
 
    const elementChildren = children ? children.map((child, index) => renderUiComponent(child, `${key}-${index}`)) : content;
 
    return React.createElement(
        type === 'container' ? 'div' : type,
        { ...props, key, className },
        elementChildren
    );
};
 
const examplePrompts = [
  'A login screen with social media buttons for a new app.',
  'A music player interface with album art and controls.',
  'A dashboard widget for tracking fitness goals.',
  'An onboarding screen for a productivity application.',
];
 
const Module7UxUiDesign: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A user profile screen for a music app. It should show a profile picture, username, a "Follow" button, and stats for followers and following.');
  const [uiTree, setUiTree] = useState<UiComponent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
 
  const handleGenerate = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setIsLoading(true);
    setError('');
    setUiTree(null);
    try {
      const tree = await generateUiFromPrompt(prompt);
      setUiTree(tree);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('API Rate limit reached. Designing complex UIs takes significant resources. Please wait 60 seconds and try again.');
      } else if (err.message === 'SAFETY_BLOCK') {
        setError('Your UI prompt was flagged by the safety filters. Please refine your description and try again.');
      } else if (err.message === 'INVALID_KEY') {
        setError('Invalid API Key. Please check your institutional configuration.');
      } else if (err.message === 'MODEL_NOT_FOUND') {
        setError('The specified AI model was not found. The institutional API profile is being synchronized. Please try again in a few moments.');
      } else if (err.message === 'GATEWAY_TIMEOUT') {
        setError('The AI service is taking longer than expected to respond. This can happen during peak hours. Please try a simpler prompt.');
      } else {
        setError('An unexpected error occurred while generating the UI. Please check the console.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };
  
  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };
 
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg mb-8">
        <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
          UI Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A login screen for a retro gaming website"
          className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 resize-none h-24 font-inter"
          aria-label="Enter description for UI wireframe generation"
        />
        <div className="mt-4">
          <p className="text-xs text-[var(--color-foreground-muted)] mb-2 font-inter">Or try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(p)}
                aria-label={`Use example prompt: ${p}`}
                title={`Click to use: ${p}`}
                className="text-xs bg-[var(--color-background-card-hover)] border border-[var(--color-border-card)] text-[var(--color-foreground-muted)] px-3 py-1 rounded-full hover:bg-[var(--color-background-card-hover)] hover:text-[var(--color-foreground)] transition-colors font-inter"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label={isLoading ? "AI is designing your interface" : "Start AI UX/UI design process"}
          title="Click to generate UI wireframe component"
          className="mt-6 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed text-[var(--color-foreground-on-primary)] font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center font-inter"
        >
          {isLoading ? 'Generating Wireframe...' : 'Generate UI Wireframe'}
        </button>
      </div>
 
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] min-h-[30rem]">
        <h3 className="text-xl font-semibold mb-4 text-[var(--color-foreground)] text-center font-playfair">Generated Wireframe</h3>
        <div className="bg-[var(--color-background-main)] p-4 sm:p-8 rounded-md" aria-live="polite">
          {error && <p className="text-center text-red-400 font-inter">{error}</p>}
          {isLoading && <Loader text="Designing user experience..." />}
          {uiTree ? (
            <div className="w-full max-w-sm mx-auto animate-fade-in">
              {renderUiComponent(uiTree, 'root')}
            </div>
          ) : (
            !isLoading && <p className="text-center text-[var(--color-foreground-muted)] py-20">Your generated UI will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module7UxUiDesign;
