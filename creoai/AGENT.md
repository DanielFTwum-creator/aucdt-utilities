# creoai - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for creoai.

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: admin.html
```html

```

### FILE: App.tsx
```typescript
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
```

### FILE: components/admin/AdminPanel.tsx
```typescript
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { AuditLogEntry } from '../../types';
import AuditLog from '../AuditLog';

interface AdminPanelProps {
  log: AuditLogEntry[];
  addLogEntry: (action: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ log, addLogEntry }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    addLogEntry(`Admin user '${user}' logged out.`);
    logout();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
          <p className="text-gray-600 dark:text-gray-400">Welcome, {user}.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-5 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title="Log out from the admin panel"
        >
          Logout
        </button>
      </div>
      <AuditLog log={log} />
    </div>
  );
};

export default AdminPanel;
```

### FILE: components/admin/Login.tsx
```typescript
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginProps {
  addLogEntry: (action: string) => void;
}

const Login: React.FC<LoginProps> = ({ addLogEntry }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    addLogEntry('Admin login attempt.');
    
    const success = await login(password);
    
    setIsLoading(false);
    if (success) {
      addLogEntry('Admin login successful.');
    } else {
      setError('Invalid password.');
      addLogEntry('Admin login failed.');
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 dark:text-gray-400 mb-2 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-pink-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <button 
          type="submit" 
          className="w-full px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:bg-pink-400" 
          disabled={isLoading}
          title="Submit credentials to log in"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
```

### FILE: components/AuditLog.tsx
```typescript
import React from 'react';
import type { AuditLogEntry } from '../types';

interface AuditLogProps {
  log: AuditLogEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ log }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Audit Log</h3>
      <div 
        className="rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
      >
        {log.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center pt-4">No log entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {log.map((entry, index) => (
              <li 
                key={index} 
                className="text-sm font-mono p-3 rounded-md bg-white dark:bg-gray-800/60 shadow-sm"
              >
                <span className="text-pink-600 dark:text-pink-400 mr-2">{entry.timestamp.toLocaleTimeString()}</span>
                <span className="text-amber-600 dark:text-amber-400 mr-2">[{entry.user}]</span>
                <span className="text-gray-700 dark:text-gray-300">{entry.action}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
```

### FILE: components/Flyer.tsx
```typescript
import React from 'react';
import type { FlyerData, TextElement } from '../types';

interface FlyerProps {
  imageUrl: string | null;
  flyerData: FlyerData;
}

const getTextColorClass = (colorName: string | undefined) => {
  switch (colorName) {
    case 'primaryText': return 'text-primary-text';
    case 'goldAccent': return 'text-gold-accent';
    default: return 'text-white';
  }
};

const getButtonColorClass = (colorName: string | undefined) => {
    switch (colorName) {
      case 'burgundyPrimary': return 'bg-burgundy-primary hover:opacity-90 text-white';
      case 'goldAccent': return 'bg-gold-accent hover:opacity-90 text-primary-text';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
}

// SVG Icons for Social Media
const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44c0-.795-.645-1.44-1.441-1.44z"></path>
    </svg>
);
const XIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
    </svg>
);
const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);
  
const getSocialIcon = (platform: 'instagram' | 'x' | 'linkedin') => {
    switch(platform) {
        case 'instagram': return <InstagramIcon />;
        case 'x': return <XIcon />;
        case 'linkedin': return <LinkedInIcon />;
        default: return null;
    }
}

const Flyer: React.FC<FlyerProps> = ({ imageUrl, flyerData }) => {
  const { text_elements, column_widths } = flyerData;
  const rightColumnButtons = text_elements.filter(el => el.type === 'button');
  const imagePosition = 'left'; // Hardcoded for baseline

  const imageStyle = {
      backgroundImage: `url(${imageUrl})`,
  };

  const renderTextElement = (element: TextElement, index: number) => {
    const sizeClass = element.size === 'large' ? 'text-4xl' : 'text-base';
    const weightClass = element.weight === 'bold' ? 'font-bold' : 'font-normal';
    const textColorClass = getTextColorClass(element.color);
    
    switch (element.type) {
      case 'headline':
        return <h1 key={index} className={`mb-4 leading-tight ${sizeClass} ${weightClass} ${textColorClass}`}>{element.text}</h1>;
      case 'subheading':
        return <p key={index} className={`mb-8 ${sizeClass} ${weightClass} ${textColorClass}`}>{element.text}</p>;
      case 'bullet':
        return (
          <div key={index} className="flex items-center mb-6">
            <svg className="w-6 h-6 mr-3 text-burgundy-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className={`text-primary-text`}>{element.text}</span>
          </div>
        );
      case 'divider':
        return <hr key={index} className="my-4 border-t border-warm-beige" />;
      case 'social_links':
        return (
          <div key={index} className="text-center">
            <p className="text-sm font-semibold text-primary-text mb-3">{element.text}</p>
            <div className="flex justify-center items-center gap-4">
              {element.links?.map((link) => (
                <div 
                  key={link.platform} 
                  className="flex items-center gap-2 text-primary-text"
                >
                  {getSocialIcon(link.platform)}
                  <span className="text-xs font-medium">
                    {link.handle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const textColumnContent = (
    <>
      <div>
        {text_elements.map((el, i) => el.type !== 'button' && renderTextElement(el, i))}
      </div>
      <div className="flex gap-4 mt-auto">
        {rightColumnButtons.map((btn, i) => (
             <button 
              key={i} 
              className={`w-full p-3 rounded font-bold text-sm ${getButtonColorClass(btn.color)}`}
             >
               <span>{btn.text}</span>
             </button>
           )
        )}
      </div>
    </>
  );

  const renderMediaColumn = (width: string) => {
    if (imageUrl) {
      return (
        <div
          className="bg-cover bg-center h-full"
          style={{ width, ...imageStyle }}
        ></div>
      );
    }
    return <div style={{ width }} className="bg-gray-200 h-full"></div>;
  };
  
  const textColumn = <div className="p-8 flex flex-col justify-between" style={{ width: column_widths.right, height: '100%' }}>{textColumnContent}</div>;
  const mediaColumn = renderMediaColumn(column_widths.left);

  return (
    <div id="flyer-container" className="w-full max-w-sm aspect-[9/16] rounded-lg shadow-2xl overflow-hidden bg-white flex">
      {imagePosition === 'left' ? (
        <>
          {mediaColumn}
          {textColumn}
        </>
      ) : (
        <>
          {textColumn}
          {mediaColumn}
        </>
      )}
    </div>
  );
};

export default Flyer;
```

