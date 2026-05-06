// Fix: Add React import for React types.
import React, { useState, useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { GoogleGenAI } from "@google/genai";
import { ShapeId, ClippingMode, CustomShapeSource, MediaSource, OutlineStyle } from '../types';
import { drawClippedImage } from '../utils/canvas';
import { ICON_LIBRARY } from '../icon-library';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type DownloadFormat = 'png' | 'pdf';
interface DownloadOptions {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    image: MediaSource | null;
    shape: ShapeId;
    clippingMode: ClippingMode;
    outlineColor: string;
    outlineThickness: number;
    zoom: number;
    offset: { x: number, y: number };
    customSvgPath: string | null;
    outlineStyle: OutlineStyle;
}

export const useCustomShape = (setError: (msg: string | null) => void) => {
    // Shape & Style State
    const [shape, setShape] = useState<ShapeId>('circle');
    const [clippingMode, setClippingMode] = useState<ClippingMode>('fill');
    const [outlineColor, setOutlineColor] = useState('#7c3aed');
    const [outlineThickness, setOutlineThickness] = useState(10);
    const [outlineStyle, setOutlineStyle] = useState<OutlineStyle>('solid');
    const [customSvgPath, setCustomSvgPath] = useState<string | null>(null);
    const [isPristine, setIsPristine] = useState(true);

    // Custom Shape UI State
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [customMode, setCustomMode] = useState<'ai' | 'paste' | null>(null);
    const [activeCustomSource, setActiveCustomSource] = useState<CustomShapeSource | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGeneratingShape, setIsGeneratingShape] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [pasteError, setPasteError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const generationRequestRef = useRef(0);
    const svgShapeFileInputRef = useRef<HTMLInputElement>(null);

    const handleShapeSelect = useCallback((newShape: ShapeId) => {
        setIsPristine(false);

        if (newShape === 'more') {
            setIsLibraryOpen(true);
            return; // Don't change the current shape, just open the modal.
        }

        const libraryIcon = ICON_LIBRARY.find(icon => icon.name === newShape);
        
        if (libraryIcon) {
            setShape(newShape);
            setCustomSvgPath(libraryIcon.path);
            setActiveCustomSource(null); 
            setCustomMode(null);
        } else { // It's a geometric shape or 'custom'
            setShape(newShape);
            setCustomSvgPath(null); // Clear path for geometric shapes
            if (newShape !== 'custom') {
                setActiveCustomSource(null);
                setCustomMode(null);
            } else {
                 if (!customMode) {
                    setCustomMode('ai');
                    setActiveCustomSource('ai');
                }
            }
        }
    }, [customMode]);

    const handleClippingModeChange = useCallback((mode: ClippingMode) => {
        setClippingMode(mode);
        setIsPristine(false); 
    }, []);

    const handleOutlineColorChange = useCallback((color: string) => {
        setOutlineColor(color);
        setIsPristine(false);
    }, []);

    const handleOutlineThicknessChange = useCallback((thickness: number) => {
        setOutlineThickness(thickness);
        setIsPristine(false);
    }, []);

    const handleOutlineStyleChange = useCallback((style: OutlineStyle) => {
        setOutlineStyle(style);
        setIsPristine(false);
    }, []);

    const handleCustomModeClick = useCallback((mode: 'ai' | 'paste') => {
        setShape('custom');
        setCustomMode(mode);
        setActiveCustomSource(mode);
        if (!customSvgPath || activeCustomSource !== mode) setIsPristine(true);
        else setIsPristine(false);
    }, [customSvgPath, activeCustomSource]);

    const handleUploadButtonClick = useCallback(() => {
        setShape('custom');
        setActiveCustomSource('upload');
        setCustomMode(null); // Close AI/Paste panels
        svgShapeFileInputRef.current?.click();
    }, []);

    const handleSvgShapeUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const svgText = event.target?.result as string;
                const pathRegex = /<path[^>]*d="([^"]+)"/g;
                const paths = Array.from(svgText.matchAll(pathRegex)).map(match => match[1]);

                if (paths.length > 0) {
                    const combinedPath = paths.join(' ');
                    setCustomSvgPath(combinedPath);
                    setActiveCustomSource('upload');
                    setIsPristine(false);
                    setError(null);
                } else {
                    setError('Could not find any valid <path> data in the uploaded SVG.');
                    setCustomSvgPath(null);
                    setIsPristine(true);
                }
            };
            reader.onerror = () => { setError("Failed to read the SVG file."); };
            reader.readAsText(file);
        }
        if (e.target) e.target.value = '';
    }, [setError, setIsPristine]);

    const handleLibraryClick = useCallback(() => {
        setShape('custom');
        setActiveCustomSource('library');
        setIsLibraryOpen(true);
    }, []);
    
    const handleCloseLibrary = useCallback(() => setIsLibraryOpen(false), []);

    const handleIconSelect = useCallback((path: string) => {
        setCustomSvgPath(path);
        setShape('custom');
        setIsLibraryOpen(false);
        setIsPristine(false);
        setActiveCustomSource('library');
    }, []);
    
    const handleGenerateShape = useCallback(async () => {
        if (!aiPrompt.trim()) {
            setError("Please describe the shape you want to generate.");
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
                const message = error instanceof Error ? error.message : "An unknown error occurred during AI generation.";
                setGenerationError(message);
                setError(message);
                setCustomSvgPath(null);
            }
        } finally {
            if (generationRequestRef.current === currentRequestId) {
                setIsGeneratingShape(false);
            }
        }
    }, [aiPrompt, setError]);
    
    const handleStopGenerating = useCallback(() => {
        generationRequestRef.current++;
        setIsGeneratingShape(false);
        setGenerationError(null);
    }, []);

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
    
    const handleDownload = useCallback((format: DownloadFormat, opts: DownloadOptions) => {
        const { canvasRef, ...drawOpts } = opts;
        if (!canvasRef.current) return;
        const tempCanvas = document.createElement('canvas');
        drawClippedImage(tempCanvas, drawOpts.image, drawOpts.shape, drawOpts.clippingMode, { color: drawOpts.outlineColor, thickness: drawOpts.outlineThickness, style: drawOpts.outlineStyle }, drawOpts.zoom, drawOpts.offset, false, drawOpts.customSvgPath);

        const downloadName = `ClipAI-${drawOpts.clippingMode}-${drawOpts.shape === 'custom' ? 'custom' : drawOpts.shape}`;

        if (format === 'pdf') {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [tempCanvas.width, tempCanvas.height] });
            pdf.addImage(tempCanvas.toDataURL('image/png'), 'PNG', 0, 0, tempCanvas.width, tempCanvas.height);
            pdf.save(`${downloadName}.pdf`);
        } else {
            tempCanvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${downloadName}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            }, 'image/png', 1.0);
        }
    }, []);


    return {
        shape, setShape,
        clippingMode, setClippingMode,
        outlineColor, setOutlineColor,
        outlineThickness, setOutlineThickness,
        outlineStyle,
        customSvgPath, setCustomSvgPath,
        isPristine, setIsPristine,
        isLibraryOpen,
        customMode,
        activeCustomSource,
        aiPrompt, setAiPrompt,
        isGeneratingShape,
        generationError,
        pasteError,
        isCopied,
        svgShapeFileInputRef,
        handleShapeSelect,
        handleClippingModeChange,
        handleOutlineColorChange,
        handleOutlineThicknessChange,
        handleOutlineStyleChange,
        handleCustomModeClick,
        handleUploadButtonClick,
        handleSvgShapeUpload,
        handleLibraryClick,
        handleCloseLibrary,
        handleIconSelect,
        handleGenerateShape,
        handleStopGenerating,
        handlePastedPathChange,
        handleCopyPath,
        handleDownload
    };
};