import { useCallback, useEffect, useRef, useState } from 'react';

declare var GIF: any;

export const useGifGenerator = () => {
    const [isGeneratingGif, setIsGeneratingGif] = useState(false);
    const gifWorkerBlobUrl = useRef<string | null>(null);

    // Pre-fetch the worker to avoid CORS issues and make GIF generation faster
    useEffect(() => {
        fetch('https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js')
            .then(response => response.text())
            .then(scriptText => {
                const blob = new Blob([scriptText], { type: 'application/javascript' });
                gifWorkerBlobUrl.current = URL.createObjectURL(blob);
            })
            .catch(err => console.error("Failed to fetch and create blob for GIF worker:", err));
        
        return () => {
            if (gifWorkerBlobUrl.current) {
                URL.revokeObjectURL(gifWorkerBlobUrl.current);
            }
        };
    }, []);

    const generateGif = useCallback((frames: string[], speed: number, prompt: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (frames.length === 0 || !gifWorkerBlobUrl.current) {
                reject(new Error('No frames available or worker not ready'));
                return;
            }

            setIsGeneratingGif(true);

            try {
                const gif = new GIF({
                    workers: 2,
                    quality: 10,
                    workerScript: gifWorkerBlobUrl.current,
                });

                const imageElements: Promise<HTMLImageElement>[] = frames.map(frameSrc => {
                    return new Promise(resolve => {
                        const img = new Image();
                        img.src = frameSrc;
                        img.onload = () => resolve(img);
                    });
                });

                Promise.all(imageElements).then(loadedImages => {
                    loadedImages.forEach(img => {
                        gif.addFrame(img, { delay: speed });
                    });

                    gif.on('finished', (blob: Blob) => {
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${prompt.replace(/\s+/g, '_') || 'animation'}.gif`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        setIsGeneratingGif(false);
                        resolve();
                    });

                    gif.on('error', (error: Error) => {
                        setIsGeneratingGif(false);
                        reject(error);
                    });

                    gif.render();
                }).catch(error => {
                    setIsGeneratingGif(false);
                    reject(error);
                });

            } catch (err) {
                console.error("Failed to create GIF", err);
                setIsGeneratingGif(false);
                reject(new Error("Sorry, there was an issue creating the GIF file."));
            }
        });
    }, []);

    return {
        generateGif,
        isGeneratingGif
    };
};

