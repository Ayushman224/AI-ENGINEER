import { RES } from '../data/resources';
import { TRACKS } from '../data/tracks';
import { overallPct, revisionQueue, streak, trackStats, weekMinutes } from './selectors';
import { type Calendar, dayInfo, fmtDate, TOTAL_DAYS, weekDays } from './schedule';
import type { AppState, DayLog } from './state';

export type Scope = 'today' | 'week' | 'phase';

export const MENTOR_ASK =
  'Review my progress above, help me solve my listed blockers, quiz me on my low-confidence topics, and tell me what to focus on next.';

const STATUS_LABEL = { not_started: 'Not started', in_progress: 'In progress', floor: 'Floor session (20m)', completed: 'Completed' } as const;
const hm = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
const quote = (t: string) =>
  t
    .trim()
    .split('\n')
    .map((x) => `> ${x}`)
    .join('\n');
const hasContent = (l?: DayLog) => !!l && (l.status !== 'not_started' || !!l.learned.trim() || !!l.blockers.trim() || l.minutes > 0);

export function mentorReport(s: AppState, cal: Calendar, today: string, currentDay: number, scope: Scope): string {
  const info = dayInfo(currentDay);
  const wk = info.week.n;
  const phase = info.phase;

  let scopeDays: number[];
  if (scope === 'today') scopeDays = [currentDay];
  else if (scope === 'week') scopeDays = weekDays(wk);
  else scopeDays = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).filter((n) => dayInfo(n).phase.n === phase.n);

  // Recent entries: Today → last 5 logged days up to today; Week → this week; Phase → last 14 in the phase.
  const logged = (days: number[]) => days.filter((n) => n <= currentDay && hasContent(s.logs[n]));
  const recent =
    scope === 'today'
      ? logged(Array.from({ length: currentDay }, (_, i) => i + 1)).slice(-5)
      : scope === 'week'
        ? (() => {
            // Early in a week, top up with the latest earlier entries so the mentor always sees recent work.
            const own = logged(scopeDays);
            const earlier = logged(Array.from({ length: Math.max(0, scopeDays[0] - 1) }, (_, i) => i + 1));
            return [...earlier.slice(-Math.max(0, 5 - own.length)), ...own];
          })()
        : logged(scopeDays).slice(-14);

  const scopeMins = scopeDays.reduce((a, n) => a + (s.logs[n]?.minutes || 0), 0);
  const scopePlanned = scopeDays.filter((n) => n <= currentDay).reduce((a, n) => a + dayInfo(n).budgetMin, 0);
  const weekMins = weekMinutes(s, wk);
  const queue = revisionQueue(s, today);
  const blockers = queue.filter((q) => q.reason === 'blocker');
  const lowConf = queue.filter((q) => q.reason === 'low_conf');
  const scopeLabel = scope === 'today' ? `Today · Day ${currentDay}` : scope === 'week' ? `Week ${wk}` : `Phase ${phase.n}`;

  const L: string[] = [];
  L.push(`# AI Engineer OS — Mentor Check-In (${scopeLabel})`);
  L.push(`_${fmtDate(today, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_`, '');

  L.push('## 1. Snapshot');
  L.push(`- **Phase:** ${phase.n}/7 — ${phase.title}`);
  L.push(`- **Week:** ${wk}/40 — ${info.week.title}`);
  L.push(`- **Today:** Day ${currentDay}/280 (${info.label}) — ${info.title}`);
  L.push(`- **Streak:** ${streak(s, cal, today)} day(s)`);
  L.push(`- **Hours this week:** ${hm(weekMins)} logged vs 13h 30m target (${Math.round((weekMins / 810) * 100)}%)`);
  if (scope !== 'week') L.push(`- **Hours in ${scopeLabel}:** ${hm(scopeMins)} logged vs ${hm(scopePlanned)} planned so far`);
  L.push(`- **Overall progress:** ${overallPct(s).toFixed(1)}% of 280 days · Revision backlog: ${queue.length}`, '');

  L.push('## 2. Breakdown by track');
  L.push(`_Stage: ${info.week.stage}_`, '');
  L.push(`| Track | Days done / due so far | Hours logged | This week |`);
  L.push('|---|---|---|---|');
  for (const st of trackStats(s, currentDay)) {
    if (st.due === 0 && st.minutes === 0) continue; // track not unlocked yet
    const wkDays = weekDays(wk).filter((d) => dayInfo(d).track === st.track);
    const wkCell = wkDays.length ? wkDays.map((d) => `${dayInfo(d).label} ${s.logs[d]?.status === 'completed' ? '✅' : '⬜'}`).join(' ') : '—';
    L.push(`| ${TRACKS[st.track].label} | ${st.done}/${st.due} | ${hm(st.minutes)} | ${wkCell} |`);
  }
  const locked = trackStats(s, currentDay).filter((st) => st.due === 0 && st.minutes === 0).map((st) => TRACKS[st.track].label);
  if (locked.length) L.push('', `_Not unlocked yet: ${locked.join(', ')}._`);
  L.push('');

  L.push('## 3. Recent daily entries');
  if (!recent.length) L.push('_No entries logged yet._');
  for (const n of recent) {
    const l = s.logs[n];
    const d = dayInfo(n);
    const variance = l.minutes - d.budgetMin;
    L.push('', `### Day ${n} · ${fmtDate(cal.dates[n - 1])} · ${d.title}`);
    L.push(`- **Status:** ${STATUS_LABEL[l.status]} · **Confidence:** ${l.confidence ? `${l.confidence}/5` : 'unrated'}`);
    L.push(`- **Time taken:** ${hm(l.minutes)} (target ${hm(d.budgetMin)}, ${variance >= 0 ? '+' : '−'}${Math.abs(variance)} min)`);
    L.push(`- **What I learned:**`, l.learned.trim() ? quote(l.learned) : '> _(not filled in)_');
    L.push(`- **How I completed it:**`, l.how.trim() ? quote(l.how) : '> _(not filled in)_');
    if (l.link.trim()) L.push(`- **Repo / commit:** ${l.link.trim()}`);
    L.push(`- **Problems / blockers I faced${l.blockers.trim() && l.blockersResolved ? ' (resolved)' : ''}:**`, l.blockers.trim() ? quote(l.blockers) : '> None');
  }
  L.push('');

  L.push('## 4. Unresolved blockers');
  if (!blockers.length) L.push('_None._');
  blockers.forEach((b) => L.push(`- **Day ${b.n} — ${dayInfo(b.n).title}:** ${cell(s.logs[b.n].blockers.trim())}`));
  L.push('');

  L.push('## 5. Low-confidence topics (rated 1–3★) — please explain');
  if (!lowConf.length) L.push('_None._');
  lowConf.forEach((q) => {
    const d = dayInfo(q.n);
    L.push(`- **Day ${q.n} — ${d.title}** (${s.logs[q.n].confidence}/5)${d.topic ? ` · recall check: “${d.topic.recall.q}”` : ''}`);
  });
  L.push('');

  L.push('## 6. Coming up');
  const upcoming = scope === 'week' ? weekDays(Math.min(40, wk + 1)) : weekDays(wk).filter((n) => n > currentDay);
  if (!upcoming.length) L.push('_Week complete._');
  upcoming.forEach((n) => {
    const d = dayInfo(n);
    const res = d.topic?.res.map((id) => RES[id]?.title).filter(Boolean).join(', ');
    L.push(`- ${d.label} · Day ${n}: ${d.title}${res ? ` — _${res}_` : ''}`);
  });
  L.push('', '---', '', MENTOR_ASK);
  return L.join('\n');
}
