import { useState } from "react";
import { Terminal, ShieldCheck, Zap, Power, Wifi, ShieldAlert } from "lucide-react";

interface TerminalLine {
  text: string;
  type: "info" | "success" | "warning" | "system";
  time: string;
}

export default function PortVisualizer() {
  const [agentState, setAgentState] = useState<"osmosing" | "decisive">("osmosing");
  const [isVerifying, setIsVerifying] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([
    { text: "System initialized. Container status IDLE.", type: "system", time: "11:51:02" },
    { text: "Agent status: OSMOSING (Passively absorbing background workspaces).", type: "info", time: "11:51:04" }
  ]);
  const [port3007Open, setPort3007Open] = useState(false);

  const getLogTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const verifyPorts = async () => {
    setIsVerifying(true);
    setPort3007Open(false);
    setAgentState("osmosing");
    
    const sequence = [
      { text: "Initiating Ingress Gateway interrogation sweep...", type: "system" as const, delay: 600 },
      { text: "Scanning docker-container interface bindings (0.0.0.0)...", type: "info" as const, delay: 800 },
      { text: "Port 3000: BOUND [Static Express server on host proxy]", type: "info" as const, delay: 900 },
      { text: "Port 5173: CLOSED [HMR socket layer disabled in build overrides]", type: "warning" as const, delay: 800 },
      { text: "Probing ingress route on local interface address :3007...", type: "system" as const, delay: 1000 },
      { text: "PORT 3007 IS WIDE OPEN. THE PLAN IS IN MOTION.", type: "success" as const, delay: 1100 },
      { text: "“Port 3007 is wide open. The plan is in motion. The agent is no longer osmosing. Good.”", type: "system" as const, delay: 1200 }
    ];

    setTerminalLines([
      { text: `Triggering immediate network interface re-verification on thread #12...`, type: "system", time: getLogTimestamp() }
    ]);

    for (const step of sequence) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      setTerminalLines(prev => [
        ...prev,
        { text: step.text, type: step.type, time: getLogTimestamp() }
      ]);
    }

    setPort3007Open(true);
    setAgentState("decisive");
    setIsVerifying(false);
  };

  return (
    <div className="bg-neutral-50/50 border border-black/10 rounded-lg p-5 md:p-6 font-sans text-[#1A1A1A]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-black/5 pb-4">
        <div>
          <span className="font-sans text-[10px] font-bold text-black uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded">
            Interactive Visualizer — Essay 5
          </span>
          <h3 className="text-xl font-serif text-[#1A1A1A] mt-2 font-medium">
            Port Binding Telemetry Console
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={verifyPorts}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-black/90 disabled:opacity-50 text-[10px] font-sans font-bold uppercase tracking-wider text-white rounded shadow-sm transition-all cursor-pointer"
          >
            <Terminal className={`w-3.5 h-3.5 ${isVerifying ? "animate-pulse" : ""}`} />
            {isVerifying ? "PROBING INGRESS SENSORS..." : "SCAN & BIND PORTS"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Terminal logs (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-black/5 rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[9px] font-sans font-bold uppercase tracking-wider text-black/50 mb-2.5 pb-2.5 border-b border-black/5 border-dashed">
            <span className="flex items-center gap-1.5 text-black">
              <Zap className="w-3.5 h-3.5 text-black" />
              Active Telemetry [Thread ID: localhost]
            </span>
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-[8px]">
              <span className={`w-2 h-2 rounded-full ${isVerifying ? "bg-amber-500 animate-ping" : port3007Open ? "bg-[#22d3ee] animate-pulse" : "bg-neutral-300"}`}></span>
              {isVerifying ? "SWEEPING" : port3007Open ? "ACTIVE PORT ACTIVE" : "IDLE"}
            </span>
          </div>

          <div className="bg-[#111] text-neutral-300 font-mono text-[11px] p-3 rounded h-[210px] overflow-y-auto space-y-1.5">
            {terminalLines.map((line, idx) => (
              <div key={idx} className="flex gap-2.5 items-start leading-relaxed">
                <span className="text-neutral-600 text-[10px] select-none shrink-0">{line.time}</span>
                <span className={
                  line.type === "success" 
                    ? "text-[#22d3ee] font-semibold" 
                    : line.type === "warning" 
                    ? "text-amber-400" 
                    : line.type === "system" 
                    ? "text-purple-400" 
                    : "text-neutral-400"
                }>
                  &gt; {line.text}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-black/50 font-sans tracking-wide font-medium mt-2.5 flex justify-between items-center. md:pl-1">
            <span>BINDING GATEWAY: 0.0.0.0</span>
            <span>PROXIABLE PORTS: 3000, 3007</span>
          </div>
        </div>

        {/* Port routing schema (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between space-y-4">
          {/* Agent Status Panel */}
          <div className="bg-white border border-black/10 p-4 rounded-lg">
            <span className="text-[9px] font-sans font-bold text-black/50 uppercase tracking-widest block mb-4 border-b border-black/5 pb-2 border-dashed">
              Agent Cognitive Mode
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded border text-center transition-all ${
                agentState === "osmosing"
                  ? "bg-[#FAF9F5] border-black text-black ring-4 ring-black/5"
                  : "bg-white border-black/5 opacity-40 text-black/40"
              }`}>
                <Power className={`w-5 h-5 mx-auto mb-1 text-black ${agentState === "osmosing" && "animate-pulse"}`} />
                <span className="text-xs font-sans font-bold uppercase tracking-wider block">OSMOSING</span>
                <span className="text-[9px] font-serif italic text-black/60">Passive Spectator</span>
              </div>

              <div className={`p-3 rounded border text-center transition-all ${
                agentState === "decisive"
                  ? "bg-black border-black text-white ring-4 ring-black/5"
                  : "bg-white border-black/5 opacity-40 text-black/40"
              }`}>
                <Wifi className={`w-5 h-5 mx-auto mb-1 text-white ${agentState === "decisive" && "animate-pulse"}`} />
                <span className="text-xs font-sans font-bold uppercase tracking-wider block text-white">DECISIVE</span>
                <span className="text-[9px] font-serif italic text-white/75">Active Agency</span>
              </div>
            </div>
          </div>

          {/* Network Ingress Map */}
          <div className="bg-white border border-black/10 p-4 rounded-lg flex-1 flex flex-col justify-between">
            <span className="text-[9px] font-sans font-bold text-black/50 uppercase tracking-widest block border-b border-black/5 pb-2 border-dashed mb-3">
              Container Ingress Routing
            </span>

            <div className="space-y-2.5">
              {/* Port 3000 */}
              <div className="flex justify-between items-center bg-[#FAF9F5] p-2 rounded border border-black/5">
                <span className="text-xs font-sans font-medium text-black/70">Port 3000 (Internal Web App)</span>
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-500/20">
                  BOUND
                </span>
              </div>

              {/* Port 3007 */}
              <div className="flex justify-between items-center bg-[#FAF9F5] p-2 rounded border border-black/5">
                <span className="text-xs font-sans font-medium text-black/70">Port 3007 (Agent Action Plane)</span>
                {port3007Open ? (
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 bg-[#e0f7fa] text-[#006064] rounded border border-[#00acc1]/20 animate-pulse">
                    WIDE OPEN
                  </span>
                ) : (
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider px-1.5 py-0.5 bg-neutral-100 text-black/40 rounded border border-black/5">
                    BLOCKED
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
