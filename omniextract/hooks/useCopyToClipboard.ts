
import { useState, useCallback } from 'react';

/**
 * A custom hook for copying text to the clipboard.
 * @param timeout - The duration in milliseconds to show the copied state.
 * @returns A tuple containing the copy function and a boolean indicating if the text was recently copied.
 */
export const useCopyToClipboard = (timeout = 2000): [(text: string) => void, boolean] => {
    const [hasCopied, setHasCopied] = useState(false);

    const copy = useCallback((text: string) => {
        if (!navigator.clipboard) {
            console.warn('Clipboard API not available');
            // You could implement a fallback here if needed.
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            setHasCopied(true);
            setTimeout(() => {
                setHasCopied(false);
            }, timeout);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            setHasCopied(false);
        });
    }, [timeout]);

    return [copy, hasCopied];
};
