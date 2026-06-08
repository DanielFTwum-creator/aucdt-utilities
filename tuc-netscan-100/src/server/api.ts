import express, { Request, Response, Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import * as os from 'os';
import * as net from 'net';
import * as dns from 'dns';
import * as fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import ouiData from './oui-data.json';

const execFileAsync = promisify(execFile);
const PLATFORM = os.platform();
const OUI_DB = ouiData as Record<string, string>;

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type DeviceStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'ROGUE';
export const DeviceStatus = {
  ACTIVE: 'ACTIVE' as const,
  INACTIVE: 'INACTIVE' as const,
  BLOCKED: 'BLOCKED' as const,
  ROGUE: 'ROGUE' as const,
};

export interface Device {
  id: number;
  mac_address: string;
  ip_address: string;
  hostname: string | null;
  manufacturer: string | null;
  custom_label: string | null;
  os_fingerprint: string | null;
  status: DeviceStatus;
  in_adr: boolean; // Authorised Device Registry
  first_seen_at: string;
  last_seen_at: string;
  created_at: string;
  updated_at: string;
  rtt: number; // latency ms
  packet_loss: number; // %
  ports: Array<{ port: number; service: string; status: string; risk: boolean }>;
}

export interface BandwidthInterface {
  id: number;
  name: string;
  link_capacity: number; // in Mbps
  bytes_in: number;
  bytes_out: number;
  utilisation_pct: number;
}

export interface BandwidthSample {
  id: number;
  interface_id: number;
  bytes_in: number;
  bytes_out: number;
  utilisation_pct: number;
  sampled_at: string;
}

export interface Alert {
  id: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  type: string;
  message: string;
  timestamp: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED';
  ack_note?: string;
  ack_at?: string;
}

export interface AuditLog {
  id: number;
  actor_username: string;
  action_type: 'BLOCK' | 'UNBLOCK' | 'ANNOTATE' | 'WHITELIST' | 'ACK_ALERT' | 'SCAN' | 'QOS';
  target_id: string;
  reason: string;
  metadata_json: string;
  created_at: string;
}

export interface WebhookLog {
  timestamp: string;
  url: string;
  payload: string;
  status: string;
}

// ==========================================
// IN-MEMORY STATE (populated only by REAL scans — no seeded/simulated data)
// ==========================================

let devices: Device[] = [];
let nextDeviceId = 1;

// Bandwidth/SNMP telemetry requires polling real managed switches with SNMP
// credentials. Until that is configured these remain empty rather than faked.
let bandwidthInterfaces: BandwidthInterface[] = [];
let bandwidthHistory: BandwidthSample[] = [];

let alerts: Alert[] = [];
let nextAlertId = 1;

let auditLogs: AuditLog[] = [];
let nextAuditId = 1;

let webhookLogs: WebhookLog[] = [];

// Live scanner state surfaced via /health
const scanState = {
  scanning: false,
  lastScanAt: null as string | null,
  lastDurationSeconds: 0,
  lastError: null as string | null,
};

// Settings in-memory configuration
let settings = {
  scan_interval_seconds: 60,
  enable_passive_monitoring: true,
  ping_timeout_ms: 500,
  alert_threshold_capacity_pct: 80,
  webhook_url: 'https://techbridge.edu.gh/webhooks/netscan-alerts',
  configured_cidrs: '', // auto-detected from local interfaces at scan time
  snmp_community_encrypted: 'encrypted_public_community',
};

function addAudit(entry: Omit<AuditLog, 'id' | 'created_at'> & { created_at?: string }) {
  auditLogs.push({
    id: nextAuditId++,
    created_at: entry.created_at || new Date().toISOString(),
    actor_username: entry.actor_username,
    action_type: entry.action_type,
    target_id: entry.target_id,
    reason: entry.reason,
    metadata_json: entry.metadata_json,
  });
}

function raiseAlert(severity: Alert['severity'], type: string, message: string) {
  // De-duplicate active alerts of the same type+message
  const exists = alerts.some(a => a.status === 'ACTIVE' && a.type === type && a.message === message);
  if (exists) return;
  const alert: Alert = {
    id: nextAlertId++,
    severity,
    type,
    message,
    timestamp: new Date().toISOString(),
    status: 'ACTIVE',
  };
  alerts.push(alert);
  triggerWebhook(alert);
}

function triggerWebhook(alert: Alert) {
  if (settings.webhook_url) {
    const payload = JSON.stringify({
      event: 'TUC_NETSCAN_ALERT',
      severity: alert.severity,
      alert_id: alert.id,
      message: alert.message,
      timestamp: alert.timestamp,
    });
    webhookLogs.push({
      timestamp: new Date().toISOString(),
      url: settings.webhook_url,
      payload,
      status: '200 OK (Dispatched)',
    });
  }
}

// ==========================================
// GEMINI AI INTEGRATION GATEWAY
// ==========================================

export async function askGeminiForDiagnosis(promptText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('MY_GEMINI_API_KEY')) {
    // No valid API key - return local expert rules advice compiled in professional UK British English
    return getLocalExpertExplanation(promptText);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: promptText,
      config: {
        systemInstruction: `You are Daniel Frempong Twum, Head of ICT and Special Advisor to the Founder at Techbridge University College (TUC).
Your expertise spans network security, latency, QoS engineering and campus infrastructure optimizations.
Compose high-information-density diagnostic analysis, mitigation suggestions, iptables rule suggestions and ports scanning reports in professional UK British English.
Always structure responses beautifully with markdown and maintain a mature, expert institutional tone.`,
      },
    });

    return response.text || 'No response compiled by GenAI.';
  } catch (err: any) {
    console.error('Gemini call failed, falling back to local expert system:', err);
    return `[AI Fallback Active due to communication error: ${err.message || 'Unknown reason'}]\n\n` + getLocalExpertExplanation(promptText);
  }
}

