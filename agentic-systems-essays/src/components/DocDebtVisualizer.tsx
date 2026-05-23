import { useState, useEffect } from "react";
import { BookOpen, AlertTriangle, Hammer, CheckCircle2, TrendingUp, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function DocDebtVisualizer() {
  const [isTinkered, setIsTinkered] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [activeFile, setActiveFile] = useState<"api" | "queue">("api");
  const [selectedAmbiguity, setSelectedAmbiguity] = useState<string | null>(null);

  const startRefactoringText = () => {
    setIsRefactoring(true);
    setTimeout(() => {
      setIsRefactoring(false);
      setIsTinkered(true);
    }, 1800);
  };

  const resetTinkering = () => {
    setIsTinkered(false);
    setSelectedAmbiguity(null);
  };

  // 30 days mock chart points calculation
  const getChartPoints = () => {
    const points = [];
    const days = 30;
    
    for (let day = 1; day <= days; day++) {
      const scaleFactor = day / days;
      // Pre-tinkering levels stand at ~45% success and slowly decay due to creeping debt
      // After tinkering (day 15), we see a steep climb in doc accuracy and success rates
      let docAccuracy = 45 - (day > 15 ? 0 : day * 0.2);
      let agentSuccess = 48 - (day > 15 ? 0 : day * 0.1);

      if (isTinkered) {
        if (day > 15) {
          const t = (day - 15) / 15;
          docAccuracy = 45 + t * 49; // climbs to ~94%
          agentSuccess = 48 + t * 43; // climbs to ~91%
        }
      }
      points.push({ day, docAccuracy, agentSuccess });
    }
    return points;
  };

  const chartData = getChartPoints();

  // Create coordinates for drawing SVG lines easily
  const createSvgPath = (key: "docAccuracy" | "agentSuccess") => {
    const width = 360;
    const height = 120;
    const points = chartData.map((d, i) => {
      const x = (i / 29) * width;
      // invert Y (100 is at top, 0 is at bottom)
      const y = height - (d[key] / 100) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="bg-neutral-50/50 border border-black/10 rounded-lg p-5 md:p-6 font-sans text-[#1A1A1A]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/5 pb-4">
        <div>
          <span className="font-sans text-[10px] font-bold text-black uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
            Interactive Visualizer — Essay 4
          </span>
          <h3 className="text-xl font-serif text-[#1A1A1A] mt-2 font-medium">
            Documentation Accuracy vs Agentic Success
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isTinkered ? (
            <button
              onClick={resetTinkering}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-[10px] font-sans font-bold uppercase tracking-wider rounded text-black transition-colors border border-black/10 cursor-pointer"
            >
              Reset Naming Debt
            </button>
          ) : (
            <button
              onClick={startRefactoringText}
              disabled={isRefactoring}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 disabled:opacity-50 text-[10px] font-sans font-bold uppercase tracking-wider text-white rounded shadow-sm transition-all cursor-pointer"
            >
              <Hammer className={`w-3.5 h-3.5 ${isRefactoring ? "animate-bounce" : ""}`} />
              {isRefactoring ? "HARMONIZING WORDS..." : "REFINE CODE METADATA (TINKER)"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Naming Debt File comparison (6 cols) */}
        <div className="lg:col-span-6 bg-white p-4 border border-black/5 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-3 border-dashed">
            <span className="text-[10px] uppercase font-sans font-bold text-[#1A1A1A]/60 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-black" />
              Source Explorer: `ingestion_helper.ts`
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveFile("api")}
                className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer ${
                  activeFile === "api" ? "bg-black text-white" : "bg-neutral-100 text-[#1A1A1A]/60 hover:bg-neutral-200"
                }`}
              >
                InboundAPI
              </button>
              <button
                onClick={() => setActiveFile("queue")}
                className={`text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer ${
                  activeFile === "queue" ? "bg-black text-white" : "bg-neutral-100 text-[#1A1A1A]/60 hover:bg-neutral-200"
                }`}
              >
                ActiveQueue
              </button>
            </div>
          </div>

          {/* Interactive Code Preview */}
          <div className="bg-[#111] border border-black/5 rounded p-3 font-mono text-[11px] leading-relaxed overflow-x-auto min-h-[140px] flex flex-col justify-between text-neutral-300">
            {activeFile === "api" ? (
              <div className="space-y-1 text-neutral-400">
                {isRefactoring ? (
                  <div className="text-amber-500 text-center py-6 animate-pulse">Running Docstring parser on continuous pipeline refactoring block...</div>
                ) : isTinkered ? (
                  <>
                    <div className="text-neutral-600">// Refactored semantic interfaces. Standardized unit: ActionRequest</div>
                    <div><span className="text-purple-400">interface</span> <span className="text-[#a3e635]">ActionRequest</span> &#123;</div>
                    <div className="pl-4">id: <span className="text-orange-400">string</span>;</div>
                    <div className="pl-4">payload: <span className="text-orange-400">Record</span>&lt;string, any&gt;;</div>
                    <div>&#125;</div>
                    <div className="mt-2"><span className="text-purple-400">function</span> <span className="text-[#a3e635]">handleActionRequest</span>(req: ActionRequest) &#123;</div>
                    <div className="pl-4"><span className="text-purple-400">return</span> processTaskPayload(req.payload);</div>
                    <div>&#125;</div>
                  </>
                ) : (
                  <>
                    <div className="text-neutral-600">// Debt: Confusing variable names using Job, Task, Action interchangeably</div>
                    <div><span className="text-purple-400">interface</span> <span className="text-amber-500 border-b border-dotted border-amber-500 cursor-help" onClick={() => setSelectedAmbiguity("Job")}>JobInterface</span> &#123;</div>
                    <div className="pl-4">actionId: <span className="text-orange-400">string</span>;</div>
                    <div className="pl-4">taskPayload: <span className="text-orange-400">any</span>;</div>
                    <div>&#125;</div>
                    <div className="mt-2"><span className="text-purple-400">function</span> <span className="text-amber-500 border-b border-dotted border-amber-500 cursor-help" onClick={() => setSelectedAmbiguity("handle")}>processInvocation</span>(jobData: JobInterface) &#123;</div>
                    <div className="pl-4"><span className="text-purple-400">return</span> compileSubTask(jobData.actionId);</div>
                    <div>&#125;</div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-1 text-neutral-400">
                {isRefactoring ? (
                  <div className="text-amber-500 text-center py-6 animate-pulse">Scanning terminology conflicts...</div>
                ) : isTinkered ? (
                  <>
                    <div className="text-neutral-600">// Standarized scheduler definitions. Unit: TaskExecution</div>
                    <div><span className="text-purple-400">type</span> <span className="text-[#a3e635]">TaskExecution</span> = &#123;</div>
                    <div className="pl-4">taskId: <span className="text-orange-400">string</span>;</div>
                    <div className="pl-4">queuePriority: <span className="text-orange-400">number</span>;</div>
                    <div>&#125;;</div>
                    <div className="mt-2"><span className="text-purple-400">const</span> queueWorker = (t: TaskExecution) =&gt; &#123;</div>
                    <div className="pl-4">runTaskExecutionCycle(t.taskId);</div>
                    <div>&#125;;</div>
                  </>
                ) : (
                  <>
                    <div className="text-neutral-600">// Mixed usage: Job and Task variables create massive model mismatch</div>
                    <div><span className="text-purple-400">type</span> <span className="text-amber-500 border-b border-dotted border-amber-500 cursor-help" onClick={() => setSelectedAmbiguity("Task")}>TaskItem</span> = &#123;</div>
                    <div className="pl-4">jobId: <span className="text-orange-400">string</span>;</div>
                    <div className="pl-4">invocationPriority: <span className="text-orange-400">number</span>;</div>
                    <div>&#125;;</div>
                    <div className="mt-2"><span className="text-purple-400">const</span> actionRunner = (task: TaskItem) =&gt; &#123;</div>
                    <div className="pl-4">triggerJobSequence(task.jobId);</div>
                    <div>&#125;;</div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Ambiguity card */}
          <div className="mt-3 bg-[#FAF9F5] p-2.5 border border-black/5 rounded text-[11px] font-sans select-none min-h-[50px] flex items-center">
            {selectedAmbiguity ? (
              <span className="text-amber-700 flex gap-1.5 items-start font-medium leading-relaxed">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                <span>
                  Ambiguity Alert: Code uses "{selectedAmbiguity}" and related terms interchangeably. The agent spends ~17% of its prompt scope aligning definitions.
                </span>
              </span>
            ) : isTinkered ? (
              <span className="text-emerald-700 font-bold flex gap-1.5 items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Continuous tinkering succeeded! Common vocabulary adopted.
              </span>
            ) : (
              <span className="text-black/50 font-serif italic flex gap-1.5 items-center">
                <Info className="w-3.5 h-3.5 text-black/30" />
                *Click on any dotted amber word above to analyze naming debt.
              </span>
            )}
          </div>
        </div>

        {/* Chart representation (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="bg-white border border-black/5 p-4 rounded-lg flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-black/50 mb-2.5 border-b border-black/5 pb-2 border-dashed">
              <span className="flex items-center gap-1.5 text-black">
                <TrendingUp className="w-3.5 h-3.5 text-black" />
                30-Day Simulated Impact Chart
              </span>
              <span>STATE: {isTinkered ? "TINKERED" : "DEBT INSTABILITY"}</span>
            </div>

            {/* Line chart widget */}
            <div className="relative h-[120px] bg-[#FAF9F5] rounded border border-black/10 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full absolute inset-0 text-neutral-300" viewBox="0 0 360 120" preserveAspectRatio="none">
                <line x1="180" y1="0" x2="180" y2="120" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Yellow lines: Documentation Accuracy */}
                <path
                  d={createSvgPath("docAccuracy")}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2"
                  className="transition-all duration-700 ease-in-out"
                />

                {/* Emerald line: Agent task success rate */}
                <path
                  d={createSvgPath("agentSuccess")}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-700 ease-in-out"
                />
              </svg>

              {/* Day 15 divider line label */}
              <div className="absolute left-[184px] top-1 text-[8px] font-sans font-bold text-black/40">
                Day 15 (Tinker Point)
              </div>

              {/* Legend boxes */}
              <div className="absolute right-2 bottom-2 flex gap-3 bg-white/90 border border-black/10 rounded px-1.5 py-1 text-[8px] font-sans font-bold uppercase tracking-wide">
                <div className="flex items-center gap-1 text-amber-600">
                  <span className="w-2 h-0.5 bg-amber-500 inline-block"></span>
                  Doc Accuracy
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-0.5 bg-emerald-500 inline-block"></span>
                  Agent Success
                </div>
              </div>
            </div>

            {/* Metrics block */}
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-black/5">
              <div className="bg-[#FAF9F5] py-2 px-3 border border-black/5 rounded flex flex-col">
                <span className="text-[9px] font-sans font-bold text-black/40 uppercase tracking-widest">
                  Documentation Precision
                </span>
                <span className="text-lg font-serif font-semibold text-amber-600 mt-0.5">
                  {isTinkered ? "94.2%" : "44.6%"}
                </span>
              </div>

              <div className="bg-[#FAF9F5] py-2 px-3 border border-black/5 rounded flex flex-col">
                <span className="text-[9px] font-sans font-bold text-black/40 uppercase tracking-widest">
                  Autonomous Success Rate
                </span>
                <span className="text-lg font-serif font-semibold text-emerald-600 mt-0.5">
                  {isTinkered ? "91.0%" : "48.2%"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
