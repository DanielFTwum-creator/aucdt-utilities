# CLAUDE.md — LyriaStream Bulletproof Directive
# TUC-ICT-SRS-2026-008 v2.0 | Multi-Model Self-Hosted AI Music Generator

## 🔒 IMMUTABLE RULES — NEVER VIOLATE

### Stack (locked)
- **AIM**: Python 3.11 / FastAPI / PyTorch 2.x / Transformers / Diffusers
- **Gateway**: Java 21 / Spring Boot 3.3 / WebFlux / Spring Security / JPA
- **Frontend**: React 19.x / TypeScript / Vite / Tailwind CSS / pnpm
- **DB**: MariaDB 10.11 on port 3307 | database: `lyriastream_db` | prefix: `ls_`
- **Cache**: Redis 7 on DB 2 | prefix: `lyriastream_sess_`
- **Package manager**: pnpm (frontend) | pip + pyproject.toml (AIM) | Maven (gateway)

### Models (CPU-first — no Lyria, no Google, no external AI APIs)
- **Active (CPU)**: `facebook/musicgen-medium` (weight 0.70) + Riffusion (weight 0.30)
- **Staged (GPU)**: musicgen-large, stable-audio-open, audioldm2 — stub only until GPU provisioned
- Model weights cached to `/var/lyriastream/models/` — never committed to git

### Streaming
- ALL audio streaming over HTTPS only
- SSE endpoint: `GET /api/v1/stream/{jobId}` (text/event-stream)
- Chunked HTTP: `GET /api/v1/audio/{jobId}/stream` (audio/mpeg)
- AIM ↔ Gateway: internal network only, X-AIM-Key header auth
- SSE events: `progress` | `blend_update` | `audio_chunk` | `error` | `done` | `: ping`

### Security
- JWT HS512 (15-min access / 7-day refresh httpOnly cookie)
- Admin: role=ADMIN + TOTP 2FA
- TOTP secrets: AES-256-CBC encrypted at rest
- Rate limiting via Redis: 60 req/min (authed) | 10 req/min (anon)
- HSTS enforced on all responses

### Architecture rules
- AIM NEVER exposed to internet — Docker internal network only
- Gateway is the ONLY public-facing backend service
- No dynamic SQL — JPA/Hibernate prepared statements only
- File paths derived from UUID only — no user input in file paths
- All timestamps UTC

## 📁 Monorepo Structure
```
lyriastream/
├── CLAUDE.md              ← this file
├── docker-compose.yml     ← full stack local dev
├── .env.example
├── aim/                   ← Python FastAPI AI Inference Microservice
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── app/
│       ├── main.py        ← FastAPI app entry
│       ├── config.py      ← Settings (pydantic-settings)
│       ├── api/           ← Route handlers
│       ├── models/        ← Model loaders (musicgen, riffusion, ...)
│       ├── router/        ← Model Router (blend recipe logic)
│       ├── blender/       ← Spectral Blender (mel + Griffin-Lim)
│       ├── streaming/     ← Job manager + SSE chunk publisher
│       └── schemas/       ← Pydantic request/response schemas
├── gateway/               ← Spring Boot 3 API Gateway
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/gh/edu/tuc/lyriastream/
│       │   ├── api/controller/   ← REST + SSE controllers
│       │   ├── api/dto/          ← Request/response DTOs
│       │   ├── client/           ← AimClient (WebClient)
│       │   ├── config/           ← Security, Redis, WebFlux config
│       │   ├── domain/entity/    ← JPA entities
│       │   ├── domain/repository/← Spring Data repos
│       │   ├── security/         ← JWT filter, TOTP service
│       │   └── service/          ← Business logic
│       └── resources/
│           └── application.yml
└── frontend/              ← React 19 + TypeScript + Vite
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── src/
        ├── components/    ← UI components
        ├── hooks/         ← useSSEStream, useAudioPlayer, useTheme
        ├── services/      ← API client
        ├── store/         ← Zustand stores
        └── types/         ← TypeScript interfaces
```

## 🚦 After EVERY feature implementation run gap analysis:

### Checklist
☐ Does the feature match the SRS (TUC-ICT-SRS-2026-008 v2.0)?
☐ Are all SSE events correct (schema §8.2)?
☐ Is CPU-only mode respected (no GPU assumptions)?
☐ Are JWT + rate limiting applied on new endpoints?
☐ Is the AIM endpoint internal-only?
☐ Are all new env vars in .env.example?
☐ Is there a test for this feature?
☐ Is the audit log updated if admin action?

## 🎵 Blend Recipes (CPU dev mode)
```json
{
  "default":   { "musicgen_medium": 0.70, "riffusion": 0.30 },
  "ambient":   { "musicgen_medium": 0.50, "riffusion": 0.50 },
  "energetic": { "musicgen_medium": 0.80, "riffusion": 0.20 }
}
```
