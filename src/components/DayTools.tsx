import { Lightbulb, Pause, Play, RotateCcw, Timer, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RES } from '../data/resources';
import { TRACKS } from '../data/tracks';
import { dayInfo } from '../lib/schedule';
import { emptyLog } from '../lib/state';
import { useStore } from '../lib/store';
import { Btn, cx } from './ui';

/** Per-day mentor tip (what matters in interviews) + common pitfall (what to skip). */
export function MentorTips({ n }: { n: number }) {
  const { tip, pitfall } = dayInfo(n).tip;
  if (!tip && !pitfall) return null;
  return (
    <div className="mt-4 grid gap-2 @lg:grid-cols-2">
      <div className="rounded-lg border border-emerald-300/50 bg-emerald-50/60 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
          <Lightbulb size={12} /> Mentor tip · what interviewers look for
        </div>
        <p className="text-[13px] leading-relaxed">{tip}</p>
      </div>
      <div className="rounded-lg border border-rose-300/50 bg-rose-50/60 p-3 dark:border-rose-500/20 dark:bg-rose-500/5">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-400">
          <TriangleAlert size={12} /> Common pitfall · skip this
        </div>
        <p className="text-[13px] leading-relaxed">{pitfall}</p>
      </div>
    </div>
  );
}

// ── Focus timer: persisted in localStorage so a refresh or app switch on mobile never loses time ──
const TIMER_KEY = 'aieos:timer';
interface TimerState {
  startedAt: number | null; // epoch ms while running
  acc: number; // accumulated ms while paused
}
const readTimer = (): TimerState => {
  try {
    const t = JSON.parse(localStorage.getItem(TIMER_KEY) || 'null');
    return t && typeof t.acc === 'number' ? t : { startedAt: null, acc: 0 };
  } catch {
    return { startedAt: null, acc: 0 };
  }
};
const writeTimer = (t: TimerState) => localStorage.setItem(TIMER_KEY, JSON.stringify(t));
const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((x) => String(x).padStart(2, '0')).join(':');
};

export function FocusTimer({ n }: { n: number }) {
  const { state, updateLog, readOnly, cal, today } = useStore();
  const [t, setT] = useState<TimerState>(readTimer);
  const [, tick] = useState(0);
  const [msg, setMsg] = useState('');
  const running = t.startedAt !== null;
  const elapsed = t.acc + (running ? Date.now() - t.startedAt! : 0);
  const isToday = cal.dates[n - 1] === today;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => tick((x) => x + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === TIMER_KEY && setT(readTimer());
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);

  const save = (next: TimerState) => {
    writeTimer(next);
    setT(next);
  };
  const start = () => save({ startedAt: Date.now(), acc: t.acc });
  const pause = () => save({ startedAt: null, acc: elapsed });
  const reset = () => {
    save({ startedAt: null, acc: 0 });
    setMsg('');
  };
  const logTime = () => {
    const mins = Math.round(elapsed / 60000);
    if (mins < 1) return;
    const prev = state.logs[n] ?? emptyLog();
    updateLog(n, { minutes: prev.minutes + mins, status: prev.status === 'not_started' ? 'in_progress' : prev.status });
    save({ startedAt: null, acc: 0 });
    setMsg(`Added ${mins} min → Time Taken is now ${Math.floor((prev.minutes + mins) / 60)}h ${(prev.minutes + mins) % 60}m`);
  };

  if (readOnly) return null;
  return (
    <div className="mt-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Timer size={16} className={running ? 'text-emerald-500' : 'text-zinc-400'} />
          <span className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Focus timer</span>
        </div>
        <span className={cx('font-mono text-2xl font-semibold tabular-nums', running && 'text-emerald-600 dark:text-emerald-400')} aria-live="off">
          {fmt(elapsed)}
        </span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          {running ? (
            <Btn size="md" onClick={pause} aria-label="Pause timer">
              <Pause size={14} /> Pause
            </Btn>
          ) : (
            <Btn size="md" variant="primary" onClick={start} aria-label="Start timer">
              <Play size={14} /> {elapsed > 0 ? 'Resume' : 'Start'}
            </Btn>
          )}
          <Btn size="md" variant="ghost" onClick={reset} disabled={elapsed === 0} aria-label="Reset timer">
            <RotateCcw size={14} /> Reset
          </Btn>
          <Btn size="md" onClick={logTime} disabled={elapsed < 60000}>
            Log Time to {isToday ? 'Today’s' : 'This Day’s'} Entry
          </Btn>
        </div>
      </div>
      {msg && <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">{msg}</p>}
    </div>
  );
}

/** Structured prompt for “Ask AI Mentor About Today”. */
export function askMentorPrompt(n: number, logs: ReturnType<typeof useStore>['state']['logs']): string {
  const d = dayInfo(n);
  const l = logs[n] ?? emptyLog();
  const or = (s: string) => (s.trim() ? s.trim() : '(not filled in yet)');
  return [
    `# Ask my AI mentor — Week ${d.week.n}, Day ${d.slot + 1} (${d.label}): ${d.title}`,
    `Track: ${TRACKS[d.track].label} · Stage: ${d.week.stage}`,
    '',
    '## Today’s topic',
    `- Concept / reading: ${d.concept}`,
    `- Hands-on task: ${d.practice}`,
    ...d.res.filter((id) => RES[id]).map((id) => `- Primary resource: ${RES[id].title} — ${RES[id].url}`),
    ...d.refs.filter((id) => RES[id]).map((id) => `- Also named in the task: ${RES[id].title} — ${RES[id].url}`),
    '',
    '## My notes so far',
    `- What I learned: ${or(l.learned)}`,
    `- How I’m doing it: ${or(l.how)}`,
    `- Time so far: ${Math.floor(l.minutes / 60)}h ${l.minutes % 60}m · Confidence: ${l.confidence ? `${l.confidence}/5` : 'unrated'}`,
    '',
    '## My blocker',
    or(l.blockers),
    '',
    '---',
    '',
    'Act as a Staff AI Engineer mentoring me. Explain today’s topic clearly with real-world trade-offs, help solve my blocker above, and test me with 2 tough interview questions.',
  ].join('\n');
}
