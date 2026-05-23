import { useState, useEffect } from "react";
import { Play, RotateCcw, AlertCircle, CheckCircle2, GitBranch, Cpu, ArrowRight, Layers } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubTask {
  id: string;
  name: string;
  status: "idle" | "running" | "success" | "failed";
  details: string;
}

const INITIAL_SUBTASKS: SubTask[] = [
  { id: "1", name: "Parse High-level Intent", status: "idle", details: "Extract constraints & asynchronous queue patterns" },
  { id: "2", name: "Audit Existing Logic", status: "idle", details: "Analyze lock-reclamation and race conditions" },
  { id: "3", name: "Synthesize Patch Blocks", status: "idle", details: "Generate atomic lock reclaim mutations" },
  { id: "4", name: "Compile & Run Tests", status: "idle", details: "Execute test suite (42 unit tests, 12 integration)" },
  { id: "5", name: "Verify Performance", status: "idle", details: "Run automated cache benchmarks" },
];

export default function DelegationVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [subtasks, setSubtasks] = useState<SubTask[]>(INITIAL_SUBTASKS);
  const [benchmarkScore, setBenchmarkScore] = useState<number | null>(null);
  const [commits, setCommits] = useState<string[]>([]);
  const [intentInput, setIntentInput] = useState("Refactor stagnant locks on asynchronous DB queue worker");

  const runSimulation = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setBenchmarkScore(null);
    setCommits([]);
    setSubtasks(INITIAL_SUBTASKS.map(t => ({ ...t, status: "idle" })));

    const steps = [
      { index: 0, delay: 1200, status: "success" as const },
      { index: 1, delay: 1400, status: "success" as const },
      { index: 2, delay: 1600, status: "success" as const },
      { index: 3, delay: 1800, status: "success" as const },
      { index: 4, delay: 1500, status: "success" as const },
    ];

    for (const step of steps) {
      setCurrentStep(step.index);
      setSubtasks(prev =>
        prev.map((t, idx) => (idx === step.index ? { ...t, status: "running" } : t))
      );
      
      // Artificial delay for visual effect
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      setSubtasks(prev =>
        prev.map((t, idx) => (idx === step.index ? { ...t, status: step.status } : t))
      );
    }

    // Set final metrics
    setBenchmarkScore(14); // 14% improvement mentioned in the essay
    setCommits([
      "refactor(queue): optimize reclamation locking pattern",
      "test(queue): add regression suite for race conditions",
      "perf(queue): reduce mutex lock allocation cycles (+14.2% ops/sec)"
    ]);
    setIsRunning(false);
    setCurrentStep(-1);
  };

  const resetAll = () => {
    setIsRunning(false);
    setCurrentStep(-1);
    setSubtasks(INITIAL_SUBTASKS.map(t => ({ ...t, status: "idle" })));
    setBenchmarkScore(null);
    setCommits([]);
  };

  return (
    <div className="bg-neutral-50/50 border border-black/10 rounded-lg p-5 md:p-6 font-sans text-[#1A1A1A]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/5 pb-4">
        <div>
          <span className="font-sans text-[10px] font-bold text-black uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
            Interactive Visualizer — Essay 1
          </span>
          <h3 className="text-xl font-serif text-[#1A1A1A] mt-2 font-medium">
            Recursive Intent-to-Queue Mapper
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {commits.length > 0 || benchmarkScore !== null ? (
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-50 active:bg-neutral-100 text-[10px] font-sans font-bold uppercase tracking-wider rounded text-black transition-colors border border-black/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset State
            </button>
          ) : (
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/80 disabled:opacity-50 text-[10px] font-sans font-bold uppercase tracking-wider text-white rounded transition-all cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isRunning ? "DELEGATION ACTIVE..." : "TRIGGER DELEGATION LOOP"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-[10px] font-sans font-bold uppercase tracking-widest text-black/50 mb-2">
          High-Level Abstract Intent (Human Source)
        </label>
        <div className="relative">
          <input
            id="intent-input"
            type="text"
            value={intentInput}
            onChange={(e) => !isRunning && setIntentInput(e.target.value)}
            disabled={isRunning}
            className="w-full bg-white border border-black/15 text-xs py-2.5 px-3.5 rounded font-mono text-black focus:outline-none focus:border-black/40 focus:ring-1 focus:ring-black/10 disabled:opacity-60"
          />
          <span className="absolute right-3 top-3 flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-emerald-400' : 'bg-neutral-300'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isRunning ? 'bg-emerald-500' : 'bg-neutral-400'}`}></span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Subtask Mapping Process */}
        <div className="bg-white p-4 border border-black/5 rounded-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-black/5 pb-2.5 border-dashed">
            <Layers className="w-4 h-4 text-black/60" />
            <h4 className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-black/60">
              Recursive Execution Queue
            </h4>
          </div>

          <div className="space-y-3">
            {subtasks.map((task, idx) => {
              const isActive = idx === currentStep;
              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded border transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white border-black shadow-md shadow-black/10"
                      : "bg-white border-black/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[9px] w-5 h-5 flex items-center justify-center rounded-full ${
                        task.status === "success"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : isActive
                          ? "bg-white text-black font-semibold"
                          : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`text-xs font-sans font-medium ${isActive ? "text-white" : "text-[#1A1A1A]"}`}>
                        {task.name}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {task.status === "running" && (
                        <div className="flex gap-1.5 items-center">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                          </span>
                          <span className="text-[9px] font-sans font-bold text-emerald-400 uppercase tracking-widest animate-pulse">Running</span>
                        </div>
                      )}
                      {task.status === "success" && (
                        <span className="flex items-center gap-1 text-[9px] font-sans font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          COMPILE
                        </span>
                      )}
                      {task.status === "idle" && (
                        <span className="text-[9px] font-sans font-semibold text-black/30">IDLE</span>
                      )}
                    </div>
                  </div>
                  <p className={`text-[11px] mt-1 pl-8 font-serif leading-relaxed ${isActive ? "text-white/70" : "text-black/50"}`}>
                    {task.details}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Console & Outputs */}
        <div className="space-y-4">
          {/* Active Logs Console */}
          <div className="bg-[#111] border border-black/5 rounded-lg p-4 font-mono text-xs h-[180px] flex flex-col justify-between text-neutral-300">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 border-b border-white/5 pb-2 mb-2">
              <span className="uppercase tracking-wide flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-emerald-500" />
                Autonomous Agent Log
              </span>
              <span>4:32 AM</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 text-[11px] text-neutral-400 scrollbar-thin">
              {!isRunning && commits.length === 0 && (
                <div className="text-neutral-600 italic">No instructions triggered. Hit 'Trigger Delegation Loop' to start the autonomous agent pipeline.</div>
              )}
              {isRunning && (
                <>
                  <div className="text-neutral-500">&gt; Initializing delegator on thread pool #4...</div>
                  {currentStep >= 0 && <div className="text-indigo-400 animate-pulse">&gt; Active step: {subtasks[currentStep].name}...</div>}
                  {currentStep >= 1 && <div className="text-neutral-400">&gt; Comparing abstract intent graph metrics with lock reclamation rules...</div>}
                  {currentStep >= 2 && <div className="text-emerald-400/90">&gt; Lock leak analyzed: Mutex deadlock hazard detected in queue recovery sequence. Patching file: `db/queue_worker.ts`</div>}
                  {currentStep >= 3 && <div className="text-yellow-400/90">&gt; Mocking compilation layer: Running TypeScript syntax tree validation... OK.</div>}
                  {currentStep >= 4 && <div className="text-teal-400">&gt; Spawning benchmark child process... comparing against baseline cache hits...</div>}
                </>
              )}
              {!isRunning && commits.length > 0 && (
                <>
                  <div className="text-emerald-400">&gt; Delegation completed successfully. All 42 unit tests passed.</div>
                  <div className="text-neutral-500">&gt; Lock recovery cycles checked out without contention.</div>
                  <div className="text-neutral-300">&gt; Auto-wrote git snapshots to origin/main. System fully operational.</div>
                </>
              )}
            </div>

            <div className="border-t border-white/5 pt-2 text-[10px] text-neutral-500 flex justify-between">
              <span>SYSTEM: OK</span>
              <span>THREAD CLUSTERS active: {isRunning ? "5" : "0"}</span>
            </div>
          </div>

          {/* Results Block */}
          <AnimatePresence>
            {(benchmarkScore !== null || commits.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-black/10 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Metric Box */}
                  <div className="bg-neutral-50 p-3 rounded border border-black/5 flex flex-col justify-between">
                    <span className="text-[9px] font-sans uppercase text-black/50 tracking-wide font-bold">
                      Automated Performance Benchmark
                    </span>
                    <div className="my-2 flex items-baseline gap-2">
                      <span className="text-3xl font-serif text-emerald-600 font-semibold">
                        +{benchmarkScore}%
                      </span>
                      <span className="text-xs font-sans text-black/60 font-medium">
                        throughput ops/sec
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-sans flex items-center gap-1 mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Verification approved
                    </span>
                  </div>

                  {/* Git Output box */}
                  <div className="bg-neutral-50 p-3 rounded border border-black/5">
                    <span className="text-[9px] font-sans uppercase text-black/50 tracking-wide flex items-center gap-1 font-bold">
                      <GitBranch className="w-3 h-3 text-black/60" /> Autonomous Commits
                    </span>
                    <div className="mt-2 space-y-1.5">
                      {commits.map((commit, cIdx) => (
                        <div key={cIdx} className="text-[10px] font-mono text-black/70 flex items-center gap-1.5">
                          <ArrowRight className="w-2.5 h-2.5 text-black shrink-0" />
                          <span className="text-black/40 italic shrink-0">e6d{cIdx}bc</span>
                          <span className="truncate">{commit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
