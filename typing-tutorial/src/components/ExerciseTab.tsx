import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Lesson, UserProgress } from "../types";
import { ArrowLeft, Play, RefreshCw, Volume2, VolumeX, Keyboard } from "lucide-react";

// R1/R3 Hand diagram: shows which finger to use for the next target character
function HandDiagram({ activeHand, activeFinger, isIdle }: { activeHand: string; activeFinger: string; isIdle: boolean }) {
  const leftFingers = [
    { name: "Pinky",  key: "A", h: "h-10 sm:h-14" },
    { name: "Ring",   key: "S", h: "h-12 sm:h-16" },
    { name: "Middle", key: "D", h: "h-14 sm:h-20" },
    { name: "Index",  key: "F", h: "h-12 sm:h-16" },
  ];
  const rightFingers = [
    { name: "Index",  key: "J", h: "h-12 sm:h-16" },
    { name: "Middle", key: "K", h: "h-14 sm:h-20" },
    { name: "Ring",   key: "L", h: "h-12 sm:h-16" },
    { name: "Pinky",  key: ";", h: "h-10 sm:h-14" },
  ];
  const homeKeys = ["Pinky", "Ring", "Middle", "Index"];
  const isSpaceBar = activeHand === "Hands";

  const fingerCls = (hand: string, name: string) => {
    const active = activeHand.includes(hand) && activeFinger === name;
    const resting = isIdle && homeKeys.includes(name);
    if (active) return "bg-cyan-500/30 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.5)] text-cyan-300";
    if (resting) return "bg-slate-700/60 border-slate-500 text-slate-400";
    return "bg-slate-900/40 border-white/10 text-slate-600";
  };

  const thumbCls = isSpaceBar
    ? "bg-cyan-500/30 border-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.5)] text-cyan-300"
    : isIdle ? "bg-slate-700/60 border-slate-500 text-slate-400"
    : "bg-slate-900/40 border-white/10 text-slate-600";

  return (
    <div className="flex justify-center items-end gap-6 py-3">
      {/* Left hand */}
      <div className="flex items-end gap-1">
        {leftFingers.map(f => (
          <div key={f.name} className="flex flex-col items-center gap-0.5">
            <div className={`w-6 sm:w-8 ${f.h} rounded-t-2xl border-2 flex items-end justify-center pb-1 transition-all duration-100 ${fingerCls("Left", f.name)}`}>
              <span className="text-[8px] font-mono font-bold leading-none">{f.name[0]}</span>
            </div>
            <span className="text-[7px] font-mono text-slate-600 uppercase">{f.key}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-0.5 ml-1">
          <div className={`w-6 sm:w-8 h-7 sm:h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-100 ${thumbCls}`}>
            <span className="text-[8px] font-mono font-bold">T</span>
          </div>
        </div>
      </div>

      {/* Spacebar indicator */}
      <div className={`w-20 sm:w-28 h-5 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-100 ${thumbCls}`}>
        <span className="text-[7px] font-mono tracking-widest text-current">SPACE</span>
      </div>

      {/* Right hand */}
      <div className="flex items-end gap-1">
        <div className="flex flex-col items-center gap-0.5 mr-1">
          <div className={`w-6 sm:w-8 h-7 sm:h-9 rounded-2xl border-2 flex items-center justify-center transition-all duration-100 ${thumbCls}`}>
            <span className="text-[8px] font-mono font-bold">T</span>
          </div>
        </div>
        {rightFingers.map(f => (
          <div key={f.name} className="flex flex-col items-center gap-0.5">
            <div className={`w-6 sm:w-8 ${f.h} rounded-t-2xl border-2 flex items-end justify-center pb-1 transition-all duration-100 ${fingerCls("Right", f.name)}`}>
              <span className="text-[8px] font-mono font-bold leading-none">{f.name[0]}</span>
            </div>
            <span className="text-[7px] font-mono text-slate-600 uppercase">{f.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ExerciseTabProps {
  lesson: Lesson;
  progress: UserProgress;
  onFinish: (accuracy: number, wpm: number, points: number, sessionMaxCombo: number) => void;
  onBack: () => void;
}

export default function ExerciseTab({ lesson, progress, onFinish, onBack }: ExerciseTabProps) {
  const [currentPracticeIdx, setCurrentPracticeIdx] = useState(0);
  const [usedPracticeIndices, setUsedPracticeIndices] = useState<number[]>([]);
  const targetText = lesson.practices[currentPracticeIdx];

  const [inputVal, setInputVal] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Stats
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [elapsed, setElapsed] = useState(0);
  const [muteAudio, setMuteAudio] = useState(false);

  // Focus
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // TUC Academic 6R Methodology controls
  const [metronomeBpm, setMetronomeBpm] = useState<number>(0);
  const [metronomeTick, setMetronomeTick] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<"synth-tick" | "mechanical-clack" | "none">("none");
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [sessionMaxCombo, setSessionMaxCombo] = useState<number>(0);
  const [wrongKeys, setWrongKeys] = useState<string[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // R6 Calibration Mode
  const [isCalibrationMode, setIsCalibrationMode] = useState<boolean>(false);
  const [calibrationText, setCalibrationText] = useState<string>("");

  // R3 relative reach calculator
  const getFingerGuidance = (char: string) => {
    if (!char) return null;
    const c = char.toLowerCase();
    if (c === " ") return { hand: "Hands", finger: "Thumbs", anchor: "Space", path: "Press Spacebar naturally centered between thumbs" };
    if ("qaz1".includes(c)) return { hand: "Left Hand", finger: "Pinky", anchor: "A", path: "Anchor Left Pinky on A" + (c !== "a" ? ` and transit up/down to strike ${c.toUpperCase()}` : " tactile home key") };
    if ("wsx2".includes(c)) return { hand: "Left Hand", finger: "Ring", anchor: "S", path: "Anchor Left Ring on S" + (c !== "s" ? ` and stretch up/down to stroke ${c.toUpperCase()}` : " tactile home key") };
    if ("edc3".includes(c)) return { hand: "Left Hand", finger: "Middle", anchor: "D", path: "Anchor Left Middle on D" + (c !== "d" ? ` and extend forward/backward to index ${c.toUpperCase()}` : " tactile home key") };
    if ("rfvtgb45".includes(c)) return { hand: "Left Hand", finger: "Index", anchor: "F", path: "Anchor Left Index on F" + (c !== "f" ? ` and reach forward/diagonal to reach ${c.toUpperCase()}` : " tactile anchor key with bump") };
    if ("yhnujm67".includes(c)) return { hand: "Right Hand", finger: "Index", anchor: "J", path: "Anchor Right Index on J" + (c !== "j" ? ` and reach diagonal/left to grasp ${c.toUpperCase()}` : " tactile anchor key with bump") };
    if ("ik,8".includes(c)) return { hand: "Right Hand", finger: "Middle", anchor: "K", path: "Anchor Right Middle on K" + (c !== "k" ? ` and reach upward to register ${c.toUpperCase()}` : " tactile home key") };
    if ("ol.9".includes(c)) return { hand: "Right Hand", finger: "Ring", anchor: "L", path: "Anchor Right Ring on L" + (c !== "l" ? ` and displace upward to strike ${c.toUpperCase()}` : " tactile home key") };
    if ("p;/".includes(c)) return { hand: "Right Hand", finger: "Pinky", anchor: ";", path: "Anchor Right Pinky on ;" + (c !== ";" ? ` and pitch outward to record ${c.toUpperCase()}` : " tactile home key") };
    return { hand: "Fingers", finger: "Finger", anchor: "Home", path: `Stroke ${char.toUpperCase()} returning swiftly to standard home row resting rows.` };
  };

  // Audio effects synthesizer generator (R4 Response Audio)
  // force=true bypasses audioMode check so error/success sounds always play unless muted
  const playFeedTone = (frequency: number, type: OscillatorType, duration: number, force = false) => {
    if ((audioMode === "none" && !force) || muteAudio) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const audioCtx = audioCtxRef.current;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio engine deactivated or suspended by browser agent
      audioCtxRef.current = null; // reset so we recreate next time
    }
  };

  const playSuccessChime = () => {
    playFeedTone(523.25, "sine", 0.15, true);
    setTimeout(() => playFeedTone(659.25, "sine", 0.15, true), 80);
  };

  const playErrorBuzz = () => {
    playFeedTone(130, "triangle", 0.22, true);
  };

  // Active metronome synchronization thread (R2 Rhythm Metronome)
  useEffect(() => {
    let metronomeInterval: NodeJS.Timeout | null = null;
    if (metronomeBpm > 0 && isStarted) {
      const beatMs = 60000 / metronomeBpm;
      metronomeInterval = setInterval(() => {
        playFeedTone(1000, "sine", 0.012);
        setMetronomeTick(true);
        setTimeout(() => setMetronomeTick(false), 70);
      }, beatMs);
    }
    return () => {
      if (metronomeInterval) clearInterval(metronomeInterval);
    };
  }, [metronomeBpm, isStarted, audioMode, muteAudio]);

  const handleReset = () => {
    setInputVal("");
    setIsStarted(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    setCombo(0);
    setWrongKeys([]);
    setIsCalibrationMode(false);
    setCalibrationText("");
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    handleReset();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPracticeIdx, lesson]);

  // Keep focus on workspace element
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Reset practice tracking when lesson changes
  useEffect(() => {
    setUsedPracticeIndices([]);
    // Select a random practice to start with
    const randomIndex = Math.floor(Math.random() * lesson.practices.length);
    setCurrentPracticeIdx(randomIndex);
  }, [lesson]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentText = isCalibrationMode ? calibrationText : targetText;
    
    // Lock length range
    if (value.length > currentText.length) return;

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    // Play tactile mechanical / electronic clack feedback
    if (value.length > 0) {
      const latestCharTyped = value[value.length - 1];
      const targetChar = currentText[value.length - 1];
      if (latestCharTyped === targetChar) {
        if (audioMode === "synth-tick") {
          playFeedTone(800, "sine", 0.05);
        } else if (audioMode === "mechanical-clack") {
          playFeedTone(290, "triangle", 0.09);
        }
        setCombo((prev) => {
          const nextCombo = prev + 1;
          if (nextCombo > maxCombo) {
            setMaxCombo(nextCombo);
            setSessionMaxCombo((sm) => Math.max(sm, nextCombo));
          }
          return nextCombo;
        });
      } else {
        playErrorBuzz();
        setCombo(0);

        // Record invalid character mapping into calibration database logs
        const invalidChar = targetChar.toLowerCase();
        if (invalidChar !== " " && !wrongKeys.includes(invalidChar)) {
          setWrongKeys((prev) => [...prev, invalidChar]);
        }
      }
    }

    setInputVal(value);

    // Calculate Accuracy metrics
    let rightChars = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) rightChars++;
    }

    const currentAcc = value.length > 0 ? Math.round((rightChars / value.length) * 100) : 100;
    setAccuracy(currentAcc);

    const minutes = Math.max(0.1, elapsed / 60);
    const calculatedWpm = Math.round((value.length / 5) / minutes);
    setWpm(calculatedWpm);

    // Drill completion router logic
    if (value === currentText) {
      // If student is finishing regular exercise and accuracy < 90%, divert into R6 Calibration set
      if (!isCalibrationMode && wrongKeys.length > 0 && currentAcc < 90) {
        if (timerRef.current) clearInterval(timerRef.current);
        playFeedTone(440, "sine", 0.18);
        
        setTimeout(() => {
          setIsCalibrationMode(true);
          // Auto compile remedial drills repeating hard characters to sync muscles
          const repeats = wrongKeys.map(k => `${k}${k}${k}`).join(" ");
          const comboSet = wrongKeys.join("") + " " + wrongKeys.slice().reverse().join("");
          const remediationString = `${repeats} ${comboSet} ${wrongKeys.join("")}`;
          setCalibrationText(remediationString);
          setInputVal("");
          setIsStarted(false);
          setStartTime(null);
        }, 500);
      } else {
        // Safe clear run completed or remediation hurdle passed
        if (timerRef.current) clearInterval(timerRef.current);
        playSuccessChime();

        setTimeout(() => {
          // Streak bonus modifier
          const streakMultiplier = Math.min(250, maxCombo * 5);
          const pointsEarned = Math.round(currentAcc * 10 + calculatedWpm * 2) + streakMultiplier;
          const finalSessionMax = Math.max(sessionMaxCombo, maxCombo);

          // Mark current practice as used
          const newUsed = [...usedPracticeIndices, currentPracticeIdx];
          setUsedPracticeIndices(newUsed);

          // Calculate available practice indices
          const allIndices = Array.from({ length: lesson.practices.length }, (_, i) => i);
          const availableIndices = allIndices.filter(i => !newUsed.includes(i));

          if (availableIndices.length === 0) {
            // All practices in this lesson completed — record progress and return to lesson map
            onFinish(currentAcc, calculatedWpm, pointsEarned, finalSessionMax);
            return;
          }

          const nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

          setCurrentPracticeIdx(nextIndex);
          setWrongKeys([]);
          setCombo(0);
          setMaxCombo(0);
          setIsCalibrationMode(false);
          setCalibrationText("");
        }, 600);
      }
    }
  };

  // Trajectory mapping targets
  const currentSentence = isCalibrationMode ? calibrationText : targetText;
  const nextTargetChar = currentSentence[inputVal.length]?.toLowerCase();

  const keyboardRows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."]
  ];

  return (
    <div className="space-y-6">
      
      {/* Header and Control row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-1">
        <button
          id="backToLessonsBtn"
          onClick={onBack}
          className="inline-flex w-full sm:w-auto justify-center items-center space-x-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white text-sm font-semibold cursor-pointer border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 min-h-[44px] rounded-lg bg-zinc-50 dark:bg-zinc-900 transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Exit to Map</span>
        </button>

        <div className="flex items-center space-x-3 self-end sm:self-auto">
          {/* Audio volume toggler */}
          <button
            id="muteAudioBtn"
            onClick={() => setMuteAudio(!muteAudio)}
            className="p-2.5 min-h-[44px] border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-300 cursor-pointer flex items-center justify-center"
            title={muteAudio ? "Unmute Audio" : "Mute Audio"}
          >
            {muteAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            id="restartExerciseBtn"
            onClick={handleReset}
            className="inline-flex items-center space-x-2 px-3 py-2 min-h-[44px] bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-900 dark:hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer border dark:border-white/5"
          >
            <RefreshCw size={12} />
            <span>Restart Exercise</span>
          </button>
        </div>
      </div>

      {/* 6R Keyboarding Protocol Hub — Cognitive UX Overlay */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.12)] relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,_rgba(6,182,212,0.08),transparent_40%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              TUC Academic Keyboarding Protocol
            </span>
            <h4 className="text-md font-black tracking-wider uppercase text-zinc-100 flex items-center gap-2 font-mono">
              6R Cognitive Training System
            </h4>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* R2 Metronome Controls */}
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 rounded-lg px-2.5 py-1.5">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400">⏱️ R2 Metronome:</span>
              <select
                id="metronomeBpmSelect"
                value={metronomeBpm}
                onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                className="bg-transparent text-xs font-mono font-bold text-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="0" className="bg-slate-950 text-white">OFF</option>
                <option value="40" className="bg-slate-950 text-white">40 BPM — Slow</option>
                <option value="60" className="bg-slate-950 text-white">60 BPM — Steady</option>
                <option value="80" className="bg-slate-950 text-white">80 BPM — Brisk</option>
                <option value="100" className="bg-slate-950 text-white">100 BPM — Fast</option>
                <option value="120" className="bg-slate-950 text-white">120 BPM — Sprint</option>
              </select>
              {metronomeBpm > 0 && (
                <span className={`w-2 h-2 rounded-full transition-all duration-75 ${metronomeTick ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_#22d3ee]' : 'bg-slate-800'}`}></span>
              )}
            </div>

            {/* R4 Tone Selector */}
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 rounded-lg px-2.5 py-1.5">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400">🔊 R4 Tone:</span>
              <select
                id="audioModeSelect"
                value={audioMode}
                onChange={(e) => setAudioMode(e.target.value as any)}
                className="bg-transparent text-xs font-mono font-bold text-cyan-400 focus:outline-none cursor-pointer"
              >
                <option value="synth-tick" className="bg-slate-950 text-white">Synth Tick</option>
                <option value="mechanical-clack" className="bg-slate-950 text-white">Mecha-Clack</option>
                <option value="none" className="bg-slate-950 text-white">Silent</option>
              </select>
            </div>
          </div>
        </div>

        {/* 6R Quick Grid of active indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mt-4 relative z-10 text-xs">
          {/* R1 Resting */}
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">🏠 R1 RESTING</span>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 font-bold">ASDF / JKL;</span>
          </div>

          {/* R2 Rhythm */}
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">⏱️ R2 RHYTHM</span>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 font-bold">
              {metronomeBpm > 0 ? `${metronomeBpm} BPM Sync` : "Not Synced"}
            </span>
          </div>

          {/* R3 Transition */}
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between col-span-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👉 R3 TRANSITION</span>
            <div className="text-[10px] text-cyan-400 font-mono mt-1 truncate font-semibold" title={getFingerGuidance(nextTargetChar || "")?.path || "Calculating Trajectory..."}>
              {getFingerGuidance(nextTargetChar || "") ? (
                <span>
                  {getFingerGuidance(nextTargetChar || "")?.finger} ({getFingerGuidance(nextTargetChar || "")?.anchor})
                </span>
              ) : (
                "Compute reach..."
              )}
            </div>
          </div>

          {/* R4 Response */}
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">📡 R4 RESPONSE</span>
            <span className="text-[10px] text-emerald-400 font-mono mt-1 font-bold">Audio Clack</span>
          </div>

          {/* R5 Reward */}
          <div className={`p-2.5 rounded-lg border flex flex-col justify-between transition-all duration-150 ${combo > 0 ? 'bg-cyan-500/10 border-cyan-500/35 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-white/5 border-white/5'}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">🔥 R5 STREAK</span>
            <span className={`text-xs font-black font-mono mt-1 transition-all ${combo >= 15 ? 'text-amber-400 animate-pulse text-sm' : combo >= 5 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}>
              {combo}x
            </span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
              Best: {sessionMaxCombo}x {progress.bestCombo > 0 && <span className="text-amber-500/70">(All: {progress.bestCombo}x)</span>}
            </span>
          </div>
        </div>

        {/* Dynamic description helper for R3 Relative Reaches */}
        <div className="mt-3 p-2.5 bg-slate-900/60 rounded-lg flex items-center justify-between border border-white/5 text-[11px] font-mono text-zinc-400">
          <p className="flex items-center gap-1.5 leading-relaxed">
            <span className="text-cyan-400 text-xs font-bold shrink-0">🎯</span>
            <span className="hidden sm:inline">{getFingerGuidance(nextTargetChar || "")?.path || "Anchor your hands cleanly and strike a key to register alignment tracking."}</span>
            <span className="sm:hidden font-bold text-cyan-400">{getFingerGuidance(nextTargetChar || "")?.finger ?? "—"} ({getFingerGuidance(nextTargetChar || "")?.anchor ?? "—"})</span>
          </p>
          <span className="text-[9px] font-bold text-cyan-500 bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded tracking-widest uppercase shrink-0 hidden sm:block">
            Relative Reach
          </span>
        </div>
      </div>

      {/* Exercise core dashboard */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        
        {/* Lesson Badge */}
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-sky-600 dark:text-cyan-400 uppercase">
          <span>{isCalibrationMode ? "R6 SYSTEM HEALING MODE" : "Current Target Tiers"}</span>
          <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCalibrationMode ? 'bg-amber-500' : 'bg-cyan-400'}`}></span>
          <span>Set {currentPracticeIdx + 1} of {lesson.practices.length}</span>
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 uppercase tracking-tight font-mono">
          {lesson.title} {isCalibrationMode && "— Calibration Refinement"}
        </h3>

        {/* Live Calibration Alert banner */}
        {isCalibrationMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl p-4.5 mb-5 mt-4 flex items-start gap-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center text-lg shrink-0">
              ⚠️
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-black uppercase tracking-widest font-mono">
                Quick fix-up: drilling the keys you missed
              </h5>
              <p className="text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                You had trouble with:{' '}
                {wrongKeys.map((k, i) => (
                  <span key={i} className="inline-block font-mono bg-amber-500/20 dark:bg-amber-500/30 text-amber-500 dark:text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-black mr-1">{k === " " ? "space" : k}</span>
                ))}.
                Complete this short drill before moving on.
              </p>
            </div>
          </div>
        )}

        {/* Live Status indicator charts */}
        <div className="grid grid-cols-3 gap-3 my-5 text-center">
          <div className="p-3 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[10px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Accuracy</div>
            <div className={`text-xl font-bold mt-0.5 ${accuracy < 80 ? "text-rose-600 dark:text-rose-400" : "text-sky-600 dark:text-cyan-400"}`}>
              {accuracy}%
            </div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[10px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">WPM Speed</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              {wpm}
            </div>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[10px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Elapsed Time</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
              {elapsed}s
            </div>
          </div>
        </div>

        {/* Progress bar towards completion of practice set */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-slate-950/40 rounded-full overflow-hidden mb-6">
          <div
            className={`h-full transition-all duration-150 ${isCalibrationMode ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-sky-600 dark:bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`}
            style={{ width: `${Math.round((inputVal.length / currentSentence.length) * 100)}%` }}
          ></div>
        </div>

        {/* Dynamic Highlight Text Box */}
        <div className="relative border border-zinc-300 dark:border-white/5 bg-zinc-50 dark:bg-slate-950/40 p-6 sm:p-10 rounded-xl font-mono text-xl sm:text-2xl font-medium tracking-wide leading-relaxed text-center select-none block min-h-[110px] shadow-inner mb-6">
          <div className="absolute top-3 left-4 text-[9px] font-mono text-zinc-400 dark:text-slate-500 tracking-widest uppercase font-bold">
            Interactive Field / Input Protocol {isCalibrationMode && "— Calibration Sandbox"}
          </div>
          <div className="text-zinc-800 dark:text-zinc-200 break-words flex flex-wrap justify-center mt-2">
            {currentSentence.split("").map((char, index) => {
              const isCurrent = index === inputVal.length;
              let charStyle = "text-zinc-400 dark:text-slate-600"; // default unentered
              if (index < inputVal.length) {
                charStyle = inputVal[index] === char
                  ? "text-zinc-900 dark:text-zinc-300"
                  : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded font-bold underline decoration-wavy";
              }

              if (isCurrent) {
                return (
                  <span key={index} id={`exerciseChar-${index}`} className="relative text-zinc-950 dark:text-white mx-0.5 font-bold">
                    {char === " " ? "␣" : char}
                    <span className={`absolute bottom-[-2px] left-0 w-full h-[3px] shadow-[0_0_10px_#22d3ee] ${isCalibrationMode ? 'bg-amber-500' : 'bg-sky-500 dark:bg-cyan-400'}`}></span>
                  </span>
                );
              }

              return (
                <span key={index} className={`mx-0.5 inline-block ${charStyle}`}>
                  {char === " " ? "␣" : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Focused Native Input container */}
        <div className="mt-5 space-y-2">
          <input
            ref={inputRef}
            id="typingActiveInputElement"
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder={isStarted ? "" : "Click here and start practicing..."}
            className={`w-full text-center py-3.5 bg-zinc-50 dark:bg-slate-950/40 border-2 rounded-lg text-lg font-mono focus:outline-none focus:bg-white dark:focus:bg-[#050608] text-zinc-900 dark:text-white shadow-inner transition-all duration-200 ${metronomeTick && metronomeBpm > 0 ? 'border-cyan-400 dark:border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)]' : 'border-zinc-200 dark:border-white/5 focus:border-sky-500 dark:focus:border-cyan-500/40'}`}
            autoComplete="off"
            spellCheck="false"
            disabled={inputVal.length >= currentSentence.length}
          />
          {!isStarted && (
            <div className="text-center text-xs text-zinc-500 dark:text-slate-500 flex items-center justify-center space-x-1 uppercase tracking-wider font-mono animate-pulse">
              <Play size={10} fill="currentColor" />
              <span>Strike any key to begin countdown</span>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Visual Keyboard Guide */}
      <div className="bg-zinc-100 dark:bg-[#0a0d14]/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Keyboard size={14} />
          <span>Tactile Guide: Strike the Highlighted Target Key</span>
        </div>

        <div className="space-y-1.5 max-w-xl mx-auto font-mono">
          {keyboardRows.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center space-x-1.5">
              {row.map((key) => {
                const isActive = nextTargetChar === key;
                return (
                  <div
                    key={key}
                    className={`w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold border transition-all ${
                      isActive
                        ? "bg-sky-500 border-sky-600 text-white scale-110 shadow-lg animate-pulse dark:bg-cyan-500/30 dark:border-cyan-400/50 dark:shadow-[0_0_20px_rgba(34,211,238,0.3)] dark:text-white"
                        : "bg-white dark:bg-slate-900/40 border-zinc-200 dark:border-white/5 text-zinc-800 dark:text-slate-400"
                    }`}
                  >
                    <span className="uppercase">{key}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Spacebar row */}
          <div className="flex justify-center mt-2.5">
            <div
              className={`h-8 sm:h-11 w-36 sm:w-52 flex items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold border transition-all ${
                nextTargetChar === " "
                  ? "bg-sky-500 border-sky-600 text-white scale-105 shadow-lg animate-pulse dark:bg-cyan-500/30 dark:border-cyan-400/50 dark:shadow-[0_0_20px_rgba(34,211,238,0.3)] dark:text-white"
                  : "bg-white dark:bg-slate-900/40 border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-slate-500"
              }`}
            >
              <span className="tracking-widest font-mono text-center text-[10px]">SPACEBAR</span>
            </div>
          </div>
        </div>

        {/* R1/R3 Hand diagram — shows active finger, home row on idle */}
        <div className="mt-4 border-t border-white/5 pt-4">
          <div className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest text-center mb-1">
            🏠 R1 Home Row Posture — Active Finger
          </div>
          <HandDiagram
            activeHand={getFingerGuidance(nextTargetChar || "")?.hand ?? ""}
            activeFinger={getFingerGuidance(nextTargetChar || "")?.finger ?? ""}
            isIdle={!isStarted}
          />
        </div>
      </div>

    </div>
  );
}
