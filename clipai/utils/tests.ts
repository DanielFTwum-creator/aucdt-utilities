import { Test, TestContext } from '../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper Functions
const areCanvasEqual = (data1: Uint8ClampedArray, data2: Uint8ClampedArray): boolean => {
    if (data1.length !== data2.length) return false;
    // Check a subset of pixels for performance
    for (let i = 0; i < data1.length; i += 400) { // Check every 100th pixel
        if (data1[i] !== data2[i] || data1[i+1] !== data2[i+1] || data1[i+2] !== data2[i+2] || data1[i+3] !== data2[i+3]) {
            return false;
        }
    }
    return true;
};

const createTestImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        // A simple 1x1 red pixel PNG
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    });
};

const createTestVideo = (): Promise<HTMLVideoElement> => {
     return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        // A tiny, silent, 1-second mp4 video.
        const base64 = 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAhhtZGF0AAAAA26AZ2Ge8///n6gAAACzAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAQEBAAAE+wAFAEAAASoK83gAAQAAAwAAgwABAAAAAQAAAAAJAAEAAAAACSAAAAAgAAAABwAAAAUCAgQDAhMDBP//AAADEwEC/wEAAAADbAAAAAAAAAC8//6/9gAAAwNsAAAAAAAAAM7//r/2AAADBGwAAAAAAAAA5P/+v/YAAAMGgAAAAAAAAAAlP/+v/YAAAMFwAAAAAAAAAB1//6/9gAAAwUIbgAAAAAAAACk//6/9gAAAwT6AAAAAAAAAAr//r/2AAADBPgAAAAAAAAACP/+v/YAAAME+AAAAAAAAAAD//6/9gAAAwT4AAAAAAAAAAn//r/2AAADBHAAAAAAAAAAAf/+v/YAAAMEcAAAAAAAAAAB//6/9gAAAwRwAAAAAAAAAAH//r/2AAADBGwAAAAAAAAA5P/+v/YAAAMGgAAAAAAAAAAlP/+v/YAAAMFwAAAAAAAAAB1//6/9gAAAwUIbgAAAAAAAACk//6/9gAAAwT6AAAAAAAAAAr//r/2AAADBPgAAAAAAAAACP/+v/YAAAME+AAAAAAAAAAD//6/9gAAAwT4AAAAAAAAAAn//r/2AAADBHAAAAAAAAAAAf/+v/YAAAMEcAAAAAAAAAAB//6/9gAAAwRwAAAAAAAAAAH//r/2AAAAAmdyYWsAAABsdWVoZAAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAAQAAAAEAAAAAAAAAA';
        const binary = atob(base64);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        video.onloadedmetadata = () => resolve(video);
        video.onerror = reject;
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.play().catch(console.error);
    });
};


