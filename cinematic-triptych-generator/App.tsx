
import React, { useState, useCallback } from 'react';
import { sceneData, variationOptions, imageFileNames, panelDetails } from './constants';
import { generateImageFromPrompt } from './services/geminiService';
import TriptychPanel from './components/TriptychPanel';
import { DownloadIcon } from './components/Icons';
import { RefreshStatus } from './components/RefreshStatus';
import { PanelDetail } from './types';
import { RefreshCw } from 'lucide-react';
import AuditService from './services/AuditService';

// Let TypeScript know JSZip is available globally from the CDN script
declare const JSZip: any;

type View = 'generator' | 'refresh';

const App: React.FC = () => {
    const [view, setView] = useState<View>('generator');
    const [images, setImages] = useState<(string | null)[]>([null, null, null]);
    const [loading, setLoading] = useState<boolean[]>([false, false, false]);
    const [isZipping, setIsZipping] = useState<boolean>(false);

    const [lighting, setLighting] = useState(variationOptions.lighting[0]);
    const [colorPalette, setColorPalette] = useState(variationOptions.color_palette[0]);
    const [lens, setLens] = useState(variationOptions.lens[0]);

    const downloadImage = (href: string, filename: string) => {
        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const createPromptId = (promptName: string): string => {
        return `${new Date().toISOString()}-${promptName}`;
    };

    const generateDynamicPrompt = useCallback((panelIndex: number): string => {
        const basePrompts = [
            `A dynamic, film-grade wide shot from an ARRIFLEX camera using a ${lens} of an ${sceneData.subject.description} flying mid-air in a ${sceneData.scene.location}. Ingredients are captured slicing through the air in 1500fps slow-motion. The lighting is ${lighting}, creating a ${sceneData.cinematography.tone} tone with a colour palette of ${colorPalette}. prompt_id: ${createPromptId('sushi-wide')}`,
            `An extreme close-up, Panavision high fidelity shot using a ${lens} capturing a ${sceneData.visual_details.special_effects} as sashimi slices in the air. Dripping soy sauce creates splash trails amidst a blast of vapor mist. The lighting is ${lighting}, highlighting its freshness. The tone is aggressive and premium with a colour palette of ${colorPalette}. prompt_id: ${createPromptId('sushi-detail')}`,
            `An abstract, atmospheric shot from a Red KOMODO camera using a ${lens}, focusing on the interplay of light and texture. ${lighting} cuts through ${sceneData.scene.environment} against a high-gloss black background. Neon edges of ${colorPalette} define the shapes of ${sceneData.subject.props}. The mood is premium, punchy, and ultra-fresh. prompt_id: ${createPromptId('sushi-atmospheric')}`
        ];
        return basePrompts[panelIndex];
    }, [lighting, colorPalette, lens]);

    const handleGenerateImage = useCallback(async (panelIndex: number) => {
        setLoading(prev => {
            const newLoading = [...prev];
            newLoading[panelIndex] = true;
            return newLoading;
        });

        const prompt = generateDynamicPrompt(panelIndex);
        AuditService.log('GENERATION_START', `Initiating cinematic panel ${panelIndex + 1} generation`, 'INFO');

        try {
            const imageUrl = await generateImageFromPrompt(prompt);
            setImages(prev => {
                const newImages = [...prev];
                newImages[panelIndex] = imageUrl;
                return newImages;
            });
            downloadImage(imageUrl, imageFileNames[panelIndex]);
            AuditService.log('GENERATION_SUCCESS', `Panel ${panelIndex + 1} finalized and downloaded`, 'SUCCESS');
        } catch (error) {
            console.error("Error generating image:", error);
            AuditService.log('GENERATION_ERROR', error instanceof Error ? error.message : 'Unknown generation failure', 'ERROR');
            alert(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(prev => {
                const newLoading = [...prev];
                newLoading[panelIndex] = false;
                return newLoading;
            });
        }
    }, [generateDynamicPrompt]);

    const handleDownloadAll = async () => {
        if (typeof JSZip === 'undefined') {
            console.error("JSZip library is not loaded.");
            alert("Download feature is currently unavailable. Please try again later.");
            return;
        }

        setIsZipping(true);
        try {
            const zip = new JSZip();
            let imageCount = 0;
            images.forEach((image, index) => {
                if (image) {
                    imageCount++;
                    const base64Data = image.split(',')[1];
                    zip.file(imageFileNames[index], base64Data, { base64: true });
                }
            });

            if (imageCount > 0) {
                const content = await zip.generateAsync({ type: 'blob' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'cinematic-triptych.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            } else {
                alert("No images to download. Please generate some images first.");
            }
        } catch (error) {
            console.error("Error creating zip file:", error);
            alert("Error creating zip file. Please try again.");
        } finally {
            setIsZipping(false);
        }
    };

    const hasGeneratedImages = images.some(img => img !== null);

    return (
        <div className="min-h-screen w-full bg-stone-950 p-4 font-sans text-stone-200 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-amber-500/20 pb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold tracking-tight text-amber-500 sm:text-5xl uppercase italic leading-none">
                            Cinematic Triptych
                        </h1>
                        <p className="mt-2 text-stone-400 font-medium tracking-widest uppercase text-xs">
                            Institutional Storyboarding Suite v3.0.0
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setView(view === 'generator' ? 'refresh' : 'generator')}
                        className="flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 border-2 border-amber-500/30 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all group shadow-lg shadow-amber-500/5"
                    >
                        <RefreshCw size={16} className={`group-hover:animate-spin-slow text-amber-500 ${view === 'refresh' ? 'animate-spin-slow' : ''}`} />
                        <span>{view === 'generator' ? 'Refresh Protocol' : 'Back to Generator'}</span>
                    </button>
                </header>

                <main>
                    {view === 'refresh' ? (
                        <RefreshStatus onBack={() => setView('generator')} />
                    ) : (
                        <>
                            <div className="mb-8 rounded-lg border border-stone-800 bg-stone-900 p-6 shadow-2xl shadow-black/20">
                                <h2 className="mb-4 text-2xl font-bold text-amber-500">Visual Style Variations</h2>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="lighting" className="mb-2 block text-sm font-medium text-stone-300">Lighting Style</label>
                                        <select id="lighting" value={lighting} onChange={(e) => setLighting(e.target.value)} className="w-full rounded-md border-stone-700 bg-stone-800 text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
                                            {variationOptions.lighting.map(opt => <option key={opt} value={opt}>{opt.split(',')[0]}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="colorPalette" className="mb-2 block text-sm font-medium text-stone-300">Colour Palette</label>
                                        <select id="colorPalette" value={colorPalette} onChange={(e) => setColorPalette(e.target.value)} className="w-full rounded-md border-stone-700 bg-stone-800 text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
                                            {variationOptions.color_palette.map(opt => <option key={opt} value={opt}>{opt.split(',')[0]}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="lens" className="mb-2 block text-sm font-medium text-stone-300">Camera Lens</label>
                                        <select id="lens" value={lens} onChange={(e) => setLens(e.target.value)} className="w-full rounded-md border-stone-700 bg-stone-800 text-white shadow-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50">
                                            {variationOptions.lens.map(opt => <option key={opt} value={opt}>{opt.split(' with')[0]}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {panelDetails.map((panel: PanelDetail, index: number) => (
                                    <TriptychPanel
                                        key={panel.title}
                                        title={panel.title}
                                        description={panel.description}
                                        imageUrl={images[index]}
                                        isLoading={loading[index]}
                                        onGenerate={() => handleGenerateImage(index)}
                                    />
                                ))}
                            </div>

                            {hasGeneratedImages && (
                                <div className="mt-12 text-center">
                                    <button
                                        onClick={handleDownloadAll}
                                        disabled={isZipping}
                                        className="inline-flex items-center justify-center rounded-md bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
                                    >
                                        <DownloadIcon />
                                        {isZipping ? 'Zipping...' : 'Download All as .zip'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
                <footer className="mt-12 text-center text-sm text-stone-500">
                    <p>Powered by Google Gemini. Using film-grade camera styles for premium quality.</p>
                    <p>Each output is stored for quality assurance and prompt adherence validation.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
