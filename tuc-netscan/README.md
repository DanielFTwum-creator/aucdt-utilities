# TUC NetScan — Campus Network Scanner & Monitor

**Document:** TUC-ICT-SRS-2026-012  
**Author:** Daniel Frempong Twum, Head of ICT — Techbridge University College  
**Stack:** React 19 + TypeScript + Vite · Spring Boot 3 / Java 21 · MariaDB (port 3307) · Redis · Docker

---

## Quick Start (Dev Mode — Mock Data)

```bash
# 1. Backend
cd backend
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

# 2. Frontend (new terminal)
cd frontend
pnpm install
pnpm dev

# 3. Open http://localhost:3000
# Login: daniel.twum / tuc-ict-2026
```

Or with Make:
```bash
make dev-backend    # terminal 1
make dev-frontend   # terminal 2
```

---

## Docker (Full Stack)

```bash
cp .env.example .env
# Edit .env with real credentials
make up
# Access: http://localhost:3000
```

---

## Architecture

```
frontend/   React 19 + TypeScript + Vite + Tailwind + TanStack Query
backend/    Spring Boot 3 / Java 21 + Spring Security + JWT + Spring Shell CLI
            ├── service/mock/   MockDataService (dev profile — no real network needed)
            ├── api/controller/ REST controllers (13 endpoints)
            ├── ws/             WebSocket real-time handler
            └── cli/            Spring Shell commands (FR-CLI-001)
```

---

## CLI (Spring Shell)

```bash
# Start in interactive mode
java -jar backend/target/*.jar --spring.shell.interactive.enabled=true

# Available commands:
scan --subnet 192.168.1.0/24
devices list --status ROGUE
devices show --id 1
alert list
alert ack --id 1 --note "Investigated — known device"
block add --mac 00:1A:2B:3C:4D:16 --reason "Unauthorised streaming"
block remove --id 1
health
report generate
```

All commands support `--json` for machine-readable output.

---

## Default Users (Dev)

| Username      | Password     | Role     |
|---------------|--------------|----------|
| daniel.twum   | tuc-ict-2026 | ENGINEER |
| admin         | admin-2026   | ADMIN    |

---

## Mock Data Seeded

The dev profile seeds 25 realistic TUC campus devices including:
- Cisco gateway + core switch
- Ubiquiti UniFi APs × 2
- Dell/HP servers (file server, Moodle LMS)
- Computer lab workstations × 4
- Student laptops + phones (Apple, Samsung, Tecno)
- Hikvision CCTV cameras × 2
- Promethean smart boards × 2
- 1 ROGUE device + 1 BLOCKED device

Bandwidth history seeded for the last 24 hours. New samples generated every 30s.

---

## Operations

```bash
make health      # Check system health
make scan-now    # Trigger immediate scan
make backup      # Dump MariaDB to backups/
make logs        # Tail backend logs
```

---

## Production Checklist

- [ ] Set `SPRING_PROFILES_ACTIVE=prod`
- [ ] Generate strong `JWT_SECRET` (≥ 64 chars, base64)
- [ ] Change all default passwords
- [ ] Configure real subnet in `SCAN_SUBNETS`
- [ ] Set `netscan.mock.enabled=false` in application-prod.yml
- [ ] Add DNS A record: netscan.techbridge.edu.gh → server IP
- [ ] Nginx reverse proxy HTTPS termination
- [ ] systemd service: `netscan.service` with `Restart=on-failure`
- [ ] Run OWASP dependency check before go-live

---

*TUC-ICT-SRS-2026-012 | Techbridge University College | Oyibi, Ghana*
