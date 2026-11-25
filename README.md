# AI Engineer OS — 10-Month Mentor & Study Tracker

A mobile-first, PWA-ready study OS for a working professional becoming a production AI Engineer: 7 phases · 40 weeks · 280 days at ~13.5 h/week, fully pre-populated.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

Works immediately: everything is stored in your browser's localStorage, with no sign-up.

## What's inside

| Screen | What it does |
|---|---|
| **Today** | KPI strip (phase/week, % progress, streak, weekly hours vs 13.5 h, revision backlog), today's topic with resources and a status selector, mentor notes, side-by-side interview prep, daily logbook, charts |
| **Roadmap** | All 7 phases with curated resources; 40 weeks → 280 days mapped to real dates; click any day |
| **Revision** | Spaced repetition (+3/+7/+14 d), low-confidence (≤3★) and blocker queue, Friday checklist, monthly architecture sheets, searchable history |
| **Projects** | The 5 flagship projects with checklists, eval scorecards, GitHub and demo URLs |
| **Mentor Sync** | One-click Markdown check-in report (Today/Week/Phase), read-only share link, JSON backup |

**Weekly rhythm:** Mon–Thu 90 min (45 concept + 45 hands-on) · Fri 75 min revision (no new material) · Sat/Sun 3 h deep build = 810 min = 13.5 h.

**Rescheduling:** "Push +1 day" on any day, or "Reschedule" on Today after missed days. This adds rest dates, and every later day shifts forward. Logs are keyed by day number, so nothing is lost. You can manage rest dates in Settings.

## Storage & moving between Phone and PC

Everything is stored **locally in your browser** (localStorage). There's no account, no database and no server. To move progress between devices, open **Backup** in the header (or Settings → Storage & backup):
- **Export Backup (.json)** on one device.
- **Import Backup (.json)** on the other. This replaces that device's progress.

Export regularly, because clearing browser data deletes local progress. The Mentor Sync screen can also make a read-only share link that packs a snapshot of your progress into the URL.

## Sequential track unlocking

Every day has exactly **one active track**, and tracks unlock in engineering order:

| Weeks | Stage | Tracks |
|---|---|---|
| 1–8 | Phase 1: Math, ML, PyTorch & Transformers | AI Core only |
| 9–10 | Phase 2A | AI Core + **Backend** (FastAPI, async, Pydantic, SSE, pgvector, Redis) |
| 11–12 | Phase 2B | Context engineering + **Docker** (multi-stage, .dockerignore, Compose) |
| 13–14 | Phase 3A | AI Core: agents, LangGraph, PydanticAI / OpenAI Agents SDK, MCP |
| 15–16 | Phase 3B | **Security** (OWASP LLM & Agentic, PII, least privilege, approvals, vector RBAC, sandboxes) |
| 17–20 | Phase 4 | AI Core: fine-tuning & alignment |
| 21–22 | Phase 5A | AI Core: evals, Langfuse, Ragas, retrieval-first debugging |
| 23–24 | Phase 5B | **CI/CD** (GitHub Actions, tests, eval gates, deploys) |
| 25–28 | Phase 6 | vLLM inference + **AWS** (IAM, S3, ECR, ECS/App Runner, EC2 GPU spot, Bedrock, Secrets, CloudWatch, Billing) |
| 29–40 | Phase 7 | **Interview Prep** |

Each week shows a **7-day selector**, and each day has its own topic, track badge, 1–2 links, task, interview questions and logbook:
- **Day 1–4 (Mon–Thu):** 45m concept/docs + 45m practice
- **Day 5 (Fri):** 75m strict revision gate (no new topics)
- **Day 6 (Sat):** 3h build, part 1
- **Day 7 (Sun):** 3h build part 2 + evals, plus a Copy Weekly Mentor Report button

Data lives in `src/data/weeks*.ts` (Mon–Thu topics) and `src/data/weekly.ts` (stage labels and Fri/Sat/Sun plans). The Roadmap filter shows any one track across the whole plan.

