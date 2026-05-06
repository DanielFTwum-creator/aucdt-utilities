# TechBridge Strategy Dashboard - Backend (scaffold)

This folder contains a minimal TypeScript + Express backend scaffold intended to satisfy the SRS requirements for a backend API.

Quick start (from this directory):

```bash
# install deps
npm install

# dev (hot-reload)
npm run dev

# build
npm run build

# start (after build)
npm start
```

Exposes endpoints:
- `GET /api/requirements` — returns a slice of the SRS file if available
- `GET /api/pdfs` — lists uploaded files
- `POST /api/upload` — multipart `file` upload (field name `file`)
- `GET /api/health` — health check

Authentication:
- `POST /api/auth/login` — body `{password}` returns `{token}` (JWT). Default admin password: `admin123` (set `ADMIN_PASSWORD` env var in production).

Admin-only endpoints (require `Authorization: Bearer <token>`):
- `POST /api/requirements` — create a requirement `{code, text}`
- `PUT /api/requirements/:id` — update requirement text `{text}`
- `DELETE /api/requirements/:id` — delete requirement
- `GET /api/logs` and `POST /api/logs` — read/append audit logs

Data storage:
- `server/data/requirements.json` stores editable requirements created via the API.
- Audit log: `server/logs/audit.log`.

Uploads are stored in `server/uploads`.
