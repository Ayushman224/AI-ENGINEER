import { BookMarked, Bot, CalendarPlus, FolderKanban, HardDriveDownload, House, Map, Moon, PanelLeftClose, PanelLeftOpen, RotateCcw, Settings, Sun } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { BackupModal } from './BackupModal';
import { CookbooksDrawer } from './CookbooksDrawer';
import type { Route } from '../lib/router';
import { fmtDate, resolveDay, TOTAL_DAYS } from '../lib/schedule';
import { isDone, revisionQueue } from '../lib/selectors';
import { useStore } from '../lib/store';
import { cx } from './ui';

const NAV = [
  { key: 'today', label: 'Today', icon: House, href: '#/today' },
  { key: 'roadmap', label: 'Roadmap', icon: Map, href: '#/roadmap' },
  { key: 'revision', label: 'Revision', icon: RotateCcw, href: '#/revision' },
  { key: 'projects', label: 'Projects', icon: FolderKanban, href: '#/projects' },
  { key: 'mentor', label: 'Mentor Sync', icon: Bot, href: '#/mentor' },
] as const;

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { state, update, readOnly, today, cal } = useStore();
  const collapsed = state.settings.sidebarCollapsed;
  const active = route.name === 'day' ? 'roadmap' : route.name;
  const backlog = revisionQueue(state, today).length;
  const dark = state.settings.theme === 'dark';
  const toggleTheme = () => update((d) => void (d.settings.theme = dark ? 'light' : 'dark'));
  const [backupOpen, setBackupOpen] = useState(false);
  const [booksOpen, setBooksOpen] = useState(false);
  useEffect(() => {
    const on = () => setBackupOpen(true);
    window.addEventListener('aieos-open-backup', on);
    return () => window.removeEventListener('aieos-open-backup', on);
  }, []);

  // “Missed a day?” — insert one rest day at the first unfinished day from today onward.
  // Every later day moves +1; completed logs (keyed by day number) are never touched.
  const [shifted, setShifted] = useState<{ date: string; n: number } | null>(null);
  const shiftOneDay = () => {
    let k = resolveDay(cal, today).n;
    while (k < TOTAL_DAYS && isDone(state.logs[k])) k++;
    const date = cal.dates[k - 1];
    if (!date || state.settings.skipped.includes(date)) return;
    update((d) => {
      d.settings.skipped = [...d.settings.skipped, date].sort();
    });
    setShifted({ date, n: k });
  };
  useEffect(() => {
    if (!shifted) return;
    const id = setTimeout(() => setShifted(null), 8000);
    return () => clearTimeout(id);
  }, [shifted]);
  const shiftBtn = readOnly ? null : (
    <button
      onClick={shiftOneDay}
      title="Missed a day? Shift every unfinished day forward by 1 day (past logs are kept)"
      aria-label="Shift schedule by one day"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      <CalendarPlus size={13} />
      <span className="hidden sm:inline">Missed a day? Shift +1 Day</span>
    </button>
  );

  const syncBadge = readOnly ? null : (
    <button
      onClick={() => setBackupOpen(true)}
      title="Saved in this browser — export/import a backup to move devices"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      <HardDriveDownload size={13} />
      Backup
    </button>
  );

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside
        className={cx(
          'hidden shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/60 transition-[width] duration-200 lg:flex dark:border-zinc-800/80 dark:bg-zinc-950/60',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className={cx('flex h-14 items-center gap-2 px-4', collapsed && 'justify-center px-0')}>
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="h-7 w-7 rounded-lg" />
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">AI Engineer OS</div>
              <div className="text-[11px] text-zinc-500">10-month mentor</div>
            </div>
          )}
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
          {[...NAV, { key: 'settings', label: 'Settings', icon: Settings, href: '#/settings' } as const].map((it) => {
            const Icon = it.icon;
            const on = active === it.key;
            return (
              <a
                key={it.key}
                href={it.href}
                title={collapsed ? it.label : undefined}
                className={cx(
                  'group flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition',
                  collapsed && 'justify-center px-0',
                  on ? 'bg-white font-medium text-zinc-900 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-white dark:ring-zinc-800' : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
                )}
              >
                <Icon size={17} className={on ? 'text-violet-500' : ''} />
                {!collapsed && <span className="flex-1">{it.label}</span>}
                {!collapsed && it.key === 'revision' && backlog > 0 && <span className="rounded-full bg-amber-500/15 px-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">{backlog}</span>}
              </a>
            );
          })}
          <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800/80" />
          <button
            onClick={() => setBooksOpen(true)}
            title={collapsed ? 'Cookbooks & Notes' : undefined}
            className={cx('flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900', collapsed && 'justify-center px-0')}
          >
            <BookMarked size={17} />
            {!collapsed && <span className="flex-1 text-left">Cookbooks & Notes</span>}
          </button>
        </nav>
        <div className={cx('flex items-center gap-1 border-t border-zinc-200 p-2 dark:border-zinc-800/80', collapsed ? 'flex-col' : 'justify-end')}>
          <div className={cx('flex', collapsed && 'flex-col')}>
            <IconBtn onClick={toggleTheme} label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</IconBtn>
            <IconBtn onClick={() => update((d) => void (d.settings.sidebarCollapsed = !collapsed))} label="Collapse sidebar">
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </IconBtn>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200 px-4 lg:hidden dark:border-zinc-800/80">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="h-6 w-6 rounded-md" />
            <span className="hidden text-sm font-semibold whitespace-nowrap min-[420px]:inline">AI Engineer OS</span>
          </div>
          <div className="flex items-center gap-1">
            {shiftBtn}
            {syncBadge}
            <IconBtn onClick={() => setBooksOpen(true)} label="Cookbooks & Notes">
              <BookMarked size={16} />
            </IconBtn>
            <IconBtn onClick={toggleTheme} label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}</IconBtn>
            <a href="#/settings" aria-label="Settings" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Settings size={16} />
            </a>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden h-12 shrink-0 items-center justify-end gap-2 border-b border-zinc-200 px-6 lg:flex dark:border-zinc-800/80">
          {shiftBtn}
          <button onClick={() => setBooksOpen(true)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800">
            <BookMarked size={13} /> Cookbooks & Notes
          </button>
          {syncBadge}
        </header>

        {readOnly && (
          <div className="border-b border-violet-300/50 bg-violet-50 px-4 py-2 text-center text-xs text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
            Read-only mentor view — this is a snapshot of someone’s progress. Edits are disabled.{' '}
            <a
              className="underline"
              href="./"
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.removeItem('aieos:share');
                location.href = location.pathname + '#/today';
                location.reload();
              }}
            >
              Exit & open my own tracker
            </a>
          </div>
        )}

        <main id="main" className="scroll-thin flex-1 overflow-y-auto">
          <div className="pb-safe mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 lg:pt-8">{children}</div>
        </main>

        {/* Mobile bottom tabs */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden dark:border-zinc-800 dark:bg-[#0a0a0b]/90">
          <div className="grid grid-cols-5">
            {NAV.map((it) => {
              const Icon = it.icon;
              const on = active === it.key;
              return (
                <a key={it.key} href={it.href} className={cx('relative flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] font-medium', on ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500')}>
                  <Icon size={20} />
                  {it.label}
                  {it.key === 'revision' && backlog > 0 && <span className="absolute top-2 right-[calc(50%-18px)] h-2 w-2 rounded-full bg-amber-500" />}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
      <BackupModal open={backupOpen} onClose={() => setBackupOpen(false)} />
      <CookbooksDrawer open={booksOpen} onClose={() => setBooksOpen(false)} />
      {shifted && (
        <div role="status" className="fixed inset-x-3 bottom-20 z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-xl lg:bottom-6 dark:border-zinc-700 dark:bg-zinc-900">
          <CalendarPlus size={16} className="shrink-0 text-violet-500" />
          <span className="flex-1">
            Shifted: Day {shifted.n} and everything after moved +1 day ({fmtDate(shifted.date)} is now a rest day).
          </span>
          <button
            className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
            onClick={() => {
              update((d) => void (d.settings.skipped = d.settings.skipped.filter((x) => x !== shifted.date)));
              setShifted(null);
            }}
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick, label }: { children: ReactNode; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
      {children}
    </button>
  );
}
