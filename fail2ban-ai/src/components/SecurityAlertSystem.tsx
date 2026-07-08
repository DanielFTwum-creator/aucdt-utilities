import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, MapPin, Ban, X, AlertTriangle, Eye, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { getFlagEmoji } from "./IPTable";
import { useState, useEffect } from "react";

export interface HighRiskAlert {
  id: string;
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  jail: string;
  attackCount: number;
  isp?: string;
  timestamp: string;
  severity: "critical" | "high";
}

interface SecurityAlertSystemProps {
  alerts: HighRiskAlert[];
  onDismissAlert: (id: string) => void;
  onDismissAll: () => void;
  onLocate: (ip: string) => void;
  onBlock: (ip: string) => void;
  isPulsing: boolean;
  onTogglePulse: () => void;
}

export default function SecurityAlertSystem({
  alerts,
  onDismissAlert,
  onDismissAll,
  onLocate,
  onBlock,
  isPulsing,
  onTogglePulse,
}: SecurityAlertSystemProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Play a retro synth warning alert sound if sound is enabled and a new alert arrives
  useEffect(() => {
    if (alerts.length > 0 && soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Dynamic synth tone sequence (cybersecurity pulse)
        const playTone = (freq: number, start: number, duration: number, type: OscillatorType = "sine") => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc.type = type;
          osc.frequency.setValueAtTime(freq, start);
          
          gainNode.gain.setValueAtTime(0.15, start);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start(start);
          osc.stop(start + duration);
        };

        const now = audioCtx.currentTime;
        playTone(520, now, 0.15, "triangle");
        playTone(660, now + 0.1, 0.25, "sine");
      } catch (e) {
        console.warn("Audio Context blocked or unsupported:", e);
      }
    }
  }, [alerts.length, soundEnabled]);

  if (alerts.length === 0) return null;

  return (
    <>
      {/* 1. VISUAL VIEWPORT PULSING OVERLAY (Pulsing the browser window edges) */}
      {isPulsing && (
        <div 
          className="fixed inset-0 pointer-events-none z-[9999] border-[6px] border-red-500/40 shadow-[inset_0_0_80px_rgba(239,68,68,0.25)] animate-[pulse_2s_infinite]" 
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 2. PERSISTENT TOAST NOTIFICATIONS CONTAINER (Bottom-Right stacked layout) */}
      <div className="fixed bottom-6 right-6 z-[99999] w-full max-w-md flex flex-col gap-3 max-h-[80vh] overflow-y-auto select-none print:hidden scrollbar-none">
        
        {/* Header Summary Bar if multiple alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-zinc-950/95 border border-red-900/40 rounded-lg p-3.5 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
              <span className="font-sans font-bold text-xs text-white">
                Incident Response: {alerts.length} Threat{alerts.length > 1 ? "s" : ""} Flagged
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded border transition-all cursor-pointer ${
                soundEnabled
                  ? "bg-amber-950/30 text-amber-400 border-amber-900/40 hover:bg-amber-950/50"
                  : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
              }`}
              title={soundEnabled ? "Mute alert sound" : "Enable alert sound"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Pulsing Toggle */}
            <button
              onClick={onTogglePulse}
              className={`px-2 py-1 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                isPulsing
                  ? "bg-red-950/30 text-red-400 border-red-900/40 hover:bg-red-950/50"
                  : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300"
              }`}
              title="Toggle browser window border pulsing animation"
            >
              Pulse: {isPulsing ? "ON" : "OFF"}
            </button>

            {/* Dismiss All */}
            <button
              onClick={onDismissAll}
              className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all rounded font-sans text-[10px] font-medium cursor-pointer"
            >
              Dismiss All
            </button>
          </div>
        </motion.div>

        {/* Stacked Toasts */}
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`border rounded-lg shadow-2xl backdrop-blur-md overflow-hidden relative ${
                alert.severity === "critical"
                  ? "bg-red-950/20 border-red-900/50 shadow-red-950/10"
                  : "bg-amber-950/10 border-amber-900/40 shadow-amber-950/10"
              }`}
            >
              {/* Glowing side accent */}
              <div 
                className={`absolute top-0 bottom-0 left-0 w-1 ${
                  alert.severity === "critical" ? "bg-red-500" : "bg-amber-500"
                }`} 
              />

              <div className="p-4 pl-5">
                {/* Threat Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span 
                      className={`text-[9px] font-mono uppercase font-extrabold px-1.5 py-0.5 rounded border tracking-wider flex items-center gap-1 ${
                        alert.severity === "critical"
                          ? "text-red-400 border-red-800/40 bg-red-950/50 animate-pulse"
                          : "text-amber-400 border-amber-800/40 bg-amber-950/50"
                      }`}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {alert.severity === "critical" ? "CRITICAL INCIDENT" : "HIGH RISK VECTOR"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {alert.timestamp.split(" ")[1] || alert.timestamp}
                    </span>
                  </div>

                  {/* Close btn */}
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 p-1 rounded-md transition-all cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* IP and Geolocation details */}
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white font-mono tracking-tight flex items-center gap-2">
                    {alert.ip}
                    <span className="text-xs" role="img" aria-label="country-flag">
                      {getFlagEmoji(alert.countryCode)}
                    </span>
                  </h4>
                  
                  <div className="text-[11px] font-mono text-zinc-400 space-y-0.5 leading-snug">
                    <p className="flex items-center gap-1.5">
                      <span className="text-zinc-600">Location:</span> 
                      <span>{alert.city ? `${alert.city}, ` : ""}{alert.country}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="text-zinc-600">Jail Vector:</span>
                      <span className="text-amber-500 font-bold bg-amber-950/20 px-1 rounded border border-amber-950/30">
                        {alert.jail}
                      </span>
                    </p>
                    {alert.isp && (
                      <p className="truncate flex items-center gap-1.5">
                        <span className="text-zinc-600">Provider:</span>
                        <span className="text-zinc-400 truncate max-w-[280px]">{alert.isp}</span>
                      </p>
                    )}
                    <p className="flex items-center gap-1.5">
                      <span className="text-zinc-600">Attempt Count:</span>
                      <span className="text-red-400 font-bold">{alert.attackCount} malicious matches</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons inside Toast */}
                <div className="flex gap-2 mt-3.5 border-t border-zinc-900 pt-3">
                  <button
                    onClick={() => onLocate(alert.ip)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:text-white text-zinc-300 font-sans text-xs font-medium cursor-pointer transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    Locate Node
                  </button>
                  <button
                    onClick={() => onBlock(alert.ip)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-red-950/40 hover:bg-red-900 border border-red-800/40 hover:text-white text-red-400 font-sans text-xs font-bold cursor-pointer transition-all active:scale-95"
                  >
                    <Ban className="w-3.5 h-3.5 text-red-500" />
                    Deploy Block
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
