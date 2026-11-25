import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CLOUD_EVENT, currentUser, getSupabase, pullRemote, pushRemote } from './cloud';
import { buildCalendar, type Calendar, todayISO } from './schedule';
import { type AppState, type DayLog, emptyLog, loadLocal, saveLocal } from './state';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';

interface Store {
  state: AppState;
  update: (fn: (draft: AppState) => void) => void;
  replace: (s: AppState) => void;
  updateLog: (n: number, patch: Partial<DayLog>) => void;
  readOnly: boolean;
  cal: Calendar;
  today: string;
  user: User | null;
  sync: SyncStatus;
  syncError: string;
  cloudConfigured: boolean;
  syncNow: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children, shared }: { children: ReactNode; shared?: AppState }) {
  const readOnly = !!shared;
  const [state, setState] = useState<AppState>(() => shared ?? loadLocal());
  const [user, setUser] = useState<User | null>(null);
  const [sync, setSync] = useState<SyncStatus>('local');
  const [syncError, setSyncError] = useState('');
  const [today, setToday] = useState(todayISO());
  const [cloudVersion, setCloudVersion] = useState(0);
  const cloudConfigured = useMemo(() => !!getSupabase(), [cloudVersion]);

  // Re-initialise sync whenever keys are saved/cleared in the Sync modal.
  useEffect(() => {
    const on = () => setCloudVersion((v) => v + 1);
    window.addEventListener(CLOUD_EVENT, on);
    return () => window.removeEventListener(CLOUD_EVENT, on);
  }, []);
  const pushTimer = useRef<number | undefined>(undefined);
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

  // Theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.settings.theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', state.settings.theme === 'dark' ? '#0a0a0b' : '#ffffff');
  }, [state.settings.theme]);

  // ── Cloud sync (last-write-wins on whole snapshot) ──
  const reconcile = useCallback(async (u: User) => {
    setSync('syncing');
    try {
      const remote = await pullRemote(u.id);
      const local = stateRef.current;
      const linkKey = 'aieos:synced-user';
      const firstLink = localStorage.getItem(linkKey) !== u.id;
      localStorage.setItem(linkKey, u.id);
      // First sign-in on this device with progress on both sides: ask instead of silently overwriting.
      if (firstLink && remote && remote.updatedAt > 0 && local.updatedAt > 0) {
        const keepCloud = confirm(
          'Progress exists both in the cloud and on this device.\n\nOK = use CLOUD progress (replace this device)\nCancel = use THIS DEVICE (overwrite cloud)'
        );
        if (keepCloud) {
          setState(remote);
          saveLocal(remote);
        } else await pushRemote(u.id, local);
      } else if (remote && remote.updatedAt > local.updatedAt) {
        setState(remote);
        saveLocal(remote);
      } else if (local.updatedAt > 0) {
        await pushRemote(u.id, local);
      }
      setSync('synced');
      setSyncError('');
    } catch (e) {
      setSync('error');
      setSyncError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    if (readOnly || !sb) {
      setUser(null);
      setSync('local');
      return;
    }
    // Only (re)sync on initial session and real sign-ins — not on every token refresh.
    const { data } = sb.auth.onAuthStateChange((evt, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) setSync('local');
      else if (evt === 'INITIAL_SESSION' || evt === 'SIGNED_IN') setTimeout(() => reconcile(u), 0);
    });
    const onFocus = async () => {
      const u = await currentUser();
      if (u) reconcile(u);
    };
    window.addEventListener('focus', onFocus);
    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener('focus', onFocus);
    };
  }, [readOnly, reconcile, cloudVersion]);

  const syncNow = useCallback(() => {
    currentUser().then((u) => u && reconcile(u));
  }, [reconcile]);

  const commit = useCallback(
    (next: AppState) => {
      setState(next);
      saveLocal(next);
      if (user) {
        window.clearTimeout(pushTimer.current);
        setSync('syncing');
        pushTimer.current = window.setTimeout(() => {
          pushRemote(user.id, next)
            .then(() => {
              setSync('synced');
              setSyncError('');
            })
            .catch((e) => {
              setSync('error');
              setSyncError((e as Error).message);
            });
        }, 1200);
      }
    },
    [user]
  );

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

  const value = useMemo<Store>(
    () => ({ state, update, replace, updateLog, readOnly, cal, today, user, sync, syncError, cloudConfigured, syncNow }),
    [state, update, replace, updateLog, readOnly, cal, today, user, sync, syncError, cloudConfigured, syncNow]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside provider');
  return s;
}
