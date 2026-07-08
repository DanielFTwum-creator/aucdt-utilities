import { useState, useRef, useEffect } from "react";
import { Upload, ClipboardList, AlertCircle, RefreshCw, FileCode } from "lucide-react";
import { MOCK_FAIL2BAN_LOGS } from "../data";

interface LogParserProps {
  onParseComplete: (parsedData: { ip: string; jail: string; logLine?: string; timestamp?: string }[]) => void;
  isProcessing: boolean;
  processingProgress: number;
  processingLogs: string[];
  currentProcessingStep: string;
  totalIpsToProcess: number;
  processedIpsCount: number;
}

export default function LogParser({ 
  onParseComplete, 
  isProcessing,
  processingProgress,
  processingLogs,
  currentProcessingStep,
  totalIpsToProcess,
  processedIpsCount
}: LogParserProps) {
  const [inputText, setInputText] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [defaultJail, setDefaultJail] = useState("ssh");
  const [autoDetectJails, setAutoDetectJails] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [processingLogs]);

  // Parse list of IPs or raw log content
  const handleParse = (text: string) => {
    setError(null);
    if (!text.trim()) {
      setError("Please paste some logs or IPs to map.");
      return;
    }

    // Standard IPv4 regex matching
    const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
    const lines = text.split("\n");
    const results: { ip: string; jail: string; logLine?: string; timestamp?: string }[] = [];
    const uniqueIps = new Set<string>();

    lines.forEach(line => {
      const match = line.match(ipRegex);
      if (match) {
        match.forEach(ip => {
          // Validate IP octets (each must be 0-255)
          const parts = ip.split(".");
          const isValidIp = parts.every(part => {
            const num = parseInt(part, 10);
            return num >= 0 && num <= 255;
          });

          if (isValidIp && !uniqueIps.has(ip)) {
            uniqueIps.add(ip);
            
            let detectedJail = defaultJail;
            
            // Extract any word following the IP that could be a jail name (e.g. "36.255.220.145   ssh")
            const lineWithoutIp = line.replace(ip, "").trim();
            // Match any alphanumeric or hyphenated word like "plesk-modsecurity", "ssh", "postfix"
            const jailWordMatch = lineWithoutIp.match(/\b([a-zA-Z0-9_-]+)\b/);
            
            if (jailWordMatch && jailWordMatch[1] && !["ban", "found", "info", "notice", "warn", "fail2ban", "found", "creating", "new", "jail"].includes(jailWordMatch[1].toLowerCase())) {
              detectedJail = jailWordMatch[1];
            } else if (autoDetectJails) {
              // Try to auto-detect jail from the log line keywords
              const lineLower = line.toLowerCase();
              if (lineLower.includes("plesk-panel") || lineLower.includes("plesk_panel") || lineLower.includes("panel")) {
                detectedJail = "plesk-panel";
              } else if (lineLower.includes("postfix") || lineLower.includes("postfix-jail") || lineLower.includes("mail")) {
                detectedJail = "plesk-postfix";
              } else if (lineLower.includes("modsecurity") || lineLower.includes("mod-sec") || lineLower.includes("waf")) {
                detectedJail = "plesk-modsecurity";
              } else if (lineLower.includes("ssh") || lineLower.includes("sshd") || lineLower.includes("auth")) {
                detectedJail = "ssh";
              } else {
                // Check if there is a Fail2Ban style bracket jail name: [nginx-http-auth]
                const f2bJailMatch = line.match(/\[([^\]]+)\]/);
                if (f2bJailMatch && f2bJailMatch[1] && f2bJailMatch[1] !== "4521") {
                  detectedJail = f2bJailMatch[1];
                }
              }
            }

            // Detect timestamp from log line
            let detectedTimestamp: string | undefined = undefined;
            const isoDateTimeRegex = /(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2})/;
            const syslogDateTimeRegex = /([A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})/;
            
            const isoMatch = line.match(isoDateTimeRegex);
            const syslogMatch = line.match(syslogDateTimeRegex);
            
            if (isoMatch) {
              detectedTimestamp = isoMatch[1];
            } else if (syslogMatch) {
              detectedTimestamp = syslogMatch[1];
            } else {
              // Fallback: Randomize a time in the last 24 hours
              const hoursAgo = Math.random() * 24;
              const date = new Date(Date.now() - hoursAgo * 3600 * 1000);
              detectedTimestamp = date.toISOString().replace('T', ' ').substring(0, 19);
            }

            results.push({
              ip,
              jail: detectedJail,
              logLine: line.substring(0, 200), // Keep snippet of log line for context
              timestamp: detectedTimestamp
            });
          }
        });
      }
    });

    if (results.length === 0) {
      setError("No valid IP addresses could be found in the provided input. Check your logs/text.");
      return;
    }

    onParseComplete(results);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    try {
      const isGzip = file.name.endsWith(".gz") || 
                     file.type === "application/x-gzip" || 
                     file.type === "application/gzip";

      if (isGzip) {
        // Modern web native decompression stream for GZIP
        if (typeof DecompressionStream !== "undefined") {
          const ds = new DecompressionStream("gzip");
          const decompressedStream = file.stream().pipeThrough(ds);
          const response = new Response(decompressedStream);
          const text = await response.text();
          setInputText(text);
          handleParse(text);
        } else {
          setError("Your browser does not support native gzip decompression (DecompressionStream).");
        }
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === "string") {
            setInputText(text);
            handleParse(text);
          }
        };
        reader.onerror = () => {
          setError("Could not read uploaded log file.");
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      console.error(err);
      setError(`Failed to decompress and read gzip file: ${err?.message || "Unknown error"}`);
    }
  };

  const loadSample = () => {
    setInputText(MOCK_FAIL2BAN_LOGS);
    handleParse(MOCK_FAIL2BAN_LOGS);
  };

  if (isProcessing) {
    return (
      <div id="log-parser-processing-overlay" className="bg-[#111] border border-amber-500/30 p-6 rounded-lg mb-6 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 pb-4 mb-5 gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              SEC-OPS Geolocation Batch Resolution Monitor
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
              Active Operation: {currentProcessingStep || "Initializing Pipeline..."}
            </p>
          </div>
          <div className="text-right flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 font-mono">
              TOTAL COMPLETED:
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {processedIpsCount} / {totalIpsToProcess} Targets
            </span>
          </div>
        </div>

        {/* Progress Bar & Numeric Gauge */}
        <div className="mb-5 bg-zinc-950 p-4 rounded-md border border-zinc-900">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2">
            <span>PIPELINE CAPACITY</span>
            <span className="text-amber-400 font-bold">{processingProgress}%</span>
          </div>
          <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div 
              className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-zinc-600 font-mono mt-2">
            <span>[STAGE_1: RESOLVE]</span>
            <span>[STAGE_2: TRACE]</span>
            <span>[STAGE_3: RENDER]</span>
          </div>
        </div>

        {/* Terminal Log Console */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between bg-zinc-900 px-3.5 py-1.5 rounded-t-md border border-zinc-800 border-b-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-[10px] text-zinc-500 font-mono font-semibold uppercase tracking-wider ml-1">secops@fail2ban-analyzer: ~</span>
            </div>
            <span className="text-[10px] text-zinc-600 font-mono">UTF-8 SESSION</span>
          </div>
          
          <div 
            ref={logTerminalRef}
            className="bg-zinc-950 border border-zinc-800 rounded-b-md p-4 h-56 overflow-y-auto font-mono text-[11px] text-zinc-400 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          >
            {processingLogs && processingLogs.length > 0 ? (
              processingLogs.map((log, index) => {
                let colorClass = "text-zinc-400";
                if (log.includes("[OK]")) colorClass = "text-emerald-400";
                else if (log.includes("[WARN]")) colorClass = "text-amber-400";
                else if (log.includes("[INIT]")) colorClass = "text-blue-400";
                else if (log.includes("[QUERY]")) colorClass = "text-indigo-400 text-light";
                else if (log.includes("[THREAT]")) colorClass = "text-cyan-400";
                else if (log.includes("[FATAL]")) colorClass = "text-red-400 font-bold";
                else if (log.includes("└─")) colorClass = "text-zinc-500 pl-4";

                return (
                  <div key={index} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                    {log}
                  </div>
                );
              })
            ) : (
              <div className="text-zinc-600 italic">Establishing pipeline links...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="log-parser-section" className="bg-[#111] border border-zinc-800 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-medium text-white tracking-tight flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-zinc-400" />
        Analyze log files & IP lists
      </h2>
      <p className="text-xs text-zinc-400 mt-1 mb-5">
        Upload security logs (Fail2Ban, ssh auth, web server logs) or paste raw IP addresses to geolocate and map.
      </p>

      {/* Grid with Text input and Drag&Drop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Left: Textarea Paste */}
        <div className="lg:col-span-8 flex flex-col h-64">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw log data or IPs here (one per line)...&#10;Example:&#10;2026-07-03 10:15:02,510 fail2ban.actions[4521]: NOTICE [ssh] Ban 36.255.228.145&#10;192.168.1.100, 8.8.8.8, 1.1.1.1"
            className="w-full h-full bg-zinc-950 border border-zinc-800 text-zinc-200 p-4 rounded-md text-xs font-mono focus:outline-none focus:border-zinc-700 resize-none placeholder-zinc-700"
          />
        </div>

        {/* Right: Drag and Drop & Options */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4">
          
          {/* File Upload Box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed p-6 rounded-md flex flex-col items-center justify-center text-center cursor-pointer transition-all h-40 ${
              dragActive
                ? "border-amber-500 bg-amber-950/10 text-amber-400"
                : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            }`}
          >
            <Upload className="w-8 h-8 mb-2 opacity-80" />
            <span className="text-xs font-semibold">Drag & Drop Log File</span>
            <span className="text-[10px] text-zinc-600 font-mono mt-1">Supports .log, .txt, .gz, .log.gz</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".log,.txt,.gz,.log.gz,text/*,application/gzip,application/x-gzip"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Settings Grid */}
          <div className="bg-zinc-950 p-4 rounded-md border border-zinc-900 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="text-zinc-400 font-mono">Auto-detect Jails</label>
              <input
                type="checkbox"
                checked={autoDetectJails}
                onChange={(e) => setAutoDetectJails(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-900 text-amber-500 focus:ring-transparent h-4 w-4"
              />
            </div>

            {!autoDetectJails && (
              <div className="flex items-center justify-between text-xs gap-3">
                <label className="text-zinc-500 font-mono">Fallback Jail:</label>
                <select
                  value={defaultJail}
                  onChange={(e) => setDefaultJail(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-zinc-700"
                >
                  <option value="ssh">ssh</option>
                  <option value="plesk-panel">plesk-panel</option>
                  <option value="plesk-postfix">plesk-postfix</option>
                  <option value="http-auth">http-auth</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer controls: Parse button, sample loader */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-3 border-t border-zinc-900">
        
        {/* Sample loader */}
        <button
          onClick={loadSample}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-mono bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
        >
          <FileCode className="w-3.5 h-3.5" />
          Load Fail2Ban Sample
        </button>

        {/* Process button */}
        <button
          onClick={() => handleParse(inputText)}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded text-xs font-sans font-medium bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Resolving Geolocation IPs...
            </>
          ) : (
            <>
              Parse & Map Logs
            </>
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 mt-4 text-xs font-mono text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
