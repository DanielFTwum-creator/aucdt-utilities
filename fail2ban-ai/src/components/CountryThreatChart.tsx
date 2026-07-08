import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { IPData, getIpAttackCount } from "../types";
import { getFlagEmoji } from "./IPTable";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Shield, Activity, ListFilter, AlertCircle } from "lucide-react";

interface CountryThreatChartProps {
  ipsData: IPData[];
  onHighlightIp?: (ip: string | null) => void;
}

// Visual color palette for top attacking countries
const COLORS = [
  "#ef4444", // Crimson Red (Top 1)
  "#f97316", // Vibrant Orange (Top 2)
  "#f59e0b", // Amber/Yellow (Top 3)
  "#3b82f6", // Electric Blue (Top 4)
  "#06b6d4", // Cyan (Top 5)
  "#8b5cf6", // Purple (Others)
];

const JAIL_LABELS: Record<string, string> = {
  ssh: "SSH",
  "plesk-panel": "Plesk Panel",
  "plesk-postfix": "Postfix",
  "plesk-modsecurity": "ModSec WAF",
  recidive: "Recidive",
};

export default function CountryThreatChart({ ipsData, onHighlightIp }: CountryThreatChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Process data to aggregate by country
  const chartData = useMemo(() => {
    const countryCounts: Record<
      string,
      {
        name: string;
        code: string;
        count: number;
        attacks: number;
        jails: Record<string, number>;
        sampleIps: string[];
      }
    > = {};

    ipsData.forEach((ip) => {
      if (ip.status === "success" && ip.country) {
        if (!countryCounts[ip.countryCode]) {
          countryCounts[ip.countryCode] = {
            name: ip.country,
            code: ip.countryCode,
            count: 0,
            attacks: 0,
            jails: {},
            sampleIps: [],
          };
        }
        countryCounts[ip.countryCode].count += 1;
        countryCounts[ip.countryCode].attacks += getIpAttackCount(ip.ip);
        countryCounts[ip.countryCode].jails[ip.jail] = (countryCounts[ip.countryCode].jails[ip.jail] || 0) + 1;
        if (countryCounts[ip.countryCode].sampleIps.length < 3) {
          countryCounts[ip.countryCode].sampleIps.push(ip.ip);
        }
      }
    });

    const sortedList = Object.values(countryCounts).sort((a, b) => b.count - a.count);

    const top5 = sortedList.slice(0, 5);
    const others = sortedList.slice(5);

    const result = top5.map((country, idx) => {
      // Find top jail
      let topJail = "other";
      let topJailCount = 0;
      Object.entries(country.jails).forEach(([jail, count]) => {
        if (count > topJailCount) {
          topJailCount = count;
          topJail = jail;
        }
      });

      return {
        name: country.name,
        code: country.code,
        value: country.count, // Pie uses the count of blocked IPs
        attacks: country.attacks,
        topJail: JAIL_LABELS[topJail] || topJail,
        color: COLORS[idx],
        sampleIps: country.sampleIps,
      };
    });

    if (others.length > 0) {
      const othersCount = others.reduce((sum, c) => sum + c.count, 0);
      const othersAttacks = others.reduce((sum, c) => sum + c.attacks, 0);
      
      // Aggregate other jails
      const otherJails: Record<string, number> = {};
      others.forEach(c => {
        Object.entries(c.jails).forEach(([j, count]) => {
          otherJails[j] = (otherJails[j] || 0) + count;
        });
      });

      let topOtherJail = "other";
      let topOtherJailCount = 0;
      Object.entries(otherJails).forEach(([jail, count]) => {
        if (count > topOtherJailCount) {
          topOtherJailCount = count;
          topOtherJail = jail;
        }
      });

      result.push({
        name: "Others",
        code: "OTHER",
        value: othersCount,
        attacks: othersAttacks,
        topJail: JAIL_LABELS[topOtherJail] || topOtherJail,
        color: COLORS[5],
        sampleIps: others.flatMap(c => c.sampleIps).slice(0, 3),
      });
    }

    return result;
  }, [ipsData]);

  const totalBans = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.value, 0);
  }, [chartData]);

  const totalAttacks = useMemo(() => {
    return chartData.reduce((sum, d) => sum + d.attacks, 0);
  }, [chartData]);

  // Info to display in the center of the donut chart
  const centerDisplay = useMemo(() => {
    if (activeIndex !== null && chartData[activeIndex]) {
      const active = chartData[activeIndex];
      const pct = totalBans > 0 ? (active.value / totalBans) * 100 : 0;
      return {
        label: active.name === "Others" ? "OTHER REGS" : active.code,
        flag: active.name === "Others" ? "🌐" : getFlagEmoji(active.code),
        value: `${active.value} IPs`,
        subText: `${pct.toFixed(1)}% of bans`,
        color: active.color,
      };
    }

    return {
      label: "TOTAL GEOS",
      flag: "🛡️",
      value: `${totalBans} IPs`,
      subText: `${totalAttacks} total logs`,
      color: "#a1a1aa", // text-zinc-400
    };
  }, [activeIndex, chartData, totalBans, totalAttacks]);

  if (chartData.length === 0) {
    return (
      <div className="bg-[#0c0c0e] border border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px] text-center mb-6">
        <AlertCircle className="w-10 h-10 text-zinc-500 mb-3 animate-pulse" />
        <h4 className="text-sm font-semibold text-zinc-300 font-sans">No Geolocated Sources Detected</h4>
        <p className="text-xs text-zinc-500 font-mono mt-1 max-w-sm">
          Please parse a log file or enter geolocated IP addresses to visualize country threat concentration.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0c0e] border border-zinc-800 rounded-lg p-5 mb-6 shadow-xl relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Country Threat Distribution
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Top attack origin vectors with integrated geolocation density
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-950 border border-zinc-900 rounded font-mono text-[10px] text-zinc-400">
          <Activity className="w-3 h-3 text-red-500 animate-pulse" />
          <span>Real-time Breakdown</span>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Recharts Pie Chart in Donut form */}
        <div className="lg:col-span-5 flex justify-center relative min-h-[220px]">
          <div className="w-[200px] h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  cursor="pointer"
                  animationDuration={700}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#0c0c0e"
                      strokeWidth={2}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                      className="transition-all duration-300 outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-950/95 border border-zinc-800 p-2.5 rounded-lg shadow-2xl font-mono text-[10px] text-zinc-300 space-y-1 backdrop-blur-sm z-50">
                          <div className="flex items-center gap-1.5 font-sans font-bold text-white text-xs">
                            <span>{data.name !== "Others" ? getFlagEmoji(data.code) : "🌐"}</span>
                            <span>{data.name}</span>
                          </div>
                          <div>Banned Hosts: <span className="text-white font-bold">{data.value}</span></div>
                          <div>Total Logs: <span className="text-amber-400 font-bold">{data.attacks}</span></div>
                          <div>Primary Vector: <span className="text-emerald-400">{data.topJail}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Absolute Centered Stats Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
              <span className="text-lg mb-0.5" role="img" aria-label="Center Icon">
                {centerDisplay.flag}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                {centerDisplay.label}
              </span>
              <span className="text-lg font-extrabold text-white font-sans mt-0.5 tracking-tight">
                {centerDisplay.value}
              </span>
              <span className="text-[10px] font-mono mt-0.5" style={{ color: centerDisplay.color }}>
                {centerDisplay.subText}
              </span>
            </div>
          </div>
        </div>

        {/* List of countries with metric bars */}
        <div className="lg:col-span-7 space-y-3.5">
          {chartData.map((country, index) => {
            const percentage = totalBans > 0 ? (country.value / totalBans) * 100 : 0;
            const isHovered = activeIndex === index;

            return (
              <div
                key={country.code}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => {
                  if (country.sampleIps && country.sampleIps.length > 0 && onHighlightIp) {
                    onHighlightIp(country.sampleIps[0]);
                  }
                }}
                className={`p-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? "bg-zinc-900/40 border-zinc-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.5)] scale-[1.01]"
                    : "bg-zinc-950/35 border-zinc-900/60 hover:border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">
                      {country.name === "Others" ? "🌐" : getFlagEmoji(country.code)}
                    </span>
                    <span className="font-sans font-semibold text-zinc-200 group-hover:text-white">
                      {country.name}
                    </span>
                    {country.name !== "Others" && (
                      <span className="font-mono text-[9px] text-zinc-500 font-semibold bg-zinc-900 px-1 rounded border border-zinc-800">
                        {country.code}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-400 font-medium text-[11px]">
                      {country.value} {country.value === 1 ? "IP" : "IPs"} ({percentage.toFixed(0)}%)
                    </span>
                    <span
                      className="text-[9px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border"
                      style={{
                        color: country.color,
                        borderColor: `${country.color}33`,
                        backgroundColor: `${country.color}0d`,
                      }}
                    >
                      {country.topJail}
                    </span>
                  </div>
                </div>

                {/* Progressive Bar */}
                <div className="w-full h-1.5 bg-zinc-900/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: country.color,
                      boxShadow: isHovered ? `0 0 6px ${country.color}` : "none",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
