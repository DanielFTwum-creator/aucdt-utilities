import React from 'react';
import { VisualizerSettings, IrisColor, ShapeType } from '../types';
import { Settings, Eye, Palette, Zap, Mic, ScanLine, Activity, PenTool, Shapes, Box } from 'lucide-react';

interface Props {
  settings: VisualizerSettings;
  onUpdate: (newSettings: VisualizerSettings) => void;
  audioActive: boolean;
  onToggleAudio: () => void;
}

export const Controls: React.FC<Props> = ({ settings, onUpdate, audioActive, onToggleAudio }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const update = (key: keyof VisualizerSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  const updateOutline = (key: keyof VisualizerSettings['eyeOutlineStyle'], value: any) => {
    onUpdate({
      ...settings,
      eyeOutlineStyle: {
        ...settings.eyeOutlineStyle,
        [key]: value
      }
    });
  };

  const irisColors: IrisColor[] = ['default', 'blue', 'purple', 'green', 'red', 'gold', 'teal', 'orange', 'pink'];

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <button 
        onClick={toggle}
        className="bg-black/80 text-white p-3 rounded-full hover:bg-yellow-600 transition-colors border border-yellow-600 shadow-lg shadow-yellow-900/20"
      >
        <Settings size={24} />
      </button>

      {isOpen && (
        <div className="mt-4 bg-black/90 backdrop-blur-md border border-gray-800 p-6 rounded-xl w-72 text-gray-200 shadow-2xl overflow-y-auto max-h-[80vh]">
          <h3 className="text-yellow-500 font-bold mb-4 font-mono text-lg border-b border-gray-700 pb-2">CONCERT CONTROL</h3>
          
          <div className="space-y-6">
            
            {/* Audio Toggle */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm"><Mic size={16}/> Microphone</span>
              <button 
                onClick={onToggleAudio}
                className={`px-3 py-1 rounded text-xs font-bold ${audioActive ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                {audioActive ? 'LIVE' : 'OFF'}
              </button>
            </div>

            {/* Sensitivity */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Audio Reactivity</label>
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.1"
                value={settings.sensitivity}
                onChange={(e) => update('sensitivity', parseFloat(e.target.value))}
                className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Rotation Speed */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider">Chaos Factor</label>
              <input 
                type="range" 
                min="0" 
                max="5" 
                step="0.1"
                value={settings.rotationSpeed}
                onChange={(e) => update('rotationSpeed', parseFloat(e.target.value))}
                className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Shape Selection */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
               <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mb-2">
                 <Shapes size={14} /> SHAPE GEOMETRY
               </div>
               <select 
                 value={settings.selectedShape}
                 onChange={(e) => update('selectedShape', e.target.value)}
                 className="w-full bg-gray-800 text-gray-200 text-xs rounded p-2 border border-gray-700 focus:border-yellow-500 outline-none"
               >
                 <option value="random">⚡ RANDOM CHAOS</option>
                 <optgroup label="Organic">
                   <option value="africa">🌍 Africa Map</option>
                   <option value="sponge">🧽 Sponge Texture</option>
                   <option value="organic">🦠 Organic Blob</option>
                 </optgroup>
                 <optgroup label="3D Isometric">
                   <option value="dodecahedron">💎 Dodecahedron</option>
                   <option value="cube">🧊 Cube</option>
                   <option value="pyramid">⚠️ Pyramid</option>
                   <option value="cylinder">🛢️ Cylinder</option>
                   <option value="cone">🍦 Cone</option>
                   <option value="prism">🏠 Prism</option>
                 </optgroup>
                 <optgroup label="Basic">
                   <option value="torus">🍩 Torus</option>
                   <option value="circle">⚪ Circle</option>
                   <option value="square">⬜ Square</option>
                   <option value="triangle">🔺 Triangle</option>
                   <option value="polygon">🔷 Polygon</option>
                 </optgroup>
                 <optgroup label="Geometric">
                   <option value="star">⭐ Star</option>
                   <option value="diamond">💠 Diamond</option>
                   <option value="cross">✝️ Cross</option>
                   <option value="pentagon">⬠ Pentagon</option>
                   <option value="hexagon">🛑 Hexagon</option>
                 </optgroup>
               </select>

               <label className="flex items-center justify-between cursor-pointer group mt-4">
                <span className="flex items-center gap-2 text-xs group-hover:text-yellow-500 transition-colors"><Box size={14}/> Wireframe Mode</span>
                <input 
                  type="checkbox" 
                  checked={settings.wireframeMode}
                  onChange={(e) => update('wireframeMode', e.target.checked)}
                  className="accent-yellow-500 w-4 h-4"
                />
              </label>
            </div>

            {/* Trails */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
               <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mb-2">
                 <Activity size={14} /> TRAILS FX
               </div>
               
               <div className="space-y-1">
                 <label className="text-xs text-gray-400">Length</label>
                 <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="1"
                  value={settings.trailLength}
                  onChange={(e) => update('trailLength', parseInt(e.target.value))}
                  className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
               </div>

               <div className="space-y-1">
                 <label className="text-xs text-gray-400">Opacity</label>
                 <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={settings.trailOpacity}
                  onChange={(e) => update('trailOpacity', parseFloat(e.target.value))}
                  className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
               </div>
            </div>

            {/* Iris Colour */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Eye size={14}/> Iris Colour</label>
              <div className="grid grid-cols-3 gap-2">
                {irisColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => update('irisColor', color)}
                    className={`text-xs py-1 px-2 rounded border ${
                      settings.irisColor === color 
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500' 
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Eye Outline Controls */}
             <div className="space-y-2 border-t border-gray-800 pt-4">
               <div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mb-2">
                 <PenTool size={14} /> OUTLINE STYLE
               </div>
               
               <div className="flex items-center justify-between">
                 <label className="text-xs text-gray-400">Colour</label>
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-gray-500">{settings.eyeOutlineStyle.color}</span>
                   <input 
                    type="color" 
                    value={settings.eyeOutlineStyle.color}
                    onChange={(e) => updateOutline('color', e.target.value)}
                    className="w-6 h-6 rounded border-0 p-0 cursor-pointer"
                  />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-xs text-gray-400 flex justify-between">
                    <span>Width</span>
                    <span>{settings.eyeOutlineStyle.width}px</span>
                 </label>
                 <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1"
                  value={settings.eyeOutlineStyle.width}
                  onChange={(e) => updateOutline('width', parseInt(e.target.value))}
                  className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
               </div>

               <div className="space-y-1">
                 <label className="text-xs text-gray-400 flex justify-between">
                    <span>Glow</span>
                    <span>{settings.eyeOutlineStyle.shadowBlur}px</span>
                 </label>
                 <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  step="1"
                  value={settings.eyeOutlineStyle.shadowBlur}
                  onChange={(e) => updateOutline('shadowBlur', parseInt(e.target.value))}
                  className="w-full accent-yellow-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
               </div>
            </div>

            {/* Colour Scheme */}
            <div className="space-y-2 border-t border-gray-800 pt-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2"><Palette size={14}/> Palette</label>
              <div className="grid grid-cols-3 gap-2">
                {(['original', 'neon', 'monochrome', 'red', 'green', 'blue', 'orange', 'purple', 'mixed'] as const).map((scheme) => (
                  <button
                    key={scheme}
                    onClick={() => update('colorScheme', scheme)}
                    className={`text-xs py-1 px-2 rounded border ${
                      settings.colorScheme === scheme 
                        ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500' 
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    {scheme}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="flex items-center gap-2 text-sm group-hover:text-yellow-500 transition-colors"><Eye size={16}/> Show The Eye</span>
                <input 
                  type="checkbox" 
                  checked={settings.showEye}
                  onChange={(e) => update('showEye', e.target.checked)}
                  className="accent-yellow-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="flex items-center gap-2 text-sm group-hover:text-yellow-500 transition-colors"><ScanLine size={16}/> Scanning Light</span>
                <input 
                  type="checkbox" 
                  checked={settings.showBeam}
                  onChange={(e) => update('showBeam', e.target.checked)}
                  className="accent-yellow-500 w-4 h-4"
                />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="flex items-center gap-2 text-sm group-hover:text-yellow-500 transition-colors"><Zap size={16}/> Strobe FX</span>
                <input 
                  type="checkbox" 
                  checked={settings.strobeEnabled}
                  onChange={(e) => update('strobeEnabled', e.target.checked)}
                  className="accent-yellow-500 w-4 h-4"
                />
              </label>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};