## Every day, fully specified (V2.0 audit)

An automated audit of all 280 days (40 weeks × 7) passes with zero gaps. Every day has:
- a concept/reading step and a hands-on task
- 1–2 links (all 73 resource URLs return HTTP 200, all open in a new tab with `rel="noopener noreferrer"`)
- 2 interview questions with collapsible model answers, plus 3–4 cold-recall questions
- a mentor tip and a common pitfall

Per-day content lives in `src/data/weeks*.ts` (Mon–Thu), `src/data/weekly.ts` (Fri/Sat/Sun tasks) and `src/data/extrasA.ts` / `extrasB.ts` (Fri/Sat/Sun reading, weekend questions, daily tips).

## One primary resource per day

Each day shows a single **Open Resource ↗** button, chosen by who teaches that topic best (`src/data/primary.ts`):

| Weeks | Primary resource |
|---|---|
| 1–2 | Codebasics |
| 3–5 | CampusX 100 Days of ML / DL |
| 1–5 (Fri–Sun) | Deep-ML practice |
| 6–8 | Karpathy Zero to Hero; Vizuara in W7; Raschka's LLMs-from-scratch on Fri–Sun |
| 9–10 | CampusX FastAPI (backend days), DeepLearning.AI RAG (RAG days) |
| 11–12, 23–28 | Abhishek Veeramalla (Docker, CI/CD and AWS days, including those Fridays); AI days keep the official vLLM / Langfuse docs |
| 13–14 | CampusX Agentic AI with LangGraph; Anthropic agent patterns for agent design; official PydanticAI / OpenAI Agents SDK docs on the SDK days |
| 15–22 | Official OWASP, Unsloth/TRL, Langfuse and Ragas docs |
| 29–40 | Striver's A2Z DSA (W31–33), NeetCode ML (W35), Chip Huyen's ML Interviews book (the rest); W39 mocks use all three |

## Workflow tools

- **Focus timer** (in each day card): Start / Pause / Reset. It survives refreshes and app switches. **Log Time to Today's Entry** adds the elapsed minutes to Time Taken.
- **Missed a day? Shift +1 Day** (header): makes the first unfinished day from today a rest day, so every later day moves +1. Past logs are untouched, and the toast has **Undo**.
- **Ask AI Mentor About Today** (logbook header): copies a prompt with today's topic, tasks, links, your notes and blocker, plus a Staff-AI-Engineer mentoring instruction.
- **Interview Cheat Sheets** (Cookbooks drawer tab):
  - Transformer & GPU memory math
  - RAG debugging checklist
  - OWASP LLM/Agentic security checklist
  - 45-minute AI system design framework

## Cookbooks & Notes

The four 2026 topics now sit inside specific days:
- Vision-RAG: W10 Thu
- PydanticAI and OpenAI Agents SDK: W14 Mon–Tue
- Retrieval-first debugging: W22 Thu
- Reasoning-model routing: W27 Mon

The **Cookbooks & Notes** drawer holds 8 reference repos (`src/data/modern.ts`). They're bookmarks only and never count toward hours.

## Deploy


`npm run build` produces a static `dist/` folder. Deploy it to Vercel, Netlify, Cloudflare Pages or GitHub Pages. Once served over HTTPS, it is installable as a PWA ("Add to Home Screen").

## Editing the curriculum

- `src/data/resources.ts`: every resource (title, URL, type badge, time estimate)
- `src/data/weeks1.ts` / `weeks2.ts` / `weeks3.ts`: per-week mentor notes, 4 daily topics (concept + hands-on tasks, resource IDs, cold-recall Q/A, interview Q/A), plus a coding question, a system design question and a weekend build per week
- `src/data/curriculum.ts`: phases, flagship projects; in dev mode it logs any unknown resource ID to the console

Stack: React 18 · TypeScript · Vite · Tailwind CSS v4 · Lucide · Recharts.
