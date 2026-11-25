import { ArrowUpRight, Layers3 } from 'lucide-react';
import { RES } from '../data/resources';
import { TRACK_ORDER, TRACK_SLOT, TRACK_TASKS, trackKey, TRACKS, type Track, type TrackTask } from '../data/tracks';
import { dayInfo } from '../lib/schedule';
import { isTrackDone } from '../lib/selectors';
import { useStore } from '../lib/store';
import { Card, CardHeader, cx, TrackBadge } from './ui';

export function TrackTaskRow({ t, highlight, compact }: { t: TrackTask; highlight?: boolean; compact?: boolean }) {
  const { state, update, readOnly } = useStore();
  const done = isTrackDone(state, t.week, t.track);
  const auto = t.track === 'ai' && !state.trackDone[trackKey(t.week, t.track)] && done;
  return (
    <div
      className={cx('rounded-lg border p-3', highlight ? 'border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950/70' : 'border-zinc-200 dark:border-zinc-800')}
      style={highlight ? { boxShadow: `inset 3px 0 0 ${TRACKS[t.track].color}` } : undefined}
    >
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          aria-label={`Mark ${TRACKS[t.track].label} task for week ${t.week} done`}
          className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600"
          checked={done}
          disabled={readOnly || auto}
          title={auto ? 'Auto-completed: all 4 topic days are done' : undefined}
          onChange={(e) => update((d) => void (d.trackDone[trackKey(t.week, t.track)] = e.target.checked))}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <TrackBadge track={t.track} focus={t.focus && t.track !== 'ai'} />
            {!compact && t.track !== 'ai' && (
              <span className="text-[11px] text-zinc-500">{t.focus ? 'Focus week — use the full 45-min hands-on block' : '≈15–20 min drill inside the hands-on block'}</span>
            )}
          </div>
          <div className={cx('text-sm leading-snug', done && 'text-zinc-400 line-through')}>{t.task}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {t.res.map(
              (id) =>
                RES[id] && (
                  <a
                    key={id}
                    href={RES[id].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1 rounded-md border border-zinc-200 px-2 py-1 text-[11px] font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <span className="truncate">{RES[id].title}</span>
                    <ArrowUpRight size={11} className="shrink-0" />
                  </a>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Day view card: today's track drill highlighted, plus the rest of the week's 5 track tasks. */
export function TrackTasksCard({ n }: { n: number }) {
  const info = dayInfo(n);
  const tasks = TRACK_TASKS[info.week.n];
  const todays: Track[] =
    info.kind === 'learn' ? (Object.keys(TRACK_SLOT) as Exclude<Track, 'ai'>[]).filter((k) => TRACK_SLOT[k] === info.slot) : info.kind === 'project' ? TRACK_ORDER : [];
  const sub =
    info.kind === 'learn'
      ? 'Today’s drill is highlighted. Mon Backend · Tue Docker · Wed Security & CI/CD · Thu AWS'
      : info.kind === 'revision'
        ? 'Friday: tick off any track tasks you finished this week'
        : 'Weekend build: integrate every track into your project';
  const ordered = [...tasks].sort((a, b) => Number(todays.includes(b.track)) - Number(todays.includes(a.track)));
  return (
    <Card>
      <CardHeader icon={<Layers3 size={15} />} title={`Track Tasks · Week ${info.week.n}`} sub={sub} />
      <div className="space-y-2 p-4">
        {ordered.map((t) => (
          <TrackTaskRow key={t.track} t={t} highlight={todays.includes(t.track) && info.kind === 'learn'} />
        ))}
      </div>
    </Card>
  );
}