### FILE: components/ImageCropper.tsx
```typescript
import React, { useState, useRef, TouchEvent, WheelEvent, MouseEvent } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (url: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartDistance = useRef<number | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const imageStartPos = useRef({ x: 0, y: 0 });

  const handleCrop = async () => {
    if (imageContainerRef.current) {
      setIsCropping(true);
      try {
        const canvas = await html2canvas(imageContainerRef.current, { 
          useCORS: true,
          backgroundColor: null,
          width: imageContainerRef.current.clientWidth,
          height: imageContainerRef.current.clientHeight,
        });
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.92);
        onCropComplete(croppedImageUrl);
      } catch (e) {
        console.error("Image cropping failed:", e);
        onCancel(); // Fallback on error
      }
    } else {
      onCropComplete(imageUrl);
    }
  };

  const getDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };
  
  // Mouse Drag Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    imageStartPos.current = position;
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStart.current.x);
    const dy = (e.clientY - dragStart.current.y);
    setPosition({
      x: imageStartPos.current.x + dx,
      y: imageStartPos.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (imageContainerRef.current) {
      imageContainerRef.current.style.cursor = 'grab';
    }
  };

  // Touch Handlers for Pinch-to-Zoom and Pan
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      imageStartPos.current = position;
      touchStartDistance.current = null;
    } else if (e.touches.length === 2) {
      e.preventDefault();
      setIsDragging(false);
      touchStartDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const dx = (touch.clientX - dragStart.current.x);
      const dy = (touch.clientY - dragStart.current.y);
      setPosition({
        x: imageStartPos.current.x + dx,
        y: imageStartPos.current.y + dy,
      });
    } else if (e.touches.length === 2 && touchStartDistance.current) {
      e.preventDefault();
      const newDistance = getDistance(e.touches);
      const scale = newDistance / touchStartDistance.current;
      setZoom(prevZoom => Math.max(1, Math.min(prevZoom * scale, 5)));
      touchStartDistance.current = newDistance;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartDistance.current = null;
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newZoom = zoom - e.deltaY * 0.01;
    setZoom(Math.max(1, Math.min(newZoom, 5)));
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(parseFloat(e.target.value));
  };


  return (
    <div className="text-center">
        {isCropping && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-60 backdrop-blur-sm flex flex-col justify-center items-center z-50 rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mb-4"></div>
                <p className="text-white text-lg font-semibold">Processing Image...</p>
            </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Adjust Image</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Click and drag to pan. Use slider, mouse wheel, or pinch to zoom.
        </p>
        
        <div
          className="w-full max-w-sm aspect-[9/16] mx-auto overflow-hidden rounded-lg mb-6 shadow-inner bg-gray-200 dark:bg-gray-900 cursor-grab"
          ref={imageContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          <img
            src={imageUrl}
            alt="Preview for cropping"
            className="w-full h-auto"
            style={{ 
              transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`, 
              touchAction: 'none',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              maxWidth: 'none',
            }}
          />
        </div>
        
        <div className="flex items-center gap-4 mb-6 max-w-sm mx-auto">
          <ZoomOut className="w-5 h-5 text-gray-500" />
          <input
            type="range"
            min="1"
            max="5"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Zoom slider"
            title="Adjust the zoom level of the image"
            disabled={isCropping}
          />
          <ZoomIn className="w-5 h-5 text-gray-500" />
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={onCancel} 
            disabled={isCropping}
            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            title="Discard changes and cancel cropping"
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop} 
            disabled={isCropping}
            className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:opacity-50"
            title="Confirm the adjustment and use this image"
          >
            Use Image
          </button>
        </div>
      </div>
  );
};

export default ImageCropper;
```

### FILE: components/ImageFilters.tsx
```typescript
import React from 'react';
import { Sun, Contrast, RotateCcw } from 'lucide-react';

interface ImageFiltersProps {
  filters: {
    grayscale: number;
    sepia: number;
    invert: number;
    brightness: number;
    contrast: number;
  };
  onFilterChange: (filters: ImageFiltersProps['filters']) => void;
}

const initialFilters = {
  grayscale: 0,
  sepia: 0,
  invert: 0,
  brightness: 100,
  contrast: 100,
};