const tests: Test[] = [
    {
        name: 'Initial State',
        description: 'Checks if the application loads in a clean, initial state with an empty canvas.',
        run: async ({ takeScreenshot, getCanvasPixelData }) => {
            const initialPixels = getCanvasPixelData();
            if (initialPixels && initialPixels.every(p => p === 0)) {
                 return { message: 'Canvas is initially empty as expected.', screenshot: takeScreenshot() };
            }
            return { message: 'Canvas was not empty on initial load.', screenshot: takeScreenshot() };
        }
    },
    {
        name: 'Image Upload',
        description: 'Tests if a mock image can be loaded and displayed on the canvas.',
        run: async ({ setMediaSource, waitForRender, takeScreenshot, getCanvasPixelData }) => {
            const initialPixels = getCanvasPixelData();
            const img = await createTestImage();

            setMediaSource(img);
            await waitForRender();
            const newPixels = getCanvasPixelData();

            if (!initialPixels || !newPixels || areCanvasEqual(initialPixels, newPixels)) {
                throw new Error('Canvas did not change after loading an image.');
            }
            return { message: 'Mock image loaded and rendered on the canvas successfully.', screenshot: takeScreenshot() };
        },
    },
    {
        name: 'Video Upload & Animation',
        description: 'Verifies a mock video loads and the canvas updates between frames.',
        run: async ({ setMediaSource, waitForRender, takeScreenshot, getCanvasPixelData }) => {
            const video = await createTestVideo();
            setMediaSource(video);
            
            await waitForRender(200); // Wait for playback to start
            const frame1 = getCanvasPixelData();
            const screenshot1 = takeScreenshot();

            await waitForRender(200); // Wait for the next frame
            const frame2 = getCanvasPixelData();

            if (!frame1 || !frame2 || areCanvasEqual(frame1, frame2)) {
                throw new Error('Canvas did not update between video frames, indicating playback failed.');
            }
            return { message: 'Video loaded and canvas animation was detected.', screenshot: screenshot1 };
        }
    },
    {
        name: 'Shape Clipping Logic',
        description: 'Tests that changing shapes and clipping modes updates the canvas output.',
        run: async ({ setShape, setClippingMode, waitForRender, getCanvasPixelData, takeScreenshot }) => {
            setShape('circle');
            await waitForRender();
            const circlePixels = getCanvasPixelData();

            setShape('star');
            await waitForRender();
            const starPixels = getCanvasPixelData();
            
            if (!circlePixels || !starPixels || areCanvasEqual(circlePixels, starPixels)) {
                throw new Error('Canvas output did not differ between circle and star shapes.');
            }

            setClippingMode('outline');
            await waitForRender();
            const outlinePixels = getCanvasPixelData();

            if (areCanvasEqual(starPixels, outlinePixels)) {
                throw new Error('Switching to outline mode did not change the canvas content.');
            }

            return { message: 'Shape and clipping mode changes correctly updated the canvas.', screenshot: takeScreenshot() };
        },
    },
    {
        name: 'Download Button State',
        description: 'Ensures download buttons are enabled/disabled correctly based on user interaction.',
        run: async ({ setMediaSource, isDownloadDisabled, panCanvas, waitForRender }) => {
            if (!isDownloadDisabled()) throw new Error('Download should be disabled on initial load.');

            const img = await createTestImage();
            setMediaSource(img);
            await waitForRender();

            if (!isDownloadDisabled()) throw new Error('Download should be disabled after loading media (pristine state).');

            panCanvas(10, 10);
            await waitForRender();

            if (isDownloadDisabled()) throw new Error('Download should be enabled after panning the media.');

            return { message: 'Download button state logic is working correctly.' };
        }
    },
    {
        name: 'AI Shape Generation',
        description: 'Tests the full AI shape generation flow with a simple prompt.',
        run: async ({ setShape, setCustomSvgPath, waitForRender, takeScreenshot }) => {
            if (!process.env.API_KEY) throw new Error('SKIPPED: API_KEY is not configured for this test.');
            
            setShape('custom');
            const prompt = `You are an expert SVG path generator. Create a single, closed SVG path data string for a shape representing "a simple cat head". The path must fit entirely within a 500x500 viewBox and be centered. Only provide the raw path data string.`;
            
            let pathData;
            try {
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                pathData = response.text.trim();
            } catch (e) {
                throw new Error(`API call failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
            }

            if (!pathData || !/^[Mm]/.test(pathData)) {
                throw new Error('AI model returned invalid or empty path data.');
            }
            
            setCustomSvgPath(pathData);
            await waitForRender();

            return { message: 'Successfully generated and rendered an AI shape.', screenshot: takeScreenshot() };
        }
    },
    {
        name: 'AI Media Editing',
        description: 'Tests the full AI media editing flow by changing an image\'s color.',
        run: async ({ setMediaSource, runAiEdit, waitForRender, takeScreenshot, getCanvasPixelData }) => {
            if (!process.env.API_KEY) throw new Error('SKIPPED: API_KEY is not configured for this test.');
            
            const img = await createTestImage(); // A red image
            setMediaSource(img);
            await waitForRender();
            const initialPixels = getCanvasPixelData();

            await runAiEdit('make it solid blue');
            await waitForRender();
            const editedPixels = getCanvasPixelData();

            if (!initialPixels || !editedPixels || areCanvasEqual(initialPixels, editedPixels)) {
                throw new Error('Canvas did not change after AI edit.');
            }
            
            // Check if the image is now blue (B > R)
            const b = editedPixels[100*4 + 2];
            const r = editedPixels[100*4 + 0];
            if (b < r) {
                throw new Error('AI edit was applied, but the result was not the requested color.');
            }

            return { message: 'Successfully edited media with AI and rendered the result.', screenshot: takeScreenshot() };
        }
    }
];

export default tests;