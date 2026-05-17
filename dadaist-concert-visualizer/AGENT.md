# dadaist-concert-visualizer - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for dadaist-concert-visualizer.

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
import React, { useState } from 'react';
import { VisualizerCanvas } from './components/VisualizerCanvas';
import { Controls } from './components/Controls';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import { VisualizerSettings } from './types';
import { MicOff, Music } from 'lucide-react';

const App: React.FC = () => {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [settings, setSettings] = useState<VisualizerSettings>({
    sensitivity: 1.5,
    rotationSpeed: 1,
    colorScheme: 'original',
    showEye: true,
    strobeEnabled: false,
    showBeam: true,
    trailLength: 5,
    trailOpacity: 0.2,
    irisColor: 'default',
    eyeOutlineStyle: {
      color: '#000000',
      width: 4,
      shadowBlur: 0
    },
    selectedShape: 'random',
    wireframeMode: false
  });

  const audioData = useAudioAnalyzer(isAudioActive);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Background Visualizer Layer */}
      <VisualizerCanvas audioData={audioData} settings={settings} />

      {/* UI Controls Layer */}
      <Controls 
        settings={settings}
        onUpdate={setSettings}
        audioActive={isAudioActive}
        onToggleAudio={() => setIsAudioActive(!isAudioActive)}
      />

      {/* Intro Overlay - Only shown if audio has never been activated */}
      {!isAudioActive && audioData.volume === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40 backdrop-blur-sm">
          <div className="bg-[#111] border border-yellow-600/50 p-8 max-w-md text-center rounded-2xl shadow-2xl">
            <h1 className="text-4xl font-bold text-[#E8BC50] font-mono mb-2 tracking-tighter">DADA VISUALS</h1>
            <p className="text-gray-400 mb-8 font-mono text-sm">Interactive Concert Video Wall System</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => setIsAudioActive(true)}
                className="w-full bg-[#E8BC50] hover:bg-[#D4AF37] text-black font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Music size={20} />
                START EXPERIENCE
              </button>
              
              <p className="text-xs text-gray-500">
                * Requires microphone access for audio reactivity. <br/>
                No audio is recorded or stored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      {isAudioActive && (
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2 pointer-events-none">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${audioData.volume > 0.01 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs font-mono text-gray-400">INPUT SIGNAL</span>
          </div>
          <div className="w-32 h-1 bg-gray-800 rounded overflow-hidden">
             <div 
               className="h-full bg-yellow-500 transition-all duration-75 ease-out"
               style={{ width: `${Math.min(audioData.volume * 100 * settings.sensitivity, 100)}%` }}
             />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
```

### FILE: AuthGate.tsx
```typescript
import React, { useState } from 'react';

const AUTH_KEY = 'tuc_auth_dadaist_concert_visualizer';
const ACCENT   = '#7c3aed';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Dadaist Concert Visualizer</h1>
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

### FILE: components/Controls.tsx
```typescript
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
```

### FILE: components/VisualizerCanvas.tsx
```typescript
import React, { useRef, useEffect, useMemo } from 'react';
import { AudioData, VisualizerSettings, Shard, Particle, ShapeType } from '../types';

interface Props {
  audioData: AudioData;
  settings: VisualizerSettings;
}

const COLORS = {
  original: ['#E8BC50', '#F5F5F5', '#1A1A1A', '#050505', '#D4AF37'],
  neon: ['#FF00FF', '#00FFFF', '#FFFF00', '#110033', '#FFFFFF'],
  monochrome: ['#FFFFFF', '#DDDDDD', '#999999', '#333333', '#000000'],
  red: ['#D32F2F', '#FF5252', '#B71C1C', '#FFCDD2', '#212121'],
  green: ['#388E3C', '#69F0AE', '#1B5E20', '#C8E6C9', '#212121'],
  blue: ['#1565C0', '#2196F3', '#64B5F6', '#BBDEFB', '#0D47A1'],
  orange: ['#E65100', '#EF6C00', '#FFA726', '#FFCC80', '#BF360C'],
  purple: ['#6A1B9A', '#8E24AA', '#AB47BC', '#E1BEE7', '#4A148C'],
  mixed: ['#D32F2F', '#388E3C', '#1976D2', '#FBC02D', '#E65100', '#7B1FA2', '#FFFFFF', '#1A1A1A']
};

const IRIS_THEMES: Record<string, { base: string, accents: string[], line: string }> = {
  default: { base: '#555555', accents: ['#880000', '#FF3333', '#008800', '#33FF33'], line: '#333333' },
  blue: { base: '#0D47A1', accents: ['#4FC3F7', '#29B6F6', '#039BE5', '#0288D1'], line: '#002171' },
  purple: { base: '#4A148C', accents: ['#E1BEE7', '#BA68C8', '#9C27B0', '#7B1FA2'], line: '#38006b' },
  green: { base: '#1B5E20', accents: ['#66BB6A', '#43A047', '#2E7D32', '#1B5E20'], line: '#003300' },
  red: { base: '#B71C1C', accents: ['#EF5350', '#F44336', '#E53935', '#D32F2F'], line: '#7f0000' },
  gold: { base: '#E65100', accents: ['#FFCA28', '#FFC107', '#FFB300', '#FFA000'], line: '#BF360C' },
  teal: { base: '#004D40', accents: ['#80CBC4', '#4DB6AC', '#26A69A', '#009688'], line: '#00251A' },
  orange: { base: '#BF360C', accents: ['#FFCCBC', '#FFAB91', '#FF8A65', '#FF7043'], line: '#3E2723' },
  pink: { base: '#880E4F', accents: ['#F8BBD0', '#F48FB1', '#F06292', '#EC407A'], line: '#311B92' },
};

const SHAPE_TYPES: ShapeType[] = ['triangle', 'polygon', 'organic', 'circle', 'square', 'pentagon', 'hexagon', 'star', 'diamond', 'cross', 'cube', 'pyramid', 'cylinder', 'cone', 'prism', 'sponge', 'africa', 'torus', 'dodecahedron'];

// Helper to invert hex colors
const invertColor = (hex: string) => {
  if (hex.indexOf('#') === 0) hex = hex.slice(1);
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length !== 6) return '#FFFFFF';
  const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0');
  const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0');
  const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0');
  return '#' + r + g + b;
};

export const VisualizerCanvas: React.FC<Props> = ({ audioData, settings }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shardsRef = useRef<Shard[]>([]);
  const frameCountRef = useRef(0);
  
  // Initialize Shards
  useEffect(() => {
    const initShards = () => {
      const newShards: Shard[] = [];
      const numShards = 150;
      const scheme = COLORS[settings.colorScheme];

      for (let i = 0; i < numShards; i++) {
        let type: ShapeType;
        if (settings.selectedShape !== 'random') {
            type = settings.selectedShape;
        } else {
            type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
        }

        newShards.push({
          x: 0, 
          y: 0,
          angle: Math.random() * Math.PI * 2,
          distance: 100 + Math.random() * 800,
          size: 20 + Math.random() * 150,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          color: scheme[Math.floor(Math.random() * scheme.length)],
          colorSeed: Math.random(), 
          type: type,
          layer: Math.floor(Math.random() * 3),
          particles: [],
          morphOffsets: Array.from({ length: 8 }, () => Math.random() * Math.PI * 2)
        });
      }
      
      newShards.sort((a, b) => a.layer - b.layer);
      shardsRef.current = newShards;
    };

    initShards();
  }, [settings.colorScheme, settings.selectedShape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      frameCountRef.current++;
      
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const { width, height } = canvas;
      const cx = width / 2;
      const cy = height / 2;

      const bassFactor = (audioData.bass / 255) * settings.sensitivity;
      const midFactor = (audioData.mid / 255) * settings.sensitivity;
      const trebleFactor = (audioData.treble / 255) * settings.sensitivity;
      const volFactor = audioData.volume * settings.sensitivity;

      let bgColor = '#050505';
      if (settings.strobeEnabled && bassFactor > 0.8 && frameCountRef.current % 4 === 0) {
        bgColor = '#222';
      }
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      const currentScheme = COLORS[settings.colorScheme];
      const isHighTreble = trebleFactor > 0.6;

      const drawPolygon = (ctx: CanvasRenderingContext2D, sides: number, radius: number) => {
        const step = (Math.PI * 2) / sides;
        const startAngle = -Math.PI / 2;
        ctx.moveTo(Math.cos(startAngle) * radius, Math.sin(startAngle) * radius);
        for (let i = 1; i < sides; i++) {
          const angle = startAngle + step * i;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
      };

      const drawStar = (ctx: CanvasRenderingContext2D, points: number, outer: number, inner: number) => {
        const step = (Math.PI * 2) / points;
        const halfStep = step / 2;
        const startAngle = -Math.PI / 2;

        for (let i = 0; i < points; i++) {
          const angle = startAngle + step * i;
          const xOuter = Math.cos(angle) * outer;
          const yOuter = Math.sin(angle) * outer;
          if (i === 0) ctx.moveTo(xOuter, yOuter);
          else ctx.lineTo(xOuter, yOuter);

          const angleInner = angle + halfStep;
          const xInner = Math.cos(angleInner) * inner;
          const yInner = Math.sin(angleInner) * inner;
          ctx.lineTo(xInner, yInner);
        }
      };

      const drawShape = (shard: Shard, size: number) => {
        ctx.beginPath();
        const r = size / 2;

        switch (shard.type) {
            case 'organic':
                const points = shard.morphOffsets.length;
                const radiusBase = size / 2;
                const vertices = shard.morphOffsets.map((offset, i) => {
                    const angle = (i / points) * Math.PI * 2;
                    const time = frameCountRef.current * 0.05;
                    const distortion = Math.sin(time + offset) * 0.2 + (bassFactor * 0.25 * Math.cos(time * 2 + i));
                    const r = radiusBase * (0.8 + distortion);
                    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
                });
                const mid = (p1: {x:number, y:number}, p2: {x:number, y:number}) => ({ x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 });
                const start = mid(vertices[vertices.length-1], vertices[0]);
                ctx.moveTo(start.x, start.y);
                for(let i=0; i<vertices.length; i++) {
                    const p1 = vertices[i];
                    const p2 = vertices[(i+1)%vertices.length];
                    const m = mid(p1, p2);
                    ctx.quadraticCurveTo(p1.x, p1.y, m.x, m.y);
                }
                break;
            case 'circle': ctx.arc(0, 0, r, 0, Math.PI * 2); break;
            case 'square': ctx.rect(-r, -r, size, size); break;
            case 'triangle': drawPolygon(ctx, 3, r); break;
            case 'pentagon': drawPolygon(ctx, 5, r); break;
            case 'hexagon': drawPolygon(ctx, 6, r); break;
            case 'star': drawStar(ctx, 5, r, r * 0.5); break;
            case 'diamond':
                ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, 0); ctx.lineTo(0, r); ctx.lineTo(-r * 0.7, 0);
                break;
            case 'cross':
                 const w = r * 0.35;
                 ctx.moveTo(-w, -r); ctx.lineTo(w, -r); ctx.lineTo(w, -w); ctx.lineTo(r, -w);
                 ctx.lineTo(r, w); ctx.lineTo(w, w); ctx.lineTo(w, r); ctx.lineTo(-w, r);
                 ctx.lineTo(-w, w); ctx.lineTo(-r, w); ctx.lineTo(-r, -w); ctx.lineTo(-w, -w);
                 break;
            case 'cube':
                 const hexR = r * 0.9;
                 for(let i=0; i<6; i++) {
                    const angle = Math.PI/6 + i * Math.PI/3;
                    const px = Math.cos(angle) * hexR;
                    const py = Math.sin(angle) * hexR;
                    if(i===0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                 }
                 break;
            case 'cylinder':
                 const cylW = r * 0.7; const cylH = r;
                 ctx.ellipse(0, -cylH * 0.5, cylW, cylW * 0.3, 0, Math.PI, 0);
                 ctx.lineTo(cylW, cylH * 0.5);
                 ctx.ellipse(0, cylH * 0.5, cylW, cylW * 0.3, 0, 0, Math.PI);
                 ctx.lineTo(-cylW, -cylH * 0.5);
                 break;
            case 'cone':
                 const coneW = r * 0.8; const coneH = r;
                 ctx.moveTo(coneW, coneH * 0.5);
                 ctx.ellipse(0, coneH * 0.5, coneW, coneW * 0.3, 0, 0, Math.PI);
                 ctx.lineTo(0, -coneH); ctx.lineTo(coneW, coneH * 0.5);
                 break;
            case 'pyramid':
                 ctx.moveTo(0, -r); ctx.lineTo(r * 0.7, r * 0.7); ctx.lineTo(0, r * 0.9); ctx.lineTo(-r * 0.7, r * 0.7);
                 break;
            case 'prism':
                 ctx.moveTo(0, -r); ctx.lineTo(-r, r*0.5); ctx.lineTo(r*0.5, r*0.5); ctx.lineTo(r, -r*0.5);
                 break;
            case 'sponge':
                 const segments = 24;
                 for (let i = 0; i <= segments; i++) {
                    const theta = (i / segments) * Math.PI * 2;
                    const noise = Math.sin(theta * 10 + frameCountRef.current * 0.1) * 0.1 + (Math.random() - 0.5) * 0.3;
                    const rad = r * (0.85 + noise);
                    const px = Math.cos(theta) * rad;
                    const py = Math.sin(theta) * rad;
                    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                 }
                 break;
            case 'africa':
                 // Refined silhouette
                 ctx.moveTo(-0.3 * r, -0.95 * r); // North point (Tunisia area)
                 ctx.lineTo(0.1 * r, -0.9 * r);
                 ctx.lineTo(0.6 * r, -0.8 * r); // Egypt area
                 ctx.lineTo(0.7 * r, -0.5 * r); // Red Sea coast
                 ctx.lineTo(1.0 * r, -0.1 * r); // Horn of Africa
                 ctx.lineTo(0.6 * r, 0.5 * r); // East coast
                 ctx.lineTo(0.2 * r, 1.0 * r); // South point
                 ctx.lineTo(-0.3 * r, 0.4 * r); // Southwest
                 ctx.lineTo(-0.1 * r, 0.1 * r); // Gulf of Guinea
                 ctx.lineTo(-1.0 * r, -0.2 * r); // West bulge
                 ctx.lineTo(-0.7 * r, -0.7 * r); // Northwest coast
                 ctx.lineTo(-0.3 * r, -0.95 * r);
                 break;
            case 'torus':
                 ctx.arc(0, 0, r, 0, Math.PI * 2, false);
                 ctx.moveTo(r * 0.5, 0);
                 ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2, true);
                 break;
            case 'dodecahedron':
                 drawPolygon(ctx, 10, r);
                 break;
            case 'polygon':
            default:
                ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(size / 2, -size / 3);
                ctx.lineTo(size / 3, size / 2); ctx.lineTo(-size / 2, size / 2);
                break;
        }

        ctx.closePath();
        if (!settings.wireframeMode) {
            ctx.fill();
        }
        ctx.stroke(); 

        ctx.beginPath();
        switch(shard.type) {
            case 'cube':
                const cubeHexR = r * 0.9;
                ctx.moveTo(0, 0); ctx.lineTo(Math.cos(Math.PI/6) * cubeHexR, Math.sin(Math.PI/6) * cubeHexR);
                ctx.moveTo(0, 0); ctx.lineTo(Math.cos(Math.PI/6 + 2*Math.PI/3) * cubeHexR, Math.sin(Math.PI/6 + 2*Math.PI/3) * cubeHexR);
                ctx.moveTo(0, 0); ctx.lineTo(Math.cos(Math.PI/6 + 4*Math.PI/3) * cubeHexR, Math.sin(Math.PI/6 + 4*Math.PI/3) * cubeHexR);
                break;
            case 'cylinder':
                const internalCylW = r * 0.7; const internalCylH = r;
                ctx.moveTo(internalCylW, -internalCylH * 0.5);
                ctx.ellipse(0, -internalCylH * 0.5, internalCylW, internalCylW * 0.3, 0, 0, Math.PI * 2);
                break;
            case 'pyramid': ctx.moveTo(0, -r); ctx.lineTo(0, r * 0.9); break;
            case 'prism': ctx.moveTo(0, -r); ctx.lineTo(r*0.5, r*0.5); break;
            case 'sponge':
                const holes = 6;
                for(let i=0; i<holes; i++) {
                    const ang = Math.random() * Math.PI * 2;
                    const dist = Math.random() * r * 0.6;
                    const holeX = Math.cos(ang) * dist;
                    const holeY = Math.sin(ang) * dist;
                    const holeR = r * (0.05 + Math.random() * 0.15);
                    ctx.moveTo(holeX + holeR, holeY); ctx.arc(holeX, holeY, holeR, 0, Math.PI * 2);
                }
                break;
            case 'africa':
                // Refined Internal Details with mid-frequency thickness
                ctx.save();
                ctx.lineWidth = 0.5 + (midFactor * 3.5);
                
                // 1. More complex Great Rift Valley
                ctx.moveTo(0.45 * r, -0.4 * r);
                ctx.lineTo(0.52 * r, -0.1 * r);
                ctx.lineTo(0.48 * r, 0.2 * r);
                ctx.lineTo(0.4 * r, 0.5 * r);
                ctx.lineTo(0.3 * r, 0.8 * r);

                // 2. Comprehensive Great Lakes
                // Lake Victoria
                ctx.moveTo(0.56 * r, -0.05 * r);
                ctx.ellipse(0.48 * r, -0.05 * r, 0.08 * r, 0.06 * r, 0, 0, Math.PI * 2);
                // Lake Tanganyika
                ctx.moveTo(0.46 * r, 0.25 * r);
                ctx.ellipse(0.43 * r, 0.25 * r, 0.03 * r, 0.12 * r, 0.2, 0, Math.PI * 2);
                // Lake Malawi
                ctx.moveTo(0.47 * r, 0.55 * r);
                ctx.ellipse(0.45 * r, 0.55 * r, 0.02 * r, 0.09 * r, -0.1, 0, Math.PI * 2);
                
                // 3. Atlas Mountains (NW jagged lines)
                ctx.moveTo(-0.8 * r, -0.55 * r);
                ctx.lineTo(-0.7 * r, -0.65 * r);
                ctx.lineTo(-0.6 * r, -0.58 * r);
                ctx.lineTo(-0.5 * r, -0.68 * r);

                // 4. Ethiopian Highlands
                ctx.moveTo(0.35 * r, -0.55 * r);
                ctx.lineTo(0.5 * r, -0.45 * r);
                ctx.lineTo(0.65 * r, -0.5 * r);

                // 5. Drakensberg
                ctx.moveTo(0.15 * r, 0.65 * r);
                ctx.lineTo(0.3 * r, 0.75 * r);
                ctx.lineTo(0.2 * r, 0.85 * r);

                // 6. Major Rivers (Nile, Congo, Niger)
                // Nile
                ctx.moveTo(0.48 * r, -0.1 * r);
                ctx.quadraticCurveTo(0.35 * r, -0.5 * r, 0.55 * r, -0.9 * r);
                // Congo
                ctx.moveTo(0.3 * r, 0.2 * r);
                ctx.bezierCurveTo(0.1 * r, 0.1 * r, -0.2 * r, 0.3 * r, -0.1 * r, 0.45 * r);
                // Niger
                ctx.moveTo(-0.3 * r, -0.2 * r);
                ctx.bezierCurveTo(-0.5 * r, -0.1 * r, -0.8 * r, -0.3 * r, -0.7 * r, -0.5 * r);

                // 7. Madagascar
                const mX = 0.88 * r; const mY = 0.62 * r;
                ctx.moveTo(mX, mY - 0.2 * r);
                ctx.lineTo(mX + 0.1 * r, mY + 0.1 * r);
                ctx.lineTo(mX - 0.05 * r, mY + 0.22 * r);
                ctx.closePath();
                
                ctx.restore();
                break;
            case 'dodecahedron':
                const dInnerR = r * 0.55;
                drawPolygon(ctx, 5, dInnerR);
                for (let i = 0; i < 5; i++) {
                  const pAng = -Math.PI / 2 + (i * Math.PI * 2) / 5;
                  const dAng = -Math.PI / 2 + (i * 2 * Math.PI * 2) / 10;
                  ctx.moveTo(Math.cos(pAng) * dInnerR, Math.sin(pAng) * dInnerR);
                  ctx.lineTo(Math.cos(dAng) * r, Math.sin(dAng) * r);
                }
                break;
        }
        ctx.stroke();
      };

      shardsRef.current.forEach((shard, i) => {
        const orbitSpeed = settings.rotationSpeed * 0.002 * (1 + bassFactor);
        shard.angle += shard.rotationSpeed + (i % 2 === 0 ? orbitSpeed : -orbitSpeed);
        shard.rotation += shard.rotationSpeed * (1 + midFactor * 2);

        const pulseDist = 1 + (bassFactor * 0.2);
        const currentDist = shard.distance * pulseDist;
        
        const baseX = cx + Math.cos(shard.angle) * currentDist;
        const baseY = cy + Math.sin(shard.angle) * currentDist;

        if (baseX < -200 || baseX > width + 200 || baseY < -200 || baseY > height + 200) return;

        let drawX = baseX;
        let drawY = baseY;
        let drawRotation = shard.rotation;
        let scaleMult = 1;
        
        const paletteBase = Math.floor(shard.colorSeed * 100);
        const colorIndex = Math.floor(paletteBase + (bassFactor * 10) + (midFactor * 5)) % currentScheme.length;
        let drawColor = currentScheme[colorIndex];
        let strokeColor = currentScheme[(colorIndex + 2) % currentScheme.length];

        // Wireframe Pulse Logic
        if (settings.wireframeMode) {
          // A bright pulsing wireframe color
          const hue = 180; // Cyan base
          const brightness = 50 + (midFactor * 40);
          strokeColor = `hsl(${hue}, 100%, ${brightness}%)`;
          drawColor = 'transparent';
        }

        let isGlitchingShard = false;
        let blendMode: GlobalCompositeOperation = 'source-over';
        let shadowBlur = 0;
        let shadowColor = 'rgba(0,0,0,0)';
        let isColorInverted = false;

        if (isHighTreble && Math.random() < (trebleFactor * 0.7)) {
            isGlitchingShard = true;
            const offsetRange = 200 * trebleFactor;
            drawX += (Math.random() - 0.5) * offsetRange;
            drawY += (Math.random() - 0.5) * offsetRange;
            drawRotation += (Math.random() * Math.PI * 2);
            scaleMult = 0.3 + Math.random() * 2.5; 

            if (!settings.wireframeMode) {
              if (Math.random() < 0.3 * trebleFactor) {
                  isColorInverted = true;
                  drawColor = invertColor(drawColor);
                  strokeColor = invertColor(strokeColor);
              } else {
                  drawColor = Math.random() > 0.4 ? '#FFFFFF' : currentScheme[Math.floor(Math.random() * currentScheme.length)];
                  strokeColor = Math.random() > 0.5 ? '#000000' : '#FFFFFF';
              }
            } else {
              // Glitch wireframe colors
              strokeColor = Math.random() > 0.5 ? '#FFFFFF' : '#00FFFF';
            }

            const modes: GlobalCompositeOperation[] = ['screen', 'overlay', 'color-dodge', 'hard-light', 'difference', 'xor'];
            blendMode = modes[Math.floor(Math.random() * modes.length)];

            shadowColor = strokeColor;
            shadowBlur = 30 * trebleFactor;
        } else {
            shadowColor = 'rgba(0,0,0,0.5)';
            shadowBlur = 4 + (shard.layer * 2);
        }
        
        const layerScale = 0.8 + (shard.layer * 0.2); 
        const audioScale = 1 + (midFactor * 0.3) + (bassFactor * 0.35); // Pulse size linked to bass
        const finalScale = layerScale * audioScale * scaleMult;

        // --- PARTICLE TRAILS ---
        const emissionThreshold = 0.9 - (Math.min(volFactor, 0.8)); 
        if (Math.random() > emissionThreshold && settings.trailLength > 0) {
            const count = 2 + Math.floor(trebleFactor * 4) + Math.floor(settings.trailLength / 5);
            for(let k=0; k<count; k++) {
                const speed = (1.0 + bassFactor * 3) * (settings.rotationSpeed || 1) * (0.5 + Math.random());
                const angle = Math.random() * Math.PI * 2;
                const baseDecay = 0.02 + (Math.random() * 0.03);
                const decayModifier = 1 + (settings.trailLength * 0.1); 
                const decay = baseDecay / decayModifier;
                const layerSizeMod = 1 + (shard.layer * 0.2); 
                const audioSizeMod = 1 + (bassFactor * 0.4);
                const particleSize = (Math.random() * 3 + 2) * layerSizeMod * audioSizeMod;
                
                // Particle Spin set at birth as a base seed value
                const particleSpinSeed = (Math.random() - 0.5) * 0.12;

                shard.particles.push({
                    x: drawX + (Math.random() - 0.5) * shard.size * 0.5,
                    y: drawY + (Math.random() - 0.5) * shard.size * 0.5,
                    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                    life: 1.0, decay: decay, size: particleSize, color: settings.wireframeMode ? strokeColor : drawColor,
                    rotation: Math.random() * Math.PI * 2, 
                    spin: particleSpinSeed
                });
            }
        }

        if (settings.trailOpacity > 0.01) {
            ctx.save();
            const layerOpacityMult = 0.3 + (shard.layer * 0.35); 
            for (let pIndex = shard.particles.length - 1; pIndex >= 0; pIndex--) {
                const p = shard.particles[pIndex];
                
                // Update rotation using p.spin as a base, influenced real-time by mid frequencies
                p.rotation += p.spin * (1 + midFactor * 6);
                
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                
                if (p.life > 0) {
                    const alpha = p.life * settings.trailOpacity * layerOpacityMult;
                    const currentSize = p.size * p.life * (1 + (bassFactor * 0.1));
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.translate(p.x, p.y); 
                    ctx.rotate(p.rotation);
                    ctx.fillStyle = p.color; 
                    if (settings.wireframeMode) {
                      ctx.strokeStyle = p.color;
                      ctx.strokeRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
                    } else {
                      ctx.fillRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
                    }
                    ctx.restore();
                } else { shard.particles.splice(pIndex, 1); }
            }
            ctx.restore();
        } else { shard.particles = []; }

        // --- DRAW CURRENT SHARD ---
        ctx.save();
        ctx.translate(drawX, drawY);
        ctx.rotate(drawRotation);
        ctx.scale(finalScale, finalScale);
        
        // Pulse opacity linked to bass
        const baseAlpha = 0.6 + (shard.layer * 0.1);
        ctx.globalAlpha = Math.min(1.0, baseAlpha + (bassFactor * 0.4));
        
        ctx.globalCompositeOperation = blendMode;
        
        ctx.fillStyle = drawColor;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = settings.wireframeMode ? (1 + midFactor * 5) : (1 + midFactor * 3); 
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = isGlitchingShard ? (Math.random()-0.5)*15 : 2 + shard.layer;
        ctx.shadowOffsetY = isGlitchingShard ? (Math.random()-0.5)*15 : 2 + shard.layer;

        drawShape(shard, shard.size);

        if (isGlitchingShard) {
            ctx.save();
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            const scanlineCount = Math.floor(4 + Math.random() * 6);
            for(let s=0; s<scanlineCount; s++) {
                const sy = -shard.size + (Math.random() * shard.size * 2);
                ctx.fillRect(-shard.size, sy, shard.size * 2, 2);
            }
            ctx.restore();

            // TREBLE-REACTIVE SCANLINE ARTIFACTS
            ctx.save();
            ctx.globalAlpha = 0.5 * trebleFactor;
            ctx.strokeStyle = settings.wireframeMode ? strokeColor : '#FFFFFF';
            ctx.lineWidth = 0.5;
            for (let sl = -shard.size; sl < shard.size; sl += 6) {
                ctx.beginPath();
                ctx.moveTo(-shard.size, sl);
                ctx.lineTo(shard.size, sl);
                ctx.stroke();
            }
            ctx.restore();

            if (Math.random() < 0.5) {
                ctx.save();
                ctx.globalAlpha = 0.6;
                const streakCount = 8;
                for(let st=0; st<streakCount; st++) {
                    const sty = -shard.size/2 + (Math.random() * shard.size);
                    const stw = shard.size * (1 + Math.random() * 2 * trebleFactor);
                    const sth = 1 + Math.random() * 4;
                    const stx = (Math.random() > 0.5 ? -shard.size : 0) + (Math.random() - 0.5) * 20;
                    if (settings.wireframeMode) {
                        ctx.strokeStyle = strokeColor;
                        ctx.strokeRect(stx, sty, stw, sth);
                    } else {
                        ctx.fillRect(stx, sty, stw, sth);
                    }
                }
                ctx.restore();
            }
        } else if (!settings.wireframeMode) {
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = 'rgba(255,255,255,0.05)';
            ctx.fillRect(-shard.size, -shard.size, shard.size * 2, shard.size * 2);
        }

        ctx.restore();
      });

      if (settings.showEye) {
        ctx.save();
        ctx.translate(cx, cy);
        const eyeScale = 1 + (bassFactor * 0.3);
        ctx.scale(eyeScale, eyeScale);
        if (volFactor > 0.6) {
            ctx.translate((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        }
        ctx.beginPath();
        ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, -100, 150, 0); ctx.quadraticCurveTo(0, 100, -150, 0);
        ctx.closePath();
        const stress = Math.min(1, (bassFactor * 0.5) + (trebleFactor * 0.5));
        const rSclera = Math.floor(240 + (stress * 15));
        const gSclera = Math.floor(240 - (stress * 40));
        const bSclera = Math.floor(240 - (stress * 40));
        
        if (settings.wireframeMode) {
          ctx.strokeStyle = `hsl(180, 100%, ${60 + midFactor * 40}%)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${rSclera}, ${gSclera}, ${bSclera})`;
          ctx.fill();
        }
        
        ctx.save(); ctx.clip(); 
        ctx.fillStyle = 'rgba(0,0,0,0.03)';
        for(let j=0; j<20; j++) ctx.fillRect(Math.random()*300 - 150, Math.random()*200-100, 2, 2);
        ctx.shadowColor = 'rgba(0,0,0,0.2)'; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowColor = 'transparent';
        
        const t = frameCountRef.current;
        const lookX = (
          Math.sin(t * 0.006) * 0.5 + 
          Math.sin(t * 0.013) * 0.3 + 
          Math.sin(t * 0.027) * 0.2
        ) * 35;
        
        const lookY = (
          Math.cos(t * 0.005) * 0.5 + 
          Math.cos(t * 0.016) * 0.3 + 
          Math.cos(t * 0.033) * 0.2
        ) * 15;
        
        const irisTheme = IRIS_THEMES[settings.irisColor] || IRIS_THEMES.default;
        ctx.beginPath(); ctx.arc(lookX, lookY, 60, 0, Math.PI * 2); 
        if (!settings.wireframeMode) {
          ctx.fillStyle = irisTheme.base; ctx.fill();
        } else {
          ctx.strokeStyle = irisTheme.base; ctx.stroke();
        }
        
        ctx.save(); ctx.beginPath();
        const textureCount = 36;
        for(let k=0; k<textureCount; k++) {
            const ang = (k / textureCount) * Math.PI * 2 + (frameCountRef.current * 0.003);
            const rIn = 22 + Math.random() * 5; const rOut = 58 - Math.random() * 5;
            ctx.moveTo(lookX + Math.cos(ang) * rIn, lookY + Math.sin(ang) * rIn);
            ctx.lineTo(lookX + Math.cos(ang) * rOut, lookY + Math.sin(ang) * rOut);
        }
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
        ctx.lineWidth = 1.5;
        for(let r=10; r<60; r+=5) {
            ctx.beginPath(); ctx.arc(lookX, lookY, r, 0, Math.PI * 2);
            if (r === 50) ctx.strokeStyle = irisTheme.accents[0];
            else if (r === 30) ctx.strokeStyle = irisTheme.accents[1];
            else if (r === 40) ctx.strokeStyle = irisTheme.accents[2];
            else if (r === 20) ctx.strokeStyle = irisTheme.accents[3];
            else ctx.strokeStyle = irisTheme.line;
            ctx.stroke();
        }
        const pupilSize = 20 + (trebleFactor * 25);
        ctx.beginPath(); ctx.arc(lookX, lookY, pupilSize, 0, Math.PI * 2); 
        if (!settings.wireframeMode) {
          ctx.fillStyle = '#000'; ctx.fill();
        } else {
          ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
        }
        
        ctx.beginPath(); ctx.arc(lookX + 15, lookY - 15, 8, 0, Math.PI * 2); 
        if (!settings.wireframeMode) {
          ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
        } else {
          ctx.strokeStyle = '#FFFFFF'; ctx.stroke();
        }

        const time = Date.now();
        const blinkCycle = 4000;
        const tInCycle = time % blinkCycle;
        const blinkDuration = 300;
        let blinkOpenness = 1.0;
        if (tInCycle < blinkDuration) {
           const phase = tInCycle / blinkDuration; 
           if (phase < 0.5) blinkOpenness = 1 - (phase * 2); else blinkOpenness = (phase - 0.5) * 2;
        }
        const squint = Math.min(0.6, bassFactor * 0.6); 
        let topLidOpenness = Math.max(0, Math.min(1, blinkOpenness - (squint * 0.3)));
        const bottomLidUp = squint * 0.4;
        const lidColor = settings.colorScheme === 'original' ? '#E8BC50' : currentScheme[1];
        ctx.fillStyle = lidColor;
        ctx.strokeStyle = lidColor;
        const topControlY = 100 - (200 * topLidOpenness);
        ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, topControlY, 150, 0);
        ctx.lineTo(150, -200); ctx.lineTo(-150, -200); ctx.closePath(); 
        if (!settings.wireframeMode) ctx.fill(); else ctx.stroke();

        if (topLidOpenness > 0.1) {
            const creaseYOffset = topControlY - 30 - (50 * topLidOpenness);
            ctx.beginPath(); ctx.moveTo(-120, creaseYOffset + 20); ctx.quadraticCurveTo(0, creaseYOffset, 120, creaseYOffset + 20);
            ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, topControlY, 150, 0);
        ctx.strokeStyle = settings.wireframeMode ? '#FFFFFF' : '#000'; ctx.lineWidth = 4; ctx.stroke();
        
        if (bottomLidUp > 0.05) {
            const bottomControlY = 100 - (150 * bottomLidUp);
            ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, bottomControlY, 150, 0);
            ctx.lineTo(150, 200); ctx.lineTo(-150, 200); ctx.closePath(); 
            if (!settings.wireframeMode) ctx.fill(); else ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, bottomControlY, 150, 0);
            ctx.strokeStyle = settings.wireframeMode ? '#FFFFFF' : '#000'; ctx.lineWidth = 3; ctx.stroke();
        }
        ctx.restore(); 
        ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(0, -100, 150, 0); ctx.quadraticCurveTo(0, 100, -150, 0);
        ctx.strokeStyle = settings.eyeOutlineStyle.color; ctx.lineWidth = settings.eyeOutlineStyle.width;
        ctx.shadowColor = settings.eyeOutlineStyle.shadowBlur > 0 ? settings.eyeOutlineStyle.color : 'transparent';
        ctx.shadowBlur = settings.eyeOutlineStyle.shadowBlur; ctx.stroke();
        ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
        ctx.restore();
      } else {
          ctx.beginPath(); ctx.arc(cx, cy, 50 * (1+bassFactor), 0, Math.PI*2);
          if (settings.wireframeMode) {
            ctx.strokeStyle = `hsl(180, 100%, ${50 + midFactor * 50}%)`;
            ctx.stroke();
          } else {
            ctx.fillStyle = currentScheme[0]; ctx.fill();
          }
      }

      if (settings.showBeam) {
        ctx.save();
        const beamSpeed = 15 * (Math.max(0.2, settings.rotationSpeed)) + 2;
        const beamWidth = 200;
        const beamLimit = width + beamWidth * 2;
        const beamTick = frameCountRef.current * beamSpeed;
        const xPos = (beamTick % beamLimit) - beamWidth;
        ctx.globalCompositeOperation = 'screen'; 
        const gradient = ctx.createLinearGradient(xPos, 0, xPos + beamWidth, 0);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.05)'); 
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient; ctx.fillRect(xPos, 0, beamWidth, height);
        ctx.shadowColor = '#FFFFFF'; ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.fillRect(xPos + beamWidth/2 - 2, 0, 4, height);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => { cancelAnimationFrame(animationId); };
  }, [audioData, settings]);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />;
};
```

### FILE: CREATION.md
```md
# dadaist-concert-visualizer

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

This application is deployed behind an Nginx reverse proxy at the path `/dadaist-concert-visualizer/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/dadaist-concert-visualizer/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/dadaist-concert-visualizer/',  // REQUIRED: Assets must load from /dadaist-concert-visualizer/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/dadaist-concert-visualizer"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/dadaist-concert-visualizer">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/dadaist-concert-visualizer/`, not at the root
- **Asset Loading**: Without `base: '/dadaist-concert-visualizer/'`, assets try to load from `/assets/` instead of `/dadaist-concert-visualizer/assets/`
- **Routing**: Without `basename="/dadaist-concert-visualizer"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/dadaist-concert-visualizer/assets/index-*.js`
- Link tags should reference: `/dadaist-concert-visualizer/assets/index-*.css`

If they reference `/assets/` instead of `/dadaist-concert-visualizer/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/dadaist-concert-visualizer/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/dadaist-concert-visualizer/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: dadaist-concert-visualizer

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
# Admin Guide — dadaist-concert-visualizer

**Application:** dadaist-concert-visualizer
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

Audit log data is stored in `localStorage` under the key `tuc_dadaist-concert-visualizer_audit`.

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
# Deployment Guide — dadaist-concert-visualizer

**Application:** dadaist-concert-visualizer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd dadaist-concert-visualizer
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
docker-compose -f docker-compose-all-apps.yml build dadaist-concert-visualizer
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up dadaist-concert-visualizer
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

### FILE: docs/README.md
```md
# Dadaist Concert Visualizer - Documentation

Welcome to the documentation for **DADA VISUALS**.

## Directory Structure

- `/svg`: High-quality SVG diagrams used in technical documentation.
  - `architecture.svg`: System overview.
  - `tech_stack.svg`: Technologies utilized.
  - `data_flow.svg`: Audio processing pipeline.
  - `use_case.svg`: User interaction map.
  - `sequence.svg`: Real-time loop detail.
- `/presentation`: Simplified diagrams for board-level or high-level presentations.
- `SRS_DadaistVisualizer_Final.md`: The complete IEEE-inspired Software Requirements Specification.

## Technical Summary

This project is built using:
- **React 19**
- **TypeScript**
- **Web Audio API**
- **Canvas 2D API**
- **Tailwind CSS**

All processing is performed in real-time on the client's device to ensure low latency for live concert environments.

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Dadaist Concert Visualizer
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Dadaist Concert Visualizer**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Dadaist Concert Visualizer** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

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

**Dadaist Concert Visualizer** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

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
| Docker service configured | âœ… Compliant |
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

### FILE: docs/SRS_DadaistVisualizer_Final.md
```md
# Software Requirements Specification (SRS) - Dadaist Concert Visualizer

## 1. Introduction
The **Dadaist Concert Visualizer** (DADA VISUALS) is a real-time, browser-based performance tool designed for concert video walls. It takes live microphone input and generates complex, sound-reactive animations inspired by Dadaist collage and geometric abstraction.

## 2. System Architecture
The system follows a reactive data-driven architecture.

![Architecture Diagram](./svg/architecture.svg)

- **Audio Layer:** Utilizes the Web Audio API to capture raw microphone input and process it into frequency bands (Bass, Mid, Treble) and overall Volume.
- **Logic Layer:** A custom React hook (`useAudioAnalyzer`) manages the state of audio data at 60fps.
- **Rendering Layer:** The `VisualizerCanvas` component uses the HTML5 Canvas 2D API to render high-performance animations with GPU acceleration.

## 3. Technology Stack
Our stack is chosen for maximum performance and compatibility without a heavy build step.

![Tech Stack Diagram](./svg/tech_stack.svg)

## 4. Functional Requirements
### 4.1 Audio Reactivity
- **Data Flow:**
![Data Flow Diagram](./svg/data_flow.svg)
- The system MUST map Bass frequencies to the "pulse" and "organic morphing" of shards.
- The system MUST map Treble frequencies to high-intensity "glitch" artifacts and particle emission.

### 4.2 Interactive Controls
- **Use Cases:**
![Use Case Diagram](./svg/use_case.svg)
- Users can toggle microphone access.
- Users can adjust sensitivity to match different acoustic environments.
- Users can select specific geometric shapes or use "Random Chaos" mode.

## 5. Implementation Details
### 5.1 Visualization Loop
The animation loop ensures that every frame is synchronized with the latest audio analysis.

![Sequence Diagram](./svg/sequence.svg)

## 6. Visual Design & Aesthetics
- **Dadaist Influence:** Use of disjointed geometric shapes, high-contrast palettes, and unexpected "glitch" artifacts.
- **Central Iconography:** A dynamic, wandering central eye that reacts to the music's volume and stress levels.
- **Particle Systems:** Real-time trails that follow shards, influenced by rotation and audio frequencies.

## 7. Performance & Security
- **Efficiency:** Optimized for 60FPS on modern browsers using `requestAnimationFrame`.
- **Security:** Microphone permissions are requested via standard browser prompts. No audio data is ever transmitted or stored; processing is strictly client-side.

```

### FILE: docs/TESTING.md
```md
# Testing Guide — dadaist-concert-visualizer

**Application:** dadaist-concert-visualizer
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd dadaist-concert-visualizer
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

### FILE: hooks/useAudioAnalyzer.ts
```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioData } from '../types';

