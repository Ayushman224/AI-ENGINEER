import { PHASES, WEEKS } from '../data/curriculum';
import type { DayBadge, DayPlan, Phase, TopicDay, Week } from '../data/types';

export const TOTAL_DAYS = 280;
export const WEEKLY_TARGET_MIN = 810; // 13.5 h

export type SlotKind = 'learn' | 'revision' | 'project';

export interface DayInfo {
  n: number; // 1..280
  week: Week;
  phase: Phase;
  slot: number; // 0..6 → Mon..Sun
  kind: SlotKind;
  label: string; // Mon, Tue...
  budgetMin: number;
  topic?: TopicDay; // Mon–Thu only
  plan?: DayPlan; // Fri / Sat / Sun
  track: DayBadge; // the single active badge for this day
  title: string;
  res: string[]; // this day's 1–2 links
}

const SLOT_LABEL = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const SLOT_BUDGET = [90, 90, 90, 90, 75, 180, 180];

export function dayInfo(n: number): DayInfo {
  const wk = Math.ceil(n / 7);
  const slot = (n - 1) % 7;
  const week = WEEKS[wk - 1];
  const phase = PHASES[week.phase - 1];
  const kind: SlotKind = slot < 4 ? 'learn' : slot === 4 ? 'revision' : 'project';
  const topic = kind === 'learn' ? week.days[slot] : undefined;
  const plan = slot === 4 ? week.fri : slot === 5 ? week.sat : slot === 6 ? week.sun : undefined;
  return {
    n, week, phase, slot, kind, topic, plan,
    track: topic ? topic.track : plan!.track,
    title: topic ? topic.title : plan!.title,
    res: (topic ? topic.res : plan!.res).slice(0, 2),
    label: SLOT_LABEL[slot],
    budgetMin: SLOT_BUDGET[slot],
  };
}

// ── Date helpers (local time, YYYY-MM-DD strings) ──
export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function addDays(s: string, k: number): string {
  const d = fromISO(s);
  d.setDate(d.getDate() + k);
  return toISO(d);
}
export function diffDays(a: string, b: string): number {
  return Math.round((fromISO(a).getTime() - fromISO(b).getTime()) / 86400000);
}
export const todayISO = () => toISO(new Date());

export function fmtDate(s: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return fromISO(s).toLocaleDateString(undefined, opts);
}

export function nextMonday(from = new Date()): string {
  const d = new Date(from);
  const add = (8 - d.getDay()) % 7; // 0 if Monday
  d.setDate(d.getDate() + add);
  return toISO(d);
}

export interface Calendar {
  dates: string[]; // index n-1 → date
  byDate: Map<string, number>;
  skipped: Set<string>;
}

/**
 * Maps Day 1..280 onto calendar dates. Skipped dates (rest / rescheduled days)
 * push every later day forward by one, so the plan never breaks.
 */
export function buildCalendar(startDate: string, skipped: string[]): Calendar {
  const skip = new Set(skipped);
  const dates: string[] = [];
  const byDate = new Map<string, number>();
  let cur = startDate;
  let guard = 0;
  while (dates.length < TOTAL_DAYS && guard++ < 2000) {
    if (!skip.has(cur)) {
      dates.push(cur);
      byDate.set(cur, dates.length);
    }
    cur = addDays(cur, 1);
  }
  return { dates, byDate, skipped: skip };
}

/** The schedule day for a calendar date — or the next upcoming one if the date is a rest day / before start. */
export function resolveDay(cal: Calendar, date: string): { n: number; state: 'today' | 'rest' | 'before' | 'after' } {
  const n = cal.byDate.get(date);
  if (n) return { n, state: 'today' };
  if (date < cal.dates[0]) return { n: 1, state: 'before' };
  if (date > cal.dates[cal.dates.length - 1]) return { n: TOTAL_DAYS, state: 'after' };
  // rest day: find next scheduled day
  for (let i = 1; i < 60; i++) {
    const m = cal.byDate.get(addDays(date, i));
    if (m) return { n: m, state: 'rest' };
  }
  return { n: TOTAL_DAYS, state: 'after' };
}

/** Last scheduled day number whose date is <= date (0 if none). */
export function lastDayOnOrBefore(cal: Calendar, date: string): number {
  let lo = 0;
  for (let i = 0; i < cal.dates.length; i++) {
    if (cal.dates[i] <= date) lo = i + 1;
    else break;
  }
  return lo;
}

export const weekDays = (w: number) => Array.from({ length: 7 }, (_, i) => (w - 1) * 7 + i + 1);
export const phaseOfWeek = (w: number) => PHASES[WEEKS[w - 1].phase - 1];

export const MONTH_SHEETS = [
  { m: 1, weeks: '1–4', system: 'Classical ML training & evaluation pipeline (data split → model → metrics → threshold)' },
  { m: 2, weeks: '5–8', system: 'Decoder-only transformer: embeddings → RoPE → GQA attention → SwiGLU → KV-cache generation' },
  { m: 3, weeks: '9–12', system: 'Hybrid RAG service: ingestion, chunking, pgvector + BM25, RRF, reranker, FastAPI SSE, Redis, Compose' },
  { m: 4, weeks: '13–16', system: 'Agentic workflow: LangGraph state machine, MCP servers, approvals, OWASP controls & sandbox' },
  { m: 5, weeks: '17–20', system: 'Fine-tuning pipeline: dataset → SFT (QLoRA) → DPO → merge → quantize → serve → benchmark' },
  { m: 6, weeks: '21–24', system: 'Eval & observability loop: golden set, judges, Ragas, Langfuse traces, CI eval gate' },
  { m: 7, weeks: '25–28', system: 'AWS + vLLM inference gateway: IAM, ECR, ECS, router, semantic cache, fallbacks, autoscaling' },
  { m: 8, weeks: '29–32', system: 'Your top 3 portfolio systems, each drawn from memory with metrics annotated' },
  { m: 9, weeks: '33–36', system: '4 canonical AI system designs: enterprise RAG, agent platform, LLM gateway, LLM search' },
  { m: 10, weeks: '37–40', system: 'End-to-end LLM lifecycle: data → pretrain → SFT → alignment → eval → serve → monitor' },
];
