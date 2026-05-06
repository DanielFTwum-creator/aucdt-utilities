import React, { useState, useCallback } from 'react';
import { SparkleIcon, ClipboardIcon, GridIcon, XIcon, CheckIcon } from '../constants';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type CustomSource = 'ai' | 'paste' | 'library';

interface CustomShapeCreatorProps {
    shape: string;
    setShape: (shape: 'custom') => void;
    customSvgPath: string | null;
    setCustomSvgPath: (path: string | null) => void;
    setIsPristine: (isPristine: boolean) => void;
    onBrowseLibrary: () => void;
}

const CustomShapeCreator: React.FC<CustomShapeCreatorProps> = ({
    setShape,
    customSvgPath,
    setCustomSvgPath,
    setIsPristine,
    onBrowseLibrary,
}) => {
    const [customMode, setCustomMode] = useState<'ai' | 'paste' | null>(null);
    const [activeCustomSource, setActiveCustomSource] = useState<CustomSource | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingShape, setIsGeneratingShape] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [pasteError, setPasteError] = useState<string | null>(null);
    const generationRequestRef = React.useRef(0);
    const [isCopied, setIsCopied] = useState(false);

    const handleCustomModeClick = useCallback((mode: 'ai' | 'paste') => {
        setShape('custom');
        setCustomMode(mode);
        setActiveCustomSource(mode);
        if (!customSvgPath || activeCustomSource !== mode) {
            setIsPristine(true);
        } else {
            setIsPristine(false);
        }
    }, [customSvgPath, activeCustomSource, setShape, setIsPristine]);

    const handleBrowseLibraryClick = () => {
        setActiveCustomSource('library');
        onBrowseLibrary();
    };
    
    const handleStopGenerating = useCallback(() => {
        generationRequestRef.current++;
        setIsGeneratingShape(false);
        setGenerationError(null);
    }, []);

    const handleGenerateShape = async () => {
        if (!aiPrompt.trim()) {
            alert("Please describe the shape you want to generate.");
            return;
        }
        
        const currentRequestId = ++generationRequestRef.current;
        setIsGeneratingShape(true);
        setGenerationError(null);
        setCustomSvgPath(null);
        setActiveCustomSource('ai');
        try {
            const prompt = `You are an expert SVG path generator. Create a single, closed SVG path data string (the 'd' attribute value) for a shape representing "${aiPrompt}". The path must fit entirely within a 500x500 viewBox and should be centered. Do not provide any other text, explanation, or markdown. Only the raw path data string.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            if (generationRequestRef.current === currentRequestId) {
                const pathData = response.text.trim();
                if (!/^[Mm]/.test(pathData)) {
                    throw new Error("Invalid SVG path generated. Please try a different prompt.");
                }
                setCustomSvgPath(pathData);
                setIsPristine(false);
            }
        } catch (error) {
            if (generationRequestRef.current === currentRequestId) {
                console.error("Shape generation error:", error);
                setGenerationError(error instanceof Error ? error.message : "An unknown error occurred.");
                setCustomSvgPath(null);
            }
        } finally {
            if (generationRequestRef.current === currentRequestId) {
                setIsGeneratingShape(false);
            }
        }
    };

    const handlePastedPathChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const pathData = e.target.value;
        setPasteError(null);
        setActiveCustomSource('paste');
        if (pathData && !/^[Mm]/.test(pathData.trim())) {
            setPasteError("Invalid SVG path. Must start with 'M' or 'm'.");
            setCustomSvgPath(null);
            setIsPristine(true);
        } else {
            setCustomSvgPath(pathData.trim() || null);
            setIsPristine(!pathData.trim());
        }
    };

    const handleCopyPath = useCallback(() => {
        if (!customSvgPath) return;
        navigator.clipboard.writeText(customSvgPath).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        });
    }, [customSvgPath]);


    return (
        <div>
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 hc-text">Or Create a Custom Shape</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => handleCustomModeClick('ai')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${activeCustomSource === 'ai' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'}`} title="Generate a custom shape using an AI prompt">
                    <SparkleIcon className="h-5 w-5" />
                    <span className="font-medium text-sm">Generate</span>
                </button>
                <button onClick={() => handleCustomModeClick('paste')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${activeCustomSource === 'paste' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'}`} title="Paste a custom SVG path to use as a shape">
                    <ClipboardIcon className="h-5 w-5" />
                    <span className="font-medium text-sm">Paste Path</span>
                </button>
                <button onClick={handleBrowseLibraryClick} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${activeCustomSource === 'library' ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-600 text-purple-800 dark:text-purple-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'}`} title="Browse icon library for a shape">
                    <GridIcon />
                    <span className="font-medium text-sm">Library</span>
                </button>
            </div>
            {customMode === 'ai' && (
                <div className="mt-4 space-y-3">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., a fluffy cloud, a running cat"
                        className="hc-bg hc-border hc-text hc-placeholder block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        disabled={isGeneratingShape}
                        title="Describe the shape you want to generate"
                    />
                    {isGeneratingShape ? (
                        <button onClick={handleStopGenerating} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors" title="Stop generating the shape">
                            <XIcon className="h-5 w-5" />
                            Stop Generating
                        </button>
                    ) : (
                        <button onClick={handleGenerateShape} disabled={!aiPrompt.trim()} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors" title="Generate shape from your description">
                            <SparkleIcon className="h-5 w-5" />
                            Generate Shape
                        </button>
                    )}
                    <div aria-live="polite">
                        {isGeneratingShape && <p className="text-sm text-gray-600 dark:text-gray-300">Generating, please wait...</p>}
                        {generationError && <p className="text-sm text-red-600 dark:text-red-400">{generationError}</p>}
                    </div>
                </div>
            )}
            {customMode === 'paste' && (
                <div className="mt-4 relative">
                    <label htmlFor="svg-path-input" className="sr-only">Paste SVG Path Data</label>
                    <textarea
                        id="svg-path-input"
                        value={customSvgPath || ''}
                        onChange={handlePastedPathChange}
                        placeholder="Paste your SVG path data here (e.g., M10 80 C ...)"
                        className="hc-bg hc-border hc-text hc-placeholder block w-full h-28 px-3 py-2 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm resize-y"
                        title="Paste SVG path data"
                    />
                    <button onClick={handleCopyPath} disabled={!customSvgPath} className="absolute top-2 right-2 p-1.5 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:text-gray-300 dark:disabled:text-gray-500 disabled:hover:bg-transparent" title={isCopied ? "Copied!" : "Copy SVG Path"}>
                        {isCopied ? <CheckIcon className="h-5 w-5 text-green-600" /> : <ClipboardIcon className="h-5 w-5" />}
                    </button>
                    {pasteError && <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">{pasteError}</p>}
                    {isCopied && <div className="sr-only" role="alert">SVG path copied to clipboard.</div>}
                </div>
            )}
        </div>
    );
};

export default CustomShapeCreator;
