import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { buildCalendar, type Calendar, todayISO } from './schedule';
import { type AppState, type DayLog, emptyLog, loadLocal, saveLocal } from './state';

/** All progress lives in this browser's localStorage. Move it between devices with JSON backup/import. */
interface Store {
  state: AppState;
  update: (fn: (draft: AppState) => void) => void;
  replace: (s: AppState) => void;
  updateLog: (n: number, patch: Partial<DayLog>) => void;
  readOnly: boolean;
  cal: Calendar;
  today: string;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children, shared }: { children: ReactNode; shared?: AppState }) {
  const readOnly = !!shared;
  const [state, setState] = useState<AppState>(() => shared ?? loadLocal());
  const [today, setToday] = useState(todayISO());
  const stateRef = useRef(state);
  stateRef.current = state;

  // Roll "today" over at midnight / when the tab regains focus.
  useEffect(() => {
    const tick = () => setToday(todayISO());
    const id = window.setInterval(tick, 60_000);
    window.addEventListener('focus', tick);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', tick);
    };
  }, []);

  // Keep multiple open tabs of the app in step.
  useEffect(() => {
    if (readOnly) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'aieos:state:v1') setState(loadLocal());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [readOnly]);

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.settings.theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.settings.theme === 'dark' ? '#0a0a0b' : '#ffffff');
  }, [state.settings.theme]);

  const commit = useCallback((next: AppState) => {
    setState(next);
    saveLocal(next);
  }, []);

  const update = useCallback(
    (fn: (draft: AppState) => void) => {
      if (readOnly) return;
      const draft = structuredClone(stateRef.current);
      fn(draft);
      draft.updatedAt = Date.now();
      commit(draft);
    },
    [readOnly, commit]
  );

  const replace = useCallback(
    (s: AppState) => {
      if (readOnly) return;
      commit({ ...s, updatedAt: Date.now() });
    },
    [readOnly, commit]
  );

  const updateLog = useCallback(
    (n: number, patch: Partial<DayLog>) =>
      update((d) => {
        const prev = d.logs[n] ?? emptyLog();
        const next = { ...prev, ...patch, updatedAt: Date.now() };
        if (patch.status === 'completed' && !prev.completedAt) next.completedAt = todayISO();
        if (patch.status && patch.status !== 'completed' && prev.status === 'completed') {
          next.completedAt = undefined;
          next.reviews = [];
        }
        d.logs[n] = next;
      }),
    [update]
  );

  const cal = useMemo(() => buildCalendar(state.settings.startDate, state.settings.skipped), [state.settings.startDate, state.settings.skipped]);

  const value = useMemo<Store>(() => ({ state, update, replace, updateLog, readOnly, cal, today }), [state, update, replace, updateLog, readOnly, cal, today]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside provider');
  return s;
}
