# ai-flyer-generator - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for ai-flyer-generator.

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
import React, { useState, useCallback, ChangeEvent } from 'react';
import html2canvas from 'html2canvas';
import { Sparkles, Image, Video, Menu } from 'lucide-react';

import { flyerData } from './constants';
import { generateFlyerImage } from './services/geminiService';
import Flyer from './components/Flyer';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import Login from './components/admin/Login';
import AdminPanel from './components/admin/AdminPanel';
import TestRunner from './components/testing/TestRunner';
import VideoFrameSelector from './components/VideoFrameSelector';
import ImageCropper from './components/ImageCropper';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useTheme } from './context/ThemeContext';

type Tab = 'generator' | 'admin' | 'testing';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generator');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<any[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { theme } = useTheme();

  const { user } = useAuth();

  const addLogEntry = useCallback((action: string) => {
    setLog(prevLog => [{ timestamp: new Date(), user: user || 'system', action }, ...prevLog]);
  }, [user]);

  const handleGeneration = async () => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    setVideoUrl(null);
    setImageToCrop(null);
    addLogEntry('Flyer generation started.');

    try {
      const url = await generateFlyerImage(flyerData.prompt);
      setImageToCrop(url);
      addLogEntry('AI image generated successfully.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      addLogEntry(`Flyer generation failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerationFromTest = () => {
    setActiveTab('generator');
    handleGeneration();
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target && typeof loadEvent.target.result === 'string') {
          setImageToCrop(loadEvent.target.result);
          addLogEntry('Image uploaded by user.');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setVideoUrl(URL.createObjectURL(file));
        addLogEntry('Video uploaded by user.');
    }
  };

  const resetState = () => {
    setIsLoading(false);
    setError(null);
    setImageUrl(null);
    setVideoUrl(null);
    setImageToCrop(null);
    addLogEntry('Application state reset.');
  };
  
  const handleDownloadImage = () => {
    if(!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'flyer-image.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLogEntry('Downloaded flyer image.');
  };
  
  const handleDownloadFlyer = () => {
    const flyerElement = document.getElementById('flyer-container');
    if (flyerElement) {
        html2canvas(flyerElement, { useCORS: true, backgroundColor: null }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'flyer-complete.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addLogEntry('Downloaded complete flyer.');
        }).catch(err => {
            console.error("Flyer capture failed:", err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Could not download flyer: ${errorMessage}`);
            addLogEntry(`Failed to download flyer: ${errorMessage}`);
        });
    }
  };

  const options = [
    {
      id: 'ai',
      icon: Sparkles,
      title: 'Generate with AI',
      description: 'Create stunning flyers using artificial intelligence',
      color: 'from-pink-600 to-rose-600',
      hoverColor: 'from-pink-500 to-rose-500',
      action: handleGeneration,
      type: 'button'
    },
    {
      id: 'image',
      icon: Image,
      title: 'Upload Image',
      description: 'Start with your own image design',
      color: 'from-amber-500 to-yellow-500',
      hoverColor: 'from-amber-400 to-yellow-400',
      action: handleImageUpload,
      type: 'image-upload'
    },
    {
      id: 'video',
      icon: Video,
      title: 'Upload Video',
      description: 'Transform video content into flyers',
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'from-amber-400 to-orange-400',
      action: handleVideoUpload,
      type: 'video-upload'
    }
  ];
  
  const renderGeneratorContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return (
        <div className="text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-4">Generation Failed</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button onClick={resetState} className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors">Try Again</button>
        </div>
    );
    if (imageUrl) return (
      <div className="flex flex-col items-center gap-8">
          <Flyer imageUrl={imageUrl} flyerData={flyerData} />
          <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={handleDownloadImage} className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Download Image</button>
              <button onClick={handleDownloadFlyer} className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors">Download Flyer</button>
              <button onClick={resetState} className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Start Over</button>
          </div>
      </div>
    );
    if(imageToCrop) return <ImageCropper imageUrl={imageToCrop} onCropComplete={(url) => { setImageUrl(url); setImageToCrop(null); }} onCancel={resetState} />
    if (videoUrl) return <VideoFrameSelector videoUrl={videoUrl} onFrameSelect={setImageToCrop} onCancel={resetState} />
    
    return (
       <>
        <div className="text-center mb-12">
            <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
            </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Create Your Flyer
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Choose an option below to get started and bring your vision to life
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => {
            const Icon = option.icon;
            const isDarkMode = theme === 'dark';

            const cardContent = (
                <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${hoveredCard === option.id ? option.hoverColor : option.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="relative z-10 text-center">
                        <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 mx-auto`}>
                            <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${hoveredCard === option.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                            {option.title}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${hoveredCard === option.id ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                            {option.description}
                        </p>
                    </div>
                    {hoveredCard === option.id && (
                    <>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform -translate-x-16 translate-y-16"></div>
                    </>
                    )}
                </>
            );

            const classNames = `group relative overflow-hidden rounded-2xl p-8 transition-all duration-500 transform ${ hoveredCard === option.id ? 'scale-105 -translate-y-2' : 'scale-100'} bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-2xl w-full`;

            if (option.type === 'button') {
                return (
                    <button key={option.id} onClick={option.action as () => void} onMouseEnter={() => setHoveredCard(option.id)} onMouseLeave={() => setHoveredCard(null)} className={classNames}>
                        {cardContent}
                    </button>
                );
            } else {
                 return (
                    <label key={option.id} onMouseEnter={() => setHoveredCard(option.id)} onMouseLeave={() => setHoveredCard(null)} className={`${classNames} cursor-pointer`}>
                        {cardContent}
                        <input type="file" accept={option.type === 'image-upload' ? 'image/*' : 'video/*'} className="hidden" onChange={option.action as (e: ChangeEvent<HTMLInputElement>) => void} />
                    </label>
                 )
            }
          })}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-600">
                Powered by advanced AI technology to create professional flyers in seconds
            </p>
        </div>
      </>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'generator':
        return renderGeneratorContent();
      case 'admin':
        return user ? <AdminPanel log={log} addLogEntry={addLogEntry} /> : <Login addLogEntry={addLogEntry}/>;
      case 'testing':
        return <TestRunner addLogEntry={addLogEntry} onCaptureScreenshot={handleDownloadFlyer} canCapture={!!imageUrl} onGenerateSample={handleGenerationFromTest} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'generator', label: 'Generator' },
    { id: 'admin', label: 'Admin' },
    { id: 'testing', label: 'Testing' }
  ];
  const isDarkMode = theme === 'dark';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-500">
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10 backdrop-blur-sm"></div>
        <div className="relative px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              AI Flyer Generator
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeSwitcher />
            <button className="p-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg">
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </header>
      
      <nav className="px-6 pt-6">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30 scale-105'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="px-6 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-4xl">
           <div className="bg-white/80 dark:bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-12 border border-gray-200 dark:border-gray-700/50">
            {renderContent()}
          </div>
        </div>
      </main>
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
        <button onClick={handleLogout} className="px-5 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Logout</button>
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
        <button type="submit" className="w-full px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:bg-pink-400" disabled={isLoading}>
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
  imageUrl: string;
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
          <svg className="w-6 h-6 mr-3 text-burgundy-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
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
            {element.links?.map(link => (
              <div key={link.platform} className="flex items-center gap-2 text-primary-text hover:text-burgundy-primary transition-colors cursor-pointer">
                {getSocialIcon(link.platform)}
                <span className="text-xs font-medium">{link.handle}</span>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
};

const Flyer: React.FC<FlyerProps> = ({ imageUrl, flyerData }) => {
  const { text_elements, column_widths } = flyerData;
  const rightColumnButtons = text_elements.filter(el => el.type === 'button');

  return (
    <div id="flyer-container" className="w-full max-w-sm rounded-lg shadow-2xl overflow-hidden bg-white flex" style={{ aspectRatio: '9 / 16' }}>
      <div className="bg-cover bg-center" style={{ width: column_widths.left, backgroundImage: `url(${imageUrl})` }}>
        {/* Image column */}
      </div>
      <div className="p-8 flex flex-col justify-between" style={{ width: column_widths.right }}>
        <div>
          {text_elements.map((el, i) => el.type !== 'button' && renderTextElement(el, i))}
        </div>
        <div className="flex gap-4">
          {rightColumnButtons.map((btn, i) => (
             <button key={i} className={`w-full p-3 rounded font-bold text-sm ${getButtonColorClass(btn.color)}`}>
                {btn.text}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flyer;
```

### FILE: components/ImageCropper.tsx
```typescript
import React from 'react';

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (url: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageUrl, onCropComplete, onCancel }) => {
  
  const handleCrop = () => {
    // In this version, we pass the original image URL through.
    // A more advanced implementation would use a cropping library.
    onCropComplete(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Crop Your Image</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          Adjust the image to fit the flyer. For now, we'll use the full image.
        </p>
        <div className="max-h-[60vh] overflow-hidden rounded-lg mb-6 shadow-inner">
          <img src={imageUrl} alt="Preview for cropping" className="w-full h-auto object-contain" />
        </div>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-6 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
          <button onClick={handleCrop} className="px-6 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors">Use Image</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
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
import React from 'react';

interface TestRunnerProps {
  addLogEntry: (action: string) => void;
  onCaptureScreenshot: () => void;
  canCapture: boolean;
  onGenerateSample: () => void;
}

const TestRunner: React.FC<TestRunnerProps> = ({ addLogEntry, onCaptureScreenshot, canCapture, onGenerateSample }) => {
  
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">E2E Testing Control</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
        Use these controls to simulate user actions for end-to-end testing purposes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={handleGenerate} className="px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors">
          Generate Sample Flyer
        </button>
        <button 
          onClick={handleCapture} 
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canCapture}
        >
          Capture Flyer Screenshot
        </button>
      </div>
      {!canCapture && (
         <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            A flyer must be generated before a screenshot can be captured.
         </p>
      )}
    </div>
  );
};

export default TestRunner;
```

### FILE: components/ThemeSwitcher.tsx
```typescript
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
    >
      {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
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
        <button onClick={onCancel} className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
        <button onClick={handleCaptureFrame} className="px-6 py-3 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canCapture}>
          Use This Frame
        </button>
      </div>
    </div>
  );
};

export default VideoFrameSelector;
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
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const body = window.document.body;
    if (theme === 'dark') {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
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
# ai-flyer-generator

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
# AI Flyer Generator - Administrator's Guide

## 1. Introduction

This guide provides instructions for accessing and using the administrative features of the AI Flyer Generator application. The admin panel is designed for monitoring application activity and performing basic administrative tasks.

## 2. Accessing the Admin Panel

1.  Navigate to the main application URL.
2.  In the header, click on the **"Admin"** tab.
3.  You will be presented with a login screen.
4.  Enter the administrator password into the password field.

    -   **Default Password:** `password123`

5.  Click the "Sign In" button.

Upon successful authentication, you will be redirected to the Admin Panel.

## 3. Admin Panel Features

The Admin Panel provides a centralized view of key application information and actions.

### 3.1. Welcome Section

The top-right of the panel displays a welcome message with the current user's name (e.g., "Welcome, admin!"). It also contains the **Logout** button. Clicking this button will immediately end your session and return you to the login screen.

### 3.2. Actions

This section contains buttons for performing administrative tasks.

-   **Clear Cache (Simulated):** This is a demonstrative action. In a real-world application, this could be used to clear server-side caches or perform other maintenance tasks. Clicking it will log the action in the Audit Log and display a confirmation alert.

### 3.3. Audit Log

The Audit Log is a critical feature for monitoring application usage. It displays a real-time, reverse-chronological list of significant events that occur within the application.

Each log entry contains the following information:

-   **Timestamp:** The date and time the event occurred.
-   **User:** The user who performed the action. This will be "admin" for actions performed in the panel, "System" for automated actions, or potentially other usernames if the application is expanded.
-   **Action:** A description of the event that occurred.

**Examples of Logged Actions:**

-   `Admin login successful.`
-   `Flyer generation started.`
-   `Flyer generation failed: The provided API Key is invalid.`
-   `Admin triggered "Clear Cache".`
-   `Admin logged out.`

The log is scrollable, allowing you to review the history of actions performed during the current application session. **Note:** The log is stored in-memory and will reset if the browser page is refreshed.

## 4. Security Considerations

-   The default password `password123` is for demonstration purposes only. In a production environment, this must be changed to a strong, unique password and managed through a secure configuration system (e.g., environment variables, a secrets manager).
-   The current authentication system is client-side. For a production application, authentication should be handled by a secure backend service.
```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — ai-flyer-generator

**Application:** ai-flyer-generator
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

Audit log data is stored in `localStorage` under the key `tuc_ai-flyer-generator_audit`.

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
# Deployment Guide — ai-flyer-generator

**Application:** ai-flyer-generator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd ai-flyer-generator
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
docker-compose -f docker-compose-all-apps.yml build ai-flyer-generator
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up ai-flyer-generator
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
# AI Flyer Generator - Deployment Guide

## 1. Introduction

This document outlines the process for deploying the AI Flyer Generator application. As a client-side React application built with static files, it can be hosted on any modern static web hosting service.

## 2. Prerequisites

-   A valid Google Gemini API Key.
-   A web server or static hosting provider (e.g., Vercel, Netlify, AWS S3, GitHub Pages).

## 3. Configuration

The single most important configuration step is setting the Gemini API key.

### API Key Configuration

The application is designed to read the API key from a `process.env.API_KEY` variable at runtime. When deploying, you must ensure this environment variable is correctly configured in your hosting provider's build environment.

**DO NOT hardcode your API key directly into the source code.** This is a major security risk.

**Example Configuration on Vercel/Netlify:**

1.  Go to your project's settings in your hosting provider's dashboard.
2.  Find the section for "Environment Variables".
3.  Add a new environment variable:
    -   **Name / Key:** `API_KEY`
    -   **Value:** `Your-Gemini-API-Key-Here`

The application's build process will make this key available to the `geminiService.ts` file.

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
2.  Configure the build settings. Since this project uses `esbuild` via the platform's tooling, no complex build command is needed. The provider will typically detect the `index.html` and serve it.
3.  **Crucially, set the `API_KEY` environment variable as described in Section 3.**

### Step 3: Deploy

-   Push your code to the connected Git repository.
-   The hosting provider will automatically trigger a new deployment.
-   Once the deployment is complete, your application will be live at the provided URL.

## 5. Example: Deploying to Netlify

1.  Push the project code to a GitHub/GitLab/Bitbucket repository.
2.  Sign up for a Netlify account and select "Add new site" -> "Import an existing project".
3.  Authorize Netlify to access your Git provider and select the repository.
4.  Netlify will likely auto-detect the settings. You do not need a build command or a publish directory.
5.  Before clicking "Deploy", go to "Advanced build settings" or navigate to the site's settings after creation.
6.  Go to "Site settings" > "Build & deploy" > "Environment".
7.  Add the `API_KEY` environment variable.
8.  Trigger a new deploy. Your site will be live.
```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Ai Flyer Generator
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Ai Flyer Generator**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Ai Flyer Generator** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Ai Flyer Generator** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| TUC branding applied | âŒ Non-compliant |
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
## for AI Flyer Generator (Initial State)

**Version 1.0**

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
3. [System Features](#3-system-features)
   3.1 [Flyer Generation](#31-flyer-generation)
4. [External Interface Requirements](#4-external-interface-requirements)
   4.1 [User Interfaces](#41-user-interfaces)
   4.2 [Software Interfaces](#42-software-interfaces)
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   5.1 [Performance Requirements](#51-performance-requirements)
   5.2 [Security Requirements](#52-security-requirements)
   5.3 [Usability Requirements](#53-usability-requirements)

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to provide a detailed description of the requirements for the AI Flyer Generator application, Version 1.0. This document is intended for project stakeholders, developers, and designers.

#### 1.2 Scope
The AI Flyer Generator is a web application that enables users to generate a professional business flyer. The generation process is driven by a predefined JSON data structure that includes a detailed prompt for an image, text elements, and layout instructions. The application will use the Google Gemini API to generate the visual component of the flyer and will render the complete flyer in the browser.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **JSON:** JavaScript Object Notation

---

### 2. Overall Description

#### 2.1 Product Perspective
The AI Flyer Generator is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API for image generation. It does not have its own backend or database.

#### 2.2 Product Functions
The primary functions of the application are:
- To present the user with a simple interface to start the flyer generation process.
- To send a request to the Google Gemini API using a predefined, detailed prompt.
- To display a loading state while waiting for the API response.
- To handle potential errors during the API call and display a user-friendly message.
- To render the final flyer, combining the AI-generated image with the predefined text elements in a two-column layout.
- To allow the user to generate a new flyer.

#### 2.3 User Characteristics
The target user is anyone who needs to quickly visualize a flyer based on a design brief, such as marketers, designers, or small business owners. Users are expected to have basic web literacy but require no technical or design expertise.

#### 2.4 Constraints
- The application must run in all modern web browsers (Chrome, Firefox, Safari, Edge).
- The application is dependent on the availability and performance of the Google Gemini API.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`) for the application to function.
- All flyer content (prompt, text, layout) is hardcoded into the application's source code.

---

### 3. System Features

#### 3.1 Flyer Generation
- **3.1.1 Description and Priority:** This feature is the core functionality of the application. The user initiates the process, and the system generates and displays a complete flyer. Priority: High.
- **3.1.2 Functional Requirements:**
    - The system shall have a "Generate Flyer" button on the main screen.
    - Upon clicking the button, the system shall display a loading indicator.
    - The system shall construct an API request to the Gemini `imagen-4.0-generate-001` model.
    - The request prompt shall be composed of the `prompt` string defined in the application's constants.
    - The request shall specify an aspect ratio of `9:16`.
    - Upon receiving a successful response, the system shall display the generated image in the left 40% column of the flyer layout.
    - The system shall render the predefined text elements (headline, subheading, bullets, buttons) in the right 60% column.
    - In case of an API error, the system shall hide the loading indicator and display a clear error message with an option to "Try Again".
    - Once a flyer is displayed, a "Generate Another Flyer" button shall be available to reset the view and return to the initial screen.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- **Initial Screen:** A centered layout with a title, a brief description, and a primary "Generate Flyer" button.
- **Loading Screen:** A centered loading spinner with accompanying text indicating that generation is in progress.
- **Error Screen:** A centered message box displaying the error and a "Try Again" button.
- **Flyer Display Screen:** A view of the generated flyer, maintaining a 9:16 aspect ratio. A "Generate Another Flyer" button is present below the flyer.

#### 4.2 Software Interfaces
- **Google Gemini API:**
  - The application will interface with the `@google/genai` library to communicate with the Gemini API.
  - It will specifically use the `ai.models.generateImages` method with the `imagen-4.0-generate-001` model.
  - Authentication is handled via an API key provided in the client's initialization.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- The application's initial load time should be under 3 seconds on a standard broadband connection.
- The UI must remain responsive while the API request is in progress. The loading spinner must animate smoothly.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code. It must be injected via an environment variable during a build/deployment process.

#### 5.3 Usability Requirements
- The user interface must be intuitive, requiring no instructions for a user to generate a flyer.
- All interactive elements (buttons) must have clear visual feedback on hover and click states.
```

### FILE: docs/SRS_final.md
```md
# Software Requirements Specification (SRS)
## for AI Flyer Generator (Final Version)

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
   3.2 [Theming and Accessibility](#32-theming-and-accessibility)
   3.3 [Administration](#33-administration)
   3.4 [Interactive Testing](#34-interactive-testing)
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
The purpose of this document is to provide a detailed description of the requirements for the AI Flyer Generator application, Version 2.0. This version includes significant enhancements such as an admin panel, accessibility features, and a testing suite. This document is intended for project stakeholders, developers, and testers.

#### 1.2 Scope
The AI Flyer Generator is a feature-rich web application that enables users to generate a professional business flyer from a predefined data structure. This version introduces a multi-tab interface for accessing the core generator, a password-protected admin section for monitoring, and an interactive testing panel. The application supports multiple visual themes (Light, Dark, High-Contrast) and adheres to accessibility best practices.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **SRS:** Software Requirements Specification
- **WCAG:** Web Content Accessibility Guidelines

---

### 2. Overall Description

#### 2.1 Product Perspective
The AI Flyer Generator is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API. It does not have its own backend or database. State, such as authentication and audit logs, is managed in-memory for the duration of a user session.

#### 2.2 Product Functions
The functions of the application include:
- All functions from Version 1.0 (Flyer generation, loading/error states).
- A tabbed navigation system to switch between "Generator", "Admin", and "Testing" views.
- A theme switcher allowing users to select Light, Dark, or High-Contrast mode.
- A password-protected "Admin" section.
- An audit log to track key events within the application session.
- An "Testing" section with tools for self-testing and screenshot capture.

#### 2.3 User Characteristics
- **General Users:** Same as Version 1.0.
- **Administrators:** Users with the admin password who need to monitor application events via the audit log.
- **Developers/Testers:** Users who will utilize the "Testing" tab to perform diagnostics and capture results.

#### 2.4 Constraints
- The application must run in all modern web browsers.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`).
- Session-based data (login status, audit log) is ephemeral and does not persist across page reloads.

#### 2.5 System Architecture
The application follows a simple client-server architecture where the client is the user's browser and the server is the Google Gemini API. There is no intermediary application server.

- **System Architecture Diagram:** See `docs/system_architecture.svg`
- **Database Architecture Diagram:** See `docs/database_architecture.svg`

---

### 3. System Features

#### 3.1 Flyer Generation
- **3.1.1 Description and Priority:** Core functionality, same as v1.0. Priority: High.
- **3.1.2 Functional Requirements:**
    - All requirements from v1.0, Section 3.1.2, are retained.
    - All flyer generation activities (start, success, failure) shall be logged in the audit log.

#### 3.2 Theming and Accessibility
- **3.2.1 Description and Priority:** Allows users to change the visual theme and ensures the application is accessible. Priority: High.
- **3.2.2 Functional Requirements:**
    - The UI shall include a theme switcher with options for "Light", "Dark", and "High-Contrast".
    - Selecting a theme shall immediately apply the new color scheme across the entire application.
    - The chosen theme shall be persisted in the browser's `localStorage` and automatically applied on subsequent visits.
    - All interactive elements shall have appropriate ARIA roles, states, and properties.
    - All interactive elements must be keyboard-navigable and have visible focus indicators.

#### 3.3 Administration
- **3.3.1 Description and Priority:** Provides a secure area for monitoring application events. Priority: Medium.
- **3.3.2 Functional Requirements:**
    - Access to the Admin tab shall be protected by a hardcoded password (`password123`).
    - The system shall display a login form when an unauthenticated user visits the Admin tab.
    - Upon successful login, the system shall display the Admin Panel.
    - The Admin Panel shall display an audit log of all logged actions.
    - The Admin Panel shall provide a "Logout" button to terminate the admin session.
    - Login attempts (successful and failed) and logout actions shall be recorded in the audit log.

#### 3.4 Interactive Testing
- **3.4.1 Description and Priority:** Provides tools for developers and testers to validate application health. Priority: Medium.
- **3.4.2 Functional Requirements:**
    - The "Testing" tab shall be accessible to all users.
    - The system shall provide a "Run Self-Test" button that checks for the presence of the `API_KEY`.
    - The system shall display the pass/fail status of the self-test.
    - The system shall provide a "Capture Flyer Screenshot" button.
    - When clicked, the screenshot button shall use the `html2canvas` library to capture the currently displayed flyer and trigger a browser download of the resulting PNG image.
    - If no flyer is visible, the system shall alert the user.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- A main header shall contain the tab navigation ("Generator", "Admin", "Testing") and the Theme Switcher.
- The content area below the header will render the component corresponding to the active tab.

#### 4.2 Software Interfaces
- **Google Gemini API:** No changes from Version 1.0.
- **html2canvas Library:** The application will interface with the `html2canvas` library (loaded via CDN) to capture DOM elements as images.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- Theme changes must apply instantaneously with no perceivable delay.
- The UI must remain responsive during all operations.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code.
- The admin password must not be stored in plain text in a way that is easily accessible to end-users. (Note: For this project, it is hardcoded, but this is a stated constraint for a real-world application).

#### 5.3 Usability and Accessibility Requirements
- The application should strive for WCAG 2.1 AA compliance.
- The color palettes for all themes must meet minimum contrast ratios for text and UI elements.
- The tabbed interface must be intuitive and clearly indicate the active section.
```

### FILE: docs/TESTING.md
```md
# Testing Guide — ai-flyer-generator

**Application:** ai-flyer-generator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd ai-flyer-generator
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
# AI Flyer Generator - Testing Guide

## 1. Introduction

This guide details the testing procedures for the AI Flyer Generator application. It covers both the in-app interactive testing tools and the external end-to-end (E2E) test suite.

## 2. Interactive Testing (In-App)

The "Testing" tab within the application provides tools for quick diagnostics and validation.

### 2.1. System Self-Test

This test performs a basic check of the application's runtime environment.

**How to Run:**
1.  Navigate to the **"Testing"** tab.
2.  Click the **"Run Self-Test"** button.
3.  Observe the status message that appears.

**Expected Outcomes:**
-   **`✅ All self-tests passed. (API key is present)`:** This indicates that the `API_KEY` environment variable has been correctly configured and is accessible to the application. This is the desired outcome.
-   **`❌ Self-test failed: API_KEY is not configured.`:** This indicates a critical configuration error. The application will not be able to generate images. To fix this, review the `DeploymentGuide.md` and ensure the environment variable is set correctly in your hosting environment.

### 2.2. Screenshot Capture

This feature allows you to capture a high-quality PNG image of the generated flyer.

**How to Use:**
1.  First, navigate to the **"Generator"** tab and generate a flyer.
2.  Once the flyer is visible on the screen, navigate to the **"Testing"** tab.
3.  Click the **"Capture Flyer Screenshot"** button.
4.  Your browser will automatically download a file named `flyer-screenshot.png`.

**Note:** If you attempt to capture a screenshot before a flyer has been generated, you will receive an alert message.

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
3.  The script will launch a headless Chromium browser, perform a series of actions, and log the results to the console.

### 3.4. Test Script Overview (`tests/flyer-generator.test.js`)

The test script performs the following actions:
1.  Launches a new browser instance.
2.  Navigates to the application URL.
3.  Verifies that the initial page loads correctly by checking the main heading.
4.  Clicks the "Generate Flyer" button.
5.  Waits for up to 30 seconds for the flyer image to appear.
6.  If generation is successful, it confirms the image `src` is a valid data URL and saves a screenshot to `test-results/successful-generation.png`.
7.  If generation fails, it logs an error and saves a screenshot to `test-results/failed-generation.png`.
8.  It tests the theme switcher by clicking the "Dark" mode button and verifying the correct class is applied to the document. A screenshot is saved to `test-results/dark-mode.png`.

All test artifacts (screenshots) are saved in the `test-results/` directory, which is created automatically if it doesn't exist.
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
    <meta charset="UTF-8">
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="AI Flyer Generator" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="AI Flyer Generator" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Flyer Generator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
        }
    </style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/react-image-crop@11.0.5/dist/ReactCrop.css">
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
    "react-image-crop": "https://esm.sh/react-image-crop@11.0.5",
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
  "name": "AI Flyer Generator",
  "description": "A web application that uses Gemini to generate a professional business flyer based on a detailed design brief, including generating a custom image for the layout.",
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
  "name": "ai-flyer-generator",
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
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "html2canvas": "1.4.1",
    "@google/genai": "latest",
    "react-image-crop": "11.0.5",
    "lucide-react": "0.344.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0",
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

View your app in AI Studio: https://ai.studio/apps/drive/15s1A3jKGFN5dn-ZSA9gk8vMuz040tY3g

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
import { GoogleGenAI } from "@google/genai";
import { flyerData } from '../constants';

// The API key is assumed to be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the Google Gemini API based on a given prompt.
 * @param {string} prompt - The text prompt to generate the image from.
 * @returns {Promise<string>} A promise that resolves to a base64 encoded data URL of the generated JPEG image.
 * @throws {Error} Throws an error if the image generation fails, or if the API returns no images.
 */
export const generateFlyerImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: flyerData.aspect_ratio as "1:1" | "9:16" | "16:9" | "4:3" | "3:4",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      throw new Error("Image generation failed, no images returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error("The provided API Key is invalid. Please check your environment variables.");
    }
    throw new Error("Failed to generate flyer image. Please check the console for details.");
  }
};
```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — ai-flyer-generator
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('ai-flyer-generator E2E', () => {
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

test.describe('AI Flyer Generator', () => {
  test('should load and display app heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1.app-title');
    await expect(heading).toHaveText('AI Flyer Generator');
  });

  test('should display the Generate with AI button', async ({ page }) => {
    await page.goto('/');
    const generateBtn = page.getByRole('button', { name: /generate with ai/i });
    await expect(generateBtn).toBeVisible();
  });

  test('should have theme toggle buttons', async ({ page }) => {
    await page.goto('/');
    const lightModeBtn = page.locator('button[title="Light Mode"]');
    const darkModeBtn = page.locator('button[title="Dark Mode"]');
    await expect(lightModeBtn.or(darkModeBtn)).toBeVisible();
  });
});

```

### FILE: tests/flyer-generator.test.js
```javascript
const { chromium } = require('@playwright/test');
const fs = require('fs');

const APP_URL = 'http://localhost:3000'; // Adjust if your app runs on a different port
const RESULTS_DIR = 'test-results';
const TIMEOUT = 30000; // 30 seconds

// Helper to create a directory if it doesn't exist
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
};

(async () => {
    ensureDirExists(RESULTS_DIR);
    console.log('🚀 Starting E2E test suite...');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log(`Navigating to ${APP_URL}`);
        await page.goto(APP_URL, { waitUntil: 'networkidle2' });

        // 1. Test Initial Page Load
        console.log('✅ Verifying initial page load...');
        await page.waitForSelector('h1.app-title');
        const heading = await page.$eval('h1.app-title', el => el.textContent);
        if (heading !== 'AI Flyer Generator') {
            throw new Error(`Unexpected heading: ${heading}`);
        }
        console.log('Page loaded successfully.');

        // 2. Test Flyer Generation
        console.log('🧪 Starting flyer generation test...');
        // The generator tab is active by default.
        await page.waitForSelector('button.btn-primary');
        await page.click('button ::-p-text(Generate with AI)');

        console.log('⏳ Waiting for image cropper to appear...');
        try {
            await page.waitForSelector('.fixed.inset-0.bg-black', { timeout: TIMEOUT });
            console.log('✅ Image cropper modal appeared.');

            // Click crop button to proceed
            await page.click('button ::-p-text(Crop Image)');

            console.log('⏳ Waiting for flyer to be rendered...');
            await page.waitForSelector('#flyer-container');
            
            await page.waitForFunction(
                () => {
                    const flyerContainer = document.getElementById('flyer-container');
                    if (!flyerContainer) return false;
                    const imageColumn = flyerContainer.querySelector<HTMLElement>('div[style*="background-image"]');
                    if (!imageColumn) return false;
                    const style = window.getComputedStyle(imageColumn);
                    return style.backgroundImage.includes('data:image/jpeg;base64,');
                }, 
                { timeout: 5000 }
            );

            console.log('✅ Flyer generated successfully!');
            await page.screenshot({ path: `${RESULTS_DIR}/successful-generation.png` });
        } catch (error) {
            console.error('❌ Flyer generation failed within the timeout period.', error.message);
            await page.screenshot({ path: `${RESULTS_DIR}/failed-generation.png` });
            throw error;
        }
        
        // 3. Test Theme Switching
        console.log('🧪 Testing theme switcher...');
        
        await page.click('button[title="Light Mode"]');
        await page.waitForFunction(() => document.body.classList.contains('light-mode'));
        console.log('✅ Switched to light mode successfully.');
        await page.screenshot({ path: `${RESULTS_DIR}/light-mode.png` });

        await page.click('button[title="Dark Mode"]');
        await page.waitForFunction(() => !document.body.classList.contains('light-mode'));
        console.log('✅ Switched to dark mode successfully.');
        
    } catch (error) {
        console.error('\n🔥 An error occurred during the E2E test:', error);
        await page.screenshot({ path: `${RESULTS_DIR}/error-screenshot.png` });
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
    [key: string]: string;
  };
  spacing: {
    [key: string]: string;
  };
  typography: {
    [key: string]: string;
  };
  visual_elements: {
    [key: string]: string;
  };
  format: string;
  aspect_ratio: string;
  quality: string;
  critical_instruction: string;
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

export type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
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

// Vitest unit test configuration — ai-flyer-generator
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

// Vitest E2E configuration — ai-flyer-generator
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

