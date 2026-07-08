import React, { useState, useMemo, useEffect } from "react";
import { IPData, getIpAttackCount } from "../types";
import { Search, SlidersHorizontal, ArrowUpDown, ChevronDown, Trash2, ShieldAlert, Globe, Loader2 } from "lucide-react";

interface IPTableProps {
  ipsData: IPData[];
  onRemoveIp?: (ip: string) => void;
  highlightedIp?: string | null;
  onHighlightIp?: (ip: string | null) => void;
  mitigationMode?: boolean;
  onMitigate?: (ip: string) => void;
}

// Convert country code to emoji flag
export function getFlagEmoji(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return "🏳️";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "🏳️";
  }
}

// Colors representing Jails
const JAIL_PILL_COLORS: Record<string, string> = {
  ssh: "bg-blue-950/40 text-blue-400 border-blue-900/30",
  "plesk-panel": "bg-emerald-950/40 text-emerald-400 border-emerald-900/30",
  "plesk-postfix": "bg-amber-950/40 text-amber-400 border-amber-900/30",
  "plesk-modsecurity": "bg-red-950/40 text-red-400 border-red-900/30",
  other: "bg-purple-950/40 text-purple-400 border-purple-900/30"
};

type SortField = "ip" | "jail" | "country" | "city";
type SortOrder = "asc" | "desc";

