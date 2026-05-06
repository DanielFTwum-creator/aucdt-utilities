
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Drone } from './components/Drone';
import { GREEK_LETTERS_ORDER, AFRICA_OUTLINE_POINTS, AFRICA_SHAPE_SEGMENTS, AFRICA_TEXT_SHAPES_DATA, GREEK_LETTER_SHAPES_DATA } from './data/shapes';
import { DRONE_COUNT, DISPLAY_DURATION, COLORS } from './data/constants';
import { generateShapePoints } from './utils/geometry';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [droneInstances, setDroneInstances] = useState<Drone[]>([]);
    const animationStartTimeRef = useRef<number | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const [currentGreekLetterIndex, setCurrentGreekLetterIndex] = useState(0);

    const startNewDisplaySequence = useCallback(() => {
        if (!canvasRef.current) return;
        animationStartTimeRef.current = null;
        setCurrentGreekLetterIndex(prevIndex => (prevIndex + 1) % GREEK_LETTERS_ORDER.length);
    }, []);

    const initDrones = useCallback(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        const currentGreekLetter = GREEK_LETTERS_ORDER[currentGreekLetterIndex];
        const greekLetterData = GREEK_LETTER_SHAPES_DATA[currentGreekLetter];

        // --- Calculate scaling and offsets ---
        const africaPointsForBounds = generateShapePoints(AFRICA_SHAPE_SEGMENTS, 1, 1, 0, 0);
        const africaMinX = Math.min(...africaPointsForBounds.map(p => p.x));
        const africaMaxX = Math.max(...africaPointsForBounds.map(p => p.x));
        const africaMinY = Math.min(...africaPointsForBounds.map(p => p.y));
        const africaMaxY = Math.max(...africaPointsForBounds.map(p => p.y));

        const greekPointsForBounds = generateShapePoints(greekLetterData.segments, 1, 1, 0, 0);
        const greekMinX = Math.min(...greekPointsForBounds.map(p => p.x));
        const greekMaxX = Math.max(...greekPointsForBounds.map(p => p.x));
        const greekMinY = Math.min(...greekPointsForBounds.map(p => p.y));
        const greekMaxY = Math.max(...greekPointsForBounds.map(p => p.y));

        const africaBoundsWidth = africaMaxX - africaMinX;
        const africaBoundsHeight = africaMaxY - africaMinY;
        const greekBoundsWidth = greekMaxX - greekMinX;
        const greekBoundsHeight = greekMaxY - greekMinY;

        const scale = Math.min(width / africaBoundsWidth, height / africaBoundsHeight) * 0.8;
        const africaOffsetX = (width - africaBoundsWidth * scale) / 2 - africaMinX * scale;
        const africaOffsetY = (height - africaBoundsHeight * scale) / 2 - africaMinY * scale;

        const greekScale = Math.min(width / greekBoundsWidth, height / greekBoundsHeight) * 0.8;
        const greekOffsetX = (width - greekBoundsWidth * greekScale) / 2 - greekMinX * greekScale;
        const greekOffsetY = (height - greekBoundsHeight * greekScale) / 2 - greekMinY * greekScale;

        // --- Generate target points ---
        const africaTargetPoints = AFRICA_OUTLINE_POINTS.map(p => ({
            x: p.x * scale + africaOffsetX,
            y: p.y * scale + africaOffsetY,
            color: p.color
        }));

        const africanTextTargetPoints = generateShapePoints(AFRICA_TEXT_SHAPES_DATA, scale * 0.9, scale * 0.9, africaOffsetX, africaOffsetY);
        const greekTargetPoints = generateShapePoints(greekLetterData.segments, greekScale, greekScale, greekOffsetX, greekOffsetY);
        
        // --- Create drone instances ---
        const newDrones: Drone[] = [];
        for (let i = 0; i < DRONE_COUNT; i++) {
            const initialX = Math.random() * width;
            const initialY = Math.random() * height;

            const africaPoint = africaTargetPoints[i % africaTargetPoints.length];
            const greekPoint = greekTargetPoints[i % greekTargetPoints.length];
            const textPoint = africanTextTargetPoints[i % africanTextTargetPoints.length];

            newDrones.push(new Drone(
                initialX, initialY,
                greekPoint.x, greekPoint.y,
                africaPoint.x, africaPoint.y,
                textPoint.x, textPoint.y,
                greekLetterData.color,
                africaPoint.color,
                textPoint.color as string // Already assigned in geometry util
            ));
        }

        setDroneInstances(newDrones);
    }, [currentGreekLetterIndex]);

    const animate = useCallback((currentTime: number) => {
        if (!canvasRef.current || droneInstances.length === 0) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            return;
        }

        if (animationStartTimeRef.current === null) {
            animationStartTimeRef.current = currentTime;
        }

        const elapsedTime = currentTime - animationStartTimeRef.current;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        
        ctx.fillStyle = COLORS.indigoSky;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        droneInstances.forEach(drone => {
            drone.update(currentTime, animationStartTimeRef.current!);
            drone.draw(ctx);
        });

        if (elapsedTime > DISPLAY_DURATION) {
            setTimeout(startNewDisplaySequence, 1000); // Wait 1s before starting next letter
        } else {
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
    }, [droneInstances, startNewDisplaySequence]);


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width * window.devicePixelRatio;
            canvas.height = height * window.devicePixelRatio;
            initDrones(); // Re-initialize with new dimensions
        };

        const resizeObserver = new ResizeObserver(resizeCanvas);
        resizeObserver.observe(canvas);
        
        resizeCanvas(); // Initial setup

        return () => {
            resizeObserver.unobserve(canvas);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initDrones]); // initDrones is dependency

     useEffect(() => {
        if (droneInstances.length > 0) {
            animationFrameIdRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [droneInstances, animate]);

    return (
        <main className="relative h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 overflow-hidden">
            <div className="absolute top-0 left-0 p-8 text-center w-full">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-wider" style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}>
                    Drone Light Show
                </h1>
                <p className="text-xl text-indigo-200 mt-2">
                    Current Shape: {GREEK_LETTERS_ORDER[currentGreekLetterIndex]}
                </p>
            </div>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
        </main>
    );
};

export default App;
