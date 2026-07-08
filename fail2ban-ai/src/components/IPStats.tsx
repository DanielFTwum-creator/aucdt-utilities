import { useState, useMemo } from "react";
import { ShieldAlert, Globe, AlertOctagon, Layers, X, TrendingUp, Network, MapPin, Activity, HelpCircle, Shield, CheckCircle } from "lucide-react";
import { MapStats, IPData } from "../types";
import { getFlagEmoji } from "./IPTable";
import { motion, AnimatePresence } from "motion/react";

interface IPStatsProps {
  stats: MapStats;
  ipsData: IPData[];
}

// Friendly descriptions for known Fail2Ban Jails
const JAIL_PROFILES: Record<string, { title: string; desc: string; severity: "critical" | "warning" | "info" }> = {
  ssh: {
    title: "Secure Shell (SSH)",
    desc: "Unauthorized brute-force attempts targeting port 22/SSH authentication services.",
    severity: "critical",
  },
  "plesk-panel": {
    title: "Plesk Control Panel",
    desc: "Login cracking attempts directed at Plesk hosting administration interfaces.",
    severity: "critical",
  },
  "plesk-postfix": {
    title: "Mail Server (Postfix/MTA)",
    desc: "Spam relay probing, mail-server abuse, or SMTP auth brute forcing.",
    severity: "warning",
  },
  "plesk-modsecurity": {
    title: "ModSecurity WAF",
    desc: "Web application firewall rule triggers, SQL injection, XSS, or path traversal.",
    severity: "critical",
  },
  recidive: {
    title: "Recidive (Repeat Offender)",
    desc: "Persistent attackers repeatedly banned across other jails. High threat level.",
    severity: "critical",
  },
};

