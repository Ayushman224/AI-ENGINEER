import { ArrowUpRight, BookOpen, Code2, Dumbbell, Eye, EyeOff, FileText, GraduationCap, PlayCircle, Star } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { Resource } from '../data/types';
import { TRACKS } from '../data/tracks';
import type { DayBadge } from '../data/types';
import type { Link } from '../data/links';
import type { Status } from '../lib/state';

/** Only allow http(s) links from user/shared data (blocks javascript: URLs in shared snapshots). */
export const safeUrl = (u: string) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : undefined);

export const cx =(...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Card({ children, className, ...rest }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={cx('rounded-xl border border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/40', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ icon, title, right, sub }: { icon?: ReactNode; title: ReactNode; right?: ReactNode; sub?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800/80">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold">
          {icon && <span className="text-zinc-400">{icon}</span>}
          {title}
        </div>
        {sub && <div className="mt-0.5 text-xs text-zinc-500">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

const BADGE_TONES = {
  zinc: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  red: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  blue: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300',
};
export type Tone = keyof typeof BADGE_TONES;

export function Badge({ children, tone = 'zinc', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap', BADGE_TONES[tone], className)}>{children}</span>;
}

export function Btn({
  children,
  variant = 'secondary',
  size = 'md',
  className,
  ...rest
}: { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'h-8 px-2.5 text-xs' : 'h-9 px-3.5 text-sm',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-500',
        variant === 'secondary' && 'border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800',
        variant === 'ghost' && 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/70',
        variant === 'danger' && 'border border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-500/40 dark:text-rose-400 dark:hover:bg-rose-500/10',
        className
      )}
    >
      {children}
    </button>
  );
}

const TYPE_META: Record<Resource['type'], { tone: Tone; icon: ReactNode }> = {
  Video: { tone: 'red', icon: <PlayCircle size={11} /> },
  Course: { tone: 'violet', icon: <GraduationCap size={11} /> },
  Docs: { tone: 'blue', icon: <BookOpen size={11} /> },
  GitHub: { tone: 'zinc', icon: <Code2 size={11} /> },
  Practice: { tone: 'green', icon: <Dumbbell size={11} /> },
  Article: { tone: 'amber', icon: <FileText size={11} /> },
};

export function TypeBadge({ type }: { type: Resource['type'] }) {
  const m = TYPE_META[type];
  return (
    <Badge tone={m.tone}>
      {m.icon}
      {type}
    </Badge>
  );
}

export function ResourceRow({ r, label = 'Visit Resource' }: { r: Resource; label?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 sm:flex-row sm:items-center dark:border-zinc-800">
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium leading-snug">{r.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <TypeBadge type={r.type} />
          <span className="text-[11px] text-zinc-500">⏱ {r.est}</span>
        </div>
      </div>
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {label} <ArrowUpRight size={13} />
      </a>
    </div>
  );
}

export const STATUS_OPTS: { v: Status; label: string; dot: string }[] = [
  { v: 'not_started', label: 'Not Started', dot: 'bg-zinc-400' },
  { v: 'in_progress', label: 'In Progress', dot: 'bg-sky-400' },
  { v: 'floor', label: 'Floor Session (20m)', dot: 'bg-amber-400' },
  { v: 'completed', label: 'Completed', dot: 'bg-emerald-400' },
];

export const statusDot = (s?: Status) => STATUS_OPTS.find((o) => o.v === (s ?? 'not_started'))!.dot;

export function StatusSelector({ value, onChange, disabled }: { value: Status; onChange: (s: Status) => void; disabled?: boolean }) {
  return (
    <div role="radiogroup" aria-label="Day status" className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 @md:grid-cols-4 dark:bg-zinc-950">
      {STATUS_OPTS.map((o) => (
        <button
          key={o.v}
          role="radio"
          aria-checked={value === o.v}
          disabled={disabled}
          onClick={() => onChange(o.v)}
          className={cx(
            'flex min-h-9 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition',
            value === o.v ? 'bg-white shadow-sm dark:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          )}
        >
          <span className={cx('h-1.5 w-1.5 rounded-full', o.dot)} />
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Stars({ value, onChange, size = 20, disabled }: { value: number; onChange?: (v: number) => void; size?: number; disabled?: boolean }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={disabled || !onChange}
          aria-label={`${i} star${i > 1 ? 's' : ''}`}
          onMouseEnter={() => onChange && setHover(i)}
          onClick={() => onChange?.(i === value ? 0 : i)}
          className="p-0.5 disabled:cursor-default"
        >
          <Star size={size} className={i <= shown ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-700'} />
        </button>
      ))}
    </div>
  );
}

export function Reveal({ q, a, tag, checked, onCheck, disabled }: { q: string; a: string; tag?: ReactNode; checked?: boolean; onCheck?: (v: boolean) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex items-start gap-2.5">
        {onCheck && (
          <input
            type="checkbox"
            aria-label="Mark practiced"
            checked={!!checked}
            disabled={disabled}
            onChange={(e) => onCheck(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600"
          />
        )}
        <div className="min-w-0 flex-1">
          {tag && <div className="mb-1">{tag}</div>}
          <div className="text-sm leading-snug">{q}</div>
          <button onClick={() => setOpen(!open)} aria-expanded={open} className="-ml-1 mt-1 inline-flex min-h-8 items-center gap-1 rounded-md px-1 text-xs font-medium text-violet-600 hover:text-violet-500 dark:text-violet-400">
            {open ? <EyeOff size={12} /> : <Eye size={12} />}
            {open ? 'Hide answer' : 'Reveal answer / hint'}
          </button>
          {open && <div className="mt-2 rounded-md bg-zinc-50 p-2.5 text-[13px] leading-relaxed text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">{a}</div>}
        </div>
      </div>
    </div>
  );
}

export function Progress({ value, className, color }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800', className)}>
      <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}

export function Label({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-xs font-semibold tracking-wide text-zinc-600 uppercase dark:text-zinc-400">{children}</span>
      {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
    </div>
  );
}

export function PageTitle({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-zinc-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-800">{children}</div>;
}

export function TrackBadge({ track, className }: { track: DayBadge; className?: string }) {
  const t = TRACKS[track];
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap', t.badge, className)}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
      {t.label}
    </span>
  );
}

/** A dedicated day link (Primary or 🇮🇳 Indian Alternative) with optional ⏱ timestamp badge. */
export function LinkRow({ link, label = 'Open Resource' }: { link: Link; label?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 sm:flex-row sm:items-center dark:border-zinc-800">
      <div className="min-w-0 flex-1">
        <div className="text-sm leading-snug font-medium">{link.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <TypeBadge type={link.type} />
          {link.badge && (
            <span className="inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              {link.badge}
            </span>
          )}
          <span className="text-[11px] text-zinc-500">⏱ {link.est}</span>
        </div>
      </div>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-lg bg-zinc-900 px-3 text-xs font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {label} <ArrowUpRight size={13} />
      </a>
    </div>
  );
}
