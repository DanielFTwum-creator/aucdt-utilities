import React from 'react';
import { Film } from 'lucide-react';

interface VideoLoadingProps {
  progressMessage: string;
}

const VideoLoading: React.FC<VideoLoadingProps> = ({ progressMessage }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-6 p-8 text-center" aria-live="polite">
      <div className="relative">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500"></div>
        <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-purple-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Generating Your Video Flyer...</h3>
      <p className="text-gray-600 dark:text-gray-400 font-semibold max-w-xs">{progressMessage}</p>
    </div>
  );
};

export default VideoLoading;