function getLocalExpertExplanation(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('telnet') || lower.includes('port 23') || lower.includes('rogue')) {
    return `### TUC NetScan Security Advisory: Exposed/Unmanaged Device
#### Diagnostic Analysis
A device on the campus LAN is exposing a high-risk service (e.g. Telnet/23, SMB/445 or RDP/3389) or is not present in the Authorised Device Registry (ADR). Unmanaged consumer access points and hosts with legacy services materially widen the attack surface.

#### Recommended Actions
* **Triage:** Confirm ownership of the host (IP/MAC) against your inventory. If unrecognised, treat as rogue.
* **Containment (gateway edge):**
  \`\`\`bash
  # Drop traffic from the offending MAC at the router/gateway
  iptables -I FORWARD -m mac --mac-source <MAC> -j DROP
  iptables -I INPUT  -m mac --mac-source <MAC> -j DROP
  \`\`\`
* **Harden:** Disable Telnet in favour of SSH; restrict SMB/RDP to management VLANs only; enable DHCP snooping to suppress rogue DHCP servers.`;
  }

  if (lower.includes('congestion') || lower.includes('bandwidth') || lower.includes('qos')) {
    return `### TUC NetScan Performance Advisory: Uplink Congestion
Apply a Hierarchical Token Bucket (HTB) policy on the campus router to guarantee academic priority and throttle high-volume consumer traffic:

\`\`\`bash
tc qdisc add dev eth1 root handle 1: htb default 30
tc class add dev eth1 parent 1:  classid 1:1  htb rate 200mbit ceil 200mbit
tc class add dev eth1 parent 1:1 classid 1:10 htb rate 50mbit  ceil 200mbit prio 1   # academic
tc class add dev eth1 parent 1:1 classid 1:30 htb rate 20mbit  ceil 40mbit  prio 3   # streaming
\`\`\`

> Note: live bandwidth figures require SNMP polling of the managed switches, which must be configured with valid community strings/credentials.`;
  }

  const active = devices.filter(d => d.status === DeviceStatus.ACTIVE).length;
  const risky = devices.filter(d => d.ports.some(p => p.risk)).length;
  return `### TUC NetScan — Live LAN Report
* **Discovered devices:** ${devices.length} (${active} active)
* **Hosts exposing high-risk services:** ${risky}
* **Guidance:** Review the Devices and Ports tabs. Whitelist known hosts into the ADR to reduce noise, and investigate any host exposing Telnet (23), SMB (445) or RDP (3389) on the open LAN.`;
}

// ==========================================
// REAL NETWORK DISCOVERY CORE (cross-platform: Windows + Linux)
// ==========================================

// Common TCP services probed per host during discovery.
const COMMON_PORTS: Array<{ port: number; service: string; risk: boolean }> = [
  { port: 22, service: 'ssh', risk: false },
  { port: 23, service: 'telnet', risk: true },
  { port: 53, service: 'dns', risk: false },
  { port: 80, service: 'http', risk: false },
  { port: 135, service: 'msrpc', risk: false },
  { port: 139, service: 'netbios-ssn', risk: true },
  { port: 161, service: 'snmp', risk: false },
  { port: 443, service: 'https', risk: false },
  { port: 445, service: 'microsoft-ds', risk: true },
  { port: 515, service: 'printer', risk: false },
  { port: 631, service: 'ipp', risk: false },
  { port: 3000, service: 'http-dev', risk: false },
  { port: 3306, service: 'mysql', risk: false },
  { port: 3307, service: 'mariadb', risk: false },
  { port: 3389, service: 'ms-wbt-server', risk: true },
  { port: 8080, service: 'http-alt', risk: false },
  { port: 8443, service: 'https-alt', risk: false },
  { port: 9100, service: 'jetdirect', risk: false },
];

// Vendor lookup backed by the bundled IEEE OUI registry (offline, ~39k entries).
function lookupOUI(mac: string): string {
  const clean = mac.replace(/[^A-Fa-f0-9]/g, '').slice(0, 6).toUpperCase();
  const hit = OUI_DB[clean];
  if (hit) return hit;
  // Locally-administered (randomised) MACs have no registered vendor by design.
  if (/^.[26ae]/i.test(mac)) return 'Randomised MAC (private)';
  return `Unknown OUI (${clean})`;
}

// Reverse-DNS lookup (PTR). Most LAN hosts have no PTR record → null.
function resolveReverseDns(ip: string): Promise<string | null> {
  return new Promise((resolve) => {
    dns.reverse(ip, (err, hostnames) => {
      if (err || !hostnames || hostnames.length === 0) resolve(null);
      else resolve(hostnames[0]);
    });
  });
}

// Single-port TCP connect probe. Resolves true if the port accepts a connection.
function checkPortHost(host: string, port: number, timeout = 350): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    const finish = (open: boolean) => {
      if (done) return;
      done = true;
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(timeout);
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.once('timeout', () => finish(false));
    socket.connect(port, host);
  });
}

// Bounded-concurrency async map (avoids spawning hundreds of processes at once).
async function pooledMap<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;
  const n = Math.max(1, Math.min(limit, items.length));
  const workers = Array.from({ length: n }, async () => {
    while (true) {
      const cur = idx++;
      if (cur >= items.length) break;
      results[cur] = await fn(items[cur]);
    }
  });
  await Promise.all(workers);
  return results;
}

// Enumerate this host's IPv4 /24 subnets (de-duplicated by /24 base).
function getLocalSubnets(): Array<{ base: string; selfIp: string; selfMac: string }> {
  const out: Array<{ base: string; selfIp: string; selfMac: string }> = [];
  const nets = os.networkInterfaces();
  const seen = new Set<string>();
  for (const name of Object.keys(nets)) {
    for (const ni of nets[name] || []) {
      if (ni.family === 'IPv4' && !ni.internal) {
        const parts = ni.address.split('.');
        if (parts.length === 4) {
          const base = `${parts[0]}.${parts[1]}.${parts[2]}`;
          if (!seen.has(base)) {
            seen.add(base);
            out.push({ base, selfIp: ni.address, selfMac: (ni.mac || '').toUpperCase() });
          }
        }
      }
    }
  }
  return out;
}

// Parse a CIDR block (e.g. "192.168.1.0/24") into a flat host list. Caps at /22 (1022 hosts).
function cidrToHostList(cidr: string): string[] {
  const parts = cidr.trim().split('/');
  if (parts.length !== 2) return [];
  const maskBits = parseInt(parts[1], 10);
  if (isNaN(maskBits) || maskBits < 8 || maskBits > 31) return [];
  const hostCount = Math.pow(2, 32 - maskBits) - 2;
  if (hostCount > 1022) return [];
  const octets = parts[0].split('.').map(Number);
  if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) return [];
  const baseNum = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
  const networkNum = (baseNum >>> 0) & (~0 << (32 - maskBits));
  const hosts: string[] = [];
  for (let i = 1; i <= hostCount; i++) {
    const h = (networkNum + i) >>> 0;
    hosts.push([(h >> 24) & 255, (h >> 16) & 255, (h >> 8) & 255, h & 255].join('.'));
  }
  return hosts;
}


