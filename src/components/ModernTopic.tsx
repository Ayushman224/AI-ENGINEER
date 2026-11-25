import { ArrowUpRight, Sparkles } from 'lucide-react';
import { modernForWeek, modernKey } from '../data/modern';
import { RES } from '../data/resources';
import { dayInfo } from '../lib/schedule';
import { useStore } from '../lib/store';
import { Badge, Card, CardHeader, cx } from './ui';

/** Checkbox row for a week's 2026 production-topic task (shared by Day view and Roadmap). */
export function ModernTaskRow({ w }: { w: number }) {
  const { state, update, readOnly } = useStore();
  const m = modernForWeek(w);
  if (!m) return null;
  const done = !!state.trackDone?.[modernKey(w)];
  return (
    <div className="rounded-lg border border-amber-300/60 bg-amber-50/50 p-3 dark:border-amber-500/25 dark:bg-amber-500/5">
      <div className="flex items-start gap-2.5">
        <input
          type="checkbox"
          aria-label={`Mark 2026 topic task for week ${w} done`}
          className="mt-0.5 h-4 w-4 shrink-0 accent-amber-500"
          checked={done}
          disabled={readOnly}
          onChange={(e) => update((d) => void (d.trackDone[modernKey(w)] = e.target.checked))}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <Badge tone="amber">
              <Sparkles size={11} /> 2026 · {m.title}
            </Badge>
            <span className="text-[11px] text-zinc-500">
              W{m.weeks[0]}–{m.weeks[1]} · part {w - m.weeks[0] + 1}/4
            </span>
          </div>
          <div className={cx('text-sm leading-snug', done && 'text-zinc-400 line-through')}>{m.tasks[w]}</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.res.map(
              (id) =>
                RES[id] && (
                  <a
                    key={id}
                    href={RES[id].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:bg-transparent dark:hover:bg-zinc-800"
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

export function ModernTopicCard({ n }: { n: number }) {
  const w = dayInfo(n).week.n;
  const m = modernForWeek(w);
  if (!m) return null;
  return (
    <Card>
      <CardHeader icon={<Sparkles size={15} />} title={`2026 Production Topic · ${m.phaseLabel}`} sub="Woven into this week’s hands-on and weekend sessions" />
      <div className="space-y-3 p-4">
        <div>
          <div className="text-sm font-semibold">{m.title}</div>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{m.summary}</p>
        </div>
        <ModernTaskRow w={w} />
        <p className="text-[11px] text-zinc-500">Its interview question is in the Interview Prep panel (amber “2026 Production” badge).</p>
      </div>
    </Card>
  );
}
