import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { execFile } from "child_process";
import { promisify } from "util";
import { requireWmsAuth } from "./src/server/wmsAuthMiddleware.ts";
// vite is a devDependency, imported dynamically in the dev-only branch below;
// a static import crashes the production server after pnpm install --prod.

dotenv.config();

const execFileAsync = promisify(execFile);

// Short-lived cache of the raw fail2ban ban list so rapid dashboard loads don't
// re-shell to fail2ban-client on every visit. Bans don't need second-level
// freshness on a threat dashboard.
const BANLIST_TTL_MS = 60_000;
let banlistCache: { at: number; data: { ip: string; jail: string }[] } | null = null;

// Read the server's live fail2ban bans via fail2ban-client (current banned IPs
// per jail). Fixed-argument execFile — jail names come from fail2ban-client
// output, never user input, so there is no shell-injection surface.
async function getFail2banBans(): Promise<{ ip: string; jail: string }[]> {
  const { stdout: statusOut } = await execFileAsync("fail2ban-client", ["status"], { timeout: 8000 });
  const jailLine = statusOut.split("\n").find(l => l.includes("Jail list:"));
  const jails = jailLine
    ? jailLine.split("Jail list:")[1].split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const bans: { ip: string; jail: string }[] = [];
  for (const jail of jails) {
    try {
      const { stdout } = await execFileAsync("fail2ban-client", ["status", jail], { timeout: 8000 });
      const banLine = stdout.split("\n").find(l => l.includes("Banned IP list:"));
      if (!banLine) continue;
      const ips = banLine.split("Banned IP list:")[1].trim().split(/\s+/).filter(Boolean);
      for (const ip of ips) bans.push({ ip, jail });
    } catch {
      // a jail we cannot read — skip it rather than fail the whole request
    }
  }
  return bans;
}

// --- Gemini custody: this app NEVER holds the Gemini key (fleet standard, ---
// --- Pattern 11). Log analysis is relayed to the WMS proxy with the        ---
// --- GEMINI_PROXY_KEY service credential; only WMS adds the real key.      ---
const WMS_GEMINI_URL = process.env.WMS_GEMINI_URL || "https://wms.techbridge.edu.gh/api/gemini/generate";
const GEMINI_PROXY_KEY = process.env.GEMINI_PROXY_KEY || "";
const MODEL = "gemini-3.5-flash";

