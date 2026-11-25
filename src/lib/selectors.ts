import { addDays, type Calendar, dayInfo, lastDayOnOrBefore, TOTAL_DAYS, weekDays } from './schedule';
import type { AppState, DayLog } from './state';

export const isDone = (l?: DayLog) => !!l && (l.status === 'completed' || l.status === 'floor');

export function streak(s: AppState, cal: Calendar, today: string): number {
  let n = lastDayOnOrBefore(cal, today);
  if (n === 0) return 0;
  // Today not done yet doesn't break the streak.
  if (!isDone(s.logs[n]) && cal.dates[n - 1] === today) n--;
  let count = 0;
  while (n > 0 && isDone(s.logs[n])) {
    count++;
    n--;
  }
  return count;
}

export function completedCount(s: AppState) {
  return Object.values(s.logs).filter((l) => l.status === 'completed').length;
}

export function overallPct(s: AppState) {
  const full = completedCount(s);
  const floor = Object.values(s.logs).filter((l) => l.status === 'floor').length;
  return Math.min(100, ((full + floor * 0.25) / TOTAL_DAYS) * 100);
}

export function weekMinutes(s: AppState, w: number) {
  return weekDays(w).reduce((sum, n) => sum + (s.logs[n]?.minutes || 0), 0);
}

export type QueueReason = 'spaced' | 'low_conf' | 'blocker' | 'floor';
export interface QueueItem {
  n: number;
  reason: QueueReason;
  stage?: number;
  due?: string;
  detail: string;
}

export const STAGES = [3, 7, 14];

export function revisionQueue(s: AppState, today: string): QueueItem[] {
  const items: QueueItem[] = [];
  for (const [k, l] of Object.entries(s.logs)) {
    const n = Number(k);
    if (l.status === 'completed' && l.completedAt) {
      const pending = STAGES.find((st) => !l.reviews.includes(st));
      if (pending) {
        const due = addDays(l.completedAt, pending);
        if (due <= today) items.push({ n, reason: 'spaced', stage: pending, due, detail: `+${pending}-day spaced review due` });
      }
    }
    if (l.confidence >= 1 && l.confidence <= 3) items.push({ n, reason: 'low_conf', detail: `Confidence ${l.confidence}/5` });
    if (l.blockers.trim() && !l.blockersResolved) items.push({ n, reason: 'blocker', detail: l.blockers.trim().split('\n')[0].slice(0, 140) });
    if (l.status === 'floor') items.push({ n, reason: 'floor', detail: 'Only a 20-min floor session — catch up the full session' });
  }
  const order: Record<QueueReason, number> = { blocker: 0, low_conf: 1, spaced: 2, floor: 3 };
  return items.sort((a, b) => order[a.reason] - order[b.reason] || a.n - b.n);
}

/** Days strictly before today that were scheduled but never touched. */
export function missedDays(s: AppState, cal: Calendar, today: string): number[] {
  const last = lastDayOnOrBefore(cal, today);
  const out: number[] = [];
  for (let n = 1; n <= last; n++) {
    if (cal.dates[n - 1] === today) continue;
    const l = s.logs[n];
    if (!l || l.status === 'not_started') out.push(n);
  }
  return out;
}

export function weeklyHoursSeries(s: AppState, currentWeek: number, span = 8) {
  const start = Math.max(1, currentWeek - span + 1);
  return Array.from({ length: Math.min(span, currentWeek - start + 1) }, (_, i) => {
    const w = start + i;
    return { week: `W${w}`, hours: +(weekMinutes(s, w) / 60).toFixed(1), target: 13.5 };
  });
}

export function phaseProgress(s: AppState) {
  const res: { phase: number; pct: number }[] = [];
  for (let p = 1; p <= 7; p++) {
    let total = 0;
    let done = 0;
    for (let n = 1; n <= TOTAL_DAYS; n++) {
      if (dayInfo(n).phase.n !== p) continue;
      total++;
      if (s.logs[n]?.status === 'completed') done++;
    }
    res.push({ phase: p, pct: total ? Math.round((done / total) * 100) : 0 });
  }
  return res;
}

// ── Track progress (per day: every day has exactly one active track) ──
import { TRACK_ORDER, type Track } from '../data/tracks';

/** For each track: days scheduled in the whole plan, days due up to `uptoDay`, days completed, minutes logged. */
export function trackStats(s: AppState, uptoDay = TOTAL_DAYS) {
  const acc = new Map<Track, { track: Track; total: number; due: number; done: number; minutes: number }>(TRACK_ORDER.map((t) => [t, { track: t, total: 0, due: 0, done: 0, minutes: 0 }]));
  for (let n = 1; n <= TOTAL_DAYS; n++) {
    const t = dayInfo(n).track;
    if (t === 'revision') continue;
    const row = acc.get(t)!;
    row.total++;
    if (n <= uptoDay) row.due++;
    const l = s.logs[n];
    if (l?.status === 'completed') row.done++;
    row.minutes += l?.minutes || 0;
  }
  return [...acc.values()];
}