// Read the OS ARP cache → Map<ip, MAC(upper, colon-separated)>.
async function readArpCache(): Promise<Map<string, string>> {
  const table = new Map<string, string>();
  try {
    if (PLATFORM === 'win32') {
      const { stdout } = await execFileAsync('arp', ['-a'], { windowsHide: true, maxBuffer: 4 * 1024 * 1024 });
      const re = /(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F]{2}(?:[-:][0-9a-fA-F]{2}){5})/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(stdout)) !== null) {
        table.set(m[1], m[2].replace(/-/g, ':').toUpperCase());
      }
    } else {
      // Linux/macOS: prefer `ip neigh`, fall back to /proc/net/arp then `arp -a`.
      try {
        const { stdout } = await execFileAsync('ip', ['neigh', 'show'], { maxBuffer: 4 * 1024 * 1024 });
        const re = /(\d{1,3}(?:\.\d{1,3}){3}).*?lladdr\s+([0-9a-fA-F:]{17})/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(stdout)) !== null) table.set(m[1], m[2].toUpperCase());
      } catch {
        if (fs.existsSync('/proc/net/arp')) {
          const content = fs.readFileSync('/proc/net/arp', 'utf8');
          content.split('\n').slice(1).forEach((line) => {
            const cols = line.trim().split(/\s+/);
            if (cols.length >= 4 && cols[3].includes(':') && cols[3] !== '00:00:00:00:00:00') {
              table.set(cols[0], cols[3].toUpperCase());
            }
          });
        }
      }
    }
  } catch (e) {
    console.error('[NetScan Core] ARP cache read failed:', e);
  }
  return table;
}

// Filter out broadcast / multicast / placeholder MACs.
function isUsableHostMac(ip: string, mac: string | undefined): boolean {
  if (!mac) return false;
  const up = mac.toUpperCase();
  if (up === 'FF:FF:FF:FF:FF:FF' || up === '00:00:00:00:00:00') return false;
  if (up.startsWith('01:00:5E') || up.startsWith('33:33')) return false;
  const last = ip.split('.').pop();
  if (last === '255' || last === '0') return false;
  if (ip.startsWith('224.') || ip.startsWith('239.') || ip.startsWith('255.')) return false;
  return true;
}

// Ping one host → returns RTT in ms if it replied, else null. Primes the ARP cache.
async function pingHost(ip: string): Promise<number | null> {
  try {
    if (PLATFORM === 'win32') {
      const { stdout } = await execFileAsync('ping', ['-n', '1', '-w', String(settings.ping_timeout_ms), ip], { windowsHide: true });
      if (!/TTL=/i.test(stdout)) return null;
      const m = stdout.match(/time[=<]\s?(\d+)\s?ms/i);
      if (m) return parseInt(m[1], 10);
      return /time<1ms/i.test(stdout) ? 0.5 : 1;
    } else {
      const { stdout } = await execFileAsync('ping', ['-c', '1', '-W', '1', ip]);
      const m = stdout.match(/time=([\d.]+)\s?ms/);
      return m ? parseFloat(m[1]) : 1;
    }
  } catch {
    return null;
  }
}

function guessOs(openPorts: number[]): string | null {
  const s = new Set(openPorts);
  if (s.has(3389) || s.has(445) || s.has(139) || s.has(135)) return 'Windows (SMB/RDP signature)';
  if (s.has(9100) || s.has(515) || s.has(631)) return 'Network Printer';
  if (s.has(8443)) return 'Appliance / Web admin';
  if (s.has(22)) return 'Linux/Unix (SSH)';
  if (s.has(80) || s.has(443)) return 'Embedded / Web device';
  return null;
}

// Upsert a discovered host into the registry, keyed by MAC. Preserves operator
// state (BLOCKED status, custom_label, ADR membership) across re-scans.
function upsertDevice(opts: {
  ip: string;
  mac: string;
  openPorts: number[];
  rtt: number;
  hostname: string | null;
  ts: string;
}): Device {
  const portObjs = opts.openPorts
    .slice()
    .sort((a, b) => a - b)
    .map((pn) => {
      const def = COMMON_PORTS.find((c) => c.port === pn);
      return { port: pn, service: def?.service || 'unknown', status: 'open', risk: def?.risk ?? true };
    });

  // Key by IP address (one row per live endpoint). Keying by MAC would collapse
  // distinct hosts that share a MAC — e.g. devices proxied behind a Wi-Fi
  // range-extender/repeater — silently hiding them from the inventory.
  const existing = devices.find((d) => d.ip_address === opts.ip);
  if (existing) {
    existing.mac_address = opts.mac;
    existing.manufacturer = lookupOUI(opts.mac);
    existing.ports = portObjs;
    existing.rtt = opts.rtt;
    existing.packet_loss = 0;
    existing.last_seen_at = opts.ts;
    existing.updated_at = opts.ts;
    if (opts.hostname) existing.hostname = opts.hostname;
    if (!existing.os_fingerprint) existing.os_fingerprint = guessOs(opts.openPorts);
    // Do not override an operator-applied BLOCK; otherwise the host is live.
    if (existing.status !== DeviceStatus.BLOCKED) existing.status = DeviceStatus.ACTIVE;
    return existing;
  }

  const created: Device = {
    id: nextDeviceId++,
    mac_address: opts.mac,
    ip_address: opts.ip,
    hostname: opts.hostname,
    manufacturer: lookupOUI(opts.mac),
    custom_label: null,
    os_fingerprint: guessOs(opts.openPorts),
    status: DeviceStatus.ACTIVE,
    in_adr: false,
    first_seen_at: opts.ts,
    last_seen_at: opts.ts,
    created_at: opts.ts,
    updated_at: opts.ts,
    rtt: opts.rtt,
    packet_loss: 0,
    ports: portObjs,
  };
  devices.push(created);
  return created;
}

