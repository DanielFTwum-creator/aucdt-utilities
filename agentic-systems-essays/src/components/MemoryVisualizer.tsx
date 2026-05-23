import { useState } from "react";
import { Compass, Info, Orbit, Search, Target } from "lucide-react";
import { motion } from "motion/react";

interface DatabaseNode {
  id: string;
  label: string;
  category: "Issue ticket" | "Slack message" | "Commit history" | "Architectural ghost";
  x: number;
  y: number;
  details: string;
  date: string;
}

const MEMORY_NODES: DatabaseNode[] = [
  {
    id: "N1",
    label: "Issue #412: Ingestion depletion on peak days",
    category: "Issue ticket",
    x: 120,
    y: 75,
    details: "Uncontrolled memory climbing during high-frequency ingestion cycles. Nodes crash every 12 hours.",
    date: "Aug 12, 2018"
  },
  {
    id: "N2",
    label: "Slack: 'Alice mentioned active socket leaks' (2018)",
    category: "Slack message",
    x: 140,
    y: 90,
    details: "@alice: 'Turned off active socket caching because we are bleeding handles under pressure. Do not turn back on!'",
    date: "Oct 19, 2018"
  },
  {
    id: "N3",
    label: "Commit v1.0.8: 'Disable socket handles caching'",
    category: "Commit history",
    x: 110,
    y: 110,
    details: "Author: Alice S. - Removing cache allocation structure. Hotfix to resolve node pool outages.",
    date: "Oct 20, 2018"
  },
  {
    id: "N4",
    label: "Wiki: Ingest worker design guidelines",
    category: "Architectural ghost",
    x: 280,
    y: 160,
    details: "Stipulates standard connection pooling but silent on socket caching details.",
    date: "Jan 15, 2019"
  },
  {
    id: "N5",
    label: "Issue #904: Unbound socket leak warning",
    category: "Issue ticket",
    x: 160,
    y: 125,
    details: "TCP sockets left in TIME_WAIT state, preventing worker nodes from opening outbound queues on port 8080.",
    date: "Nov 03, 2018"
  }
];

