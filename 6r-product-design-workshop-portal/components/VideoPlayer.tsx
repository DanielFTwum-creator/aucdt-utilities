import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Settings, Fullscreen, RotateCw } from 'lucide-react';
import Button from './ui/Button';
import { useProgress } from '../context/ProgressContext';
import { useParams } from 'react-router-dom';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
  lessonId: string;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  className?: string;
}

const playbackSpeeds = [0.5, 1, 1.5, 2]; // From SRS (0.5x, 1x, 1.5x, 2x)

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  lessonId,
  onProgress,
  onEnded,
  className = '',
}) => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { simulateTimeSpent, updateLessonCompletion } = useProgress();
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  // Fix: setTimeout in browser returns a number, not NodeJS.Timeout
  const [controlTimeout, setControlTimeout] = useState<number | null>(null);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && videoRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const newTime = videoRef.current.currentTime;
      const newDuration = videoRef.current.duration;
      setCurrentTime(newTime);
      setDuration(newDuration);
      onProgress?.(newTime, newDuration);

      // Simulate time spent for progress tracking
      simulateTimeSpent(1);

      // Mark lesson as completed if 90% watched (arbitrary threshold for demo)
      if (newTime / newDuration >= 0.9 && moduleId && lessonId) {
        // Only update completion once
        if (videoRef.current.dataset.completed !== 'true') {
          updateLessonCompletion(moduleId, lessonId);
          videoRef.current.dataset.completed = 'true';
        }
      }
    }
  }, [onProgress, simulateTimeSpent, moduleId, lessonId, updateLessonCompletion]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVolume(videoRef.current.volume);
      setIsMuted(videoRef.current.muted);
      setPlaybackRate(videoRef.current.playbackRate);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
    if (moduleId && lessonId) {
      updateLessonCompletion(moduleId, lessonId);
    }
  }, [onEnded, moduleId, lessonId, updateLessonCompletion]);

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlTimeout) {
      clearTimeout(controlTimeout);
    }
    setControlTimeout(setTimeout(() => setShowControls(false), 3000));
  }, [controlTimeout]);

  const handleMouseLeave = useCallback(() => {
    if (isPlaying) {
      setControlTimeout(setTimeout(() => setShowControls(false), 1000));
    }
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('ended', handleEnded);

      // Initial state setup for play/pause and volume
      setIsPlaying(!videoElement.paused);
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
      setPlaybackRate(videoElement.playbackRate);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('ended', handleEnded);
        if (controlTimeout) {
          clearTimeout(controlTimeout);
        }
      };
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded, controlTimeout]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-black rounded-lg group ${className} aspect-video`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        title={title}
        onClick={togglePlay}
        className="w-full h-full object-contain"
        aria-label={`Video player for ${title}`}
      >
        Your browser does not support the video tag.
      </video>

      {/* Video Overlay for Play Button and controls */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300
                    ${isPlaying && !showControls ? 'opacity-0' : 'opacity-100'} pointer-events-none`}
        aria-hidden={isPlaying && !showControls}
      >
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="pointer-events-auto bg-white bg-opacity-30 rounded-full p-4 text-white hover:bg-opacity-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            <Play size={48} fill="currentColor" />
          </button>
        )}
      </div>

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent transition-opacity duration-300
                    ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none group-hover:opacity-100`}
      >
        {/* Progress Bar */}
        <div
          ref={progressBarRef}
          className="w-full h-1 bg-gray-600 rounded-full cursor-pointer overflow-hidden mb-2 pointer-events-auto"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-100 linear"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-white text-sm pointer-events-auto">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>

            <Button variant="ghost" size="sm" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 accent-primary cursor-pointer"
              aria-label="Volume slider"
            />
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Button variant="ghost" size="sm" aria-label="Playback speed settings">
                <Settings size={20} />
              </Button>
              <div className="absolute bottom-full right-0 mb-2 w-24 bg-gray-800 dark:bg-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                {playbackSpeeds.map((rate) => (
                  <button
                    key={rate}
                    className={`block w-full text-left px-3 py-1 text-white hover:bg-gray-700 dark:hover:bg-gray-600 ${
                      playbackRate === rate ? 'bg-primary dark:bg-blue-600' : ''
                    }`}
                    onClick={() => changePlaybackRate(rate)}
                    aria-label={`Set playback speed to ${rate}x`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
              <Fullscreen size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;