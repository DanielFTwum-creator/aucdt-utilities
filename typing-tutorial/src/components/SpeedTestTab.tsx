import { useState, useEffect, useRef, ChangeEvent } from "react";
import { REFERENCE_SPEEDTEXTS } from "../data";
import { RefreshCw, Play, BarChart, FileText, Timer } from "lucide-react";

interface SpeedTestTabProps {
  onRecordResult: (wpm: number, accuracy: number, points: number) => void;
}

export default function SpeedTestTab({ onRecordResult }: SpeedTestTabProps) {
  const [passageIndex, setPassageIndex] = useState(0);
  const selectedText = REFERENCE_SPEEDTEXTS[passageIndex];

  const [inputVal, setInputVal] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [testComplete, setTestComplete] = useState(false);

  // References
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleStart = () => {
    setInputVal("");
    setAccuracy(100);
    setWpm(0);
    setTimeRemaining(60);
    setIsTesting(true);
    setTestComplete(false);

    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleEndTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleEndTest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTesting(false);
    setTestComplete(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isTesting) return;
    const value = e.target.value;
    setInputVal(value);

    // Compute live WPM and Accuracy
    let rightChars = 0;
    const minLength = Math.min(value.length, selectedText.length);
    for (let i = 0; i < minLength; i++) {
      if (value[i] === selectedText[i]) {
        rightChars++;
      }
    }

    const liveAcc = value.length > 0 ? Math.round((rightChars / value.length) * 100) : 100;
    setAccuracy(liveAcc);

    // Calc WPM. Standard definition of WPM is (total correct characters / 5) / (minutes elapsed)
    const timeElapsedSec = 60 - timeRemaining;
    const minutes = Math.max(0.08, timeElapsedSec / 60);
    const liveWpm = Math.round((rightChars / 5) / minutes);
    setWpm(liveWpm);

    // Finish test early if text fully matches
    if (value === selectedText) {
      handleEndTest();
    }
  };

  const calculatePoints = () => {
    return Math.round(wpm * 3.5 + accuracy * 5);
  };

  const saveSpeedResult = () => {
    const points = calculatePoints();
    onRecordResult(wpm, accuracy, points);
    setTestComplete(false);
    setInputVal("");
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Timed Keyboarding Assessment
          </h2>
          <p className="text-xs text-zinc-500">
            Assess your professional typing output and certify your WPM count under English (UK) standards.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Passage index switcher */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
            {REFERENCE_SPEEDTEXTS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (!isTesting) setPassageIndex(idx);
                }}
                disabled={isTesting}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  passageIndex === idx
                    ? "bg-white dark:bg-zinc-800 text-sky-600 dark:text-sky-400 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                P{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Practice workspace */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Target Text passage */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5 uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <FileText size={16} />
              <span>Target Paragraph Passage</span>
            </h3>

            <div className="text-zinc-800 dark:text-zinc-300 font-sans leading-relaxed text-base tracking-normal text-justify select-none border-b border-zinc-200 dark:border-white/5 pb-4">
              {selectedText.split("").map((char, index) => {
                const isCurrent = index === inputVal.length && isTesting;
                let charStyle = "text-zinc-500 dark:text-slate-400";
                if (index < inputVal.length) {
                  charStyle = inputVal[index] === char
                    ? "text-zinc-900 dark:text-slate-200"
                    : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 underline font-bold";
                }

                if (isCurrent) {
                  return (
                    <span key={index} id={`testChar-${index}`} className="relative text-zinc-950 dark:text-white font-bold inline-block">
                      {char}
                      <span className="absolute bottom-[-1px] left-0 w-full h-[2.5px] bg-sky-500 dark:bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                    </span>
                  );
                }

                return (
                  <span key={index} id={`testChar-${index}`} className={charStyle}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Timed display card */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-50 dark:bg-slate-950/30 p-4 rounded-xl border border-transparent dark:border-white/5">
              <div className="flex items-center space-x-2 text-zinc-700 dark:text-slate-300">
                <Timer size={18} className="text-sky-500 dark:text-cyan-400" />
                <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white">{timeRemaining} seconds</span>
              </div>

              {!isTesting && !testComplete ? (
                <button
                  id="startSpeedtestBtn"
                  onClick={handleStart}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-500/30 font-bold rounded-lg text-xs transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <Play size={10} fill="currentColor" />
                  <span>Start 60s Assessment</span>
                </button>
              ) : isTesting ? (
                <button
                  id="cancelSpeedtestBtn"
                  onClick={handleEndTest}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-all flex items-center space-x-1 cursor-pointer bg-red-600"
                >
                  <span>Stop Assessment Early</span>
                </button>
              ) : (
                <button
                  id="retrySpeedtestBtn"
                  onClick={handleStart}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all flex items-center space-x-1 cursor-pointer border dark:border-white/10"
                >
                  <RefreshCw size={10} />
                  <span>Re-run Assessment</span>
                </button>
              )}
            </div>

            {/* Interactive assessment textarea */}
            <div className="relative">
              <textarea
                ref={inputRef}
                id="speedtestTextareaInputElement"
                value={inputVal}
                onChange={handleInputChange}
                disabled={!isTesting}
                placeholder={isTesting ? "Type the passage exactly as displayed above..." : "The workspace is locked. Click 'Start 60s Assessment' to unlock."}
                rows={4}
                className="w-full p-4 bg-zinc-50 dark:bg-slate-950/40 border-2 border-zinc-200 dark:border-white/5 focus:bg-white dark:focus:bg-[#050608] focus:border-sky-500 dark:focus:border-cyan-500/40 rounded-xl font-mono focus:outline-none text-zinc-900 dark:text-white leading-relaxed resize-none shadow-inner"
                spellCheck="false"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Stats or Assessment Sheet */}
        <div className="space-y-4">
          
          {/* Live indicators during test */}
          {isTesting && (
            <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 rounded-2xl shadow-sm text-center space-y-4">
              <h4 className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">Analysis Engine State</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Active WPM:</span>
                  <span className="font-bold text-emerald-400 text-lg">{wpm}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Total Accuracy:</span>
                  <span className="font-bold text-sky-400 text-lg">{accuracy}%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 text-[10px] font-mono">CHARACTERS ENTERED:</span>
                  <span className="font-mono">{inputVal.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Test Completion Panel */}
          {testComplete && (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800/50 rounded-2xl shadow-sm space-y-4">
              <div className="text-center">
                <span className="text-3xl">🎉</span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-1">Assessment Complete</h4>
                <p className="text-xs text-zinc-500 mt-1">You reached the completion gate. Here is your scorecard:</p>
              </div>

              <div className="space-y-3 font-mono text-xs text-zinc-800 dark:text-zinc-300">
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 py-1.5">
                  <span>Gross Speed:</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">{wpm} WPM</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 py-1.5">
                  <span>Accuracy Standard:</span>
                  <span className="font-bold text-zinc-900 dark:text-white text-sm">{accuracy}%</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 py-1.5">
                  <span>Estimated Points:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">+{calculatePoints()} pts</span>
                </div>
              </div>

              <button
                id="submitSpeedtestStatsBtn"
                onClick={saveSpeedResult}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-all block"
              >
                Log to Performance Database
              </button>
            </div>
          )}

          {/* Guidelines info card defaults */}
          {!isTesting && !testComplete && (
            <div className="p-5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white inline-flex items-center space-x-1">
                <BarChart size={16} />
                <span>Certification Metrics</span>
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                A student's typing credential is measured strictly upon 60-second intervals. Points weights are allocated proportionally according to the complexity of punctuation structures:
              </p>
              <ul className="space-y-1 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                <li>• Level 1 Anchor: ~15 to 25 WPM</li>
                <li>• Level 2 Intermediate: ~25 to 40 WPM</li>
                <li>• Level 3 Professional: ~40 to 65 WPM</li>
                <li>• Level 4 Champion: &gt;65 WPM</li>
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