export default function IPTable({ ipsData, onRemoveIp, highlightedIp, onHighlightIp, mitigationMode = false, onMitigate }: IPTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJail, setSelectedJail] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("ip");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // WHOIS investigation states
  const [whoisData, setWhoisData] = useState<Record<string, any>>({});
  const [loadingWhois, setLoadingWhois] = useState<Record<string, boolean>>({});
  const [errorWhois, setErrorWhois] = useState<Record<string, string>>({});
  const [expandedWhoisIp, setExpandedWhoisIp] = useState<string | null>(null);

  const handleWhoisLookup = async (ip: string) => {
    if (expandedWhoisIp === ip) {
      setExpandedWhoisIp(null);
      return;
    }

    setExpandedWhoisIp(ip);

    if (whoisData[ip]) {
      return;
    }

    setLoadingWhois(prev => ({ ...prev, [ip]: true }));
    setErrorWhois(prev => ({ ...prev, [ip]: "" }));

    try {
      const response = await fetch(`https://ipwho.is/${ip}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.success === false) {
        throw new Error(data.message || "Failed to fetch WHOIS info");
      }
      setWhoisData(prev => ({ ...prev, [ip]: data }));
    } catch (err: any) {
      console.error("WHOIS fetch error:", err);
      setErrorWhois(prev => ({ ...prev, [ip]: err.message || "Unable to fetch WHOIS data" }));
    } finally {
      setLoadingWhois(prev => ({ ...prev, [ip]: false }));
    }
  };

  // Scroll highlighted row into view when it changes
  useEffect(() => {
    if (highlightedIp) {
      const element = document.getElementById(`row-ip-${highlightedIp}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedIp]);

  // Get list of unique jails
  const uniqueJails = useMemo(() => {
    return Array.from(new Set(ipsData.map(ip => ip.jail).filter(Boolean)));
  }, [ipsData]);

  // Sort and filter the IP list
  const processedIps = useMemo(() => {
    let result = [...ipsData];

    // Filter by search query
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        item =>
          item.ip.toLowerCase().includes(query) ||
          (item.country && item.country.toLowerCase().includes(query)) ||
          (item.city && item.city.toLowerCase().includes(query)) ||
          (item.isp && item.isp.toLowerCase().includes(query)) ||
          item.jail.toLowerCase().includes(query)
      );
    }

    // Filter by Jail type
    if (selectedJail !== "all") {
      result = result.filter(item => item.jail === selectedJail);
    }

    // Apply Sorting
    result.sort((a, b) => {
      let valA = "";
      let valB = "";

      switch (sortField) {
        case "ip":
          // Simple natural sorting or string sorting for IP
          valA = a.ip;
          valB = b.ip;
          break;
        case "jail":
          valA = a.jail;
          valB = b.jail;
          break;
        case "country":
          valA = a.country || "";
          valB = b.country || "";
          break;
        case "city":
          valA = a.city || "";
          valB = b.city || "";
          break;
      }

      if (sortOrder === "asc") {
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      } else {
        return valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
      }
    });

    return result;
  }, [ipsData, searchTerm, selectedJail, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="bg-[#111] border border-zinc-800 rounded-lg overflow-hidden">
      {/* Table Title and Filters */}
      <div className="p-5 border-b border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-medium text-white tracking-tight flex items-center gap-2">
            All {ipsData.length} banned addresses
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Search, filter, or delete active threat blocks.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search IP, country, isp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-md pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>

          {/* Jail Dropdown */}
          <div className="relative">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedJail}
              onChange={(e) => setSelectedJail(e.target.value)}
              className="appearance-none bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-zinc-700 font-mono cursor-pointer"
            >
              <option value="all">All Jails</option>
              {uniqueJails.map(jail => (
                <option key={jail} value={jail}>{jail}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Actual Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-950 border-b border-zinc-900 text-zinc-400 text-[10px] font-mono uppercase tracking-wider">
              <th 
                onClick={() => handleSort("ip")} 
                className="p-4 cursor-pointer hover:bg-zinc-900/60 select-none"
              >
                <div className="flex items-center gap-1.5">
                  IP Address <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("jail")} 
                className="p-4 cursor-pointer hover:bg-zinc-900/60 select-none"
              >
                <div className="flex items-center gap-1.5">
                  Jail <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("country")} 
                className="p-4 cursor-pointer hover:bg-zinc-900/60 select-none"
              >
                <div className="flex items-center gap-1.5">
                  Country <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th 
                onClick={() => handleSort("city")} 
                className="p-4 cursor-pointer hover:bg-zinc-900/60 select-none"
              >
                <div className="flex items-center gap-1.5">
                  City / Note <ArrowUpDown className="w-3 h-3 text-zinc-500" />
                </div>
              </th>
              <th className="p-4 text-center select-none print:hidden w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 text-xs font-mono">
            {processedIps.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-zinc-500 font-mono italic">
                  No matching banned addresses found.
                </td>
              </tr>
            ) : (
              processedIps.map((item, index) => {
                const jailClass = JAIL_PILL_COLORS[item.jail] || JAIL_PILL_COLORS.other;
                const isHighlighted = highlightedIp === item.ip;
                const attackCount = getIpAttackCount(item.ip);
                const isHighFrequency = attackCount >= 8;
                const highlightWarning = mitigationMode && isHighFrequency;
                return (
                  <React.Fragment key={`${item.ip}-${index}`}>
                    <tr 
                      id={`row-ip-${item.ip}`}
                      onClick={() => onHighlightIp?.(isHighlighted ? null : item.ip)}
                      className={`group cursor-pointer border-l-2 transition-all duration-300 ${
                        highlightWarning
                          ? "bg-red-950/15 border-l-red-500 hover:bg-red-950/25 ring-1 ring-red-500/10"
                          : isHighlighted 
                            ? "bg-amber-500/10 border-l-amber-500 hover:bg-amber-500/15" 
                            : "hover:bg-zinc-900/20 border-l-transparent"
                      }`}
                    >
                      <td className={`p-4 font-semibold transition-colors duration-250 ${
                        highlightWarning
                          ? "text-red-400"
                          : isHighlighted ? "text-amber-400" : "text-zinc-200"
                      }`}>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5">
                            {item.ip}
                            {highlightWarning && (
                              <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" />
                            )}
                          </span>
                          {mitigationMode && (
                            <span className={`text-[9px] font-mono mt-0.5 font-normal tracking-wide ${
                              isHighFrequency ? "text-red-400 font-bold" : "text-zinc-500"
                            }`}>
                              {attackCount} login failures
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${jailClass}`}>
                          {item.jail}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-300">
                        {item.status === "pending" ? (
                          <span className="text-zinc-600 animate-pulse">resolving...</span>
                        ) : item.status === "fail" ? (
                          <span className="text-zinc-500 italic">Unresolved</span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <span>{getFlagEmoji(item.countryCode)}</span>
                            <span className="text-[10px] text-zinc-500">{item.countryCode}</span>
                            <span className="font-sans text-xs">{item.country}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-zinc-400">
                        <span className="font-sans text-xs">
                          {item.city || "—"}
                          {item.note && (
                            <span className="text-[10px] text-zinc-600 ml-1 font-mono">
                              ({item.note})
                            </span>
                          )}
                          {item.isp && !item.note && (
                            <span className="text-[10px] text-zinc-600 block truncate max-w-[200px] font-mono mt-0.5">
                              {item.isp}
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-center print:hidden">
                        <div className="flex items-center justify-center gap-2">
                          {/* WHOIS Lookup Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWhoisLookup(item.ip);
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer ${
                              expandedWhoisIp === item.ip
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30"
                                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
                            }`}
                            title={`Look up WHOIS and ISP registration details for ${item.ip}`}
                          >
                            {loadingWhois[item.ip] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                            ) : (
                              <Globe className="w-3.5 h-3.5" />
                            )}
                            <span>WHOIS</span>
                          </button>

                          {mitigationMode && isHighFrequency && onMitigate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMitigate(item.ip);
                              }}
                              className="bg-red-950/85 hover:bg-red-900 text-red-400 border border-red-800/60 px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                              title={`Generate firewall block rules for ${item.ip}`}
                            >
                              <ShieldAlert className="w-3.5 h-3.5" />
                              <span>Block Rule</span>
                            </button>
                          )}
                          {onRemoveIp && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveIp(item.ip);
                              }}
                              className="text-zinc-600 hover:text-red-400 p-1.5 rounded hover:bg-zinc-900/80 transition-colors cursor-pointer"
                              title="Remove ban entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedWhoisIp === item.ip && (
                      <tr className="bg-zinc-950/60 border-b border-zinc-900" id={`row-whois-details-${item.ip}`}>
                        <td colSpan={5} className="p-5">
                          <div className="border border-zinc-800/80 rounded-md bg-zinc-950 p-4 space-y-4 shadow-inner max-w-4xl mx-auto">
                            {/* Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                                <Globe className="w-3.5 h-3.5" /> Real-time WHOIS & ISP Record
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                IP: {item.ip}
                              </span>
                            </div>

                            {loadingWhois[item.ip] ? (
                              <div className="flex flex-col items-center justify-center py-6 gap-2 text-zinc-400">
                                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                                <span className="text-xs font-mono text-zinc-500">Querying real-time WHOIS registries...</span>
                              </div>
                            ) : errorWhois[item.ip] ? (
                              <div className="flex flex-col items-center justify-center py-4 gap-2 text-red-400">
                                <span className="text-xs text-red-500 font-mono">Error: {errorWhois[item.ip]}</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const { [item.ip]: _, ...restData } = whoisData;
                                    setWhoisData(restData);
                                    handleWhoisLookup(item.ip);
                                  }}
                                  className="px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 rounded transition-colors cursor-pointer"
                                >
                                  Retry Lookup
                                </button>
                              </div>
                            ) : whoisData[item.ip] ? (() => {
                              const data = whoisData[item.ip];
                              const isp = data?.connection?.isp || data?.isp || "N/A";
                              const org = data?.connection?.org || data?.org || "N/A";
                              const asn = data?.connection?.asn || data?.asn || "N/A";
                              const domain = data?.connection?.domain || "N/A";
                              const type = data?.type || "IPv4";
                              const country = data?.country || "N/A";
                              const region = data?.region || "N/A";
                              const city = data?.city || "N/A";
                              const timezone = data?.timezone?.id || "N/A";
                              const utcOffset = data?.timezone?.utc || "";
                              const currentLocalTime = data?.timezone?.current_time ? new Date(data.timezone.current_time).toLocaleTimeString() : "";

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                                  {/* ISP & Connection Info */}
                                  <div className="bg-zinc-900/40 p-3 border border-zinc-900 rounded space-y-2">
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide border-b border-zinc-900 pb-1">ISP & Network</h4>
                                    <div className="space-y-1">
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">ISP:</span> <span className="text-zinc-300 font-semibold text-right truncate max-w-[180px]" title={isp}>{isp}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">Org:</span> <span className="text-zinc-300 text-right truncate max-w-[180px]" title={org}>{org}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">ASN:</span> <span className="text-amber-500 font-bold">{asn}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">Domain:</span> <span className="text-blue-400 underline truncate max-w-[180px]">{domain !== "N/A" ? <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">{domain}</a> : "N/A"}</span></div>
                                    </div>
                                  </div>

                                  {/* Geo Location details */}
                                  <div className="bg-zinc-900/40 p-3 border border-zinc-900 rounded space-y-2">
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide border-b border-zinc-900 pb-1">Geographic Data</h4>
                                    <div className="space-y-1">
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">Country:</span> <span className="text-zinc-300 flex items-center gap-1"><span>{data?.flag?.emoji}</span> {country}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">Region:</span> <span className="text-zinc-300">{region}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">City:</span> <span className="text-zinc-300">{city}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">Coordinates:</span> <span className="text-zinc-400 font-mono">{data?.latitude?.toFixed(4)}, {data?.longitude?.toFixed(4)}</span></div>
                                    </div>
                                  </div>

                                  {/* Technical Parameters */}
                                  <div className="bg-zinc-900/40 p-3 border border-zinc-900 rounded space-y-2 md:col-span-2 lg:col-span-1">
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide border-b border-zinc-900 pb-1">Metadata</h4>
                                    <div className="space-y-1">
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">IP Type:</span> <span className="text-zinc-300 font-bold uppercase">{type}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">Timezone:</span> <span className="text-zinc-300 truncate max-w-[150px]" title={timezone}>{timezone}</span></div>
                                      <div className="flex justify-between gap-2"><span className="text-zinc-500">UTC Offset:</span> <span className="text-zinc-300">{utcOffset}</span></div>
                                      {currentLocalTime && (
                                        <div className="flex justify-between gap-2"><span className="text-zinc-500">Local Time:</span> <span className="text-zinc-300">{currentLocalTime}</span></div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })() : (
                              <div className="text-center text-zinc-600 italic py-2">No information loaded.</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination / Record count status */}
      <div className="p-4 bg-zinc-950/40 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
        <span>
          Showing {processedIps.length} of {ipsData.length} entries
        </span>
        <span>
          Filter Status: {selectedJail !== "all" ? `Jail: ${selectedJail}` : "All Active Jails"}
        </span>
      </div>
    </div>
  );
}
