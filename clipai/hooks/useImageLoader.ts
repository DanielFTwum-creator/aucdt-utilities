import React, { useState, useCallback, useRef } from 'react';
import { MediaSource } from '../types';

export const useMediaLoader = (setError: (msg: string | null) => void) => {
    const [mediaSource, setMediaSource] = useState<MediaSource | null>(null);
    const [originalMediaSource, setOriginalMediaSource] = useState<MediaSource | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleNewMedia = useCallback((media: MediaSource) => {
        setMediaSource(media);
        setOriginalMediaSource(media);
    }, []);

    const revertToOriginal = useCallback(() => {
        if (originalMediaSource) {
            if (originalMediaSource instanceof HTMLVideoElement) {
                originalMediaSource.play().catch(err => console.error("Video replay failed:", err));
            }
            setMediaSource(originalMediaSource);
        }
    }, [originalMediaSource]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessing(true);
            setError(null);
            const objectUrl = URL.createObjectURL(file);

            if (file.type.startsWith('video/')) {
                const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    handleNewMedia(video);
                    setIsProcessing(false);
                };
                video.onerror = () => {
                    setError("Could not load video. Please try another file.");
                    setIsProcessing(false);
                    URL.revokeObjectURL(objectUrl);
                };
                video.src = objectUrl;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.play().catch(err => console.error("Video autoplay failed:", err));
            } else if (file.type.startsWith('image/')) {
                const img = new Image();
                img.onload = () => {
                    handleNewMedia(img);
                    setIsProcessing(false);
                    URL.revokeObjectURL(objectUrl);
                };
                img.onerror = () => {
                    setError("Could not load image. Please try another file.");
                    setIsProcessing(false);
                    URL.revokeObjectURL(objectUrl);
                };
                img.src = objectUrl;
            } else {
                setError("Unsupported file type. Please upload an image or video.");
                setIsProcessing(false);
                URL.revokeObjectURL(objectUrl);
            }
        }
        if (e.target) e.target.value = '';
    }, [handleNewMedia, setError]);

    const handleUrlLoad = useCallback(async (url: string) => {
        setIsProcessing(true);
        setError(null);
        try {
            const proxiedUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await fetch(proxiedUrl);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
            
            const contentType = response.headers.get('Content-Type') || '';
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            if (contentType.startsWith('video/')) {
                 const video = document.createElement('video');
                video.onloadedmetadata = () => {
                    handleNewMedia(video);
                    setIsProcessing(false);
                };
                video.onerror = () => {
                    setError("The URL did not point to a valid video.");
                    setIsProcessing(false);
                    URL.revokeObjectURL(objectUrl);
                };
                video.src = objectUrl;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.play().catch(err => console.error("Video autoplay failed:", err));
            } else if (contentType.startsWith('image/')) {
                const img = new Image();
                img.onload = () => {
                    handleNewMedia(img);
                    setIsProcessing(false);
                    URL.revokeObjectURL(objectUrl);
                };
                img.onerror = () => {
                    setError("The URL did not point to a valid image.");
                    setIsProcessing(false);
                    URL.revokeObjectURL(objectUrl);
                };
                img.src = objectUrl;
            } else {
                 throw new Error(`Unsupported content type: ${contentType}`);
            }
        } catch (error) {
            setError("Error loading media from URL. It may be blocked or an unsupported type.");
            console.error("URL Load Error:", error);
            setIsProcessing(false);
        }
    }, [handleNewMedia, setError]);

    const handleSvgLoad = useCallback((svgCode: string) => {
        setIsProcessing(true);
        try {
            const blob = new Blob([svgCode], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => { handleNewMedia(img); URL.revokeObjectURL(url); setIsProcessing(false); };
            img.onerror = () => { setError("Invalid SVG code."); URL.revokeObjectURL(url); setIsProcessing(false); };
            img.src = url;
        } catch (error) {
            setError("Error processing SVG.");
            console.error(error);
            setIsProcessing(false);
        }
    }, [handleNewMedia, setError]);

    return {
        mediaSource: mediaSource,
        setMediaSource: setMediaSource,
        originalMediaSource: originalMediaSource,
        revertToOriginal,
        isProcessing,
        fileInputRef,
        handleImageUpload,
        handleUrlLoad,
        handleSvgLoad
    };
};