const ImageFilters: React.FC<ImageFiltersProps> = ({ filters, onFilterChange }) => {
  const handlePresetClick = (preset: 'grayscale' | 'sepia' | 'invert') => {
    onFilterChange({
      ...filters,
      [preset]: filters[preset] > 0 ? 0 : 100,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: parseInt(value, 10),
    });
  };

  const handleReset = () => {
    onFilterChange(initialFilters);
  };

  const presets = [
    { name: 'Grayscale', key: 'grayscale' as const },
    { name: 'Sepia', key: 'sepia' as const },
    { name: 'Invert', key: 'invert' as const },
  ];

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-2xl w-full max-w-sm border border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Image Filters</h4>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"
          aria-label="Reset all image filters"
          title="Reset all filters to their default values"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {presets.map(preset => (
          <button
            key={preset.key}
            onClick={() => handlePresetClick(preset.key)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filters[preset.key] > 0
                ? 'bg-pink-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            aria-pressed={filters[preset.key] > 0}
            title={`Toggle ${preset.name} filter`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <div className="space-y-2">
          <label htmlFor="brightness" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Sun size={16} className="mr-2" />
            Brightness ({filters.brightness}%)
          </label>
          <input
            id="brightness"
            name="brightness"
            type="range"
            min="50"
            max="200"
            value={filters.brightness}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Image brightness"
            title="Adjust image brightness"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="contrast" className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
            <Contrast size={16} className="mr-2" />
            Contrast ({filters.contrast}%)
          </label>
          <input
            id="contrast"
            name="contrast"
            type="range"
            min="50"
            max="200"
            value={filters.contrast}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            aria-label="Image contrast"
            title="Adjust image contrast"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageFilters;

```

### FILE: components/LoadingSpinner.tsx
```typescript
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 p-8" aria-label="Loading content">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      <p className="text-gray-600 dark:text-gray-400 font-semibold">Generating your flyer...</p>
    </div>
  );
};

export default LoadingSpinner;
```

### FILE: components/testing/TestRunner.tsx
```typescript
import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface TestRunnerProps {
  addLogEntry: (action: string) => void;
  onCaptureScreenshot: () => void;
  canCapture: boolean;
  onGenerateSample: () => void;
}

type TestResult = 'pass' | 'fail' | 'idle';

const TestRunner: React.FC<TestRunnerProps> = ({ addLogEntry, onCaptureScreenshot, canCapture, onGenerateSample }) => {
  const [selfTestResult, setSelfTestResult] = useState<TestResult>('idle');
  
  const handleGenerate = () => {
    addLogEntry('TestRunner: Triggered sample generation.');
    onGenerateSample();
  }

  const handleCapture = () => {
    if (canCapture) {
      addLogEntry('TestRunner: Triggered screenshot capture.');
      onCaptureScreenshot();
    }
  }
  
  const handleSelfTest = () => {
    addLogEntry('TestRunner: Started self-test.');
    // In a real app, process.env is a build-time substitution.
    // For this environment, we check for a placeholder value.
    // A more robust check might involve a lightweight API ping.
    if (process.env.API_KEY && process.env.API_KEY.length > 5) {
      setSelfTestResult('pass');
      addLogEntry('TestRunner: Self-test passed (API_KEY seems to be configured).');
    } else {
      setSelfTestResult('fail');
      addLogEntry('TestRunner: Self-test failed (API_KEY is missing or invalid).');
    }
  }

  return (
    <div className="text-gray-900 dark:text-white hc-text">
      <h2 className="text-2xl font-bold text-center mb-4">E2E Testing Control</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8 hc-text">
        Use these controls to simulate user actions and run diagnostics.
      </p>
      
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-8 hc-border">
          <h3 className="text-lg font-semibold mb-3">System Self-Test</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 hc-text">Check for critical configurations like the API key.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSelfTest}
              className="px-5 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors hc-primary"
              title="Run a quick diagnostic check"
            >
              Run Self-Test
            </button>
            {selfTestResult === 'pass' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle size={20} />
                <span className="font-semibold">Pass: API Key is configured.</span>
              </div>
            )}
            {selfTestResult === 'fail' && (
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                <XCircle size={20} />
                <span className="font-semibold">Fail: API Key not found.</span>
              </div>
            )}
          </div>
      </div>
      
      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hc-border">
        <h3 className="text-lg font-semibold mb-3">Flyer Actions</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleGenerate} 
            className="px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors hc-primary"
            title="Start the flyer generation process using the default prompt"
          >
            Generate Sample Flyer
          </button>
          <button 
            onClick={handleCapture} 
            className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canCapture}
            title="Download a screenshot of the currently displayed flyer"
          >
            Capture Flyer Screenshot
          </button>
        </div>
        {!canCapture && (
           <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 hc-text">
              A flyer must be generated before a screenshot can be captured.
           </p>
        )}
      </div>

    </div>
  );
};

export default TestRunner;
```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Contrast } from 'lucide-react';
import type { Theme } from '../types';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeInfo = () => {
    switch (theme) {
      case 'dark':
        return { icon: <Moon className="w-5 h-5 text-indigo-400" />, next: 'High-contrast' };
      case 'high-contrast':
        return { icon: <Contrast className="w-5 h-5 text-yellow-400" />, next: 'Light' };
      case 'light':
      default:
        return { icon: <Sun className="w-5 h-5 text-amber-500" />, next: 'Dark' };
    }
  };

  const { icon, next } = getThemeInfo();

  return (
    <button
      onClick={cycleTheme}
      className="p-2.5 rounded-xl bg-white/60 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-all duration-300 shadow-md border border-gray-200 dark:border-gray-700/50 hc-bg hc-border"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {icon}
    </button>
  );
};

export default ThemeSwitcher;
```

### FILE: components/VideoFrameSelector.tsx
```typescript
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
```

### FILE: components/VideoLoading.tsx
```typescript
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
```

### FILE: constants.ts
```typescript
import type { FlyerData } from './types';

export const flyerData: FlyerData = {
  prompt: "A dynamic, high-contrast hero image of a confident, successful-looking Ghanaian university student, a product designer, in their creative workspace. They are actively engaged, holding a 3D-printed prototype, with digital sketches visible on a screen behind them. The studio has a modern, professional feel. The lighting is dramatic, and the overall mood is aspirational and culturally relevant. The focus is on the empowered creator and the tangible results of their work.",
  text_elements: [
    {
      type: "headline",
      text: "Your Future is By Design.",
      color: "primaryText",
      position: "top-right",
      size: "large",
      weight: "bold"
    },
    {
      type: "subheading",
      text: "Turn Your Passion for Creativity into a Thriving Career at AsanSka University College of Design & Technology.",
      color: "primaryText",
      position: "below-headline",
      size: "medium",
      weight: "normal",
      line_spacing: "loose"
    },
    {
      type: "bullet",
      number: 1,
      text: "Launch Your Own Brand",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "bullet",
      number: 2,
      text: "Master Industry-Standard Technology",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "bullet",
      number: 3,
      text: "Graduate with a Portfolio that Gets You Hired",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "bullet",
      number: 4,
      text: "Learn from Ghana's Top Design Professionals",
      icon: "checkmark-circle",
      spacing_below: "generous"
    },
    {
      type: "divider"
    },
    {
      type: "social_links",
      text: "Connect With Us",
      links: [
        { platform: 'instagram', handle: '@aucdt.ghana' },
        { platform: 'x', handle: '@AUCDT_Ghana' },
        { platform: 'linkedin', handle: 'school/aucdt' }
      ]
    },
    {
      type: "button",
      style: "primary",
      text: "APPLY NOW",
      color: "burgundyPrimary",
      position: "bottom-left",
      width: "45%"
    },
    {
      type: "button",
      style: "secondary",
      text: "SEE OUR STUDENTS' WORK",
      color: "goldAccent",
      position: "bottom-right",
      width: "45%"
    }
  ],
  layout: "two-column asymmetric",
  column_widths: {
    left: "40%",
    right: "60%"
  },
  color_palette: {
    primary: "burgundyPrimary",
    secondary: "goldAccent",
    text: "primaryText",
    background: "white",
  },
  spacing: {
    between_bullets: "generous",
    between_buttons: "medium",
    margin_right: "large"
  },
  typography: {
    headline: "bold, large",
    body: "normal weight, medium size",
    bullets: "normal weight, medium size",
    font_family: "'Poppins', sans-serif"
  },
  visual_elements: {
    neon_shapes: "none",
    neon_lines: "none",
    lighting: "dramatic",
    floor: "modern studio"
  },
  format: "vertical flyer, print design",
  aspect_ratio: "9:16",
  quality: "high definition, print-ready",
  critical_instruction: "RENDER TEXT EXACTLY AS PROVIDED. DO NOT MODIFY. Use generous vertical spacing between bullet points. Position buttons side-by-side at bottom."
};
```

### FILE: context/AuthContext.tsx
```typescript
import React, { createContext, useState, ReactNode } from 'react';
import type { AuthContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be a more secure secret.
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = async (password: string): Promise<boolean> => {
    // Simulate an async login process
    await new Promise(res => setTimeout(res, 500));
    if (password =[REDACTED_CREDENTIAL]
      setUser('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### FILE: context/ThemeContext.tsx
```typescript
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Theme, ThemeContextType } from '../types';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      if (['light', 'dark', 'high-contrast'].includes(storedTheme)) {
        return storedTheme;
      }
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch (e) {
      return 'dark'; // Fallback to dark theme
    }
  });

  useEffect(() => {
    const body = window.document.body;
    body.classList.remove('dark', 'high-contrast');
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (theme === 'high-contrast') {
      body.classList.add('high-contrast');
    }
    
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference to localStorage.');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### FILE: CREATION.md
```md
# creoai

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

```

### FILE: docs/AdminGuide.md
```md
# CreoAI - Administrator's Guide

## 1. Introduction

This guide provides instructions for accessing and using the administrative features of the CreoAI application. The admin panel is designed for monitoring application activity and performing basic administrative tasks.

## 2. Accessing the Admin Panel

1.  Navigate to the main application URL.
2.  In the header, click on the **"Admin"** tab.
3.  You will be presented with a login screen.
4.  Enter the administrator password into the password field.

    -   **Default Password:** `password123`

5.  Click the "Login" button.

Upon successful authentication, you will be redirected to the Admin Panel.

## 3. Admin Panel Features

The Admin Panel provides a centralized view of key application information and actions.

### 3.1. Welcome Section

The top of the panel displays a welcome message with the current user's name (e.g., "Welcome, admin."). It also contains the **Logout** button. Clicking this button will immediately end your session and return you to the login screen.

### 3.2. Audit Log

The Audit Log is a critical feature for monitoring application usage. It displays a real-time, reverse-chronological list of significant events that occur within the application.

Each log entry contains the following information:

-   **Timestamp:** The time the event occurred.
-   **User:** The user who performed the action. This will be "admin" for actions performed in the panel, or "system" for user-driven actions in the generator tab.
-   **Action:** A description of the event that occurred.

**Examples of Logged Actions:**

-   `Admin login successful.`
-   `Image flyer generation started.`
-   `Flyer generation failed: The provided API Key is invalid.`
-   `Application state reset.`
-   `Admin user 'admin' logged out.`

The log is scrollable, allowing you to review the history of actions performed during the current application session. **Note:** The log is stored in-memory and will reset if the browser page is refreshed.
```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — creoai

**Application:** creoai
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_creoai_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — creoai

**Application:** creoai
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd creoai
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build creoai
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up creoai
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DeploymentGuide.md
```md
# CreoAI - Deployment Guide

## 1. Introduction

This document outlines the process for deploying the CreoAI application. As a client-side React application built with static files, it can be hosted on any modern static web hosting service.

## 2. Prerequisites

-   A valid Google Gemini API Key with the "Imagen API" enabled.
-   A web server or static hosting provider (e.g., Vercel, Netlify, AWS S3, GitHub Pages).

## 3. Configuration

The single most important configuration step is setting the Gemini API key.

### API Key Configuration

The application is designed to read the API key from a `process.env.API_KEY` variable. When deploying, you must ensure this environment variable is correctly configured in your hosting provider's build environment.

**DO NOT hardcode your API key directly into the source code.** This is a major security risk.

**Example Configuration on Vercel/Netlify:**

1.  Go to your project's settings in your hosting provider's dashboard.
2.  Find the section for "Environment Variables".
3.  Add a new environment variable:
    -   **Name / Key:** `API_KEY`
    -   **Value:** `Your-Gemini-API-Key-Here`

The application's tooling will make this key available to the `geminiService.ts` file.

## 4. Deployment Steps

The application consists of static HTML, TypeScript (transpiled to JavaScript), and assets. There is no backend server to run.

### Step 1: Obtain the Source Files

Ensure you have the complete source code, including:
- `index.html`
- `index.tsx`
- `App.tsx`
- All files in the `components/`, `services/`, `context/`, `hooks/`, `docs/`, and `tests/` directories.

### Step 2: Configure Hosting Provider

1.  Connect your Git repository (containing the source code) to your chosen hosting provider (e.g., Netlify, Vercel).
2.  Configure the build settings. Since this project uses modern tooling that can be auto-detected by most platforms, you likely won't need to specify a build command or publish directory.
3.  **Crucially, set the `API_KEY` environment variable as described in Section 3.**

### Step 3: Deploy

-   Push your code to the connected Git repository.
-   The hosting provider will automatically trigger a new deployment.
-   Once the deployment is complete, your application will be live at the provided URL.

## 5. Example: Deploying to Netlify

1.  Push the project code to a GitHub/GitLab/Bitbucket repository.
2.  Sign up for a Netlify account and select "Add new site" -> "Import an existing project".
3.  Authorize Netlify to access your Git provider and select the repository.
4.  Netlify will likely auto-detect the settings. You do not need to specify a build command or a publish directory.
5.  Before clicking "Deploy", go to "Advanced build settings" or navigate to the site's settings after creation.
6.  Go to "Site settings" > "Build & deploy" > "Environment".
7.  Add the `API_KEY` environment variable.
8.  Trigger a new deploy. Your site will be live.
```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Creoai
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Creoai**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Creoai** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Creoai** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/SRS_current_state.md
```md
# Software Requirements Specification (SRS)
## for CreoAI (Current State)

**Version 2.0**

**Prepared by:** AI Senior Frontend Engineer
**Date:** [Current Date]

---

### Table of Contents
1. [Introduction](#1-introduction)
   1.1 [Purpose](#11-purpose)
   1.2 [Scope](#12-scope)
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
2. [Overall Description](#2-overall-description)
   2.1 [Product Perspective](#21-product-perspective)
   2.2 [Product Functions](#22-product-functions)
   2.3 [User Characteristics](#23-user-characteristics)
   2.4 [Constraints](#24-constraints)
   2.5 [System Architecture](#25-system-architecture)
3. [System Features](#3-system-features)
   3.1 [Flyer Generation & Customization](#31-flyer-generation--customization)
   3.2 [Video-based Flyer Generation](#32-video-based-flyer-generation)
   3.3 [Theming and Accessibility](#33-theming-and-accessibility)
   3.4 [Administration](#34-administration)
   3.5 [Interactive Testing](#35-interactive-testing)
   3.6 [Flyer Management](#36-flyer-management)
4. [External Interface Requirements](#4-external-interface-requirements)
   4.1 [User Interfaces](#41-user-interfaces)
   4.2 [Software Interfaces](#42-software-interfaces)
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   5.1 [Performance Requirements](#51-performance-requirements)
   5.2 [Security Requirements](#52-security-requirements)
   5.3 [Usability and Accessibility Requirements](#53-usability-and-accessibility-requirements)

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to provide a detailed description of the requirements for the CreoAI application, Version 2.0. This version includes significant enhancements such as AI-powered video generation, an admin panel, accessibility features, a testing suite, and flyer customization options. This document is intended for project stakeholders, developers, and testers.

#### 1.2 Scope
CreoAI is a feature-rich web application that enables users to generate and customize a professional business flyer. This version introduces a multi-tab interface for accessing the core generator, a password-protected admin section for monitoring, and an interactive testing panel. Key features include AI image generation, AI video generation using Google's Veo model, video frame selection for flyer imagery, user image and video uploads (including drag-and-drop), interactive text editing, and layout adjustments.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **ARIA:** Accessible Rich Internet Applications
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **SRS:** Software Requirements Specification
- **WCAG:** Web Content Accessibility Guidelines
- **Veo:** A video generation model from Google.

---

### 2. Overall Description

#### 2.1 Product Perspective
CreoAI is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API. It does not have its own backend or database. State, such as authentication and audit logs, is managed in-memory for the duration of a user session. Flyer designs can be saved to and loaded from the browser's `localStorage`.

#### 2.2 Product Functions
The functions of the application include:
- A tabbed navigation system for "Generator", "Admin", and "Testing" views.
- AI-powered flyer image generation.
- AI-powered video generation to create short clips based on the flyer's theme.
- An interactive video frame selector allowing users to choose a moment from a generated video to use as their flyer's image.
- An integrated API key selection flow for features requiring Google Cloud project billing (e.g., video generation).
- Support for user-uploaded images and videos, via both file selection and drag-and-drop.
- Interactive, in-place editing of all text elements on the flyer.
- Controls for adjusting the flyer layout and image filters.
- Functionality to save, load, and delete flyer designs.
- A theme switcher for Light, Dark, and High-Contrast modes.
- A password-protected "Admin" section with an audit log.
- An "Testing" section with a system self-test and screenshot capture tool.

#### 2.3 User Characteristics
- **General Users:** Marketers, designers, or small business owners who need to create and customize flyers quickly.
- **Administrators:** Users with the admin password who need to monitor application events via the audit log.
- **Developers/Testers:** Users who will utilize the "Testing" tab to perform diagnostics and capture results.

#### 2.4 Constraints
- The application must run in all modern web browsers.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`).
- Session-based data (login status, audit log) is ephemeral and does not persist across page reloads.

#### 2.5 System Architecture
The application follows a simple client-server architecture where the client is the user's browser and the server is the Google Gemini API. There is no intermediary application server.

- **System Architecture Diagram:** An SVG diagram (`docs/system_architecture.svg`) illustrates the flow from the user to the browser application and to the Gemini API.
- **Database Architecture Diagram:** An SVG diagram (`docs/database_architecture.svg`) explains the non-database approach, highlighting the use of in-memory state and `localStorage`.

---

### 3. System Features

#### 3.1 Flyer Generation & Customization
- **3.1.1 Description and Priority:** Core functionality allowing users to create and modify flyers using static images. Priority: High.
- **3.1.2 Functional Requirements:**
    - The system shall allow flyer creation via AI image generation or user image upload.
    - The system shall support drag-and-drop functionality, allowing users to drop an image file onto the main generator area to initiate the upload process.
    - The system shall provide an image adjustment modal after image generation/upload, allowing the user to pan and zoom the image.
    - The system shall allow users to click on any text element on the rendered flyer and edit its content directly.
    - The system shall provide layout controls and image filters for customization.

#### 3.2 Video-based Flyer Generation
- **3.2.1 Description and Priority:** Generate or upload a short video and allow the user to select a frame from it to use as the flyer image. Priority: High.

- **3.2.2 AI Video Generation Functional Requirements:**
    - The system shall present an option to "Generate Video Flyer".
    - Before generation, the system must verify a user-selected API key is available via `window.aistudio`. If not, it must prompt the user to select one, as this is a billable feature.
    - The system shall call the Gemini `veo-3.1-fast-generate-preview` model.
    - The system must display a dedicated loading indicator with reassuring text, as generation can take several minutes.
    - The system shall poll the API until the video generation operation is complete.
    - Upon completion, the system shall display the generated video in a player with controls.
    - The user must be able to capture the current frame of the video.
    - The captured frame shall then be used in the image cropper, following the existing image workflow.

- **3.2.3 User Video Upload Functional Requirements:**
    - The system shall present an option to "Upload Video".
    - The system shall provide a file selection dialog that accepts common video formats (e.g., MP4, MOV, WebM).
    - The system shall support drag-and-drop functionality, allowing users to drop a video file onto the main generator area to initiate the upload process.
    - Upon successful file selection, the system shall display the user's video in the same frame selector component used for AI-generated videos.
    - The user workflow for selecting and capturing a frame shall be identical to the AI-generated video workflow.

#### 3.3 Theming and Accessibility
- **3.3.1 Description and Priority:** Allows users to change the visual theme and ensures the application is accessible. Priority: High.
- **3.3.2 Functional Requirements:**
    - The UI shall include a theme switcher with options for "Light", "Dark", and "High-Contrast".
    - The chosen theme shall be persisted in the browser's `localStorage`.
    - All interactive elements shall have appropriate ARIA roles, states, and properties (e.g., `role="tab"`, `aria-selected`).
    - The application shall be fully navigable using only a keyboard.

#### 3.4 Administration
- **3.4.1 Description and Priority:** Provides a secure area for monitoring application events. Priority: Medium.
- **3.4.2 Functional Requirements:**
    - Access to the Admin tab shall be protected by a hardcoded password (`password123`).
    - The Admin Panel shall display an audit log of all significant application events.
    - The Admin Panel shall provide a "Logout" button.

#### 3.5 Interactive Testing
- **3.5.1 Description and Priority:** Provides tools for developers and testers to validate application health. Priority: Medium.
- **3.5.2 Functional Requirements:**
    - The "Testing" tab shall be accessible to all users.
    - The system shall provide a "Run Self-Test" button that checks for the presence and validity of the `API_KEY`.
    - The system shall provide a "Capture Flyer Screenshot" button, which uses `html2canvas` to download a PNG of the current flyer.

#### 3.6 Flyer Management
- **3.6.1 Description and Priority:** Allows users to persist and reuse their work. Priority: Medium.
- **3.6.2 Functional Requirements:**
    - The system shall allow a user to save the current flyer state (image, text, layout) with a user-provided name to `localStorage`.
    - The system shall display a list of saved flyers, allowing users to load or delete them.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- A main header shall contain the tab navigation (`role="tablist"`) and the Theme Switcher.
- The content area below the header will render the component corresponding to the active tab, acting as a `role="tabpanel"`.
- The main generator view shall act as a drop zone for file uploads, with clear visual feedback during drag operations.

#### 4.2 Software Interfaces
- **Google Gemini API:** The application will use the `@google/genai` library to call the `imagen-4.0-generate-001` and `veo-3.1-fast-generate-preview` models.
- **html2canvas Library:** The application will interface with the `html2canvas` library to capture DOM elements as images.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- Theme changes must apply instantaneously with no perceivable delay.
- The UI must remain responsive during all operations, especially during long-polling for video generation.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code and must be injected via environment variables.
- The admin password, while hardcoded for this project, should be managed securely in a production environment.

#### 5.3 Usability and Accessibility Requirements
- The application must strive for WCAG 2.1 AA compliance.
- All color palettes, including the high-contrast theme, must meet minimum contrast ratios.
- All interactive elements must have clear, visible focus states.
```

### FILE: docs/SRS_final.md
```md
# Software Requirements Specification (SRS)
## for CreoAI (Final Version)

**Version 2.0**

**Prepared by:** AI Senior Frontend Engineer
**Date:** [Current Date]

---

### Table of Contents
1. [Introduction](#1-introduction)
   1.1 [Purpose](#11-purpose)
   1.2 [Scope](#12-scope)
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
2. [Overall Description](#2-overall-description)
   2.1 [Product Perspective](#21-product-perspective)
   2.2 [Product Functions](#22-product-functions)
   2.3 [User Characteristics](#23-user-characteristics)
   2.4 [Constraints](#24-constraints)
   2.5 [System Architecture](#25-system-architecture)
3. [System Features](#3-system-features)
   3.1 [Flyer Generation](#31-flyer-generation)
   3.2 [Video-based Flyer Generation](#32-video-based-flyer-generation)
   3.3 [Theming and Accessibility](#33-theming-and-accessibility)
   3.4 [Administration](#34-administration)
   3.5 [Interactive Testing](#35-interactive-testing)
4. [External Interface Requirements](#4-external-interface-requirements)
   4.1 [User Interfaces](#41-user-interfaces)
   4.2 [Software Interfaces](#42-software-interfaces)
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   5.1 [Performance Requirements](#51-performance-requirements)
   5.2 [Security Requirements](#52-security-requirements)
   5.3 [Usability and Accessibility Requirements](#53-usability-and-accessibility-requirements)

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to provide a detailed description of the requirements for the CreoAI application, Version 2.0. This version includes significant enhancements such as AI-powered video generation, an admin panel, accessibility features, and a testing suite. This document is intended for project stakeholders, developers, and testers.

#### 1.2 Scope
The CreoAI application is a feature-rich web application that enables users to generate a professional business flyer from a predefined data structure. This version introduces a multi-tab interface for accessing the core generator, a password-protected admin section for monitoring, and an interactive testing panel. Key features include AI image generation, user image uploads, AI video generation using Google's Veo model, user video uploads (with drag-and-drop), and an interactive frame selector to choose flyer imagery.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **SRS:** Software Requirements Specification
- **WCAG:** Web Content Accessibility Guidelines
- **ARIA:** Accessible Rich Internet Applications
- **Veo:** A video generation model from Google.

---

### 2. Overall Description

#### 2.1 Product Perspective
CreoAI is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API. It does not have its own backend or database. State, such as authentication and audit logs, is managed in-memory for the duration of a user session.

#### 2.2 Product Functions
The functions of the application include:
- A tabbed navigation system to switch between "Generator", "Admin", and "Testing" views.
- AI-powered flyer image generation.
- User-uploaded image support for flyers, including drag-and-drop.
- AI-powered video generation to create short clips based on the flyer's theme.
- User-uploaded video support for flyers, including drag-and-drop.
- An interactive video frame selector allowing users to choose a moment from a generated or uploaded video to use as their flyer's image.
- An integrated API key selection flow for features requiring Google Cloud project billing (e.g., video generation).
- A theme switcher allowing users to select Light, Dark, or High-Contrast mode.
- A password-protected "Admin" section with an audit log.
- An "Testing" section with tools for self-testing and screenshot capture.

#### 2.3 User Characteristics
- **General Users:** Individuals who need to quickly generate a professional-looking flyer based on a predefined template.
- **Administrators:** Users with the admin password who need to monitor application events via the audit log.
- **Developers/Testers:** Users who will utilize the "Testing" tab to perform diagnostics and capture results.

#### 2.4 Constraints
- The application must run in all modern web browsers.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`).
- Session-based data (login status, audit log) is ephemeral and does not persist across page reloads.
- Video generation requires a user-selected Google Cloud API key with billing enabled.

#### 2.5 System Architecture
The application follows a simple client-server architecture where the client is the user's browser and the server is the Google Gemini API. There is no intermediary application server.

- **System Architecture Diagram:** See `docs/system_architecture.svg`
- **Database Architecture Diagram:** See `docs/database_architecture.svg`

---

### 3. System Features

#### 3.1 Flyer Generation
- **3.1.1 Description and Priority:** Core functionality to generate a flyer image using AI or a user-provided image. Priority: High.
- **3.1.2 Functional Requirements:**
    - The system shall provide a button to initiate the AI image generation process.
    - The system shall provide a button to allow users to upload their own image file (e.g., JPEG, PNG, WebP).
    - The system shall support drag-and-drop functionality, allowing users to drop an image file onto the main generator area to initiate the upload process.
    - Upon successful image generation or upload, the system shall present an image adjustment tool.
    - The final, cropped image shall be displayed in the flyer template.
    - The system shall provide options to download the final flyer or start over.

#### 3.2 Video-based Flyer Generation
- **3.2.1 Description and Priority:** Generate or upload a short video and allow the user to select a frame from it to use as the flyer image. Priority: High.

- **3.2.2 AI Video Generation Functional Requirements:**
    - The system shall present an option to "Generate Video Flyer".
    - Before generation, the system must verify a user-selected API key is available via `window.aistudio`. If not, it must prompt the user to select one, as this is a billable feature.
    - The system shall call the Gemini `veo-3.1-fast-generate-preview` model.
    - The system must display a dedicated loading indicator with reassuring text, as generation can take several minutes.
    - The system shall poll the API until the video generation operation is complete.
    - Upon completion, the system shall display the generated video in a player with controls.
    - The user must be able to capture the current frame of the video.
    - The captured frame shall then be used in the image cropper, following the existing image workflow.

- **3.2.3 User Video Upload Functional Requirements:**
    - The system shall present an option to "Upload Video".
    - The system shall provide a file selection dialog that accepts common video formats (e.g., MP4, MOV, WebM).
    - The system shall support drag-and-drop functionality, allowing users to drop a video file onto the main generator area to initiate the upload process.
    - Upon successful file selection, the system shall display the user's video in the same frame selector component used for AI-generated videos.
    - The user workflow for selecting and capturing a frame shall be identical to the AI-generated video workflow.
    - The system shall manage object URLs for uploaded videos and revoke them when they are no longer needed to prevent memory leaks.

#### 3.3 Theming and Accessibility
- **3.3.1 Description and Priority:** Allows users to change the visual theme and ensures the application is accessible. Priority: High.
- **3.3.2 Functional Requirements:**
    - The UI shall include a theme switcher with options for "Light", "Dark", and "High-Contrast".
    - The chosen theme shall be persisted in the browser's `localStorage`.
    - All interactive elements shall have appropriate ARIA roles, states, and properties.
    - All interactive elements must be keyboard-navigable and have visible focus indicators.

#### 3.4 Administration
- **3.4.1 Description and Priority:** Provides a secure area for monitoring application events. Priority: Medium.
- **3.4.2 Functional Requirements:**
    - Access to the Admin tab shall be protected by a hardcoded password (`password123`).
    - The Admin Panel shall display an audit log of all logged actions.
    - The Admin Panel shall provide a "Logout" button to terminate the admin session.

#### 3.5 Interactive Testing
- **3.5.1 Description and Priority:** Provides tools for developers and testers to validate application health. Priority: Medium.
- **3.5.2 Functional Requirements:**
    - The "Testing" tab shall be accessible to all users.
    - The system shall provide a "Run Self-Test" button that checks for the presence of the `API_KEY`.
    - The system shall provide a "Capture Flyer Screenshot" button which uses `html2canvas` to download a PNG of the current flyer.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- A main header shall contain the application title and the Theme Switcher.
- A main content area will render the active view (Generator, Admin, or Testing).
- The main generator view shall act as a drop zone for file uploads, with clear visual feedback during drag operations.
- A footer shall contain text links to navigate to the "Admin" and "Testing" views.

#### 4.2 Software Interfaces
- **Google Gemini API:** The application will use the `@google/genai` library to interface with the Gemini image generation (`imagen-4.0-generate-001`) and video generation (`veo-3.1-fast-generate-preview`) models.
- **html2canvas Library:** The application will interface with the `html2canvas` library (loaded via CDN) to capture DOM elements as images.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- Theme changes must apply instantaneously with no perceivable delay.
- The UI must remain responsive during all operations, especially during long-polling for video generation.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code.
- The admin password, while hardcoded for this project, should be managed securely in a production environment.

#### 5.3 Usability and Accessibility Requirements
- The application should strive for WCAG 2.1 AA compliance.
- The color palettes for all themes must meet minimum contrast ratios for text and UI elements.
- The tabbed interface must be intuitive and clearly indicate the active section.
```

### FILE: docs/TESTING.md
```md
# Testing Guide — creoai

**Application:** creoai
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd creoai
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/TestingGuide.md
```md
# CreoAI - Testing Guide

## 1. Introduction

This guide details the testing procedures for the CreoAI application. It covers both the in-app interactive testing tools and the external end-to-end (E2E) test suite.

## 2. Interactive Testing (In-App)

The "Testing" tab within the application provides tools for quick diagnostics and validation.

### 2.1. System Self-Test

This test performs a basic check of the application's runtime environment.

**How to Run:**
1.  Navigate to the **"Testing"** tab.
2.  Click the **"Run Self-Test"** button.
3.  Observe the status message that appears.

**Expected Outcomes:**
-   **`Pass: API Key is configured.`:** This indicates that the `API_KEY` environment variable has been correctly configured and is accessible to the application. This is the desired outcome.
-   **`Fail: API Key not found.`:** This indicates a critical configuration error. The application will not be able to generate images. To fix this, review the `DeploymentGuide.md` and ensure the environment variable is set correctly in your hosting environment.

### 2.2. Screenshot Capture

This feature allows you to capture a high-quality PNG image of the generated flyer.

**How to Use:**
1.  First, navigate to the **"Generator"** tab and successfully generate a flyer.
2.  Once the flyer is visible on the screen, navigate to the **"Testing"** tab.
3.  Click the **"Capture Flyer Screenshot"** button. The button will be enabled only if a flyer is present.
4.  Your browser will automatically download a file named `flyer-complete.png`.

## 3. End-to-End (E2E) Testing with Playwright

A Playwright test suite is provided to automate browser-based testing of the application's core user flow.

### 3.1. Prerequisites

-   [Node.js](https://nodejs.org/) installed on your machine.
-   The application must be running locally (e.g., on `http://localhost:3000`).
-   A valid `API_KEY` must be configured for the local environment.

### 3.2. Setup

1.  Open your terminal in the project's root directory.
2.  Install the required dependency (Playwright):
    ```bash
    npm install playwright
    ```

### 3.3. Running the Test

1.  Ensure your local development server is running.
2.  From the project's root directory, run the test script:
    ```bash
    node tests/flyer-generator.test.js
    ```
3.  The script will launch a headless Chromium browser, perform a series of actions, and log the results to the console. All test artifacts (screenshots, downloads) are saved in the `test-results/` directory.

### 3.4. Test Script Overview (`tests/flyer-generator.test.js`)

The test script performs the following automated actions:
1.  Launches a browser and navigates to the application.
2.  Verifies the initial page loads correctly.
3.  Cycles through all three themes (Light, Dark, High-Contrast).
4.  Navigates to the Admin tab, logs in, and verifies successful access.
5.  Navigates to the Testing tab and runs the self-test, verifying a "Pass" result.
6.  Navigates back to the Generator, initiates AI image generation.
7.  Waits for the image cropper, confirms the crop, and waits for the final flyer to render.
8.  Switches back to the Testing tab and triggers the "Capture Flyer Screenshot" action.
9.  Waits for and confirms that the `flyer-complete.png` file was successfully downloaded.
```

### FILE: hooks/useAuth.ts
```typescript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- ========== BASIC SEO META TAGS ========== -->
    <title>Techbridge University College | Pioneering Design & Technology</title>
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    
    <!-- 🆕 SEO ADDITION: Keywords -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    
    <!-- 🆕 SEO ADDITION: Author and Publisher -->
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    
    <!-- 🆕 SEO ADDITION: Canonical URL -->
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    
    <!-- 🆕 SEO ADDITION: Robots Meta Tag -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- 🆕 SEO ADDITION: Language and Geographic Targeting -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    
    <!-- ========== OPEN GRAPH META TAGS (Facebook, LinkedIn, etc.) ========== -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    
    <!-- ========== TWITTER CARD META TAGS ========== -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Techbridge University College | Pioneering Design & Technology" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    
    <!-- ========== ADDITIONAL SEO META TAGS ========== -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="rating" content="general" />
    <meta name="referrer" content="origin-when-cross-origin" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FKXTELQ71R"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-FKXTELQ71R');
    </script>
        
    <!-- Favicon / Tab Logo -->
    <link rel="icon" type="image/png" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    <link rel="apple-touch-icon" href="https://aucdt.edu.gh/tuc/TUC_LOGO.png" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
        [contentEditable="true"]:focus {
            outline: 2px solid #D4AF37; /* gold-accent */
            box-shadow: 0 0 8px rgba(212, 175, 55, 0.6);
            border-radius: 4px;
            background-color: rgba(212, 175, 55, 0.1);
        }
        [contentEditable="true"] {
            cursor: text;
        }
        .high-contrast {
            --color-bg-primary: #000000;
            --color-bg-secondary: #1a1a1a;
            --color-text-primary: #ffffff;
            --color-text-secondary: #f0f0f0;
            --color-accent: #ffff00;
            --color-border: #ffffff;
        }
        .high-contrast .hc-bg { background-color: var(--color-bg-primary); }
        .high-contrast .hc-text { color: var(--color-text-primary); }
        .high-contrast .hc-border { border-color: var(--color-border); }
        .high-contrast .hc-accent-text { color: var(--color-accent); }
        .high-contrast .hc-primary { background-color: var(--color-accent); color: var(--color-bg-primary); font-weight: bold; }
        .high-contrast button:focus-visible, .high-contrast a:focus-visible {
            outline: 3px solid #00ffff;
            outline-offset: 2px;
        }
    </style>
<link rel="stylesheet" href="/index.css">
</head>
<body>
    <div id="root"></div>
    <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "react/": "https://esm.sh/react@18.2.0/",
    "react-dom/": "https://esm.sh/react-dom@18.2.0/",
    "html2canvas": "https://esm.sh/html2canvas@1.4.1",
    "@google/genai": "https://esm.sh/@google/genai",
    "lucide-react": "https://esm.sh/lucide-react@0.344.0"
  }
}
</script>
    <script type="module" src="/index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "CreoAI",
  "description": "CreoAI is an AI-powered flyer generator that uses Gemini to create professional business flyers from detailed design briefs, including generating custom images and video-based backgrounds.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "creoai",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@google/genai": "latest",
    "html2canvas": "1.4.1",
    "lucide-react": "0.553.0",
    "react": "19.2.5",
    "react-dom": "19.2.5"
  },
  "devDependencies": {
    "@types/node": "^24.10.0",
    "@vitejs/plugin-react": "^5.1.0",
    "typescript": "~5.9.3",
    "vite": "^7.2.2",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "@playwright/test": "^1.49.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  reporter: [['html', { outputFolder: 'tests/playwright-report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1oAXNeIVSLPC3kP5Jl1fFwOguoLegJG6i

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/geminiService.ts
```typescript
import { GoogleGenAI, Modality } from "@google/genai";

type AspectRatio = "1:1" | "9:16" | "16:9" | "4:3" | "3:4";


/**
 * Generates an image using gemini-2.5-flash-image as a fallback.
 * @param {string} prompt - The text prompt to generate the image from.
 * @param {AspectRatio} aspectRatio - The desired aspect ratio for the generated image.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated image.
 */
const generateWithNanoBanana = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  console.log("Falling back to gemini-2.5-flash-image (nanobanana)...");
  // A new AI instance is created here as the primary one might be configured differently.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    // Add aspect ratio instruction to the prompt as it's not a config option for this model
    const augmentedPrompt = `${prompt}. The image must have a ${aspectRatio} aspect ratio.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: augmentedPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType; // e.g., 'image/png'
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("Fallback generation failed: no image data in response.");
  } catch (fallbackError) {
    console.error("Error during fallback image generation:", fallbackError);
    throw new Error("Primary and fallback image generation failed. Please check your API key and connection.");
  }
};


/**
 * Generates an image using the Google Gemini API based on a given prompt.
 * It first tries Imagen and falls back to gemini-2.5-flash-image on billing errors.
 * @param {string} prompt - The text prompt to generate the image from.
 * @param {AspectRatio} aspectRatio - The desired aspect ratio for the generated image.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated JPEG image.
 * @throws {Error} Throws an error if the image generation fails, or if the API returns no images.
 */
export const generateFlyerImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini (Imagen):", error);
    
    const errorString = String(error);

    if (errorString.includes('billed users')) {
      console.warn("Imagen failed due to a billing issue. Attempting fallback to gemini-2.5-flash-image.");
      return generateWithNanoBanana(prompt, aspectRatio);
    }
    
    if (errorString.includes('API key not valid')) {
       throw new Error("The provided API Key is invalid. Please check your environment variables.");
    }

    throw new Error("Failed to generate flyer image. Please check the console for details.");
  }
};


/**
 * Generates a video using the Google Gemini API (Veo) based on a prompt.
 * @param {string} prompt - The text prompt to generate the video from.
 * @returns {Promise<string>} A promise that resolves to a local object URL for the generated MP4 video.
 * @throws {Error} Throws an error if the video generation fails.
 */
export const generateFlyerVideo = async (prompt: string): Promise<string> => {
  // A new AI instance is created right before the call to ensure the latest API key from the dialog is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    console.log("Starting video generation with Veo...");
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Matches our flyer aspect ratio
      }
    });

    console.log("Polling for video generation status...");
    while (!operation.done) {
      // Wait for 10 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
      // FIX: The 'GenerateVideosOperation' type does not have a 'state' property.
      // Log the entire operation object for debugging.
      console.log('Current operation:', operation);
    }

    if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
      const downloadLink = operation.response.generatedVideos[0].video?.uri;
      if (!downloadLink) {
        throw new Error("Video generation succeeded, but no download link was provided.");
      }
      
      console.log("Fetching video from download link...");
      // The API key must be appended to the download URL
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      if (!response.ok) {
        throw new Error(`Failed to download video file: ${response.statusText}`);
      }
      
      const videoBlob = await response.blob();
      const objectUrl = URL.createObjectURL(videoBlob);
      console.log("Video generation complete. Object URL created.");
      return objectUrl;

    } else {
      console.error("Video generation operation finished but no video was returned.", operation);
      throw new Error("Video generation failed. The operation completed but did not return a video.");
    }

  } catch (error) {
    console.error("Error generating video with Gemini (Veo):", error);
    const errorString = String(error);

    if (errorString.includes('API key not valid')) {
       throw new Error("The provided API Key is invalid. Please check your environment variables or select a new key.");
    }
    
    if (errorString.includes('Requested entity was not found')) {
       throw new Error("Requested entity was not found. Your API Key may be invalid or expired. Please select a new one.");
    }

    throw new Error(`Failed to generate flyer video: ${errorString}`);
  }
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — creoai
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('creoai E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tests/e2e/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('CreoAI Flyer Generator', () => {
  test('should load and display app heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1');
    await expect(heading).toHaveText('CreoAI');
  });

  test('should display theme switcher button', async ({ page }) => {
    await page.goto('/');
    const themeBtn = page.locator('button[title^="Switch to"]');
    await expect(themeBtn).toBeVisible();
  });

  test('should switch theme when theme button is clicked', async ({ page }) => {
    await page.goto('/');
    const bodyClassBefore = await page.locator('body').getAttribute('class');
    await page.locator('button[title^="Switch to"]').click();
    const bodyClassAfter = await page.locator('body').getAttribute('class');
    expect(bodyClassBefore).not.toBe(bodyClassAfter);
  });

  test('should display admin login button in footer', async ({ page }) => {
    await page.goto('/');
    const adminBtn = page.getByRole('button', { name: /admin/i });
    await expect(adminBtn).toBeVisible();
  });

  test('should show admin password input when admin button is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /admin/i }).click();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

```

### FILE: tests/flyer-generator.test.js
```javascript
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const RESULTS_DIR = 'test-results';
const TIMEOUT = 60000; // 60 seconds for potentially slow AI generation
const ADMIN_PASSWORD = [REDACTED_CREDENTIAL]

const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const takeScreenshot = async (page, name) => {
    const filePath = path.join(RESULTS_DIR, `${name}.png`);
    await page.screenshot({ path: filePath });
    console.log(`📸 Screenshot saved: ${filePath}`);
};

(async () => {
    ensureDirExists(RESULTS_DIR);
    console.log('🚀 Starting E2E test suite for CreoAI...');

    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    try {
        console.log(`Navigating to ${APP_URL}`);
        await page.goto(APP_URL, { waitUntil: 'networkidle2' });

        // 1. Test Initial Page Load
        console.log('✅ Verifying initial page load...');
        await page.waitForSelector('h1', { timeout: 5000 });
        const heading = await page.$eval('h1', el => el.textContent.trim());
        if (heading !== 'CreoAI') {
            throw new Error(`Unexpected heading: "${heading}"`);
        }
        await takeScreenshot(page, '01-initial-load');
        console.log('Page loaded successfully.');

        // 2. Test Theme Switching
        console.log('🧪 Testing theme switcher...');
        const getBodyClasses = () => page.evaluate(() => document.body.className);
        
        let initialClasses = await getBodyClasses();
        console.log(`Initial theme classes: "${initialClasses}"`);

        const themeButtonSelector = 'button[title^="Switch to"]';
        
        await page.click(themeButtonSelector);
        await page.waitForTimeout(500);
        let secondThemeClasses = await getBodyClasses();
        console.log(`Second theme classes: "${secondThemeClasses}"`);
        if (initialClasses === secondThemeClasses) throw new Error('Theme did not change on first click');
        await takeScreenshot(page, '02-theme-change-1');

        await page.click(themeButtonSelector);
        await page.waitForTimeout(500);
        let thirdThemeClasses = await getBodyClasses();
        console.log(`Third theme classes: "${thirdThemeClasses}"`);
        if (secondThemeClasses === thirdThemeClasses) throw new Error('Theme did not change on second click');
        await takeScreenshot(page, '03-theme-change-2');
        
        console.log('Theme switching works correctly.');

        // 3. Test Admin Login
        console.log('🧪 Testing admin login...');
        await page.click('footer button ::-p-text(Admin)');
        await page.waitForSelector('input[type="password"]');
        await page.type('input[type="password"]', ADMIN_PASSWORD);
        await page.click('button[type="submit"]');
        await page.waitForSelector('h2 ::-p-text(Admin Panel)');
        console.log('Admin login successful.');
        await takeScreenshot(page, '04-admin-panel');

        // 4. Test Self-Test Feature
        console.log('🧪 Testing self-test feature...');
        await page.click('footer button ::-p-text(Testing)');
        await page.waitForSelector('button ::-p-text(Run Self-Test)');
        await page.click('button ::-p-text(Run Self-Test)');
        await page.waitForSelector('span ::-p-text(Pass: API Key is configured.)');
        console.log('Self-test passed.');
        await takeScreenshot(page, '05-self-test-passed');
        
        // 5. Test Flyer Generation and Screenshot Capture
        console.log('🧪 Starting flyer generation test...');
        await page.click('h1 ::-p-text(CreoAI)'); // Navigate back to generator
        await page.waitForSelector('#generate-flyer-btn');
        await page.click('#generate-flyer-btn');

        console.log('⏳ Waiting for image cropper to appear...');
        await page.waitForSelector('h2 ::-p-text(Adjust Image)', { visible: true, timeout: TIMEOUT });
        console.log('✅ Image cropper modal appeared.');
        await takeScreenshot(page, '06-image-cropper');
        
        await page.click('button ::-p-text(Use Image)');
        console.log('⏳ Waiting for flyer to be rendered...');
        await page.waitForSelector('#flyer-container', { timeout: 10000 });
        
        await page.waitForFunction(
            () => {
                const flyerDiv = document.querySelector('#flyer-container > div:first-child');
                return flyerDiv && flyerDiv.style.backgroundImage.includes('data:image/jpeg;base64,');
            }, 
            { timeout: 10000 }
        );
        console.log('✅ Flyer generated successfully!');
        await takeScreenshot(page, '07-successful-generation');
        
        console.log('🧪 Testing screenshot capture...');
        await page.click('footer button ::-p-text(Testing)');
        
        const downloadPath = path.resolve(RESULTS_DIR);
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadPath,
        });

        await page.waitForSelector('button ::-p-text(Capture Flyer Screenshot)');
        await page.click('button ::-p-text(Capture Flyer Screenshot)');
        
        const expectedFile = path.join(downloadPath, 'flyer-complete.png');
        console.log(`⏳ Waiting for download of ${expectedFile}...`);
        await new Promise((resolve, reject) => {
           let checkCount = 0;
           const interval = setInterval(() => {
               if(fs.existsSync(expectedFile)) {
                   clearInterval(interval);
                   resolve();
               } else if (checkCount > 20) { // 10 second timeout
                   clearInterval(interval);
                   reject(new Error('Download did not complete in time.'));
               }
               checkCount++;
           }, 500);
        });

        console.log('✅ Screenshot captured and downloaded successfully!');

    } catch (error) {
        console.error('\n🔥 An error occurred during the E2E test:', error);
        await takeScreenshot(page, '99-error-screenshot');
        process.exit(1); // Exit with a non-zero code to indicate failure
    } finally {
        await browser.close();
        console.log('\n✅ E2E test suite finished.');
    }
})();
```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export interface TextElement {
  type: 'headline' | 'subheading' | 'bullet' | 'button' | 'divider' | 'social_links';
  text?: string;
  color?: string;
  position?: string;
  size?: string;
  weight?: string;
  line_spacing?: string;
  number?: number;
  icon?: string;
  spacing_below?: string;
  style?: 'primary' | 'secondary';
  width?: string;
  links?: { platform: 'instagram' | 'x' | 'linkedin'; handle: string }[];
}

export interface FlyerData {
  prompt: string;
  text_elements: TextElement[];
  layout: string;
  column_widths: {
    left: string;
    right: string;
  };
  color_palette: {
    [key:string]: string;
  };
  spacing: {
    [key:string]: string;
  };
  typography: {
    [key:string]: string;
  };
  visual_elements: {
    [key:string]: string;
  };
  format: string;
  aspect_ratio: string;
  quality: string;
  critical_instruction: string;
}

// FIX: Define and export missing types
export type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface AuthContextType {
  user: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export interface AuditLogEntry {
  timestamp: Date;
  user: string;
  action: string;
}

// FIX: Define the AIStudio interface to be used for the global window object.
// FIX: Removed 'export' keyword to resolve type declaration conflict. This interface is for augmenting the global scope and should not be exported from the module.
interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
}

// FIX: Augment the global Window interface to include `aistudio`.
declare global {
    interface Window {
        aistudio: AIStudio;
    }
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — creoai
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — creoai
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

