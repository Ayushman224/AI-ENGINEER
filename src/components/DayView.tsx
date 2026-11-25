import {
  BookOpen, Brain, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, Code2, Compass, Hammer, Lightbulb, MessageSquareQuote, NotebookPen, RotateCcw, Target, TriangleAlert, X,
} from 'lucide-react';
import { useState } from 'react';
import { PROJECTS } from '../data/curriculum';
import { RES } from '../data/resources';
import { TRACKS } from '../data/tracks';
import type { QA } from '../data/types';
import { mentorReport } from '../lib/report';
import { go } from '../lib/router';
import { dayInfo, fmtDate, TOTAL_DAYS, weekDays } from '../lib/schedule';
import { revisionQueue } from '../lib/selectors';
import { emptyLog } from '../lib/state';
import { useStore } from '../lib/store';
import { CopyReportButton } from './CopyReportButton';
import { askMentorPrompt, FocusTimer, MentorTips } from './DayTools';
import { Markdown } from './Markdown';
import { Badge, Btn, Card, CardHeader, cx, Label, ResourceRow, Reveal, Stars, StatusSelector, statusDot, TrackBadge } from './ui';

export const SLOT_HINT = ['45m concept + 45m practice', '45m concept + 45m practice', '45m concept + 45m practice', '45m concept + 45m practice', '75m strict revision', '3h build · part 1', '3h build · part 2 + report'];

