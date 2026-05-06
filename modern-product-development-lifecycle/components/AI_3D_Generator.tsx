import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SparklesIcon } from './icons';

interface AI_3D_GeneratorProps {
    projectName: string;
}

const AI_3D_Generator: React.FC<AI_3D_GeneratorProps> = ({ projectName }) => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    useEffect(() => {
        if (projectName) {
            setPrompt(projectName);
        }
    }, [projectName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            setError('Please enter a description.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { text: `A photorealistic 3D model rendering of ${prompt}, on a plain white studio background.` },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            let imageUrl: string | null = null;
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                        break; 
                    }
                }
            }
            
            if (imageUrl) {
                setGeneratedImage(imageUrl);
            } else {
                throw new Error('No image data received from the API. The response may have been blocked.');
            }

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50 pt-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white hc:text-yellow-300 mb-2 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-sky-500 dark:text-sky-400 hc:text-yellow-300" />
                AI-Powered 3D Model Generation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mb-6">Describe a product, and our AI will generate a 3D model concept for you. This tool leverages generative AI to quickly visualize ideas, accelerating the prototyping process.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., a retro-style toaster in pastel blue with chrome accents"
                    className="w-full h-24 p-3 bg-white dark:bg-slate-800 hc:bg-black border border-slate-300 dark:border-slate-700 hc:border-yellow-300/60 rounded-lg text-slate-800 dark:text-slate-300 hc:text-yellow-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hc:focus:ring-yellow-300 hc:focus:border-yellow-300 transition"
                    disabled={loading}
                    aria-label="Product description for 3D model"
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hc:bg-yellow-300 hc:text-black hc:hover:bg-yellow-400"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Model'}
                </button>
            </form>

            {error && <p role="alert" className="mt-4 text-red-500 dark:text-red-400 hc:text-red-400">{error}</p>}

            <div className="mt-8">
                {loading && (
                    <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 hc:bg-black hc:border hc:border-yellow-300/50 rounded-lg animate-pulse flex items-center justify-center">
                         <p className="text-slate-500 dark:text-slate-500 hc:text-yellow-300/60">Generating your 3D model...</p>
                    </div>
                )}
                {generatedImage && (
                    <div className="bg-slate-100 dark:bg-slate-800/60 hc:bg-black p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50">
                        <img src={generatedImage} alt="Generated 3D model" className="w-full h-auto object-contain rounded-lg" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AI_3D_Generator;