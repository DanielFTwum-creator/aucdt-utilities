import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Lesson, UserProgress } from "../types";
import { ArrowLeft, Play, RefreshCw, Volume2, VolumeX, Keyboard } from "lucide-react";

// R1/R3 Hand diagram: realistic palm + finger illustration showing which finger
// to use for the next target character, in resting position over the home row.
function HandDiagram({ activeHand, activeFinger, isIdle }: { activeHand: string; activeFinger: string; isIdle: boolean }) {
  const isSpace = activeHand === "Hands";
  const homeKeys = ["Pinky", "Ring", "Middle", "Index"];

  const leftFingers = [
    { name: "Pinky",  key: "A", x: 26,  w: 34, h: 58 },
    { name: "Ring",   key: "S", x: 68,  w: 36, h: 76 },
    { name: "Middle", key: "D", x: 112, w: 38, h: 94 },
    { name: "Index",  key: "F", x: 158, w: 36, h: 80 },
  ];
  const rightFingers = [
    { name: "Index",  key: "J", x: 406, w: 36, h: 80 },
    { name: "Middle", key: "K", x: 450, w: 38, h: 94 },
    { name: "Ring",   key: "L", x: 496, w: 36, h: 76 },
    { name: "Pinky",  key: ";", x: 540, w: 34, h: 58 },
  ];

  const ACTIVE = "fill-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.85)]";
  const RESTING = "fill-slate-400 dark:fill-slate-500";
  const IDLE_OFF = "fill-slate-300 dark:fill-slate-700";

  const fingerClass = (hand: "Left" | "Right", name: string) => {
    if (!isSpace && activeHand.startsWith(hand) && activeFinger === name) return ACTIVE;
    if (isIdle && homeKeys.includes(name)) return RESTING;
    return IDLE_OFF;
  };

  const thumbClass = isSpace ? ACTIVE : isIdle ? RESTING : IDLE_OFF;
  const palmClass = "fill-slate-200 dark:fill-slate-800";
  const palmTop = 128;

  return (
    <svg viewBox="0 0 600 220" className="w-full max-w-md mx-auto lg:max-w-none" aria-hidden="true">
      {/* Left hand fingers */}
      {leftFingers.map((f) => (
        <rect key={f.name} x={f.x} y={palmTop - f.h} width={f.w} height={f.h + 24} rx={f.w / 2}
          className={`transition-all duration-100 ${fingerClass("Left", f.name)}`} />
      ))}
      {/* Left palm */}
      <path d="M14,140 Q14,210 40,212 H220 Q246,210 246,140 V128 Q246,118 236,118 H24 Q14,118 14,128 Z"
        className={`transition-all duration-100 ${palmClass}`} />
      {/* Left thumb */}
      <rect x="210" y="165" width="60" height="32" rx="16" transform="rotate(18 210 181)"
        className={`transition-all duration-100 ${thumbClass}`} />

      {/* Right hand fingers */}
      {rightFingers.map((f) => (
        <rect key={f.name} x={f.x} y={palmTop - f.h} width={f.w} height={f.h + 24} rx={f.w / 2}
          className={`transition-all duration-100 ${fingerClass("Right", f.name)}`} />
      ))}
      {/* Right palm */}
      <path d="M354,140 Q354,210 380,212 H560 Q586,210 586,140 V128 Q586,118 576,118 H364 Q354,118 354,128 Z"
        className={`transition-all duration-100 ${palmClass}`} />
      {/* Right thumb */}
      <rect x="330" y="165" width="60" height="32" rx="16" transform="rotate(-18 390 181)"
        className={`transition-all duration-100 ${thumbClass}`} />

      {/* Spacebar */}
      <rect x="220" y="200" width="160" height="14" rx="7"
        className={`transition-all duration-100 ${isSpace ? ACTIVE : "fill-slate-300 dark:fill-slate-700"}`} />

      {/* Home-row key labels at fingertips */}
      {[
        ...leftFingers.map((f) => ({ ...f, hand: "Left" as const })),
        ...rightFingers.map((f) => ({ ...f, hand: "Right" as const })),
      ].map((f) => {
        const isActiveLabel = !isSpace && activeHand.startsWith(f.hand) && activeFinger === f.name;
        return (
          <text key={`${f.name}-lbl`} x={f.x + f.w / 2} y={palmTop - f.h + 16} textAnchor="middle"
            className={`text-[11px] font-mono font-bold uppercase ${isActiveLabel ? "fill-slate-950" : "fill-slate-500 dark:fill-slate-400"}`}>
            {f.key}
          </text>
        );
      })}
    </svg>
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

  // Ref mirror of usedPracticeIndices to avoid stale closures in the completion setTimeout
  const usedPracticeIndicesRef = useRef<number[]>([]);

  // TUC Academic 6R Methodology controls (R2: BPM & tone persisted across sessions)
  const [metronomeBpm, setMetronomeBpm] = useState<number>(() => {
    const cached = localStorage.getItem("tuc_metronome_bpm");
    return cached ? Number(cached) : 0;
  });
  const [metronomeTick, setMetronomeTick] = useState<boolean>(false);
  const [audioMode, setAudioMode] = useState<"synth-tick" | "mechanical-clack" | "none">(() => {
    const cached = localStorage.getItem("tuc_audio_mode");
    return (cached as "synth-tick" | "mechanical-clack" | "none") || "none";
  });
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

  // R2: persist metronome BPM and audio tone selections
  useEffect(() => {
    localStorage.setItem("tuc_metronome_bpm", String(metronomeBpm));
  }, [metronomeBpm]);

  useEffect(() => {
    localStorage.setItem("tuc_audio_mode", audioMode);
  }, [audioMode]);

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
    usedPracticeIndicesRef.current = [];
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
          // Auto compile remedial drills repeating hard characters to sync muscles.
          // Cap to the 5 most recent wrong keys so the drill stays a short, focused fix-up
          // even when a long passage produced many distinct misses.
          const capKeys = wrongKeys.slice(-5);
          const repeats = capKeys.map(k => `${k}${k}${k}`).join(" ");
          const comboSet = capKeys.join("") + " " + capKeys.slice().reverse().join("");
          const remediationString = `${repeats} ${comboSet} ${capKeys.join("")}`;
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

          // Mark current practice as used (read from ref to avoid stale closure
          // if a drill completes faster than this 600ms timeout)
          const newUsed = [...usedPracticeIndicesRef.current, currentPracticeIdx];
          usedPracticeIndicesRef.current = newUsed;
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
    <div className="space-y-3">

      {/* Header and Control row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-0.5">
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
      <div className="bg-slate-950 text-white rounded-2xl p-3 border border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.12)] relative overflow-hidden transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,_rgba(6,182,212,0.08),transparent_40%)] pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h4 className="text-xs font-black tracking-wider uppercase text-zinc-100 font-mono">
              6R Cognitive Training System
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* R2 Metronome Controls */}
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 rounded-lg px-2 py-1">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400">⏱️ R2:</span>
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
            </div>

            {/* R4 Tone Selector */}
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 rounded-lg px-2 py-1">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400">🔊 R4:</span>
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

        {/* 6R Quick Strip of active indicators — compact single line */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 relative z-10 text-[10px] font-mono">
          <span className="text-slate-400 font-bold uppercase">🏠 R1 <span className="text-cyan-400">ASDF/JKL;</span></span>
          <span className="text-slate-400 font-bold uppercase">⏱️ R2 <span className="text-cyan-400">{metronomeBpm > 0 ? `${metronomeBpm} BPM` : "Not Synced"}</span></span>
          <span className="text-slate-400 font-bold uppercase truncate max-w-[200px]" title={getFingerGuidance(nextTargetChar || "")?.path || "Calculating Trajectory..."}>
            👉 R3 <span className="text-cyan-400">{getFingerGuidance(nextTargetChar || "") ? `${getFingerGuidance(nextTargetChar || "")?.finger} (${getFingerGuidance(nextTargetChar || "")?.anchor})` : "Compute reach..."}</span>
          </span>
          <span className="text-slate-400 font-bold uppercase">📡 R4 <span className="text-emerald-400">Audio Clack</span></span>
          <span className={`font-bold uppercase transition-all ${combo > 0 ? 'text-cyan-300' : 'text-slate-400'}`}>
            🔥 R5 <span className={`${combo >= 15 ? 'text-amber-400 animate-pulse' : combo >= 5 ? 'text-cyan-400' : 'text-cyan-300'}`}>{combo}x</span>
            <span className="text-slate-500"> (Best {sessionMaxCombo}x{progress.bestCombo > 0 ? `, All ${progress.bestCombo}x` : ""})</span>
          </span>
        </div>
      </div>

      {/* Exercise core dashboard */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-sm">

        {/* Lesson Badge + Title — consolidated into a single horizontal row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-tight font-mono">
            {lesson.title} {isCalibrationMode && "— Calibration Refinement"}
          </h3>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-sky-600 dark:text-cyan-400 uppercase">
            <span>{isCalibrationMode ? "R6 SYSTEM HEALING MODE" : "Current Target Tiers"}</span>
            <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isCalibrationMode ? 'bg-amber-500' : 'bg-cyan-400'}`}></span>
            <span>Set {currentPracticeIdx + 1} of {lesson.practices.length}</span>
          </div>
        </div>

        {/* Live Calibration Alert banner */}
        {isCalibrationMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-xl p-3 mb-2 mt-2 flex items-start gap-3 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
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
        <div className="grid grid-cols-3 gap-2 my-2 text-center">
          <div className="p-1.5 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Accuracy</div>
            <div className={`text-base font-bold mt-0.5 ${accuracy < 80 ? "text-rose-600 dark:text-rose-400" : "text-sky-600 dark:text-cyan-400"}`}>
              {accuracy}%
            </div>
          </div>
          <div className="p-1.5 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">WPM Speed</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
              {wpm}
            </div>
          </div>
          <div className="p-1.5 bg-zinc-50 dark:bg-slate-950/30 border border-zinc-100 dark:border-white/5 rounded-xl">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest">Elapsed Time</div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-0.5 font-mono">
              {elapsed}s
            </div>
          </div>
        </div>

        {/* Progress bar towards completion of practice set */}
        <div className="h-1 w-full bg-zinc-100 dark:bg-slate-950/40 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-150 ${isCalibrationMode ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-sky-600 dark:bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`}
            style={{ width: `${Math.round((inputVal.length / currentSentence.length) * 100)}%` }}
          ></div>
        </div>

        {/* Dynamic Highlight Text Box */}
        <div className="relative border border-zinc-300 dark:border-white/5 bg-zinc-50 dark:bg-slate-950/40 p-4 sm:p-6 rounded-xl font-mono text-lg sm:text-xl font-medium tracking-wide leading-relaxed text-center select-none block min-h-[70px] shadow-inner mb-2">
          <div className="absolute top-2 left-3 text-[9px] font-mono text-zinc-400 dark:text-slate-500 tracking-widest uppercase font-bold">
            Interactive Field / Input Protocol {isCalibrationMode && "— Calibration Sandbox"}
          </div>
          <div className="text-zinc-800 dark:text-zinc-200 break-words flex flex-wrap justify-center mt-2">
            {currentSentence.split("").map((char, index) => {
              const isCurrent = index === inputVal.length;
              let charStyle = "text-zinc-500 dark:text-slate-400"; // default unentered
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
        <div className="mt-2 space-y-1.5">
          <input
            ref={inputRef}
            id="typingActiveInputElement"
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder={isStarted ? "" : "Click here and start practicing..."}
            className={`w-full text-center py-2.5 bg-zinc-50 dark:bg-slate-950/40 border-2 rounded-lg text-lg font-mono focus:outline-none focus:bg-white dark:focus:bg-[#050608] text-zinc-900 dark:text-white shadow-inner transition-all duration-200 ${metronomeTick && metronomeBpm > 0 ? 'border-cyan-400 dark:border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.35)]' : 'border-zinc-200 dark:border-white/5 focus:border-sky-500 dark:focus:border-cyan-500/40'}`}
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

          {/* R2: live metronome beat indicator, positioned at the typing field for visibility */}
          {metronomeBpm > 0 && (
            <div className="text-center flex items-center justify-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full transition-all duration-75 ${metronomeTick ? 'bg-cyan-400 scale-125 shadow-[0_0_10px_#22d3ee]' : 'bg-zinc-300 dark:bg-slate-800'}`}></span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 dark:text-slate-500">
                {metronomeBpm} BPM Beat
              </span>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Visual Keyboard Guide */}
      <div className="bg-zinc-100 dark:bg-[#0a0d14]/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center space-x-2 text-zinc-600 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
          <Keyboard size={14} />
          <span>Tactile Guide: Strike the Highlighted Target Key</span>
        </div>

        {/* Hands + keyboard side-by-side on wide screens to avoid stacking height */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 max-w-6xl mx-auto">

          {/* R1/R3 Hand diagram — shows active finger, home row on idle */}
          <div className="lg:w-[28%] lg:shrink-0">
            <div className="text-[9px] font-mono font-bold text-zinc-500 dark:text-slate-500 uppercase tracking-widest text-center mb-1">
              🏠 R1 Home Row Posture — Active Finger
            </div>
            <HandDiagram
              activeHand={getFingerGuidance(nextTargetChar || "")?.hand ?? ""}
              activeFinger={getFingerGuidance(nextTargetChar || "")?.finger ?? ""}
              isIdle={!isStarted}
            />
          </div>

          <div className="space-y-2 lg:space-y-1.5 mx-auto lg:flex-1 font-mono">
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center space-x-2 lg:space-x-1.5 xl:space-x-2">
                {row.map((key) => {
                  const isActive = nextTargetChar === key;
                  return (
                    <div
                      key={key}
                      className={`w-14 h-14 sm:w-20 sm:h-20 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-16 2xl:h-16 flex items-center justify-center rounded-lg text-base sm:text-2xl lg:text-sm xl:text-lg 2xl:text-2xl font-bold border-2 transition-all ${
                        isActive
                          ? "bg-cyan-400 border-cyan-600 text-slate-950 scale-110 shadow-lg ring-4 ring-cyan-300/70 animate-pulse dark:border-cyan-200 dark:ring-cyan-300/50 dark:shadow-[0_0_30px_rgba(34,211,238,0.7)]"
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
            <div className="flex justify-center mt-2 lg:mt-1.5">
              <div
                className={`h-14 sm:h-20 lg:h-10 xl:h-12 2xl:h-16 w-64 sm:w-96 lg:w-48 xl:w-64 2xl:w-80 flex items-center justify-center rounded-lg text-sm sm:text-base font-bold border-2 transition-all ${
                  nextTargetChar === " "
                    ? "bg-cyan-400 border-cyan-600 text-slate-950 scale-105 shadow-lg ring-4 ring-cyan-300/70 animate-pulse dark:border-cyan-200 dark:ring-cyan-300/50 dark:shadow-[0_0_30px_rgba(34,211,238,0.7)]"
                    : "bg-white dark:bg-slate-900/40 border-zinc-200 dark:border-white/5 text-zinc-500 dark:text-slate-500"
                }`}
              >
                <span className="tracking-widest font-mono text-center text-sm sm:text-base">SPACEBAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
