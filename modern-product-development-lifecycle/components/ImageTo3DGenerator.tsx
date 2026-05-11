import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { SparklesIcon, ArrowUpTrayIcon } from './icons';

interface ImageTo3DGeneratorProps {
    projectName: string;
}

const ImageTo3DGenerator: React.FC<ImageTo3DGeneratorProps> = ({ projectName }) => {
    const [prompt, setPrompt] = useState('');
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imageMimeType, setImageMimeType] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    useEffect(() => {
        if (projectName) {
            setPrompt(`Refine the 3D model of ${projectName}.`);
        }
    }, [projectName]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file (PNG, JPG, etc.).');
            return;
        }

        setError(null);
        setPreviewUrl(URL.createObjectURL(file));
        setImageMimeType(file.type);

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setImageBase64(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageBase64 || !imageMimeType) {
            setError('Please upload an image first.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

            const imagePart = {
                inlineData: {
                    mimeType: imageMimeType,
                    data: imageBase64,
                },
            };
            
            const textContent = `Based on the provided image, generate a photorealistic 3D model rendering. ${prompt}. The model should be on a plain white studio background.`;
            const textPart = { text: textContent };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [imagePart, textPart] },
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
                AI-Powered 3D Model from Image
            </h3>
            <p className="text-slate-600 dark:text-slate-400 hc:text-yellow-300/80 mb-6">Upload a sketch or photo, and our AI will interpret it to generate a 3D model concept. Add a text prompt to refine the result.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <label className={`flex justify-center w-full h-32 px-4 transition bg-white dark:bg-slate-800 hc:bg-black border-2 ${error ? 'border-red-500/50' : 'border-slate-300 dark:border-slate-700/80 hc:border-yellow-300/50'} border-dashed rounded-md appearance-none cursor-pointer hover:border-sky-500/80 hc:hover:border-yellow-400/80 focus:outline-none`}>
                    <span className="flex items-center space-x-2">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="h-28 w-auto object-contain py-2"/>
                        ) : (
                            <>
                                <ArrowUpTrayIcon className="w-6 h-6 text-slate-500 dark:text-slate-500 hc:text-yellow-300/60" />
                                <span className="font-medium text-slate-500 dark:text-slate-500 hc:text-yellow-300/60">
                                    Drop an image or <span className="text-sky-500 hc:text-yellow-300 underline">browse</span>
                                </span>
                            </>
                        )}
                    </span>
                    <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Optional: add details, e.g., 'make it metallic red'"
                    className="w-full h-24 p-3 bg-white dark:bg-slate-800 hc:bg-black border border-slate-300 dark:border-slate-700 hc:border-yellow-300/60 rounded-lg text-slate-800 dark:text-slate-300 hc:text-yellow-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 hc:focus:ring-yellow-300 hc:focus:border-yellow-300 transition"
                    disabled={loading}
                    aria-label="Optional refinement prompt"
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hc:bg-yellow-300 hc:text-black hc:hover:bg-yellow-400"
                    disabled={loading || !imageBase64}
                >
                    {loading ? 'Generating...' : 'Generate from Image'}
                </button>
            </form>

            {error && !previewUrl && <p role="alert" className="mt-4 text-red-500 dark:text-red-400 hc:text-red-400">{error}</p>}

            <div className="mt-8">
                {loading && (
                    <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 hc:bg-black hc:border hc:border-yellow-300/50 rounded-lg animate-pulse flex items-center justify-center">
                         <p className="text-slate-500 dark:text-slate-500 hc:text-yellow-300/60">Generating your 3D model...</p>
                    </div>
                )}
                {generatedImage && (
                    <div className="bg-slate-100 dark:bg-slate-800/60 hc:bg-black p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 hc:border-yellow-300/50">
                        <img src={generatedImage} alt="Generated 3D model from image" className="w-full h-auto object-contain rounded-lg" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageTo3DGenerator;