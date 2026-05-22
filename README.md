# DrDashboard — Emergency Department Doctor UI

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

Lightweight React + TypeScript dashboard for Emergency Department clinicians to monitor queues, prioritize red-flag patients, and manage consultations.

## Key Features

- Real-time queue with priority and red-flag highlighting
- Doctor authentication and consultation ownership
- Patient detail workspace with parsed history, vitals, and AI summary editing
- Auto-refresh with manual refresh, error handling, and retry

## Quick start

Prerequisites:

- Node.js 18+ and npm

Install and run locally:

```bash
git clone <repo-url>
cd DrDashboard
npm install
npm run dev
```

Open the app at: http://localhost:5173

Build for production:

```bash
npm run build
npm run preview
```

## Environment

Create a local environment file from the example and set the API base URL:

```bash
cp .env.example .env.local
# edit .env.local -> VITE_API_BASE_URL=https://your-api/api
```

Important env vars:

- `VITE_API_BASE_URL` — backend API endpoint
- `VITE_REFRESH_INTERVAL` — auto-refresh interval (ms, default 30000)
- `VITE_MAX_RETRY_ATTEMPTS` — API retry attempts

## Project layout

See the `src/` folder for the application code. Important folders:

- `src/components` — UI components
- `src/context` — app and auth context providers
- `src/services` — `api.ts` and `parser.ts` (parses JSON strings from backend)
- `src/types` and `src/utils` — helpers and types

Full structure (trimmed):

```
src/
├─ components/
├─ context/
├─ services/
├─ types/
└─ utils/
```

## API (overview)

The frontend depends on a REST API. Configure `VITE_API_BASE_URL` to point at your backend.

Common endpoints used by the UI:

```
POST /api/auth/login
GET  /api/view
POST /api/patient/:id/start-consultation
POST /api/patient/:id/override-redflag
```

Notes:
- Write operations include an `x-api-key` header (configured via `VITE_HOSPITAL_API_KEY`).
- Some fields (e.g., `complaints`, `details`) arrive as JSON strings and are parsed in `src/services/parser.ts`.

## Contributing

If you'd like to contribute:

1. Open an issue to discuss changes.
2. Create a branch and submit a PR with clear scope and tests where applicable.

## Troubleshooting

- If data fails to load, verify `VITE_API_BASE_URL` and CORS on the backend.
- For parser warnings, inspect the browser console for malformed records.

## References

- [Architecture](ARCHITECTURE.md)
- [Implementation notes](IMPLEMENTATION.md)
- [Deployment guide](DEPLOYMENT.md)

---

Version: 1.0.0  
Last updated: 2026-05-22
