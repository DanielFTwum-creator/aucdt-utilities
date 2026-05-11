import React, { useRef, useState } from 'react';
import { ThumbnailConfig, ThumbnailVariant } from '../types';
import { Play, Pause, Eye, EyeOff, Grid, Type, User, Layers, Image, Upload, ScanFace, AlignLeft, Download, Loader2, Share2, Move, ZoomIn, Scaling, SplitSquareHorizontal } from 'lucide-react';

interface ControlsProps {
  config: ThumbnailConfig;
  setConfig: React.Dispatch<React.SetStateAction<ThumbnailConfig>>;
  onExport: () => void;
  onShare: () => void;
  isExporting: boolean;
}

export const Controls: React.FC<ControlsProps> = ({ config, setConfig, onExport, onShare, isExporting }) => {
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);
  
  // Local state to toggle between Left/Right transform controls
  const [activeTransformSide, setActiveTransformSide] = useState<'left' | 'right'>('left');

  const handleChange = (key: keyof ThumbnailConfig, value: string | boolean | ThumbnailVariant | null | number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (side: 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleChange(side === 'left' ? 'leftImage' : 'rightImage', url);
      // Auto-switch control focus to the newly uploaded side
      setActiveTransformSide(side);
    }
  };

  const variants: { id: ThumbnailVariant; label: string }[] = [
    { id: 'original', label: 'ORIGINAL' },
    { id: 'neon-void', label: 'NEON VOID' },
    { id: 'editorial', label: 'EDITORIAL' },
  ];

  // Helper to determine active image state for the currently selected side
  const currentScale = activeTransformSide === 'left' ? config.leftImageScale : config.rightImageScale;
  const currentX = activeTransformSide === 'left' ? config.leftImageX : config.rightImageX;
  const currentY = activeTransformSide === 'left' ? config.leftImageY : config.rightImageY;

  return (
    <div className="w-full max-w-[1280px] mb-10 bg-white/60 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl flex flex-wrap gap-x-8 gap-y-6 items-center justify-between backdrop-blur-sm transition-colors duration-300 shadow-sm">
      
      {/* Inputs Group */}
      <div className="flex flex-wrap gap-6 items-center">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-zinc-500 dark:text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
             <User size={10} /> Artist Name
          </label>
          <input 
            type="text" 
            value={config.artistName}
            onChange={(e) => handleChange('artistName', e.target.value)}
            className="bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs px-3 py-2 rounded font-mono focus:border-burnt-amber focus:outline-none w-36 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
            <Type size={10} /> Hook Text
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={config.hookText}
              onChange={(e) => handleChange('hookText', e.target.value)}
              className="bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-300 text-xs px-3 py-2 rounded font-mono focus:border-burnt-amber focus:outline-none w-28 transition-colors"
            />
            <input 
              type="text" 
              value={config.accentWord}
              onChange={(e) => handleChange('accentWord', e.target.value)}
              className="bg-zinc-100 dark:bg-black/50 border border-zinc-300 dark:border-zinc-700 text-burnt-amber text-xs px-3 py-2 rounded font-mono focus:border-burnt-amber focus:outline-none w-24 font-bold transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Face Position & Image Adjust Group */}
      <div className="flex items-center gap-6 border-l border-r border-zinc-200 dark:border-zinc-800 px-6 mx-2">
        
        {/* Frame Adjust */}
        <div className="flex flex-col gap-2">
             <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
                <Scaling size={10} /> Face Frame
            </label>
            <div className="flex gap-3 items-center">
                 {/* Scale */}
                 <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-1"><ZoomIn size={8}/> {config.faceScale.toFixed(1)}x</span>
                    <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={config.faceScale}
                        onChange={(e) => handleChange('faceScale', Number(e.target.value))}
                        className="w-16 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
                 {/* X/Y */}
                 <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-1"><Move size={8}/> {config.faceX},{config.faceY}</span>
                     <div className="flex gap-1">
                         <input
                            type="range"
                            min="-400"
                            max="400"
                            step="10"
                            value={config.faceX}
                            onChange={(e) => handleChange('faceX', Number(e.target.value))}
                            className="w-12 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Face X"
                        />
                        <input
                            type="range"
                            min="-300"
                            max="300"
                            step="10"
                            value={config.faceY}
                            onChange={(e) => handleChange('faceY', Number(e.target.value))}
                            className="w-12 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Face Y"
                        />
                     </div>
                 </div>
                 {/* Spread */}
                 <div className="flex flex-col gap-1 ml-2">
                    <span className="text-[9px] text-zinc-600 flex items-center gap-1"><SplitSquareHorizontal size={8}/> Gap</span>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={config.faceSpread}
                        onChange={(e) => handleChange('faceSpread', Number(e.target.value))}
                        className="w-14 h-1.5 accent-burnt-amber bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                 </div>
            </div>
        </div>

        {/* Image Adjust (Conditional) */}
        {(config.leftImage || config.rightImage) && (
            <div className="flex flex-col gap-2 pl-6 border-l border-zinc-200 dark:border-zinc-800/50">
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest flex items-center gap-1">
                        <Image size={10} /> Img Adjust
                    </label>
                    <div className="flex bg-zinc-200 dark:bg-zinc-800 rounded p-0.5 ml-2">
                        <button 
                            onClick={() => setActiveTransformSide('left')} 
                            className={`px-2 py-0.5 text-[9px] rounded transition-colors ${activeTransformSide === 'left' ? 'bg-zinc-600 text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
                            disabled={!config.leftImage}
                        >
                            L
                        </button>
                        <button 
                            onClick={() => setActiveTransformSide('right')} 
                            className={`px-2 py-0.5 text-[9px] rounded transition-colors ${activeTransformSide === 'right' ? 'bg-zinc-600 text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
                            disabled={!config.rightImage}
                        >
                            R
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-3 items-center">
                     {/* Scale */}
                     <div className="flex flex-col gap-1">
                        <input
                            type="range"
                            min="0.1"
                            max="3.0"
                            step="0.1"
                            value={currentScale}
                            onChange={(e) => handleChange(activeTransformSide === 'left' ? 'leftImageScale' : 'rightImageScale', Number(e.target.value))}
                            className="w-14 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Zoom"
                        />
                     </div>
                     {/* X Pos */}
                     <div className="flex flex-col gap-1">
                        <input
                            type="range"
                            min="-400"
                            max="400"
                            step="10"
                            value={currentX}
                            onChange={(e) => handleChange(activeTransformSide === 'left' ? 'leftImageX' : 'rightImageX', Number(e.target.value))}
                            className="w-14 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="X Position"
                        />
                     </div>
                      {/* Y Pos */}
                      <div className="flex flex-col gap-1">
                        <input
                            type="range"
                            min="-400"
                            max="400"
                            step="10"
                            value={currentY}
                            onChange={(e) => handleChange(activeTransformSide === 'left' ? 'leftImageY' : 'rightImageY', Number(e.target.value))}
                            className="w-14 h-1.5 accent-zinc-500 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                            title="Y Position"
                        />
                     </div>
                </div>
            </div>
        )}
      </div>

      {/* Assets & Toggles Group */}
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Face Assets */}
        <div className="flex items-center gap-2 pr-6 border-r border-zinc-200 dark:border-zinc-800">
            {/* Hidden Inputs */}
            <input ref={leftInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('left', e)} />
            <input ref={rightInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('right', e)} />

            <button 
                onClick={() => leftInputRef.current?.click()}
                className={`flex items-center gap-1 px-3 py-2 rounded text-[10px] font-mono border transition-all ${config.leftImage ? 'border-burnt-amber text-burnt-amber' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Upload Left Face"
            >
                <Upload size={12} /> L
            </button>
            <button 
                onClick={() => rightInputRef.current?.click()}
                className={`flex items-center gap-1 px-3 py-2 rounded text-[10px] font-mono border transition-all ${config.rightImage ? 'border-cyan-shadow text-cyan-600 dark:text-cyan-400' : 'border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                title="Upload Right Face"
            >
                <Upload size={12} /> R
            </button>

            <button
                onClick={() => handleChange('showCssFace', !config.showCssFace)}
                className={`ml-1 p-2 rounded border transition-all ${config.showCssFace ? 'border-zinc-500 text-zinc-800 dark:text-zinc-300' : 'border-zinc-300 dark:border-zinc-800 text-zinc-500 dark:text-zinc-600'}`}
                title="Toggle CSS Structure"
            >
                <ScanFace size={14} />
            </button>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
            <button
            onClick={() => handleChange('animate', !config.animate)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border transition-all ${
                config.animate 
                ? 'bg-burnt-amber/10 border-burnt-amber text-burnt-amber' 
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            >
            {config.animate ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
            onClick={() => handleChange('showSafeZones', !config.showSafeZones)}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border transition-all ${
                config.showSafeZones 
                ? 'bg-red-500/10 border-red-500 text-red-500 dark:text-red-400' 
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
            title="Safe Zones"
            >
            {config.showSafeZones ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
        </div>

        {/* Action Buttons */}
        <div className="ml-auto flex gap-3">
            <button
            onClick={onShare}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Share"
            >
                <Share2 size={14} />
            </button>
            
            <button
            onClick={onExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 rounded text-xs font-mono border border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            </button>
        </div>

      </div>
    </div>
  );
};