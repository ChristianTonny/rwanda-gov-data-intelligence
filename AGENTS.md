# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Rwanda Government Data Intelligence (RGDI) — a hackathon MVP ("ChatGPT for Rwanda's data"). It is a **pnpm workspace monorepo** with the primary app at `apps/web` (Next.js 15) and shared services under `services/`.

### Key services

| Service | Start command | Port | Notes |
|---|---|---|---|
| Next.js frontend + API | `pnpm dev:web` | 3000 | Primary service; serves UI and all `/api/*` endpoints |
| Express backend (optional) | `cd backend && npm run dev` | 5000 | Alternative backend, not wired to frontend by default |

Only the Next.js dev server needs to run for the full app to work. No database, Docker, or external search service is required — the app uses file-based JSON seeds (`data/seeded/`) and in-memory search.

### Running & testing

- **Dev server:** `pnpm dev:web` (runs Next.js on port 3000)
- **Build:** `pnpm build:web` — note: has a pre-existing error in `app/maps/page.tsx` (`ssr: false` not allowed in Server Components)
- **Lint:** `pnpm lint` — currently fails because no `.eslintrc` config file exists in the repo
- **Format:** `pnpm format` (Prettier)
- **Tests:** `vitest` is declared as a devDependency but no test files exist yet

### Gotchas

- The `pnpm.onlyBuiltDependencies` field in root `package.json` allows build scripts for `@tailwindcss/oxide`, `esbuild`, `sharp`, and `unrs-resolver`. Without this, `pnpm install` will warn about ignored build scripts and Tailwind CSS / Next.js image optimization won't work.
- The seed data files (`data/seeded/populations.json`, `data/seeded/supplies.json`) are empty arrays by default. Search and dashboard endpoints return empty results until data is seeded.
- The `.env` file for the Next.js app lives at `apps/.env` (not `apps/web/.env`). Next.js picks it up via the `experimental.externalDir` config.
- The `GEMINI_KEY` env var enables AI-powered query answers. Without a valid key, `/api/query` returns "No answer." but all other endpoints work fine.
