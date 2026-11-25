import { ArrowRight, ArrowUpRight, ChevronDown, Library } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RefLinks, SLOT_HINT, WeekDayBar } from '../components/DayView';
import { Badge, Card, cx, PageTitle, Progress, ResourceRow, statusDot, TrackBadge } from '../components/ui';
import { PHASES, WEEKS } from '../data/curriculum';
import { RES } from '../data/resources';
import { TRACK_ORDER, TRACKS, type Track } from '../data/tracks';
import { dayInfo, fmtDate, resolveDay, weekDays } from '../lib/schedule';
import { trackStats, weekMinutes } from '../lib/selectors';
import { useStore } from '../lib/store';

export function Roadmap({ focusWeek }: { focusWeek?: number }) {
  const { state, cal, today } = useStore();
  const todayN = resolveDay(cal, today).n;
  const current = dayInfo(todayN).week.n;
  const target = focusWeek ?? current;
  const [open, setOpen] = useState<Set<number>>(() => new Set([target]));
  const [resOpen, setResOpen] = useState<Set<number>>(new Set());
  const [filter, setFilterState] = useState<Track | 'all'>(() => {
    const f = sessionStorage.getItem('aieos:track');
    return f && (f === 'all' || (TRACK_ORDER as string[]).includes(f)) ? (f as Track | 'all') : 'all';
  });
  const setFilter = (f: Track | 'all') => {
    setFilterState(f);
    sessionStorage.setItem('aieos:track', f);
  };
  const stats = trackStats(state);

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

  const weekHas = (w: number, t: Track) => weekDays(w).some((d) => dayInfo(d).track === t);

  return (
    <div>
      <PageTitle
        title="Roadmap"
        sub={`7 phases · 40 weeks · 280 days · ${fmtDate(cal.dates[0], { month: 'short', day: 'numeric', year: 'numeric' })} → ${fmtDate(cal.dates[279], { month: 'short', day: 'numeric', year: 'numeric' })}`}
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

      {/* Track filter bar */}
      <div className="sticky top-0 z-20 -mx-4 mb-5 border-b border-zinc-200 bg-white/90 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 dark:border-zinc-800/80 dark:bg-[#0a0a0b]/90">
        <div role="tablist" aria-label="Filter by track" className="scroll-thin flex gap-1.5 overflow-x-auto">
          <FilterChip on={filter === 'all'} onClick={() => setFilter('all')} label="All tracks" />
          {TRACK_ORDER.map((t) => {
            const st = stats.find((x) => x.track === t)!;
            return <FilterChip key={t} on={filter === t} onClick={() => setFilter(t)} color={TRACKS[t].color} label={TRACKS[t].label} count={`${st.done}/${st.total}`} />;
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-zinc-500">
          {filter === 'all' ? (
            <>Tracks unlock in order: AI Core → Backend (W9–10) → Docker (W11–12) → Security (W15–16) → CI/CD (W23–24) → AWS (W25–28) → Interview Prep (W28–40).</>
          ) : (
            <>
              Showing only <b>{TRACKS[filter].label}</b> days ({TRACKS[filter].unlock}) · {stats.find((x) => x.track === filter)!.total} days in the plan.
            </>
          )}
        </p>
      </div>

      <div className="space-y-6">
        {PHASES.map((p) => {
          const weeks = WEEKS.filter((w) => w.phase === p.n && (filter === 'all' || weekHas(w.n, filter)));
          if (!weeks.length) return null;
          return (
            <section key={p.n}>
              <div className="mb-2 flex items-start gap-3">
                <div className="mt-1 h-8 w-1 shrink-0 rounded-full" style={{ background: p.color }} />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
                    Phase {p.n} · Weeks {p.weeks[0]}–{p.weeks[1]}
                  </div>
                  <h2 className="leading-snug font-semibold">{p.title}</h2>
                  {filter === 'all' && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {weeks.map((w) => {
                  const days = weekDays(w.n);
                  const isOpen = open.has(w.n);
                  const isCurrent = w.n === current;
                  const tracksInWeek = [...new Set(days.map((d) => dayInfo(d).track))].filter((t) => t !== 'revision');
                  const firstMatch = filter === 'all' ? days[0] : (days.find((d) => dayInfo(d).track === filter) ?? days[0]);
                  return (
                    <Card key={w.n} id={`week-${w.n}`} className={cx(isCurrent && 'ring-1 ring-violet-500/50')}>
                      <button onClick={() => setOpen(toggle(open, w.n))} className="flex w-full flex-col gap-2 p-3 text-left sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="w-10 shrink-0 font-mono text-xs text-zinc-500">W{String(w.n).padStart(2, '0')}</span>
                          <span className="min-w-0 truncate text-sm font-medium">{w.title}</span>
                          {isCurrent && <Badge tone="violet">Current</Badge>}
                          {w.project && <Badge tone="green">P{w.project}</Badge>}
                          <span className="hidden gap-1 md:inline-flex">
                            {tracksInWeek.map((t) => (
                              <TrackBadge key={t} track={t} />
                            ))}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 pl-13 sm:pl-0">
                          <div className="flex gap-1">
                            {days.map((d) => (
                              <span
                                key={d}
                                title={`Day ${dayInfo(d).slot + 1} · ${fmtDate(cal.dates[d - 1])}`}
                                className={cx('h-2.5 w-2.5 rounded-full', statusDot(state.logs[d]?.status), cal.dates[d - 1] === today && 'ring-2 ring-violet-500 ring-offset-1 ring-offset-white dark:ring-offset-zinc-900')}
                              />
                            ))}
                          </div>
                          <span className="w-16 text-right font-mono text-[11px] text-zinc-500">{fmtDate(cal.dates[days[0] - 1], { month: 'short', day: 'numeric' })}</span>
                          <ChevronDown size={15} className={cx('text-zinc-400 transition', isOpen && 'rotate-180')} />
                        </div>
                      </button>
                      {filter !== 'all' && !isOpen && (
                        <div className="space-y-1.5 px-3 pb-3">
                          {days
                            .filter((d) => dayInfo(d).track === filter)
                            .map((d) => (
                              <DaySummary key={d} n={d} compact />
                            ))}
                        </div>
                      )}
                      {isOpen && <WeekDetail w={w.n} initial={days.includes(todayN) ? todayN : firstMatch} />}
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
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

/** One day's focused summary: track, title, task, 1–2 links, and a link to the full day view. */
function DaySummary({ n, compact }: { n: number; compact?: boolean }) {
  const { state, cal } = useStore();
  const info = dayInfo(n);
  const task = info.topic ? info.topic.build : info.plan!.task;
  return (
    <div className={cx('rounded-lg border border-zinc-200 dark:border-zinc-800', compact ? 'p-2.5' : 'p-3.5')}>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={cx('h-2 w-2 rounded-full', statusDot(state.logs[n]?.status))} />
        <span className="text-[11px] font-semibold text-zinc-500">
          Day {info.slot + 1} · {info.label} · {fmtDate(cal.dates[n - 1], { month: 'short', day: 'numeric' })} · {SLOT_HINT[info.slot]}
        </span>
        <TrackBadge track={info.track} />
      </div>
      <div className="mt-1 text-sm font-semibold">{info.title}</div>
      {!compact && info.topic && (
        <p className="mt-1.5 text-[13px] text-zinc-600 dark:text-zinc-400">
          <b className="text-zinc-800 dark:text-zinc-200">Concept: </b>
          {info.topic.learn}
        </p>
      )}
      <p className="mt-1 text-[13px] text-zinc-600 dark:text-zinc-400">
        <b className="text-zinc-800 dark:text-zinc-200">{info.kind === 'learn' ? 'Practice: ' : info.kind === 'revision' ? 'Revision: ' : 'Build: '}</b>
        {task}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {[
          { l: info.links.primary, tag: 'Primary' },
          ...(info.links.alt ? [{ l: info.links.alt, tag: '🇮🇳 Alt' }] : []),
        ].map(({ l, tag }) => (
          <a
            key={tag}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <span className="shrink-0 text-zinc-500">{tag}:</span>
            <span className="truncate">{l.title}</span>
            {l.badge && <span className="shrink-0 font-mono text-amber-600 dark:text-amber-400">{l.badge.replace('Watch ', '')}</span>}
            <ArrowUpRight size={11} className="shrink-0" />
          </a>
        ))}
        <a href={`#/day/${n}`} className="ml-auto inline-flex items-center gap-1 text-[11px] font-medium text-violet-600 dark:text-violet-400">
          Open day & logbook <ArrowRight size={12} />
        </a>
      </div>
      {!compact && <RefLinks ids={info.refs} className="mt-1.5" />}
    </div>
  );
}

function WeekDetail({ w, initial }: { w: number; initial: number }) {
  const { state } = useStore();
  const [sel, setSel] = useState(initial);
  const week = WEEKS[w - 1];
  const mins = weekMinutes(state, w);
  return (
    <div className="space-y-3 border-t border-zinc-200 p-3 dark:border-zinc-800/80">
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
        <Badge tone="violet">{week.stage}</Badge>
        <span className="font-mono">{(mins / 60).toFixed(1)} / 13.5 h</span>
        <Progress value={(mins / 810) * 100} className="max-w-40" />
      </div>
      <WeekDayBar n={sel} onSelect={setSel} />
      <DaySummary n={sel} />
    </div>
  );
}