export function DayView({ n, isToday }: { n: number; isToday?: boolean }) {
  const { state, cal, today, readOnly, update } = useStore();
  const info = dayInfo(n);
  const log = state.logs[n] ?? emptyLog();
  const date = cal.dates[n - 1];
  const isPast = date < today;

  const pushDay = () =>
    update((d) => {
      if (!d.settings.skipped.includes(date)) d.settings.skipped.push(date);
      d.settings.skipped.sort();
    });

  return (
    <div className="space-y-4">
      {/* Week header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="violet">{info.week.stage}</Badge>
            <Badge>Week {info.week.n}/40</Badge>
            <Badge>Day {n}/280</Badge>
          </div>
          <div className="mt-1.5 text-sm font-semibold">{info.week.title}</div>
        </div>
        <div className="flex items-center gap-1">
          {!readOnly && !isPast && (
            <Btn size="sm" variant="ghost" onClick={pushDay} title="Mark this date as a rest day — this and every later day shift forward by one day">
              <CalendarClock size={14} /> Push +1 day
            </Btn>
          )}
          <Btn size="sm" variant="ghost" aria-label="Previous day" disabled={n <= 1} onClick={() => go(`#/day/${n - 1}`)}>
            <ChevronLeft size={16} />
          </Btn>
          <Btn size="sm" variant="ghost" aria-label="Next day" disabled={n >= TOTAL_DAYS} onClick={() => go(`#/day/${n + 1}`)}>
            <ChevronRight size={16} />
          </Btn>
        </div>
      </div>

      <WeekDayBar n={n} />

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <DayCard n={n} isToday={isToday} />
          <Logbook n={n} />
          <MentorNotes n={n} />
        </div>
        <div className="min-w-0">
          <div className="space-y-4 md:sticky md:top-4">
            <InterviewPanel n={n} />
          </div>
        </div>
      </div>
      {log.updatedAt > 0 && <p className="text-right text-[11px] text-zinc-500">Last saved {new Date(log.updatedAt).toLocaleString()}</p>}
    </div>
  );
}

/** Day 1 (Mon) … Day 7 (Sun) selector for a week. */
export function WeekDayBar({ n, onSelect }: { n: number; onSelect?: (d: number) => void }) {
  const { state, cal, today } = useStore();
  const days = weekDays(dayInfo(n).week.n);
  return (
    <div role="tablist" aria-label="Days of this week" className="scroll-thin -mx-1 flex gap-1.5 overflow-x-auto px-1 pt-2 pb-1">
      {days.map((d) => {
        const di = dayInfo(d);
        const on = d === n;
        const isToday = cal.dates[d - 1] === today;
        const t = TRACKS[di.track];
        return (
          <button
            key={d}
            role="tab"
            aria-selected={on}
            onClick={() => (onSelect ? onSelect(d) : go(`#/day/${d}`))}
            className={cx(
              'relative flex min-w-[7.5rem] flex-1 flex-col items-start gap-0.5 rounded-xl border px-3 py-2 text-left transition',
              on ? 'border-violet-500 bg-violet-50 dark:border-violet-500/60 dark:bg-violet-500/10' : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            )}
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="text-xs font-semibold whitespace-nowrap">
                Day {di.slot + 1} · {di.label}
              </span>
              <span className={cx('h-2 w-2 shrink-0 rounded-full', statusDot(state.logs[d]?.status))} />
            </span>
            <span className="text-[10.5px] whitespace-nowrap text-zinc-500">{SLOT_HINT[di.slot]}</span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-medium whitespace-nowrap" style={{ color: t.color }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
              {t.label}
            </span>
            {isToday && <span className="absolute -top-2 right-2 rounded bg-violet-600 px-1 text-[9px] font-bold tracking-wide text-white uppercase">Today</span>}
          </button>
        );
      })}
    </div>
  );
}

function DayCard({ n, isToday }: { n: number; isToday?: boolean }) {
  const { state, readOnly, updateLog, cal, today } = useStore();
  const info = dayInfo(n);
  const log = state.logs[n] ?? emptyLog();
  const w = info.week;

  return (
    <Card className={cx('@container', isToday && 'ring-1 ring-violet-500/40')}>
      <div className="p-4 sm:p-5">
        <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold tracking-wider text-violet-600 uppercase dark:text-violet-400">
            Day {info.slot + 1} · {info.label} · {fmtDate(cal.dates[n - 1], { month: 'short', day: 'numeric' })}
            {isToday && ' · Today'}
          </span>
          <TrackBadge track={info.track} />
        </div>
        <h2 className="text-lg leading-snug font-semibold sm:text-xl">{info.title}</h2>
        <div className="mt-1 text-xs text-zinc-500">
          Time budget: <span className="font-medium text-zinc-700 dark:text-zinc-300">{info.budgetMin >= 180 ? '3 h' : `${info.budgetMin} min`}</span> · {SLOT_HINT[info.slot]}
        </div>

        {info.kind === 'learn' && info.topic && (
          <div className="mt-4 grid gap-3 @lg:grid-cols-2">
            <Block icon={<BookOpen size={14} />} title="45 min · Concept / Docs">
              {info.topic.learn}
            </Block>
            <Block icon={<Code2 size={14} />} title="45 min · Hands-on Practice">
              {info.topic.build}
            </Block>
          </div>
        )}

        {info.kind === 'revision' && <FridayPlan n={n} />}

        {info.kind === 'project' && info.plan && (
          <div className="mt-4 space-y-3">
            <Block icon={<BookOpen size={14} />} title="Concept / Reading (first 20–30 min)">
              {info.concept}
            </Block>
            <Block icon={<Hammer size={14} />} title={info.slot === 5 ? '3 h · Hands-On Build (Part 1)' : '3 h · Hands-On Build + Evals (Part 2)'}>
              {info.plan.task}
            </Block>
            {w.project && (
              <a href="#/projects" className="flex items-center justify-between rounded-lg border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <span>
                  Feeds <b>Flagship Project {w.project}</b>: {PROJECTS[w.project - 1].title.split('(')[0].trim()}
                </span>
                <ChevronRight size={16} />
              </a>
            )}
            {info.slot === 6 && (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-violet-300/50 bg-violet-50/60 p-3 dark:border-violet-500/25 dark:bg-violet-500/5">
                <span className="text-sm">Last step: copy your Weekly Mentor Report and paste it to your AI mentor.</span>
                <CopyReportButton size="sm" label="Copy Weekly Mentor Report" getText={() => mentorReport(state, cal, today, n, 'week')} />
              </div>
            )}
          </div>
        )}

        {info.res.length > 0 && (
          <div className="mt-4">
            <Label hint="opens in a new tab">Links for this day</Label>
            <div className="space-y-2">{info.res.map((id) => RES[id] && <ResourceRow key={id} r={RES[id]} label="Visit Link" />)}</div>
          </div>
        )}

        <MentorTips n={n} />

        <FocusTimer n={n} />

        <div className="mt-5">
          <Label hint={log.status === 'floor' ? 'Streak kept alive — catch up later' : undefined}>Status</Label>
          <StatusSelector
            value={log.status}
            disabled={readOnly}
            onChange={(st) => {
              const patch: Parameters<typeof updateLog>[1] = { status: st };
              if (st === 'floor' && !log.minutes) patch.minutes = 20;
              updateLog(n, patch);
            }}
          />
          {isToday && log.status === 'not_started' && (
            <p className="mt-2 text-xs text-zinc-500">
              Busy day? Pick <b>Floor Session (20m)</b> — 20 focused minutes on today’s cold-recall questions keeps your streak alive without burnout.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function FridayPlan({ n }: { n: number }) {
  const { state, readOnly, update, today } = useStore();
  const info = dayInfo(n);
  const w = info.week;
  const checks = state.fridayChecks[w.n] ?? [false, false, false];
  const queue = revisionQueue(state, today);
  const items = [
    'Answer this week’s 4 cold-recall questions from memory',
    'Re-solve the 2 tricky problems above cold, without notes',
    `Clear the low-confidence & blocker queue (${queue.filter((q) => q.reason === 'low_conf' || q.reason === 'blocker').length} items)`,
  ];
  return (
    <div className="mt-4 space-y-3">
      <Block icon={<BookOpen size={14} />} title="Concept / Review (first 15 min)">
        {info.concept}
      </Block>
      <Block icon={<RotateCcw size={14} />} title="75 min · Strict Revision (zero new topics)">
        {info.plan?.task}
      </Block>
      <div className="space-y-1.5">
        {items.map((t, i) => (
          <label key={i} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-zinc-200 p-2.5 text-sm dark:border-zinc-800">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-violet-600"
              checked={!!checks[i]}
              disabled={readOnly}
              onChange={(e) =>
                update((d) => {
                  const c = d.fridayChecks[w.n] ?? [false, false, false];
                  c[i] = e.target.checked;
                  d.fridayChecks[w.n] = c;
                })
              }
            />
            <span className={cx(checks[i] && 'text-zinc-400 line-through')}>{t}</span>
          </label>
        ))}
      </div>
      <div>
        <Label>Weak spots to review (Days 1–4)</Label>
        <div className="grid gap-1.5 @lg:grid-cols-2">
          {weekDays(w.n)
            .slice(0, 4)
            .map((d) => {
              const c = state.logs[d]?.confidence ?? 0;
              return (
                <a key={d} href={`#/day/${d}`} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                  <span className="truncate">{dayInfo(d).title}</span>
                  <span className={cx('ml-2 shrink-0', c >= 1 && c <= 3 ? 'text-amber-500' : 'text-zinc-500')}>{c ? `${c}★` : '—'}</span>
                </a>
              );
            })}
        </div>
      </div>
      <a href="#/revision" className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400">
        Open Revision Hub ({queue.length} in queue) <ChevronRight size={13} />
      </a>
    </div>
  );
}

function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-950/70">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        {icon}
        {title}
      </div>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

/** Week-level context, collapsed by default so the day view stays focused on the day. */
function MentorNotes({ n }: { n: number }) {
  const w = dayInfo(n).week;
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
        <span className="flex flex-wrap items-center gap-x-2 text-sm font-semibold">
          <Compass size={15} className="text-zinc-400" /> Week {w.n} mentor notes
          <span className="text-xs font-normal text-zinc-500">why it matters · what to master · what to skip</span>
        </span>
        <ChevronDown size={16} className={cx('shrink-0 text-zinc-400 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="@container border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="grid gap-4 p-4 @lg:grid-cols-2">
            <div className="@lg:col-span-2">
              <Label>
                <span className="inline-flex items-center gap-1">
                  <Lightbulb size={12} /> Why this matters in production
                </span>
              </Label>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{w.why}</p>
            </div>
            <div>
              <Label>
                <span className="inline-flex items-center gap-1">
                  <Target size={12} /> Concepts to master
                </span>
              </Label>
              <ul className="space-y-1 text-sm">
                {w.master.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-500" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-rose-300/50 bg-rose-50/60 p-3 dark:border-rose-500/20 dark:bg-rose-500/5">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-rose-700 uppercase dark:text-rose-400">
                <X size={12} /> What to skip
              </div>
              <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{w.skip}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

/** Cold recall = today's topic + the 2 most recent learning days before it (true retrieval practice). */
function recallSet(n: number): { n: number; qa: QA }[] {
  const out: { n: number; qa: QA }[] = [];
  const info = dayInfo(n);
  if (info.kind === 'learn') out.push({ n, qa: info.topic!.recall });
  for (let k = n - 1; out.length < 3 && k >= 1; k--) {
    const d = dayInfo(k);
    if (d.kind === 'learn') out.push({ n: k, qa: d.topic!.recall });
  }
  for (let k = n + 1; out.length < 3 && k <= TOTAL_DAYS; k++) {
    const d = dayInfo(k);
    if (d.kind === 'learn') out.push({ n: k, qa: d.topic!.recall });
  }
  return out;
}

function InterviewPanel({ n }: { n: number }) {
  const { state, readOnly, updateLog } = useStore();
  const info = dayInfo(n);
  const log = state.logs[n] ?? emptyLog();
  const w = info.week;
  // Day-specific: Mon–Thu → that topic's question; Fri → recall gate + coding re-solve; Sat → coding; Sun → system design.
  const weekRecall = weekDays(w.n)
    .slice(0, 4)
    .map((d) => ({ n: d, qa: dayInfo(d).topic!.recall }));
  const recall = info.kind === 'learn' ? recallSet(n) : info.kind === 'revision' ? weekRecall : weekRecall.slice(info.slot === 5 ? 0 : 2, info.slot === 5 ? 2 : 4);
  const interview = info.interview;
  const toggle = (key: string, v: boolean) => updateLog(n, { practiced: v ? [...new Set([...log.practiced, key])] : log.practiced.filter((k) => k !== key) });
  const keys = [...recall.map((_, i) => `recall${i}`), ...interview.map((q) => q.key)];
  const total = keys.length;
  const done = keys.filter((k) => log.practiced.includes(k)).length;

  return (
    <Card>
      <CardHeader
        icon={<MessageSquareQuote size={15} />}
        title="Interview Prep"
        sub={`Day ${info.slot + 1} · ${info.title}`}
        right={
          <Badge tone={done >= total ? 'green' : 'zinc'}>
            {done}/{total} practiced
          </Badge>
        }
      />
      <div className="space-y-4 p-4">
        <div>
          <Label hint="answer before revealing">
            <span className="inline-flex items-center gap-1">
              <Brain size={12} /> {info.kind === 'learn' ? 'Morning cold recall' : info.kind === 'revision' ? 'Friday recall gate' : 'Warm-up recall'}
            </span>
          </Label>
          <div className="space-y-2">
            {recall.map((r, i) => {
              const d = dayInfo(r.n);
              return (
                <Reveal
                  key={`r${r.n}`}
                  q={r.qa.q}
                  a={r.qa.a}
                  tag={<span className="text-[11px] text-zinc-500">{r.n === n ? 'Today’s topic (pre-test)' : `${r.n > n ? 'Preview · ' : ''}Week ${d.week.n} · Day ${d.slot + 1} · ${d.title}`}</span>}
                  checked={log.practiced.includes(`recall${i}`)}
                  onCheck={(v) => toggle(`recall${i}`, v)}
                  disabled={readOnly}
                />
              );
            })}
          </div>
        </div>
        <div>
          <Label hint="tap to reveal model answers">Real interview questions</Label>
          <div className="space-y-2">
            {interview.map((q) => (
              <Reveal
                key={q.key}
                q={q.qa.q}
                a={q.qa.a}
                tag={<Badge tone={q.kind === 'Conceptual' ? 'blue' : q.kind === 'Coding' ? 'green' : q.kind === 'Build Deep-Dive' ? 'amber' : 'pink'}>{q.kind}</Badge>}
                checked={log.practiced.includes(q.key)}
                onCheck={(v) => toggle(q.key, v)}
                disabled={readOnly}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function Logbook({ n }: { n: number }) {
  const { state, readOnly, updateLog } = useStore();
  const info = dayInfo(n);
  const log = state.logs[n] ?? emptyLog();
  const [preview, setPreview] = useState(false);
  const h = Math.floor(log.minutes / 60);
  const m = log.minutes % 60;
  const variance = log.minutes - info.budgetMin;
  const queued = (log.confidence >= 1 && log.confidence <= 3) || (log.blockers.trim() && !log.blockersResolved);
  const set = (patch: Parameters<typeof updateLog>[1]) => updateLog(n, patch);

  return (
    <Card>
      <CardHeader
        icon={<NotebookPen size={15} />}
        title="Daily Check-In Logbook"
        sub={`Day ${info.slot + 1} · autosaves as you type`}
        right={<CopyReportButton size="sm" variant="secondary" label="Ask AI Mentor About Today" getText={() => askMentorPrompt(n, state.logs)} />}
      />
      <div className="space-y-5 p-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-zinc-600 uppercase dark:text-zinc-400">1 · What I learned today</span>
            <div className="flex rounded-md bg-zinc-100 p-0.5 text-[11px] dark:bg-zinc-950">
              {['Write', 'Preview'].map((t, i) => (
                <button key={t} onClick={() => setPreview(i === 1)} className={cx('rounded px-2 py-0.5', preview === (i === 1) ? 'bg-white shadow-sm dark:bg-zinc-800' : 'text-zinc-500')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          {preview ? (
            <div className="min-h-28 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">{log.learned.trim() ? <Markdown text={log.learned} /> : <span className="text-sm text-zinc-500">Nothing yet.</span>}</div>
          ) : (
            <textarea
              className="field min-h-28 font-mono text-[13px]"
              placeholder={'Markdown supported.\n- Key insight…\n- `code` and **bold** work'}
              value={log.learned}
              disabled={readOnly}
              onChange={(e) => set({ learned: e.target.value })}
            />
          )}
        </div>

        <div>
          <Label hint={`Target ${info.budgetMin} min`}>2 · Time taken</Label>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              <input type="number" min={0} max={12} inputMode="numeric" aria-label="Hours" className="field w-20" value={h || ''} placeholder="0" disabled={readOnly} onChange={(e) => set({ minutes: Math.max(0, Number(e.target.value) || 0) * 60 + m })} />
              <span className="text-xs text-zinc-500">h</span>
            </div>
            <div className="flex items-center gap-1">
              <input type="number" min={0} max={59} step={5} inputMode="numeric" aria-label="Minutes" className="field w-20" value={m || ''} placeholder="0" disabled={readOnly} onChange={(e) => set({ minutes: h * 60 + Math.min(59, Math.max(0, Number(e.target.value) || 0)) })} />
              <span className="text-xs text-zinc-500">m</span>
            </div>
            {log.minutes > 0 && (
              <Badge tone={Math.abs(variance) <= 10 ? 'green' : variance > 0 ? 'amber' : 'blue'}>
                {variance === 0 ? 'On target' : `${variance > 0 ? '+' : '−'}${Math.abs(variance)} min vs target`}
              </Badge>
            )}
            {!readOnly && (
              <div className="flex gap-1">
                {[20, 45, info.budgetMin].map((q) => (
                  <button key={q} onClick={() => set({ minutes: q })} className="rounded-md border border-zinc-200 px-2 py-1 text-[11px] text-zinc-500 hover:text-zinc-900 dark:border-zinc-800 dark:hover:text-zinc-100">
                    {q}m
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>3 · How I completed it</Label>
          <textarea className="field min-h-20 font-mono text-[13px]" placeholder="Steps taken, code snippets, notebooks…" value={log.how} disabled={readOnly} onChange={(e) => set({ how: e.target.value })} />
          <input className="field mt-2" type="url" placeholder="GitHub commit / repo link (https://github.com/…)" value={log.link} disabled={readOnly} onChange={(e) => set({ link: e.target.value })} />
        </div>

        <div>
          <Label>4 · Problems & blockers I faced</Label>
          <textarea className="field min-h-20" placeholder="Bugs, confusing math/architecture, unanswered questions…" value={log.blockers} disabled={readOnly} onChange={(e) => set({ blockers: e.target.value })} />
          {log.blockers.trim() && (
            <label className="mt-2 inline-flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 accent-emerald-600" checked={log.blockersResolved} disabled={readOnly} onChange={(e) => set({ blockersResolved: e.target.checked })} />
              Blockers resolved
            </label>
          )}
        </div>

        <div>
          <Label>5 · Confidence rating</Label>
          <div className="flex flex-wrap items-center gap-3">
            <Stars value={log.confidence} onChange={readOnly ? undefined : (v) => set({ confidence: v })} size={24} />
            <span className="text-xs text-zinc-500">{['Unrated', 'Lost', 'Shaky', 'Okay-ish', 'Solid', 'Could teach it'][log.confidence]}</span>
          </div>
        </div>

        {queued && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-300/60 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {log.blockers.trim() && !log.blockersResolved ? <TriangleAlert size={16} className="mt-0.5 shrink-0" /> : <CircleAlert size={16} className="mt-0.5 shrink-0" />}
            <span>
              This day is in your <a href="#/revision" className="font-medium underline">Smart Revision Queue</a>
              {log.confidence >= 1 && log.confidence <= 3 ? ` (confidence ${log.confidence}/5)` : ''}
              {log.blockers.trim() && !log.blockersResolved ? ' (unresolved blockers)' : ''}.
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