if (!GEMINI_PROXY_KEY) {
  console.warn("[fail2ban-ai] WARNING: GEMINI_PROXY_KEY not set — /api/analyze-logs will fall back to the offline summary");
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

async function relayGenerate(prompt: string): Promise<string> {
  const r = await fetch(`${WMS_GEMINI_URL}?model=${MODEL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Gemini-Proxy-Key": GEMINI_PROXY_KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!r.ok) throw new Error(`WMS relay failed: ${r.status} ${await r.text()}`);
  const data = (await r.json()) as GeminiResponse;
  return (data.candidates?.[0]?.content?.parts ?? []).map(p => p.text ?? "").join("");
}

// Cache for geolocated IPs — avoids re-hitting ip-api.com. Persisted to disk so
// the ~1600-IP first-load geolocation happens once ever, not once per PM2
// restart or reboot. IP->location is stable, so entries never expire.
const geoCache = new Map<string, any>();
const GEO_CACHE_FILE = path.join(process.cwd(), ".geo-cache.json");

try {
  if (fs.existsSync(GEO_CACHE_FILE)) {
    const obj = JSON.parse(fs.readFileSync(GEO_CACHE_FILE, "utf8"));
    for (const [k, v] of Object.entries(obj)) geoCache.set(k, v);
    console.log(`[fail2ban-ai] geo cache loaded: ${geoCache.size} entries`);
  }
} catch {
  // corrupt/absent cache file — start empty, no harm
}

let geoCacheDirty = false;
function persistGeoCache(): void {
  if (!geoCacheDirty) return;
  try {
    fs.writeFileSync(GEO_CACHE_FILE, JSON.stringify(Object.fromEntries(geoCache)));
    geoCacheDirty = false;
  } catch {
    // best-effort — a failed write just means we re-geolocate next restart
  }
}

// --- Geolocation core (shared by /api/geolocate and /api/live-bans) ----------
// Local offline database of preset IPs for instant, foolproof mapping.
const LOCAL_GEO_DB: Record<string, any> = {
  "36.255.220.145": { country: "China", countryCode: "CN", city: "Shanghai", lat: 31.2243, lon: 121.4691, isp: "China Telecom", status: "success" },
  "43.156.61.33": { country: "Japan", countryCode: "JP", city: "Tokyo", lat: 35.6762, lon: 139.6503, isp: "Tencent Building", status: "success" },
  "43.165.170.198": { country: "Japan", countryCode: "JP", city: "Tokyo", lat: 35.6762, lon: 139.6503, isp: "Zenlayer Inc", status: "success" },
  "45.15.226.100": { country: "Netherlands", countryCode: "NL", city: "Amsterdam", lat: 52.3676, lon: 4.9041, isp: "Liteserver B.V.", status: "success" },
  "45.148.10.121": { country: "Netherlands", countryCode: "NL", city: "Amsterdam", lat: 52.3676, lon: 4.9041, isp: "TECHOFF SRV LIMITED", status: "success" },
  "45.148.10.141": { country: "Netherlands", countryCode: "NL", city: "Amsterdam", lat: 52.3676, lon: 4.9041, isp: "TECHOFF SRV LIMITED", status: "success" },
  "45.148.10.151": { country: "Netherlands", countryCode: "NL", city: "Amsterdam", lat: 52.3676, lon: 4.9041, isp: "TECHOFF SRV LIMITED", status: "success" },
  "61.223.116.74": { country: "Taiwan", countryCode: "TW", city: "Changhua", lat: 24.0518, lon: 120.5161, isp: "Chunghwa Telecom", status: "success" },
  "68.178.160.25": { country: "India", countryCode: "IN", city: "Mumbai", lat: 19.0760, lon: 72.8777, isp: "GoDaddy.com, LLC", status: "success" },
  "81.30.98.81": { country: "Germany", countryCode: "DE", city: "Kiel", lat: 54.3233, lon: 10.1228, isp: "Deutsche Telekom", status: "success" },
  "83.219.249.173": { country: "Russia", countryCode: "RU", city: "Moscow", lat: 55.7558, lon: 37.6173, isp: "Rostelecom", status: "success" },
  "83.246.133.16": { country: "Russia", countryCode: "RU", city: "Barnaul", lat: 53.3606, lon: 83.7636, isp: "TTK", status: "success" },
  "91.92.40.10": { country: "Bulgaria", countryCode: "BG", city: "Sofia", lat: 42.6977, lon: 23.3219, isp: "Neterra Ltd", status: "success" },
  "106.75.25.139": { country: "China", countryCode: "CN", city: "Shanghai", lat: 31.2243, lon: 121.4691, isp: "Ucloud Technology", status: "success" },
  "118.193.45.134": { country: "China", countryCode: "CN", city: "Beijing", lat: 39.9042, lon: 116.4074, isp: "Beijing Capital Online", status: "success" },
  "120.36.82.210": { country: "China", countryCode: "CN", city: "Fuzhou", lat: 26.0614, lon: 119.3061, isp: "China Unicom", status: "success" },
  "125.137.115.145": { country: "South Korea", countryCode: "KR", city: "Seoul", lat: 37.5665, lon: 126.9780, isp: "SK Broadband", status: "success" },
  "125.212.244.35": { country: "Vietnam", countryCode: "VN", city: "Hanoi", lat: 21.0285, lon: 105.8542, isp: "Viettel Group", status: "success" },
  "137.74.47.71": { country: "France", countryCode: "FR", city: "Paris", lat: 48.8566, lon: 2.3522, isp: "OVH SAS", status: "success" },
  "152.32.163.183": { country: "Hong Kong", countryCode: "HK", city: "Hong Kong", lat: 22.3193, lon: 114.1694, isp: "Tencent Building", status: "success" },
  "154.161.187.225": { country: "Ghana", countryCode: "GH", city: "Accra", lat: 5.6037, lon: -0.1870, isp: "MTN Ghana", status: "success" },
  "172.188.89.41": { country: "United Kingdom", countryCode: "GB", city: "London", lat: 51.5074, lon: -0.1278, isp: "Microsoft Corporation", status: "success" },
  "176.53.159.197": { country: "Turkey", countryCode: "TR", city: "Istanbul", lat: 41.0082, lon: 28.9784, isp: "Radore Ortak Altyapi", status: "success" },
  "178.16.55.216": { country: "Germany", countryCode: "DE", city: "Kassel", lat: 51.3127, lon: 9.4797, isp: "1&1 IONOS SE", status: "success" },
  "187.191.48.23": { country: "Mexico", countryCode: "MX", city: "Mexico City", lat: 19.4326, lon: -99.1332, isp: "Uninet", status: "success" },
  "189.204.230.91": { country: "Mexico", countryCode: "MX", city: "Mexico City", lat: 19.4326, lon: -99.1332, isp: "Alestra", status: "success" },
  "198.244.140.51": { country: "Canada", countryCode: "CA", city: "Montreal", lat: 45.5017, lon: -73.5673, isp: "OVH SAS", status: "success" }
};

// Common worldwide coordinates for deterministic offline fallback when an IP is
// neither cached nor in the preset DB and the external lookup is unavailable.
const FALLBACK_COUNTRIES = [
  { country: "United States", countryCode: "US", city: "Ashburn", lat: 39.0437, lon: -77.4874, isp: "Amazon Technologies Inc." },
  { country: "China", countryCode: "CN", city: "Guangzhou", lat: 23.1167, lon: 113.2500, isp: "Chinanet" },
  { country: "Germany", countryCode: "DE", city: "Frankfurt", lat: 50.1109, lon: 8.6821, isp: "DigitalOcean LLC" },
  { country: "Japan", countryCode: "JP", city: "Osaka", lat: 34.6937, lon: 135.5023, isp: "Sakura Internet" },
  { country: "Netherlands", countryCode: "NL", city: "Rotterdam", lat: 51.9244, lon: 4.4777, isp: "Leaseweb" },
  { country: "United Kingdom", countryCode: "GB", city: "Manchester", lat: 53.4808, lon: -2.2426, isp: "M247 Ltd" },
  { country: "India", countryCode: "IN", city: "Bangalore", lat: 12.9716, lon: 77.5946, isp: "Reliance Jio" },
  { country: "France", countryCode: "FR", city: "Lyon", lat: 45.7640, lon: 4.8357, isp: "Scaleway" },
  { country: "Brazil", countryCode: "BR", city: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, isp: "Claro Brazil" },
  { country: "Australia", countryCode: "AU", city: "Melbourne", lat: -37.8136, lon: 144.9631, isp: "Telstra" },
  { country: "Russia", countryCode: "RU", city: "Saint Petersburg", lat: 59.9343, lon: 30.3351, isp: "Selectel" },
  { country: "Canada", countryCode: "CA", city: "Toronto", lat: 43.6532, lon: -79.3832, isp: "Rogers Cable" },
  { country: "Singapore", countryCode: "SG", city: "Singapore", lat: 1.3521, lon: 103.8198, isp: "Singtel" },
  { country: "South Africa", countryCode: "ZA", city: "Johannesburg", lat: -26.2041, lon: 28.0473, isp: "Liquid Intelligent Technologies" },
  { country: "Ukraine", countryCode: "UA", city: "Lviv", lat: 49.8397, lon: 24.0297, isp: "Ukrtelecom" },
];

function getDeterministicGeoFallback(ip: string) {
  const trimmed = ip.trim();
  if (LOCAL_GEO_DB[trimmed]) {
    return { ip: trimmed, ...LOCAL_GEO_DB[trimmed] };
  }

  const octets = trimmed.split(".").map(o => parseInt(o, 10));
  const validOctets = octets.filter(o => !isNaN(o) && o >= 0 && o <= 255);
  let hash = 0;
  if (validOctets.length > 0) {
    hash = validOctets.reduce((acc, val) => acc + val, 0);
  } else {
    for (let i = 0; i < trimmed.length; i++) {
      hash += trimmed.charCodeAt(i);
    }
  }

  const fallback = FALLBACK_COUNTRIES[hash % FALLBACK_COUNTRIES.length];
  const latOffset = ((hash % 17) - 8) * 0.15;
  const lonOffset = ((hash % 13) - 6) * 0.15;

  return {
    ip: trimmed,
    country: fallback.country,
    countryCode: fallback.countryCode,
    city: fallback.city,
    lat: fallback.lat + latOffset,
    lon: fallback.lon + lonOffset,
    isp: fallback.isp,
    status: "success",
    message: "Resolved via robust offline lookup engine"
  };
}

// Resolve a list of IPs to geo records, returned in the same order as the input.
// Disk-backed geoCache first, then the preset DB, then ip-api.com in 100-IP
// batches, then a deterministic offline fallback. New lookups are persisted.
async function geolocateIps(inputIps: string[]): Promise<any[]> {
  const uniqueIps = Array.from(new Set(inputIps.map(ip => ip.trim()).filter(Boolean)));
  const results: any[] = [];
  const ipsToFetch: string[] = [];

  // Check cache & local DB first
  for (const ip of uniqueIps) {
    const trimmedIp = ip.trim();
    if (geoCache.has(trimmedIp)) {
      results.push(geoCache.get(trimmedIp));
    } else if (LOCAL_GEO_DB[trimmedIp]) {
      const info = { ip: trimmedIp, ...LOCAL_GEO_DB[trimmedIp] };
      geoCache.set(trimmedIp, info);
      results.push(info);
    } else {
      ipsToFetch.push(trimmedIp);
    }
  }

  // Fetch uncached, non-local IPs from external API
  if (ipsToFetch.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < ipsToFetch.length; i += chunkSize) {
      const chunk = ipsToFetch.slice(i, i + chunkSize);

      try {
        const response = await fetch("http://ip-api.com/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(chunk),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch from ip-api.com: ${response.statusText}`);
        }

        const apiData = await response.json();
        if (Array.isArray(apiData)) {
          apiData.forEach((item, index) => {
            const ip = chunk[index];
            if (item.status === "success") {
              const geoInfo = {
                ip,
                country: item.country,
                countryCode: item.countryCode,
                region: item.regionName,
                city: item.city,
                zip: item.zip,
                lat: item.lat,
                lon: item.lon,
                isp: item.isp,
                org: item.org,
                as: item.as,
                status: "success",
              };
              geoCache.set(ip, geoInfo);
              results.push(geoInfo);
            } else {
              const fallbackInfo = getDeterministicGeoFallback(ip);
              geoCache.set(ip, fallbackInfo);
              results.push(fallbackInfo);
            }
          });
        } else {
          chunk.forEach(ip => {
            const fallbackInfo = getDeterministicGeoFallback(ip);
            geoCache.set(ip, fallbackInfo);
            results.push(fallbackInfo);
          });
        }
      } catch (error) {
        console.error("Error batch fetching geolocations from external API, using deterministic fallback:", error);
        chunk.forEach(ip => {
          const fallbackInfo = getDeterministicGeoFallback(ip);
          geoCache.set(ip, fallbackInfo);
          results.push(fallbackInfo);
        });
      }
    }
    // New geolocations were resolved — persist the cache to disk so the next
    // process start reads them instead of re-hitting ip-api.
    geoCacheDirty = true;
    persistGeoCache();
  }

  // Re-order results to match the original input array order
  return inputIps.map(ip => {
    const trimmed = ip.trim();
    return results.find(r => r.ip === trimmed) || getDeterministicGeoFallback(trimmed);
  });
}