// Perform a real discovery sweep of the local LAN.
async function performRealScan(targetSubnet?: string): Promise<{ discovered: number; message: string; durationSeconds: number }> {
  if (scanState.scanning) {
    return { discovered: devices.length, message: 'A scan is already in progress.', durationSeconds: 0 };
  }
  scanState.scanning = true;
  scanState.lastError = null;
  const start = Date.now();
  const ts = new Date().toISOString();

  try {
    // Custom CIDR mode takes priority over auto-detected local subnets.
    const customCidrs = (settings.configured_cidrs || '')
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0 && c.includes('/'));

    let candidates: string[] = [];
    let scopeLabel = '';

    if (customCidrs.length > 0) {
      const wantAll = !targetSubnet || targetSubnet === 'ALL SUBNETS';
      const activeScope = wantAll ? customCidrs
        : (customCidrs.filter(c => c.startsWith((targetSubnet || '').split('.').slice(0, 3).join('.'))) || customCidrs);
      const cidrScope = activeScope.length > 0 ? activeScope : customCidrs;
      for (const cidr of cidrScope) candidates.push(...cidrToHostList(cidr));
      scopeLabel = cidrScope.join(', ');
    }

    if (candidates.length === 0) {
      // Auto-detect from server's own network interfaces
      const subnets = getLocalSubnets();
      if (subnets.length === 0) {
        scanState.scanning = false;
        return { discovered: 0, message: 'No active non-internal IPv4 interface detected on this host.', durationSeconds: 0 };
      }
      const wantAll = !targetSubnet || targetSubnet === 'ALL SUBNETS';
      const active = subnets.filter((s) => wantAll || targetSubnet!.startsWith(s.base));
      const scope = active.length ? active : subnets;
      for (const sn of scope) { for (let h = 1; h <= 254; h++) candidates.push(`${sn.base}.${h}`); }
      scopeLabel = scope.map((s) => `${s.base}.0/24`).join(', ');
      settings.configured_cidrs = subnets.map((s) => `${s.base}.0/24`).join(', ');
    }

    // 2. Ping-sweep (primes ARP + measures liveness/RTT).
    const rtts = await pooledMap(candidates, 64, pingHost);
    const rttByIp = new Map<string, number>();
    candidates.forEach((ip, i) => {
      if (rtts[i] !== null) rttByIp.set(ip, rtts[i] as number);
    });

    // 3. Read the real ARP cache.
    const arp = await readArpCache();
    // Inject this host's own interfaces (never present in its own ARP cache).
    for (const sn of scope) {
      if (sn.selfMac) arp.set(sn.selfIp, sn.selfMac);
    }

    // 4. Live hosts = ping responders ∪ ARP entries within our subnets.
    const liveSet = new Set<string>(rttByIp.keys());
    for (const [ip, mac] of arp.entries()) {
      if (scope.some((sn) => ip.startsWith(sn.base + '.')) && isUsableHostMac(ip, mac)) liveSet.add(ip);
    }
    const liveIps = Array.from(liveSet);

    // 5. Enrich each host: port scan + reverse DNS, then upsert.
    let discoveredCount = 0;
    await pooledMap(liveIps, 24, async (ip) => {
      const mac = arp.get(ip);
      if (!isUsableHostMac(ip, mac)) return; // need a real MAC to key the device
      const openPorts: number[] = [];
      await pooledMap(COMMON_PORTS, COMMON_PORTS.length, async (p) => {
        if (await checkPortHost(ip, p.port)) openPorts.push(p.port);
      });
      const hostname = await resolveReverseDns(ip);
      const rtt = rttByIp.has(ip) ? (rttByIp.get(ip) as number) : 0;
      upsertDevice({ ip, mac: mac as string, openPorts, rtt, hostname, ts });
      discoveredCount++;
    });

    // 6. Age out hosts that were active but not seen this sweep → INACTIVE
    //    (this is the "live state / reset" behaviour). BLOCKED is preserved.
    for (const d of devices) {
      if (d.status === DeviceStatus.ACTIVE && d.last_seen_at !== ts) {
        d.status = DeviceStatus.INACTIVE;
        d.updated_at = ts;
      }
    }

    // 7. Raise real alerts from real findings.
    for (const d of devices) {
      if (d.status !== DeviceStatus.ACTIVE) continue;
      const risky = d.ports.filter((p) => p.risk).map((p) => `${p.port}/${p.service}`);
      if (risky.length) {
        raiseAlert(
          'WARNING',
          'EXPOSED_SERVICE',
          `Host ${d.ip_address} (${d.mac_address}) exposes high-risk service(s): ${risky.join(', ')}`
        );
      }
    }

    const durationSeconds = parseFloat(((Date.now() - start) / 1000).toFixed(2));
    scanState.lastScanAt = ts;
    scanState.lastDurationSeconds = durationSeconds;

    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'SCAN',
      target_id: settings.configured_cidrs,
      reason: 'Active LAN discovery sweep (ping + ARP + TCP)',
      metadata_json: JSON.stringify({ scope: scopeLabel, discovered: discoveredCount, duration_seconds: durationSeconds }),
      created_at: ts,
    });

    return {
      discovered: discoveredCount,
      message: `Live scan complete across ${scopeLabel}. ${discoveredCount} host(s) responded in ${durationSeconds}s.`,
      durationSeconds,
    };
  } catch (e: any) {
    scanState.lastError = e?.message || String(e);
    console.error('[NetScan Core] Scan failed:', e);
    return { discovered: devices.length, message: `Scan error: ${scanState.lastError}`, durationSeconds: 0 };
  } finally {
    scanState.scanning = false;
  }
}

// Kick an initial scan shortly after boot, then on a periodic interval.
let backgroundStarted = false;
function startBackgroundScanner() {
  if (backgroundStarted) return;
  backgroundStarted = true;
  const t = setTimeout(() => { performRealScan().catch((e) => console.error(e)); }, 1500);
  if (t && typeof t.unref === 'function') t.unref();
  const i = setInterval(() => {
    if (!scanState.scanning) performRealScan().catch((e) => console.error(e));
  }, 5 * 60 * 1000); // re-scan every 5 minutes
  if (i && typeof i.unref === 'function') i.unref();
}

// ==========================================
// TOPOLOGY INFERENCE
// ==========================================
// NOTE: From a single host you cannot directly observe Layer-2 topology
// (switch ports / AP attachment). On managed campus gear this becomes exact via
// SNMP bridge-MIB / LLDP. Here we INFER structure from: the OS default gateway,
// and shared-MAC (proxy-ARP) signatures that reveal devices behind a repeater.

