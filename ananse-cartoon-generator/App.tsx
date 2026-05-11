
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
