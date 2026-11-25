import {
  BookOpen, Brain, CalendarClock, ChevronLeft, ChevronRight, CircleAlert, Code2, Compass, Hammer, Lightbulb, MessageSquareQuote, NotebookPen, RotateCcw, Target, TriangleAlert, X,
} from 'lucide-react';
import { useState } from 'react';
import { PROJECTS } from '../data/curriculum';
import { RES } from '../data/resources';
import type { QA } from '../data/types';
import { go } from '../lib/router';
import { dayInfo, fmtDate, TOTAL_DAYS, weekDays } from '../lib/schedule';
import { revisionQueue } from '../lib/selectors';
import { emptyLog } from '../lib/state';
import { useStore } from '../lib/store';
import { Markdown } from './Markdown';
import { ModernTopicCard } from './ModernTopic';
import { TrackTasksCard } from './TrackTasks';
import { modernForWeek } from '../data/modern';
import { Badge, Btn, Card, CardHeader, cx, Label, ResourceRow, Reveal, Stars, StatusSelector, TrackBadge } from './ui';
import { dayTracks } from '../data/tracks';

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
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="violet">Phase {info.phase.n} · {info.phase.short}</Badge>
          <Badge>Week {info.week.n}/40</Badge>
          <Badge>Day {n}/280</Badge>
          <Badge tone={info.kind === 'learn' ? 'blue' : info.kind === 'revision' ? 'amber' : 'green'}>
            {info.label} · {info.kind === 'learn' ? 'Learn + Build' : info.kind === 'revision' ? 'Revision Day' : 'Deep Project Build'}
          </Badge>
          {dayTracks(info.slot).map((t) => (
            <TrackBadge key={t} track={t} />
          ))}
          <span className="ml-1 text-xs text-zinc-500">{fmtDate(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
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

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <TopicCard n={n} isToday={isToday} />
          <TrackTasksCard n={n} />
          <ModernTopicCard n={n} />
          <MentorNotes n={n} />
          <Logbook n={n} />
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

function TopicCard({ n, isToday }: { n: number; isToday?: boolean }) {
  const { state, readOnly, updateLog, update } = useStore();
  const info = dayInfo(n);
  const log = state.logs[n] ?? emptyLog();
  const w = info.week;

  return (
    <Card className={cx('@container', isToday && 'ring-1 ring-violet-500/40')}>
      <div className="p-4 sm:p-5">
        <div className="mb-1 text-[11px] font-semibold tracking-wider text-violet-600 uppercase dark:text-violet-400">
          {isToday ? "Today's Topic" : 'Topic'} · {w.title}
        </div>
        <h2 className="text-lg leading-snug font-semibold sm:text-xl">{info.title}</h2>
        <div className="mt-1 text-xs text-zinc-500">
          Time budget: <span className="font-medium text-zinc-700 dark:text-zinc-300">{info.budgetMin} min</span>
          {info.kind === 'learn' && ' · 45 min concept/docs + 45 min hands-on'}
          {info.kind === 'revision' && ' · zero new material — spaced repetition & re-solving'}
          {info.kind === 'project' && ' · deep build session'}
        </div>

        {info.kind === 'learn' && info.topic && (
          <div className="mt-4 grid gap-3 @lg:grid-cols-2">
            <Block icon={<BookOpen size={14} />} title="45 min · Concept / Docs">{info.topic.learn}</Block>
            <Block icon={<Code2 size={14} />} title="45 min · Hands-on">{info.topic.build}</Block>
          </div>
        )}

        {info.kind === 'revision' && <FridayPlan n={n} />}

        {info.kind === 'project' && (
          <div className="mt-4 space-y-3">
            <Block icon={<Hammer size={14} />} title="Weekend deep build (3 h)">{w.weekend}</Block>
            {w.project && (
              <a href="#/projects" className="flex items-center justify-between rounded-lg border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <span>
                  Feeds <b>Flagship Project {w.project}</b>: {PROJECTS[w.project - 1].title.split('(')[0].trim()}
                </span>
                <ChevronRight size={16} />
              </a>
            )}
            <div className="text-xs text-zinc-500">
              {info.slot === 5 ? 'Saturday: build the core feature; commit early and often.' : 'Sunday: finish, write tests/README notes, push, and log what broke.'}
            </div>
          </div>
        )}

        {(info.kind === 'learn' ? info.topic!.res : info.kind === 'project' ? info.phase.resources.slice(0, 3) : []).length > 0 && (
          <div className="mt-4">
            <Label hint="opens in a new tab">Resources for this session</Label>
            <div className="space-y-2">
              {(info.kind === 'learn' ? info.topic!.res : info.phase.resources.slice(0, 3)).map((id) => RES[id] && <ResourceRow key={id} r={RES[id]} label="Visit Link" />)}
            </div>
          </div>
        )}

        <div className="mt-5">
          <Label hint={log.status === 'floor' ? 'Streak kept alive — catch up later' : undefined}>Status</Label>
          <StatusSelector
            value={log.status}
            disabled={readOnly}
            onChange={(s) => {
              const patch: Parameters<typeof updateLog>[1] = { status: s };
              if (s === 'floor' && !log.minutes) patch.minutes = 20;
              updateLog(n, patch);
              if (s === 'completed' && info.kind === 'revision') update((d) => void (d.fridayChecks[w.n] = d.fridayChecks[w.n] ?? [false, false, false]));
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
    'Answer all 4 of this week’s cold-recall questions from memory',
    `Re-solve 2 tricky problems cold — incl. this week’s coding question`,
    `Clear the low-confidence & blocker queue (${queue.filter((q) => q.reason === 'low_conf' || q.reason === 'blocker').length} items)`,
  ];
  return (
    <div className="mt-4 space-y-3">
      <Block icon={<RotateCcw size={14} />} title="Friday revision workflow (75 min)">
        1) 20 min: answer this week’s 4 cold-recall questions from memory below. 2) 30 min: re-solve 2 tricky problems without notes. 3) 25 min: clear
        low-confidence & blocked topics in the Revision Hub.
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
        <Label>This week’s topics</Label>
        <div className="grid gap-1.5 @lg:grid-cols-2">
          {weekDays(w.n)
            .slice(0, 4)
            .map((d) => (
              <a key={d} href={`#/day/${d}`} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-xs hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900">
                <span className="truncate">{dayInfo(d).title}</span>
                <span className="ml-2 shrink-0 text-zinc-500">{state.logs[d]?.confidence ? `${state.logs[d].confidence}★` : '—'}</span>
              </a>
            ))}
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

function MentorNotes({ n }: { n: number }) {
  const w = dayInfo(n).week;
  return (
    <Card>
      <CardHeader icon={<Compass size={15} />} title="Mentor Notes" sub={`Week ${w.n}: ${w.title}`} />
      <div className="@container"><div className="grid gap-4 p-4 @lg:grid-cols-2">
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
    </Card>
  );
}

/** Cold recall = today's topic + the 2 most recent learning days before it (true retrieval practice). */
function recallSet(n: number): { n: number; qa: QA }[] {
  const info = dayInfo(n);
  const out: { n: number; qa: QA }[] = [];
  if (info.kind === 'learn') out.push({ n, qa: info.topic!.recall });
  let k = n - 1;
  while (out.length < 3 && k >= 1) {
    const d = dayInfo(k);
    if (d.kind === 'learn') out.push({ n: k, qa: d.topic!.recall });
    k--;
  }
  // Week 1 edge case: fill from upcoming days of the same week
  k = n + 1;
  while (out.length < 3 && k <= TOTAL_DAYS) {
    const d = dayInfo(k);
    if (d.kind === 'learn') out.push({ n: k, qa: d.topic!.recall });
    k++;
  }
  return out;
}

function InterviewPanel({ n }: { n: number }) {
  const { state, readOnly, updateLog } = useStore();
  const info = dayInfo(n);
  const log = state.logs[n] ?? emptyLog();
  const w = info.week;
  const recall = info.kind === 'revision' ? weekDays(w.n).slice(0, 4).map((d) => ({ n: d, qa: dayInfo(d).topic!.recall })) : recallSet(n);
  const interview = [
    ...(info.kind === 'learn' ? [{ key: 'iq', kind: 'Conceptual' as const, qa: info.topic!.iq }] : []),
    { key: 'coding', kind: 'Coding' as const, qa: w.coding },
    { key: 'design', kind: 'System Design' as const, qa: w.design },
    ...(modernForWeek(w.n) ? [{ key: 'modern', kind: '2026 Production' as const, qa: modernForWeek(w.n)!.iq }] : []),
  ];
  const toggle = (key: string, v: boolean) => updateLog(n, { practiced: v ? [...new Set([...log.practiced, key])] : log.practiced.filter((k) => k !== key) });
  const total = recall.length + interview.length;
  const done = log.practiced.length;

  return (
    <Card>
      <CardHeader icon={<MessageSquareQuote size={15} />} title="Interview Prep" sub="Linked to today’s topic" right={<Badge tone={done >= total ? 'green' : 'zinc'}>{Math.min(done, total)}/{total} practiced</Badge>} />
      <div className="space-y-4 p-4">
        <div>
          <Label hint="answer before revealing">
            <span className="inline-flex items-center gap-1">
              <Brain size={12} /> Morning cold recall
            </span>
          </Label>
          <div className="space-y-2">
            {recall.map((r, i) => (
              <Reveal
                key={`r${r.n}`}
                q={r.qa.q}
                a={r.qa.a}
                tag={<span className="text-[11px] text-zinc-500">{r.n === n ? 'Today’s topic (pre-test)' : `From Day ${r.n} · ${dayInfo(r.n).title}`}</span>}
                checked={log.practiced.includes(`recall${i}`)}
                onCheck={(v) => toggle(`recall${i}`, v)}
                disabled={readOnly}
              />
            ))}
          </div>
        </div>
        <div>
          <Label>Real interview questions</Label>
          <div className="space-y-2">
            {interview.map((q) => (
              <Reveal
                key={q.key}
                q={q.qa.q}
                a={q.qa.a}
                tag={<Badge tone={q.kind === 'Conceptual' ? 'blue' : q.kind === 'Coding' ? 'green' : q.kind === '2026 Production' ? 'amber' : 'pink'}>{q.kind}</Badge>}
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
      <CardHeader icon={<NotebookPen size={15} />} title="Daily Learning & Blocker Logbook" sub="Autosaves as you type" />
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
