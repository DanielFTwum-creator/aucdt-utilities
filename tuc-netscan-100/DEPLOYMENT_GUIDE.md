# TUC NetScan — Deployment & Administration Guide
### Techbridge University College (TUC) — Office of ICT & Innovation
**Author:** Daniel Frempong Twum, Head of ICT
**Document Ref:** TUC-ICT-OPG-2026-03
**Classification:** INTERNAL (ICT Operations Core)

---

## 1. System Overview & Architecture

TUC NetScan is a **single-process, single-port** full-stack application that performs **real**
local-network discovery and visibility. The React SPA and the Express REST API are served together on
**port 3000**. All state is held **in memory** and is rebuilt by live scans — there is no database in
the current build, and no simulated data.

```
        [ Local LAN segment(s) — auto-detected /24 ]
                          │
   ICMP ping-sweep  +  OS ARP cache  +  TCP connect probes
   (arp -a on Windows; ip neigh / /proc/net/arp on Linux)
                          │
                          ▼
   ┌──────────────────────────────────────────────┐
   │  Node process (port 3000)                     │
   │   • Express REST API   (/api/v1/*)            │
   │   • React 19 SPA (Vite build, served static)  │
   │   • Discovery engine: ping + ARP + port scan  │
   │   • Offline IEEE OUI vendor DB (~39k entries)  │
   │   • Inferred topology (gateway + MAC proxy)    │
   │   • In-memory device/alert/audit stores        │
   └──────────────────────────────────────────────┘
```

> **No database / cache is wired in.** The `docker-compose.yml` MariaDB (3307) and Redis (6379)
> services are **scaffolding for a future persistence layer** and are currently unused. Restarting the
> process clears discovered state (a fresh scan repopulates it).

---

## 2. Local Development & Build Verification

**Prerequisites:** Node.js 20+ and **pnpm** (this project uses pnpm exclusively — do not use npm).

### 2.1 Optional environment configuration
Create `.env.local` in the project root. The app runs fully **without** any of these.

```env
# Optional: enables live Gemini advisories. Omit to use the built-in local expert system.
GEMINI_API_KEY=AIzaSyYourGeminiKeyHere
```

There are intentionally **no DB/Redis credentials** — none are used.

### 2.2 Install & run
```bash
pnpm install      # standalone (this folder ships its own pnpm-workspace.yaml)
pnpm run dev      # Vite dev server + mounted Express API on :3000
```
Open `http://localhost:3000`. An initial sweep runs ~1.5s after boot, then every 5 minutes; you can
also trigger a scan from the dashboard.

### 2.3 Build
```bash
pnpm run build    # emits dist/
pnpm run start    # runs server.ts: serves dist/ + the API on :3000
```
> `pnpm run lint` runs `tsc --noEmit`. A `tsconfig.json` is **not** currently committed (Vite/esbuild
> transpiles without one); add one if you want full type-checking in CI.

---

## 3. Production Deployment via Docker

The application itself is a single container. **Host networking is required** so the scanner can see
the campus LAN and read the host ARP cache.

```yaml
# minimal, accurate compose for the current (DB-less) build
services:
  netscan-app:
    build: { context: ., dockerfile: Dockerfile }
    container_name: netscan-app
    network_mode: "host"          # required for real LAN ARP/ping/port scans
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: on-failure
```

```bash
docker compose up --build -d
docker compose logs -f netscan-app
```

> The committed `docker-compose.yml` still declares `mariadb` and `redis`. They are **not consumed by
> the app**. Leave them out (as above) until a persistence layer is implemented, or keep them as
> placeholders — either way they do not affect scanning.

---

## 4. Linux / Ubuntu Server Notes (campus scanner node)

The discovery engine is cross-platform and shells out to standard tools:

- **Ping sweep** uses the system `ping` binary (`ping -c 1 -W 1 <ip>`), which is setuid on standard
  Ubuntu — **no root required**.
- **ARP cache** is read via `ip neigh show` (falling back to `/proc/net/arp`). Ensure `iproute2` is
  installed (default on Ubuntu).
- **Port scan** uses ordinary TCP connects — no elevated privileges needed.
- **Default gateway** for the topology map is read from `/proc/net/route`.

For Docker, prefer `network_mode: "host"`. If you must isolate the container, a **macvlan** network
bound to the campus interface also works:

```bash
docker network create -d macvlan \
  --subnet=<campus-subnet>/24 --gateway=<campus-gw> -o parent=eth0 macvlan_netscan
```

---

## 5. Plesk & Ubuntu Reverse Proxy (Nginx)

```
Client HTTPS:443 ──► Plesk Nginx (SSL termination) ──► NetScan container HTTP:3000
```

The dashboard talks to the API over plain HTTP and **polls every ~6 seconds** (there is no WebSocket
channel), so the proxy only needs straightforward forwarding.

1. **Websites & Domains → SSL/TLS Certificates → Let's Encrypt** for `netscan.techbridge.edu.gh`.
2. **Websites & Domains → Apache & Nginx Settings**, then add to **Additional Nginx directives**:

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 120s;
}
```

(No `Upgrade`/`Connection: upgrade` directives are required — the app does not use WebSockets.)

---

## 6. Upgrade Path — making Bandwidth & exact Topology real

Two capabilities are intentionally **not** faked and require infrastructure access:

- **Bandwidth / throughput:** add an **SNMP poller** (v2c/v3) against the managed switches'
  `IF-MIB` (`ifHCInOctets` / `ifHCOutOctets`) to populate `/api/v1/bandwidth/*`. Requires valid
  community strings / SNMPv3 credentials on the core switches.
- **Exact topology (which port / which AP):** today the map is **inferred** from the default gateway
  and shared-MAC (proxy-ARP) signatures. For ground truth, read the switches' **bridge-MIB
  forwarding tables** (MAC→port) and **LLDP/CDP** neighbour tables via SNMP. On the TUC managed
  switches this turns the inferred tree into an exact, port-level topology.

For deep "rogue traffic" inspection, mirror a switch port (**SPAN**) into an IDS such as **Zeek** or
**Suricata** — host-based promiscuous mode is unreliable on switched/Wi-Fi segments and is not used.

---

## 7. Current Limitations (state of this build)

| Area | Status |
|---|---|
| Device discovery, MAC/vendor, ports, alerts, topology | ✅ Real, working |
| Offline vendor names (IEEE OUI) | ✅ Bundled, ~39k entries |
| Bandwidth / per-interface throughput | ⚠️ Empty until SNMP configured (not faked) |
| Persistence (DB) | ⚠️ In-memory only; resets on restart |
| Exact L2 topology | ⚠️ Inferred; needs SNMP/LLDP for ground truth |
| AuthN/AuthZ on admin actions | ⚠️ Not yet implemented — restrict via reverse proxy / network |

---

## 8. Authorised Use

TUC NetScan performs **active** scanning (ICMP sweeps and TCP connections). Operate it **only on
networks you are authorised to scan** — the TUC campus LAN or your own network. Unauthorised scanning
of third-party networks may breach acceptable-use and computer-misuse law.

---
**Techbridge University College — Leading Digital Transformation**
