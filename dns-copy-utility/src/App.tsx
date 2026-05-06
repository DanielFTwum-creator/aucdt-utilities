import { Check, Copy, RotateCcw, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { CopyCell } from "./components/CopyCell";
import { NEW_DOMAIN as DEFAULT_NEW, OLD_DOMAIN as DEFAULT_OLD, RAW_RECORDS, TYPE_COLORS } from "./constants";
import "./styles/global.css";
import type { DNSType } from "./types";

const App: React.FC = () => {
  const [oldDomain, setOldDomain] = useState(DEFAULT_OLD);
  const [newDomain, setNewDomain] = useState(DEFAULT_NEW);
  const [filter, setFilter] = useState<DNSType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);

  const records = useMemo(() => {
    return RAW_RECORDS.map(r => ({
      ...r,
      name: r.name.replaceAll("OLD_DOMAIN", newDomain).replaceAll(oldDomain, newDomain),
      content: r.content.replaceAll("OLD_DOMAIN", newDomain).replaceAll(oldDomain, newDomain),
    }));
  }, [oldDomain, newDomain]);

  const filtered = useMemo(() => {
    return records.filter(r => {
      const matchesFilter = filter === "ALL" || r.type === filter;
      const matchesSearch = searchTerm === "" || 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [records, filter, searchTerm]);

  const copyAll = async () => {
    const text = filtered.map(r =>
      `${r.type}\t${r.name}\t${r.content}\t${r.ttl}`
    ).join("\n");
    await navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const resetDomains = () => {
    setOldDomain(DEFAULT_OLD);
    setNewDomain(DEFAULT_NEW);
  };

  const recordTypes: (DNSType | "ALL")[] = ["ALL", "A", "CNAME", "MX", "NS", "TXT"];

  return (
    <div className="min-h-screen p-8 sm:p-12 custom-scrollbar">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/20">
                🌐
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white">DNS Copier</h1>
                <p className="text-slate-400 font-medium">Domain migration record utility</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Old Domain</label>
              <input 
                value={oldDomain} 
                onChange={(e) => setOldDomain(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Old domain..."
              />
            </div>
            <div className="flex flex-col gap-1.5 min-w-[200px]">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">New Domain</label>
              <input 
                value={newDomain} 
                onChange={(e) => setNewDomain(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="New domain..."
              />
            </div>
            <button 
              onClick={resetDomains}
              className="mt-auto p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white transition-colors"
              title="Reset Domains"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </header>

        {/* Controls Bar */}
        <div className="mb-8 flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <div className="flex gap-2 flex-wrap justify-center">
            {recordTypes.map(t => {
              const count = t === "ALL" ? records.length : records.filter(r => r.type === t).length;
              const isActive = filter === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 border ${
                    isActive 
                    ? "bg-blue-500 border-transparent text-white shadow-lg shadow-blue-500/20" 
                    : "bg-transparent border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300"
                  }`}
                >
                  {t} <span className={`ml-1 ${isActive ? "text-blue-200" : "text-slate-600"}`}>({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name or content..."
                className="w-full lg:w-64 bg-black/20 border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
              />
            </div>
            <button
              onClick={copyAll}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-200 shrink-0 ${
                copiedAll 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10"
              }`}
            >
              {copiedAll ? <Check size={14} /> : <Copy size={14} />}
              {copiedAll ? "COPIED" : "COPY TSV"}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-3xl border border-white/5 overflow-hidden bg-black/10 shadow-2xl overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                {["Type", "Name", "Content", "TTL"].map((h, i) => (
                  <th key={h} className={`px-4 py-5 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 ${
                    i === 0 ? "w-24 pl-6" : ""
                  }`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec, idx) => {
                const style = TYPE_COLORS[rec.type];
                return (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-4 py-3 border-b border-white/5 pl-6">
                      <span 
                        className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-widest border"
                        style={{ 
                          backgroundColor: `${style.bg}15`, 
                          color: style.text, 
                          borderColor: `${style.border}33` 
                        }}
                      >
                        {rec.type}
                      </span>
                      {rec.extra && (
                        <div className="mt-1 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{rec.extra}</div>
                      )}
                    </td>
                    <CopyCell value={rec.name} />
                    <CopyCell value={rec.content} />
                    <td className="px-4 py-3 border-b border-white/5 font-mono text-xs text-slate-500 tabular-nums">
                      {rec.ttl}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="py-20 text-center text-slate-500 italic font-medium">
              No records found matching your current filter/search.
            </div>
          )}
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-600 font-medium">
            💡 Click any <span className="text-slate-400">Name</span> or <span className="text-slate-400">Content</span> cell to copy individually.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
