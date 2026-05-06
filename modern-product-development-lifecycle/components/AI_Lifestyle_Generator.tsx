import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons';

interface AI_Lifestyle_GeneratorProps {
    projectName: string;
}

const AI_Lifestyle_Generator: React.FC<AI_Lifestyle_GeneratorProps> = ({ projectName }) => {
    const [product, setProduct] = useState('');
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);

    useEffect(() => {
        if (projectName) {
            setProduct(projectName);
        }
    }, [projectName]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product.trim() || !context.trim()) {
            setError('Please describe both the product and the context.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `High-resolution lifestyle photograph of ${product} being used in ${context}. The image should be aspirational, professionally shot, and have ample negative space for text overlays.`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt,
                config: {
                  numberOfImages: 4,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '16:9',
                },
            });
            
            const images = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
            if (images.length > 0) {
                 setGeneratedImages(images);
            } else {
                throw new Error('No images were generated. The prompt may have been blocked.');
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
                AI-Powered Lifestyle Image Generation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mb-6">Create compelling marketing visuals. Describe your product and a setting, and our AI will generate a set of high-resolution lifestyle images ready for your campaign.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input
                        type="text"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        placeholder="Product: e.g., a sleek wireless earbud case"
                        className="w-full p-3 bg-white dark:bg-slate-800 hc:bg-black border border-slate-300 dark:border-slate-700 hc:border-yellow-300/60 rounded-lg text-slate-800 dark:text-slate-300 hc:text-yellow-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hc:focus:ring-yellow-300 hc:focus:border-yellow-300 transition"
                        disabled={loading}
                        aria-label="Product description"
                    />
                    <input
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Context: e.g., on a wooden desk next to a laptop"
                        className="w-full p-3 bg-white dark:bg-slate-800 hc:bg-black border border-slate-300 dark:border-slate-700 hc:border-yellow-300/60 rounded-lg text-slate-800 dark:text-slate-300 hc:text-yellow-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hc:focus:ring-yellow-300 hc:focus:border-yellow-300 transition"
                        disabled={loading}
                        aria-label="Image context"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hc:bg-yellow-300 hc:text-black hc:hover:bg-yellow-400"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Images'}
                </button>
            </form>

            {error && <p role="alert" className="mt-4 text-red-500 dark:text-red-400 hc:text-red-400">{error}</p>}
            
            <div className="mt-8">
                 {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-full aspect-video bg-slate-200 dark:bg-slate-800 hc:bg-black hc:border hc:border-yellow-300/50 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                )}
                {generatedImages.length > 0 && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {generatedImages.map((src, index) => (
                             <div key={index} className="bg-slate-100 dark:bg-slate-800/60 hc:bg-black p-2 rounded-xl border border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50 transform transition-transform duration-300 hover:scale-105">
                                <img src={src} alt={`Generated lifestyle image ${index + 1}`} className="w-full h-auto object-cover rounded-lg" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AI_Lifestyle_Generator;