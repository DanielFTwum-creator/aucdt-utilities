import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion } from 'motion/react';
import { playBass, playOpen, playShaker, playFrog, getAudioAnalyser, playSlap, playTone, playMuted, playTactileClick, playTactileRelease, setMasterVolume, getMasterVolume } from '../lib/audio';
import { Volume2, VolumeX, Keyboard, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
  type?: 'bass' | 'open' | 'shaker' | 'frog' | 'slap' | 'tone' | 'muted';
}

interface SlapRipple {
  id: number;
  x: number;
  y: number;
}

interface VirtualDrumsProps {
  compact?: boolean;
  highlightZone?: 'bass' | 'open' | 'shaker' | 'frog' | 'slap' | 'tone' | 'muted' | null;
  onPlayedSound?: (type: 'bass' | 'open' | 'shaker' | 'frog' | 'slap' | 'tone' | 'muted') => void;
}

export function VirtualDrums({ compact = false, highlightZone = null, onPlayedSound }: VirtualDrumsProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [slapRipples, setSlapRipples] = useState<SlapRipple[]>([]);
  const [activeZone, setActiveZone] = useState<'bass' | 'open' | 'shaker' | 'frog' | 'slap' | 'tone' | 'muted' | null>(null);
  const [isBassPadActive, setIsBassPadActive] = useState<boolean>(false);
  const [padRipples, setPadRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(() => getMasterVolume());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setMasterVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handlePressDown = () => {
    if (!isMuted) {
      playTactileClick();
    }
  };

  const handlePressRelease = () => {
    if (!isMuted) {
      playTactileRelease();
    }
  };

  const triggerBassPadRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = {
      id: Date.now() + Math.random(),
      x,
      y
    };
    setPadRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setPadRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 550);
  };

  const drumRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Real-time Audio Visualizer animation loop
  useEffect(() => {
    let animationFrameId: number;
    
    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const analyser = getAudioAnalyser();
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas structure
      ctx.clearRect(0, 0, width, height);
      
      if (!analyser) {
        // Render simple passive wave when audio context isn't live yet
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.05 + Date.now() * 0.003) * 2;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);
      
      const timeDataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(timeDataArray);
      
      // Draw background flash on powerful peaks
      let totalFreq = 0;
      for (let i = 0; i < bufferLength; i++) {
        totalFreq += dataArray[i];
      }
      const avgFreq = totalFreq / bufferLength;
      
      if (avgFreq > 4) {
        const opacity = Math.min(avgFreq / 150, 0.2);
        ctx.fillStyle = `rgba(245, 158, 11, ${opacity})`;
        ctx.fillRect(0, 0, width, height);
      }
      
      // Draw spectrum bars (frequency visualization)
      const barWidth = (width / bufferLength) * 1.6;
      let barX = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * height * 0.85;
        if (barHeight > 0.5) {
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(120, 53, 15, 0.1)');
          gradient.addColorStop(0.4, 'rgba(217, 119, 6, 0.45)');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0.7)');
          ctx.fillStyle = gradient;
          ctx.fillRect(barX, height - barHeight, barWidth - 1, barHeight);
        }
        barX += barWidth;
      }
      
      // Draw waveform (time-domain visualization)
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = avgFreq > 6 ? '#78350F' : 'rgba(120, 53, 15, 0.35)';
      
      const sliceWidth = width / bufferLength;
      let waveX = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = timeDataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) {
          ctx.moveTo(waveX, y);
        } else {
          ctx.lineTo(waveX, y);
        }
        waveX += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const triggerDrumRipple = (type: 'bass' | 'open', customX?: number, customY?: number) => {
    if (drumRef.current) {
      const rect = drumRef.current.getBoundingClientRect();
      let x = customX;
      let y = customY;

      if (x === undefined || y === undefined) {
        if (type === 'bass') {
          // Centered ripple for bass beats
          x = rect.width / 2;
          y = rect.height / 2;
        } else {
          // Top rim centered ripple for open tone beats
          x = rect.width / 2;
          y = rect.height * 0.15;
        }
      }

      const color = type === 'bass' ? 'text-amber-500' : 'text-rose-500';
      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
        color,
        type
      };

      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    }
  };

  // Trigger sound and create ripple
  const handleDrumTrigger = (type: 'bass' | 'open', e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    
    if (!isMuted) {
      if (type === 'bass') {
        playBass();
      } else {
        playOpen();
      }
    }

    if (onPlayedSound) {
      onPlayedSound(type);
    }

    // Spawn ripple at coordinates relative to the drum container
    if (drumRef.current) {
      const rect = drumRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      triggerDrumRipple(type, x, y);
      setActiveZone(type);
      setTimeout(() => setActiveZone(null), type === 'bass' ? 250 : 150);
    }
  };

  const handleShakerTrigger = () => {
    if (!isMuted) {
      playShaker();
    }
    setActiveZone('shaker');
    if (onPlayedSound) onPlayedSound('shaker');
    
    // Spawn ripple relative to the button
    setTimeout(() => setActiveZone(null), 150);
  };

  const handleFrogTrigger = () => {
    if (!isMuted) {
      playFrog();
    }
    setActiveZone('frog');
    if (onPlayedSound) onPlayedSound('frog');
    setTimeout(() => setActiveZone(null), 300);
  };

  const triggerSlapRipple = (x?: number, y?: number) => {
    const newRipple = {
      id: Date.now() + Math.random(),
      x: x ?? 45,
      y: y ?? 22
    };
    setSlapRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setSlapRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 550);
  };

  const handleAdvancedTrigger = (type: 'slap' | 'tone' | 'muted') => {
    if (!isMuted) {
      if (type === 'slap') {
        playSlap();
      } else if (type === 'tone') {
        playTone();
      } else if (type === 'muted') {
        playMuted();
      }
    }

    if (onPlayedSound) {
      onPlayedSound(type);
    }

    if (drumRef.current) {
      const rect = drumRef.current.getBoundingClientRect();
      const x = rect.width / 2 + (Math.random() * 40 - 20);
      const y = rect.height / 2 + (Math.random() * 40 - 20);
      let color = 'text-rose-500';
      if (type === 'tone') color = 'text-amber-500';
      if (type === 'muted') color = 'text-slate-500';

      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
        color,
        type
      };

      setRipples((prev) => [...prev, newRipple]);
      setActiveZone(type);
      const activeDuration = type === 'slap' ? 350 : 150;
      setTimeout(() => setActiveZone(null), activeDuration);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 550);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // Ignore if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (key === ' ' || key === 'b') {
        e.preventDefault();
        if (!isMuted) {
          playBass();
        }
        if (onPlayedSound) onPlayedSound('bass');
        setActiveZone('bass');
        triggerDrumRipple('bass');
        setIsBassPadActive(true);
        const keyId = Date.now() + Math.random();
        setPadRipples((prev) => [...prev, { id: keyId, x: 64, y: 64 }]);
        setTimeout(() => setIsBassPadActive(false), 250);
        setTimeout(() => {
          setPadRipples((prev) => prev.filter((r) => r.id !== keyId));
        }, 550);
        setTimeout(() => setActiveZone(null), 250);
      } else if (key === 'o' || key === 'j') {
        e.preventDefault();
        if (!isMuted) {
          playOpen();
        }
        if (onPlayedSound) onPlayedSound('open');
        setActiveZone('open');
        triggerDrumRipple('open');
        setTimeout(() => setActiveZone(null), 150);
      } else if (key === 'a') {
        e.preventDefault();
        if (!isMuted) {
          playSlap();
        }
        if (onPlayedSound) onPlayedSound('slap');
        setActiveZone('slap');
        triggerSlapRipple(45, 22);
        setTimeout(() => setActiveZone(null), 350);
      } else if (key === 'd') {
        e.preventDefault();
        if (!isMuted) {
          playTone();
        }
        if (onPlayedSound) onPlayedSound('tone');
        setActiveZone('tone');
        setTimeout(() => setActiveZone(null), 150);
      } else if (key === 'm') {
        e.preventDefault();
        if (!isMuted) {
          playMuted();
        }
        if (onPlayedSound) onPlayedSound('muted');
        setActiveZone('muted');
        setTimeout(() => setActiveZone(null), 150);
      } else if (key === 's') {
        e.preventDefault();
        if (!isMuted) {
          playShaker();
        }
        if (onPlayedSound) onPlayedSound('shaker');
        setActiveZone('shaker');
        setTimeout(() => setActiveZone(null), 150);
      } else if (key === 'f') {
        e.preventDefault();
        if (!isMuted) {
          playFrog();
        }
        if (onPlayedSound) onPlayedSound('frog');
        setActiveZone('frog');
        setTimeout(() => setActiveZone(null), 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPlayedSound, isMuted]);

  return (
    <div id="virtual-instrument-deck" className="flex flex-col bg-amber-50/40 rounded-2xl p-4 sm:p-5 border border-amber-900/10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="font-heading text-lg font-semibold text-brand-earth flex items-center gap-2">
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5 text-slate-400" />
            ) : (
              <Volume2 className="h-5 w-5 text-brand-gold animate-bounce" />
            )}
            Interactive Instrument Sandbox
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="virt-mute-toggle-btn"
              onClick={() => setIsMuted(!isMuted)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all font-bold cursor-pointer border ${
                isMuted
                  ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
              }`}
              title={isMuted ? 'Unmute layout' : 'Mute layout'}
            >
              {isMuted ? '🔇 Muted' : '🔊 Playing'}
            </button>

            {/* Master Volume Slider Control */}
            <div className="flex items-center gap-2 bg-amber-100/40 px-3 py-1 rounded-full border border-amber-900/10">
              <span className="text-[10px] font-mono font-bold text-amber-900/60 uppercase">Vol:</span>
              <input
                type="range"
                id="master-volume-slider"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-24 h-1 bg-amber-300 rounded-lg appearance-none cursor-pointer accent-amber-700 outline-none focus:ring-1 focus:ring-amber-500/30"
                aria-label="Master Volume Slider"
              />
              <span className="text-[10px] font-mono font-bold text-amber-900/80 min-w-[28px] text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Expandable State Toggle Button */}
            <button
              type="button"
              id="instrument-deck-expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all font-bold cursor-pointer border ${
                isExpanded
                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Keyboard className="h-3.5 w-3.5" />
              <span>{isExpanded ? 'Hide Advanced' : 'Show Advanced'}</span>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        {!compact && isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-amber-800/80 bg-amber-50 p-2 px-3 rounded-lg border border-amber-900/5 max-w-xl"
          >
            <span className="flex items-center gap-1 font-bold"><Keyboard className="h-3.5 w-3.5" /> Shortcuts:</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-amber-900 font-bold shadow-xs">Space</kbd> Bass</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-amber-900 font-bold shadow-xs">O</kbd> Open</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-amber-900 font-bold shadow-xs">A</kbd> Slap</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-amber-900 font-bold shadow-xs">D</kbd> Tone</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-[#10B981] font-bold shadow-xs">M</kbd> Muted</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-amber-900 font-bold shadow-xs">S</kbd> Shaker</span>
            <span><kbd className="bg-white px-1 border border-amber-200 rounded text-amber-900 font-bold shadow-xs">F</kbd> Frog</span>
          </motion.div>
        )}
      </div>

      <div className={compact ? "grid grid-cols-1 md:grid-cols-3 gap-4" : "grid grid-cols-1 lg:grid-cols-12 gap-5"}>
        {/* The Djembe Drum Column */}
        <div className={compact ? "md:col-span-2" : "lg:col-span-8 flex flex-col items-center justify-center bg-white rounded-xl p-4 border border-amber-900/5 shadow-xs"}>
          
          {/* Waveform and Spectrum Monitor */}
          <div className="w-full max-w-xs sm:max-w-md bg-amber-50/20 backdrop-blur-xs rounded-xl p-2 px-3 border border-amber-900/5 mb-4 shadow-2xs select-none">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold tracking-wider text-amber-900/70 flex items-center gap-1.5 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                </span>
                Rhythm Waveform Monitor
              </span>
              <span className="text-[9px] font-mono text-amber-900/40 uppercase tracking-widest hidden sm:inline">Real-time Audio Feedback</span>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={55}
              className="w-full h-12 bg-white/70 rounded-lg border border-amber-900/10 shadow-inner"
              id="rhythm-visualizer-canvas"
            />
          </div>

          <p className="text-xs font-medium text-amber-900/60 mb-2 font-mono text-center">
            TAP center for deep <span className="text-amber-600 font-bold">BASS</span> • Rim for bright <span className="text-rose-600 font-semibold">OPEN TONE</span>
          </p>
          
          <motion.div 
            ref={drumRef}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 450, damping: 14 }}
            className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-orange-950/90 shadow-2xl flex items-center justify-center cursor-pointer overflow-hidden group select-none ${
              activeZone === 'bass' ? 'animate-bass-boom' : ''
            }`}
            style={{
              border: '14px solid #78350F',
              boxShadow: 'inset 0 10px 25px rgba(0,0,0,0.6), 0 12px 24px -10px rgba(120,53,15,0.4)'
            }}
          >
            {/* The Outer Rim (Open Tone zone) */}
            <motion.button 
              type="button"
              onClick={(e) => handleDrumTrigger('open', e)}
              onMouseDown={handlePressDown}
              onMouseUp={handlePressRelease}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              className={`absolute inset-0 rounded-full flex items-center justify-center cursor-pointer outline-none focus:outline-none appearance-none border-0 ${
                highlightZone === 'open' 
                  ? 'bg-rose-500/20 border-4 border-rose-500 shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                  : 'hover:bg-rose-500/15 hover:shadow-[inset_0_0_20px_rgba(244,63,94,0.3)]'
              }`}
              style={{ padding: '24px' }}
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold font-mono tracking-widest text-[#B45309] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                OPEN TONE [O / Ring]
              </div>
            </motion.button>

            {/* The Inner circle (Bass zone) */}
            <motion.button 
              type="button"
              onClick={(e) => handleDrumTrigger('bass', e)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              className={`w-3/5 h-3/5 rounded-full bg-[#E2C391] border-4 border-[#8B5A2B] z-10 flex flex-col items-center justify-center shadow-inner select-none cursor-pointer outline-none focus:outline-none appearance-none ${
                activeZone === 'bass' ? 'bg-[#D4B07D] animate-pulse-bass' : 'hover:scale-102 hover:bg-[#E9CDA3]'
              } ${
                highlightZone === 'bass' 
                  ? 'border-amber-500 animate-pulse-bass ring-8 ring-amber-500/20' 
                  : ''
              }`}
              style={{
                backgroundImage: 'radial-gradient(circle, #EBD5B3 40%, #D4B07D 100%)'
              }}
            >
              <div className="h-6 w-6 rounded-full border border-amber-950/20 flex items-center justify-center mb-1">
                <span className="text-[10px] text-amber-950/40 font-bold">★</span>
              </div>
              <div className="text-xs font-bold text-amber-950 font-mono uppercase tracking-wider select-none text-center leading-tight">
                BASS NOTE
                <span className="block text-[8px] opacity-60 font-normal">[SPACE / Center]</span>
              </div>
            </motion.button>

            {/* Ropes decoration representing authentic Djembe body cords */}
            <div className="absolute inset-0 border-8 border-dashed border-[#F59E0B]/20 pointer-events-none rounded-full"></div>

            {/* Dynamic Sound Ripples */}
            {ripples.map((ripple) => {
              const isBass = ripple.type === 'bass';
              const isOpen = ripple.type === 'open';

              if (isBass || isOpen) {
                const duration = isBass ? '0.6s' : '0.45s';
                const size = isBass ? 44 : 28;
                const borderClass = isBass 
                  ? 'border-[3px] border-amber-500 bg-amber-500/15 shadow-[0_0_18px_rgba(245,158,11,0.7)]' 
                  : 'border-[1.5px] border-rose-500 bg-rose-500/5 shadow-[0_0_12px_rgba(244,63,94,0.5)]';

                return (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      top: ripple.y,
                      left: ripple.x,
                      width: `${size}px`,
                      height: `${size}px`,
                      marginLeft: `-${size / 2}px`,
                      marginTop: `-${size / 2}px`,
                      animation: `soundwave ${duration} cubic-bezier(0.1, 0.8, 0.3, 1) forwards`,
                    }}
                  >
                    <span className={`absolute inset-0 rounded-full ${borderClass}`} />
                    {isBass && (
                      <span 
                        className="absolute inset-[5px] rounded-full border border-orange-400/80 opacity-75"
                        style={{
                          animation: `soundwave 0.6s cubic-bezier(0.15, 0.85, 0.35, 1) forwards`,
                          animationDelay: '0.07s'
                        }}
                      />
                    )}
                  </span>
                );
              }

              // Fallback for slap, tone, or muted ripples
              return (
                <span
                  key={ripple.id}
                  className={`soundwave-ring ${ripple.color}`}
                  style={{
                    top: ripple.y,
                    left: ripple.x,
                    width: '30px',
                    height: '30px',
                    marginLeft: '-15px',
                    marginTop: '-15px'
                  }}
                />
              );
            })}
          </motion.div>
          
          <div className="flex gap-4 mt-3">
            <span className="text-[10px] font-mono text-amber-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E2C391] border border-amber-700"></span> Flat palm hits center
            </span>
            <span className="text-[10px] font-mono text-amber-800 flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-950 border border-amber-900"></span> Fingers strike edge rim
            </span>
          </div>

          <div className="mt-3.5 text-[10px] sm:text-[11px] font-mono text-amber-800/60 text-center max-w-xs sm:max-w-md bg-amber-50/20 py-1.5 px-3.5 rounded-lg border border-amber-900/5 leading-relaxed select-none">
            Note: This instrument uses real-time synthesized audio. For best results, ensure your device's volume is up and headphones are connected.
          </div>

          {/* Advanced Expression Strokes */}
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0,
              marginTop: isExpanded ? 16 : 0,
              paddingTop: isExpanded ? 16 : 0,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="w-full border-t border-amber-900/10 overflow-hidden"
          >
            <h4 className="text-[11px] font-heading font-bold text-amber-900/80 tracking-wider uppercase mb-2 text-center sm:text-left">
              Advanced Djembe Strokes
            </h4>
            <div className="grid grid-cols-3 gap-2 w-full">
              {/* Slap button */}
              <motion.button
                type="button"
                onClick={(e) => {
                  handleAdvancedTrigger('slap');
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  triggerSlapRipple(x, y);
                }}
                onMouseDown={handlePressDown}
                onMouseUp={handlePressRelease}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                className={`py-1.5 px-2.5 rounded-xl border select-none cursor-pointer flex flex-col items-center justify-center text-center gap-0.5 group relative overflow-hidden ${
                  activeZone === 'slap'
                    ? 'animate-slap-burst text-red-950 font-extrabold ring-4 ring-orange-500/20 shadow-xs'
                    : 'bg-[#FAF8F3]/60 border-amber-950/10 hover:bg-amber-50 hover:border-amber-900/20 shadow-2xs'
                }`}
              >
                <span className="text-xs font-bold font-mono text-rose-800 flex items-center gap-1 z-10">
                  💥 Slap
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-700/60 bg-amber-100/40 group-hover:bg-amber-100/80 rounded px-1.5 py-0.2 transition-colors z-10">
                  [A]
                </span>
                {slapRipples.map((ripple) => (
                  <div
                    key={ripple.id}
                    className="absolute pointer-events-none"
                    style={{
                      top: ripple.y,
                      left: ripple.x,
                    }}
                  >
                    {/* Primary sharp red-orange ripple */}
                    <span
                      className="slap-ripple-ring animate-slap-ripple border-red-500 bg-orange-500/20"
                      style={{
                        width: '32px',
                        height: '32px',
                      }}
                    />
                    {/* Secondary offset outer shockwave ripple */}
                    <span
                      className="slap-ripple-ring animate-slap-ripple border-orange-500 bg-transparent"
                      style={{
                        width: '32px',
                        height: '32px',
                        animationDelay: '0.04s',
                        animationDuration: '0.28s',
                      }}
                    />
                  </div>
                ))}
              </motion.button>

              {/* Tone button */}
              <motion.button
                type="button"
                onClick={() => handleAdvancedTrigger('tone')}
                onMouseDown={handlePressDown}
                onMouseUp={handlePressRelease}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                className={`py-1.5 px-2.5 rounded-xl border select-none cursor-pointer flex flex-col items-center justify-center text-center gap-0.5 group ${
                  activeZone === 'tone'
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-xs'
                    : 'bg-[#FAF8F3]/60 border-amber-950/10 hover:bg-amber-50 hover:border-amber-900/20 shadow-2xs'
                }`}
              >
                <span className="text-xs font-bold font-mono text-amber-800 flex items-center gap-1">
                  🎵 Tone
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-700/60 bg-amber-100/40 group-hover:bg-amber-100/80 rounded px-1.5 py-0.2 transition-colors">
                  [D]
                </span>
              </motion.button>

              {/* Muted button */}
              <motion.button
                type="button"
                onClick={() => handleAdvancedTrigger('muted')}
                onMouseDown={handlePressDown}
                onMouseUp={handlePressRelease}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                className={`py-1.5 px-2.5 rounded-xl border select-none cursor-pointer flex flex-col items-center justify-center text-center gap-0.5 group ${
                  activeZone === 'muted'
                    ? 'bg-slate-50 border-slate-400 ring-2 ring-slate-200 shadow-xs'
                    : 'bg-[#FAF8F3]/60 border-amber-950/10 hover:bg-amber-50 hover:border-amber-900/20 shadow-2xs'
                }`}
              >
                <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1">
                  🔇 Muted
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-700/60 bg-amber-100/40 group-hover:bg-amber-100/80 rounded px-1.5 py-0.2 transition-colors">
                  [M]
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Side Instruments (Rattlesnake & Wooden Frog) */}
        <div className={compact ? "md:col-span-1 flex flex-col justify-between gap-3 bg-white rounded-xl p-4 border border-amber-900/5 shadow-xs" : "lg:col-span-4 flex flex-col justify-between gap-3 bg-white rounded-xl p-4 border border-amber-900/5 shadow-xs"}>
          
          {/* Dedicated Surdo Bass Drum Pad */}
          <div className="w-full flex flex-col items-center bg-radial from-amber-50/50 to-orange-50/10 p-4 rounded-xl border border-amber-900/10 shadow-3xs relative overflow-hidden group">
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-900/60 uppercase mb-3 text-center">
              Surdo Bass Pad
            </span>
            
            <motion.button
              type="button"
              id="virtual-bass-pad-btn"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 450, damping: 14 }}
              onClick={(e) => {
                e.preventDefault();
                if (!isMuted) {
                  playBass();
                }
                if (onPlayedSound) onPlayedSound('bass');
                
                setIsBassPadActive(true);
                setTimeout(() => setIsBassPadActive(false), 250);
                triggerBassPadRipple(e);
              }}
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-amber-800 shadow-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none ${
                isBassPadActive 
                  ? 'animate-bass-boom ring-8 ring-amber-500/30 border-amber-500' 
                  : 'hover:border-amber-600 hover:shadow-xl'
              } ${highlightZone === 'bass' ? 'ring-8 ring-amber-500/40 animate-pulse-bass border-amber-500' : ''}`}
              style={{
                backgroundImage: 'radial-gradient(circle, #78350F 30%, #451A03 100%)',
                boxShadow: isBassPadActive
                  ? '0 0 25px rgba(245, 158, 11, 0.65), inset 0 5px 15px rgba(0,0,0,0.8)'
                  : '0 8px 18px -4px rgba(69,26,3,0.45), inset 0 2px 5px rgba(255,255,255,0.08)'
              }}
            >
              {/* Inner accent details */}
              <div className="absolute inset-2 rounded-full border border-[#9A3412]/30 pointer-events-none"></div>
              <div className="text-3xl select-none mb-1 group-hover:scale-110 transition-transform duration-200">🐘</div>
              <div className="text-[10px] font-mono font-black text-amber-100 uppercase tracking-widest leading-none">
                BASS DRUM
              </div>
              <div className="text-[8px] font-mono font-bold text-amber-400/80 mt-1 bg-amber-950/60 px-1.5 py-0.5 rounded shadow-3xs">
                SPACE / CLICK
              </div>

              {/* Pad Specific Ripple Animations */}
              {padRipples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="soundwave-ring text-amber-500 absolute"
                  style={{
                    top: ripple.y,
                    left: ripple.x,
                    width: '32px',
                    height: '32px',
                    marginLeft: '-16px',
                    marginTop: '-16px'
                  }}
                />
              ))}
            </motion.button>
            <p className="text-[10px] text-amber-900/60 font-mono text-center mt-3 leading-tight">
              A dedicated heavy surdo pad to drive the savanna parade sync.
            </p>
          </div>

          {/* Rattlesnake Shaker Card */}
          <motion.button 
            type="button"
            id="virt-shaker-btn"
            onClick={handleShakerTrigger}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`w-full text-left relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50/50 p-3 sm:p-4 rounded-xl border cursor-pointer select-none group flex gap-3 items-center ${
              activeZone === 'shaker' 
                ? 'border-brand-gold ring-2 ring-brand-gold/10 shadow-md bg-amber-100/50' 
                : 'border-amber-955/10 hover:border-brand-gold/40 hover:shadow-xs'
            } ${highlightZone === 'shaker' ? 'border-brand-gold ring-4 ring-brand-gold/20 bg-amber-200/30' : ''}`}
          >
            <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
              activeZone === 'shaker' ? 'bg-brand-gold text-white scale-110 rotate-12' : 'bg-brand-cream border border-brand-gold/20 text-[#D97706] group-hover:scale-105'
            }`}>
              <span className="text-xl">🐍</span>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold font-mono text-amber-900">RATTLESNAKE</span>
                <span className="text-[9px] font-mono font-bold text-[#D97706] bg-amber-100 rounded-sm px-1.5 py-0.5 group-hover:animate-pulse">
                  [S] SHAKE
                </span>
              </div>
              <p className="text-[11px] text-amber-900/70 leading-relaxed mt-0.5">
                Rattle. Sshh-sshh leitmotif!
              </p>
            </div>
            
            {/* Visual shaker vibration waves on trigger */}
            {activeZone === 'shaker' && (
              <span className="absolute inset-0 border border-dashed border-brand-gold/30 rounded-xl animate-ping opacity-60"></span>
            )}
          </motion.button>

          {/* Wooden Guiro Frog Scraper Card */}
          <motion.button
            type="button"
            id="virt-frog-btn"
            onClick={handleFrogTrigger}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`w-full text-left relative overflow-hidden bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]/30 p-3 sm:p-4 rounded-xl border cursor-pointer select-none group flex gap-3 items-center ${
              activeZone === 'frog' 
                ? 'border-brand-green ring-2 ring-brand-green/10 shadow-md bg-[#DCFCE7]' 
                : 'border-emerald-955/10 hover:border-brand-green/40 hover:shadow-xs'
            } ${highlightZone === 'frog' ? 'border-brand-green ring-4 ring-brand-green/20 bg-emerald-200/30' : ''}`}
          >
            <div className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
              activeZone === 'frog' ? 'bg-brand-green text-white scale-110 -translate-y-1' : 'bg-emerald-50 border border-brand-green/20 text-[#16A34A] group-hover:scale-105'
            }`}>
              <span className="text-xl">🐸</span>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold font-mono text-emerald-950">GUIRO FROG</span>
                <span className="text-[9px] font-mono font-bold text-brand-green bg-[#DCFCE7] rounded-sm px-1.5 py-0.5">
                  [F] SCRAPE
                </span>
              </div>
              <p className="text-[11px] text-emerald-950/70 leading-relaxed mt-0.5">
                Ribbit wood scraper sound!
              </p>
            </div>
            
            {activeZone === 'frog' && (
              <span className="absolute inset-0 border border-dashed border-brand-green/30 rounded-xl animate-ping opacity-60"></span>
            )}
          </motion.button>

          {/* Quick tips label on why objects matter */}
          <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-900/5 text-[10px] text-amber-950/70 flex gap-2">
            <span className="text-brand-gold font-bold">TIP:</span>
            <span>Use these instruments to play along with the story as it unfolds in real time!</span>
          </div>

        </div>
      </div>
    </div>
  );
}
