import { nextMonday } from './schedule';

export type Status = 'not_started' | 'in_progress' | 'floor' | 'completed';

export interface DayLog {
  status: Status;
  learned: string;
  minutes: number;
  how: string;
  link: string;
  blockers: string;
  blockersResolved: boolean;
  confidence: number; // 0 = unrated, 1..5
  completedAt?: string; // YYYY-MM-DD
  reviews: number[]; // spaced-repetition stages done: 3, 7, 14
  practiced: string[]; // interview item keys practiced
  updatedAt: number;
}

export interface ProjectState {
  steps: boolean[];
  metrics: Record<string, string>;
  github: string;
  demo: string;
  notes: string;
}

export interface AppState {
  v: 1;
  settings: {
    startDate: string;
    skipped: string[];
    theme: 'dark' | 'light';
    sidebarCollapsed: boolean;
  };
  logs: Record<number, DayLog>;
  projects: Record<number, ProjectState>;
  archSheets: Record<number, boolean>;
  fridayChecks: Record<number, boolean[]>;
  trackDone: Record<string, boolean>; // `${week}:${track}`
  updatedAt: number;
}

export const emptyLog = (): DayLog => ({
  status: 'not_started',
  learned: '',
  minutes: 0,
  how: '',
  link: '',
  blockers: '',
  blockersResolved: false,
  confidence: 0,
  reviews: [],
  practiced: [],
  updatedAt: 0,
});

export const emptyProject = (): ProjectState => ({ steps: [], metrics: {}, github: '', demo: '', notes: '' });

export const initialState = (): AppState => ({
  v: 1,
  settings: { startDate: nextMonday(), skipped: [], theme: 'dark', sidebarCollapsed: false },
  logs: {},
  projects: {},
  archSheets: {},
  fridayChecks: {},
  trackDone: {},
  updatedAt: 0,
});

const KEY = 'aieos:state:v1';

export function loadLocal(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    return normalize(JSON.parse(raw));
  } catch {
    return initialState();
  }
}

export function saveLocal(s: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Fill in any missing fields so older/imported snapshots never crash the UI. */
export function normalize(x: unknown): AppState {
  const base = initialState();
  if (!x || typeof x !== 'object') throw new Error('Not a valid progress file');
  const s = x as Partial<AppState>;
  const logs: Record<number, DayLog> = {};
  for (const [k, v] of Object.entries(s.logs ?? {})) logs[Number(k)] = { ...emptyLog(), ...(v as DayLog) };
  const projects: Record<number, ProjectState> = {};
  for (const [k, v] of Object.entries(s.projects ?? {})) projects[Number(k)] = { ...emptyProject(), ...(v as ProjectState) };
  return {
    v: 1,
    settings: { ...base.settings, ...(s.settings ?? {}) },
    logs,
    projects,
    archSheets: s.archSheets ?? {},
    fridayChecks: s.fridayChecks ?? {},
    trackDone: s.trackDone ?? {},
    updatedAt: s.updatedAt ?? 0,
  };
}

// ── Share link codec: deflate + base64url in the URL hash ──
async function streamBytes(input: Uint8Array, t: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const stream = new Blob([input as BlobPart]).stream().pipeThrough(t as unknown as ReadableWritablePair<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
const b64url = (bytes: Uint8Array) => {
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const unb64url = (s: string) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

export async function encodeShare(s: AppState): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(s));
  return b64url(await streamBytes(json, new CompressionStream('deflate-raw')));
}
export async function decodeShare(token: string): Promise<AppState> {
  const bytes = await streamBytes(unb64url(token), new DecompressionStream('deflate-raw'));
  return normalize(JSON.parse(new TextDecoder().decode(bytes)));
}
