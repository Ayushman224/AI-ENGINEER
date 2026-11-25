import { CalendarCheck, Check, History, LayoutTemplate, ListTodo, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Markdown } from '../components/Markdown';
import { Badge, Btn, Card, CardHeader, cx, Empty, PageTitle, Reveal, safeUrl, Stars, statusDot, type Tone } from '../components/ui';
import { dayInfo, fmtDate, MONTH_SHEETS, resolveDay, weekDays } from '../lib/schedule';
import { type QueueReason, revisionQueue } from '../lib/selectors';
import { useStore } from '../lib/store';

const REASON: Record<QueueReason, { label: string; tone: Tone }> = {
  blocker: { label: 'Blocker', tone: 'red' },
  low_conf: { label: 'Low confidence', tone: 'amber' },
  spaced: { label: 'Spaced review', tone: 'violet' },
  floor: { label: 'Floor catch-up', tone: 'blue' },
};

export function Revision() {
  const { state, cal, today, readOnly, update, updateLog } = useStore();
  const queue = revisionQueue(state, today);
  const [filter, setFilter] = useState<QueueReason | 'all'>('all');
  const shown = filter === 'all' ? queue : queue.filter((q) => q.reason === filter);
  const curWeek = dayInfo(resolveDay(cal, today).n).week.n;
  const friday = weekDays(curWeek)[4];
  const checks = state.fridayChecks[curWeek] ?? [false, false, false];

  return (
    <div className="space-y-5">
      <PageTitle title="Smart Revision Hub" sub="Spaced repetition at +3 / +7 / +14 days, plus every low-confidence (≤ 3★) and blocked topic." />

      <Card>
        <CardHeader
          icon={<ListTodo size={15} />}
          title={`Revision Queue · ${queue.length}`}
          right={
            <div className="flex flex-wrap gap-1">
              {(['all', 'blocker', 'low_conf', 'spaced', 'floor'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={cx('rounded-md px-2 py-1 text-[11px] font-medium', filter === f ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800')}>
                  {f === 'all' ? 'All' : REASON[f].label} {f !== 'all' && `(${queue.filter((q) => q.reason === f).length})`}
                </button>
              ))}
            </div>
          }
        />
        <div className="space-y-2 p-4">
          {!shown.length && <Empty>Nothing due. Complete days and rate your confidence — items appear here automatically.</Empty>}
          {shown.map((q) => {
            const info = dayInfo(q.n);
            const l = state.logs[q.n];
            return (
              <div key={`${q.reason}-${q.n}`} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={REASON[q.reason].tone}>{REASON[q.reason].label}</Badge>
                      <span className="text-[11px] text-zinc-500">
                        Day {q.n} · W{info.week.n} · {fmtDate(cal.dates[q.n - 1])}
                        {q.due && ` · due ${fmtDate(q.due)}`}
                      </span>
                    </div>
                    <a href={`#/day/${q.n}`} className="mt-1 block text-sm font-medium hover:text-violet-500">
                      {info.title}
                    </a>
                    <div className="mt-0.5 text-xs text-zinc-500">{q.detail}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {q.reason === 'spaced' && (
                      <Btn size="sm" disabled={readOnly} onClick={() => updateLog(q.n, { reviews: [...l.reviews, q.stage!] })}>
                        <Check size={13} /> Reviewed (+{q.stage}d)
                      </Btn>
                    )}
                    {q.reason === 'low_conf' && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-500">Re-rate:</span>
                        <Stars value={l.confidence} size={16} onChange={readOnly ? undefined : (v) => updateLog(q.n, { confidence: v })} />
                      </div>
                    )}
                    {q.reason === 'blocker' && (
                      <Btn size="sm" disabled={readOnly} onClick={() => updateLog(q.n, { blockersResolved: true })}>
                        <Check size={13} /> Resolved
                      </Btn>
                    )}
                    {q.reason === 'floor' && (
                      <a href={`#/day/${q.n}`}>
                        <Btn size="sm">Open day</Btn>
                      </a>
                    )}
                  </div>
                </div>
                {info.topic && (q.reason === 'spaced' || q.reason === 'low_conf') && (
                  <div className="mt-2">
                    <Reveal q={info.topic.recall.q} a={info.topic.recall.a} tag={<span className="text-[11px] text-zinc-500">Recall check</span>} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<CalendarCheck size={15} />} title={`Friday Revision Checklist · Week ${curWeek}`} sub={`Revision day: ${fmtDate(cal.dates[friday - 1])}`} right={<a href={`#/day/${friday}`} className="text-xs font-medium text-violet-600 dark:text-violet-400">Open Friday →</a>} />
          <div className="space-y-1.5 p-4">
            {['Answer all 4 of this week’s cold-recall questions from memory', 'Re-solve 2 tricky problems cold (incl. the week’s coding question)', 'Clear the low-confidence & blocker queue'].map((t, i) => (
              <label key={i} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-zinc-200 p-2.5 text-sm dark:border-zinc-800">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 accent-violet-600"
                  checked={!!checks[i]}
                  disabled={readOnly}
                  onChange={(e) =>
                    update((d) => {
                      const c = d.fridayChecks[curWeek] ?? [false, false, false];
                      c[i] = e.target.checked;
                      d.fridayChecks[curWeek] = c;
                    })
                  }
                />
                <span className={cx(checks[i] && 'text-zinc-400 line-through')}>{t}</span>
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader icon={<LayoutTemplate size={15} />} title="Monthly One-Page Architecture Sheets" sub="Can you draw this month’s system from memory?" />
          <div className="space-y-1 p-3">
            {MONTH_SHEETS.map((m) => (
              <label key={m.m} className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-violet-600" checked={!!state.archSheets[m.m]} disabled={readOnly} onChange={(e) => update((d) => void (d.archSheets[m.m] = e.target.checked))} />
                <span className="min-w-0">
                  <span className="font-mono text-[11px] text-zinc-500">M{m.m} · W{m.weeks}</span>
                  <span className={cx('block leading-snug', state.archSheets[m.m] && 'text-zinc-400 line-through')}>{m.system}</span>
                </span>
              </label>
            ))}
          </div>
        </Card>
      </div>

      <HistoryTimeline />
    </div>
  );
}

function HistoryTimeline() {
  const { state, cal } = useStore();
  const [q, setQ] = useState('');
  const [f, setF] = useState<'all' | 'blockers' | 'resolved' | 'low' | 'completed' | 'floor'>('all');
  const [phase, setPhase] = useState(0);
  const entries = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return Object.entries(state.logs)
      .map(([k, l]) => ({ n: Number(k), l }))
      .filter(({ l }) => l.status !== 'not_started' || l.learned || l.blockers || l.minutes)
      .filter(({ n }) => !phase || dayInfo(n).phase.n === phase)
      .filter(({ l }) => {
        if (f === 'blockers') return l.blockers.trim() && !l.blockersResolved;
        if (f === 'resolved') return l.blockers.trim() && l.blockersResolved;
        if (f === 'low') return l.confidence >= 1 && l.confidence <= 3;
        if (f === 'completed') return l.status === 'completed';
        if (f === 'floor') return l.status === 'floor';
        return true;
      })
      .filter(({ n, l }) => !needle || [dayInfo(n).title, l.learned, l.how, l.blockers, l.link].join(' ').toLowerCase().includes(needle))
      .sort((a, b) => b.n - a.n);
  }, [state.logs, q, f, phase]);

  return (
    <Card>
      <CardHeader icon={<History size={15} />} title="Full History — What I Did" sub={`${entries.length} entries`} />
      <div className="flex flex-col gap-2 border-b border-zinc-200 p-3 sm:flex-row dark:border-zinc-800/80">
        <div className="relative flex-1">
          <Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400" />
          <input className="field pl-8" placeholder="Search learnings, blockers, links…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="field sm:w-44" value={f} onChange={(e) => setF(e.target.value as typeof f)}>
          <option value="all">All entries</option>
          <option value="completed">Completed</option>
          <option value="floor">Floor sessions</option>
          <option value="blockers">Open blockers</option>
          <option value="resolved">Resolved blockers</option>
          <option value="low">Low confidence (≤3★)</option>
        </select>
        <select className="field sm:w-36" value={phase} onChange={(e) => setPhase(Number(e.target.value))}>
          <option value={0}>All phases</option>
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <option key={p} value={p}>
              Phase {p}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4">
        {!entries.length && <Empty>No log entries match. Your daily logbook entries will build this timeline.</Empty>}
        <ol className="relative space-y-4 border-l border-zinc-200 pl-5 dark:border-zinc-800">
          {entries.map(({ n, l }) => {
            const info = dayInfo(n);
            return (
              <li key={n} className="relative">
                <span className={cx('absolute top-1.5 -left-[25px] h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-[#0f0f11]', statusDot(l.status))} />
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
                  <span className="font-mono">{fmtDate(cal.dates[n - 1], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>·<span>Day {n}</span>·<span>W{info.week.n}</span>
                  {l.minutes > 0 && <Badge>{Math.floor(l.minutes / 60)}h {l.minutes % 60}m</Badge>}
                  {l.confidence > 0 && <Badge tone={l.confidence <= 3 ? 'amber' : 'green'}>{l.confidence}★</Badge>}
                  {l.blockers.trim() && <Badge tone={l.blockersResolved ? 'green' : 'red'}>{l.blockersResolved ? 'Blocker resolved' : 'Open blocker'}</Badge>}
                </div>
                <a href={`#/day/${n}`} className="mt-0.5 block text-sm font-medium hover:text-violet-500">
                  {info.title}
                </a>
                {l.learned.trim() && <Markdown text={l.learned} className="mt-1 text-zinc-700 dark:text-zinc-300" />}
                {l.blockers.trim() && (
                  <div className="mt-1.5 rounded-md bg-rose-50/60 px-2.5 py-1.5 text-xs text-zinc-700 dark:bg-rose-500/5 dark:text-zinc-300">
                    <b>Blockers:</b> {l.blockers}
                  </div>
                )}
                {safeUrl(l.link) && (
                  <a href={safeUrl(l.link)} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate text-xs text-violet-500 underline">
                    {l.link}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}
