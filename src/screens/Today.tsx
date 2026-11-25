import { CalendarClock, Clock, Flame, Layers, PartyPopper, RotateCcw, Sunrise, TrendingUp } from 'lucide-react';
import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CopyReportButton } from '../components/CopyReportButton';
import { DayView } from '../components/DayView';
import { mentorReport } from '../lib/report';
import { Btn, Card, CardHeader, Progress } from '../components/ui';
import { PHASES } from '../data/curriculum';
import { addDays, dayInfo, diffDays, fmtDate, resolveDay } from '../lib/schedule';
import { missedDays, overallPct, phaseProgress, revisionQueue, streak, weeklyHoursSeries, weekMinutes } from '../lib/selectors';
import { useStore } from '../lib/store';

export function Today() {
  const { state, cal, today, update, readOnly } = useStore();
  const { n, state: dayState } = resolveDay(cal, today);
  const info = dayInfo(n);
  const wk = info.week.n;
  const mins = weekMinutes(state, wk);
  const backlog = revisionQueue(state, today).length;
  const missed = missedDays(state, cal, today);

  const shiftToToday = () =>
    update((d) => {
      const from = cal.dates[missed[0] - 1];
      const add: string[] = [];
      for (let x = from; x < today; x = addDays(x, 1)) add.push(x);
      d.settings.skipped = [...new Set([...d.settings.skipped, ...add])].sort();
    });

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Sunrise size={14} /> {fmtDate(today, { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{greeting} — Today’s Command Center</h1>
      </div>
        <CopyReportButton size="sm" variant="secondary" getText={() => mentorReport(state, cal, today, n, 'week')} />
      </div>

      {dayState === 'before' && (
        <Banner icon={<CalendarClock size={16} />} tone="violet">
          Your 10-month plan starts <b>{fmtDate(cal.dates[0])}</b> ({diffDays(cal.dates[0], today)} days). Here’s a preview of Day 1. Change the start date in{' '}
          <a className="underline" href="#/settings">Settings</a>.
        </Banner>
      )}
      {dayState === 'rest' && (
        <Banner icon={<CalendarClock size={16} />} tone="violet">
          Today is a rest / rescheduled day. Next up is Day {n} on {fmtDate(cal.dates[n - 1])} — previewed below.
        </Banner>
      )}
      {dayState === 'after' && (
        <Banner icon={<PartyPopper size={16} />} tone="green">
          You’ve reached the end of the 40-week plan. Export your progress and write your retrospective! 🎉
        </Banner>
      )}
      {missed.length > 0 && !readOnly && (
        <Banner icon={<RotateCcw size={16} />} tone="amber">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>
              {missed.length} scheduled day{missed.length > 1 ? 's' : ''} before today {missed.length > 1 ? 'are' : 'is'} untouched (first: Day {missed[0]}). Shift the plan so Day {missed[0]}{' '}
              lands today — nothing is lost, later days move forward.
            </span>
            <Btn size="sm" variant="secondary" onClick={shiftToToday}>
              Reschedule from Day {missed[0]}
            </Btn>
          </div>
        </Banner>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi icon={<Layers size={14} />} label="Phase & Week" value={`P${info.phase.n} · W${wk}`} sub={info.phase.short} />
        <Kpi icon={<TrendingUp size={14} />} label="Overall Progress" value={`${overallPct(state).toFixed(1)}%`} bar={overallPct(state)} />
        <Kpi icon={<Flame size={14} />} label="Current Streak" value={`${streak(state, cal, today)} d`} sub="floor sessions count" />
        <Kpi icon={<Clock size={14} />} label="Hours This Week" value={`${(mins / 60).toFixed(1)} / 13.5h`} bar={(mins / 810) * 100} />
        <a href="#/revision" className="col-span-2 md:col-span-1">
          <Kpi icon={<RotateCcw size={14} />} label="Revision Backlog" value={String(backlog)} sub={backlog ? 'items due — tap to review' : 'all clear'} warn={backlog > 5} />
        </a>
      </div>

      <DayView n={n} isToday={dayState === 'today'} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Weekly study hours" sub="Last 8 weeks vs 13.5 h target" />
          <div className="h-56 p-2 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyHoursSeries(state, wk)} margin={{ top: 12, right: 4, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} domain={[0, (max: number) => Math.max(16, Math.ceil(max))]} />
                <Tooltip cursor={{ fill: 'rgba(139,92,246,0.08)' }} contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 8, fontSize: 12, color: '#fafafa' }} />
                <ReferenceLine y={13.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '13.5h', fontSize: 10, fill: '#f59e0b', position: 'insideTopRight' }} />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader title="Phase progress" sub="Completed days per phase" />
          <div className="space-y-3 p-4">
            {phaseProgress(state).map((p) => {
              const ph = PHASES[p.phase - 1];
              return (
                <a key={p.phase} href={`#/roadmap/${ph.weeks[0]}`} className="block">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="truncate">
                      <span className="font-medium">P{ph.n}</span> <span className="text-zinc-500">{ph.short} · W{ph.weeks[0]}–{ph.weeks[1]}</span>
                    </span>
                    <span className="font-mono text-zinc-500">{p.pct}%</span>
                  </div>
                  <Progress value={p.pct} color={ph.color} />
                </a>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, sub, bar, warn }: { icon: ReactNode; label: string; value: string; sub?: string; bar?: number; warn?: boolean }) {
  return (
    <Card className="h-full p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
        {icon}
        {label}
      </div>
      <div className={`mt-1.5 font-mono text-lg font-semibold tracking-tight ${warn ? 'text-amber-500' : ''}`}>{value}</div>
      {bar !== undefined ? <Progress value={bar} className="mt-2" /> : <div className="mt-0.5 truncate text-[11px] text-zinc-500">{sub}</div>}
    </Card>
  );
}

function Banner({ icon, children, tone }: { icon: ReactNode; children: ReactNode; tone: 'violet' | 'amber' | 'green' }) {
  const t = {
    violet: 'border-violet-300/60 bg-violet-50 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200',
    amber: 'border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
    green: 'border-emerald-300/60 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
  }[tone];
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm ${t}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
