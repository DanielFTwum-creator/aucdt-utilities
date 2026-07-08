/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import Markdown from "react-markdown";
import { IPData, MapStats, BlockedIpRecord } from "./types";
import { DEFAULT_BANNED_IPS, DEFAULT_SERVER_LOCATION, INITIAL_BLOCKED_HISTORY } from "./data";
import IPStats from "./components/IPStats";
import IPMap from "./components/IPMap";
import CountryThreatChart from "./components/CountryThreatChart";
import ThreatTimeline from "./components/ThreatTimeline";
import IPTable from "./components/IPTable";
import LogParser from "./components/LogParser";
import SecurityAlertSystem, { HighRiskAlert } from "./components/SecurityAlertSystem";
import { ShieldCheck, Sparkles, RefreshCw, Layers, ShieldAlert, Globe, Server, Download, ChevronDown, FileText, Copy, Check, X, Ban } from "lucide-react";
import { getFlagEmoji } from "./components/IPTable";
import { getIpAttackCount } from "./types";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [ipsData, setIpsData] = useState<IPData[]>(DEFAULT_BANNED_IPS);
  const [serverLocation, setServerLocation] = useState(DEFAULT_SERVER_LOCATION);
  const [activeTab, setActiveTab] = useState<"dashboard" | "ai-insights">("dashboard");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Detailed processing/loading progress states
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);
  const [currentProcessingStep, setCurrentProcessingStep] = useState("");
  const [totalIpsToProcess, setTotalIpsToProcess] = useState(0);
  const [processedIpsCount, setProcessedIpsCount] = useState(0);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  
  // AI insights state
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeLogSample, setActiveLogSample] = useState<string>("");

  // Highlighted IP state shared between IPMap and IPTable
  const [highlightedIp, setHighlightedIp] = useState<string | null>(null);

  // Country filtering state
  const [selectedCountry, setSelectedCountry] = useState<string>("All");

  // Mitigation mode states
  const [mitigationMode, setMitigationMode] = useState(false);
  const [mitigationIp, setMitigationIp] = useState<string | null>(null);
  const [activeRuleTab, setActiveRuleTab] = useState<"ufw" | "iptables" | "firewalld" | "nginx" | "fail2ban">("ufw");
  const [copied, setCopied] = useState(false);

  // Security visual alert system states
  const [highRiskAlerts, setHighRiskAlerts] = useState<HighRiskAlert[]>([]);
  const [isViewportPulsing, setIsViewportPulsing] = useState(false);

  // Compute unique countries that have resolved geolocations from ipsData
  const countriesList = useMemo(() => {
    const list: { code: string; name: string }[] = [];
    const seen = new Set<string>();
    ipsData.forEach(ip => {
      if (ip.status === "success" && ip.country && ip.countryCode) {
        if (!seen.has(ip.countryCode)) {
          seen.add(ip.countryCode);
          list.push({ code: ip.countryCode, name: ip.country });
        }
      }
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [ipsData]);

  // Compute filtered dataset
  const filteredIpsData = useMemo(() => {
    if (selectedCountry === "All") return ipsData;
    return ipsData.filter(ip => ip.countryCode === selectedCountry);
  }, [ipsData, selectedCountry]);

  // Historical blocked IPs state loaded from localStorage or initialized with defaults
  const [blockedHistory, setBlockedHistory] = useState<BlockedIpRecord[]>(() => {
    try {
      const saved = window.localStorage ? localStorage.getItem("blocked_ips_history") : null;
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to read blocked history from localStorage:", e);
    }
    // Pre-populate with realistic mock blocks if empty
    try {
      if (window.localStorage) {
        localStorage.setItem("blocked_ips_history", JSON.stringify(INITIAL_BLOCKED_HISTORY));
      }
    } catch (e) {
      console.error("Failed to write blocked history to localStorage:", e);
    }
    return INITIAL_BLOCKED_HISTORY;
  });

  // Tab Title Flashing when there are active unresolved high-risk alerts
  useEffect(() => {
    if (highRiskAlerts.length === 0) {
      document.title = "Where the banned IPs come from";
      return;
    }

    let toggle = false;
    const interval = setInterval(() => {
      document.title = toggle
        ? "🚨 CRITICAL THREAT DETECTED"
        : `(${highRiskAlerts.length}) High-Risk IP Bans`;
      toggle = !toggle;
    }, 1000);

    return () => {
      clearInterval(interval);
      document.title = "Where the banned IPs come from";
    };
  }, [highRiskAlerts]);

  const currentMitigationIpData = useMemo(() => {
    return filteredIpsData.find(item => item.ip === mitigationIp);
  }, [filteredIpsData, mitigationIp]);

  // Dynamically calculate threat and mapping stats
  const stats = useMemo((): MapStats => {
    const totalIps = filteredIpsData.length;
    const geolocatedCount = filteredIpsData.filter(ip => ip.status === "success").length;
    
    // Unique countries
    const countries = Array.from(new Set(filteredIpsData.map(ip => ip.countryCode).filter(Boolean)));
    const countriesCount = countries.length;
    const unresolvedCount = filteredIpsData.filter(ip => ip.status === "fail").length;

    // Count origins to find top source country
    const countryCounts: Record<string, { count: number; name: string }> = {};
    filteredIpsData.forEach(ip => {
      if (ip.status === "success" && ip.country) {
        if (!countryCounts[ip.countryCode]) {
          countryCounts[ip.countryCode] = { count: 0, name: ip.country };
        }
        countryCounts[ip.countryCode].count++;
      }
    });

    let topOriginCountry = "—";
    let topOriginCount = 0;
    Object.entries(countryCounts).forEach(([code, data]) => {
      if (data.count > topOriginCount) {
        topOriginCount = data.count;
        topOriginCountry = data.name;
      }
    });

    // Count top jail name for the top origin country
    const topCountryJails: Record<string, number> = {};
    filteredIpsData.forEach(ip => {
      if (ip.status === "success" && ip.country === topOriginCountry) {
        topCountryJails[ip.jail] = (topCountryJails[ip.jail] || 0) + 1;
      }
    });

    let topOriginJail = "—";
    let topJailCount = 0;
    Object.entries(topCountryJails).forEach(([jail, count]) => {
      if (count > topJailCount) {
        topJailCount = count;
        topOriginJail = jail;
      }
    });

    // Count active jails and build breakdown
    const jailBreakdown: Record<string, number> = {};
    filteredIpsData.forEach(ip => {
      if (ip.jail) {
        jailBreakdown[ip.jail] = (jailBreakdown[ip.jail] || 0) + 1;
      }
    });
    const jailsHitCount = Object.keys(jailBreakdown).length;

    return {
      totalIps,
      geolocatedCount,
      countriesCount,
      unresolvedCount,
      topOriginCountry,
      topOriginCount,
      topOriginJail,
      jailsHitCount,
      jailBreakdown
    };
  }, [filteredIpsData]);

  // Handler for parsing new IPs/logs
  const handleParseComplete = async (parsedItems: { ip: string; jail: string; logLine?: string; timestamp?: string }[]) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessedIpsCount(0);
    setTotalIpsToProcess(0);
    setProcessingLogs([]);
    setCurrentProcessingStep("Initializing SecOps Parser");

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Save sample of log parsed for Gemini analysis
    if (parsedItems.length > 0 && parsedItems[0].logLine) {
      setActiveLogSample(parsedItems.map(p => p.logLine).filter(Boolean).join("\n"));
    }

    try {
      await delay(400);
      setProcessingLogs(prev => [
        ...prev,
        `[INIT] SEC-OPS IP Geolocation Pipeline Started.`,
        `[INIT] Received ${parsedItems.length} raw entry candidates from parsed stream.`
      ]);
      setProcessingProgress(5);
      await delay(300);

      // De-duplicate IPs
      setProcessingLogs(prev => [
        ...prev,
        `[INIT] De-duplicating IP listings and validating octet ranges...`
      ]);
      
      const uniqueIpsMap = new Map<string, typeof parsedItems[0]>();
      parsedItems.forEach(item => {
        if (!uniqueIpsMap.has(item.ip)) {
          uniqueIpsMap.set(item.ip, item);
        }
      });
      const uniqueParsedItems = Array.from(uniqueIpsMap.values());
      const totalIps = uniqueParsedItems.length;
      
      setTotalIpsToProcess(totalIps);
      setProcessingLogs(prev => [
        ...prev,
        `[INIT] Found ${totalIps} unique active attacker nodes.`
      ]);
      setProcessingProgress(10);
      await delay(400);

      // We partition workload into chunks of 5
      const chunkSize = 5;
      const chunks: typeof uniqueParsedItems[] = [];
      for (let i = 0; i < uniqueParsedItems.length; i += chunkSize) {
        chunks.push(uniqueParsedItems.slice(i, i + chunkSize));
      }
      const totalChunks = chunks.length;

      setProcessingLogs(prev => [
        ...prev,
        `[BATCH] Workload partitioned into ${totalChunks} query batches (Batch size limit: ${chunkSize} targets).`,
        `[BATCH] Commencing geodb coordinates query...`
      ]);
      await delay(500);

      const allResults: IPData[] = [];
      let resolvedCount = 0;

      for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
        const currentChunk = chunks[chunkIdx];
        const chunkIps = currentChunk.map(item => item.ip);

        setCurrentProcessingStep(`Resolving Geolocation Batch ${chunkIdx + 1}/${totalChunks}`);
        setProcessingLogs(prev => [
          ...prev,
          `[QUERY] Fetching geolocations for batch ${chunkIdx + 1}/${totalChunks}: [${chunkIps.join(", ")}]...`
        ]);

        const response = await fetch(`${import.meta.env.BASE_URL}api/geolocate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ips: chunkIps }),
        });

        if (!response.ok) {
          throw new Error(`Geolocation server API failed at batch ${chunkIdx + 1}/${totalChunks}.`);
        }

        const data = await response.json();

        if (data && Array.isArray(data.results)) {
          data.results.forEach((item: any, idx: number) => {
            const original = currentChunk[idx];
            let mappedRecord: IPData;

            if (item.status === "success") {
              mappedRecord = {
                ip: item.ip,
                jail: original.jail,
                country: item.country,
                countryCode: item.countryCode,
                city: item.city,
                lat: item.lat,
                lon: item.lon,
                isp: item.isp,
                org: item.org,
                as: item.as,
                status: "success",
                note: original.logLine ? "imported via log" : undefined,
                timestamp: original.timestamp
              };
              setProcessingLogs(prev => [
                ...prev,
                `  └─ [OK] Mapped ${item.ip} to ${item.city || "N/A"}, ${item.country} [ISP: ${item.isp || "N/A"}]`
              ]);
            } else {
              mappedRecord = {
                ip: item.ip,
                jail: original.jail,
                country: "Unknown",
                countryCode: "",
                city: "",
                lat: NaN,
                lon: NaN,
                status: "fail",
                note: "unresolved coordinate",
                timestamp: original.timestamp
              };
              setProcessingLogs(prev => [
                ...prev,
                `  └─ [WARN] Unresolved IP ${item.ip}. Applying deterministic fallback coordinates.`
              ]);
            }
            allResults.push(mappedRecord);
          });

          resolvedCount += currentChunk.length;
          setProcessedIpsCount(resolvedCount);

          // Calculate progress percent from 10% to 90%
          const progressPercent = Math.min(
            90,
            Math.round(((chunkIdx + 1) / totalChunks) * 80) + 10
          );
          setProcessingProgress(progressPercent);
          await delay(450); // Fluid visually pleasing delay
        }
      }

      // Post-resolution analysis
      setCurrentProcessingStep("Evaluating Security Threat Levels");
      setProcessingLogs(prev => [
        ...prev,
        `[THREAT] Geolocation query completed. Received results for ${allResults.length} records.`,
        `[THREAT] Running multi-jail cross-reference scanning...`
      ]);
      setProcessingProgress(92);
      await delay(400);

      // Check for new, high-risk IPs
      const highRiskJails = ["recidive", "plesk-modsecurity", "plesk-panel", "ssh"];
      const parsedHighRisk = allResults.filter(ip => {
        const isHighRiskJail = highRiskJails.includes(ip.jail);
        const isHighAttack = getIpAttackCount(ip.ip) >= 8;
        return isHighRiskJail || isHighAttack;
      });

      setProcessingProgress(96);
      setCurrentProcessingStep("Finalizing Projection Models");
      setProcessingLogs(prev => [
        ...prev,
        `[THREAT] Scanned completed. Identified ${parsedHighRisk.length} active high-threat vector(s).`,
        `[UI] Refreshing regional intensity matrices and D3 coordinate projections...`
      ]);
      await delay(350);

      setIpsData(allResults);

      if (parsedHighRisk.length > 0) {
        const newAlerts: HighRiskAlert[] = parsedHighRisk.map((ip, idx) => {
          const isCritical = ip.jail === "recidive" || getIpAttackCount(ip.ip) >= 10;
          return {
            id: `${ip.ip}-${Date.now()}-${idx}-${Math.random()}`,
            ip: ip.ip,
            country: ip.country || "Unknown",
            countryCode: ip.countryCode || "",
            city: ip.city || "",
            jail: ip.jail,
            attackCount: getIpAttackCount(ip.ip),
            isp: ip.isp,
            timestamp: ip.timestamp || new Date().toISOString().replace("T", " ").substring(0, 19),
            severity: isCritical ? "critical" : "high"
          };
        });
        setHighRiskAlerts(prev => [...newAlerts, ...prev]);
        setIsViewportPulsing(true);

        setNotification({
          type: "error",
          message: `CRITICAL DETECTED: Log parsing completed with ${parsedHighRisk.length} active high-risk security threats! Isolate immediately.`
        });
      } else {
        setNotification({
          type: "success",
          message: `Successfully resolved and mapped ${allResults.length} IP address(es) from your input list!`
        });
      }

      setProcessingProgress(100);
      setProcessingLogs(prev => [
        ...prev,
        `[UI] UI mapping layer successfully synchronized. Board active. ✅`
      ]);
      await delay(200);

      // Auto-scroll to the map/metrics
      setTimeout(() => {
        const mapEl = document.getElementById("ip-map-container");
        if (mapEl) {
          mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);

    } catch (err: any) {
      console.error("Error geolocating IPs:", err);
      setProcessingLogs(prev => [
        ...prev,
        `[FATAL] Pipeline error: ${err?.message || "Unknown error occurred"}`
      ]);
      setNotification({
        type: "error",
        message: `Failed to geolocate IPs: ${err?.message || "Unknown network error."}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove a single IP address
  const handleRemoveIp = (ipToRemove: string) => {
    setIpsData(prev => prev.filter(item => item.ip !== ipToRemove));
  };

  // Security Visual Alert handlers
  const handleDismissAlert = (id: string) => {
    setHighRiskAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleDismissAllAlerts = () => {
    setHighRiskAlerts([]);
    setIsViewportPulsing(false);
  };

  const handleLocateAlertIp = (ip: string) => {
    setHighlightedIp(ip);
    setTimeout(() => {
      const mapEl = document.getElementById("ip-map-container");
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleBlockAlertIp = (ip: string) => {
    setMitigationIp(ip);
    setMitigationMode(true);
  };

  // Deploy firewall mitigation and block IP
  const handleDeployMitigation = (ip: string) => {
    const matchedIp = ipsData.find(item => item.ip === ip);
    const newBlock: BlockedIpRecord = {
      ip,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      jail: matchedIp?.jail || "ssh",
      country: matchedIp?.country || "Unknown",
      city: matchedIp?.city || "—",
      isp: matchedIp?.isp || "—"
    };

    setBlockedHistory(prev => {
      const updated = [newBlock, ...prev];
      try {
        if (window.localStorage) {
          localStorage.setItem("blocked_ips_history", JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Failed to save blocked history to localStorage:", e);
      }
      return updated;
    });

    setIpsData(prev => prev.filter(item => item.ip !== ip));
    setMitigationIp(null);
    setNotification({
      type: "success",
      message: `Mitigation rule deployed successfully! Threat source ${ip} has been hard-blocked at the firewall layer and removed from the active board.`
    });
  };

  // Trigger Gemini detailed threat analysis
  const handleAnalyzeThreats = async () => {
    setIsAnalyzing(true);
    setActiveTab("ai-insights");
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/analyze-logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipsData,
          logSample: activeLogSample || "Direct IP batch mapping list."
        }),
      });

      if (!response.ok) {
        throw new Error("AI Analysis API failed.");
      }

      const data = await response.json();
      setAiAnalysis(data.analysis || "Could not generate analysis.");
    } catch (err: any) {
      console.error("Error calling Gemini threat analyzer:", err);
      setAiAnalysis(`### ❌ Analysis Error\nFailed to call Gemini threat analyzer: ${err.message || "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset to original Fail2Ban snap
  const handleResetToDefault = () => {
    setIpsData(DEFAULT_BANNED_IPS);
    setServerLocation(DEFAULT_SERVER_LOCATION);
    setActiveLogSample("");
    setAiAnalysis("");
  };

  // Export report as markdown or plain text
  const handleExportText = (format: "txt" | "md") => {
    let content = "";
    const dateStr = new Date().toLocaleString("en-US", { timeZoneName: "short" });
    
    if (format === "md") {
      content = `# 🛡️ SEC-OPS AUDIT & GEOLOCATION THREAT REPORT\n\n`;
      content += `*Generated on: ${dateStr}*\n`;
      content += `*Target Host Server: ${serverLocation.name} (Lat: ${serverLocation.lat}, Lon: ${serverLocation.lon})*\n\n`;
      
      content += `## 📊 EXECUTIVE SUMMARY\n\n`;
      content += `- **Total Banned IPs Active**: ${stats.totalIps}\n`;
      content += `- **Successfully Geolocated**: ${stats.geolocatedCount} nodes\n`;
      content += `- **Active Fail2Ban Jails Hit**: ${stats.jailsHitCount}\n`;
      content += `- **Threat Countries Identified**: ${stats.countriesCount}\n`;
      content += `- **Top Attack Vector Country**: **${stats.topOriginCountry}** (${stats.topOriginCount} active bans)\n`;
      content += `- **Top Jail for Primary Attacker**: \`${stats.topOriginJail}\`\n\n`;
      
      content += `## 🏷️ FAIL2BAN JAIL DISTRIBUTION\n\n`;
      content += `| Jail Name | Active Block Count |\n`;
      content += `| :--- | :--- |\n`;
      Object.entries(stats.jailBreakdown).forEach(([jail, count]) => {
        content += `| \`${jail}\` | ${count} block(s) |\n`;
      });
      content += `\n`;

      content += `## 🌍 ACTIVE MALICIOUS NODES DETAILS\n\n`;
      content += `| IP Address | Target Jail | Country | City / Region | ISP / ASN |\n`;
      content += `| :--- | :--- | :--- | :--- | :--- |\n`;
      ipsData.forEach(ip => {
        const countryLabel = ip.country ? `${ip.country} (${ip.countryCode})` : "Unknown";
        content += `| **${ip.ip}** | \`${ip.jail}\` | ${countryLabel} | ${ip.city || "—"} | ${ip.isp || "—"} |\n`;
      });
      content += `\n`;

      content += `## 🧠 GEMINI AI SECURITY INTELLIGENCE\n\n`;
      if (aiAnalysis) {
        content += aiAnalysis;
      } else {
        content += `*No AI Threat Analysis and remediation generated for this snapshot. Generate security insights inside the "Gemini Security Insights" tab to include them in this audit.*`;
      }
    } else {
      // TEXT Format
      content = `================================================================================\n`;
      content += `             FAIL2BAN SEC-OPS AUDIT & GEOLOCATION THREAT REPORT\n`;
      content += `================================================================================\n`;
      content += `Generated on : ${dateStr}\n`;
      content += `Target Server: ${serverLocation.name} (Coords: ${serverLocation.lat}, ${serverLocation.lon})\n`;
      content += `================================================================================\n\n`;
      
      content += `1. EXECUTIVE STATISTICAL SUMMARY\n`;
      content += `--------------------------------------------------------------------------------\n`;
      content += ` - Total Banned IP Addresses : ${stats.totalIps}\n`;
      content += ` - Geolocated Attack Nodes   : ${stats.geolocatedCount}\n`;
      content += ` - Active Fail2Ban Jails Hit : ${stats.jailsHitCount}\n`;
      content += ` - Threat Source Countries   : ${stats.countriesCount}\n`;
      content += ` - Top Attack Origin Country : ${stats.topOriginCountry} (${stats.topOriginCount} bans)\n`;
      content += ` - Top Jail for Top Country  : ${stats.topOriginJail}\n\n`;
      
      content += `2. JAIL BREAKDOWN DETAILS\n`;
      content += `--------------------------------------------------------------------------------\n`;
      Object.entries(stats.jailBreakdown).forEach(([jail, count]) => {
        content += ` - Jail: [${jail.padEnd(20)}] -> ${count} active bans\n`;
      });
      content += `\n`;

      content += `3. ACTIVE BANNED NODES DIRECTORY\n`;
      content += `--------------------------------------------------------------------------------\n`;
      ipsData.forEach((ip, idx) => {
        const num = (idx + 1).toString().padStart(3, " ");
        const geoInfo = ip.status === "success" 
          ? `${ip.country || "Unknown"} (${ip.countryCode}) - ${ip.city || "N/A"}`
          : "Unresolved Location";
        content += `${num}. IP: ${ip.ip.padEnd(15)} | Jail: ${ip.jail.padEnd(18)} | Location: ${geoInfo.padEnd(35)} | ISP: ${ip.isp || "—"}\n`;
      });
      content += `\n`;

      content += `4. GEMINI AI INTEL & INCIDENT RESPONSE PLAYBOOK\n`;
      content += `--------------------------------------------------------------------------------\n`;
      if (aiAnalysis) {
        // Clean markdown indicators for plain text
        const plainTextAnalysis = aiAnalysis
          .replace(/###\s+/g, "\n[ ] ")
          .replace(/##\s+/g, "\n=== ")
          .replace(/#\s+/g, "\n<<< ")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/`([^`]+)`/g, "$1");
        content += plainTextAnalysis;
      } else {
        content += `No active Gemini intelligence generated for this snapshot.\nGenerate intelligence in the "Gemini Security Insights" tab to embed it.`;
      }
      content += `\n================================================================================\n`;
    }

    // Download blob file
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fail2ban-security-report-${new Date().toISOString().slice(0, 10)}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export historical blocked IPs as CSV
  const handleExportCSV = () => {
    const headers = ["IP Address", "Block Timestamp", "Triggered Jail", "Country", "City", "ISP"];
    const rows = blockedHistory.map(record => [
      record.ip,
      record.timestamp,
      record.jail,
      record.country || "Unknown",
      record.city || "—",
      record.isp || "—"
    ]);

    // Format as CSV, escape quotes properly
    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(val => {
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fail2ban-blocked-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col antialiased">
      {/* Top Header */}
      <header className="border-b border-zinc-900 bg-[#070707] py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
              <ShieldAlert className="w-6 h-6 text-amber-500" />
              Where the banned IPs come from
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              Fail2Ban ban list snapshot — <span className="text-zinc-400">{stats.totalIps} active addresses</span> across <span className="text-zinc-400">{stats.jailsHitCount} jails</span>
            </p>
          </div>

          {/* Tab Actions / Global buttons */}
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            {/* View switcher */}
            <div className="bg-zinc-950 border border-zinc-800 p-1 rounded-lg flex items-center">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-1.5 rounded-md text-xs font-medium font-sans transition-all ${
                  activeTab === "dashboard"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Security Board
              </button>
              <button
                onClick={() => handleAnalyzeThreats()}
                className={`px-4 py-1.5 rounded-md text-xs font-medium font-sans transition-all flex items-center gap-1.5 ${
                  activeTab === "ai-insights"
                    ? "bg-amber-500 text-black shadow-sm font-semibold"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gemini Security Insights
              </button>
            </div>

            {/* Mitigation Mode Toggle */}
            <button
              onClick={() => setMitigationMode(!mitigationMode)}
              className={`px-3 py-2 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                mitigationMode
                  ? "bg-red-950/40 text-red-400 border-red-800/40 hover:bg-red-950/60 shadow-lg shadow-red-950/10"
                  : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
              }`}
              title="Toggle Mitigation Mode to isolate and block top threat actors"
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${mitigationMode ? "animate-pulse text-red-500" : "text-zinc-400"}`} />
              <span>Mitigation: {mitigationMode ? "ON" : "OFF"}</span>
            </button>

            {/* Reset to Snapshot */}
            <button
              onClick={handleResetToDefault}
              className="px-3 py-2 rounded-lg text-xs font-mono border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-1.5"
              title="Reset to default snapshot"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Snapshot
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="px-3 py-2 rounded-lg text-xs font-mono border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                title="Export geolocated threat snapshot"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                Export Report
                <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform ${isExportDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isExportDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsExportDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#0e0e11] border border-zinc-800 shadow-2xl z-50 py-1.5">
                    <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 font-mono tracking-wider uppercase border-b border-zinc-900 pb-1.5 mb-1">
                      Download Formats
                    </div>
                    <button
                      onClick={() => {
                        handleExportText("md");
                        setIsExportDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-amber-500/80" />
                      <div>
                        <p className="font-sans">Export Markdown (.md)</p>
                        <p className="text-[10px] text-zinc-500 font-mono font-light mt-0.5">Styled text, ideal for GitHub</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        handleExportText("txt");
                        setIsExportDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-emerald-500/80" />
                      <div>
                        <p className="font-sans">Export Plain Text (.txt)</p>
                        <p className="text-[10px] text-zinc-500 font-mono font-light mt-0.5">Pre-formatted SecOps dossier</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        handleExportCSV();
                        setIsExportDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 transition-colors"
                      id="export-blocked-history-csv"
                    >
                      <Ban className="w-4 h-4 text-red-500/80" />
                      <div>
                        <p className="font-sans text-red-400">Export Block History (.csv)</p>
                        <p className="text-[10px] text-zinc-500 font-mono font-light mt-0.5">Historical list of blocked nodes</p>
                      </div>
                    </button>
                    <div className="border-t border-zinc-900 my-1" />
                    <button
                      onClick={() => {
                        setIsExportDropdownOpen(false);
                        setTimeout(() => window.print(), 150);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-350 hover:text-white hover:bg-zinc-900/60 flex items-center gap-2 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-blue-400/80" />
                      <div>
                        <p className="font-sans">Print / Save as PDF</p>
                        <p className="text-[10px] text-zinc-500 font-mono font-light mt-0.5">Using standard system print</p>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {notification && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center justify-between gap-3 text-sm transition-all print:hidden ${
            notification.type === "success" 
              ? "bg-emerald-950/30 border-emerald-800/30 text-emerald-400" 
              : "bg-red-950/30 border-red-800/30 text-red-400"
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
              )}
              <span>{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-zinc-500 hover:text-zinc-300 font-mono text-xs px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {activeTab === "dashboard" ? (
          <div>
            {/* Metric widgets */}
            <IPStats stats={stats} ipsData={filteredIpsData} />

            {/* Geographic Threat Filter */}
            <div className="bg-[#0b0b0d] border border-zinc-900 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-500 animate-[spin_12s_linear_infinite]" />
                <div>
                  <h3 className="text-xs font-semibold text-zinc-300 font-sans uppercase tracking-wider">Geographic Threat Filter</h3>
                  <p className="text-[10px] text-zinc-500 font-mono">Isolate traffic maps and metrics to a specific origin country</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-mono">Filter by Country:</span>
                <div className="relative">
                  <select
                    id="country-filter-select"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="appearance-none bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-200 text-xs font-mono rounded px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer min-w-[180px] transition-all"
                  >
                    <option value="All">All Countries ({countriesList.length})</option>
                    {countriesList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {getFlagEmoji(c.code)} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {selectedCountry !== "All" && (
                  <button
                    onClick={() => setSelectedCountry("All")}
                    className="px-2 py-1 text-[10px] font-mono text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded bg-amber-500/5 transition-all"
                    title="Clear Country Filter"
                  >
                    Clear [All]
                  </button>
                )}
              </div>
            </div>

            {mitigationMode && (
              <div className="mb-6 p-4 bg-red-950/10 border border-red-800/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-400 font-sans">Active Mitigation Mode</h3>
                    <p className="text-xs text-zinc-400 mt-1 font-mono">
                      High-frequency threat sources (8+ log matches) are highlighted on the map and table with pulsing red warning markers. Click <strong>"Block Rule"</strong> to generate host-level packet filtering commands.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMitigationMode(false)}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 border border-red-800/40 text-red-400 hover:text-white text-xs font-mono rounded cursor-pointer transition-all self-start sm:self-center"
                >
                  Disable Mode
                </button>
              </div>
            )}

            {/* Attack Origin Map */}
            <IPMap 
              ipsData={filteredIpsData} 
              serverLocation={serverLocation} 
              highlightedIp={highlightedIp} 
              onHighlightIp={setHighlightedIp} 
              mitigationMode={mitigationMode}
            />

            {/* Country Threat Distribution Pie Chart */}
            <CountryThreatChart 
              ipsData={filteredIpsData} 
              onHighlightIp={setHighlightedIp} 
            />

            {/* Threat Timeline */}
            <ThreatTimeline
              ipsData={filteredIpsData}
              highlightedIp={highlightedIp}
              onHighlightIp={setHighlightedIp}
            />

            {/* Custom Log Parser Box */}
            <div className="print:hidden">
              <LogParser 
                onParseComplete={handleParseComplete} 
                isProcessing={isProcessing}
                processingProgress={processingProgress}
                processingLogs={processingLogs}
                currentProcessingStep={currentProcessingStep}
                totalIpsToProcess={totalIpsToProcess}
                processedIpsCount={processedIpsCount}
              />
            </div>

            {/* Threat Table */}
            <IPTable 
              ipsData={filteredIpsData} 
              onRemoveIp={handleRemoveIp} 
              highlightedIp={highlightedIp} 
              onHighlightIp={setHighlightedIp} 
              mitigationMode={mitigationMode}
              onMitigate={setMitigationIp}
            />
          </div>
        ) : (
          /* AI INSIGHTS VIEW */
          <div id="ai-threat-insights-panel" className="bg-[#111] border border-zinc-800 rounded-lg p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-zinc-900 mb-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Gemini Advanced Threat Intelligence
                </h2>
                <p className="text-xs text-zinc-500 mt-1 font-mono">
                  Generates firewall rules, jail configurations, and security recommendations based on active blocks.
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => handleAnalyzeThreats()}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-amber-500 text-black text-xs font-semibold rounded-md hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                  {isAnalyzing ? "Analyzing threat logs..." : "Refresh Intelligence"}
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-mono rounded-md"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Report Content */}
            {isAnalyzing ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4 text-zinc-500 font-mono text-xs">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-amber-500 animate-spin" />
                  <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-zinc-300">Consulting Gemini SecOps Agent...</p>
                  <p className="text-[10px] text-zinc-600">Evaluating {ipsData.length} malicious nodes, geographical patterns, and attack vectors.</p>
                </div>
              </div>
            ) : aiAnalysis ? (
              <div className="markdown-body text-zinc-300 max-w-none text-sm leading-relaxed prose prose-invert prose-amber">
                <Markdown
                  components={{
                    h1: ({ ...props }) => <h3 className="text-xl font-bold text-white mt-6 mb-3 font-sans border-b border-zinc-900 pb-2" {...props} />,
                    h2: ({ ...props }) => <h4 className="text-lg font-bold text-white mt-5 mb-2 font-sans" {...props} />,
                    h3: ({ ...props }) => <h5 className="text-md font-semibold text-zinc-200 mt-4 mb-2 font-sans" {...props} />,
                    p: ({ ...props }) => <p className="mb-4 text-zinc-300" {...props} />,
                    ul: ({ ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1 text-zinc-300" {...props} />,
                    ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-zinc-300" {...props} />,
                    li: ({ ...props }) => <li className="mb-1" {...props} />,
                    code: ({ inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <pre className="bg-black border border-zinc-900 p-4 rounded-md overflow-x-auto text-xs font-mono text-amber-400/90 my-4 shadow-inner">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      ) : (
                        <code className="bg-zinc-900 text-amber-400 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                    blockquote: ({ ...props }) => <blockquote className="border-l-4 border-amber-500 pl-4 italic text-zinc-400 my-4 bg-zinc-950/40 p-3 rounded" {...props} />
                  }}
                >
                  {aiAnalysis}
                </Markdown>
              </div>
            ) : (
              <div className="text-center py-20 bg-zinc-950/40 border border-zinc-900 rounded-lg flex flex-col items-center justify-center p-6">
                <Sparkles className="w-12 h-12 text-zinc-700 mb-4 stroke-[1.5]" />
                <h3 className="text-sm font-semibold text-zinc-300 font-sans">No Threat Assessment Generated</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-2 text-center leading-relaxed">
                  Click the "Refresh Intelligence" button to run your geolocated threat data through Gemini and generate active defensive countermeasures.
                </p>
                <button
                  onClick={() => handleAnalyzeThreats()}
                  className="mt-5 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold rounded text-white flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Analyze Threat Snapshot
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-zinc-950 bg-black py-8 px-4 text-center text-[10px] font-mono text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p>
            Secured via local Fail2Ban & Server-Side IP Intelligence proxying.
          </p>
          <p className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            Active Target: mail.aucdt.edu.gh (Accra, Ghana)
          </p>
        </div>
      </footer>

      {/* Firewall Rules Generator Modal */}
      <AnimatePresence>
        {mitigationIp && currentMitigationIpData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMitigationIp(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#0a0a0c] border border-zinc-800/80 rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col font-sans text-left"
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-900 flex items-center justify-between bg-[#0e0e11]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-red-800/30 flex items-center justify-center text-red-400">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      Firewall Mitigation & Block Generator
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      Generate host-level blocks for packet filtering
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMitigationIp(null)}
                  className="text-zinc-500 hover:text-zinc-200 p-1.5 hover:bg-zinc-900 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 space-y-6 overflow-y-auto max-h-[70vh]">
                {/* IP Intel Context Badge Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg">
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">IP Address</span>
                    <span className="text-xs font-bold text-red-400 font-mono mt-0.5 block">{currentMitigationIpData.ip}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">Threat Origin</span>
                    <span className="text-xs font-semibold text-zinc-200 mt-0.5 flex items-center gap-1.5">
                      {getFlagEmoji(currentMitigationIpData.countryCode || "")}
                      <span>{currentMitigationIpData.country || "Unknown"}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">Triggered Jail</span>
                    <span className="text-xs font-mono text-amber-500 mt-0.5 block">
                      {currentMitigationIpData.jail}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">ISP / Autonomous System</span>
                    <span className="text-xs text-zinc-400 mt-0.5 block truncate">
                      {currentMitigationIpData.isp || "Unresolved Provider"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono tracking-wider">Threat Density</span>
                    <span className="text-xs font-mono text-red-400 font-bold mt-0.5 block">
                      {getIpAttackCount(currentMitigationIpData.ip)} attempts
                    </span>
                  </div>
                </div>

                {/* Rule Tabs */}
                <div className="space-y-3">
                  <label className="text-xs text-zinc-400 font-medium font-sans">
                    Select Packet Filtering Engine
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-lg">
                    {[
                      { id: "ufw", label: "UFW (Ubuntu)" },
                      { id: "iptables", label: "iptables (Raw)" },
                      { id: "firewalld", label: "Firewalld" },
                      { id: "nginx", label: "Nginx Block" },
                      { id: "fail2ban", label: "Fail2Ban banip" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveRuleTab(tab.id as any)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all cursor-pointer ${
                          activeRuleTab === tab.id
                            ? "bg-zinc-900 text-white border border-zinc-800"
                            : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generated Command Term Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-semibold font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Generated Command
                    </span>
                    <button
                      onClick={() => {
                        const commands = {
                          ufw: `# Block all incoming traffic from this threat source\nsudo ufw deny from ${currentMitigationIpData.ip} to any`,
                          iptables: `# Inject packet-filtering rule at the top of INPUT chain\nsudo iptables -I INPUT 1 -s ${currentMitigationIpData.ip} -j DROP\n\n# Save rules permanently\nsudo iptables-save`,
                          firewalld: `# Add permanent rich-rule rejecting traffic from IP\nsudo firewall-cmd --permanent --add-rich-rule="rule family='ipv4' source address='${currentMitigationIpData.ip}' reject"\nsudo firewall-cmd --reload`,
                          nginx: `# Add to nginx configuration context /etc/nginx/conf.d/blockips.conf\ndeny ${currentMitigationIpData.ip};`,
                          fail2ban: `# Manually enforce jail ban client-side\nfail2ban-client set ${currentMitigationIpData.jail} banip ${currentMitigationIpData.ip}`
                        };
                        const handleCopy = (text: string) => {
                          navigator.clipboard.writeText(text);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        };
                        handleCopy(commands[activeRuleTab]);
                      }}
                      className="px-2.5 py-1 text-[10px] font-mono border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-zinc-400 hover:text-zinc-100 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Command</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Console Box */}
                  <div className="relative rounded-lg border border-zinc-900 bg-black p-4 font-mono text-xs overflow-x-auto shadow-inner">
                    <span className="absolute top-2 right-2 text-[9px] text-zinc-700 font-mono uppercase select-none">Shell</span>
                    <pre className="text-amber-500/90 leading-relaxed">
                      {activeRuleTab === "ufw" && (
                        <>
                          <span className="text-zinc-600"># Block all incoming traffic from this threat source</span>{"\n"}
                          <span className="text-zinc-400">sudo</span> ufw deny from <span className="text-red-400 font-bold">{currentMitigationIpData.ip}</span> to any
                        </>
                      )}
                      {activeRuleTab === "iptables" && (
                        <>
                          <span className="text-zinc-600"># Inject packet-filtering rule at the top of INPUT chain</span>{"\n"}
                          <span className="text-zinc-400">sudo</span> iptables -I INPUT 1 -s <span className="text-red-400 font-bold">{currentMitigationIpData.ip}</span> -j DROP{"\n\n"}
                          <span className="text-zinc-600"># Save rules permanently</span>{"\n"}
                          <span className="text-zinc-400">sudo</span> iptables-save
                        </>
                      )}
                      {activeRuleTab === "firewalld" && (
                        <>
                          <span className="text-zinc-600"># Add permanent rich-rule rejecting traffic from IP</span>{"\n"}
                          <span className="text-zinc-400">sudo</span> firewall-cmd --permanent --add-rich-rule=<span className="text-emerald-500">"rule family='ipv4' source address='{currentMitigationIpData.ip}' reject"</span>{"\n"}
                          <span className="text-zinc-400">sudo</span> firewall-cmd --reload
                        </>
                      )}
                      {activeRuleTab === "nginx" && (
                        <>
                          <span className="text-zinc-600"># Add to nginx configuration context</span>{"\n"}
                          <span className="text-amber-600 font-semibold">deny</span> <span className="text-red-400 font-bold">{currentMitigationIpData.ip}</span>;
                        </>
                      )}
                      {activeRuleTab === "fail2ban" && (
                        <>
                          <span className="text-zinc-600"># Manually enforce jail ban client-side</span>{"\n"}
                          <span className="text-zinc-400">fail2ban-client</span> set <span className="text-amber-500 font-semibold">{currentMitigationIpData.jail}</span> banip <span className="text-red-400 font-bold">{currentMitigationIpData.ip}</span>
                        </>
                      )}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-4 bg-[#0e0e11] border-t border-zinc-900 flex justify-between items-center gap-4">
                <span className="text-[10px] text-zinc-500 font-mono max-w-sm leading-relaxed">
                  Applying the block simulates active firewall enforcement and purges the threat vector from current dashboards.
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMitigationIp(null)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono rounded-lg cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeployMitigation(currentMitigationIpData.ip)}
                    className="px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800/60 text-red-400 hover:text-white text-xs font-mono rounded-lg cursor-pointer transition-all flex items-center gap-1.5 font-bold shadow-lg shadow-red-950/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Simulate Block</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Threat Toast Notification & Visual Edge Pulse Alert */}
      <SecurityAlertSystem
        alerts={highRiskAlerts}
        onDismissAlert={handleDismissAlert}
        onDismissAll={handleDismissAllAlerts}
        onLocate={handleLocateAlertIp}
        onBlock={handleBlockAlertIp}
        isPulsing={isViewportPulsing}
        onTogglePulse={() => setIsViewportPulsing(prev => !prev)}
      />
    </div>
  );
}