export default function IPStats({ stats, ipsData = [] }: IPStatsProps) {
  const [selectedTab, setSelectedTab] = useState<"banned" | "countries" | "origin" | "jails" | null>(null);

  const formatJailList = (breakdown: Record<string, number>) => {
    return Object.entries(breakdown)
      .map(([jail, count]) => `${jail} (${count})`)
      .join(" - ");
  };

  const jailDetailsString = useMemo(() => formatJailList(stats.jailBreakdown), [stats.jailBreakdown]);

  // Dynamic calculations based on current ipsData
  const aggregations = useMemo(() => {
    const isps: Record<string, number> = {};
    const countriesBreakdown: Record<string, { name: string; code: string; count: number; jails: Record<string, number> }> = {};
    const cityBreakdown: Record<string, number> = {};

    ipsData.forEach(ip => {
      // ISP aggregation
      if (ip.status === "success" && ip.isp) {
        isps[ip.isp] = (isps[ip.isp] || 0) + 1;
      }
      
      // Country aggregation
      if (ip.status === "success" && ip.country) {
        if (!countriesBreakdown[ip.country]) {
          countriesBreakdown[ip.country] = {
            name: ip.country,
            code: ip.countryCode,
            count: 0,
            jails: {},
          };
        }
        countriesBreakdown[ip.country].count += 1;
        countriesBreakdown[ip.country].jails[ip.jail] = (countriesBreakdown[ip.country].jails[ip.jail] || 0) + 1;
      }

      // City aggregation (within top country or in general)
      if (ip.status === "success" && ip.city) {
        cityBreakdown[ip.city] = (cityBreakdown[ip.city] || 0) + 1;
      }
    });

    // Sort ISPs by count
    const topIsps = Object.entries(isps)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Sort Countries by count
    const topCountriesList = Object.values(countriesBreakdown)
      .sort((a, b) => b.count - a.count);

    return {
      topIsps,
      topCountriesList,
      cityBreakdown
    };
  }, [ipsData]);

  // Aggregation helper for Top Origin country deep-dive
  const topCountryDeepDive = useMemo(() => {
    if (!stats.topOriginCountry) return null;
    
    const countryName = stats.topOriginCountry;
    const relatedIps = ipsData.filter(ip => ip.status === "success" && ip.country === countryName);
    
    const jailsHit: Record<string, number> = {};
    const cities: Record<string, number> = {};
    const isps: Record<string, number> = {};

    relatedIps.forEach(ip => {
      jailsHit[ip.jail] = (jailsHit[ip.jail] || 0) + 1;
      if (ip.city) cities[ip.city] = (cities[ip.city] || 0) + 1;
      if (ip.isp) isps[ip.isp] = (isps[ip.isp] || 0) + 1;
    });

    const topJail = Object.entries(jailsHit).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    const topCity = Object.entries(cities).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown City";
    const topIsp = Object.entries(isps).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown Network";

    return {
      countryName,
      code: relatedIps[0]?.countryCode || "",
      totalBans: relatedIps.length,
      topJail,
      topCity,
      topIsp,
      jailsHitBreakdown: Object.entries(jailsHit).sort((a, b) => b[1] - a[1]),
      citiesBreakdown: Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
  }, [stats.topOriginCountry, ipsData]);

  const handleCardClick = (tab: "banned" | "countries" | "origin" | "jails") => {
    setSelectedTab(prev => (prev === tab ? null : tab));
    // Smooth scroll to details container when opened
    setTimeout(() => {
      const detailsEl = document.getElementById("stats-details-drawer");
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 150);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Banned IPs Card */}
        <button
          onClick={() => handleCardClick("banned")}
          id="stats-banned-ips"
          className={`bg-[#0c0c0e] border p-5 rounded-lg flex flex-col justify-between text-left transition-all relative cursor-pointer group active:scale-[0.98] ${
            selectedTab === "banned"
              ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-950/5"
              : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10"
          }`}
        >
          <div className="flex justify-between items-start w-full">
            <div>
              <span className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase font-mono">Banned IPs</span>
              <h3 className="text-4xl font-semibold text-white mt-1 font-sans tracking-tight">
                {stats.totalIps}
              </h3>
            </div>
            <div className={`p-2 rounded-md border transition-all ${
              selectedTab === "banned" 
                ? "bg-red-500/20 border-red-500/40 text-red-400" 
                : "bg-red-950/40 border-red-900/30 text-red-500 group-hover:text-red-400"
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 w-full text-xs text-zinc-400">
            <span>
              <span className="font-medium text-zinc-350">{stats.geolocatedCount}</span> geolocated
            </span>
            <span className="text-[10px] text-red-400/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {selectedTab === "banned" ? "Hide Details ✕" : "View Details →"}
            </span>
          </div>
        </button>

        {/* Countries Card */}
        <button
          onClick={() => handleCardClick("countries")}
          id="stats-countries"
          className={`bg-[#0c0c0e] border p-5 rounded-lg flex flex-col justify-between text-left transition-all relative cursor-pointer group active:scale-[0.98] ${
            selectedTab === "countries"
              ? "border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.15)] bg-sky-950/5"
              : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10"
          }`}
        >
          <div className="flex justify-between items-start w-full">
            <div>
              <span className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase font-mono">Countries</span>
              <h3 className="text-4xl font-semibold text-white mt-1 font-sans tracking-tight">
                {stats.countriesCount}
              </h3>
            </div>
            <div className={`p-2 rounded-md border transition-all ${
              selectedTab === "countries" 
                ? "bg-sky-500/20 border-sky-500/40 text-sky-400" 
                : "bg-sky-950/40 border-sky-900/30 text-sky-500 group-hover:text-sky-400"
            }`}>
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 w-full text-xs text-zinc-400">
            <span>
              <span className="font-medium text-zinc-350">+{stats.unresolvedCount}</span> unresolved
            </span>
            <span className="text-[10px] text-sky-400/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {selectedTab === "countries" ? "Hide Details ✕" : "View Details →"}
            </span>
          </div>
        </button>

        {/* Top Origin Card */}
        <button
          onClick={() => handleCardClick("origin")}
          id="stats-top-origin"
          className={`bg-[#0c0c0e] border p-5 rounded-lg flex flex-col justify-between text-left transition-all relative cursor-pointer group active:scale-[0.98] ${
            selectedTab === "origin"
              ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-950/5"
              : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10"
          }`}
        >
          <div className="flex justify-between items-start w-full gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase font-mono">Top Origin</span>
              <h3 className="text-3xl font-semibold text-white mt-1 font-sans tracking-tight flex items-center gap-2 min-w-0">
                {topCountryDeepDive?.code && (
                  <span className="text-3xl select-none leading-none shrink-0" role="img" aria-label="country-flag">
                    {getFlagEmoji(topCountryDeepDive.code)}
                  </span>
                )}
                <span className="truncate block">
                  {stats.topOriginCountry || "N/A"}
                </span>
              </h3>
            </div>
            <div className={`p-2 rounded-md border transition-all shrink-0 ${
              selectedTab === "origin" 
                ? "bg-amber-500/20 border-amber-500/40 text-amber-400" 
                : "bg-amber-950/40 border-amber-900/30 text-amber-500 group-hover:text-amber-400"
            }`}>
              <AlertOctagon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 w-full text-xs text-zinc-400">
            <span className="truncate max-w-[150px] sm:max-w-none">
              <span className="font-medium text-zinc-350">{stats.topOriginCount}</span> bans ({stats.topOriginJail || "N/A"})
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {selectedTab === "origin" ? "Hide Details ✕" : "View Details →"}
            </span>
          </div>
        </button>

        {/* Jails Hit Card */}
        <button
          onClick={() => handleCardClick("jails")}
          id="stats-jails-hit"
          className={`bg-[#0c0c0e] border p-5 rounded-lg flex flex-col justify-between text-left transition-all relative cursor-pointer group active:scale-[0.98] ${
            selectedTab === "jails"
              ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-purple-950/5"
              : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/10"
          }`}
        >
          <div className="flex justify-between items-start w-full">
            <div>
              <span className="text-zinc-500 text-[10px] font-semibold tracking-wider uppercase font-mono">Jails Hit</span>
              <h3 className="text-4xl font-semibold text-white mt-1 font-sans tracking-tight">
                {stats.jailsHitCount}
              </h3>
            </div>
            <div className={`p-2 rounded-md border transition-all ${
              selectedTab === "jails" 
                ? "bg-purple-500/20 border-purple-500/40 text-purple-400" 
                : "bg-purple-950/40 border-purple-900/30 text-purple-500 group-hover:text-purple-400"
            }`}>
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 w-full text-xs text-zinc-400">
            <span className="truncate max-w-[150px] sm:max-w-none" title={jailDetailsString}>
              {jailDetailsString || "No active jails"}
            </span>
            <span className="text-[10px] text-purple-400/80 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
              {selectedTab === "jails" ? "Hide Details ✕" : "View Details →"}
            </span>
          </div>
        </button>
      </div>

      {/* Stats Details Drawer */}
      <AnimatePresence mode="wait">
        {selectedTab && (
          <motion.div
            id="stats-details-drawer"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border border-zinc-800 rounded-lg bg-[#0c0c0e] shadow-xl relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">Interactive Intel Drawer</span>
                <span className="text-zinc-700">|</span>
                <h4 className="text-sm font-medium text-white font-sans">
                  {selectedTab === "banned" && "Banned Addresses & ISP Networks Summary"}
                  {selectedTab === "countries" && "Attack Heatmap by Country / Region"}
                  {selectedTab === "origin" && `Threat Intelligence Deep-Dive: ${stats.topOriginCountry}`}
                  {selectedTab === "jails" && "Fail2Ban Jail Configuration & Block Stats"}
                </h4>
              </div>
              <button
                onClick={() => setSelectedTab(null)}
                className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              {/* TAB 1: BANNED DETAILS */}
              {selectedTab === "banned" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-4 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-900 pb-6 md:pb-0 md:pr-6">
                    <div>
                      <h5 className="text-xs font-semibold text-zinc-300 font-mono uppercase tracking-wider mb-2">Operational Metrics</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                        A summary of georesolution success and network distribution across the active ban list.
                      </p>
                    </div>
                    <div className="space-y-3 font-mono">
                      <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Total Banned List:</span>
                        <span className="font-semibold text-white">{stats.totalIps}</span>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Geo Success Rate:</span>
                        <span className="font-semibold text-emerald-400">
                          {stats.totalIps > 0 ? ((stats.geolocatedCount / stats.totalIps) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Unresolved Nodes:</span>
                        <span className="font-semibold text-amber-500">{stats.unresolvedCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-4">
                    <h5 className="text-xs font-semibold text-zinc-350 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Network className="w-4 h-4 text-red-500" />
                      Top 5 Attacking Autonomous System / ISPs
                    </h5>
                    {aggregations.topIsps.length === 0 ? (
                      <div className="text-xs text-zinc-500 italic py-4">No ISP telemetry available. Parse logs or enter IPs to view details.</div>
                    ) : (
                      <div className="space-y-3">
                        {aggregations.topIsps.map((isp, idx) => {
                          const percentage = stats.totalIps > 0 ? (isp.count / stats.totalIps) * 100 : 0;
                          return (
                            <div key={isp.name} className="space-y-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-sans text-zinc-300 font-medium truncate max-w-[320px] sm:max-w-md">
                                  {idx + 1}. {isp.name}
                                </span>
                                <span className="font-mono text-zinc-400 text-[11px]">
                                  {isp.count} {isp.count === 1 ? "ban" : "bans"} ({percentage.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-red-500/80 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: COUNTRIES DETAILS */}
              {selectedTab === "countries" && (
                <div className="space-y-4">
                  <h5 className="text-xs font-semibold text-zinc-350 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-sky-400" />
                    Threat Source Distribution (Ranked)
                  </h5>
                  {aggregations.topCountriesList.length === 0 ? (
                    <div className="text-xs text-zinc-500 italic py-4">No country telemetry resolved yet. Try loading or parsing standard logs.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {aggregations.topCountriesList.slice(0, 9).map((country, idx) => {
                        const totalActive = stats.totalIps || 1;
                        const percentage = (country.count / totalActive) * 100;
                        const flag = getFlagEmoji(country.code);
                        return (
                          <div key={country.name} className="bg-zinc-950 border border-zinc-900 p-3.5 rounded-lg flex flex-col justify-between hover:border-zinc-800 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl select-none" role="img" aria-label={country.name}>
                                  {flag}
                                </span>
                                <div>
                                  <div className="text-xs font-medium text-white font-sans max-w-[120px] truncate" title={country.name}>
                                    {country.name}
                                  </div>
                                  <div className="text-[10px] font-mono text-zinc-500">{country.code}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-semibold text-white font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                                  #{idx + 1}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                                <span>Bans count: {country.count}</span>
                                <span>{percentage.toFixed(0)}%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-sky-500/80 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TOP ORIGIN DEEP-DIVE */}
              {selectedTab === "origin" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {topCountryDeepDive ? (
                    <>
                      {/* Left Column: Brief Summary */}
                      <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-zinc-900 pb-6 md:pb-0 md:pr-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{getFlagEmoji(topCountryDeepDive.code)}</span>
                          <div>
                            <h5 className="text-lg font-bold text-white font-sans">{topCountryDeepDive.countryName}</h5>
                            <p className="text-xs font-mono text-zinc-500">ISO-Code: {topCountryDeepDive.code}</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-xs text-amber-300 leading-relaxed flex gap-2">
                          <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
                          <div>
                            <span className="font-semibold">Security Note:</span> Attacks from this country are primarily targeting the <span className="font-mono bg-amber-950/60 px-1 py-0.5 rounded text-amber-200">{topCountryDeepDive.topJail}</span> service port. Implement strict firewall gating or cloudflare geoblocking if this traffic is unsolicited.
                          </div>
                        </div>

                        <div className="space-y-2 font-mono text-xs">
                          <div className="flex justify-between py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-500">Total Ban Share:</span>
                            <span className="text-white font-medium">{topCountryDeepDive.totalBans} ips</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-500">Primary Attack Vector:</span>
                            <span className="text-white font-medium">{topCountryDeepDive.topJail}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-500">Highest ISP Source:</span>
                            <span className="text-white font-medium truncate max-w-[140px] text-right" title={topCountryDeepDive.topIsp}>
                              {topCountryDeepDive.topIsp}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-zinc-900/40">
                            <span className="text-zinc-500">Primary Attack City:</span>
                            <span className="text-white font-medium">{topCountryDeepDive.topCity}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Geographic & Network Distribution */}
                      <div className="md:col-span-7 space-y-4">
                        <h6 className="text-xs font-semibold text-zinc-350 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          Top Cities Involved ({topCountryDeepDive.countryName})
                        </h6>
                        {topCountryDeepDive.citiesBreakdown.length === 0 ? (
                          <div className="text-xs text-zinc-500 italic">No city location details found.</div>
                        ) : (
                          <div className="space-y-3">
                            {topCountryDeepDive.citiesBreakdown.map(([cityName, count]) => {
                              const percentage = (count / topCountryDeepDive.totalBans) * 100;
                              return (
                                <div key={cityName} className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-sans text-zinc-300 font-medium">
                                      🏙️ {cityName}
                                    </span>
                                    <span className="font-mono text-zinc-400 text-[11px]">
                                      {count} ban(s) ({percentage.toFixed(0)}%)
                                    </span>
                                  </div>
                                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-amber-500/80 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-zinc-500 italic py-4">No top country determined. Parse an active Fail2Ban log to start.</div>
                  )}
                </div>
              )}

              {/* TAB 4: JAILS DETAILS */}
              {selectedTab === "jails" && (
                <div className="space-y-5">
                  <h5 className="text-xs font-semibold text-zinc-350 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-400" />
                    Fail2Ban Filter Jails Analysis
                  </h5>

                  {Object.keys(stats.jailBreakdown).length === 0 ? (
                    <div className="text-xs text-zinc-500 italic py-4">No active jails in current log file.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(stats.jailBreakdown).map(([jailName, count]) => {
                        const profile = JAIL_PROFILES[jailName] || {
                          title: `Custom Filter: ${jailName}`,
                          desc: "A custom configured application or port-gating filter in jail.local.",
                          severity: "warning"
                        };
                        const percentage = stats.totalIps > 0 ? (count / stats.totalIps) * 100 : 0;

                        return (
                          <div key={jailName} className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg flex flex-col justify-between hover:border-zinc-800 transition-colors">
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${
                                    profile.severity === "critical" ? "bg-red-500 animate-pulse" : "bg-amber-500"
                                  }`} />
                                  <h6 className="text-xs font-bold text-white font-sans">{profile.title}</h6>
                                </div>
                                <span className="font-mono text-[10px] text-zinc-500 uppercase bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                                  {jailName}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans mb-4">
                                {profile.desc}
                              </p>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                <span>Active block count: <strong className="text-zinc-300">{count}</strong></span>
                                <span>{percentage.toFixed(0)}% of threat matrix</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    jailName === "ssh" ? "bg-blue-500" :
                                    jailName === "plesk-panel" ? "bg-emerald-500" :
                                    jailName === "plesk-postfix" ? "bg-amber-500" :
                                    jailName === "plesk-modsecurity" ? "bg-red-500" : "bg-purple-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

