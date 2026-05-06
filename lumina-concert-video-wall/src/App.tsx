import React, { useState } from 'react';
import VideoWall from './components/VideoWall';
import Controls from './components/Controls';

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

export default function App() {
  const [config, setConfig] = useState<VisualConfig>({
    gridSize: 20,
    decay: 0.96,
    colorPrimary: '#00ff88', // Neon Green
    colorSecondary: '#000000', // Black
    sensitivity: 1.5,
    mode: 'ripple',
    activeShape: 'africa',
    silhouetteSize: 1.0,
    activeVideo: VIDEOS.collection,
    useVideoBackground: false,
  });

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      <VideoWall config={config} />
      <Controls config={config} onChange={setConfig} />
      
      {/* Overlay for initial guidance or branding if needed, currently kept minimal for "Video Wall" feel */}
      <div className="absolute bottom-4 left-4 text-white/30 text-xs font-mono pointer-events-none select-none">
        LUMINA // INTERACTIVE DISPLAY SYSTEM v1.0
      </div>
    </div>
  );
}
