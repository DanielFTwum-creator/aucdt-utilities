# TUC NetScan — Campus Network Scanner & Monitor

**Techbridge University College (TUC) — Office of ICT & Innovation**
Author: Daniel Frempong Twum, Head of ICT

A full-stack, single-port web application that performs **real local-network discovery** — live host
discovery, MAC/vendor identification, TCP port scanning, an inferred topology map, and security alerts
raised from genuine findings. There is **no simulated/seeded data**: every device shown is one the
scanner actually found on the LAN.

---

## What it does (real, not simulated)

- **Live host discovery** — parallel ICMP ping-sweep of the local `/24`(s) + the OS ARP cache
  (`arp -a` on Windows, `ip neigh` / `/proc/net/arp` on Linux). Cross-platform (Windows + Ubuntu).
- **TCP port scan** of each live host (common service ports), with risk flags for exposed
  Telnet / SMB / RDP / NetBIOS.
- **Vendor identification** via a **bundled offline IEEE OUI database** (~39k entries,
  [`src/server/oui-data.json`](src/server/oui-data.json)) — works with no internet. Randomised
  (locally-administered) phone MACs are labelled as such rather than guessed.
- **Inferred network topology** (`/api/v1/topology`) — Internet → Router → Wi-Fi extenders →
  clients + direct hosts. The gateway is read from the OS route table; extender→client links are
  inferred from shared-MAC (proxy-ARP) signatures. *Exact switch-port / AP attachment needs SNMP
  bridge-MIB or LLDP on managed gear — see the Deployment Guide.*
- **Live state** — devices are keyed by IP; re-scans mark no-longer-present hosts `INACTIVE`
  (this is the "reset" behaviour). Operator actions (BLOCK / ADR whitelist) persist across scans.
- **Security alerts** raised only from real conditions (e.g. a host exposing SMB/RDP/Telnet).
- **Admin tooling** — device annotation, MAC block/unblock (generates iptables rules), ADR
  whitelisting, audit log, CSV/PDF report payloads, an embedded CLI, and a Gemini-backed advisory
  panel (falls back to a local expert system when `GEMINI_API_KEY` is unset).

## Not yet implemented (and not faked)

- **Bandwidth / per-interface throughput** — requires **SNMP polling of managed switches** with
  valid community strings/credentials. Those panels read empty until configured; they are *not*
  populated with invented numbers.
- **Persistence** — state is **in-memory** and resets when the server restarts. No database is wired
  in (the `docker-compose.yml` MariaDB/Redis services are scaffolding for a future persistence layer
  and are currently unused).

---

## Run locally

**Prerequisites:** Node.js 20+ and **pnpm** (this project uses pnpm exclusively).

```bash
pnpm install
pnpm run dev
```

Then open **http://localhost:3000**. A first discovery sweep runs automatically ~1.5s after start,
and again every 5 minutes; you can also trigger one from the **Network Vitals** tab.

> This folder ships its own [`pnpm-workspace.yaml`](pnpm-workspace.yaml), so `pnpm install` resolves
> dependencies standalone (it is **not** a member of the parent `aucdt-utilities` workspace) and the
> required build scripts (esbuild, etc.) are pre-approved.

### Optional configuration

Create `.env.local` in the project root:

```env
# Optional — enables live Gemini advisories. Without it, a local expert system is used.
GEMINI_API_KEY=your-gemini-key
```

### Scripts

| Script | Purpose |
|---|---|
| `pnpm run dev` | Vite dev server + mounted Express API on port 3000 |
| `pnpm run build` | Production static build (`dist/`) |
| `pnpm run start` | Run the unified Express server (`server.ts`) serving `dist/` + API |

---

## Project layout

```
index.html              Vite entry (mounts the SPA)
src/index.tsx           React entry
src/index.css           Tailwind + app utilities
src/App.tsx             Dashboard UI (9 tabs)
src/server/api.ts       Express REST API + real scanning engine
src/server/oui-data.json  Bundled offline IEEE OUI vendor database
server.ts               Production server (serves built SPA + API)
vite.config.ts          Mounts the API as Vite middleware in dev
```

## REST API (prefix `/api/v1`)

`GET /health` · `GET /devices` · `GET /devices/:id` · `POST /devices/:id/annotate` ·
`POST /scan/trigger` · `GET /topology` · `GET /alerts` · `POST /alerts/:id/ack` ·
`POST /control/block` · `DELETE /control/block/:mac` · `POST /control/whitelist` ·
`GET /audit` · `GET /reports/generate` · `POST /ai/explain` · `POST /cli/execute`

(`bandwidth/*` endpoints exist but return empty until SNMP is configured.)

---

## Authorised use

TUC NetScan performs active scanning (ping sweeps, TCP connections) of the local network. Run it
**only on networks you are authorised to scan** — e.g. the TUC campus LAN or your own network.

See [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) for production deployment, Linux/Plesk notes, and the
SNMP/LLDP upgrade path for true topology and bandwidth.
