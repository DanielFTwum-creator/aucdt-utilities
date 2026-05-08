import React, { useState, useEffect, useRef } from 'react';
import { ClaudiaScene } from './components/ClaudiaScene';

export default function App() {
  const [frame, setFrame] = useState(0);
  const [playheadPos, setPlayheadPos] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [showCamera, setShowCamera] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const [tracks, setTracks] = useState([
    { name: 'Camera_Main', bg: 'bg-indigo-500/10', segments: [{ left: 10, width: 60, keys: [{pos: 2, enabled: true}, {pos: 25, enabled: true}, {pos: 55, enabled: true}] }] },
    { name: 'Subj_Alpha', bg: 'bg-purple-500/10', segments: [{ left: 20, width: 30, keys: [{pos: 5, enabled: true}] }] },
    { name: 'VFX_Bloom', bg: 'bg-amber-500/10', segments: [{ left: 38, width: 50, keys: [{pos: 2, enabled: true}, {pos: 42, enabled: true}] }] },
    { name: 'Light_Key', bg: 'bg-emerald-500/10', segments: [{ left: 5, width: 90, keys: [{pos: 15, enabled: true}, {pos: 30, enabled: true}, {pos: 45, enabled: true}, {pos: 80, enabled: true}] }] },
  ]);

  const toggleKeyframe = (trackIndex: number, segmentIndex: number, keyIndex: number) => {
    setTracks(currentTracks => {
      const newTracks = [...currentTracks];
      const newTrack = { ...newTracks[trackIndex] };
      const newSegments = [...newTrack.segments];
      const newSegment = { ...newSegments[segmentIndex] };
      const newKeys = [...newSegment.keys];
      
      newKeys[keyIndex] = {
        ...newKeys[keyIndex],
        enabled: !newKeys[keyIndex].enabled
      };
      
      newSegment.keys = newKeys;
      newSegments[segmentIndex] = newSegment;
      newTrack.segments = newSegments;
      newTracks[trackIndex] = newTrack;
      
      return newTracks;
    });
  };
  
  const stopPlayback = () => {
    setIsPlaying(false);
    setPlayheadPos(0);
    setFrame(0);
  };
  
  useEffect(() => {
    if (!isScrubbing && isPlaying) {
      const interval = setInterval(() => {
        setFrame(f => f + 1);
        setPlayheadPos(p => (p + 0.1) % 100);
      }, 1000 / 24);
      return () => clearInterval(interval);
    }
  }, [isScrubbing, isPlaying]);

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    setIsScrubbing(true);
    updatePlayhead(e);
  };

  const updatePlayhead = (e: MouseEvent | React.MouseEvent) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      let newPos = ((e.clientX - rect.left) / rect.width) * 100;
      newPos = Math.max(0, Math.min(100, newPos));
      setPlayheadPos(newPos);
      setFrame(Math.floor(newPos * 6)); // roughly 600 frames total
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) {
        updatePlayhead(e);
      }
    };
    const handleMouseUp = () => {
      setIsScrubbing(false);
    };

    if (isScrubbing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing]);

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera", err);
      alert("Could not access camera.");
      setShowCamera(false);
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setProfilePhoto(dataUrl);
        closeCamera();
      }
    }
  };

  return (
    <div className="w-full min-h-screen h-screen bg-[var(--c-bg-base)] text-[var(--c-text-secondary)] flex flex-col font-sans overflow-hidden">
      <header className="h-14 border-b border-[var(--c-border-default)] px-6 flex items-center justify-between bg-[var(--c-bg-base)] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="text-white font-semibold tracking-tight">
            ANIMATOR <span className="text-indigo-400 font-normal">AGENT v1.4</span>
          </span>
        </div>
        <div className="flex gap-8 text-xs font-medium uppercase tracking-widest h-full items-center">
          <span className="text-indigo-400 border-b border-indigo-400 h-full flex items-center pt-1 mt-0">Workspace</span>
          <span className="hover:text-white cursor-pointer h-full flex items-center pt-1 mt-0">Assets</span>
          <span className="hover:text-white cursor-pointer h-full flex items-center pt-1 mt-0">Render Queue</span>
          <span className="hover:text-white cursor-pointer h-full flex items-center pt-1 mt-0">Settings</span>
        </div>
        
        <div className="flex items-center gap-2 border border-[#27272a] rounded overflow-hidden bg-[#18181b] p-0.5">
          <button 
            onClick={() => setIsPlaying(true)} 
            className={`w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs ${isPlaying ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
            title="Play"
          >
            ▶
          </button>
          <button 
            onClick={() => setIsPlaying(false)} 
            className={`w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs ${!isPlaying && frame > 0 ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}`}
            title="Pause"
          >
            ⏸
          </button>
          <button 
            onClick={stopPlayback} 
            className="w-8 h-7 flex items-center justify-center rounded-sm transition-colors text-xs text-zinc-500 hover:text-white hover:bg-zinc-800"
            title="Stop"
          >
            ⏹
          </button>
        </div>

        <div className="flex gap-3">
          <div className="h-8 px-4 bg-[#18181b] border border-[#27272a] rounded flex items-center text-xs text-white cursor-pointer" onClick={openCamera}>
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-6 h-6 rounded-full object-cover mr-2" />
            ) : (
              <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center mr-2">
                <span className="text-[10px]">👤</span>
              </div>
            )}
            Profile
          </div>
          <div className="h-8 px-4 bg-[#18181b] border border-[#27272a] rounded flex items-center text-xs text-white">
            Project: Cyberpunk_Intro_01
          </div>
          <div className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 cursor-pointer transition-colors rounded flex items-center text-xs text-white font-bold">
            EXPORT
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 grid-rows-none lg:grid-rows-6 gap-4 overflow-hidden min-h-0">
        {/* Preview Container */}
        <div className="lg:col-span-8 lg:row-span-4 bg-[var(--c-bg-panel)] border border-[var(--c-border-default)] rounded-xl relative flex items-center justify-center overflow-hidden min-h-[300px]">
          <div className="absolute top-4 left-4 flex gap-2 z-50">
            <div className="bg-[var(--c-bg-raised)]/80 backdrop-blur px-3 py-1 rounded-md text-[10px] text-[var(--c-text-secondary)] border border-[var(--c-border-default)]">
              4K Preview
            </div>
            <div className="bg-[var(--c-status-ok)]/8 text-[var(--c-status-ok)] px-3 py-1 rounded-md text-[10px] border border-[var(--c-status-ok)]/15">
              Active Loop
            </div>
          </div>
          
          {/* Here we embed the Claudia Scene */}
          <div className="absolute inset-2 border border-[var(--c-border-default)]/30 rounded-lg overflow-hidden isolate">
            <ClaudiaScene />
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-[60%] border-x-2 border-transparent flex flex-col items-center justify-center relative pointer-events-none z-40">
            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--c-accent-soft)] mix-blend-screen opacity-30"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--c-accent-soft)] mix-blend-screen opacity-30"></div>
          </div>

          <div className="absolute bottom-4 left-4 z-50">
            <div className="text-[var(--c-text-muted)] font-mono text-[10px] bg-black/50 px-2.5 py-1 rounded-md backdrop-blur">Frame {frame}</div>
          </div>

          <div className="absolute bottom-4 right-4 flex gap-3 text-[10px] font-mono text-[var(--c-text-muted)] bg-black/50 px-3 py-1 rounded-md backdrop-blur border border-[var(--c-border-default)]/40 z-50">
            <span>24 fps</span>
            <span className="text-[var(--c-border-hover)]">·</span>
            <span>12:04</span>
            <span className="text-[var(--c-border-hover)]">·</span>
            <span>3840 × 2160</span>
          </div>
        </div>

        {/* Agent Logic & Instructions */}
        <div className="lg:col-span-4 lg:row-span-4 bg-[#111113] border border-[#27272a] rounded-xl flex flex-col p-5 overflow-hidden">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 shrink-0">
            Agent Logic & Instructions
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-[#18181b] p-3 rounded border border-[#27272a]">
              <div className="text-[10px] text-indigo-400 mb-1 font-mono">USER PROMPT</div>
              <p className="text-sm text-zinc-300">"Enhance the lighting on the central character and add a slow parallax drift to the background elements over 120 frames."</p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span>Analyzing scene depth markers...</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                <span>Calculating spline interpolations...</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-white">Applying volumetric god-rays to L04...</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 opacity-50">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                <span>Optimizing vertex cache...</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 opacity-50">
                <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                <span>Syncing audio tracks...</span>
              </div>
            </div>
          </div>
          <div className="mt-4 shrink-0">
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-[#09090b] border border-[#27272a] rounded px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
                placeholder="Enter new animation instruction..." 
              />
              <div className="absolute right-2 top-0 bottom-0 flex items-center">
                <div className="text-[10px] bg-zinc-800 px-1.5 py-1 rounded text-zinc-400 font-mono tracking-wider">CMD+K</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-12 lg:row-span-2 bg-[#111113] border border-[#27272a] rounded-xl flex flex-col p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-3 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                <button onClick={stopPlayback} className="w-6 h-6 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors rounded text-xs" title="Stop">⏹</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className={`w-6 h-6 flex items-center justify-center transition-colors text-white rounded text-xs ${isPlaying ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.3)]'}`} title={isPlaying ? "Pause" : "Play"}>{isPlaying ? '⏸' : '▶'}</button>
              </div>
              <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">00:04:12 / 00:10:00</div>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1.5 bg-zinc-800 hover:text-white cursor-pointer transition-colors rounded text-[10px] font-bold text-zinc-400 tracking-wider">CURVE EDITOR</div>
              <div className="px-3 py-1.5 bg-indigo-600 rounded text-[10px] font-bold text-white tracking-wider">KEYFRAMES</div>
            </div>
          </div>
          
          <div 
            className="flex-1 border-t border-[#27272a] pt-3 relative flex flex-col gap-2 overflow-y-auto overflow-x-hidden min-h-0 custom-scrollbar cursor-ew-resize"
            ref={timelineRef}
            onMouseDown={handleTimelineMouseDown}
          >
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-[1px] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] z-10 pointer-events-none"
              style={{ left: `${playheadPos}%` }}
            >
              <div className="w-2.5 h-2.5 bg-indigo-400 rounded-sm -ml-[4.5px] -mt-0 animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
            </div>

            {/* Tracks */}
            {tracks.map((track, i) => (
              <div key={i} className="flex items-center text-[10px] gap-3 group px-1">
                <span className="w-24 text-zinc-500 group-hover:text-zinc-300 font-mono transition-colors">{track.name}</span>
                <div className="flex-1 h-5 bg-[#09090b] border border-[#27272a] rounded relative overflow-hidden group-hover:border-[#3f3f46] transition-colors">
                  {track.segments.map((seg, j) => (
                    <div key={j} style={{ left: `${seg.left}%`, width: `${seg.width}%` }} className={`absolute h-full bg-zinc-800 border-x border-zinc-600`}>
                      <div className={`absolute inset-0 ${track.bg}`}></div>
                      {seg.keys.map((k, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleKeyframe(i, j, idx)}
                          style={{ left: `${k.pos}%` }} 
                          className={`absolute top-[4px] w-1.5 h-3 cursor-pointer rounded-sm hover:scale-125 transition-all ${k.enabled ? 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]' : 'bg-transparent border border-zinc-500'}`}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Timeline ticks */}
            <div className="mt-auto flex items-end justify-between px-28 font-mono text-[9px] text-zinc-600 pb-1">
              <span>0f</span><span>100f</span><span>200f</span><span>300f</span><span>400f</span><span>500f</span><span>600f</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-10 bg-[var(--c-bg-base)] border-t border-[var(--c-border-default)] px-6 flex items-center justify-between text-[10px] shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-[var(--c-status-ok)] flex items-center gap-1.5 text-[11px] font-medium tracking-tight">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-status-ok)]"></span>
            Stable
          </span>
          <span className="text-[var(--c-text-muted)] font-mono text-[10px] bg-[var(--c-bg-panel)] px-2 py-0.5 rounded border border-[var(--c-border-default)]">GPU 42%</span>
          <span className="text-[var(--c-text-muted)] font-mono text-[10px] bg-[var(--c-bg-panel)] px-2 py-0.5 rounded border border-[var(--c-border-default)]">VRAM 6.2 / 16 GB</span>
        </div>
        <div className="flex items-center gap-5 text-[var(--c-text-muted)] text-[10px] font-mono">
          <span>Studio_Intro_01</span>
          <span className="text-[var(--c-border-hover)]">•</span>
          <span>Saved 2m ago</span>
        </div>
      </footer>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-[#111113] border border-[#27272a] rounded-xl p-6 w-[400px] flex flex-col gap-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-semibold tracking-tight">Update Profile Photo</h2>
              <button className="text-zinc-500 hover:text-white transition-colors" onClick={closeCamera}>✕</button>
            </div>
            
            <div className="relative w-full aspect-square bg-[#09090b] rounded-lg overflow-hidden border border-[#27272a]">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              ></video>
              <div className="absolute inset-0 border-2 border-indigo-500/30 border-dashed rounded-lg pointer-events-none m-4"></div>
            </div>

            <button 
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold transition-colors"
              onClick={takePhoto}
            >
              TAKE PHOTO
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}

    </div>
  );
}
