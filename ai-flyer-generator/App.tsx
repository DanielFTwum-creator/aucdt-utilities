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