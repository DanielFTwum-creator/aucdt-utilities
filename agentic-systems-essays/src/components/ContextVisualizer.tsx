import { useState } from "react";
import { Sliders, Flame, Sparkles, SlidersHorizontal, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";

export default function ContextVisualizer() {
  const [weightA, setWeightA] = useState(45); // Structural Guidelines
  const [weightB, setWeightB] = useState(30); // Real-time feedback
  const [weightC, setWeightC] = useState(25); // Context Trails
  const [isSautéed, setIsSautéed] = useState(false);
  const [sautéProgress, setSautéProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalTokensRaw = Math.round((weightA * 150 + weightB * 200 + weightC * 280) * 1.5);
  const totalTokens = isSautéed ? Math.round(totalTokensRaw * 0.52) : totalTokensRaw;
  
  // Calculate a mock recall score
  const structuralIntegrity = Math.max(0, 100 - Math.abs(weightA - 40) * 2);
  const errorFeedbackCoverage = Math.max(0, 100 - Math.abs(weightB - 35) * 2);
  const contextContinuity = Math.max(0, 100 - Math.abs(weightC - 25) * 2);
  const rawRecallScore = Math.round((structuralIntegrity + errorFeedbackCoverage + contextContinuity) / 3);
  
  // Sautéing concentrates prompt constraints, so it increases cognitive recall by making instructions super sharp
  const recallScore = isSautéed ? Math.min(99, Math.round(rawRecallScore * 1.15)) : Math.min(95, rawRecallScore);

  const startSauté = () => {
    setIsProcessing(true);
    setSautéProgress(0);
    const interval = setInterval(() => {
      setSautéProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setIsSautéed(true);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const resetPrompt = () => {
    setIsSautéed(false);
    setSautéProgress(0);
    setWeightA(45);
    setWeightB(30);
    setWeightC(25);
  };

  // Generate coordinates for an elegant visualizer curve showing Token Weight vs Recall rate
  const generateCurvePoints = () => {
    const points = [];
    const steps = 14;
    const curveBonus = isSautéed ? 1.3 : 1.0;
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 400;
      // Formula representing the sweet spot for context loading
      const t = i / steps;
      const baseHeight = 160 * Math.sin(t * Math.PI) * Math.exp(-t * 0.5);
      const sautéFactor = isSautéed ? (1.35 - 0.2 * t) : 1;
      const y = 200 - (baseHeight * (recallScore / 85) * sautéFactor);
      points.push(`${x},${y}`);
    }
    return `M 0,200 Q 100,50 200,${200 - (120 * curveBonus * (recallScore / 80))} T 400,200`;
  };

  return (
    <div className="bg-neutral-50/50 border border-black/10 rounded-lg p-5 md:p-6 font-sans text-[#1A1A1A]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/5 pb-4">
        <div>
          <span className="font-sans text-[10px] font-bold text-black uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
            Interactive Visualizer — Essay 2
          </span>
          <h3 className="text-xl font-serif text-[#1A1A1A] mt-2 font-medium">
            Metabolic Prompt "Chef" Engine
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isSautéed ? (
            <button
              onClick={resetPrompt}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-[10px] font-sans font-bold uppercase tracking-wider rounded text-black transition-colors border border-black/10 cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Raw Context
            </button>
          ) : (
            <button
              onClick={startSauté}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 disabled:opacity-50 text-[10px] font-sans font-bold uppercase tracking-wider text-white rounded transition-all font-bold cursor-pointer"
            >
              <Flame className={`w-3.5 h-3.5 ${isProcessing ? "animate-bounce" : ""}`} />
              {isProcessing ? `SAUTÉING (${sautéProgress}%)...` : "SAUTÉ PROMPT CONSTRAINTS"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Input Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white p-4 border border-black/5 rounded-lg space-y-5">
          <div className="flex items-center gap-2 mb-2 border-b border-black/5 pb-2 border-dashed">
            <SlidersHorizontal className="w-4 h-4 text-black/60" />
            <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-black/60">
              A/B/C Context Feedstocks
            </h4>
          </div>

          {/* Weight A Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[#1A1A1A]/80 font-medium">A: Structural Guidelines</span>
              <span className="text-black font-bold">{weightA}%</span>
            </div>
            <input
              id="slider-a"
              type="range"
              min="10"
              max="70"
              disabled={isProcessing || isSautéed}
              value={weightA}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setWeightA(val);
                // Balance remaining weight among B and C
                const remaining = 100 - val;
                setWeightB(Math.round(remaining * (weightB / (weightB + weightC))));
                setWeightC(100 - val - Math.round(remaining * (weightB / (weightB + weightC))));
              }}
              className="w-full accent-black bg-neutral-100 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <p className="text-[10px] text-black/50 italic font-serif">
              Mandated rules on framework limits, directories, and absolute paths constraints.
            </p>
          </div>

          {/* Weight B Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[#1A1A1A]/80 font-medium">B: Real-time System state</span>
              <span className="text-black font-bold">{weightB}%</span>
            </div>
            <input
              id="slider-b"
              type="range"
              min="10"
              max="70"
              disabled={isProcessing || isSautéed}
              value={weightB}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setWeightB(val);
                const remaining = 100 - val;
                setWeightA(Math.round(remaining * (weightA / (weightA + weightC))));
                setWeightC(100 - val - Math.round(remaining * (weightA / (weightA + weightC))));
              }}
              className="w-full accent-black bg-neutral-100 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <p className="text-[10px] text-black/50 italic font-serif">
              Linter reports, compiler states, and active container binding feedback loops.
            </p>
          </div>

          {/* Weight C Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline font-mono text-xs">
              <span className="text-[#1A1A1A]/80 font-medium">C: Historical prompt trails</span>
              <span className="text-black font-bold">{weightC}%</span>
            </div>
            <input
              id="slider-c"
              type="range"
              min="10"
              max="70"
              disabled={isProcessing || isSautéed}
              value={weightC}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setWeightC(val);
                const remaining = 100 - val;
                setWeightA(Math.round(remaining * (weightA / (weightA + weightB))));
                setWeightB(100 - val - Math.round(remaining * (weightA / (weightA + weightB))));
              }}
              className="w-full accent-black bg-neutral-100 h-1 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
            />
            <p className="text-[10px] text-black/50 italic font-serif">
              Memory coordinates of past steps, user revisions, and session trajectory maps.
            </p>
          </div>
        </div>

        {/* Cognitive & recall curves (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Main Visualizer Panel */}
          <div className="bg-[#111] border border-black/5 p-4 rounded-lg flex-1 flex flex-col justify-between text-neutral-300">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[9px] uppercase font-sans font-bold text-neutral-500 tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Context Dynamics & Recall Curve
              </span>
              <span>{isSautéed ? "CARAMELIZED STATE" : "RAW STATE"}</span>
            </div>

            {/* Simulated Curve SVG */}
            <div className="relative h-40 bg-black/40 rounded border border-white/5 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full absolute inset-0 text-neutral-800" viewBox="0 0 400 200" preserveAspectRatio="none">
                {/* Horizontal reference grids */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="#222" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#222" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#222" strokeWidth="0.5" strokeDasharray="3 3" />
                
                {/* Actual curve representation */}
                <path
                  d={generateCurvePoints()}
                  fill="none"
                  stroke={isSautéed ? "#f97316" : "#4b5563"}
                  strokeWidth={isSautéed ? "2.5" : "1.5"}
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Cognitive Sweetspot Marker */}
              <div
                className="absolute transition-all duration-700 ease-out flex flex-col items-center"
                style={{
                  left: "50%",
                  top: isSautéed ? "20%" : "38%",
                  transform: "translate(-50%, -50%)"
                }}
              >
                <div className={`h-3.5 w-3.5 rounded-full border-2 ${isSautéed ? "bg-orange-500 border-white animate-pulse" : "bg-neutral-600 border-neutral-400"}`}></div>
                <div className="bg-[#151515] text-[10px] font-mono border border-white/5 px-2 py-0.5 rounded text-neutral-200 mt-1 shadow-lg shrink-0 whitespace-nowrap">
                  Recall Peak: {recallScore}% accuracy
                </div>
              </div>

              <div className="absolute bottom-1 right-2 text-[9px] font-mono text-neutral-600">Recall % vs Token Depth &rarr;</div>
            </div>

            {/* Dashboard details */}
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5">
              <div className="bg-[#151515] p-2.5 rounded border border-white/5 flex flex-col">
                <span className="text-[9px] font-sans font-bold text-neutral-500 uppercase tracking-widest">
                  Glucose (Token) Volume
                </span>
                <span className="text-lg font-serif text-neutral-200 mt-0.5 font-semibold">
                  {totalTokens.toLocaleString()} <span className="text-[10px] font-mono text-neutral-500 uppercase">Tokens</span>
                </span>
                <span className="text-[9px] text-neutral-500 font-mono mt-1">
                  {isSautéed ? "📉 Reduced by ~48%" : "Full feedstock payload"}
                </span>
              </div>

              <div className="bg-[#151515] p-2.5 rounded border border-white/5 flex flex-col">
                <span className="text-[9px] font-sans font-bold text-neutral-500 uppercase tracking-widest">
                  Chef Reduction Efficiency
                </span>
                <span className={`text-lg font-serif mt-0.5 font-semibold ${isSautéed ? "text-orange-400" : "text-neutral-500"}`}>
                  {isSautéed ? "Sauté: Concentrated" : "Raw Feedstock"}
                </span>
                <span className="text-[9px] font-mono mt-1 text-neutral-500 font-medium">
                  {isSautéed ? "🔥 Focused constraints" : "Needs stove reduction"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
