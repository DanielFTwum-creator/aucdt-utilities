import React, { useState } from 'react';
import { generateText } from '../services/geminiService';
import { Loader } from '../components/Loader';

const Module3ContentCreation: React.FC = () => {
  const [topic, setTopic] = useState<string>('The impact of AI on typography in 2025');
  const [contentType, setContentType] = useState<string>('blog post');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedContent('');
    try {
      const prompt = `Generate a compelling ${contentType} about "${topic}". The tone should be professional, insightful, and engaging for a design student audience. Format the output with markdown for readability, including headings and bullet points where appropriate.`;
      const content = await generateText(prompt);
      setGeneratedContent(content);
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('API Rate limit reached. The Free Tier allows limited requests per minute. Please wait 60 seconds and try again.');
      } else if (err.message === 'SAFETY_BLOCK') {
        setError('Your prompt was flagged by the safety filters. Please rephrase and try again.');
      } else if (err.message === 'INVALID_KEY') {
        setError('Invalid API Key. Please check your institutional configuration.');
      } else {
        setError('An unexpected error occurred. Please check the console for details.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
            <label htmlFor="topic" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
              Topic / Idea
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Sustainable branding strategies"
              className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 font-inter"
              aria-label="Enter the topic or idea for content generation"
            />
        </div>
        <div>
           <label htmlFor="contentType" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2 font-inter">
              Content Type
            </label>
            <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 font-inter"
                aria-label="Select the type of content to generate"
            >
                <option>blog post</option>
                <option>social media update</option>
                <option>ad campaign concept</option>
                <option>video script idea</option>
            </select>
        </div>
        <div className="md:col-span-3">
             <button
              onClick={handleGenerate}
              disabled={isLoading}
              aria-label={isLoading ? "AI is crafting your content" : "Start AI content creation process"}
              title="Click to generate content based on your topic"
              className="mt-2 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed text-[var(--color-foreground-on-primary)] font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center font-inter"
            >
              {isLoading ? 'Generating...' : 'Generate Content'}
            </button>
        </div>
      </div>

      <div className="mt-8" aria-live="polite">
        {error && <p className="text-center text-red-400 font-inter">{error}</p>}
        {isLoading && <Loader text="Crafting content..." />}
        {generatedContent && (
          <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)]">
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-foreground)] font-playfair">Generated {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h3>
            <div
              className="prose prose-invert max-w-none prose-p:text-[var(--color-foreground-muted)] prose-headings:text-[var(--color-foreground)]"
              dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br />') }} // Simple markdown rendering for demo
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Module3ContentCreation;
