import { useMemo, useState } from "react";
import { IPData } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Calendar, BarChart3, ShieldAlert, Filter, ListCollapse, Play, Info, ExternalLink, HelpCircle } from "lucide-react";
import { getFlagEmoji } from "./IPTable";

interface ThreatTimelineProps {
  ipsData: IPData[];
  highlightedIp: string | null;
  onHighlightIp: (ip: string | null) => void;
}

// Map jails to visual tailwind classes and hex colors for the SVG chart
const JAIL_COLOR_MAP: Record<string, { label: string; bg: string; text: string; border: string; hex: string }> = {
  "ssh": { label: "SSH Brute-Force", bg: "bg-blue-950/40", text: "text-blue-400", border: "border-blue-900/30", hex: "#3b82f6" },
  "plesk-panel": { label: "Plesk Panel Login", bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-900/30", hex: "#10b981" },
  "plesk-postfix": { label: "SMTP / Postfix Spam", bg: "bg-amber-950/40", text: "text-amber-400", border: "border-amber-900/30", hex: "#f59e0b" },
  "plesk-modsecurity": { label: "WAF ModSecurity", bg: "bg-red-950/40", text: "text-red-400", border: "border-red-900/30", hex: "#ef4444" },
  "other": { label: "Other Protocol Breach", bg: "bg-purple-950/40", text: "text-purple-400", border: "border-purple-900/30", hex: "#a855f7" }
};

interface HourStats {
  hour: number;
  total: number;
  ssh: number;
  "plesk-panel": number;
  "plesk-postfix": number;
  "plesk-modsecurity": number;
  other: number;
}

export default function ThreatTimeline({ ipsData, highlightedIp, onHighlightIp }: ThreatTimelineProps) {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [timelineJailFilter, setTimelineJailFilter] = useState<string>("all");

  // Ensure every IP has a timestamp, sorting from oldest to newest
  const timelineData = useMemo(() => {
    const enriched = ipsData.map((ip, idx) => {
      if (ip.timestamp) return { ...ip, parsedDate: new Date(ip.timestamp.replace(" ", "T")) };
      
      // Distribute default IPs chronologically during 2026-07-03
      // Since there are ~21 items, let's space them starting from 2026-07-03 08:15:00 onwards
      const hour = Math.min(23, Math.floor(idx / 1.5) + 8);
      const min = (idx * 27) % 60;
      const sec = (idx * 13) % 60;
      const pad = (n: number) => n.toString().padStart(2, "0");
      
      const generatedTimestamp = `2026-07-03 ${pad(hour)}:${pad(min)}:${pad(sec)}`;
      return {
        ...ip,
        timestamp: generatedTimestamp,
        parsedDate: new Date(`2026-07-03T${pad(hour)}:${pad(min)}:${pad(sec)}`)
      };
    });

    // Sort chronologically (oldest first)
    return enriched.sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
  }, [ipsData]);

  // Group attacks into hourly intervals (0 to 23)
  const hourlyDistribution = useMemo(() => {
    // Initialize standard hourly structures
    const hours: Record<number, Record<string, number>> = {};
    for (let h = 0; h < 24; h++) {
      hours[h] = { total: 0, ssh: 0, "plesk-panel": 0, "plesk-postfix": 0, "plesk-modsecurity": 0, other: 0 };
    }

    timelineData.forEach(item => {
      const h = item.parsedDate.getHours();
      let jailType = item.jail || "other";
      if (!hours[h]) return; // Boundary guard
      
      if (!["ssh", "plesk-panel", "plesk-postfix", "plesk-modsecurity"].includes(jailType)) {
        jailType = "other";
      }

      hours[h][jailType]++;
      hours[h].total++;
    });

    return Object.entries(hours).map(([hourStr, counts]): HourStats => ({
      hour: parseInt(hourStr, 10),
      total: counts.total,
      ssh: counts.ssh,
      "plesk-panel": counts["plesk-panel"],
      "plesk-postfix": counts["plesk-postfix"],
      "plesk-modsecurity": counts["plesk-modsecurity"],
      other: counts.other
    }));
  }, [timelineData]);

  const maxHourCount = useMemo(() => {
    return Math.max(...hourlyDistribution.map(h => h.total), 4);
  }, [hourlyDistribution]);

  // List of unique jails in this dataset
  const availableJails = useMemo(() => {
    return Array.from(new Set(timelineData.map(ip => ip.jail).filter(Boolean)));
  }, [timelineData]);

  // Filtered timeline view items
  const filteredEvents = useMemo(() => {
    return timelineData.filter(ip => {
      // Hour filter
      if (selectedHour !== null) {
        if (ip.parsedDate.getHours() !== selectedHour) return false;
      }
      // Jail filter
      if (timelineJailFilter !== "all") {
        if (ip.jail !== timelineJailFilter) return false;
      }
      return true;
    });
  }, [timelineData, selectedHour, timelineJailFilter]);

  // Find spike hours to report as warning insights
  const attackSpikes = useMemo(() => {
    return hourlyDistribution
      .filter(h => h.total >= 3)
      .sort((a, b) => b.total - a.total);
  }, [hourlyDistribution]);

  const handleRowClick = (ip: string) => {
    onHighlightIp(highlightedIp === ip ? null : ip);
    
    // Smooth scroll to IP table row
    setTimeout(() => {
      const element = document.getElementById(`row-ip-${ip}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <div id="threat-timeline-section" className="bg-[#111] border border-zinc-800 p-6 rounded-lg mb-6">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-zinc-400" />
            Threat Timeline
            <span className="text-xs font-mono font-normal text-amber-500 border border-amber-900/30 bg-amber-950/20 px-2.5 py-0.5 rounded-full">
              Time Series Analysis
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Analyze chronologically coordinated attack waves, locate cluster bursts, and isolate suspicious activities over 24-hour cycles.
          </p>
        </div>

        {/* Legend filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-mono">Jail Filter:</span>
          </div>
          <button
            onClick={() => setTimelineJailFilter("all")}
            className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
              timelineJailFilter === "all"
                ? "bg-zinc-800 text-white border-zinc-700 font-medium"
                : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800"
            }`}
          >
            All Jails
          </button>
          {availableJails.map(jail => {
            const style = JAIL_COLOR_MAP[jail] || JAIL_COLOR_MAP.other;
            const isActive = timelineJailFilter === jail;
            return (
              <button
                key={jail}
                onClick={() => setTimelineJailFilter(jail)}
                className={`px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                  isActive
                    ? `${style.bg} ${style.text} ${style.border} font-semibold`
                    : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800"
                }`}
              >
                {jail}
              </button>
            );
          })}
        </div>
      </div>

      {/* Analytical Insights Banner */}
      {attackSpikes.length > 0 && (
        <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-lg mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-950/40 text-amber-500 border border-amber-900/40 rounded">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-zinc-200">Coordinated Attack Spikes Detected</h4>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                Critical volume density observed at{" "}
                <strong className="text-amber-400 font-mono">
                  {attackSpikes.map(s => `${s.hour.toString().padStart(2, "0")}:00`).slice(0, 3).join(", ")}
                </strong>
                . Coordinated bursts of concurrent intrusions typically indicate scripted multi-IP subnet probing or botnet scanner synchronization.
              </p>
            </div>
          </div>
          {selectedHour !== null && (
            <button
              onClick={() => setSelectedHour(null)}
              className="text-[11px] font-mono text-amber-500 hover:text-amber-400 border border-amber-900/30 hover:border-amber-900/60 bg-amber-950/20 px-2.5 py-1 rounded transition-all"
            >
              Clear Time Filter
            </button>
          )}
        </div>
      )}

      {/* Custom Responsive SVG Bar Chart */}
      <div className="bg-black/40 border border-zinc-900 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-300">Intrusions Logged Hourly (24h Distribution)</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">
            *Click bars to isolate time windows
          </span>
        </div>

        {/* SVG Container */}
        <div className="w-full overflow-x-auto scrollbar-thin">
          <div className="min-w-[640px] h-36">
            <svg viewBox="0 0 800 130" width="100%" height="100%" className="overflow-visible select-none">
              
              {/* Horizontal helper gridlines */}
              <line x1="40" y1="15" x2="780" y2="15" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="40" y1="55" x2="780" y2="55" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="40" y1="95" x2="780" y2="95" stroke="#222" strokeWidth="1" strokeDasharray="3,3" />
              
              {/* Vertical hours ticks */}
              {hourlyDistribution.map((h, i) => {
                const x = 40 + i * 31.5;
                const isSelected = selectedHour === h.hour;
                return (
                  <g key={`hour-grid-${i}`} className="opacity-40">
                    <line x1={x + 10} y1="10" x2={x + 10} y2="100" stroke="#161616" strokeWidth="1" />
                  </g>
                );
              })}

              {/* Y-Axis scale tags */}
              <text x="32" y="18" fill="#555" fontSize="8" fontFamily="monospace" textAnchor="end">{maxHourCount}</text>
              <text x="32" y="58" fill="#555" fontSize="8" fontFamily="monospace" textAnchor="end">{Math.round(maxHourCount / 2)}</text>
              <text x="32" y="98" fill="#555" fontSize="8" fontFamily="monospace" textAnchor="end">0</text>

              {/* Stacked bars for each hour */}
              {hourlyDistribution.map((h, i) => {
                const barWidth = 18;
                const x = 40 + i * 31.5;
                const chartHeight = 90; // scale space from y=10 to y=100
                const isSelected = selectedHour === h.hour;
                
                // Stack items
                const stack = [
                  { key: "ssh", val: h.ssh, color: JAIL_COLOR_MAP.ssh.hex },
                  { key: "plesk-panel", val: h["plesk-panel"], color: JAIL_COLOR_MAP["plesk-panel"].hex },
                  { key: "plesk-postfix", val: h["plesk-postfix"], color: JAIL_COLOR_MAP["plesk-postfix"].hex },
                  { key: "plesk-modsecurity", val: h["plesk-modsecurity"], color: JAIL_COLOR_MAP["plesk-modsecurity"].hex },
                  { key: "other", val: h.other, color: JAIL_COLOR_MAP.other.hex }
                ].filter(s => s.val > 0);

                let currentY = 100;
                
                return (
                  <g 
                    key={`bar-group-${i}`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedHour(selectedHour === h.hour ? null : h.hour)}
                  >
                    {/* Interactive Background selection pill */}
                    <rect
                      x={x + 1}
                      y="10"
                      width={barWidth + 18}
                      height="115"
                      fill={isSelected ? "rgba(245, 158, 11, 0.05)" : "transparent"}
                      className="group-hover:fill-zinc-800/20 transition-all duration-200 rounded"
                      rx="4"
                      transform={`translate(-9, -2)`}
                    />

                    {/* Stack segment renderer */}
                    {stack.map((seg, sIdx) => {
                      const segHeight = (seg.val / maxHourCount) * chartHeight;
                      const segmentY = currentY - segHeight;
                      currentY = segmentY; // stack higher

                      return (
                        <rect
                          key={`seg-${sIdx}`}
                          x={x}
                          y={segmentY}
                          width={barWidth}
                          height={segHeight}
                          fill={seg.color}
                          opacity={selectedHour !== null && !isSelected ? 0.2 : 0.85}
                          className="transition-all duration-300"
                          rx="1.5"
                        />
                      );
                    })}

                    {/* Invisible hover helper line showing volume popup above bar */}
                    {h.total > 0 && (
                      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <rect
                          x={x - 16}
                          y={currentY - 22}
                          width="50"
                          height="16"
                          fill="#18181b"
                          stroke="#27272a"
                          strokeWidth="1"
                          rx="3"
                        />
                        <text
                          x={x + 9}
                          y={currentY - 12}
                          fill="#fff"
                          fontSize="8"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {h.total} attack{h.total > 1 ? "s" : ""}
                        </text>
                      </g>
                    )}

                    {/* X-Axis Labels (Hour ticks) */}
                    <text
                      x={x + 9}
                      y="115"
                      fill={isSelected ? "#f59e0b" : h.total > 0 ? "#a1a1aa" : "#3f3f46"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isSelected || h.total > 0 ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {h.hour.toString().padStart(2, "0")}h
                    </text>
                  </g>
                );
              })}

              {/* Bottom solid baseline */}
              <line x1="40" y1="100" x2="780" y2="100" stroke="#27272a" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Legend pills for colors inside SVG chart */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4 pt-3 border-t border-zinc-900 text-[10px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-blue-500" />
            <span>SSH ({hourlyDistribution.reduce((acc, h) => acc + h.ssh, 0)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-emerald-500" />
            <span>Plesk Panel ({hourlyDistribution.reduce((acc, h) => acc + h["plesk-panel"], 0)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-amber-500" />
            <span>SMTP Postfix ({hourlyDistribution.reduce((acc, h) => acc + h["plesk-postfix"], 0)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-red-500" />
            <span>WAF ModSecurity ({hourlyDistribution.reduce((acc, h) => acc + h["plesk-modsecurity"], 0)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-purple-500" />
            <span>Other ({hourlyDistribution.reduce((acc, h) => acc + h.other, 0)})</span>
          </div>
        </div>
      </div>

      {/* List / Timeline Log Sequencer */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-300 font-mono">
            {selectedHour !== null ? `Time Interval [${selectedHour.toString().padStart(2, "0")}:00 - ${selectedHour.toString().padStart(2, "0")}:59]` : "Chronological Audit Log"}
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            ({filteredEvents.length} events found)
          </span>
        </div>
        
        {/* Reset filters shortcut button */}
        {(selectedHour !== null || timelineJailFilter !== "all") && (
          <button
            onClick={() => {
              setSelectedHour(null);
              setTimelineJailFilter("all");
            }}
            className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
          >
            <ListCollapse className="w-3 h-3" /> Reset all timeline filters
          </button>
        )}
      </div>

      {/* Main timeline listing with scrolling wrapper */}
      <div className="max-h-[380px] overflow-y-auto pr-2 space-y-3 relative scrollbar-thin">
        
        {/* Vertical visual axis line running behind items */}
        {filteredEvents.length > 1 && (
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-zinc-900 pointer-events-none" />
        )}

        <AnimatePresence mode="popLayout">
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 border border-dashed border-zinc-900 rounded-lg flex flex-col items-center justify-center text-zinc-500 font-mono text-xs text-center gap-2"
            >
              <HelpCircle className="w-5 h-5 text-zinc-600" />
              <span>No attack signatures matched current filters.</span>
              <button 
                onClick={() => { setSelectedHour(null); setTimelineJailFilter("all"); }}
                className="text-[10px] text-amber-500 underline mt-1"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            filteredEvents.map((item, index) => {
              const jailStyle = JAIL_COLOR_MAP[item.jail] || JAIL_COLOR_MAP.other;
              const isGlobalFocus = highlightedIp === item.ip;
              const formattedTime = item.timestamp 
                ? item.timestamp.substring(11, 19)
                : item.parsedDate.toLocaleTimeString();
              const formattedDate = item.timestamp
                ? item.timestamp.substring(5, 10).replace("-", "/")
                : "07/03";

              return (
                <motion.div
                  key={`timeline-row-${item.ip}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleRowClick(item.ip)}
                  className={`relative pl-12 pr-4 py-3 bg-zinc-950/40 rounded-lg border cursor-pointer select-none transition-all duration-300 ${
                    isGlobalFocus
                      ? "border-amber-500 bg-amber-950/10 shadow-lg shadow-amber-950/10 scale-[1.01]"
                      : "border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/40"
                  }`}
                >
                  {/* Outer circle axis node indicator */}
                  <div className="absolute left-[19px] top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-10">
                    <div 
                      className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                        isGlobalFocus 
                          ? "border-amber-500 bg-black animate-ping" 
                          : "bg-black"
                      }`}
                      style={{ borderColor: isGlobalFocus ? "#f59e0b" : jailStyle.hex }}
                    />
                    <div 
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isGlobalFocus ? "#f59e0b" : jailStyle.hex }}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    
                    {/* Timestamp, IP, flag */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      {/* Event timestamp pill */}
                      <span className="font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-600" />
                        {formattedDate} {formattedTime}
                      </span>

                      {/* IP address */}
                      <span className="font-mono text-zinc-100 font-semibold tracking-wide text-sm flex items-center gap-1">
                        {item.ip}
                        {isGlobalFocus && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-1" />
                        )}
                      </span>

                      {/* Flag and Geolocation text */}
                      <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1 bg-zinc-900/30 px-2 py-0.5 rounded border border-zinc-900">
                        <span>{getFlagEmoji(item.countryCode)}</span>
                        <span>{item.city || "Unknown"}, {item.country}</span>
                      </span>
                    </div>

                    {/* Jail Badge and Trigger focus buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 font-mono">
                      
                      {/* ISP / AS Number */}
                      {item.isp && (
                        <span className="hidden lg:inline text-[10px] text-zinc-600 truncate max-w-[150px]">
                          AS: {item.isp}
                        </span>
                      )}

                      {/* Protocol / Jail Name pill */}
                      <span className={`px-2 py-0.5 border rounded text-[10px] uppercase font-semibold ${jailStyle.bg} ${jailStyle.text} ${jailStyle.border}`}>
                        {item.jail}
                      </span>

                      {/* Click to locate focus text */}
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 group-hover:text-zinc-300">
                        <Play className={`w-2.5 h-2.5 fill-current ${isGlobalFocus ? "text-amber-500" : "text-zinc-600"}`} />
                        {isGlobalFocus ? "Focused" : "Focus"}
                      </span>
                    </div>
                  </div>

                  {/* Log snippet context notes under card */}
                  {item.note && (
                    <div className="mt-2 text-[11px] text-zinc-500 font-mono leading-relaxed border-t border-zinc-900/50 pt-1.5 flex items-start gap-1">
                      <span className="text-zinc-600">Context:</span>
                      <span className="text-zinc-400 italic">{item.note}</span>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
