import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { ShapeId, ClippingMode, Theme, MediaSource, OutlineStyle } from './types';

// Component Imports
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import ImageEditor from './components/ImageEditor';
import ShapeSelectorComponent from './components/ShapeSelector';
import OutlineControls from './components/OutlineControls';
import CustomShapeControls from './components/CustomShapeControls';
import Preview from './components/Preview';
import IconLibraryModal from './components/IconLibraryModal';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import ThemeSwitcher from './components/ThemeSwitcher';
import TestPanel from './components/TestPanel';
import ErrorToast from './components/ErrorToast';

// Hook Imports
import { useMediaLoader } from './hooks/useImageLoader';
import { useCanvasTransforms } from './hooks/useCanvasTransforms';
import { useCustomShape } from './hooks/useCustomShape';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useTheme } from './hooks/useTheme';

import { SHAPES, shapeIcons } from './constants';
import { ICON_LIBRARY } from './icon-library';
import { drawClippedImage } from './utils/canvas';

const mediaSourceToGenerativePart = (mediaSource: MediaSource, mimeType: string = 'image/png'): { inlineData: { data: string, mimeType: string } } => {
    const canvas = document.createElement('canvas');
    let width, height;

    if (mediaSource instanceof HTMLVideoElement) {
        width = mediaSource.videoWidth;
        height = mediaSource.videoHeight;
    } else { // HTMLImageElement
        width = mediaSource.naturalWidth;
        height = mediaSource.naturalHeight;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get canvas context");
    
    ctx.drawImage(mediaSource, 0, 0, width, height);
    
    const dataUrl = canvas.toDataURL(mimeType);
    const base64Data = dataUrl.split(',')[1];
    
    return {
        inlineData: {
            data: base64Data,
            mimeType,
        },
    };
};


function App() {
    const [error, setError] = useState<string | null>(null);

    // Navigation and Theming
    const { page, setPage, isAdminAuthenticated, auditLog, handleLoginSuccess, handleLogout, logAdminAction } = useAppNavigation();
    const { theme, setTheme } = useTheme();

    // Core Application Logic via Custom Hooks
    const { mediaSource, setMediaSource, originalMediaSource, revertToOriginal, isProcessing, fileInputRef, ...mediaHandlers } = useMediaLoader(setError);
    const { shape, clippingMode, outlineColor, outlineThickness, customSvgPath, isPristine, setIsPristine, handleDownload, outlineStyle, ...shapeHandlers } = useCustomShape(setError);
    const { zoom, offset, isPanning, setOffset, ...transformHandlers } = useCanvasTransforms(mediaSource, clippingMode, setIsPristine);

    useKeyboardShortcuts({
        page,
        hasDrawable: !!mediaSource || clippingMode === 'outline',
        zoomIn: transformHandlers.zoomIn,
        zoomOut: transformHandlers.zoomOut,
        reset: transformHandlers.reset,
    });
    
    // State for Image Editing
    const [isEditingMedia, setIsEditingMedia] = useState(false);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Effect to manage outline style when media source changes
    useEffect(() => {
        if (!mediaSource && outlineStyle === 'texture') {
            shapeHandlers.handleOutlineStyleChange('solid');
        }
    }, [mediaSource, outlineStyle, shapeHandlers.handleOutlineStyleChange]);
    
    // Main drawing logic
    const redrawCanvas = useCallback((isInteracting: boolean) => {
        if (canvasRef.current) {
            drawClippedImage(canvasRef.current, mediaSource, shape, clippingMode, { color: outlineColor, thickness: outlineThickness, style: outlineStyle }, zoom, offset, isInteracting, customSvgPath);
        }
    }, [mediaSource, shape, clippingMode, outlineColor, outlineThickness, zoom, offset, customSvgPath, outlineStyle]);

    const isVideoPlaying = mediaSource instanceof HTMLVideoElement && !mediaSource.paused;

    useEffect(() => {
        let animationFrameId: number;
        const renderLoop = () => {
            redrawCanvas(isPanning);
            animationFrameId = requestAnimationFrame(renderLoop);
        };

        if (page === 'main' || page === 'testPanel') {
            if (isVideoPlaying) {
                animationFrameId = requestAnimationFrame(renderLoop);
            } else {
                redrawCanvas(isPanning);
            }
        }
        return () => { cancelAnimationFrame(animationFrameId); };
    }, [page, mediaSource, isVideoPlaying, redrawCanvas, isPanning]);


    const downloadHandler = useCallback((format: 'png' | 'pdf') => {
        handleDownload(format, { canvasRef, image: mediaSource, shape, clippingMode, outlineColor, outlineThickness, zoom, offset, customSvgPath, outlineStyle });
    }, [handleDownload, mediaSource, shape, clippingMode, outlineColor, outlineThickness, zoom, offset, customSvgPath, outlineStyle]);

    const handleMediaEdit = useCallback(async (prompt: string) => {
        if (!mediaSource) {
            setError("No media available to edit.");
            return;
        }

        setIsEditingMedia(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const mediaPart = mediaSourceToGenerativePart(mediaSource);
            const textPart = { text: prompt };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [mediaPart, textPart] },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });

            const firstPart = response.candidates?.[0]?.content?.parts?.[0];
            if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
                const { data: newBase64Data, mimeType: newMimeType } = firstPart.inlineData;
                
                const newImg = new Image();
                await new Promise((resolve, reject) => {
                    newImg.onload = resolve;
                    newImg.onerror = reject;
                    newImg.src = `data:${newMimeType};base64,${newBase64Data}`;
                });

                setMediaSource(newImg); // The edited result is always an image
                setIsPristine(false);
            } else {
                throw new Error("The AI did not return a valid image. Please try a different prompt.");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "An unknown error occurred during image editing.";
            console.error("Image editing error:", error);
            setError(message);
        } finally {
            setIsEditingMedia(false);
        }
    }, [mediaSource, setMediaSource, setIsPristine, setError]);

    const isDownloadDisabled = isPristine || (clippingMode === 'fill' && !mediaSource);
    const downloadTooltip = isDownloadDisabled
        ? (!mediaSource && clippingMode === 'fill' ? "Upload an image or video to enable download" : "Adjust media or outline to enable download")
        : "Download your creation";
    
    const panCanvasForTest = (dx: number, dy: number) => {
        setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
        setIsPristine(false);
    };
    
    const testContextSetters = {
        setMediaSource,
        setShape: shapeHandlers.setShape,
        setClippingMode: shapeHandlers.setClippingMode,
        setCustomSvgPath: shapeHandlers.setCustomSvgPath,
        runAiEdit: handleMediaEdit,
        isDownloadDisabled: () => isDownloadDisabled,
        panCanvas: panCanvasForTest,
    };

    const renderPage = () => {
        switch (page) {
            case 'adminLogin': return <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={() => setPage('main')} />;
            case 'adminPanel': return <AdminPanel auditLog={auditLog} onLogout={handleLogout} logAdminAction={logAdminAction} onNavigateToTests={() => setPage('testPanel')} />;
            case 'testPanel': return <TestPanel onBack={() => setPage('adminPanel')} stateSetters={testContextSetters} canvasRef={canvasRef} />;
            default:
                return (
                    <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="hc-bg hc-border hc-text bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="space-y-6">
                                <ImageInput
                                    onImageUpload={mediaHandlers.handleImageUpload}
                                    onUrlLoad={mediaHandlers.handleUrlLoad}
                                    onSvgLoad={mediaHandlers.handleSvgLoad}
                                    isProcessing={isProcessing}
                                    hasImage={!!mediaSource}
                                    fileInputRef={fileInputRef}
                                />
                                {mediaSource && (
                                    <ImageEditor
                                        onEdit={handleMediaEdit}
                                        onRevert={() => {
                                            revertToOriginal();
                                            setIsPristine(true);
                                        }}
                                        isEditing={isEditingMedia}
                                        isRevertable={mediaSource !== originalMediaSource}
                                    />
                                )}
                                <ShapeSelectorComponent
                                    shapes={SHAPES} shapeIcons={shapeIcons}
                                    currentShape={shape} onShapeSelect={shapeHandlers.handleShapeSelect}
                                    clippingMode={clippingMode} onClippingModeChange={shapeHandlers.handleClippingModeChange}
                                />
                                {clippingMode === 'outline' && (
                                    <OutlineControls
                                        color={outlineColor} thickness={outlineThickness} hasMedia={!!mediaSource}
                                        onColorChange={shapeHandlers.handleOutlineColorChange}
                                        onThicknessChange={shapeHandlers.handleOutlineThicknessChange}
                                        outlineStyle={outlineStyle}
                                        onOutlineStyleChange={shapeHandlers.handleOutlineStyleChange}
                                    />
                                )}
                                <CustomShapeControls
                                    customMode={shapeHandlers.customMode} activeCustomSource={shapeHandlers.activeCustomSource}
                                    aiPrompt={shapeHandlers.aiPrompt} customSvgPath={customSvgPath}
                                    isGeneratingShape={shapeHandlers.isGeneratingShape} generationError={shapeHandlers.generationError}
                                    pasteError={shapeHandlers.pasteError} isCopied={shapeHandlers.isCopied}
                                    onCustomModeClick={shapeHandlers.handleCustomModeClick}
                                    onUploadClick={shapeHandlers.handleUploadButtonClick}
                                    onLibraryClick={shapeHandlers.handleLibraryClick}
                                    onAiPromptChange={shapeHandlers.setAiPrompt} onGenerateShape={shapeHandlers.handleGenerateShape}
                                    onStopGenerating={shapeHandlers.handleStopGenerating} onPastedPathChange={shapeHandlers.handlePastedPathChange}
                                    onCopyPath={shapeHandlers.handleCopyPath}
                                    onSvgShapeUpload={shapeHandlers.handleSvgShapeUpload}
                                    svgShapeFileInputRef={shapeHandlers.svgShapeFileInputRef}
                                />
                            </div>
                        </div>
                        <Preview
                            canvasRef={canvasRef} image={mediaSource} clippingMode={clippingMode} zoom={zoom} isPanning={isPanning}
                            onMouseDown={transformHandlers.handleMouseDown} onMouseUp={transformHandlers.handleMouseUp}
                            onMouseMove={transformHandlers.handleMouseMove} onMouseLeave={transformHandlers.handleMouseLeave}
                            onWheel={transformHandlers.handleWheel} onZoomIn={transformHandlers.zoomIn}
                            onZoomOut={transformHandlers.zoomOut} onReset={transformHandlers.reset}
                            onDownloadPng={() => downloadHandler('png')} onDownloadPdf={() => downloadHandler('pdf')}
                            isDownloadDisabled={isDownloadDisabled} downloadTooltip={downloadTooltip}
                        />
                    </main>
                );
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto rounded-xl">
                    <Header />
                    {renderPage()}
                    <footer className="text-center mt-12 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-center gap-6">
                            <ThemeSwitcher theme={theme} setTheme={setTheme} />
                            <button onClick={() => setPage(isAdminAuthenticated ? 'adminPanel' : 'adminLogin')} className="hc-link text-xs text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors" title="Go to Admin Panel">
                                Admin
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
            {page === 'main' && <IconLibraryModal isOpen={shapeHandlers.isLibraryOpen} onClose={shapeHandlers.handleCloseLibrary} onSelect={shapeHandlers.handleIconSelect} iconLibrary={ICON_LIBRARY} />}
            <ErrorToast message={error} onClose={() => setError(null)} />
        </>
    );
}

export default App;