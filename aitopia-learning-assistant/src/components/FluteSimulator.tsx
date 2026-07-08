import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Square, 
  Droplet, 
  Zap, 
  Volume2, 
  Info, 
  ChevronRight, 
  Sparkles, 
  RotateCcw, 
  Award, 
  HelpCircle, 
  CheckCircle, 
  Compass, 
  Activity 
} from "lucide-react";

interface NoteConfig {
  name: string;
  solfege: string;
  frequency: number;
  fingering: boolean[]; // [Back, F1, F2, F3, F4, F5, F6] where true = covered, false = open
}

const ATENTEBEN_NOTES: NoteConfig[] = [
  { name: "C4", solfege: "Doh (Root)", frequency: 261.63, fingering: [true, true, true, true, true, true, false] },
  { name: "D4", solfege: "Ray", frequency: 293.66, fingering: [true, true, true, true, true, false, false] },
  { name: "E4", solfege: "Me", frequency: 329.63, fingering: [true, true, true, true, false, false, false] },
  { name: "F4", solfege: "Fah", frequency: 349.23, fingering: [true, true, true, false, false, false, false] },
  { name: "G4", solfege: "Soh", frequency: 392.00, fingering: [true, true, false, false, false, false, false] },
  { name: "A4", solfege: "La", frequency: 440.00, fingering: [true, false, false, false, false, false, false] },
  { name: "B4", solfege: "Te", frequency: 493.88, fingering: [false, false, false, false, false, false, false] },
  { name: "C5", solfege: "Doh (High)", frequency: 523.25, fingering: [false, true, true, true, true, true, false] }
];

interface FluteSimulatorProps {
  fluteAction: { type: string; timestamp: number; extraData?: any } | null;
}

