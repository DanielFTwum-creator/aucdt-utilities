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