
import React, { useState, useEffect } from 'react';

interface AnimationPlayerProps {
  frames: string[];
}

const AnimationPlayer: React.FC<AnimationPlayerProps> = ({ frames }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (frames.length > 1) {
      const interval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
      }, 100); // 100ms per frame
      return () => clearInterval(interval);
    }
  }, [frames.length]);

  if (!frames || frames.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative">
      <img
        src={frames[currentFrame]}
        alt={`Animation frame ${currentFrame + 1}`}
        className="w-full h-auto object-cover rounded-lg shadow-2xl border-4 border-brand-secondary transition-opacity duration-200"
        // Use key to force re-render on src change which can help with transitions in some cases
        key={currentFrame}
      />
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        Frame {currentFrame + 1} / {frames.length}
      </div>
    </div>
  );
};

export default AnimationPlayer;
