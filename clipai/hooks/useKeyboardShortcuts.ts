import { useEffect } from 'react';
import { Page } from '../types';

interface KeyboardShortcutsProps {
    page: Page;
    hasDrawable: boolean;
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
}

export const useKeyboardShortcuts = ({
    page,
    hasDrawable,
    zoomIn,
    zoomOut,
    reset,
}: KeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (page !== 'main' || !hasDrawable) return;
            
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                zoomOut();
            } else if (e.key.toLowerCase() === 'r') {
                e.preventDefault();
                reset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [page, hasDrawable, zoomIn, zoomOut, reset]);
};