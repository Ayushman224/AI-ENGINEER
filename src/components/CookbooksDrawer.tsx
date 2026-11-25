import { ArrowUpRight, BookMarked, X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { COOKBOOKS } from '../data/modern';

/** Right-side reference drawer. Pure bookmarks — nothing here is logged or counted toward daily hours. */
export function CookbooksDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return createPortal(
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Reference cookbooks and notes"
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl transition-[transform,visibility] duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950 ${open ? 'visible translate-x-0' : 'invisible translate-x-full'}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <BookMarked size={16} className="text-violet-500" /> Cookbooks & Notes
            </h2>
            <p className="mt-1 text-xs text-zinc-500">Reference repos for weekend builds and revision. Not counted against daily hours.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X size={16} />
          </button>
        </div>
        <ol className="scroll-thin flex-1 space-y-2 overflow-y-auto p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          {COOKBOOKS.map((c, i) => (
            <li key={c.url} className="rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-[11px] text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm leading-snug font-semibold">{c.title}</div>
                  <div className="mt-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">{c.tag}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{c.desc}</p>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[10.5px] text-zinc-400">{c.url.replace(/^https:\/\/(www\.)?/, '')}</span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-7 shrink-0 items-center gap-1 rounded-lg bg-zinc-900 px-2.5 text-xs font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                      Open <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>,
    document.body
  );
}
