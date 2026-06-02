import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Loader } from '../components/Loader';

const defaultPrompt = 'A synthwave-style illustration of a designer working at a futuristic desk, with glowing holographic interfaces';

const Module1VisualDesign: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(defaultPrompt);
   const [inspirationImage, setInspirationImage] = useState<{
    file: File;
    dataUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File is too large. Please upload an image under 10MB.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const base64String = result.split(',')[1];
            setInspirationImage({
                file: file,
                dataUrl: result,
                base64: base64String,
                mimeType: file.type,
            });
            setPrompt(''); // Clear prompt to encourage a new one
            setError('');
        };
        reader.onerror = () => {
            setError('Failed to read the image file.');
        }
        reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setInspirationImage(null);
    setPrompt(defaultPrompt);
  }

  const handleGenerate = async () => {
    if (!prompt && inspirationImage) {
        setError('Please enter a prompt to describe what to do with the image.');
        return;
    }
     if (!prompt && !inspirationImage) {
      setError('Please enter a prompt or upload an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setImageUrl('');
    try {
      const url = await generateImage(
        prompt,
        inspirationImage?.base64,
        inspirationImage?.mimeType
      );
      if (url) {
        setImageUrl(url);
      } else {
        setError('Failed to generate image. The API may have returned an empty response.');
      }
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        setError('API Rate limit reached. The Free Tier allows limited requests per minute. Please wait 60 seconds and try again.');
      } else if (err.message === 'SAFETY_BLOCK') {
        setError('Your prompt was flagged by the safety filters. Please rephrase and try again.');
      } else if (err.message === 'INVALID_KEY') {
        setError('Invalid API Key. Please check your institutional configuration.');
      } else if (err.message === 'MODEL_NOT_FOUND') {
        setError('The specified AI model was not found. The institutional API profile is being synchronized. Please try again in a few moments.');
      } else if (err.message === 'GATEWAY_TIMEOUT') {
        setError('The AI service is taking longer than expected to respond. This can happen during peak hours. Please try a simpler prompt.');
      } else {
        setError('An unexpected error occurred. Please check the console for details.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[var(--color-background-card)] p-6 rounded-lg border border-[var(--color-border-card)] shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">
                    Image Prompt
                </label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={inspirationImage ? "e.g., Turn this into a watercolour painting" : "e.g., A logo for 'ByteBloom'"}
                    className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-3 text-[var(--color-foreground)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition duration-200 resize-none h-40"
                    aria-label="Describe the image you want to generate or modify"
                />
            </div>
            <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-[var(--color-foreground-muted)] mb-2">
                    Inspiration Image <span className="text-gray-500">(Optional)</span>
                </label>
                {inspirationImage ? (
                    <div className="relative">
                        <img src={inspirationImage.dataUrl} alt="Inspiration preview" className="w-full h-40 object-cover rounded-md border border-[var(--color-border-input)]" />
                        <button 
                            onClick={handleRemoveImage} 
                            className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-black/70 transition-colors"
                            aria-label="Remove illustration"
                            title="Remove the uploaded inspiration image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="w-full h-40 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-[var(--color-border-input)] border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-[var(--color-foreground-muted)] justify-center">
                                <label 
                                    htmlFor="file-upload" 
                                    className="relative cursor-pointer bg-transparent rounded-md font-medium text-[var(--color-primary)] hover:text-[#b6963a] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-[var(--color-primary)] px-1"
                                    title="Choose a file from your computer"
                                >
                                    <span>Upload an image</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/png, image/jpeg, image/gif, image/webp" aria-label="Upload inspiration image"/>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500">Up to 10MB</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label={isLoading ? "AI is generating your image" : "Start AI image generation process"}
          title="Click to generate image based on your prompt"
          className="mt-6 w-full bg-[var(--color-primary)] hover:bg-[#b6963a] disabled:bg-[var(--color-primary)]/50 disabled:cursor-not-allowed text-[var(--color-foreground-on-primary)] font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center"
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      <div className="mt-8" aria-live="polite">
        {error && <p className="text-center text-red-400 mb-4">{error}</p>}
        {isLoading && <Loader text="Creating visual masterpiece..." />}
        {imageUrl && (
          <div className="bg-[var(--color-background-card)] p-4 rounded-lg border border-[var(--color-border-card)]">
            <h3 className="text-lg font-semibold mb-4 text-center text-[var(--color-foreground)]">Generated Image</h3>
            <img src={imageUrl} alt="Generated by AI" className="rounded-md w-full max-w-7xl mx-auto shadow-2xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Module1VisualDesign;
