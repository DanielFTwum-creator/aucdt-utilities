
import React, { useState, useEffect } from 'react';

interface FrameAnimatorProps {
    frames: string[];
    speed: number; // in ms
}

const FrameAnimator: React.FC<FrameAnimatorProps> = ({ frames, speed }) => {
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

    useEffect(() => {
        if (frames.length <= 1) return;

        const intervalId = setInterval(() => {
            setCurrentFrameIndex(prevIndex => (prevIndex + 1) % frames.length);
        }, speed);

        return () => clearInterval(intervalId);
    // speed and frames.length are the correct dependencies to restart the timer if they change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [frames.length, speed]);

    if (frames.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-full bg-gray-900/50 rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
            {frames.map((frame, index) => (
                <img 
                    key={index}
                    src={frame} 
                    alt={`Animation frame ${index + 1}`}
                    className={`absolute w-full h-full object-contain transition-opacity duration-100 ${index === currentFrameIndex ? 'opacity-100' : 'opacity-0'}`}
                />
            ))}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs font-mono px-2 py-1 rounded">
                {currentFrameIndex + 1} / {frames.length}
            </div>
        </div>
    );
};

export default FrameAnimator;
