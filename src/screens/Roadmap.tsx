import { ChevronDown, Library } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TrackTaskRow } from '../components/TrackTasks';
import { ModernTaskRow } from '../components/ModernTopic';
import { modernForWeek } from '../data/modern';
import { Badge, Card, cx, PageTitle, Progress, ResourceRow, statusDot, TrackBadge } from '../components/ui';
import { dayTracks, isFocusWeek, TRACK_ORDER, TRACK_TASKS, trackTask, TRACKS, type Track } from '../data/tracks';
import { PHASES, WEEKS } from '../data/curriculum';
import { RES } from '../data/resources';
import { dayInfo, fmtDate, resolveDay, weekDays } from '../lib/schedule';
import { trackStats, weekMinutes } from '../lib/selectors';
import { useStore } from '../lib/store';

export function Roadmap({ focusWeek }: { focusWeek?: number }) {
  const { state, cal, today } = useStore();
  const current = dayInfo(resolveDay(cal, today).n).week.n;
  const target = focusWeek ?? current;
  const [open, setOpen] = useState<Set<number>>(() => new Set([target]));
  const [resOpen, setResOpen] = useState<Set<number>>(new Set());
  const [filter, setFilterState] = useState<Track | 'all'>(() => (sessionStorage.getItem('aieos:track') as Track | 'all') || 'all');
  const setFilter = (f: Track | 'all') => {
    setFilterState(f);
    sessionStorage.setItem('aieos:track', f);
  };
  const stats = trackStats(state, 40);

  useEffect(() => {
    setOpen((o) => new Set([...o, target]));
    const t = setTimeout(() => document.getElementById(`week-${target}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
    return () => clearTimeout(t);
  }, [target]);

  const toggle = (set: Set<number>, k: number) => {
    const s = new Set(set);
    if (s.has(k)) s.delete(k);
    else s.add(k);
    return s;
  };

  return (
    <div>
      <PageTitle
        title="Roadmap"
        sub={`7 integrated phases · 40 weeks · 280 days · ${fmtDate(cal.dates[0], { month: 'short', day: 'numeric', year: 'numeric' })} → ${fmtDate(cal.dates[279], { month: 'short', day: 'numeric', year: 'numeric' })}`}
        right={
          <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
            {[['bg-zinc-400', 'Not started'], ['bg-sky-400', 'In progress'], ['bg-amber-400', 'Floor'], ['bg-emerald-400', 'Done']].map(([c, l]) => (
              <span key={l} className="inline-flex items-center gap-1">
                <span className={`h-2 w-2 rounded-full ${c}`} />
                {l}
              </span>
            ))}
          </div>
        }
      />
      <div className="sticky top-0 z-20 -mx-4 mb-5 border-b border-zinc-200 bg-white/90 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:border-zinc-800/80 dark:bg-[#0a0a0b]/90">
        <div role="tablist" aria-label="Filter by track" className="scroll-thin flex gap-1.5 overflow-x-auto">
          <FilterChip on={filter === 'all'} onClick={() => setFilter('all')} label="All tracks" />
          {TRACK_ORDER.map((t) => (
            <FilterChip
              key={t}
              on={filter === t}
              onClick={() => setFilter(t)}
              color={TRACKS[t].color}
              label={TRACKS[t].label}
              count={`${stats.find((x) => x.track === t)!.all}/40`}
            />
          ))}
        </div>
        {filter !== 'all' && (
          <p className="mt-1.5 text-[11px] text-zinc-500">
            Showing every week’s <b>{TRACKS[filter].label}</b> task with links.{' '}
            {filter === 'ai' ? 'AI Core auto-completes when all 4 topic days of a week are done.' : `Focus weeks: ${TRACKS[filter].windows.map(([a, b]) => `W${a}–${b}`).join(', ')}; other weeks are 15–20 min drills.`}
          </p>
        )}
      </div>
      <div className="space-y-6">
        {PHASES.map((p) => (
          <section key={p.n}>
            <div className="mb-2 flex items-start gap-3">
              <div className="mt-1 h-8 w-1 shrink-0 rounded-full" style={{ background: p.color }} />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                  Phase {p.n} · Weeks {p.weeks[0]}–{p.weeks[1]}
                </div>
                <h2 className="font-semibold leading-snug">{p.title}</h2>
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.topics.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <button onClick={() => setResOpen(toggle(resOpen, p.n))} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                  <Library size={13} /> {resOpen.has(p.n) ? 'Hide' : 'Show'} {p.resources.length} curated free resources
                  <ChevronDown size={13} className={cx('transition', resOpen.has(p.n) && 'rotate-180')} />
                </button>
                {resOpen.has(p.n) && (
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    {p.resources.map((id) => (
                      <ResourceRow key={id} r={RES[id]} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              {WEEKS.filter((w) => w.phase === p.n).map((w) => {
                const days = weekDays(w.n);
                const isOpen = open.has(w.n);
                const isCurrent = w.n === current;
                return (
                  <Card key={w.n} id={`week-${w.n}`} className={cx(isCurrent && 'ring-1 ring-violet-500/50')}>
                    <button onClick={() => setOpen(toggle(open, w.n))} className="flex w-full flex-col gap-2 p-3 text-left sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="w-10 shrink-0 font-mono text-xs text-zinc-500">W{String(w.n).padStart(2, '0')}</span>
                        <span className="truncate text-sm font-medium">{w.title}</span>
                        {isCurrent && <Badge tone="violet">Current</Badge>}
                        {w.project && <Badge tone="green">P{w.project}</Badge>}
                        {modernForWeek(w.n) && filter === 'all' && <Badge tone="amber" className="hidden lg:inline-flex">2026 · {modernForWeek(w.n)!.title.split(' (')[0]}</Badge>}
                        {filter === 'all'
                          ? TRACK_ORDER.filter((t) => t !== 'ai' && isFocusWeek(t, w.n)).map((t) => <TrackBadge key={t} track={t} focus className="hidden md:inline-flex" />)
                          : filter !== 'ai' && isFocusWeek(filter, w.n) && <TrackBadge track={filter} focus />}
                      </div>
                      <div className="flex items-center gap-3 pl-13 sm:pl-0">
                        <div className="flex gap-1">
                          {days.map((d) => (
                            <span key={d} title={`Day ${d} · ${fmtDate(cal.dates[d - 1])}`} className={cx('h-2.5 w-2.5 rounded-full', statusDot(state.logs[d]?.status), cal.dates[d - 1] === today && 'ring-2 ring-violet-500 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900')} />
                          ))}
                        </div>
                        <span className="w-24 text-right font-mono text-[11px] text-zinc-500">{fmtDate(cal.dates[days[0] - 1], { month: 'short', day: 'numeric' })}</span>
                        <ChevronDown size={15} className={cx('text-zinc-400 transition', isOpen && 'rotate-180')} />
                      </div>
                    </button>
                    {filter !== 'all' && !isOpen && (
                      <div className="px-3 pb-3">
                        <TrackTaskRow t={trackTask(w.n, filter)} compact />
                      </div>
                    )}
                    {isOpen && <WeekDetail w={w.n} filter={filter} />}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ on, onClick, label, color, count }: { on: boolean; onClick: () => void; label: string; color?: string; count?: string }) {
  return (
    <button
      role="tab"
      aria-selected={on}
      onClick={onClick}
      className={cx(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition',
        on ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900'
      )}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
      {label}
      {count && <span className="font-mono text-[10px] opacity-60">{count}</span>}
    </button>
  );
}

function WeekDetail({ w, filter }: { w: number; filter: Track | 'all' }) {
  const { state, cal, today } = useStore();
  const week = WEEKS[w - 1];
  const mins = weekMinutes(state, w);
  return (
    <div className="border-t border-zinc-200 p-3 dark:border-zinc-800/80">
      <div className="mb-3 flex items-center gap-3 text-xs text-zinc-500">
        <span className="font-mono">{(mins / 60).toFixed(1)} / 13.5 h</span>
        <Progress value={(mins / 810) * 100} className="max-w-48" />
      </div>
      <div className="grid gap-1.5">
        {weekDays(w).map((d) => {
          const info = dayInfo(d);
          const l = state.logs[d];
          return (
            <a key={d} href={`#/day/${d}`} className={cx('flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800/60', cal.dates[d - 1] === today && 'bg-violet-50 dark:bg-violet-500/10')}>
              <span className={cx('h-2 w-2 shrink-0 rounded-full', statusDot(l?.status))} />
              <span className="w-24 shrink-0 font-mono text-[11px] text-zinc-500">
                {info.label} {fmtDate(cal.dates[d - 1], { month: 'short', day: 'numeric' })}
              </span>
              <span className="min-w-0 flex-1 truncate">{info.kind === 'learn' ? info.title : info.kind === 'revision' ? 'Friday Revision — spaced repetition & re-solve' : info.slot === 5 ? 'Saturday Deep Build' : 'Sunday Deep Build'}</span>
              <span className="hidden shrink-0 gap-1 md:flex">
                {dayTracks(info.slot)
                  .filter((t) => t !== 'ai' || info.kind !== 'project')
                  .map((t) => (
                    <span key={t} title={TRACKS[t].label} className="h-2 w-2 rounded-full" style={{ background: TRACKS[t].color }} />
                  ))}
              </span>
              {l?.confidence ? <span className="shrink-0 text-[11px] text-amber-500">{l.confidence}★</span> : null}
              <span className="hidden shrink-0 text-[11px] text-zinc-500 sm:inline">{info.budgetMin}m</span>
            </a>
          );
        })}
      </div>
      <div className="mt-3 space-y-2">
        <div className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Track tasks this week</div>
        {TRACK_TASKS[w]
          .filter((t) => filter === 'all' || t.track === filter)
          .map((t) => (
            <TrackTaskRow key={t.track} t={t} compact />
          ))}
      </div>
      {modernForWeek(w) && filter === 'all' && (
        <div className="mt-3">
          <ModernTaskRow w={w} />
        </div>
      )}
      <p className="mt-3 rounded-lg bg-zinc-50 p-2.5 text-xs leading-relaxed text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
        <b className="text-zinc-800 dark:text-zinc-200">Weekend build:</b> {week.weekend}
      </p>
    </div>
  );
}
