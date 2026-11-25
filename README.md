# AI Engineer OS — 10-Month Mentor & Study Tracker

A mobile-first, PWA-ready study OS for a working professional becoming a production AI Engineer: 7 phases · 40 weeks · 280 days at ~13.5 h/week, fully pre-populated.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Works immediately in **guest mode** — everything is stored in your browser's localStorage.

## What's inside

| Screen | What it does |
|---|---|
| **Today** | KPI strip (phase/week, % progress, streak, weekly hours vs 13.5 h, revision backlog), today's topic with resources and a status selector, mentor notes, side-by-side interview prep, daily logbook, charts |
| **Roadmap** | All 7 phases with curated resources; 40 weeks → 280 days mapped to real dates; click any day |
| **Revision** | Spaced repetition (+3/+7/+14 d), low-confidence (≤3★) and blocker queue, Friday checklist, monthly architecture sheets, searchable history |
| **Projects** | The 5 flagship projects with checklists, eval scorecards, GitHub and demo URLs |
| **Mentor Sync** | One-click Markdown check-in report (Today/Week/Phase), read-only share link, JSON export/import |

**Weekly rhythm:** Mon–Thu 90 min (45 concept + 45 hands-on) · Fri 75 min revision (no new material) · Sat/Sun 3 h deep build = 810 min = 13.5 h.

**Rescheduling:** "Push +1 day" on any day, or "Reschedule" on Today after missed days. This adds rest dates, and every later day shifts forward. Logs are keyed by day number, so nothing is lost. You can manage rest dates in Settings.

## Phone ↔ PC sync

Open **Sync** in the top header (also available from Settings). The panel has two options:

1. **Cloud Sync (optional):** create a free Supabase project and run the 3-line SQL shown in the panel (also in `supabase/schema.sql`). It creates `user_progress` with row-level security. Paste your **Project URL** and **anon public key**, click Save, then sign in or create an account. Use the same email and password on each device. Keys are stored only in that browser's localStorage. To sign up instantly without a confirmation email, turn off "Confirm email" under Supabase → Authentication → Providers → Email.
2. **Instant Local Transfer:** use **Export Backup (.json)** and **Import Backup (.json)**. No database is needed.

Sync is last-write-wins on the whole snapshot. It pulls on sign-in and window focus and pushes 1.2 s after edits. The first sign-in on a device that already has local progress asks which copy to keep. Optionally, you can bake keys in at build time with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

## Tracks

Every week has 5 color-coded track tasks with links: **AI Core** (the daily topic), **Backend** (drilled on Mondays), **Docker** (Tuesdays), **Security & CI/CD** (Wednesdays) and **AWS** (Thursdays). Focus windows get full hands-on sessions: Backend W9–12, Docker W10–15, Security & CI/CD W14–16 and W22–24, AWS W25–28. Outside those windows the task is a 15–20 min drill. Use the Roadmap's track filter to see one track across all 40 weeks. Track tasks are in `src/data/tracks.ts`.

## 2026 production topics & Cookbooks

Four modern topics are woven into specific weeks. Each has one concrete task per week and an interview question in the Interview Prep panel:
- **Multimodal Document Parsing & Vision-RAG** (W9–12)
- **Type-Safe Agent SDKs: PydanticAI & OpenAI Agents SDK** (W13–16)
- **Retrieval-First Debugging & Grounding** (W21–24)
- **Reasoning Models & Test-Time Compute Trade-Offs** (W25–28)

The **Cookbooks & Notes** drawer (sidebar and header) holds 8 reference repos. They're bookmarks only and never count toward daily hours. All of this lives in `src/data/modern.ts`.

## Deploy

`npm run build` produces a static `dist/` folder. Deploy it to Vercel, Netlify, Cloudflare Pages or GitHub Pages. Set the two `VITE_SUPABASE_*` env vars in the host if you want sync. Once served over HTTPS, it is installable as a PWA ("Add to Home Screen").

## Editing the curriculum

- `src/data/resources.ts`: every resource (title, URL, type badge, time estimate)
- `src/data/weeks1.ts` / `weeks2.ts` / `weeks3.ts`: per-week mentor notes, 4 daily topics (concept + hands-on tasks, resource IDs, cold-recall Q/A, interview Q/A), plus a coding question, a system design question and a weekend build per week
- `src/data/curriculum.ts`: phases, flagship projects; in dev mode it logs any unknown resource ID to the console

Stack: React 18 · TypeScript · Vite · Tailwind CSS v4 · Lucide · Recharts · Supabase JS.
