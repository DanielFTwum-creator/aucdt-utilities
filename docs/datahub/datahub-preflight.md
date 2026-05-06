# DataHub Pre-flight Verification Report

**Date:** 2026-04-19  
**Environment:** Techbridge University College — aucdt-utilities monorepo  
**Host:** Windows 11 Home 10.0.26200 (Git Bash shell)

---

## 1. Docker Desktop

| Check | Result | Status |
|---|---|---|
| Docker Client Version | 29.3.1 | ✅ |
| Docker Engine Version | 29.3.1 | ✅ |
| Docker Desktop Version | 4.68.0 (223695) | ✅ |
| Context | desktop-linux (WSL2 backend) | ✅ |
| Daemon reachable | Yes | ✅ |

## 2. Resource Allocation

| Resource | Allocated | Minimum Required | Status |
|---|---|---|---|
| CPUs | 4 | 2 | ✅ |
| RAM | ~11.7 GB (12,544,364,544 bytes) | 8 GB | ✅ |
| Disk | Not auto-detected (manual: ≥20 GB recommended) | 20 GB | ⚠️ Verify manually |

## 3. Python / pip

| Check | Result | Status |
|---|---|---|
| Python Version | 3.13.7 | ✅ |
| pip Version | 26.0.1 | ✅ |
| Location | C:\Users\DELL\AppData\Local\Programs\Python\Python313 | ✅ |

## 4. Port Availability

Checked by inspecting running Docker containers (no containers active at time of check).

| Port | Service | Status |
|---|---|---|
| 9002 | DataHub Frontend UI | ✅ Free |
| 8080 | DataHub GMS API | ✅ Free |
| 9092 | Kafka | ✅ Free |
| 3306 | MySQL | ✅ Free |
| 2181 | ZooKeeper | ✅ Free |
| 9200 | Elasticsearch | ✅ Free |

> **Note:** Port 8080 is also used by the monorepo's NGINX gateway (`docker-compose.yml`). Ensure the main `docker-compose up` stack is stopped before running DataHub quickstart.

## 5. Running Containers at Pre-flight

None — clean slate confirmed.

## 6. Windows-Specific Notes

- Shell: Git Bash (`/bin/bash.exe`) — standard Unix tools at `C:\Program Files\Git\usr\bin`
- DataHub CLI must be installed into a Python venv (Python 3.13 detected)
- WSL2 memory default is ~2 GB; Docker Desktop override controls actual allocation
- Actual Docker memory (11.7 GB) is sufficient — **no `.wslconfig` changes needed**

## 7. Pre-flight Decision

**GO** — all critical checks pass. Proceeding with DataHub CLI installation.
