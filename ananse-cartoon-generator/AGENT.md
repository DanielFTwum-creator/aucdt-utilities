# ananse-cartoon-generator - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for ananse-cartoon-generator.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

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

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript

import React, { useState, useCallback } from 'react';
import { generateImage, generateDialog, generateNextScene, generateAnimationFrames } from './services/geminiService';
import Spinner from './components/Spinner';
import { SparklesIcon, AnanseIcon, DownloadIcon, HistoryIcon, NextSceneIcon, CopyIcon, FilmIcon, DownloadAllIcon } from './components/Icons';
import History from './components/History';
import AnimationPlayer from './components/AnimationPlayer';

const INITIAL_PROMPT = `Ananse: Walking slowly but steadily back toward the village, the empty pot tucked under his arm, his expression humble but determined.
Visual: The village square visible in the background where a few villagers are still gathered, talking among themselves. The sun is lower in the an sky, suggesting time has passed.
Action: Ananse taking measured steps forward, his body language showing both nervousness and courage as he prepares to make amends for his deception.`;

interface DialogLine {
  character: string;
  line: string;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  image: string; // Thumbnail for both static and animated
  frames: string[] | null; // URLs for animation frames
  dialog: DialogLine[] | null;
}

type AnimationMode = 'static' | 'animated';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(INITIAL_PROMPT);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedFrames, setGeneratedFrames] = useState<string[] | null>(null);
  const [generatedDialog, setGeneratedDialog] = useState<DialogLine[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingNextScene, setIsGeneratingNextScene] = useState<boolean>(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);
  const [error, setError] = useState<{ image?: string; dialog?: string; nextScene?: string } | null>(null);
  
  const [generateDialogEnabled, setGenerateDialogEnabled] = useState(true);
  const [char1, setChar1] = useState('Ananse');
  const [char2, setChar2] = useState('Villager');
  const [autoDownloadImage, setAutoDownloadImage] = useState(false);
  const [autoDownloadDialog, setAutoDownloadDialog] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copySuccess, setCopySuccess] = useState<'prompt' | 'dialog' | ''>('');
  const [animationMode, setAnimationMode] = useState<AnimationMode>('static');
  const [progress, setProgress] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);


  const downloadImage = useCallback((base64Image: string, filename: string) => {
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadText = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleCopy = useCallback((text: string, type: 'prompt' | 'dialog') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, []);


  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading || isGeneratingNextScene) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);
    setGeneratedImage(null);
    setGeneratedFrames(null);
    setGeneratedDialog(null);

    const imagePromise = animationMode === 'animated'
        ? generateAnimationFrames(prompt, (p) => setProgress(p))
        : generateImage(prompt);

    const dialogPromise = generateDialogEnabled 
      ? generateDialog(prompt, char1, char2) 
      : Promise.resolve(null);

    const [imageResult, dialogResult] = await Promise.allSettled([imagePromise, dialogPromise]);

    let newError: { image?: string; dialog?: string } = {};
    let newDialog: DialogLine[] | null = null;
    let historyThumbnail: string | null = null;
    let historyFrames: string[] | null = null;


    if (imageResult.status === 'fulfilled') {
      if (animationMode === 'animated') {
        const frames = imageResult.value as string[];
        const frameUrls = frames.map(f => `data:image/jpeg;base64,${f}`);
        setGeneratedFrames(frameUrls);
        historyThumbnail = frameUrls[0];
        historyFrames = frameUrls;
      } else {
        const image = imageResult.value as string;
        const imageUrl = `data:image/jpeg;base64,${image}`;
        setGeneratedImage(imageUrl);
        historyThumbnail = imageUrl;
      }
    } else {
      newError.image = imageResult.reason instanceof Error ? imageResult.reason.message : 'An unknown error occurred.';
    }

    if (dialogResult.status === 'fulfilled' && dialogResult.value) {
      newDialog = dialogResult.value;
      if (autoDownloadDialog) {
        const dialogText = newDialog.map(d => `${d.character}: ${d.line}`).join('\n\n');
        downloadText(dialogText, `ananse-dialog-${Date.now()}.txt`);
      }
    } else if (dialogResult.status === 'rejected') {
      newError.dialog = dialogResult.reason instanceof Error ? dialogResult.reason.message : 'An unknown error occurred.';
    }
    
    if (newError.image || newError.dialog) {
        setError(newError);
    }
    
    if (historyThumbnail) {
      setHistory(prev => [{
        id: `hist_${Date.now()}`,
        prompt,
        image: historyThumbnail!,
        frames: historyFrames,
        dialog: newDialog,
      }, ...prev]);
       if (autoDownloadImage && animationMode === 'static') {
        downloadImage(historyThumbnail, `ananse-scene-${Date.now()}.jpeg`);
      }
    }

    setIsLoading(false);
    setProgress(0);
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 2000); // 2-second cooldown
  }, [prompt, isLoading, isGeneratingNextScene, generateDialogEnabled, char1, char2, autoDownloadImage, downloadImage, autoDownloadDialog, downloadText, animationMode]);
  
  const handleGenerateNextScene = useCallback(async () => {
      if (isLoading || isGeneratingNextScene || !prompt) return;
      
      setIsGeneratingNextScene(true);
      setError(null);
      
      try {
          const nextScenePrompt = await generateNextScene(prompt);
          setPrompt(nextScenePrompt);
      } catch (err) {
          const newError = { nextScene: err instanceof Error ? err.message : 'An unknown error occurred while generating the next scene.' };
          setError(prev => ({ ...prev, ...newError }));
      } finally {
          setIsGeneratingNextScene(false);
          setIsCooldown(true);
          setTimeout(() => setIsCooldown(false), 2000); // 2-second cooldown
      }

  }, [prompt, isLoading, isGeneratingNextScene]);

  const handleRestore = useCallback((item: HistoryItem) => {
      setPrompt(item.prompt);
      setGeneratedDialog(item.dialog);
      if (item.frames) {
        setGeneratedFrames(item.frames);
        setGeneratedImage(null);
        setAnimationMode('animated');
      } else {
        setGeneratedImage(item.image);
        setGeneratedFrames(null);
        setAnimationMode('static');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDownloadAllFrames = useCallback(async () => {
    if (!generatedFrames || isDownloadingAll) return;

    setIsDownloadingAll(true);
    try {
        for (let i = 0; i < generatedFrames.length; i++) {
            downloadImage(generatedFrames[i], `ananse-frame-${i + 1}-${Date.now()}.jpeg`);
            // Add a small delay to prevent browsers from blocking too many downloads at once
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    } catch (err) {
        console.error("Failed to download all frames:", err);
    } finally {
        setIsDownloadingAll(false);
    }
  }, [generatedFrames, downloadImage, isDownloadingAll]);


  return (
    <div className="min-h-screen bg-brand-background font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <AnanseIcon className="h-12 w-12 text-brand-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-text tracking-tight">
              Ananse Cartoon Generator
            </h1>
          </div>
          <p className="text-lg text-brand-text-muted">
            Bring the tales of Ananse to life. Describe a scene and watch it unfold.
          </p>
        </header>

        <main className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_3fr)_minmax(0,_1fr)] gap-8 items-start">
            {/* --- OUTPUT --- */}
            <section data-testid="output-section" className="bg-brand-surface rounded-xl shadow-lg p-6 flex flex-col justify-center items-center min-h-[400px] space-y-4">
              {error && (error.image || error.dialog) && (
                <div className="w-full text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Generation Failed</h3>
                  {error.image && <p><strong>Image Error:</strong> {error.image}</p>}
                  {error.dialog && <p><strong>Dialog Error:</strong> {error.dialog}</p>}
                </div>
              )}
              
              {!isLoading && !generatedImage && !generatedFrames && !error?.image && (
                <div data-testid="initial-message" className="text-center text-brand-text-muted">
                  <AnanseIcon className="h-24 w-24 mx-auto text-slate-600 mb-4" />
                  <h3 className="text-xl font-semibold">Your generated cartoon will appear here</h3>
                  <p>Describe the scene below and click "Generate Scene" to begin.</p>
                </div>
              )}

              {isLoading && (
                   <div data-testid="loading-spinner" className="w-full aspect-video bg-brand-background rounded-lg flex items-center justify-center">
                       <div className="flex flex-col items-center w-3/4 max-w-md">
                           <Spinner />
                           <p className="mt-4 text-brand-text-muted">
                            {animationMode === 'animated' ? `Weaving the animation... (${Math.round(progress * 100)}%)` : 'Weaving the story...'}
                           </p>
                            {animationMode === 'animated' && progress > 0 && (
                                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
                                    <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }}></div>
                                </div>
                            )}
                       </div>
                   </div>
              )}

              {generatedImage && (
                <div className="w-full animate-fade-in space-y-4">
                  <img
                    src={generatedImage}
                    alt="Generated Ananse cartoon"
                    data-testid="generated-image"
                    className="w-full h-auto object-cover rounded-lg shadow-2xl border-4 border-brand-secondary"
                  />
                  <button 
                    onClick={() => downloadImage(generatedImage, `ananse-scene-${Date.now()}.jpeg`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-brand-secondary/20 text-brand-secondary font-semibold rounded-lg hover:bg-brand-secondary/40 transition-colors"
                  >
                    <DownloadIcon className="h-5 w-5"/>
                    Download Image
                  </button>
                </div>
              )}
              
              {generatedFrames && (
                  <div className="w-full animate-fade-in space-y-4">
                      <AnimationPlayer frames={generatedFrames} />
                      <div className="space-y-2">
                          <div className="flex items-center justify-between">
                              <h4 className="text-md font-semibold text-brand-text-muted">Download Frames</h4>
                              <button
                                onClick={handleDownloadAllFrames}
                                disabled={isDownloadingAll || isLoading || isGeneratingNextScene}
                                className="flex items-center gap-2 py-1 px-3 text-sm bg-brand-background hover:bg-slate-700/50 text-brand-secondary font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isDownloadingAll ? (
                                    <><Spinner /> Downloading...</>
                                ) : (
                                    <><DownloadAllIcon className="h-4 w-4" /> Download All</>
                                )}
                              </button>
                          </div>
                          <div className="flex overflow-x-auto space-x-2 pb-2">
                              {generatedFrames.map((frame, index) => (
                                  <button
                                      key={index}
                                      onClick={() => downloadImage(frame, `ananse-frame-${index + 1}-${Date.now()}.jpeg`)}
                                      title={`Download Frame ${index + 1}`}
                                      className="flex-shrink-0 flex items-center justify-center gap-2 py-2 px-3 bg-brand-background hover:bg-slate-700/50 text-brand-text-muted font-semibold rounded-lg transition-colors"
                                  >
                                      <DownloadIcon className="h-4 w-4"/>
                                      <span>{index + 1}</span>
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
              
               {generatedDialog && (
                  <div data-testid="generated-dialog" className="w-full animate-fade-in space-y-4">
                      <div className="bg-brand-background/50 rounded-lg p-4 text-brand-text">
                          <h4 className="font-bold text-lg mb-2">Scene Dialog</h4>
                          <div className="space-y-2 text-sm">
                              {generatedDialog.map((line, index) => (
                                  <p key={index}><strong className="text-brand-primary">{line.character}:</strong> {line.line}</p>
                              ))}
                          </div>
                      </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           <button
                              onClick={() => {
                                  const dialogText = generatedDialog.map(d => `${d.character}: ${d.line}`).join('\n\n');
                                  downloadText(dialogText, `ananse-dialog-${Date.now()}.txt`);
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-brand-secondary/20 text-brand-secondary font-semibold rounded-lg hover:bg-brand-secondary/40 transition-colors"
                          >
                              <DownloadIcon className="h-5 w-5"/>
                              Download Dialog
                          </button>
                          <button
                              onClick={() => {
                                  const dialogText = generatedDialog.map(d => `${d.character}: ${d.line}`).join('\n\n');
                                  handleCopy(dialogText, 'dialog');
                              }}
                               className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-brand-secondary/20 text-brand-secondary font-semibold rounded-lg hover:bg-brand-secondary/40 transition-colors"
                          >
                              {copySuccess === 'dialog' ? 'Copied!' : <><CopyIcon className="h-5 w-5"/> Copy Dialog</>}
                          </button>
                      </div>
                  </div>
               )}
            </section>
            
            {/* --- ACTION BUTTONS --- */}
            <div className="lg:sticky lg:top-8 space-y-4">
              <button
                onClick={handleGenerate}
                data-testid="generate-button"
                disabled={isLoading || isGeneratingNextScene || !prompt || isCooldown}
                className="flex items-center justify-center w-full bg-brand-primary text-white font-bold py-4 px-6 rounded-lg shadow-md hover:bg-chocolate-dark transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (<><Spinner />Generating...</>) : (
                  animationMode === 'animated' ? <><FilmIcon className="h-6 w-6 mr-3" />Generate Animation</> : <><SparklesIcon className="h-6 w-6 mr-3" />Generate Image</>
                )}
              </button>
              <button
                onClick={handleGenerateNextScene}
                data-testid="next-scene-button"
                disabled={isLoading || isGeneratingNextScene || !prompt || isCooldown}
                className="flex items-center justify-center w-full bg-brand-secondary/20 text-brand-secondary font-semibold py-4 px-6 rounded-lg hover:bg-brand-secondary/40 transition-all duration-300 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed"
              >
                {isGeneratingNextScene ? (
                    <><Spinner /> Thinking...</>
                ) : (
                    <><NextSceneIcon className="h-6 w-6 mr-3" />Next Scene</>
                )}
              </button>
               {error?.nextScene && (
                  <p className="text-sm text-red-400 text-center">{error.nextScene}</p>
              )}
            </div>
          </div>

          {/* --- INPUT & CONTROLS --- */}
          <section className="bg-brand-surface rounded-xl shadow-lg p-6 space-y-6">
            {/* 1. Scene Description */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="prompt" className="text-xl font-semibold text-brand-text">
                  Scene Description
                </label>
                <button 
                  onClick={() => handleCopy(prompt, 'prompt')}
                  disabled={!prompt}
                  className="flex items-center gap-2 py-1 px-3 text-sm bg-brand-background hover:bg-slate-700/50 text-brand-text-muted font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copySuccess === 'prompt' ? 'Copied!' : <><CopyIcon className="h-4 w-4" /> Copy</>}
                </button>
              </div>
              <textarea
                id="prompt"
                data-testid="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene for Ananse..."
                className="w-full h-48 p-4 bg-brand-background border-2 border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 text-base text-brand-text-muted resize-none"
                disabled={isLoading || isGeneratingNextScene}
              />
            </div>

            {/* 2. Generation Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-700/50">
                {/* Mode Settings */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-text">Mode</h3>
                  <div className="flex bg-brand-background rounded-lg p-1">
                      <button onClick={() => setAnimationMode('static')} disabled={isLoading || isGeneratingNextScene} className={`w-1/2 py-2 rounded-md text-sm font-bold transition-colors ${animationMode === 'static' ? 'bg-brand-primary text-white' : 'text-brand-text-muted hover:bg-brand-surface'}`}>
                          Static Image
                      </button>
                       <button onClick={() => setAnimationMode('animated')} disabled={isLoading || isGeneratingNextScene} className={`w-1/2 py-2 rounded-md text-sm font-bold transition-colors ${animationMode === 'animated' ? 'bg-brand-primary text-white' : 'text-brand-text-muted hover:bg-brand-surface'}`}>
                          Animation
                      </button>
                  </div>
                </div>
                {/* Dialog Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-brand-text">Dialog Settings</h3>
                    <input
                        type="checkbox"
                        id="generate-dialog"
                        checked={generateDialogEnabled}
                        onChange={(e) => setGenerateDialogEnabled(e.target.checked)}
                        className="h-6 w-6 rounded bg-brand-background border-slate-600 text-brand-primary focus:ring-brand-primary"
                        disabled={isLoading || isGeneratingNextScene}
                    />
                  </div>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-300 ${generateDialogEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <div>
                            <label htmlFor="char1" className="block text-sm font-medium text-brand-text-muted mb-1">Character 1</label>
                            <input type="text" id="char1" value={char1} onChange={e => setChar1(e.target.value)} disabled={!generateDialogEnabled || isLoading || isGeneratingNextScene} className="w-full p-2 bg-brand-background border border-slate-700 rounded-md focus:ring-1 focus:ring-brand-primary"/>
                        </div>
                          <div>
                            <label htmlFor="char2" className="block text-sm font-medium text-brand-text-muted mb-1">Character 2</label>
                            <input type="text" id="char2" value={char2} onChange={e => setChar2(e.target.value)} disabled={!generateDialogEnabled || isLoading || isGeneratingNextScene} className="w-full p-2 bg-brand-background border border-slate-700 rounded-md focus:ring-1 focus:ring-brand-primary"/>
                        </div>
                  </div>
                </div>
                {/* Options */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-brand-text">Options</h3>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="auto-download-image"
                            checked={autoDownloadImage}
                            onChange={(e) => setAutoDownloadImage(e.target.checked)}
                            className="h-5 w-5 rounded bg-brand-background border-slate-600 text-brand-primary focus:ring-brand-primary"
                            disabled={isLoading || isGeneratingNextScene || animationMode === 'animated'}
                        />
                        <label htmlFor="auto-download-image" className={`ml-3 text-brand-text-muted ${animationMode === 'animated' ? 'text-slate-500' : ''}`}>Auto-download image</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="auto-download-dialog"
                            checked={autoDownloadDialog}
                            onChange={(e) => setAutoDownloadDialog(e.target.checked)}
                            className="h-5 w-5 rounded bg-brand-background border-slate-600 text-brand-primary focus:ring-brand-primary"
                            disabled={isLoading || isGeneratingNextScene || !generateDialogEnabled}
                        />
                        <label htmlFor="auto-download-dialog" className="ml-3 text-brand-text-muted disabled:text-slate-500">Auto-download dialog</label>
                    </div>
                </div>
            </div>
          </section>

          {/* --- HISTORY --- */}
          {history.length > 0 && (
              <section data-testid="history-section" className="mt-8">
                   <div className="flex items-center gap-4 mb-6">
                      <HistoryIcon className="h-8 w-8 text-brand-primary"/>
                      <h2 className="text-3xl font-bold text-brand-text">History</h2>
                  </div>
                  <History items={history} onRestore={handleRestore} onDownload={downloadImage} />
              </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default App;

```

### FILE: components/AnimationPlayer.tsx
```typescript

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

```

### FILE: components/History.tsx
```typescript

import React from 'react';
import { DownloadIcon } from './Icons';
import type { HistoryItem } from '../App';

interface HistoryProps {
  items: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onDownload: (base64Image: string, filename: string) => void;
}

const History: React.FC<HistoryProps> = ({ items, onRestore, onDownload }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div 
            key={item.id} 
            className="group relative bg-brand-surface rounded-lg shadow-lg overflow-hidden animate-fade-in"
        >
          <img
            src={item.image}
            alt="Generated Ananse cartoon history"
            className="w-full h-48 object-cover"
          />
           {item.frames && (
            <div className="absolute top-2 right-2 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-full">
              Anim
            </div>
           )}
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
             <p className="text-xs text-brand-text-muted text-center mb-4 line-clamp-3">{item.prompt}</p>
             <button
                onClick={() => onRestore(item)}
                className="w-full text-center py-2 px-4 mb-2 bg-brand-primary text-white font-semibold rounded-md hover:scale-105 transform transition-transform"
            >
                Restore
            </button>
            <button
                onClick={() => onDownload(item.image, `ananse-scene-${item.id}.jpeg`)}
                className="w-full text-center py-2 px-4 flex items-center justify-center gap-2 bg-brand-secondary/80 text-brand-background font-semibold rounded-md hover:scale-105 transform transition-transform"
            >
                <DownloadIcon className="h-4 w-4"/>
                Download
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;

```

### FILE: components/Icons.tsx
```typescript

import React from 'react';

interface IconProps {
  className?: string;
}

export const SparklesIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75c0-5.056 2.383-9.555 6.084-12.436A6.75 6.75 0 019.315 7.584zM15 3a.75.75 0 01.75.75c0 2.682-1.06 5.235-2.936 7.11-1.877 1.875-4.428 2.935-7.11 2.935a.75.75 0 01-.75-.75c0-2.682 1.06-5.235 2.936-7.11C9.765 4.06 12.318 3 15 3z"
      clipRule="evenodd"
    />
  </svg>
);

export const AnanseIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10,7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
        <path d="M4.22,14.5A2.5,2.5 0 0,1 6.72,17A2.5,2.5 0 0,1 4.22,19.5A2.5,2.5 0 0,1 1.72,17A2.5,2.5 0 0,1 4.22,14.5M19.78,14.5A2.5,2.5 0 0,1 22.28,17A2.5,2.5 0 0,1 19.78,19.5A2.5,2.5 0 0,1 17.28,17A2.5,2.5 0 0,1 19.78,14.5M12,14A3,3 0 0,1 15,17A3,3 0 0,1 12,20A3,3 0 0,1 9,17A3,3 0 0,1 12,14Z" transform="translate(0, -6)" />
        <path d="M3.79,10.29L1.41,8.91L2.12,7.5L4.5,8.88L3.79,10.29M20.21,10.29L19.5,8.88L21.88,7.5L22.59,8.91L20.21,10.29M6.93,13.62L4.88,12.5L5.59,11.09L7.64,12.21L6.93,13.62M17.07,13.62L16.36,12.21L18.41,11.09L19.12,12.5L17.07,13.62M9.83,16.5L8.21,15.5L8.92,14.09L10.54,15.12L9.83,16.5M14.17,16.5L13.46,15.12L15.08,14.09L15.79,15.5L14.17,16.5M12,19V22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7v2a9 9 0 0 0 9-9 9 9 0 0 0-9-9z"></path>
        <path d="M12 8v5l4.25 2.52.75-1.23-3.5-2.07V8z"></path>
    </svg>
);

export const NextSceneIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
    >
        <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886zM7 5.331l9.122 6.385L7 18.099V5.331z" />
        <path d="M18 3v18a1 1 0 0 0 2 0V3a1 1 0 0 0-2 0z" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

export const FilmIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={className} 
        viewBox="0 0 24 24" 
        fill="currentColor"
    >
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zM6 18H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V8h2v2zm14 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z"/>
    </svg>
);

export const DownloadAllIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
        <line x1="10" y1="3" x2="10" y2="6"></line>
        <line x1="14" y1="3" x2="14" y2="6"></line>
        <line x1="10" y1="9" x2="10" y2="12"></line>
        <line x1="14" y1="9" x2="14" y2="12"></line>
    </svg>
);

```

### FILE: components/Spinner.tsx
```typescript

import React from 'react';

const Spinner: React.FC = () => {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default Spinner;

```

### FILE: CREATION.md
```md
# ananse-cartoon-generator

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

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/ananse-cartoon-generator/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/ananse-cartoon-generator/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/ananse-cartoon-generator/',  // REQUIRED: Assets must load from /ananse-cartoon-generator/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/ananse-cartoon-generator"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/ananse-cartoon-generator">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/ananse-cartoon-generator/`, not at the root
- **Asset Loading**: Without `base: '/ananse-cartoon-generator/'`, assets try to load from `/assets/` instead of `/ananse-cartoon-generator/assets/`
- **Routing**: Without `basename="/ananse-cartoon-generator"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/ananse-cartoon-generator/assets/index-*.js`
- Link tags should reference: `/ananse-cartoon-generator/assets/index-*.css`

If they reference `/assets/` instead of `/ananse-cartoon-generator/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/ananse-cartoon-generator/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/ananse-cartoon-generator/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: ananse-cartoon-generator

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — ananse-cartoon-generator

**Application:** ananse-cartoon-generator
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

Audit log data is stored in `localStorage` under the key `tuc_ananse-cartoon-generator_audit`.

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
# Deployment Guide — ananse-cartoon-generator

**Application:** ananse-cartoon-generator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd ananse-cartoon-generator
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
docker-compose -f docker-compose-all-apps.yml build ananse-cartoon-generator
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up ananse-cartoon-generator
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

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Ananse Cartoon Generator
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Ananse Cartoon Generator**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Ananse Cartoon Generator** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Ananse Cartoon Generator** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Modular React component architecture

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
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âœ… Compliant |
| Test suite present | âŒ Non-compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Tailwind CSS 4.x
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

### FILE: docs/TESTING.md
```md
# Testing Guide — ananse-cartoon-generator

**Application:** ananse-cartoon-generator
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd ananse-cartoon-generator
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

### FILE: e2e.test.ts
```typescript
/**
 * @jest-environment-playwright
 * 
 * This file contains End-to-End tests for the Ananse Cartoon Generator application.
 * It uses Playwright to control a headless Chrome browser to simulate user interactions.
 * 
 * Prerequisites:
 * - Jest and jest-playwright are installed and configured.
 * - The application is running via `npm start` before starting the tests.
 * 
 * To run: `npm test`
 */
import playwright from '@playwright/test';
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';

const APP_URL = process.env.APP_URL || 'http://localhost:5173';
const TIMEOUT = 30000; // 30 seconds for long-running AI tasks

describe('Ananse Cartoon Generator E2E Tests', () => {
    let browser: playwright.Browser;
    let page: playwright.Page;

    beforeAll(async () => {
        browser = await chromium.launch();
        page = await browser.newPage();
        page.setDefaultNavigationTimeout(TIMEOUT);
        page.setDefaultTimeout(TIMEOUT);
    });

    afterAll(async () => {
        await browser.close();
    });

    test('should load the initial page correctly', async () => {
        await page.goto(APP_URL);
        
        // Check for header
        const headerText = await page.$eval('h1', el => el.textContent);
        expect(headerText).toBe('Ananse Cartoon Generator');

        // Check for initial prompt in textarea
        const initialPrompt = await page.$eval('[data-testid="prompt-textarea"]', el => (el as HTMLTextAreaElement).value);
        expect(initialPrompt).toContain('Ananse: Walking slowly but steadily');

        // Check that the output area is empty initially
        const initialOutputText = await page.$eval('[data-testid="initial-message"]', el => el.textContent);
        expect(initialOutputText).toContain('Your generated cartoon will appear here');
    });

    test('should generate an image and dialog on "Generate Scene" click', async () => {
        await page.goto(APP_URL);

        // Click the generate button
        await page.click('[data-testid="generate-button"]');

        // Wait for the loader to appear and then disappear
        await page.waitForSelector('[data-testid="loading-spinner"]');
        await page.waitForSelector('[data-testid="loading-spinner"]', { hidden: true });

        // Check if the generated image is displayed
        const imageSrc = await page.$eval('[data-testid="generated-image"]', el => (el as HTMLImageElement).src);
        expect(imageSrc).toMatch(/^data:image\/jpeg;base64,/);

        // Check if the dialog is displayed
        const dialogText = await page.$eval('[data-testid="generated-dialog"]', el => (el as HTMLElement).innerText);
        expect(dialogText).toContain('Ananse:');
        expect(dialogText).toContain('Villager:');
    });
    
    test('should generate a new scene description on "Next Scene" click', async () => {
        await page.goto(APP_URL);

        const originalPrompt = await page.$eval('[data-testid="prompt-textarea"]', el => (el as HTMLTextAreaElement).value);

        // Click the "Next Scene" button
        await page.click('[data-testid="next-scene-button"]');

        // Wait for the loader to appear and disappear (by checking the button's disabled state)
        await page.waitForSelector('[data-testid="next-scene-button"]:disabled');
        await page.waitForSelector('[data-testid="next-scene-button"]:not(:disabled)');

        // Check that the prompt has changed
        const newPrompt = await page.$eval('[data-testid="prompt-textarea"]', el => (el as HTMLTextAreaElement).value);
        expect(newPrompt).not.toBe(originalPrompt);
        expect(newPrompt).toContain('Ananse:');
        expect(newPrompt).toContain('Visual:');
        expect(newPrompt).toContain('Action:');
    });

    test('should add a generated scene to the history section', async () => {
        await page.goto(APP_URL);

        // Initially, there should be no history section
        let historySection = await page.$('[data-testid="history-section"]');
        expect(historySection).toBeNull();
        
        // Click the generate button
        await page.click('[data-testid="generate-button"]');

        // Wait for generation to complete
        await page.waitForSelector('[data-testid="loading-spinner"]', { hidden: true });
        
        // Now history section should be visible
        historySection = await page.waitForSelector('[data-testid="history-section"]');
        expect(historySection).not.toBeNull();

        // Check for a history item
        const historyItem = await page.$('[data-testid="history-section"] .grid > div');
        expect(historyItem).not.toBeNull();
    });
});

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
    <script type="importmap">
    {
      "imports": {
        "react": "https://esm.sh/react@^19.1.1",
        "react-dom/": "https://esm.sh/react-dom@^19.1.1/",
        "react/": "https://esm.sh/react@^19.1.1/",
        "@google/genai": "https://esm.sh/@google/genai@^1.12.0",
        "puppeteer": "https://esm.sh/puppeteer@^24.15.0",
        "@jest/globals": "https://esm.sh/@jest/globals@^30.0.5",
        "@vitejs/plugin-react": "https://esm.sh/@vitejs/plugin-react@^4.7.0",
        "vite": "https://esm.sh/vite@^7.0.6",
        "dotenv/": "https://esm.sh/dotenv@^17.2.1/",
        "process": "https://esm.sh/process@^0.11.10"
      }
    }
    </script>
    <link rel="stylesheet" href="/index.css">
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body class="bg-brand-background text-brand-text">
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">ananse cartoon generator</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

    <script type="module" src="./index.tsx"></script>
  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: jest-puppeteer.config.js
```javascript
import 'dotenv/config';

module.exports = {
  server: {
    command: 'npm start',
    port: 5173,
    launchTimeout: 30000,
    debug: true,
  },
  launch: {
    headless: process.env.HEADLESS !== 'false', // Run in headless mode unless HEADLESS=false is set
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO, 10) : 0,
    devtools: process.env.DEVTOOLS === 'true',
  },
  browserContext: 'default',
};

```

### FILE: jest.config.js
```javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'jest-playwright',
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-node/esm',
  },
  moduleNameMapper: {
    '^(.*)\\.js$': '$1',
  },
  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['expect-playwright'],
  testTimeout: 40000,
};

```

### FILE: metadata.json
```json
{
  "name": "Ananse Cartoon Generator",
  "description": "A web application that uses AI to generate cartoon scenes from the stories of Ananse the spider based on textual descriptions. Users can input a scene and the app creates a visual representation.",
  "requestFramePermissions": [],
  "prompt": ""
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
  "packageManager": "pnpm@10.30.1",
  "name": "ananse-cartoon-generator",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "test": "jest",
    "preview": "vite preview",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@google/genai": "^1.12.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0",
    "lucide-react": "^0.400.0",
    "@tailwindcss/vite": "^4.2.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.5",
    "dotenv": "^16.4.5",
    "@vitejs/plugin-react": "^4.3.4",
    "postcss": "^8.4.38",
    "serve": "14.2.5",
    "tailwindcss": "^4.2.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.3",
    "vite": "7.3.1",
    "@tailwindcss/vite": "^4.2.0",
    "@playwright/test": "^1.49.0"
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
    baseURL: 'http://localhost:5173',
    ...devices['Desktop Chrome'],
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run start',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});

```

### FILE: README.md
```md
# Ananse Cartoon Generator

Welcome to the Ananse Cartoon Generator! This web application brings the timeless stories of Ananse the spider to life by using the power of Google's Gemini AI. Users can write a scene description and watch as the AI generates vibrant cartoon visuals, short animations, and even dialog.

![Screenshot of Ananse Cartoon Generator](https://storage.googleapis.com/framer-screenshots/ananse-cartoon-generator.png)

## ✨ Features

-   **Static Image Generation**: Create a high-quality, vibrant cartoon image from a detailed text prompt.
-   **Animation Generation**: Produce short, 15-frame animations to create more dynamic and lively scenes.
-   **Dialog Generation**: Automatically generate a short, character-driven dialog that matches the scene's tone.
-   **Story Continuation**: Use the "Next Scene" feature to have the AI generate a new prompt that logically follows the current one, helping to build a narrative.
-   **Generation History**: All your creations are saved in a history panel, allowing you to easily view, restore, or download them later.
-   **Download Options**: Download static images, individual animation frames, or all frames at once. Dialog can also be downloaded as a text file.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Models**: [Google Gemini API](https://ai.google.dev/)
    -   `imagen-3.0-generate-002` for image generation.
    -   `gemini-2.5-flash` for text, dialog, and animation prompt generation.
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Testing**: [Jest](https://jestjs.io/) & [Playwright](https://pptr.dev/) for End-to-End tests.

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Node.js and npm
-   A valid Google Gemini API key. You can get one from the [Google AI Studio](https://makersuite.google.com/).

### 1. Clone the Repository

Clone this project to your local machine.

### 2. Install Dependencies

Navigate to the project's root directory and run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named `.env` in the project root. Add your Gemini API key to this file:

```
VITE_API_KEY=[REDACTED_CREDENTIAL]
```

### 4. Run the Application

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:5173`.

## 🧪 Running Tests

To run the end-to-end test suite, use the following command:

```bash
npm test
```

This will launch a headless browser, run through the user scenarios defined in `e2e.test.ts`, and report the results in your console.

```

### FILE: services/geminiService.ts
```typescript

import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on a text prompt using the Gemini API.
 * @param userPrompt The user-provided description of the scene.
 * @returns A promise that resolves to the base64 encoded image string.
 */
export const generateImage = async (userPrompt: string): Promise<string> => {
    try {
        const fullPrompt = `Vibrant, dynamic cartoon illustration of Ananse the spider, 
combining African folklore aesthetics with modern animation techniques. 
The scene should feature:
- Rich, saturated colors with dramatic lighting
- Expressive character poses and facial expressions
- Detailed background elements that tell a story
- Visual humor and whimsical details
Style: A mix of traditional African art and contemporary cartoon animation.
Scene: ${userPrompt}
Important: Include at least three surprising visual elements that make the image more engaging and memorable.`;

        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("API did not return any images.");
        }

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return base64ImageBytes;

    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate image: ${message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};

/**
 * Generates a sequence of image frames for a short animation by creating a keyframe first.
 * @param userPrompt The user-provided description of the scene.
 * @param onProgress A callback function to report progress (0 to 1).
 * @returns A promise that resolves to an array of base64 encoded image strings.
 */
export const generateAnimationFrames = async (
    userPrompt: string, 
    onProgress: (progress: number) => void
): Promise<string[]> => {
    try {
        onProgress(0);
        const allFrames: string[] = [];

        // Step 1: Generate the first frame, which acts as our keyframe.
        // This ensures a high-quality, accurate start to the animation.
        const firstFrameImage = await generateImage(userPrompt);
        allFrames.push(firstFrameImage);
        onProgress(1 / 15);

        // A small delay before generating prompts can help avoid rate limit issues.
        await new Promise(resolve => setTimeout(resolve, 1100));

        // Step 2: Generate prompts for the remaining 14 frames based on the initial scene.
        const framePromptsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The first frame of an animation is described as: "${userPrompt}". 
            Act as a professional animator. Create a sequence of fourteen subsequent, detailed visual prompts for a short, fluid animation that continues from this first frame. 
            Each prompt must describe a very small, incremental movement from the last to ensure the final animation is smooth and not jerky. 
            Maintain a consistent style, character, and background throughout all frames.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        frames: {
                            type: Type.ARRAY,
                            description: "An array of fourteen strings, where each string is a detailed prompt for a single animation frame.",
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["frames"]
                },
            },
        });

        const { frames: subsequentPrompts } = JSON.parse(framePromptsResponse.text.trim());

        if (!subsequentPrompts || !Array.isArray(subsequentPrompts) || subsequentPrompts.length === 0) {
            throw new Error("Failed to generate valid animation frame prompts for subsequent frames.");
        }
        
        const totalFramesToGenerate = subsequentPrompts.length;

        // Step 3: Generate an image for each subsequent prompt sequentially.
        for (let i = 0; i < totalFramesToGenerate; i++) {
            const framePrompt = subsequentPrompts[i];
            const fullPrompt = `Vibrant, dynamic cartoon illustration of Ananse the spider, in a consistent style for an animation sequence. Style: A mix of traditional African art and contemporary cartoon animation, with rich, saturated colors and expressive characters. Scene: ${framePrompt}`;
            
            const response = await ai.models.generateImages({
                model: 'imagen-3.0-generate-002',
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9',
                },
            });

            if (!response.generatedImages || response.generatedImages.length === 0) {
                throw new Error(`API did not return an image for frame ${i + 2}.`);
            }
            allFrames.push(response.generatedImages[0].image.imageBytes);
            
            // Update progress: The first frame is 1/15, the rest are 14/15 of the work.
            onProgress((i + 2) / 15);

            // Add a delay between requests to respect API rate limits
            if (i < totalFramesToGenerate - 1) {
                await new Promise(resolve => setTimeout(resolve, 1100)); // ~55 RPM
            }
        }

        return allFrames;

    } catch (error) {
        console.error("Error generating animation frames with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate animation: ${message}`);
        }
        throw new Error("An unknown error occurred during animation generation.");
    }
};


/**
 * Generates a two-person dialog based on a scene description.
 * @param scene The scene description.
 * @param char1 Name of the first character.
 * @param char2 Name of the second character.
 * @returns A promise that resolves to an array of dialog lines.
 */
export const generateDialog = async (scene: string, char1: string, char2: string): Promise<{ character: string, line: string }[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a 4-6 line dialog between ${char1} and ${char2} that:
- Advances the story naturally
- Reveals character personalities
- Includes humor or surprise
- Matches the scene tone
Scene: "${scene}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            character: {
                                type: Type.STRING,
                                description: `The character speaking (${char1} or ${char2}).`,
                            },
                            line: {
                                type: Type.STRING,
                                description: "The character's line of dialog with personality.",
                            },
                        },
                        required: ["character", "line"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error generating dialog with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate dialog: ${message}`);
        }
        throw new Error("An unknown error occurred during dialog generation.");
    }
};


/**
 * Generates the next scene description to continue the story.
 * @param currentScene The description of the current scene.
 * @returns A promise that resolves to the new scene description.
 */
export const generateNextScene = async (currentScene: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Previous scene:\n${currentScene}`,
            config: {
                systemInstruction: `Create the next scene that:
1. Introduces a surprising but logical development
2. Increases tension or humor
3. Reveals new character aspects
4. Ends with a hook for the next scene
Format strictly as:
Ananse: [character action/expression]
Visual: [vivid description]
Action: [dynamic story event]`,
            }
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error generating next scene with Gemini API:", error);
        if (error instanceof Error) {
            const message = error.message || JSON.stringify(error);
            throw new Error(`Failed to generate next scene: ${message}`);
        }
        throw new Error("An unknown error occurred during next scene generation.");
    }
};

```

### FILE: src/App.tsx
```typescript
import { AdminPanel } from './components/admin/AdminPanel';
import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../components/Spinner';
import { SparklesIcon, AnanseIcon, DownloadIcon, HistoryIcon, NextSceneIcon, CopyIcon } from '../components/Icons';
import History from '../components/History';

const INITIAL_PROMPT = \`Ananse: Walking slowly but steadily back toward the village, the empty pot tucked under his arm, his expression humble but determined.\`;

const App = () => {
  const [view, setView] = useState(() => window.location.hash.startsWith('#/admin') ? 'admin' : 'main');

  useEffect(() => {
    const handleHash = () => setView(window.location.hash.startsWith('#/admin') ? 'admin' : 'main');
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigateToAdmin = () => { window.location.hash = '#/admin'; };
  const navigateToMain = () => { window.location.hash = '#/'; };

  const [prompt, setPrompt] = useState(INITIAL_PROMPT);
  const [isLoading, setIsLoading] = useState(false);

  if (view === 'admin') return <AdminPanel onLogout={navigateToMain} />;

  return (
    <div className=\"min-h-screen bg-[#0F0C07] text-[#F5ECD7] font-serif p-8\">
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999, opacity: 0.1 }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.1'}>
        <button onClick={navigateToAdmin} style={{ fontSize: '10px', background: '#C8A84B', color: '#000', padding: '2px 5px', border: 'none', cursor: 'pointer' }}>ADM</button>
      </div>
      <header className=\"text-center mb-12 border-b border-[#C8A84B]/20 pb-8\">
        <h1 className=\"text-5xl font-black text-[#C8A84B] uppercase tracking-widest\">Ananse Cartoon Generator</h1>
        <p className=\"italic opacity-60 mt-2\">Institutional Narrative Engine</p>
      </header>
      <main className=\"max-w-4xl mx-auto bg-[#141210] p-12 border border-[#C8A84B]/30 shadow-2xl\">
        <p className=\"text-xl leading-relaxed mb-8 italic\">\"Wisdom is like a baobab tree; no one individual can embrace it with both arms.\"</p>
        <div className=\"space-y-6\">
            <label className=\"block font-bold uppercase tracking-widest text-[#C8A84B] text-xs\">Scene Narrative</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} className=\"w-full h-40 bg-black/40 border border-[#C8A84B]/20 p-6 text-lg outline-none focus:border-[#C8A84B]\" />
            <button className=\"w-full bg-[#C8A84B] text-black py-4 font-bold uppercase tracking-widest hover:bg-white transition-all\">Generate Digital Folktale</button>
        </div>
      </main>
    </div>
  );
};

export default App;

```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_ananse_cartoon_generator';
const ACCENT   = '#4f46e5';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Ananse Cartoon Generator</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: src/components/admin/AdminPanel.tsx
```typescript
import React from 'react';

export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-[#0F0C07] text-[#F2EBD9] p-12 font-serif">
      <div className="max-w-4xl mx-auto border border-[#C8A84B]/30 p-12 bg-[#141210]">
        <h1 className="text-4xl font-black text-[#C8A84B] uppercase mb-4 tracking-widest">Administrative Control</h1>
        <p className="italic text-[#C8A84B]/60 mb-12 border-b border-[#C8A84B]/20 pb-4">TUC Secure Diagnostic Node</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-white/5 border border-[#C8A84B]/10">
                <h3 className="font-bold text-[#C8A84B] mb-2 uppercase text-xs tracking-widest">System Status</h3>
                <p className="text-2xl font-bold">OPERATIONAL</p>
            </div>
            <div className="p-6 bg-white/5 border border-[#C8A84B]/10">
                <h3 className="font-bold text-[#C8A84B] mb-2 uppercase text-xs tracking-widest">Environment</h3>
                <p className="text-2xl font-bold">REACT 19.2.4</p>
            </div>
        </div>

        <button 
            onClick={onLogout}
            className="px-8 py-3 border border-[#C8A84B] text-[#C8A84B] hover:bg-[#C8A84B] hover:text-[#0F0C07] transition-all uppercase font-bold tracking-widest text-xs"
        >
            Exit Terminal
        </button>
      </div>
    </div>
  );
};

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/index.css
```css
@import "tailwindcss";

@theme {
  --color-tuc-maroon: #630f12;
  --color-tuc-gold: #ffcb05;
  --color-tuc-beige: #f5f5dc;
  --color-tuc-green: #3db54a;
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background-color: #ffffff;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
}

/* TUC utility classes */
.tuc-header { background-color: #630f12; color: #ffffff; }
.tuc-accent { color: #630f12; }
.tuc-btn {
  background-color: #630f12;
  color: #ffffff;
  border-radius: 6px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
}
.tuc-btn:hover { background-color: #7a1318; }
.tuc-gold { color: #ffcb05; }
.tuc-bg { background-color: #630f12; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #630f12; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #7a1318; }

```

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4040;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = [REDACTED_CREDENTIAL]
const DB_NAME = process.env.DB_NAME || 'content_generation';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS generation_requests (
        id VARCHAR(255) PRIMARY KEY, request_type VARCHAR(100),
        description TEXT, prompt TEXT,
        status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (request_type), INDEX idx_status (status)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS generated_content (
        id VARCHAR(255) PRIMARY KEY, request_id VARCHAR(255),
        content_url VARCHAR(500), content_type VARCHAR(100),
        generation_time_ms INT, quality_score DECIMAL(3,2),
        approval_status VARCHAR(50), created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES generation_requests(id),
        INDEX idx_request (request_id), INDEX idx_approval (approval_status)
      )
    `);
    conn.release();
    console.log('Content Generation DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'content-generation' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/request') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const requestId = `req_${Date.now()}`;
          await conn.query(
            'INSERT INTO generation_requests (id, request_type, description, prompt, status) VALUES (?, ?, ?, ?, ?)',
            [requestId, data.type || '', data.desc || '', data.prompt || '', 'pending']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, request_id: requestId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/content')) {
      const conn = await pool.getConnection();
      const [content] = await conn.query('SELECT * FROM generated_content ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(content));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Content Generation API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Ananse Cartoon Generator</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Ananse Cartoon Generator — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('ananse-cartoon-generator', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: SYSTEM_ARCHITECTURE.md
```md
# Ananse Cartoon Generator - System Architecture

This document outlines the high-level system architecture of the Ananse Cartoon Generator application. It is a client-side web application that interacts directly with the Google Gemini API.

## Architecture Diagram

The following diagram illustrates the main components and data flow of the system.

```mermaid
graph TD
    subgraph User Browser
        A[User] -- Interacts with --> B{React Application};
        B -- Renders UI & Progress --> A;
        B -- Sends API Requests (Prompts) --> C[geminiService.ts];
    end

    subgraph Google Cloud
        D[Imagen 3 API];
        G[Gemini Flash API];
    end
    
    subgraph "Development & Testing"
        E[Vite Dev Server] -- Serves --> B;
        F[Jest + Playwright] -- Runs E2E Tests on --> B;
    end

    C -- "Image Prompts" --> D;
    C -- "Text & Dialog Prompts" --> G;
    D -- "Image Data" --> C;
    G -- "JSON (Text)" --> C;

    note for C "Animation Orchestration:<br/>1. Generate keyframe image (Imagen)<br/>2. Generate 14 text prompts (Gemini Flash)<br/>3. Loop to generate 14 frames (Imagen)"

    style A fill:#D2691E,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#2a2a2a,stroke:#FFD700,stroke-width:2px,color:#f0f0f0
    style C fill:#2a2a2a,stroke:#FFD700,stroke-width:2px,color:#f0f0f0
    style D fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#646cff,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#c21325,stroke:#333,stroke-width:2px,color:#fff
```

### Components

1.  **User**: The end-user interacting with the application through their web browser.

2.  **React Application**: The client-side application built with React and TypeScript. It's responsible for managing state, handling user input, and rendering the UI, including real-time progress for animations.

3.  **geminiService.ts**: A dedicated service module that encapsulates all communication with the Google AI backend. It formats requests and processes responses, orchestrating the multi-step process for animation generation.

4.  **Google AI Platform**:
    -   **Imagen 3 API**: Used for generating high-quality images from text prompts. This is used for both static images and each frame of an animation.
    -   **Gemini Flash API**: A fast, multimodal model used for generating text-based content, including scene dialog, "next scene" prompts, and the sequence of prompts for animation frames.

5.  **Vite Dev Server**: A fast development server that bundles the code and serves the React application during development.

6.  **Jest + Playwright**: The end-to-end testing framework used to automate browser interactions and verify the application's functionality.

### Data Flow

The application has two primary generation flows:

#### Static Image Generation
1.  The user enters a scene description and clicks "Generate Image".
2.  The `geminiService` sends the prompt to the **Imagen 3 API**.
3.  The API returns the generated image as a base64 string.
4.  The React app displays the image to the user.

#### Animation Generation
This is a complex, multi-step process orchestrated by `geminiService.ts` to ensure smooth animations and avoid API rate limits.
1.  The user enters a scene description and clicks "Generate Animation".
2.  **Step 1 (Keyframe)**: The service first calls the **Imagen 3 API** to generate a single high-quality "keyframe" image. The UI progress is updated.
3.  **Step 2 (Frame Prompts)**: The service then calls the **Gemini Flash API** with the original prompt, asking it to generate 14 subsequent text prompts for the animation's "in-between" frames.
4.  **Step 3 (Frame Generation Loop)**: The service iterates through the 14 new prompts, calling the **Imagen 3 API** for each one sequentially, with a delay between calls to respect rate limits.
5.  With each new frame generated, the UI's progress bar is updated.
6.  Once all 15 frames are complete, the React app displays them in the animation player.

```

### FILE: testing_guide.md
```md
# Ananse Cartoon Generator - Testing Guide

This guide provides instructions on how to set up and run the end-to-end (E2E) tests for the Ananse Cartoon Generator application. The tests use Jest and Playwright to simulate user interactions in a real browser environment.

## Application Features Overview

Before testing, it's helpful to understand the core features of the application:

-   **Generation Mode**: A switch allows the user to select between generating a `Static Image` or a 15-frame `Animation`.
-   **Scene Generation**: The main action button generates the selected content based on the "Scene Description" text area.
-   **Dialog Generation**: An optional feature that generates a short dialog between two characters to accompany the visual scene.
-   **Next Scene**: This button uses AI to generate a new scene prompt that continues the story from the current description.
-   **History**: Previously generated scenes are saved and displayed in a history section, from which they can be restored.
-   **Downloads**: Users can download generated images, individual animation frames, and all frames at once. Dialog can also be downloaded as a text file.

## Architecture Overview for Testing

The E2E tests interact with the application as a whole. The following diagram shows the key components involved.

```mermaid
graph TD
    subgraph User Browser
        A[User] -- Interacts with --> B{React Application};
        B -- Renders UI & Progress --> A;
        B -- Sends API Requests (Prompts) --> C[geminiService.ts];
    end

    subgraph Google Cloud
        D[Imagen 3 API];
        G[Gemini Flash API];
    end
    
    subgraph "Development & Testing"
        E[Vite Dev Server] -- Serves --> B;
        F[Jest + Playwright] -- Runs E2E Tests on --> B;
    end

    C -- "Image Prompts" --> D;
    C -- "Text & Dialog Prompts" --> G;
    D -- "Image Data" --> C;
    G -- "JSON (Text)" --> C;

    note for C "Animation Orchestration:<br/>1. Generate keyframe image (Imagen)<br/>2. Generate 14 text prompts (Gemini Flash)<br/>3. Loop to generate 14 frames (Imagen)"

    style A fill:#D2691E,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#2a2a2a,stroke:#FFD700,stroke-width:2px,color:#f0f0f0
    style C fill:#2a2a2a,stroke:#FFD700,stroke-width:2px,color:#f0f0f0
    style D fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
    style E fill:#646cff,stroke:#333,stroke-width:2px,color:#fff
    style F fill:#c21325,stroke:#333,stroke-width:2px,color:#fff
```

## Prerequisites

-   **Node.js and npm**: Ensure you have a recent version of Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
-   **API Key**: You must have a valid Google Gemini API key.

## 1. Setup

### a. Clone the Repository

First, ensure you have all the application files on your local machine.

### b. Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install all the necessary dependencies listed in `package.json`:

```bash
npm install
```

### c. Configure Environment Variables

The application requires a Google Gemini API key to function.

1.  Create a file named `.env` in the root of the project directory.
2.  Add your API key to this file in the following format:

    ```
    VITE_API_KEY=[REDACTED_CREDENTIAL]
    ```

    The Vite development server will automatically load this variable and make it available to the application.

## 2. Running the Application

Before running tests, it's good practice to ensure the application runs correctly on its own. Start the development server with:

```bash
npm start
```

This will launch the application, typically on `http://localhost:5173`. The `jest-playwright.config.js` is configured to automatically start this server before running the tests.

## 3. Running the Tests

To execute the entire E2E test suite, run the following command from the project root:

```bash
npm test
```

This command will:
1.  Start the Vite development server (if not already running).
2.  Launch a Chromium browser instance (controlled by Playwright).
3.  Run the tests defined in `e2e.test.ts`.
4.  Output the test results to your console.
5.  Shut down the server and browser instance.

### Test Configuration

-   **Headless Mode**: By default, Playwright runs in headless mode (no visible browser window). You can run tests in a visible browser by setting an environment variable: `HEADLESS=false npm test`.
-   **Slow Motion**: To slow down the test execution and observe the browser interactions, you can use the `SLOWMO` environment variable: `SLOWMO=100 npm test` (the value is in milliseconds).

```

### FILE: tests/e2e/app.spec.ts
```typescript
import { test, expect } from '@playwright/test';

test.describe('Ananse Cartoon Generator', () => {
  test('should load the initial page correctly', async ({ page }) => {
    await page.goto('/');
    const headerText = await page.locator('h1').textContent();
    expect(headerText).toBe('Ananse Cartoon Generator');
  });

  test('should display initial prompt in textarea', async ({ page }) => {
    await page.goto('/');
    const initialPrompt = await page.locator('[data-testid="prompt-textarea"]').inputValue();
    expect(initialPrompt).toContain('Ananse');
  });

  test('should show initial message in output area', async ({ page }) => {
    await page.goto('/');
    const initialMessage = page.locator('[data-testid="initial-message"]');
    await expect(initialMessage).toContainText('Your generated cartoon will appear here');
  });

  test('should display generate button', async ({ page }) => {
    await page.goto('/');
    const generateBtn = page.locator('[data-testid="generate-button"]');
    await expect(generateBtn).toBeVisible();
  });

  test('should display next scene button', async ({ page }) => {
    await page.goto('/');
    const nextSceneBtn = page.locator('[data-testid="next-scene-button"]');
    await expect(nextSceneBtn).toBeVisible();
  });
});

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["jest", "@jest/globals"]
  },
  "include": ["src", "e2e.test.ts", "jest.config.js", "jest-puppeteer.config.js", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

### FILE: tsconfig.node.json
```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "emitDeclarationOnly": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["jest", "@jest/globals"]
  },
  "include": ["src", "e2e.test.ts", "jest.config.js", "jest-puppeteer.config.js", "vite.config.ts"]
}

```

### FILE: vite.config.ts
```typescript
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '', '');
  return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
    plugins: [react(), tailwindcss()],
  base: './',
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/__tests__/**/*.e2e.ts'],
    testTimeout: 30000,
  },
});

```

