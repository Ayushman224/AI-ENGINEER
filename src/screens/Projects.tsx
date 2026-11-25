import { ArrowUpRight, ChevronDown, Code2, Globe } from 'lucide-react';
import { useState } from 'react';
import { Badge, Card, cx, Label, PageTitle, Progress, safeUrl } from '../components/ui';
import { PROJECTS, WEEKS } from '../data/curriculum';
import { emptyProject } from '../lib/state';
import { useStore } from '../lib/store';

export function Projects() {
  const { state } = useStore();
  const [open, setOpen] = useState<number | null>(1);
  return (
    <div>
      <PageTitle title="5 Flagship Portfolio Projects" sub="Step-by-step checklists, eval scorecards, repo and live demo links." />
      <div className="space-y-3">
        {PROJECTS.map((p) => {
          const ps = state.projects[p.id] ?? emptyProject();
          const done = p.steps.filter((_, i) => ps.steps[i]).length;
          const pct = (done / p.steps.length) * 100;
          const weeks = WEEKS.filter((w) => w.project === p.id).map((w) => w.n);
          const isOpen = open === p.id;
          return (
            <Card key={p.id}>
              <button onClick={() => setOpen(isOpen ? null : p.id)} className="flex w-full items-start gap-3 p-4 text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">{p.id}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm leading-snug font-semibold">{p.title}</div>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Progress value={pct} className="max-w-56" />
                    <span className="font-mono text-[11px] text-zinc-500">
                      {done}/{p.steps.length}
                    </span>
                    {weeks.length > 0 && <span className="hidden text-[11px] text-zinc-500 sm:inline">Built in weeks {weeks.join(', ')}</span>}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {pct === 100 && <Badge tone="green">Shipped</Badge>}
                  <ChevronDown size={16} className={cx('text-zinc-400 transition', isOpen && 'rotate-180')} />
                </div>
              </button>
              {isOpen && <ProjectBody id={p.id} />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ProjectBody({ id }: { id: number }) {
  const { state, update, readOnly } = useStore();
  const p = PROJECTS[id - 1];
  const ps = state.projects[id] ?? emptyProject();
  const set = (fn: (x: typeof ps) => void) =>
    update((d) => {
      const x = d.projects[id] ?? emptyProject();
      fn(x);
      d.projects[id] = x;
    });

  return (
    <div className="grid gap-5 border-t border-zinc-200 p-4 lg:grid-cols-2 dark:border-zinc-800/80">
      <div>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{p.pitch}</p>
        <Label>Build checklist</Label>
        <div className="space-y-1">
          {p.steps.map((s, i) => (
            <label key={i} className="flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900">
              <input type="checkbox" className="mt-0.5 h-4 w-4 accent-violet-600" checked={!!ps.steps[i]} disabled={readOnly} onChange={(e) => set((x) => void (x.steps[i] = e.target.checked))} />
              <span className={cx(ps.steps[i] && 'text-zinc-400 line-through')}>
                <span className="mr-1.5 font-mono text-[11px] text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label hint="fill in as you measure">Eval scorecard</Label>
          <div className="grid grid-cols-2 gap-2">
            {p.metrics.map((m) => (
              <div key={m.key} className="rounded-lg border border-zinc-200 p-2.5 dark:border-zinc-800">
                <div className="text-[11px] font-medium text-zinc-500">{m.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <input
                    className="w-full bg-transparent font-mono text-base font-semibold outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                    placeholder="—"
                    value={ps.metrics[m.key] ?? ''}
                    disabled={readOnly}
                    onChange={(e) => set((x) => void (x.metrics[m.key] = e.target.value))}
                  />
                  <span className="shrink-0 text-[11px] text-zinc-500">{m.unit}</span>
                </div>
                <div className="mt-0.5 text-[10.5px] text-zinc-400">{m.hint}</div>
              </div>
            ))}
          </div>
        </div>
        <UrlField icon={<Code2 size={14} />} label="GitHub URL" value={ps.github} placeholder="https://github.com/you/project" onChange={(v) => set((x) => void (x.github = v))} />
        <UrlField icon={<Globe size={14} />} label="Live demo URL" value={ps.demo} placeholder="https://…" onChange={(v) => set((x) => void (x.demo = v))} />
        <div>
          <Label>Notes & decisions</Label>
          <textarea className="field min-h-24" placeholder="Design decisions, trade-offs, what broke, what’s next…" value={ps.notes} disabled={readOnly} onChange={(e) => set((x) => void (x.notes = e.target.value))} />
        </div>
      </div>
    </div>
  );
}

function UrlField({ icon, label, value, placeholder, onChange }: { icon: React.ReactNode; label: string; value: string; placeholder: string; onChange: (v: string) => void }) {
  const { readOnly } = useStore();
  const url = safeUrl(value);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400">{icon}</span>
          <input className="field pl-9" type="url" value={value} placeholder={placeholder} disabled={readOnly} onChange={(e) => onChange(e.target.value)} />
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1 rounded-lg border border-zinc-200 px-3 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800">
            Open <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
