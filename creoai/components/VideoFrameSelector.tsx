import React, { useRef, useState } from 'react';

interface VideoFrameSelectorProps {
  videoUrl: string;
  onFrameSelect: (frameDataUrl: string) => void;
  onCancel: () => void;
}

const VideoFrameSelector: React.FC<VideoFrameSelectorProps> = ({ videoUrl, onFrameSelect, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canCapture, setCanCapture] = useState(false);

  const handleCaptureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const frameDataUrl = canvas.toDataURL('image/jpeg');
        onFrameSelect(frameDataUrl);
      }
    }
  };
  
  const handleCanPlay = () => {
    setCanCapture(true);
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Select a Video Frame</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Play the video and pause at the frame you want to use for your flyer.
      </p>
      <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full"
          onCanPlay={handleCanPlay}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="flex gap-4 justify-center">
        <button 
          onClick={onCancel} 
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Return to the previous screen without selecting a frame"
        >
          Cancel
        </button>
        <button 
          onClick={handleCaptureFrame} 
          className="px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={!canCapture}
          title="Capture the current video frame and proceed"
        >
          Use This Frame
        </button>
      </div>
    </div>
  );
};

export default VideoFrameSelector;