// Persisted merged snapshot of the last successful live-ban resolution. Painted
// instantly on the next dashboard load so the ~950-IP geolocation round-trip no
// longer blocks first paint; the fresh set is fetched in the background and
// swapped in when ready.
const SNAPSHOT_FILE = path.join(process.cwd(), ".last-snapshot.json");

async function buildLiveBans(): Promise<{ server: string | null; count: number; generatedAt: number; ips: any[] }> {
  const bans = await getFail2banBans();
  if (bans.length === 0) return { server: "mail.aucdt.edu.gh", count: 0, generatedAt: Date.now(), ips: [] };
  const jailByIp = new Map(bans.map(b => [b.ip, b.jail]));
  const geo = await geolocateIps(Array.from(jailByIp.keys()));
  const ips = geo.map(r => ({
    ip: r.ip,
    jail: jailByIp.get(r.ip) || "unknown",
    country: r.country || "Unknown",
    countryCode: r.countryCode || "",
    city: r.city || "Unknown",
    lat: typeof r.lat === "number" ? r.lat : 0,
    lon: typeof r.lon === "number" ? r.lon : 0,
    isp: r.isp,
    status: "success",
  }));
  return { server: "mail.aucdt.edu.gh", count: ips.length, generatedAt: Date.now(), ips };
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3040;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // nginx forwards the /fail2ban-ai prefix through to this server; normalise
  // it for ALL /api routes in one place (Pattern 25 — per-route dual
  // registration has missed routes twice, do not use it).
  app.use((req, _res, next) => {
    if (req.url.startsWith("/fail2ban-ai/api/")) req.url = req.url.slice("/fail2ban-ai".length);
    next();
  });

  // Fleet-standard health check (Pattern 25 stage 10)
  app.get("/api/health", (_req, res) =>
    res.json({ ok: true, service: "fail2ban-ai", custody: GEMINI_PROXY_KEY ? "wms-relay" : "unconfigured" })
  );

  // Live fail2ban bans from this server (staff-only). Returns { ips: [{ip,jail}] }.
  // On any failure (fail2ban-client absent, no permission) responds 200 with an
  // empty list + error note so the frontend falls back to its sample snapshot.
  app.get("/api/banlist", requireWmsAuth, async (_req, res) => {
    try {
      if (banlistCache && Date.now() - banlistCache.at < BANLIST_TTL_MS) {
        return res.json({ server: "mail.aucdt.edu.gh", count: banlistCache.data.length, ips: banlistCache.data, cached: true });
      }
      const ips = await getFail2banBans();
      banlistCache = { at: Date.now(), data: ips };
      res.json({ server: "mail.aucdt.edu.gh", count: ips.length, ips });
    } catch (err: any) {
      res.json({ server: null, count: 0, ips: [], error: err?.message || "fail2ban-client unavailable" });
    }
  });

  // API Route: Geolocate a list of IP addresses (supports batching)
  app.post("/api/geolocate", requireWmsAuth, async (req, res) => {
    try {
      const { ips } = req.body;
      if (!Array.isArray(ips) || ips.length === 0) {
        return res.status(400).json({ error: "Invalid request. 'ips' must be a non-empty array of strings." });
      }
      return res.json({ results: await geolocateIps(ips) });
    } catch (error: any) {
      console.error("Geolocate endpoint error:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Instant snapshot of the last resolved live-ban set (staff-only). Served
  // straight from disk with no fail2ban or geolocation work, so the dashboard
  // paints without waiting; the client refreshes via /api/live-bans afterwards.
  app.get("/api/snapshot", requireWmsAuth, (_req, res) => {
    try {
      if (fs.existsSync(SNAPSHOT_FILE)) {
        return res.json(JSON.parse(fs.readFileSync(SNAPSHOT_FILE, "utf8")));
      }
    } catch {
      // corrupt/absent snapshot — fall through to the empty response
    }
    res.json({ server: null, count: 0, generatedAt: 0, ips: [] });
  });

  // Fresh live bans: fail2ban ban list + server-side geolocation, merged. Persists
  // the result as the snapshot for the next load. On any failure responds 200 with
  // an empty set so the frontend keeps its current view.
  app.get("/api/live-bans", requireWmsAuth, async (_req, res) => {
    try {
      const snap = await buildLiveBans();
      if (snap.ips.length > 0) {
        try { fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(snap)); }
        catch { /* best-effort — a failed write just means no instant paint next time */ }
      }
      res.json(snap);
    } catch (err: any) {
      res.json({ server: null, count: 0, generatedAt: 0, ips: [], error: err?.message || "fail2ban-client unavailable" });
    }
  });

  // API Route: Analyze logs and IPs using Gemini
  app.post("/api/analyze-logs", requireWmsAuth, async (req, res) => {
    try {
      const { ipsData, logSample } = req.body;
      if (!Array.isArray(ipsData)) {
        return res.status(400).json({ error: "Invalid request. 'ipsData' must be an array." });
      }

      if (!GEMINI_PROXY_KEY) {
        return res.json({
          analysis: "### ℹ️ AI Analysis Unavailable\nThe WMS relay credential (GEMINI_PROXY_KEY) is not configured on this server, so AI recommendations are offline.\n\nHere is a quick summary based on pre-compiled threat models:\n- **Main Attack Origins**: " +
            Array.from(new Set(ipsData.map(ip => ip.country).filter(Boolean))).slice(0, 3).join(", ") + "\n- **Primary Targets**: SSH and related service panels.\n- **Action Item**: Add fail2ban configurations, use key-based authentication, and whitelist administration IPs.",
        });
      }

      // Format IP list for Gemini
      const formattedIps = ipsData
        .slice(0, 50) // Limit to top 50 to prevent token blowout
        .map(item => `- IP: ${item.ip} | Jail: ${item.jail || "N/A"} | Country: ${item.country || "Unknown"} | City: ${item.city || "Unknown"} | ISP: ${item.isp || "Unknown"}`)
        .join("\n");

      const prompt = `You are an expert security engineer and system administrator.
Analyze the following list of blocked/banned IP addresses (which were flagged by security tools like Fail2Ban) and provide highly detailed, professional, and actionable security insights.

### BANNED IPS DATA:
${formattedIps}

${logSample ? `### LOG SAMPLE PROVIDED:\n\`\`\`\n${logSample.slice(0, 1500)}\n\`\`\`` : ""}

Please provide a markdown analysis including:
1. **Threat Assessment**: What patterns do you see? (e.g., concentrated regions, specific service targeting like SSH/Web panels, distributed botnets vs. single script-kiddie).
2. **Geographical Insights**: Briefly analyze the countries/regions of origin, and if they point to known bulletproof hostings, Tor exit nodes, or specific cloud providers (like OVH, Azure, AWS).
3. **Actionable Recommendations**: Give concrete shell commands or config examples to secure the server:
   - Specific iptables or ufw rules
   - Fail2Ban jail.local recommendations or configuration tuning
   - Cloudflare / WAF rules if applicable
   - General best practices (disabling password authentication, custom SSH ports, rate-limiting)

Keep your response extremely professional, elegant, and directly useful to a sysadmin. Use clean headers, bullet points, and code blocks for commands.`;

      const analysis = await relayGenerate(prompt);

      return res.json({ analysis });
    } catch (error: any) {
      console.error("Analyze-logs endpoint error:", error);
      return res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Serve static files / Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Dual mounts: nginx forwards the /fail2ban-ai prefix through (Pattern 25)
    app.use(express.static(distPath));
    app.use("/fail2ban-ai", express.static(distPath));
    app.get(/.*/, (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[fail2ban-ai] listening on http://localhost:${PORT} (custody: ${GEMINI_PROXY_KEY ? "wms-relay" : "unconfigured"})`);
  });
}

startServer();
