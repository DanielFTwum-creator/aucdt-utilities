import React from 'react';
import Spinner from './Spinner';

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

interface AnimationControlsProps {
    frames: string[];
    speed: number;
    isGeneratingGif: boolean;
    onSpeedChange: (speed: number) => void;
    onDownloadGif: () => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
    frames,
    speed,
    isGeneratingGif,
    onSpeedChange,
    onDownloadGif
}) => {
    if (frames.length === 0) return null;

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex-grow w-full sm:w-auto">
                    <label htmlFor="speed" className="block text-sm font-medium text-gray-400 mb-1">
                        Animation Speed ({Math.round(1000 / speed)} FPS)
                    </label>
                    <input
                        id="speed"
                        type="range"
                        min="33"
                        max="500"
                        step="1"
                        value={speed}
                        onChange={(e) => onSpeedChange(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        title={`Delay: ${speed}ms`}
                    />
                </div>
                <button
                    onClick={onDownloadGif}
                    disabled={isGeneratingGif}
                    className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                >
                    {isGeneratingGif ? (
                        <>
                            <Spinner className="h-5 w-5 mr-2" />
                            Generating GIF...
                        </>
                    ) : (
                        <>
                            <DownloadIcon className="h-5 w-5 mr-2" />
                            Download as GIF
                        </>
                    )}
                </button>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300">Generated Frames</h3>
                <div className="flex overflow-x-auto space-x-3 p-2 bg-gray-900/50 rounded-lg">
                    {frames.map((frame, index) => (
                        <div key={index} className="flex-shrink-0 w-28 h-28">
                            <img
                                src={frame}
                                alt={`Frame ${index + 1}`}
                                className="w-full h-full object-cover rounded-md border-2 border-gray-700"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnimationControls;

