import React from 'react';
import { Settings, Sliders, Monitor, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface VisualConfig {
  gridSize: number;
  decay: number;
  colorPrimary: string;
  colorSecondary: string;
  sensitivity: number;
  mode: 'ripple' | 'matrix' | 'plasma' | 'wave' | 'silhouette';
  activeShape: 'africa' | 'world';
  silhouetteSize: number;
  activeVideo: string;
  useVideoBackground: boolean;
}

const VIDEOS = {
  collection: "https://sashmade.com/media/animate%20%2820%29.mp4",
  hero1: "https://sashmade.com/media/Hailuo_Video_Lifestyle%20Fashion%20Shot%20_Elegan_482623006861987841.mp4",
  hero2: "https://sashmade.com/media/WhatsApp%20Video%202026-02-19%20at%206.18.13%20PM.mp4",
  techbridge7: "https://media.techbridge.edu.gh/media/banner7.mp4",
  techbridge6: "https://media.techbridge.edu.gh/media/banner6.mp4",
  techbridge1: "https://media.techbridge.edu.gh/media/banner1.mp4"
};

interface ControlsProps {
  config: VisualConfig;
  onChange: (newConfig: VisualConfig) => void;
}

const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const handleChange = (key: keyof VisualConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-80 shadow-2xl text-white">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 font-mono">
                <Monitor className="w-5 h-5 text-emerald-400" />
                LUMINA OS
            </h2>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/10 rounded-full">
                <Settings className="w-5 h-5" />
            </button>
        </div>

        {isOpen && (
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['ripple', 'matrix', 'plasma', 'wave', 'silhouette'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => handleChange('mode', m)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    config.mode === m 
                                    ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                {m.charAt(0).toUpperCase() + m.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Background</label>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => handleChange('useVideoBackground', false)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                                !config.useVideoBackground
                                ? 'bg-emerald-500 text-black' 
                                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                            }`}
                        >
                            Solid Black
                        </button>
                        <div className="space-y-1">
                            <button
                                onClick={() => handleChange('useVideoBackground', true)}
                                className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                                    config.useVideoBackground
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                Video Wall
                            </button>
                            
                            {config.useVideoBackground && (
                                <div className="pl-2 space-y-1 border-l-2 border-emerald-500/30 mt-2">
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.collection)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.collection
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Collection / Sidebar
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.hero1)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.hero1
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Hero: Elegant
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.hero2)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.hero2
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Hero: Lifestyle
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.techbridge7)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.techbridge7
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        TechBridge: Banner 7
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.techbridge6)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.techbridge6
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        TechBridge: Banner 6
                                    </button>
                                    <button
                                        onClick={() => handleChange('activeVideo', VIDEOS.techbridge1)}
                                        className={`w-full px-3 py-1.5 rounded text-xs font-medium text-left transition-all ${
                                            config.activeVideo === VIDEOS.techbridge1
                                            ? 'text-emerald-400 bg-emerald-500/10' 
                                            : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        TechBridge: Banner 1
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {config.mode === 'silhouette' && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Shape</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleChange('activeShape', 'africa')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    config.activeShape === 'africa'
                                    ? 'bg-emerald-500 text-black' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                Africa
                            </button>
                            <button
                                onClick={() => handleChange('activeShape', 'world')}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    config.activeShape === 'world'
                                    ? 'bg-emerald-500 text-black' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                }`}
                            >
                                World
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Size</span>
                            <span className="font-mono">{Math.round(config.silhouetteSize * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="3.0" 
                            step="0.1"
                            value={config.silhouetteSize} 
                            onChange={(e) => handleChange('silhouetteSize', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Sliders className="w-3 h-3" /> Parameters
                    </label>
                    
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Grid Size</span>
                            <span className="font-mono">{config.gridSize}px</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="50" 
                            value={config.gridSize} 
                            onChange={(e) => handleChange('gridSize', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Sensitivity</span>
                            <span className="font-mono">{Math.round(config.sensitivity * 100)}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="5" 
                            step="0.1"
                            value={config.sensitivity} 
                            onChange={(e) => handleChange('sensitivity', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Decay (Ripple)</span>
                            <span className="font-mono">{config.decay}</span>
                        </div>
                        <input 
                            type="range" 
                            min="0.8" 
                            max="0.99" 
                            step="0.01"
                            value={config.decay} 
                            onChange={(e) => handleChange('decay', Number(e.target.value))}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">Palette</label>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-1">
                            <span className="text-[10px] text-gray-500">Primary</span>
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                <input 
                                    type="color" 
                                    value={config.colorPrimary}
                                    onChange={(e) => handleChange('colorPrimary', e.target.value)}
                                    className="w-6 h-6 rounded bg-transparent border-none cursor-pointer"
                                />
                                <span className="text-xs font-mono">{config.colorPrimary}</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <span className="text-[10px] text-gray-500">Secondary</span>
                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                <input 
                                    type="color" 
                                    value={config.colorSecondary}
                                    onChange={(e) => handleChange('colorSecondary', e.target.value)}
                                    className="w-6 h-6 rounded bg-transparent border-none cursor-pointer"
                                />
                                <span className="text-xs font-mono">{config.colorSecondary}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Activity className="w-3 h-3 animate-pulse text-emerald-500" />
                        <span>System Active • 60 FPS</span>
                    </div>
                </div>
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default Controls;