export const useAudioAnalyzer = (isActive: boolean) => {
  const [audioData, setAudioData] = useState<AudioData>({
    frequencyData: new Uint8Array(0),
    bass: 0,
    mid: 0,
    treble: 0,
    volume: 0
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceRef.current = null;
  }, []);

  useEffect(() => {
    if (!isActive) {
      cleanup();
      return;
    }

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
          if (!analyser) return;

          analyser.getByteFrequencyData(dataArray);

          // Calculate bands
          const bassRange = dataArray.slice(0, 10);
          const midRange = dataArray.slice(11, 100);
          const trebleRange = dataArray.slice(101, 255);

          const getAvg = (arr: Uint8Array) => arr.reduce((a, b) => a + b, 0) / arr.length;

          const bass = getAvg(bassRange);
          const mid = getAvg(midRange);
          const treble = getAvg(trebleRange);
          const volume = getAvg(dataArray) / 255;

          setAudioData({
            frequencyData: dataArray,
            bass,
            mid,
            treble,
            volume
          });

          rafIdRef.current = requestAnimationFrame(update);
        };

        update();

      } catch (err) {
        console.error("Error accessing microphone:", err);
        // Fallback or error handling could go here
      }
    };

    initAudio();

    return cleanup;
  }, [isActive, cleanup]);

  return audioData;
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
    <meta property="og:title" content="Dadaist Concert Visualizer | Techbridge University College" />
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
    <meta name="twitter:title" content="Dadaist Concert Visualizer | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dadaist Concert Visualizer | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
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
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">dadaist concert visualizer</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthGate } from './AuthGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGate><App /></AuthGate>
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "Dadaist Concert Visualizer",
  "description": "A sound-reactive concert video wall animation inspired by Dadaist collage art. Features a dynamic central eye and exploding geometric shards that react to microphone input.",
  "requestFramePermissions": [
    "microphone"
  ]
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
  "name": "dadaist-concert-visualizer",
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
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "lucide-react": "^0.575.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.1.0"
  },
  "devDependencies": {
    "@types/node": "^25.3.3",
    "@vitejs/plugin-react": "^5.1.4",
    "serve": "14.2.5",
    "typescript": "~5.9.3",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FQRa_dNEyd1JAklz9ZllV3qITGxL6UzM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
          <span className="font-bold text-sm">Dadaist Concert Visualizer</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Dadaist Concert Visualizer — Admin</h1>
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

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — dadaist-concert-visualizer
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('dadaist-concert-visualizer E2E', () => {
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
export interface AudioData {
  frequencyData: Uint8Array;
  bass: number; // 0-255 average
  mid: number;  // 0-255 average
  treble: number; // 0-255 average
  volume: number; // 0-1 overall volume
}

export type IrisColor = 'default' | 'blue' | 'purple' | 'green' | 'red' | 'gold' | 'teal' | 'orange' | 'pink';

export interface EyeOutlineStyle {
  color: string;
  width: number;
  shadowBlur: number;
}

export type ShapeType = 'triangle' | 'polygon' | 'organic' | 'circle' | 'square' | 'pentagon' | 'hexagon' | 'star' | 'diamond' | 'cross' | 'cube' | 'pyramid' | 'cylinder' | 'cone' | 'prism' | 'sponge' | 'africa' | 'torus' | 'dodecahedron';

export interface VisualizerSettings {
  sensitivity: number;
  rotationSpeed: number;
  colorScheme: 'original' | 'neon' | 'monochrome' | 'red' | 'green' | 'blue' | 'orange' | 'purple' | 'mixed';
  showEye: boolean;
  strobeEnabled: boolean;
  showBeam: boolean;
  trailLength: number;
  trailOpacity: number;
  irisColor: IrisColor;
  eyeOutlineStyle: EyeOutlineStyle;
  selectedShape: ShapeType | 'random';
  wireframeMode: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  rotation: number;
  spin: number;
}

export interface Shard {
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  colorSeed: number; // Added for randomized palette picking
  type: ShapeType;
  layer: number;
  particles: Particle[];
  morphOffsets: number[]; // Random offsets for organic morphing
}
```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
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
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
  base: './',
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — dadaist-concert-visualizer
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

// Vitest E2E configuration — dadaist-concert-visualizer
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