export default function MemoryVisualizer() {
  const [selectedNode, setSelectedNode] = useState<DatabaseNode | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [currentDistanceThreshold, setCurrentDistanceThreshold] = useState(0.85);
  const [traceOutput, setTraceOutput] = useState<string | null>(null);

  const performVectorTrace = () => {
    setIsTracing(true);
    setTraceOutput(null);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 20) {
        clearInterval(interval);
        setIsTracing(false);
        setTraceOutput(
          "SUCCESS: Rebuilt unwritten architectural logic. Alice disabled active socket caching in Oct 2018 because the underlying Node handles did not release during rapid connection cycling, triggering systemic handle depletion and memory leaks of 2MB/sec. Active socket caching remains a regression hazard."
        );
      }
    }, 70);
  };

  return (
    <div className="bg-neutral-50/50 border border-black/10 rounded-lg p-5 md:p-6 font-sans text-[#1A1A1A]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/5 pb-4">
        <div>
          <span className="font-sans text-[10px] font-bold text-black uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
            Interactive Visualizer — Essay 3
          </span>
          <h3 className="text-xl font-serif text-[#1A1A1A] mt-2 font-medium">
            Vector Semantic Coordinate Trace
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={performVectorTrace}
            disabled={isTracing}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 disabled:opacity-50 text-[10px] font-sans font-bold uppercase tracking-wider text-white rounded shadow-sm transition-all cursor-pointer"
          >
            <Compass className={`w-3.5 h-3.5 ${isTracing ? "animate-spin" : ""}`} />
            {isTracing ? "PROBING EMBEDDINGS..." : "RUN ARCHITECTURAL MEMORY TRACE"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Latent space chart representation (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-black/5 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-black/50 mb-2.5">
            <span className="flex items-center gap-1.5 text-black">
              <Orbit className="w-3.5 h-3.5 text-black" />
              Embeddings Mapping (Vector Space 2D)
            </span>
            <span>COSINE SIMILARITY GAP</span>
          </div>

          {/* Map canvas */}
          <div className="relative h-[240px] bg-[#FAF9F5] border border-black/10 rounded overflow-hidden flex items-center justify-center">
            {/* Background grid representation */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-50">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border-t border-l border-black/5"></div>
              ))}
            </div>

            {/* Trace lines link them */}
            {isTracing && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="120" y1="75" x2="140" y2="90" stroke="#1A1A1A" strokeWidth="1.5" className="animate-pulse" />
                <line x1="140" y1="90" x2="110" y2="110" stroke="#1A1A1A" strokeWidth="1.5" className="animate-pulse" />
                <line x1="110" y1="110" x2="160" y2="125" stroke="#1A1A1A" strokeWidth="1.5" className="animate-pulse" />
                
                {/* Scan radius ring */}
                <circle cx="130" cy="100" r="50" fill="none" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="3 3" className="animate-ping" />
              </svg>
            )}

            {/* Interactive Vector Nodes */}
            {MEMORY_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="absolute p-1 group z-10 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                >
                  <div className={`relative flex items-center justify-center rounded-full transition-all ${
                    isSelected 
                      ? "h-4 w-4 bg-[#1A1A1A] ring-4 ring-black/10" 
                      : "h-3.5 w-3.5 bg-neutral-200 border-2 hover:bg-neutral-400 border-neutral-300"
                  }`}>
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all font-sans text-[8px] font-bold uppercase tracking-wider bg-[#1A1A1A] border border-[#1A1A1A] text-white px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-20">
                      {node.category}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Highlighted core cluster bound circles */}
            <div className="absolute left-[85px] top-[50px] w-[110px] h-[110px] border border-dashed border-black/20 bg-black/5 rounded-full pointer-events-none flex items-center justify-center">
              <span className="text-[8px] font-sans font-bold text-black/50 uppercase tracking-widest absolute -bottom-5">
                Target Cluster (Legacy Bug)
              </span>
            </div>

            <div className="absolute bottom-2 left-2 text-[8px] font-sans font-bold text-neutral-400">X-Dim: Semantic Distance</div>
            <div className="absolute top-2 right-2 text-[8px] font-sans font-bold text-neutral-400 text-right">Y-Dim: Time Correlation</div>
          </div>

          <div className="text-[10px] text-[#1A1A1A]/50 font-serif mt-2 italic. md:pl-1">
            *Click the dot nodes on the grid workspace to extract architectural legacy telemetry.
          </div>
        </div>

        {/* Node detail and decoded memory logs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Selected Node card */}
          <div className="bg-white border border-black/10 p-4 rounded-lg flex-1">
            <div className="flex items-center gap-1.5 text-[9px] font-sans font-bold uppercase tracking-widest text-[#1A1A1A]/60 border-b border-black/5 pb-2 mb-3">
              <Target className="w-3.5 h-3.5 text-black" />
              Source Node details
            </div>

            {selectedNode ? (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-sans font-bold px-2 py-0.5 bg-black/5 text-[#1A1A1A] border border-black/10 rounded">
                    {selectedNode.category}
                  </span>
                  <span className="text-[9px] font-mono text-[#1A1A1A]/40">{selectedNode.date}</span>
                </div>
                <h4 className="text-xs font-sans font-bold text-[#1A1A1A] mt-1">
                  {selectedNode.label}
                </h4>
                <p className="text-xs font-serif text-black/60 leading-relaxed bg-[#FAF9F5] p-2.5 rounded border border-black/5">
                  {selectedNode.details}
                </p>
              </div>
            ) : (
              <div className="text-black/40 text-xs italic py-6 text-center flex flex-col items-center justify-center font-serif">
                <Info className="w-5 h-5 text-neutral-300 mb-2" />
                Select a coordinate node in the vector space model chart to extract architectural evidence.
              </div>
            )}
          </div>

          {/* Trace Results */}
          <div className="bg-[#111] border border-black/5 p-4 rounded-lg min-h-[110px] flex flex-col justify-between text-neutral-300">
            <div className="text-[9px] font-sans uppercase text-indigo-400 font-bold tracking-wider flex items-center justify-between border-b border-white/5 pb-1.5 mb-2">
              <span className="flex items-center gap-1">
                <Search className="w-3 h-3 text-indigo-400" /> Decoded Unwritten context
              </span>
              <span>TEST: {traceOutput ? "RESOLVED" : "PENDING"}</span>
            </div>

            {traceOutput ? (
              <p className="text-[11px] font-mono text-emerald-400 leading-relaxed animate-fade-in">
                {traceOutput}
              </p>
            ) : isTracing ? (
              <div className="text-xs font-mono text-neutral-400 flex items-center justify-center gap-2 py-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Rebuilding memory bridges...
              </div>
            ) : (
              <p className="text-[11px] font-mono text-neutral-500 italic">
                System memory status: Decoupled. Trigger trace sequence to crawl legacy artifacts and reconstruct context.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