export default function FluteSimulator({ fluteAction }: FluteSimulatorProps) {
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [isMoisturized, setIsMoisturized] = useState<boolean>(false);
  const [isSoaking, setIsSoaking] = useState<boolean>(false);
  const [soakProgress, setSoakProgress] = useState<number>(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState<boolean>(false);
  const [sequenceIndex, setSequenceIndex] = useState<number>(-1);
  const [practiceSpeed, setPracticeSpeed] = useState<number>(300); // ms per note

  // Real-time scale interaction states
  const [customFingering, setCustomFingering] = useState<boolean[]>([true, true, true, true, true, true, false]);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [showAssistOverlay, setShowAssistOverlay] = useState<boolean>(true);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState<boolean>(true);
  
  // Trainer Game/Challenge states
  const [trainerMode, setTrainerMode] = useState<"idle" | "practice" | "completed">("idle");
  const [trainerTargetIdx, setTrainerTargetIdx] = useState<number>(0);
  const [trainerSuccessMessage, setTrainerSuccessMessage] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscRef = useRef<OscillatorNode | null>(null);
  const activeGainRef = useRef<GainNode | null>(null);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!fluteAction) return;
    const { type, extraData } = fluteAction;
    if (type === "moisturize") {
      handleSoakInWater();
    } else if (type === "scale") {
      playScaleSequence(true); // play scale
    } else if (type === "dirge") {
      playTraditionalDirge();
    } else if (type === "note") {
      const idx = typeof extraData === "number" ? extraData : 0;
      selectAndPlayNote(idx);
    }
  }, [fluteAction]);

  // Expand HUD overlay when notes are being played or sequences run
  useEffect(() => {
    if (activeNote !== null || isPlayingSequence || trainerMode === "practice") {
      setIsOverlayExpanded(true);
    }
  }, [activeNote, isPlayingSequence, trainerMode]);

  // Stop sound if playing
  const stopSound = () => {
    if (activeOscRef.current) {
      try {
        activeOscRef.current.stop();
        activeOscRef.current.disconnect();
      } catch (e) {}
      activeOscRef.current = null;
    }
    if (activeGainRef.current) {
      activeGainRef.current.disconnect();
      activeGainRef.current = null;
    }
    if (!isCustomMode) {
      setActiveNote(null);
    }
  };

  // Play a specific note frequency
  const playFrequency = (freq: number) => {
    stopSound();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // Bamboo flutes have a sound signature close to a triangle wave with soft upper harmonics
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Add vibrato (frequency modulation) to mimic natural blowing breathing
    const vibratoOsc = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibratoOsc.frequency.value = 5.5; // 5.5Hz vibrato
    vibratoGain.gain.value = freq * 0.007; // subtle depth

    vibratoOsc.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibratoOsc.start();

    // Moisturize configuration
    if (isMoisturized) {
      filterNode.type = "lowpass";
      filterNode.frequency.setValueAtTime(freq * 2.2, ctx.currentTime); // Soften the top harmonics
      filterNode.Q.setValueAtTime(1.5, ctx.currentTime);
    } else {
      filterNode.type = "peaking";
      filterNode.frequency.setValueAtTime(freq * 3, ctx.currentTime);
      filterNode.gain.setValueAtTime(1, ctx.currentTime);
    }

    // Set Envelope: custom attack, decay, sustain, release (ADSR) for blow modeling
    const attack = 0.08;
    const decay = 0.15;
    const sustain = 0.7;
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.4 * sustain, ctx.currentTime + attack + decay);

    // Routing
    osc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();

    activeOscRef.current = osc;
    activeGainRef.current = gainNode;
  };

  const selectAndPlayNote = (index: number) => {
    setIsCustomMode(false);
    setActiveNote(index);
    setCustomFingering([...ATENTEBEN_NOTES[index].fingering]);
    playFrequency(ATENTEBEN_NOTES[index].frequency);
  };

  // Play standard scale success chime
  const playSuccessChime = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    
    const now = ctx.currentTime;
    const playTone = (freq: number, delay: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.15, now + delay + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur);
    };
    
    // Satisfying major-chord arpeggio
    playTone(523.25, 0, 0.25);
    playTone(659.25, 0.06, 0.25);
    playTone(783.99, 0.12, 0.25);
    playTone(1046.50, 0.18, 0.4);
  };

  // Soak in water animation
  const handleSoakInWater = () => {
    if (isSoaking || isMoisturized) return;
    setIsSoaking(true);
    setSoakProgress(0);

    const interval = setInterval(() => {
      setSoakProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSoaking(false);
          setIsMoisturized(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Clean the moisture (reset)
  const resetMoisture = () => {
    setIsMoisturized(false);
    setSoakProgress(0);
  };

  // Play standard ascending and descending scale
  const playScaleSequence = async (ascendingOnly = false) => {
    if (isPlayingSequence) {
      if (sequenceTimerRef.current) {
        clearInterval(sequenceTimerRef.current);
      }
      setIsPlayingSequence(false);
      setSequenceIndex(-1);
      stopSound();
      return;
    }

    setIsPlayingSequence(true);
    setIsCustomMode(false);
    let index = 0;
    const order: number[] = [];
    
    // Ascending: 0 to 7
    for (let i = 0; i < 8; i++) order.push(i);
    if (!ascendingOnly) {
      // Descending: 7 to 0
      for (let i = 7; i >= 0; i--) order.push(i);
    }

    const runNextNote = () => {
      if (index >= order.length) {
        setIsPlayingSequence(false);
        setSequenceIndex(-1);
        stopSound();
        return;
      }
      const noteIdx = order[index];
      setSequenceIndex(noteIdx);
      selectAndPlayNote(noteIdx);
      index++;
      sequenceTimerRef.current = setTimeout(runNextNote, practiceSpeed);
    };

    runNextNote();
  };

  // Play Ashanti Funeral Dirge snippet (oral tradition notes)
  const playTraditionalDirge = () => {
    if (isPlayingSequence) {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
      setIsPlayingSequence(false);
      setSequenceIndex(-1);
      stopSound();
      return;
    }

    setIsPlayingSequence(true);
    setIsCustomMode(false);
    // Root note starting, moving up and playing expressive dirge-like note transitions
    const dirgeNoteIndexes = [0, 0, 1, 2, 2, 1, 3, 2, 1, 0, 0];
    const notesDelay = [450, 450, 300, 500, 500, 300, 500, 400, 300, 600, 800];
    let index = 0;

    const runNextDirgeNote = () => {
      if (index >= dirgeNoteIndexes.length) {
        setIsPlayingSequence(false);
        setSequenceIndex(-1);
        stopSound();
        return;
      }
      const noteIdx = dirgeNoteIndexes[index];
      setSequenceIndex(noteIdx);
      selectAndPlayNote(noteIdx);
      sequenceTimerRef.current = setTimeout(() => {
        index++;
        runNextDirgeNote();
      }, notesDelay[index]);
    };

    runNextDirgeNote();
  };

  // Real-time hole interactive manipulation
  const handleToggleHole = (holeIdx: number) => {
    const baseFingering = isCustomMode 
      ? [...customFingering] 
      : (activeNote !== null ? [...ATENTEBEN_NOTES[activeNote].fingering] : [false, false, false, false, false, false, false]);
    
    const nextFingering = [...baseFingering];
    nextFingering[holeIdx] = !nextFingering[holeIdx];
    
    setCustomFingering(nextFingering);
    setIsCustomMode(true);
    
    // Look up if this custom setup produces a perfect scale note
    const matchedIdx = ATENTEBEN_NOTES.findIndex(note => 
      note.fingering.every((val, i) => val === nextFingering[i])
    );
    
    if (matchedIdx !== -1) {
      setActiveNote(matchedIdx);
      playFrequency(ATENTEBEN_NOTES[matchedIdx].frequency);
      
      // Interactive challenge validation
      if (trainerMode === "practice" && matchedIdx === trainerTargetIdx) {
        playSuccessChime();
        setTrainerSuccessMessage(`🎉 Perfect Match! Played ${ATENTEBEN_NOTES[matchedIdx].solfege}!`);
        
        setTimeout(() => {
          setTrainerSuccessMessage(null);
          if (trainerTargetIdx === 7) {
            setTrainerMode("completed");
          } else {
            setTrainerTargetIdx(prev => prev + 1);
          }
        }, 1500);
      }
    } else {
      setActiveNote(null);
      stopSound();
    }
  };

  // Computes the closest scale note to provide real-time corrective finger tips
  const getClosestNote = (fingering: boolean[]) => {
    let minDiff = 8;
    let closestIdx = 0;
    ATENTEBEN_NOTES.forEach((note, idx) => {
      let diff = 0;
      for (let i = 0; i < 7; i++) {
        if (note.fingering[i] !== fingering[i]) diff++;
      }
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    return { noteIdx: closestIdx, diffCount: minDiff };
  };

  // Generate real-time textual tip for correcting finger placement on holes
  const getFingeringCorrectionTips = (userFingering: boolean[], targetFingering: boolean[]) => {
    const tips: string[] = [];
    const labels = ["Thumb (Back)", "Hole 1 (L-Idx)", "Hole 2 (L-Mid)", "Hole 3 (R-Idx)", "Hole 4 (R-Mid)", "Hole 5 (R-Ring)", "Hole 6 (R-Pink)"];
    for (let i = 0; i < 7; i++) {
      if (userFingering[i] !== targetFingering[i]) {
        if (targetFingering[i]) {
          tips.push(`👇 Close ${labels[i]}`);
        } else {
          tips.push(`⚪ Open ${labels[i]}`);
        }
      }
    }
    return tips;
  };

  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
      stopSound();
    };
  }, []);

  const currentFingering = activeNote !== null ? ATENTEBEN_NOTES[activeNote].fingering : [false, false, false, false, false, false, false];

  // Render individual hole toggle with real-time visual guidelines
  const renderFrontHoleButton = (holeIdx: number, label: string) => {
    const isCovered = isCustomMode ? customFingering[holeIdx] : currentFingering[holeIdx];
    
    let targetState: boolean | null = null;
    let isMismatch = false;

    if (trainerMode === "practice") {
      targetState = ATENTEBEN_NOTES[trainerTargetIdx].fingering[holeIdx];
      isMismatch = isCovered !== targetState;
    } else if (activeNote !== null && showAssistOverlay) {
      targetState = ATENTEBEN_NOTES[activeNote].fingering[holeIdx];
      isMismatch = isCovered !== targetState;
    }

    return (
      <div className="relative flex items-center justify-center group h-10 w-full">
        {/* Left hand label info */}
        <span className="absolute right-14 text-[9px] font-mono text-slate-500 opacity-80 select-none hidden sm:inline">
          {label}
        </span>

        <button
          onClick={() => handleToggleHole(holeIdx)}
          className={`w-7 h-7 rounded-full border-2 transition-all duration-200 flex items-center justify-center cursor-pointer relative z-10 ${
            isCovered 
              ? "bg-amber-950 border-amber-900 shadow-inner scale-110 shadow-black" 
              : "bg-amber-200/50 border-amber-300 hover:bg-amber-300/40"
          } ${isMismatch && showAssistOverlay ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-slate-900" : ""}`}
          title={`Front Hole ${holeIdx} (${label}) - Click to toggle finger`}
        >
          {isCovered && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>}
          
          {/* Target guidelines indicator */}
          {showAssistOverlay && targetState !== null && (
            <span className={`absolute -inset-1 rounded-full border border-dashed pointer-events-none animate-pulse ${
              targetState 
                ? "border-emerald-400 opacity-80" 
                : "border-amber-400 opacity-60"
            }`}></span>
          )}
        </button>

        {/* Real-time assist cues next to each hole button */}
        {showAssistOverlay && targetState !== null && (
          <div className="absolute left-10 flex items-center gap-1 bg-slate-950/90 text-[10px] px-2 py-0.5 rounded-md border border-slate-800 z-30 pointer-events-none shadow-md font-mono">
            {targetState ? (
              <span className="text-emerald-400 font-bold">👇 Close</span>
            ) : (
              <span className="text-amber-400 font-normal">⚪ Open</span>
            )}
            {isCovered === targetState ? (
              <span className="text-emerald-500 font-bold ml-1">✓</span>
            ) : (
              <span className="text-amber-500 font-bold ml-1">⚠️</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderBackHoleButton = () => {
    const isCovered = isCustomMode ? customFingering[0] : currentFingering[0];
    
    let targetState: boolean | null = null;
    let isMismatch = false;

    if (trainerMode === "practice") {
      targetState = ATENTEBEN_NOTES[trainerTargetIdx].fingering[0];
      isMismatch = isCovered !== targetState;
    } else if (activeNote !== null && showAssistOverlay) {
      targetState = ATENTEBEN_NOTES[activeNote].fingering[0];
      isMismatch = isCovered !== targetState;
    }

    return (
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">Back Hole</span>
        <div className="relative">
          <button 
            onClick={() => handleToggleHole(0)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer flex items-center justify-center relative z-10 ${
              isCovered 
                ? "bg-amber-600 border-amber-500 shadow-md shadow-amber-500/30 scale-110" 
                : "bg-slate-800 border-slate-700 hover:bg-slate-750"
            } ${isMismatch && showAssistOverlay ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-slate-900" : ""}`}
            title="Thumb hole on the back - Click to toggle finger"
          >
            <span className="text-[10px] text-slate-100 font-bold">{isCovered ? "•" : ""}</span>
            
            {showAssistOverlay && targetState !== null && (
              <span className={`absolute -inset-1 rounded-full border border-dashed pointer-events-none ${
                targetState 
                  ? "border-emerald-400 animate-ping opacity-60" 
                  : "border-amber-400"
              }`}></span>
            )}
          </button>

          {showAssistOverlay && targetState !== null && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-950/90 text-[10px] px-2 py-0.5 rounded-md border border-slate-800 z-30 pointer-events-none shadow-md font-mono">
              {targetState ? (
                <span className="text-emerald-400 font-bold">👇 Close</span>
              ) : (
                <span className="text-amber-400 font-normal">⚪ Open</span>
              )}
              {isCovered === targetState ? (
                <span className="text-emerald-500 font-bold ml-1">✓</span>
              ) : (
                <span className="text-amber-500 font-bold ml-1">⚠️</span>
              )}
            </div>
          )}
        </div>
        <span className="text-[9px] text-slate-500 font-mono">Thumb</span>
      </div>
    );
  };

  // Helper to render mini-fingering dots in the HUD list rows
  const renderMiniFingering = (fingering: boolean[], isActive: boolean) => {
    return (
      <div className="flex items-center gap-0.5 bg-slate-950/80 px-1 py-0.5 rounded border border-slate-800/80">
        {/* Thumb (Back Hole) */}
        <div className="flex flex-col items-center">
          <span className={`w-1.5 h-1.5 rounded-full border ${
            fingering[0] 
              ? (isActive ? "bg-amber-400 border-amber-300 shadow-xs shadow-amber-400" : "bg-amber-600 border-amber-500") 
              : "bg-transparent border-slate-600"
          }`} />
        </div>
        {/* Separator Line */}
        <span className="w-[1px] h-3.5 bg-slate-800 mx-0.5" />
        {/* Front Holes (6) */}
        <div className="flex items-center gap-0.5">
          {fingering.slice(1).map((covered, idx) => (
            <span 
              key={idx}
              className={`w-1 h-1 rounded-full border ${
                covered 
                  ? (isActive ? "bg-emerald-400 border-emerald-300 shadow-xs shadow-emerald-400" : "bg-slate-300 border-slate-400") 
                  : "bg-transparent border-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="atenteben-flute-simulator" className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient mesh */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Flute visualization (Left Column) */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 relative min-h-[520px]">
          
          {/* Floating Scale Cues Overlay HUD */}
          {isOverlayExpanded ? (
            <div className="absolute top-4 right-4 z-40 w-64 md:w-72 bg-slate-900/95 border border-amber-500/30 rounded-xl p-3 shadow-xl backdrop-blur-md flex flex-col gap-2 max-h-[380px] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                  <h5 className="text-[10px] font-bold tracking-wider text-amber-400 uppercase font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Scale Position Cue
                  </h5>
                </div>
                <button 
                  onClick={() => setIsOverlayExpanded(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-bold font-mono hover:bg-slate-800/50 w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                  title="Minimize Overlay"
                >
                  ✕
                </button>
              </div>

              {/* 8-Note Scale Sequence Checklist */}
              <div className="space-y-1 overflow-y-auto max-h-[220px] pr-0.5">
                {ATENTEBEN_NOTES.map((note, idx) => {
                  const isNotePlaying = (activeNote === idx || sequenceIndex === idx) && !isCustomMode;
                  const isNoteMatched = isCustomMode && activeNote === idx;
                  const isActive = isNotePlaying || isNoteMatched;

                  return (
                    <div 
                      key={idx}
                      onClick={() => selectAndPlayNote(idx)}
                      className={`flex items-center justify-between p-1.5 rounded-lg border cursor-pointer transition-all ${
                        isActive 
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5 scale-102" 
                          : "bg-slate-950/40 border-slate-900 text-slate-300 hover:bg-slate-900/50 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center ${
                          isActive ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-400"
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold truncate leading-tight">
                            {note.solfege}
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono scale-90 origin-left">
                            {note.name} ({note.frequency}Hz)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {renderMiniFingering(note.fingering, isActive)}
                        <div className={`p-0.5 rounded transition-colors ${
                          isActive ? "bg-amber-500/20 text-amber-400" : "text-slate-500"
                        }`}>
                          <Play className="w-2.5 h-2.5 fill-current" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Correction & Match status feedback */}
              <div className="mt-1 bg-slate-950/85 p-2 rounded-lg border border-slate-850">
                {isCustomMode ? (
                  activeNote !== null ? (
                    <div className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 justify-center animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5" /> Perfect {ATENTEBEN_NOTES[activeNote].solfege} Match!
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {(() => {
                        const closest = getClosestNote(customFingering);
                        const targetNote = ATENTEBEN_NOTES[closest.noteIdx];
                        const corrections = getFingeringCorrectionTips(customFingering, targetNote.fingering);
                        return (
                          <>
                            <div className="text-[9px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
                              <Activity className="w-3 h-3 text-amber-500 animate-pulse" /> Closest: <span className="text-amber-400 font-bold">{targetNote.solfege}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 max-h-[48px] overflow-y-auto pt-1.5 border-t border-slate-900 pr-0.5">
                              {corrections.map((tip, tIdx) => (
                                <div key={tIdx} className="text-[8px] font-mono text-amber-300 truncate">
                                  {tip}
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )
                ) : (
                  <div className="text-[9px] text-slate-400 text-center italic leading-relaxed">
                    💡 Hover &amp; tap any flute hole on the pipe to customize fingering!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsOverlayExpanded(true)}
              className="absolute top-4 right-4 z-40 bg-slate-900/95 hover:bg-slate-850 border border-amber-500/30 text-amber-300 font-mono text-[9px] font-bold px-3 py-2 rounded-full flex items-center gap-1.5 cursor-pointer shadow-lg transition-all animate-bounce"
              title="Show Scale Cue HUD"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> SHOW SCALE CUE HUD
            </button>
          )}

          <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" /> Atɛntɛbɛn Flute Simulator
          </h4>

          {/* Interactive scale tutorial & progress status */}
          <div className="mb-4 text-center w-full min-h-[64px] flex items-center justify-center">
            {trainerMode === "practice" ? (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl w-full">
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold mb-1 uppercase tracking-wider font-mono">
                  <Sparkles className="w-3.5 h-3.5 fill-current animate-spin" /> Scale Challenge: Note {trainerTargetIdx + 1} of 8
                </div>
                <div className="text-xl font-black text-slate-100 flex items-center justify-center gap-2">
                  <span>Match: {ATENTEBEN_NOTES[trainerTargetIdx].solfege}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">{ATENTEBEN_NOTES[trainerTargetIdx].name}</span>
                </div>
                
                {trainerSuccessMessage ? (
                  <p className="text-xs text-emerald-400 font-semibold mt-1 animate-bounce">{trainerSuccessMessage}</p>
                ) : (
                  <p className="text-[11px] text-slate-300 mt-1 font-mono">
                    {(() => {
                      const baseFingering = isCustomMode ? customFingering : currentFingering;
                      const matches = baseFingering.filter((f, idx) => f === ATENTEBEN_NOTES[trainerTargetIdx].fingering[idx]).length;
                      return `Holes matched: ${matches} / 7. Adjust highlighted holes!`;
                    })()}
                  </p>
                )}
              </div>
            ) : trainerMode === "completed" ? (
              <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-xl w-full text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold mb-0.5 uppercase tracking-wider">
                  <Award className="w-4 h-4 fill-emerald-500/10" /> Challenge Accomplished!
                </div>
                <div className="text-lg font-black text-emerald-300">
                  🎉 Master Atɛntɛbɛnist!
                </div>
                <p className="text-[10px] text-slate-300">
                  You matched all 8 notes in the scale correctly. Excellent technique!
                </p>
              </div>
            ) : activeNote !== null ? (
              <div>
                <span className="text-2xl font-bold text-amber-400">
                  {isCustomMode ? "Custom Tone: " : ""}{ATENTEBEN_NOTES[activeNote].solfege}
                </span>
                <p className="text-xs text-slate-400 font-mono mt-1">Note: {ATENTEBEN_NOTES[activeNote].name} ({ATENTEBEN_NOTES[activeNote].frequency} Hz)</p>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-slate-300 text-sm font-semibold">
                  {isCustomMode ? "💨 Breath Airflow (No clean pitch)" : "Click a note or tap flute holes to play"}
                </span>
                {isCustomMode && (
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">
                    Closest: {(() => {
                      const closest = getClosestNote(customFingering);
                      return `${ATENTEBEN_NOTES[closest.noteIdx].solfege} (adjust ${closest.diffCount} hole${closest.diffCount > 1 ? "s" : ""})`;
                    })()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Interactive Flute Pipe Layout */}
          <div className="relative flex items-center justify-center gap-16 py-4 w-full max-w-sm">
            
            {/* Back hole segment (Left thumb) */}
            {renderBackHoleButton()}

            {/* Simulated Bamboo Flute Pipe */}
            <div className="relative w-18 h-88 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-200 rounded-3xl border-4 border-amber-300/80 shadow-inner flex flex-col items-center justify-between py-6 overflow-hidden">
              {/* Bamboo Segment Rings */}
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-amber-300 opacity-60"></div>
              <div className="absolute top-2/4 left-0 right-0 h-1 bg-amber-300 opacity-60"></div>
              <div className="absolute top-3/4 left-0 right-0 h-1 bg-amber-300 opacity-60"></div>

              {/* 6 Front Holes, grouped into 3 sets of 2 */}
              <div className="flex flex-col items-center gap-1 w-full z-10">
                {/* Set 1: Left hand fingers */}
                <div className="flex flex-col gap-2.5 w-full">
                  {renderFrontHoleButton(1, "L-Index")}
                  {renderFrontHoleButton(2, "L-Middle")}
                </div>

                {/* Gap */}
                <div className="h-4"></div>

                {/* Set 2: Right hand fingers */}
                <div className="flex flex-col gap-2.5 w-full">
                  {renderFrontHoleButton(3, "R-Index")}
                  {renderFrontHoleButton(4, "R-Middle")}
                </div>

                {/* Gap */}
                <div className="h-4"></div>

                {/* Set 3 */}
                <div className="flex flex-col gap-2.5 w-full">
                  {renderFrontHoleButton(5, "R-Ring")}
                  {renderFrontHoleButton(6, "R-Pinky")}
                </div>
              </div>
            </div>

            {/* Interactive guidelines checklist */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="text-left text-xs space-y-1.5 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <div className="font-bold text-slate-300 mb-1 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Interaction Key
                </div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-950"></div> <span className="text-slate-400 text-[10px]">Covered Hole</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-300"></div> <span className="text-slate-400 text-[10px]">Open Hole</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full border border-dashed border-emerald-400"></div> <span className="text-slate-400 text-[10px]">Cue Target</span></div>
              </div>

              {/* Visual guides toggle */}
              <button
                onClick={() => setShowAssistOverlay(prev => !prev)}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer text-center ${
                  showAssistOverlay 
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/25" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750"
                }`}
              >
                {showAssistOverlay ? "Hide Scale Visual Cues" : "Show Scale Visual Cues"}
              </button>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[10px] text-slate-400 italic">💡 Tap on any hole to cover or open it with your fingers!</span>
          </div>
        </div>

        {/* Studio Controls (Right) */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-amber-100 flex items-center gap-2">
                Ghanaian Atɛntɛbɛn Flute Studio
              </h3>
              {isMoisturized && (
                <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 fill-emerald-400" /> Moist Tone
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              The traditional bamboo flute of Ghana. As taught by master flutist Kudjo, soaking your flute in water softens the sound and adds richness. Explore the notes and practice scales using the interactive panel below.
            </p>

            {/* Interactive Scale Trainer Section */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" /> 8-Note Scale Trainer Challenge
                </h4>
                {trainerMode !== "idle" && (
                  <button
                    onClick={() => { setTrainerMode("idle"); stopSound(); }}
                    className="text-[10px] bg-red-500/15 text-red-400 hover:bg-red-500/30 font-bold px-2 py-0.5 rounded-md transition-colors"
                  >
                    Quit Trainer
                  </button>
                )}
              </div>

              {trainerMode === "idle" ? (
                <div>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    Reinforce the theory learned in the video. The interactive trainer monitors your custom finger taps on the flute and guides you step-by-step through all 8 notes!
                  </p>
                  <button
                    onClick={() => {
                      setTrainerMode("practice");
                      setTrainerTargetIdx(0);
                      setIsCustomMode(true);
                      setCustomFingering([false, false, false, false, false, false, false]); // Start fresh
                      stopSound();
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs py-2 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> Start Scale practice Challenge
                  </button>
                </div>
              ) : trainerMode === "practice" ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Interact with the flute holes to match the scale target:
                  </p>
                  
                  {/* Step indicators */}
                  <div className="flex items-center justify-between gap-1">
                    {ATENTEBEN_NOTES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setTrainerTargetIdx(i);
                          setTrainerSuccessMessage(null);
                        }}
                        className={`flex-1 text-center py-1 rounded text-[10px] font-mono font-bold transition-all ${
                          trainerTargetIdx === i 
                            ? "bg-amber-500 text-slate-950 scale-105" 
                            : i < trainerTargetIdx 
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  {/* Matching Feedback Comparison Panel */}
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850 text-[11px] space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                      <span>Fingering Target checklist</span>
                      <span>Target Match</span>
                    </div>

                    {/* Back Hole */}
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Thumb (Back Hole)</span>
                      <span className="flex items-center gap-1.5">
                        <span className="text-[10px] opacity-60">({ATENTEBEN_NOTES[trainerTargetIdx].fingering[0] ? "Closed" : "Open"})</span>
                        {(isCustomMode ? customFingering[0] : currentFingering[0]) === ATENTEBEN_NOTES[trainerTargetIdx].fingering[0] ? (
                          <span className="text-emerald-400 font-bold">✓ Match</span>
                        ) : (
                          <span className="text-amber-400 font-bold animate-pulse">⚠️ {ATENTEBEN_NOTES[trainerTargetIdx].fingering[0] ? "Close" : "Open"}</span>
                        )}
                      </span>
                    </div>

                    {/* Front Holes left hand */}
                    <div className="flex items-center justify-between text-slate-300 border-t border-slate-900 pt-1.5">
                      <span>Left Hand Front Holes (1-3)</span>
                      <span className="flex items-center gap-1.5">
                        {(() => {
                          const userSet1 = (isCustomMode ? customFingering : currentFingering).slice(1, 4);
                          const targetSet1 = ATENTEBEN_NOTES[trainerTargetIdx].fingering.slice(1, 4);
                          const matches = userSet1.every((v, i) => v === targetSet1[i]);
                          return matches ? (
                            <span className="text-emerald-400 font-bold">✓ Match</span>
                          ) : (
                            <span className="text-amber-400 font-bold animate-pulse">⚠️ Adjust</span>
                          );
                        })()}
                      </span>
                    </div>

                    {/* Front Holes right hand */}
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Right Hand Front Holes (4-6)</span>
                      <span className="flex items-center gap-1.5">
                        {(() => {
                          const userSet2 = (isCustomMode ? customFingering : currentFingering).slice(4, 7);
                          const targetSet2 = ATENTEBEN_NOTES[trainerTargetIdx].fingering.slice(4, 7);
                          const matches = userSet2.every((v, i) => v === targetSet2[i]);
                          return matches ? (
                            <span className="text-emerald-400 font-bold">✓ Match</span>
                          ) : (
                            <span className="text-amber-400 font-bold animate-pulse">⚠️ Adjust</span>
                          );
                        })()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setTrainerTargetIdx(p => Math.max(0, p - 1))}
                      disabled={trainerTargetIdx === 0}
                      className="flex-1 py-1 px-2 text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-md transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => {
                        // Quick auto-match helper
                        setCustomFingering([...ATENTEBEN_NOTES[trainerTargetIdx].fingering]);
                        setActiveNote(trainerTargetIdx);
                        playFrequency(ATENTEBEN_NOTES[trainerTargetIdx].frequency);
                        playSuccessChime();
                        setTrainerSuccessMessage(`🎉 Auto-aligned to ${ATENTEBEN_NOTES[trainerTargetIdx].solfege}!`);
                        setTimeout(() => {
                          setTrainerSuccessMessage(null);
                          if (trainerTargetIdx === 7) {
                            setTrainerMode("completed");
                          } else {
                            setTrainerTargetIdx(prev => prev + 1);
                          }
                        }, 1500);
                      }}
                      className="py-1 px-2.5 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md transition-colors cursor-pointer"
                      title="Automatically align fingers to this note"
                    >
                      💡 Auto-Align
                    </button>
                    <button
                      onClick={() => setTrainerTargetIdx(p => Math.min(7, p + 1))}
                      disabled={trainerTargetIdx === 7}
                      className="flex-1 py-1 px-2 text-[10px] font-bold bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-md transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      Skip →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-2">
                  <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5 text-xs mb-1">
                    <Award className="w-4 h-4" /> Challenge Accomplished!
                  </div>
                  <p className="text-[11px] text-slate-300 mb-3">
                    Amazing! You matched all 8 scale note patterns correctly.
                  </p>
                  <button
                    onClick={() => {
                      setTrainerMode("practice");
                      setTrainerTargetIdx(0);
                      setCustomFingering([false, false, false, false, false, false, false]);
                      stopSound();
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 text-xs py-1.5 rounded-lg transition-colors cursor-pointer animate-pulse"
                  >
                    Start Over
                  </button>
                </div>
              )}
            </div>

            {/* Note Keyboard Trigger */}
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Interactive 8-Note Scale</h4>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {ATENTEBEN_NOTES.map((note, idx) => (
                <button
                  key={idx}
                  onClick={() => selectAndPlayNote(idx)}
                  className={`py-3 px-2 rounded-xl border text-center transition-all ${
                    (activeNote === idx || sequenceIndex === idx) && !isCustomMode
                      ? "bg-amber-500 text-slate-950 border-amber-300 font-bold scale-105 shadow-lg shadow-amber-500/20"
                      : "bg-slate-800/80 border-slate-700 text-slate-100 hover:bg-slate-750 hover:border-slate-600"
                  }`}
                >
                  <div className="text-xs font-semibold">{note.solfege}</div>
                  <div className="text-[10px] font-mono opacity-60 mt-0.5">{note.name}</div>
                </button>
              ))}
            </div>

            {/* Controls Bar */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => playScaleSequence(false)}
                className={`py-2.5 px-4 rounded-xl border font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                  isPlayingSequence && sequenceIndex !== -1
                    ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                    : "bg-slate-850 border-slate-700 hover:bg-slate-800 text-slate-200"
                }`}
              >
                {isPlayingSequence ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                Scale Demo
              </button>

              <button
                onClick={playTraditionalDirge}
                className="py-2.5 px-4 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 font-medium text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4" />
                Ashanti Dirge
              </button>
            </div>

            {/* Practice speed slider */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">Practice Speed (Tempo)</span>
                <span className="text-xs font-mono text-amber-400">{practiceSpeed}ms</span>
              </div>
              <input 
                type="range" 
                min="150" 
                max="800" 
                step="50"
                value={practiceSpeed} 
                onChange={(e) => setPracticeSpeed(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
            </div>
          </div>

          {/* Moisturizer Trick block */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-start gap-4">
            <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 flex-shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-amber-200 mb-0.5">Kudjo's Moisturizer Secret</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                "Soaking the flute in water for 10 minutes before a performance can produce a nice moist and warm tone instead of a dry one."
              </p>
              
              {isSoaking ? (
                <div className="w-full">
                  <div className="flex justify-between text-[10px] text-amber-400 font-mono mb-1">
                    <span>Soaking bamboo fibres...</span>
                    <span>{soakProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-150" style={{ width: `${soakProgress}%` }}></div>
                  </div>
                </div>
              ) : isMoisturized ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">✔ Flute Hydrated</span>
                  <button 
                    onClick={resetMoisture}
                    className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    Dry out flute
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSoakInWater}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 fill-current" />
                  Soak Flute (10-Min Simulation)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick notice block */}
      <div className="mt-6 flex items-start gap-2 bg-slate-950/20 border-t border-slate-800/40 pt-4 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p>
          <strong>Oral Tradition Notice:</strong> The Ashanti Funeral Dirge is traditionally taught hand-to-hand from Masters to apprentices using sound patterns. This simulator is designed to give you a structural orientation to notes and fingering.
        </p>
      </div>
    </div>
  );
}
