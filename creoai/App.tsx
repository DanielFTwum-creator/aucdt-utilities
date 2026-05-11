import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, LayoutDashboard, Shield, TestTube2, Download, Film, Video, KeyRound, UploadCloud } from 'lucide-react';
import html2canvas from 'html2canvas';

import { flyerData as initialFlyerData } from './constants';
import { generateFlyerImage, generateFlyerVideo } from './services/geminiService';
import Flyer from './components/Flyer';
import LoadingSpinner from './components/LoadingSpinner';
import ImageCropper from './components/ImageCropper';
import ThemeSwitcher from './components/ThemeSwitcher';
import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';
import TestRunner from './components/testing/TestRunner';
import { useAuth } from './hooks/useAuth';
import VideoLoading from './components/VideoLoading';
import VideoFrameSelector from './components/VideoFrameSelector';
// FIX: The `AIStudio` type is available globally via `types.ts` and does not need to be imported directly.
import type { FlyerData, AuditLogEntry } from './types';

type View = 'generator' | 'admin' | 'testing';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('generator');
  const [log, setLog] = useState<AuditLogEntry[]>([]);
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(false);
  const [videoProgressMessage, setVideoProgressMessage] = useState<string>('');
  const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);
  
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  const videoUrlRef = useRef<string | null>(null);
  const imageUploadInputRef = useRef<HTMLInputElement>(null);
  const videoUploadInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    const checkApiKey = async () => {
        try {
            if (typeof window.aistudio?.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            } else {
                console.warn('aistudio API not found, assuming API key is set.');
                setApiKeySelected(true); 
            }
        } catch (e) {
            console.error("Error checking for API key:", e);
            setApiKeySelected(true); // Fallback if check fails
        }
    };
    checkApiKey();
  }, []);

  const addLogEntry = (action: string) => {
    const entry: AuditLogEntry = {
      timestamp: new Date(),
      user: user || 'system',
      action,
    };
    setLog(prevLog => [entry, ...prevLog]);
  };

  const handleImageGeneration = async () => {
    addLogEntry('Image flyer generation started.');
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    setImageToCrop(null);

    try {
      const url = await generateFlyerImage(initialFlyerData.prompt, '9:16');
      setImageToCrop(url);
      addLogEntry('Image generation successful, proceeding to crop.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      addLogEntry(`Flyer generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVideoGeneration = async () => {
    if (apiKeySelected === false) {
        await window.aistudio.openSelectKey();
        setApiKeySelected(true); // Assume success to avoid race condition and let user re-click
        addLogEntry('User prompted to select API key for video generation.');
        return;
    }

    addLogEntry('Video flyer generation started.');
    setIsVideoLoading(true);
    setError(null);
    setVideoUrl(null);

    const progressMessages = [
      "Warming up the digital director's chair...",
      "Casting pixels for their starring roles...",
      "Adjusting the virtual studio lighting...",
      "The AI is storyboarding your masterpiece...",
      "Rendering the first few frames, this can take a moment...",
      "Adding a touch of cinematic magic...",
      "The final cut is almost ready...",
    ];
    let messageIndex = 0;
    setVideoProgressMessage(progressMessages[messageIndex]);
    const progressInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % progressMessages.length;
        setVideoProgressMessage(progressMessages[messageIndex]);
    }, 7000);

    try {
        const url = await generateFlyerVideo(initialFlyerData.prompt);
        setVideoUrl(url);
        videoUrlRef.current = url; 
        addLogEntry('Video generation successful, proceeding to frame selection.');
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        if (errorMessage.includes('Requested entity was not found')) {
            setError('Your API key may be invalid. Please select a new one to continue.');
            setApiKeySelected(false);
        } else {
            setError(errorMessage);
        }
        addLogEntry(`Video generation failed: ${errorMessage}`);
    } finally {
        setIsVideoLoading(false);
        clearInterval(progressInterval);
    }
  };
  
  const processImageFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
        addLogEntry(`User uploaded image: ${file.name}`);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageToCrop(reader.result as string);
        };
        reader.readAsDataURL(file);
    } else if (file) {
        setError('Invalid file type. Please upload an image file.');
        addLogEntry(`Image upload failed: Invalid file type ${file.type}`);
    }
  };

  const processVideoFile = (file: File) => {
    if (file && file.type.startsWith('video/')) {
        addLogEntry(`User uploaded video: ${file.name}`);
        if (videoUrlRef.current) {
            URL.revokeObjectURL(videoUrlRef.current);
        }
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
        videoUrlRef.current = url;
    } else if (file) {
        setError('Invalid file type. Please upload a video file.');
        addLogEntry(`Video upload failed: Invalid file type ${file.type}`);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    event.target.value = '';
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            processImageFile(file);
        } else if (file.type.startsWith('video/')) {
            processVideoFile(file);
        } else {
            setError('Unsupported file type. Please drop an image or video file.');
            addLogEntry(`File drop failed: Invalid file type ${file.type}`);
        }
    }
  };
  
  const handleCaptureScreenshot = async () => {
    const flyerElement = document.getElementById('flyer-container');
    if (flyerElement) {
      addLogEntry('Capturing screenshot of completed flyer.');
      try {
        const canvas = await html2canvas(flyerElement, { useCORS: true });
        const link = document.createElement('a');
        link.download = 'flyer-complete.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        addLogEntry('Screenshot downloaded successfully.');
      } catch (e) {
        addLogEntry(`Screenshot capture failed: ${e}`);
        console.error("Screenshot capture failed:", e);
      }
    } else {
        addLogEntry('Screenshot capture failed: Flyer element not found.');
        alert("Could not find the flyer to capture. Please generate a flyer first.");
    }
  };

  const resetState = () => {
    addLogEntry('Application state reset.');
    setIsLoading(false);
    setError(null);
    setImageUrl(null);
    setImageToCrop(null);
    setIsVideoLoading(false);
    setVideoUrl(null);
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
    setCurrentView('generator');
  };

  const renderInitialContent = () => (
     <>
        <input type="file" ref={imageUploadInputRef} className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
        <input type="file" ref={videoUploadInputRef} className="hidden" accept="video/mp4, video/webm, video/mov" onChange={handleVideoUpload} />

        <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Create a New Flyer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose a creation method, or simply drag and drop your media to start.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Generation Card */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">AI Image Flyer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">Instantly generate a high-quality, static image for your flyer.</p>
                <button
                    onClick={handleImageGeneration}
                    id="generate-flyer-btn"
                    className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    <Sparkles className="w-5 h-5 mr-3 transform group-hover:rotate-12 transition-transform" />
                    Generate Image
                </button>
            </div>
             {/* Image Upload Card */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <UploadCloud className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Upload Image</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">Use your own image as a starting point for the flyer.</p>
                <button
                    onClick={() => imageUploadInputRef.current?.click()}
                    id="upload-image-btn"
                    className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    <UploadCloud className="w-5 h-5 mr-3" />
                    Upload Image
                </button>
            </div>
            {/* Video Generation Card */}
             <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Film className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">AI Video Flyer</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">Create a short video and choose the perfect moment to capture.</p>
                {apiKeySelected === false ? (
                    <button
                        onClick={handleVideoGeneration}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        <KeyRound className="w-5 h-5 mr-3" />
                        Select API Key
                    </button>
                ) : (
                    <button
                        onClick={handleVideoGeneration}
                        id="generate-video-btn"
                        disabled={apiKeySelected === null}
                        className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
                    >
                        <Video className="w-5 h-5 mr-3" />
                        Generate Video
                    </button>
                )}
                 {apiKeySelected === false && <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">Video generation requires a Google Cloud project API key. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline">Learn more</a></p>}
            </div>
             {/* Video Upload Card */}
            <div className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center flex flex-col items-center">
                 <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <UploadCloud className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Upload Video</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">Upload your own video and select the perfect frame for your flyer.</p>
                <button
                    onClick={() => videoUploadInputRef.current?.click()}
                    id="upload-video-btn"
                    className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                    <UploadCloud className="w-5 h-5 mr-3" />
                    Upload Video
                </button>
            </div>
        </div>
      </>
  );

  const renderGeneratorContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (isVideoLoading) return <VideoLoading progressMessage={videoProgressMessage} />;
    if (error) return (
        <div className="text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-4">Operation Failed</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={resetState}
              className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors"
            >
              Try Again
            </button>
        </div>
    );
    if (videoUrl) return <VideoFrameSelector videoUrl={videoUrl} onFrameSelect={(frameDataUrl) => { setImageToCrop(frameDataUrl); setVideoUrl(null); if (videoUrlRef.current) { URL.revokeObjectURL(videoUrlRef.current); videoUrlRef.current = null; } addLogEntry('Video frame selected for flyer.'); }} onCancel={resetState} />;
    if (imageToCrop) return <ImageCropper imageUrl={imageToCrop} onCropComplete={(url) => { setImageUrl(url); setImageToCrop(null); addLogEntry('Image cropping complete.'); }} onCancel={resetState} />;
    if (imageUrl) return (
      <div className="flex flex-col items-center gap-8">
          <Flyer
            imageUrl={imageUrl}
            flyerData={initialFlyerData}
          />
           <div className="flex gap-4">
              <button onClick={resetState} className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Start Over</button>
               <button onClick={handleCaptureScreenshot} className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <Download size={18}/>
                  Download
              </button>
           </div>
      </div>
    );

    return renderInitialContent();
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'admin':
        return user ? <AdminPanel log={log} addLogEntry={addLogEntry} /> : <Login addLogEntry={addLogEntry} />;
      case 'testing':
        return <TestRunner addLogEntry={addLogEntry} onCaptureScreenshot={handleCaptureScreenshot} canCapture={!!imageUrl} onGenerateSample={handleImageGeneration} />;
      case 'generator':
      default:
        return renderGeneratorContent();
    }
  }
  
  const showDropzone = currentView === 'generator' && !isLoading && !isVideoLoading && !error && !videoUrl && !imageToCrop && !imageUrl;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-500 text-gray-900 dark:text-white flex flex-col">
      <header className="relative">
        <div className="absolute inset-0 bg-white/50 dark:bg-black/30 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800"></div>
        <div className="relative px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-4 cursor-pointer" 
            onClick={() => setCurrentView('generator')}
            title="Back to Generator"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              CreoAI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="px-6 py-12 flex items-center justify-center flex-grow">
        <div className="w-full max-w-4xl">
           <div
             className={`relative bg-white/80 dark:bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-12 border border-gray-200 dark:border-gray-700/50 transition-all duration-300 ${showDropzone && isDraggingOver ? 'border-pink-500 border-dashed border-2 ring-4 ring-pink-500/30' : ''}`}
             onDragOver={handleDragOver}
             onDragEnter={handleDragEnter}
             onDragLeave={handleDragLeave}
             onDrop={handleDrop}
           >
            {showDropzone && isDraggingOver && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-900/50 rounded-3xl z-10 pointer-events-none">
                  <UploadCloud className="w-16 h-16 text-white/80 mb-4 animate-bounce" />
                  <p className="text-white text-xl font-bold">Drop your image or video here</p>
              </div>
            )}
            {renderContent()}
          </div>
        </div>
      </main>
      
      <footer className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        <button onClick={() => setCurrentView('admin')} className="hover:underline focus:underline mx-2 transition-colors">Admin</button>
        <span className="opacity-50">|</span>
        <button onClick={() => setCurrentView('testing')} className="hover:underline focus:underline mx-2 transition-colors">Testing</button>
      </footer>
    </div>
  );
};

export default App;