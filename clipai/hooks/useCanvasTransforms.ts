// Fix: Add React import for event types.
import React, { useState, useCallback } from 'react';
import { ClippingMode, MediaSource } from '../types';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;
const ZOOM_STEP = 0.2;

export const useCanvasTransforms = (
    mediaSource: MediaSource | null,
    clippingMode: ClippingMode,
    setIsPristine: (isPristine: boolean) => void
) => {
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!mediaSource && clippingMode === 'fill') return;
        setIsPristine(false);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
        setIsPanning(true);
    }, [mediaSource, clippingMode, setIsPristine]);

    const handleMouseUp = useCallback(() => setIsPanning(false), []);
    const handleMouseLeave = useCallback(() => setIsPanning(false), []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isPanning) return;
        const dx = e.clientX - lastPanPoint.x;
        const dy = e.clientY - lastPanPoint.y;
        setOffset(o => ({ x: o.x + dx, y: o.y + dy }));
        setLastPanPoint({ x: e.clientX, y: e.clientY });
    }, [isPanning, lastPanPoint]);

    const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        if (!mediaSource && clippingMode === 'fill') return;
        e.preventDefault();
        setIsPristine(false);
        const scaleAmount = -e.deltaY * (zoom / 2000);
        setZoom(z => Math.min(Math.max(z + scaleAmount, MIN_ZOOM), MAX_ZOOM));
    }, [mediaSource, clippingMode, zoom, setIsPristine]);

    const zoomIn = useCallback(() => {
        setIsPristine(false);
        setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
    }, [setIsPristine]);

    const zoomOut = useCallback(() => {
        setIsPristine(false);
        setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM));
    }, [setIsPristine]);
    
    const reset = useCallback(() => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsPristine(true);
    }, [setIsPristine]);

    return {
        zoom,
        offset,
        isPanning,
        setOffset, // Exposed for testing
        handleMouseDown,
        handleMouseUp,
        handleMouseLeave,
        handleMouseMove,
        handleWheel,
        zoomIn,
        zoomOut,
        reset,
    };
};