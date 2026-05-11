import React, { useState, useCallback } from 'react';
import { TRIPTYCH_DATA } from './constants';
import { TriptychVariation, AspectRatio, ImageResolution } from './types';
import { generatePosterImage } from './services/geminiService';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [selectedVariation, setSelectedVariation] = useState<TriptychVariation>(TRIPTYCH_DATA[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT);
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(ImageResolution.RES_2K);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generatePosterImage({
        variation: selectedVariation,
        aspectRatio: selectedAspectRatio,
        resolution: selectedResolution,
      });
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedVariation, selectedAspectRatio, selectedResolution]);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `lumina-poster-var${selectedVariation.variation}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper to calculate aspect ratio for CSS preview container
  const getPreviewAspectRatioClass = (ratio: AspectRatio) => {
    switch (ratio) {
      case AspectRatio.SQUARE: return 'aspect-square';
      case AspectRatio.PORTRAIT: return 'aspect-[3/4]';
      case AspectRatio.LANDSCAPE: return 'aspect-[4/3]';
      case AspectRatio.TALL: return 'aspect-[9/16]';
      case AspectRatio.WIDE: return 'aspect-[16/9]';
      default: return 'aspect-square';
    }
  };

  return (
    <div className="min-h-screen bg-lux-black text-gray-300 font-sans selection:bg-lux-gold selection:text-black overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT SIDEBAR - Controls & Variation Selection */}
      <div className="w-full md:w-[400px] flex-shrink-0 border-r border-lux-gray bg-[#0f0f0f] h-screen overflow-y-auto flex flex-col">
        
        <div className="p-8 border-b border-lux-gray bg-black sticky top-0 z-10">
          <h1 className="text-2xl font-serif text-lux-gold tracking-widest mb-1">LUMINA</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Triptych Poster Studio</p>
        </div>

        <div className="p-6 space-y-8 flex-grow">
          
          {/* Variation Selector */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">1. Select Narrative</h3>
            <div className="space-y-3">
              {TRIPTYCH_DATA.map((item) => (
                <button
                  key={item.variation}
                  onClick={() => {
                    setSelectedVariation(item);
                    setGeneratedImage(null); // Reset image on change
                  }}
                  className={`w-full text-left p-4 rounded-sm border transition-all duration-300 group ${
                    selectedVariation.variation === item.variation
                      ? 'border-lux-gold bg-lux-gold/10'
                      : 'border-lux-gray bg-[#151515] hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-serif text-sm ${selectedVariation.variation === item.variation ? 'text-lux-gold' : 'text-gray-300'}`}>
                      0{item.variation}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${selectedVariation.variation === item.variation ? 'bg-lux-gold shadow-[0_0_10px_#d4af37]' : 'bg-gray-700'}`} />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1 leading-tight">{item.triptych_shape}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 group-hover:text-gray-400">{item.style}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Configuration Controls */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">2. Configure Output</h3>
            
            <div className="space-y-6">
              {/* Aspect Ratio Grid */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(AspectRatio).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSelectedAspectRatio(ratio)}
                      className={`text-xs py-2 px-1 border rounded-sm transition-colors ${
                        selectedAspectRatio === ratio
                          ? 'bg-white text-black border-white font-bold'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Toggle */}
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Resolution Quality</label>
                <div className="flex gap-2">
                  {[ImageResolution.RES_2K, ImageResolution.RES_4K].map((res) => (
                    <button
                      key={res}
                      onClick={() => setSelectedResolution(res)}
                      className={`flex-1 text-xs py-2 border rounded-sm transition-colors ${
                        selectedResolution === res
                          ? 'bg-lux-gold-dim text-white border-lux-gold-dim font-bold'
                          : 'border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {res} (Pro)
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Generate Button Area */}
        <div className="p-6 bg-black border-t border-lux-gray sticky bottom-0 z-10">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 px-6 font-bold tracking-widest text-sm uppercase transition-all duration-500 ${
              isGenerating 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-lux-gold hover:bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
            }`}
          >
            {isGenerating ? 'Processing request...' : 'Generate Poster'}
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-3 text-center">{error}</p>
          )}
        </div>
      </div>

      {/* RIGHT MAIN - Preview Area */}
      <div className="flex-grow h-screen overflow-y-auto bg-[#050505] relative flex flex-col">
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-20">
          <div className="bg-black/50 backdrop-blur-md p-3 border border-white/10 rounded text-xs max-w-md pointer-events-auto">
             <h2 className="text-lux-gold font-serif mb-1">Prompt Analysis</h2>
             <p className="text-gray-400 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-help">
               {selectedVariation.prompt}
             </p>
          </div>
          
          {generatedImage && (
             <button 
               onClick={handleDownload}
               className="pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur text-white px-4 py-2 text-xs uppercase tracking-widest border border-white/20 hover:border-white transition-all flex items-center gap-2"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75v10.5m0 0L15.75 16.75M12 20.25l-3.75-3.5M12 3v2.25" />
               </svg>
               Save Poster
             </button>
          )}
        </div>

        {/* Canvas Centre */}
        <div className="flex-grow flex items-center justify-center p-8 min-h-[600px]">
          
          {isGenerating ? (
            <Loader />
          ) : generatedImage ? (
            <div className={`relative shadow-2xl transition-all duration-700 ease-out ${getPreviewAspectRatioClass(selectedAspectRatio)} max-h-[85vh] max-w-full`}>
              {/* Poster Frame Effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm opacity-50 blur-sm"></div>
              <div className="relative w-full h-full bg-black border-8 border-[#1a1a1a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden group">
                <img 
                  src={generatedImage} 
                  alt="Generated Art" 
                  className="w-full h-full object-cover"
                />
                {/* Overlay Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"></div>
              </div>
              
              {/* Caption below poster */}
              <div className="absolute -bottom-12 left-0 w-full text-center">
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-600 font-serif">Lumina Collection • {selectedVariation.triptych_shape}</p>
              </div>
            </div>
          ) : (
            <div className="text-center opacity-30 max-w-lg border border-dashed border-gray-700 p-12 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={0.5} stroke="currentColor" className="w-24 h-24 mx-auto mb-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <h2 className="text-xl font-serif text-lux-gold mb-2">Ready to Create</h2>
              <p className="text-sm text-gray-400">Select a narrative variation and aspect ratio to generate a high-fidelity poster visualization.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;