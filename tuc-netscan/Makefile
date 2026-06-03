# TUC NetScan — Makefile
# Document: TUC-ICT-SRS-2026-012
# Usage: make <target>

.PHONY: dev up down build clean scan-now backup logs health

# ── Development ───────────────────────────────────────────────────────
dev:
	@echo "Starting TUC NetScan in dev mode..."
	@cd frontend && pnpm install && pnpm dev &
	@cd backend && SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

dev-backend:
	cd backend && SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

dev-frontend:
	cd frontend && pnpm install && pnpm dev

# ── Docker ────────────────────────────────────────────────────────────
up:
	docker compose up -d
	@echo "TUC NetScan running at http://localhost:3000"

down:
	docker compose down

build:
	docker compose build --no-cache

restart:
	docker compose restart backend

logs:
	docker compose logs -f backend

# ── Operations ────────────────────────────────────────────────────────
health:
	@curl -s http://localhost:8080/api/v1/health | python3 -m json.tool

scan-now:
	@TOKEN=$$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
		-H "Content-Type: application/json" \
		-d '{"username":"daniel.twum","password":"tuc-ict-2026"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])"); \
	curl -s -X POST http://localhost:8080/api/v1/scan/trigger \
		-H "Authorization: Bearer $$TOKEN" \
		-H "Content-Type: application/json" | python3 -m json.tool

backup:
	@mkdir -p backups
	@docker exec netscan-db mariadb-dump -u netscan -pnetscan-pass-2026 netscan \
		> backups/netscan-$$(date +%Y%m%d-%H%M%S).sql
	@echo "Backup saved to backups/"
	@ls -lh backups/ | tail -5

# ── Install ────────────────────────────────────────────────────────────
install-deps:
	@which nmap || sudo apt-get install -y nmap arp-scan
	@which java || sudo apt-get install -y openjdk-21-jdk
	@which mvn  || sudo apt-get install -y maven
	@which pnpm || npm install -g pnpm

clean:
	docker compose down -v
	rm -rf frontend/dist backend/target
