import React, { useState } from "react";
import { Terminal, Shield, RefreshCw, Radio, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

export default function TelemetryConsole() {
  const [targetPort, setTargetPort] = useState(3007);
  const [logs, setLogs] = useState<string[]>([
    "[READY] Device telemetry waiting. Bind port to begin scanning diagnostics.",
    "[READY] Port 3007 is configured as standard agentic listener."
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "ACTIVE" | "INACTIVE">("IDLE");

  const runVerification = async (portToTest: number) => {
    setIsVerifying(true);
    setStatus("IDLE");
    setLogs((prev) => [
      ...prev,
      `[INIT] Launching verification request for port ${portToTest}...`,
    ]);

    try {
      const response = await fetch("/api/verify-port", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ port: portToTest }),
      });
      const data = await response.json();

      if (data.success) {
        setStatus("ACTIVE");
      } else {
        setStatus("INACTIVE");
      }

      // Simulate a small typing latency cascade for the terminal lines
      if (data.logs && Array.isArray(data.logs)) {
        let currentIdx = 0;
        const interval = setInterval(() => {
          if (currentIdx < data.logs.length) {
            setLogs((prev) => [...prev, data.logs[currentIdx]]);
            currentIdx++;
          } else {
            clearInterval(interval);
            setIsVerifying(false);
          }
        }, 300);
      } else {
        setIsVerifying(false);
      }
    } catch (err: any) {
      setLogs((prev) => [...prev, `[ERROR] Failed to query routing service: ${err.message}`]);
      setIsVerifying(false);
      setStatus("INACTIVE");
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 text-zinc-100 shadow-xl overflow-hidden font-mono text-xs select-none">
      {/* Console Topbar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4 text-zinc-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-zinc-300 font-display">Port Ingress Telemetry Console</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Verification Controls Component */}
        <div className="md:col-span-1 bg-zinc-950/60 p-4 border border-zinc-800/60 rounded flex flex-col space-y-4">
          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-zinc-500" /> Boundary Interface
            </h4>
            <p className="text-[11px] text-zinc-500 leading-normal mb-3">
              Configure and trace port listeners matching Part 5's active boundaries.
            </p>
          </div>

          <div>
            <label className="text-[10px] text-zinc-455 block mb-1">Target Gate (Port)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={targetPort}
                onChange={(e) => setTargetPort(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700/60 rounded px-2 py-1 w-full text-zinc-200 focus:outline-none focus:border-amber-500 font-semibold text-center"
                disabled={isVerifying}
              />
              <button
                onClick={() => setTargetPort(3007)}
                className="border border-zinc-700/60 hover:bg-zinc-900 rounded px-2 py-1 text-[10px]"
                disabled={isVerifying}
              >
                Reset
              </button>
            </div>
          </div>

          <button
            onClick={() => runVerification(targetPort)}
            disabled={isVerifying}
            className={`w-full py-2 rounded text-xs font-semibold cursor-pointer border tracking-wider transition-all duration-305 flex items-center justify-center space-x-2 ${
              isVerifying
                ? "bg-zinc-800 border-zinc-700 text-zinc-500"
                : "bg-amber-600 border-amber-650 hover:bg-amber-500 text-zinc-950 hover:scale-[1.01]"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
            <span>{isVerifying ? "PROBING INGRESS..." : "CHECK GATE CONNECTION"}</span>
          </button>

          {/* Quick status box */}
          <div className="pt-3 border-t border-zinc-805 text-center">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">Gate Alignment State</span>
            {status === "ACTIVE" ? (
              <span className="text-emerald-450 font-bold flex items-center justify-center gap-1 text-sm bg-emerald-950/30 py-1.5 rounded border border-emerald-900/40">
                <CheckCircle className="w-4 h-4 animate-pulse" /> WIDE OPEN
              </span>
            ) : status === "INACTIVE" ? (
              <span className="text-red-400 font-bold flex items-center justify-center gap-1 text-sm bg-red-950/30 py-1.5 rounded border border-red-900/40">
                <AlertTriangle className="w-4 h-4" /> CLOSED / INACTIVE
              </span>
            ) : (
              <span className="text-zinc-500 font-bold flex items-center justify-center gap-1 text-sm bg-zinc-900/50 py-1.5 rounded border border-zinc-800/40">
                <Radio className="w-4 h-4" /> IDLE / PASSIVE
              </span>
            )}
          </div>
        </div>

        {/* Console Log Component */}
        <div className="md:col-span-2 flex flex-col justify-between bg-black/55 rounded border border-zinc-800/50 p-4 h-[240px] relative">
          <div className="flex-1 overflow-y-auto space-y-2 select-text font-mono text-[11px] leading-relaxed pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {logs.map((log, index) => {
              if (typeof log !== "string") return null;
              let textClass = "text-zinc-350";
              if (log.includes("[ERROR]")) textClass = "text-red-400 font-semibold";
              if (log.includes("SUCCESS")) textClass = "text-emerald-400 font-semibold";
              if (log.includes("ACTIVE")) textClass = "text-amber-400 font-bold";
              if (log.includes("[INIT]")) textClass = "text-amber-500/80";
              if (log.includes("[SYS]")) textClass = "text-zinc-400";
              if (log.includes("[READY]")) textClass = "text-zinc-500 italic";
              
              return (
                <div key={index} className={`flex items-start space-x-1.5 ${textClass}`}>
                  <span className="text-[10px] opacity-40 select-none">$&gt;</span>
                  <span>{log}</span>
                </div>
              );
            })}
          </div>
          
          <div className="text-[9px] text-zinc-500 flex items-center justify-between pt-2 border-t border-zinc-900 mt-2 select-none">
            <span>TERMINAL SES_ID: DM-3007-TRACE</span>
            <button
              onClick={() => setLogs(["[CONSOLE CLEARED] Ready."])}
              className="hover:text-zinc-300 transition-colors"
            >
              Clear screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
