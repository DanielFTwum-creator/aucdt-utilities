import React, { useState } from 'react';
import { generateAnimationFrames } from './services/geminiService';
import { useGifGenerator } from './hooks/useGifGenerator';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ErrorMessage from './components/ErrorMessage';
import FrameDisplay from './components/FrameDisplay';
import AnimationControls from './components/AnimationControls';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [frames, setFrames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [speed, setSpeed] = useState(67); // Approx 15 FPS (1000ms / 15)
    
    const { generateGif, isGeneratingGif } = useGifGenerator();

    const handleDownloadGif = async () => {
        try {
            await generateGif(frames, speed, prompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate GIF');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setFrames([]);

        try {
            const generatedFrames = await generateAnimationFrames(prompt);
            setFrames(generatedFrames);
            // Auto-download after generation
            setTimeout(() => handleDownloadGif(), 100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
            <div className="w-full max-w-4xl mx-auto">
                <Header />

                <main>
                    <PromptInput
                        prompt={prompt}
                        isLoading={isLoading}
                        onPromptChange={setPrompt}
                        onSubmit={handleSubmit}
                    />

                    <ErrorMessage error={error} />

                    <FrameDisplay
                        frames={frames}
                        speed={speed}
                        isLoading={isLoading}
                    />
                    
                    <AnimationControls
                        frames={frames}
                        speed={speed}
                        isGeneratingGif={isGeneratingGif}
                        onSpeedChange={setSpeed}
                        onDownloadGif={handleDownloadGif}
                    />
                </main>
            </div>
        </div>
    );
};

export default App;

