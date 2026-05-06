import React from 'react';
import Spinner from './Spinner';
import FrameAnimator from './FrameAnimator';

interface FrameDisplayProps {
    frames: string[];
    speed: number;
    isLoading: boolean;
}

const FrameDisplay: React.FC<FrameDisplayProps> = ({
    frames,
    speed,
    isLoading
}) => {
    return (
        <div className="aspect-square w-full max-w-lg mx-auto bg-gray-800 rounded-xl shadow-2xl flex items-center justify-center mb-6">
            {isLoading && <Spinner className="h-16 w-16" />}
            {!isLoading && frames.length > 0 && <FrameAnimator frames={frames} speed={speed} />}
            {!isLoading && frames.length === 0 && (
                <div className="text-center text-gray-500">
                    <p>Your animation will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default FrameDisplay;