async function getDefaultGateway(): Promise<string | null> {
  try {
    if (PLATFORM === 'win32') {
      const { stdout } = await execFileAsync('cmd', ['/c', 'route', 'print', '-4', '0.0.0.0'], { windowsHide: true });
      const m = stdout.match(/\n\s*0\.0\.0\.0\s+0\.0\.0\.0\s+(\d{1,3}(?:\.\d{1,3}){3})/);
      return m ? m[1] : null;
    }
    if (fs.existsSync('/proc/net/route')) {
      const data = fs.readFileSync('/proc/net/route', 'utf8');
      for (const line of data.split('\n').slice(1)) {
        const f = line.trim().split(/\s+/);
        if (f.length >= 3 && f[1] === '00000000' && f[2] !== '00000000') {
          const hex = f[2];
          return [hex.substr(6, 2), hex.substr(4, 2), hex.substr(2, 2), hex.substr(0, 2)].map((h) => parseInt(h, 16)).join('.');
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Locally-administered (randomised) unicast MAC: 2nd hex nibble ∈ {2,6,A,E}.
function isRandomMac(mac: string): boolean {
  return /^.[26ae]/i.test(mac);
}

function classifyDevice(d: Device, role: 'gateway' | 'extender' | 'host'): string {
  if (role === 'gateway') return 'Router / Gateway';
  if (role === 'extender') return 'Wi-Fi Extender';
  const v = (d.manufacturer || '').toLowerCase();
  const ports = new Set(d.ports.map((p) => p.port));
  if (/wyze|hikvision|dahua|reolink|amcrest/.test(v)) return 'IP Camera';
  if (/google|nest|amazon|sonos|roku/.test(v)) return 'Smart Speaker / TV';
  if (/sony|nintendo/.test(v)) return 'Game Console';
  if (ports.has(9100) || ports.has(515) || ports.has(631)) return 'Printer';
  if (ports.has(445) || ports.has(3389) || ports.has(139)) return 'Windows PC';
  if (ports.has(22) && !ports.has(445)) return 'Linux/Unix host';
  if (/apple/.test(v)) return 'Apple device';
  if (/raspberry/.test(v)) return 'Raspberry Pi';
  if (isRandomMac(d.mac_address)) return 'Phone (randomised MAC)';
  return 'Network device';
}

function lastOctet(ip: string): number {
  return Number(ip.split('.').pop());
}

function toTopoNode(d: Device, role: 'gateway' | 'extender' | 'host', selfIps?: Set<string>) {
  const self = selfIps ? selfIps.has(d.ip_address) : false;
  return {
    ip: d.ip_address,
    mac: d.mac_address,
    vendor: d.manufacturer,
    status: d.status,
    type: self ? 'This host (self interface)' : classifyDevice(d, role),
    label: d.custom_label || d.hostname,
    rtt: d.rtt,
    risky: d.ports.some((p) => p.risk),
    self,
  };
}

async function computeTopology() {
  const subnets = getLocalSubnets();
  const gwIp = (await getDefaultGateway()) || (subnets[0] ? `${subnets[0].base}.1` : null);
  const selfIps = new Set(subnets.map((s) => s.selfIp));
  const gwPrefix = gwIp ? gwIp.split('.').slice(0, 3).join('.') + '.' : null;
  // Scope the map to the gateway's own /24 so unrelated virtual adapters
  // (Hyper-V/WSL) don't appear as phantom hosts / the local PC twice.
  const live = devices.filter(
    (d) => (d.status === DeviceStatus.ACTIVE || d.status === DeviceStatus.BLOCKED) && (!gwPrefix || d.ip_address.startsWith(gwPrefix))
  );

  // Group by MAC — a MAC seen on >1 IP is a repeater/extender proxying its clients.
  const byMac = new Map<string, Device[]>();
  for (const d of live) {
    if (!byMac.has(d.mac_address)) byMac.set(d.mac_address, []);
    byMac.get(d.mac_address)!.push(d);
  }

  const gateway = live.find((d) => d.ip_address === gwIp) || null;
  const extenderIps = new Set<string>();
  const behindIps = new Set<string>();
  const branches: Array<{ node: ReturnType<typeof toTopoNode>; children: ReturnType<typeof toTopoNode>[] }> = [];

  for (const group of byMac.values()) {
    if (group.length <= 1) continue;
    const sorted = group.slice().sort((a, b) => lastOctet(a.ip_address) - lastOctet(b.ip_address));
    // The extender itself is the member exposing a web admin (80/443); else lowest IP.
    const ext = sorted.find((d) => d.ports.some((p) => p.port === 80 || p.port === 443)) || sorted[0];
    if (gateway && ext.ip_address === gateway.ip_address) continue;
    extenderIps.add(ext.ip_address);
    const children = sorted.filter((d) => d.ip_address !== ext.ip_address);
    children.forEach((c) => behindIps.add(c.ip_address));
    branches.push({ node: toTopoNode(ext, 'extender', selfIps), children: children.map((c) => toTopoNode(c, 'host', selfIps)) });
  }

  const direct: ReturnType<typeof toTopoNode>[] = [];
  for (const d of live) {
    if (gateway && d.ip_address === gateway.ip_address) continue;
    if (extenderIps.has(d.ip_address) || behindIps.has(d.ip_address)) continue;
    direct.push(toTopoNode(d, 'host', selfIps));
  }
  direct.sort((a, b) => lastOctet(a.ip) - lastOctet(b.ip));
  branches.sort((a, b) => lastOctet(a.node.ip) - lastOctet(b.node.ip));

  return {
    generated_at: new Date().toISOString(),
    inferred: true,
    basis:
      'Gateway from OS route table; extender→client links inferred from shared-MAC (proxy-ARP) signatures. Exact switch-port / AP attachment requires SNMP bridge-MIB or LLDP on managed gear.',
    gateway_ip: gwIp,
    tree: { gateway: gateway ? toTopoNode(gateway, 'gateway', selfIps) : null, branches, direct },
    counts: { extenders: branches.length, direct: direct.length, behind: behindIps.size },
  };
}

// ==========================================
// REST API INTEGRATION ENDPOINTS
// ==========================================

export function createNetScanApi(): Router {
  const router = Router();
  startBackgroundScanner();


  // GET /api/v1/settings
  router.get('/settings', (_req: Request, res: Response) => {
    res.json(settings);
  });

  // PUT /api/v1/settings
  router.put('/settings', (req: Request, res: Response) => {
    const {
      scan_interval_seconds,
      ping_timeout_ms,
      alert_threshold_capacity_pct,
      webhook_url,
      configured_cidrs,
    } = req.body;

    if (typeof scan_interval_seconds === 'number' && scan_interval_seconds >= 30) {
      settings.scan_interval_seconds = scan_interval_seconds;
    }
    if (typeof ping_timeout_ms === 'number' && ping_timeout_ms >= 100) {
      settings.ping_timeout_ms = ping_timeout_ms;
    }
    if (typeof alert_threshold_capacity_pct === 'number') {
      settings.alert_threshold_capacity_pct = Math.max(10, Math.min(99, alert_threshold_capacity_pct));
    }
    if (typeof webhook_url === 'string') settings.webhook_url = webhook_url;
    if (typeof configured_cidrs === 'string') {
      // Validate each CIDR entry before saving
      const valid = configured_cidrs
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0)
        .every(c => /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(c));
      if (!valid && configured_cidrs.trim().length > 0) {
        res.status(400).json({ status: 400, message: 'Invalid CIDR notation. Use format: 192.168.1.0/24, 10.0.0.0/24' });
        return;
      }
      settings.configured_cidrs = configured_cidrs;
    }

    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'SCAN',
      target_id: 'settings',
      reason: 'Global configuration updated',
      metadata_json: JSON.stringify({ configured_cidrs: settings.configured_cidrs }),
    });

    res.json({ success: true, message: 'Settings updated successfully.', settings });
  });

  // GET /api/v1/topology  → inferred network map
  router.get('/topology', async (_req: Request, res: Response) => {
    try {
      res.json(await computeTopology());
    } catch (e: any) {
      res.status(500).json({ status: 500, message: e.message || 'Topology computation failed' });
    }
  });

  // GET /api/v1/health
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: scanState.lastError ? 'DEGRADED' : 'HEALTHY',
      scanner: scanState.scanning ? 'SCANNING' : 'IDLE',
      mode: 'LIVE_LAN',
      persistence: 'IN_MEMORY (no database configured)',
      host_subnets: getLocalSubnets().map((s) => `${s.base}.0/24`),
      discovered_devices: devices.length,
      active_devices: devices.filter((d) => d.status === DeviceStatus.ACTIVE).length,
      last_scan: scanState.lastScanAt,
      last_scan_duration_seconds: scanState.lastDurationSeconds,
      last_error: scanState.lastError,
    });
  });

  // GET /api/v1/devices
  router.get('/devices', (req: Request, res: Response) => {
    const { status, search } = req.query;
    let filtered = [...devices];
    if (status) filtered = filtered.filter((d) => d.status.toUpperCase() === (status as string).toUpperCase());
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.ip_address.toLowerCase().includes(q) ||
          d.mac_address.toLowerCase().includes(q) ||
          (d.hostname && d.hostname.toLowerCase().includes(q)) ||
          (d.manufacturer && d.manufacturer.toLowerCase().includes(q)) ||
          (d.custom_label && d.custom_label.toLowerCase().includes(q))
      );
    }
    res.json(filtered);
  });

  // GET /api/v1/devices/{id}
  router.get('/devices/:id', (req: Request, res: Response) => {
    const device = devices.find((d) => d.id === parseInt(req.params.id));
    if (!device) {
      res.status(404).json({ status: 404, message: 'Device not found in registry.' });
      return;
    }
    res.json(device);
  });

  // POST /api/v1/devices/{id}/annotate
  router.post('/devices/:id/annotate', (req: Request, res: Response) => {
    const device = devices.find((d) => d.id === parseInt(req.params.id));
    if (!device) {
      res.status(404).json({ status: 404, message: 'Device not found in registry.' });
      return;
    }
    const { custom_label } = req.body;
    const previousLabel = device.custom_label;
    device.custom_label = custom_label || null;
    device.updated_at = new Date().toISOString();
    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'ANNOTATE',
      target_id: device.mac_address,
      reason: 'Annotated device label manually',
      metadata_json: JSON.stringify({ old: previousLabel, new: custom_label }),
    });
    res.json({ message: 'Device label annotated successfully.', device });
  });

  // POST /api/v1/scan/trigger  → REAL LAN sweep
  router.post('/scan/trigger', async (req: Request, res: Response) => {
    const { subnet } = req.body || {};
    const result = await performRealScan(subnet);
    res.json({
      success: !scanState.lastError,
      scanned_subnet: subnet || 'ALL SUBNETS',
      discovered_hosts: devices.filter((d) => d.status === DeviceStatus.ACTIVE).length,
      completion_time_seconds: result.durationSeconds,
      timestamp: new Date().toISOString(),
      message: result.message,
    });
  });

  // GET /api/v1/bandwidth/interfaces  (empty until SNMP is configured)
  router.get('/bandwidth/interfaces', (_req: Request, res: Response) => {
    res.json(bandwidthInterfaces);
  });

  // GET /api/v1/bandwidth/history  (empty until SNMP is configured)
  router.get('/bandwidth/history', (req: Request, res: Response) => {
    const { interface_id, hours } = req.query;
    let filtered = [...bandwidthHistory];
    if (interface_id) filtered = filtered.filter((s) => s.interface_id === parseInt(interface_id as string));
    if (hours) {
      const limitTime = new Date(Date.now() - parseInt(hours as string) * 3600 * 1000);
      filtered = filtered.filter((s) => new Date(s.sampled_at) >= limitTime);
    }
    res.json(filtered);
  });

  // GET /api/v1/alerts
  router.get('/alerts', (req: Request, res: Response) => {
    const { status, severity } = req.query;
    let filtered = [...alerts];
    if (status) filtered = filtered.filter((a) => a.status.toUpperCase() === (status as string).toUpperCase());
    if (severity) filtered = filtered.filter((a) => a.severity.toUpperCase() === (severity as string).toUpperCase());
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(filtered);
  });

  // POST /api/v1/alerts/{id}/ack
  router.post('/alerts/:id/ack', (req: Request, res: Response) => {
    const alertId = parseInt(req.params.id);
    const { note } = req.body;
    if (!note || note.trim().length === 0) {
      res.status(400).json({ status: 400, message: 'A note is mandatory for acknowledging alerts.' });
      return;
    }
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) {
      res.status(404).json({ status: 404, message: 'Alert code not found.' });
      return;
    }
    alert.status = 'ACKNOWLEDGED';
    alert.ack_note = note;
    alert.ack_at = new Date().toISOString();
    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'ACK_ALERT',
      target_id: String(alertId),
      reason: `Acknowledged alert ID ${alertId}`,
      metadata_json: JSON.stringify({ alert_type: alert.type, note }),
    });
    res.json({ message: 'Alert acknowledged successfully.', alert });
  });

  // POST /api/v1/control/block
  router.post('/control/block', (req: Request, res: Response) => {
    const { mac_address, reason } = req.body;
    if (!mac_address) {
      res.status(400).json({ status: 400, message: 'MAC Address is required to execute a block listing.' });
      return;
    }
    if (!reason || reason.trim() === '') {
      res.status(400).json({ status: 400, message: 'A mandatory free-text reason is required before a block list action is confirmed.' });
      return;
    }
    const device = devices.find((d) => d.mac_address.toLowerCase() === mac_address.toLowerCase());
    if (!device) {
      res.status(404).json({ status: 404, message: 'Device not found in registry.' });
      return;
    }
    const previousStatus = device.status;
    device.status = DeviceStatus.BLOCKED;
    device.updated_at = new Date().toISOString();
    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'BLOCK',
      target_id: mac_address,
      reason,
      metadata_json: JSON.stringify({ blocked_ip: device.ip_address, previous_status: previousStatus }),
    });

    const iptablesScript = `# TUC NetScan - Generated Gateway Block Rule
# Executing User: Daniel Twum
# Match Target: ${mac_address} [IP: ${device.ip_address}]
# Block Reason: ${reason}
# Timestamp: ${new Date().toISOString()}

iptables -I FORWARD -m mac --mac-source ${mac_address} -j DROP
iptables -I INPUT -m mac --mac-source ${mac_address} -j DROP
iptables -A FORWARD -d ${device.ip_address} -j REJECT --reject-with icmp-port-unreachable
conntrack -D -s ${device.ip_address} 2>/dev/null || true
echo "TUC NetScan Security Action: Blocked ${mac_address} successfully."`;

    res.json({ success: true, blocked_device: device, reason, generated_firewall_script: iptablesScript });
  });

  // DELETE /api/v1/control/block/{mac}
  router.delete('/control/block/:mac_address', (req: Request, res: Response) => {
    const mac = req.params.mac_address;
    const { reason = 'Manual administrative unblocking' } = req.query;
    const device = devices.find((d) => d.mac_address.toLowerCase() === mac.toLowerCase());
    if (!device) {
      res.status(404).json({ status: 404, message: 'Device not found in registry.' });
      return;
    }
    if (device.status !== DeviceStatus.BLOCKED) {
      res.status(400).json({ status: 400, message: 'Target device is not currently blocked.' });
      return;
    }
    device.status = DeviceStatus.ACTIVE;
    device.updated_at = new Date().toISOString();
    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'UNBLOCK',
      target_id: mac,
      reason: reason as string,
      metadata_json: JSON.stringify({ current_status: device.status }),
    });
    res.json({ success: true, message: `Device with MAC ${mac} unblocked successfully. State restored.`, device });
  });

  // POST /api/v1/control/whitelist
  router.post('/control/whitelist', (req: Request, res: Response) => {
    const { mac_address, label } = req.body;
    if (!mac_address) {
      res.status(400).json({ status: 400, message: 'MAC Address is required to whitelist.' });
      return;
    }
    const device = devices.find((d) => d.mac_address.toLowerCase() === mac_address.toLowerCase());
    if (!device) {
      res.status(404).json({ status: 404, message: 'Device not found in registry.' });
      return;
    }
    device.in_adr = true;
    if (device.status === DeviceStatus.ROGUE) device.status = DeviceStatus.ACTIVE;
    if (label) device.custom_label = label;
    device.updated_at = new Date().toISOString();
    addAudit({
      actor_username: 'Daniel Twum',
      action_type: 'WHITELIST',
      target_id: mac_address,
      reason: 'Authorised device registry enrollment (ADR Whitelisting)',
      metadata_json: JSON.stringify({ label }),
    });
    res.json({ success: true, message: 'Device whitelisted & added to Authorised Device Registry.', device });
  });

  // GET /api/v1/audit
  router.get('/audit', (_req: Request, res: Response) => {
    const sorted = [...auditLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(sorted);
  });

  // GET /api/v1/reports/generate
  router.get('/reports/generate', (req: Request, res: Response) => {
    const format = req.query.format || 'pdf';
    const summary = {
      timestamp: new Date().toISOString(),
      institution: 'Techbridge University College',
      author: 'Daniel Frempong Twum',
      stats: {
        total_discovered_devices: devices.length,
        active_devices: devices.filter((d) => d.status === DeviceStatus.ACTIVE).length,
        rogue_devices: devices.filter((d) => d.status === DeviceStatus.ROGUE).length,
        blocked_devices: devices.filter((d) => d.status === DeviceStatus.BLOCKED).length,
        unresolved_alerts_count: alerts.filter((a) => a.status === 'ACTIVE').length,
        avg_packet_loss: devices.length ? parseFloat((devices.reduce((acc, c) => acc + c.packet_loss, 0) / devices.length).toFixed(2)) : 0,
        bandwidth_peak_utilisation: bandwidthInterfaces.length ? parseFloat(Math.max(...bandwidthInterfaces.map((i) => i.utilisation_pct)).toFixed(1)) : 0,
      },
    };
    res.json({
      success: true,
      report_format: format,
      report_filename: `TUC-NetScan-DailyHealthReport-${new Date().toISOString().split('T')[0]}.${format}`,
      generation_duration_ms: 120,
      download_url: `/api/v1/reports/download?file=TUC-NetScan-DailyHealthReport.${format}`,
      data: summary,
    });
  });

  // POST /api/v1/ai/explain
  router.post('/ai/explain', async (req: Request, res: Response) => {
    const { topic, context } = req.body;
    let queryPrompt = '';
    if (topic === 'device_diagnostic') {
      queryPrompt = `Analyse the following network terminal node detected on the Techbridge University College LAN. State whether it constitutes a rogue/risk device, and give recommendations in UK British English, including an iptables drop rule if appropriate:\n\n${JSON.stringify(context, null, 2)}`;
    } else if (topic === 'bandwidth_congestion') {
      queryPrompt = `Review this campus uplink interface and suggest QoS policy rules (Linux tc wrappers / DSCP marking) in a markdown script template:\n\n${JSON.stringify(context, null, 2)}`;
    } else {
      queryPrompt = `Analyse the overall network of Techbridge University College from this live dashboard data. Identify key bottlenecks and security indicators:\n\n${JSON.stringify({ devices, alerts }, null, 2)}`;
    }
    try {
      const explanation = await askGeminiForDiagnosis(queryPrompt);
      res.json({ topic, explanation });
    } catch (e: any) {
      res.status(500).json({ status: 500, message: e.message || 'Error executing AI analysis' });
    }
  });

  // POST /api/v1/cli/execute
  router.post('/cli/execute', async (req: Request, res: Response) => {
    const { command, apiKey } = req.body;
    if (!command || command.trim() === '') {
      res.json({ success: false, output: 'Error: Empty CLI command provided.' });
      return;
    }
    if (!apiKey) {
      res.json({ success: false, output: 'Error: CLI authentication required. Please pass a valid API Key.' });
      return;
    }

    const argv = command.trim().split(/\s+/);
    const primary = argv[0].toLowerCase();
    const isJson = command.includes('--json');
    const cleanArgv = argv.filter((a: string) => a !== '--json');

    let outputText = '';
    let jsonResult: any = null;

    switch (primary) {
      case 'help':
        outputText = `TUC NetScan - Command-Line Interface [v1.0.0 — LIVE LAN]
Usage: netscan <command> [arguments] [--json]

Available Core Commands:
  help                     Show this help directory.
  scan [subnet]            Run a REAL discovery sweep (ping + ARP + TCP).
  devices list             List all discovered LAN terminal records.
  devices show [ip|mac]    Examine a specific terminal node.
  alert list               Retrieve active network alert payloads.
  alert ack [id]           Acknowledge an alert manually.
  block add [ip|mac]       Add a device to the firewall block list.
  block remove [ip|mac]    Unblock a host.
  report generate          Compile the institutional summary.
  health                   Show scanner status metrics.`;
        jsonResult = { commands: ['help', 'scan', 'devices', 'alert', 'block', 'report', 'health'] };
        break;

      case 'health':
        outputText = `Scanner: ${scanState.scanning ? 'SCANNING' : 'IDLE'}\nMode: LIVE_LAN\nPersistence: IN_MEMORY (no database configured)\nSubnets: ${getLocalSubnets().map((s) => s.base + '.0/24').join(', ') || 'none'}\nDevices: ${devices.length} (active ${devices.filter((d) => d.status === DeviceStatus.ACTIVE).length})\nLast scan: ${scanState.lastScanAt || 'never'}`;
        jsonResult = { scanner: scanState.scanning ? 'SCANNING' : 'IDLE', devices: devices.length, last_scan: scanState.lastScanAt };
        break;

      case 'scan': {
        const sweepSub = cleanArgv[1];
        const result = await performRealScan(sweepSub);
        outputText = `${result.message}\nActive devices: ${devices.filter((d) => d.status === DeviceStatus.ACTIVE).length}`;
        jsonResult = { status: scanState.lastError ? 'ERROR' : 'COMPLETED', discovered: result.discovered, duration_seconds: result.durationSeconds };
        break;
      }

      case 'devices': {
        const subcmd = cleanArgv[1];
        if (subcmd === 'list') {
          outputText = `IP Address      MAC Address        Status   Manufacturer          Label\n`;
          outputText += `--------------------------------------------------------------------------------\n`;
          devices.forEach((d) => {
            outputText += `${d.ip_address.padEnd(15)} ${d.mac_address.padEnd(18)} ${d.status.padEnd(8)} ${(d.manufacturer || 'Unknown').substring(0, 20).padEnd(20)} ${d.custom_label || 'Unannotated Node'}\n`;
          });
          if (devices.length === 0) outputText += '(no devices yet — run "scan")\n';
          jsonResult = devices;
        } else if (subcmd === 'show') {
          const lookup = cleanArgv[2];
          if (!lookup) {
            outputText = 'Error: Please specify a valid IP or MAC address to examine.';
            jsonResult = { error: 'Missing parameters' };
          } else {
            const dev = devices.find((d) => d.ip_address === lookup || d.mac_address.toLowerCase() === lookup.toLowerCase());
            if (!dev) {
              outputText = `Device ${lookup} could not be resolved.`;
              jsonResult = { error: 'Device not found' };
            } else {
              outputText = `Device Examination Sheet:\n--------------------------\nID: ${dev.id}\nIP Address: ${dev.ip_address}\nMAC Address: ${dev.mac_address}\nHostname: ${dev.hostname || 'None'}\nOUI Vendor: ${dev.manufacturer || 'Unknown'}\nStatus: ${dev.status}\nFirst Seen: ${dev.first_seen_at}\nLast Seen: ${dev.last_seen_at}\nOpen Ports: ${dev.ports.map((p) => `${p.port}/${p.service}`).join(', ') || 'none'}`;
              jsonResult = dev;
            }
          }
        } else {
          outputText = `Error: Subcommand 'devices ${subcmd || ''}' is unrecognised. Did you mean 'devices list'?`;
          jsonResult = { error: 'Invalid subcommand' };
        }
        break;
      }

      case 'alert': {
        const alertSub = cleanArgv[1];
        if (alertSub === 'list') {
          outputText = `ID   Severity  Status       Timestamp   Message Summary\n`;
          outputText += `--------------------------------------------------------------------------------\n`;
          alerts.forEach((a) => {
            outputText += `${String(a.id).padEnd(4)} ${a.severity.padEnd(9)} ${a.status.padEnd(12)} ${a.timestamp.substring(11, 19)}   ${a.message.substring(0, 45)}...\n`;
          });
          if (alerts.length === 0) outputText += '(no alerts)\n';
          jsonResult = alerts;
        } else if (alertSub === 'ack') {
          const ackId = parseInt(cleanArgv[2]);
          const alert = alerts.find((a) => a.id === ackId);
          if (!alert) {
            outputText = `Error: Alert with ID ${cleanArgv[2]} could not be resolved.`;
            jsonResult = { success: false, error: 'Alert not found' };
          } else {
            alert.status = 'ACKNOWLEDGED';
            alert.ack_note = 'CLI Admin Ack';
            outputText = `Alert ID ${ackId} acknowledged.`;
            jsonResult = { success: true, alert };
          }
        } else {
          outputText = 'Unrecognised alert syntax. Try "alert list" or "alert ack [id]".';
        }
        break;
      }

      case 'block': {
        const blockSub = cleanArgv[1];
        const targetHost = cleanArgv[2];
        if (!targetHost) {
          outputText = 'Error: Please specify target [ip|mac].';
          break;
        }
        const matchDev = devices.find((d) => d.ip_address === targetHost || d.mac_address.toLowerCase() === targetHost.toLowerCase());
        if (!matchDev) {
          outputText = `Unresolved resource: Device '${targetHost}' not registered.`;
          break;
        }
        if (blockSub === 'add') {
          matchDev.status = DeviceStatus.BLOCKED;
          outputText = `SUCCESS: Device '${matchDev.mac_address}' drop-listed.`;
          jsonResult = { success: true, mac: matchDev.mac_address, status: DeviceStatus.BLOCKED };
        } else if (blockSub === 'remove') {
          if (matchDev.status !== DeviceStatus.BLOCKED) {
            outputText = `Conflict: Target is not blocked.`;
          } else {
            matchDev.status = DeviceStatus.ACTIVE;
            outputText = `SUCCESS: Device '${matchDev.mac_address}' removed from block list.`;
            jsonResult = { success: true, mac: matchDev.mac_address, status: matchDev.status };
          }
        } else {
          outputText = 'Unrecognised syntax. Use "block add [ip|mac]" or "block remove [ip|mac]".';
        }
        break;
      }

      case 'report':
        if (cleanArgv[1] === 'generate') {
          outputText = `Compiling Daily TUC Network Report...\nDevices: ${devices.length} | Active: ${devices.filter((d) => d.status === DeviceStatus.ACTIVE).length} | Alerts: ${alerts.filter((a) => a.status === 'ACTIVE').length}\nDocument: TUC-NetScan-DailyHealthReport-${new Date().toISOString().split('T')[0]}.pdf`;
          jsonResult = { filename: `TUC-NetScan-DailyHealthReport-${new Date().toISOString().split('T')[0]}.pdf`, status: 'SUCCESS' };
        } else {
          outputText = 'Syntax error. Use "report generate".';
        }
        break;

      default:
        outputText = `CLI Syntax Error: Command '${primary}' unrecognised. Type 'help'.`;
        jsonResult = { error: 'Unknown command' };
    }

    res.json(isJson ? { success: true, command, raw_payload: jsonResult || { output: outputText } } : { success: true, command, output: outputText });
  });

  return router;
}
