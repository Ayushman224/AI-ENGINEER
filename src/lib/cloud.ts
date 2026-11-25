import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import { normalize, type AppState } from './state';

/**
 * Supabase config can come from the Sync modal (saved in this browser's localStorage)
 * or from build-time env vars. Without either, the app runs in guest/localStorage mode.
 */
export interface CloudConfig {
  url: string;
  key: string;
}

const CFG_KEY = 'aieos:supabase';
export const TABLE = 'user_progress';
export const CLOUD_EVENT = 'aieos-cloud-config';

export const SETUP_SQL = `create table if not exists user_progress (user_id uuid primary key references auth.users on delete cascade, state jsonb not null, updated_at timestamptz default now());
alter table user_progress enable row level security;
create policy "own progress" on user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);`;

export function savedCloudConfig(): CloudConfig | null {
  try {
    const c = JSON.parse(localStorage.getItem(CFG_KEY) || 'null');
    return c?.url && c?.key ? c : null;
  } catch {
    return null;
  }
}

export function getCloudConfig(): CloudConfig | null {
  const saved = savedCloudConfig();
  if (saved) return saved;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  return url && key ? { url, key } : null;
}

export function validateConfig(c: CloudConfig): string | null {
  let u: URL;
  try {
    u = new URL(c.url.trim());
  } catch {
    return 'Project URL is not a valid URL';
  }
  if (u.protocol !== 'https:') return 'Project URL must start with https://';
  if (c.key.trim().length < 20) return 'Anon key looks too short — copy the full “anon public” key';
  return null;
}

export function saveCloudConfig(c: CloudConfig | null) {
  if (c) localStorage.setItem(CFG_KEY, JSON.stringify({ url: c.url.trim().replace(/\/+$/, ''), key: c.key.trim() }));
  else localStorage.removeItem(CFG_KEY);
  client = null;
  clientFor = '';
  window.dispatchEvent(new Event(CLOUD_EVENT));
}

let client: SupabaseClient | null = null;
let clientFor = '';

export function getSupabase(): SupabaseClient | null {
  const cfg = getCloudConfig();
  if (!cfg) return null;
  const id = `${cfg.url}|${cfg.key}`;
  if (id !== clientFor) {
    client = createClient(cfg.url, cfg.key, { auth: { storageKey: 'aieos-auth', persistSession: true, autoRefreshToken: true } });
    clientFor = id;
  }
  return client;
}

export async function currentUser(): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.user ?? null;
}

export async function signIn(email: string, password: string) {
  const sb = getSupabase();
  if (!sb) throw new Error('Save your Supabase URL and anon key first');
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Returns true if signed in immediately, false if Supabase sent a confirmation email. */
export async function signUp(email: string, password: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) throw new Error('Save your Supabase URL and anon key first');
  const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin } });
  if (error) throw error;
  return !!data.session;
}

export async function signOut() {
  await getSupabase()?.auth.signOut();
}

const friendly = (e: { message: string; code?: string }) =>
  e.code === '42P01' || e.code === 'PGRST205' || (/user_progress/.test(e.message) && /not exist|schema cache/.test(e.message))
    ? new Error('Table “user_progress” not found — run the 3-line SQL in your Supabase SQL editor')
    : new Error(e.message);

export async function pullRemote(userId: string): Promise<AppState | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from(TABLE).select('state').eq('user_id', userId).maybeSingle();
  if (error) throw friendly(error);
  return data?.state ? normalize(data.state) : null;
}

export async function pushRemote(userId: string, state: AppState) {
  const sb = getSupabase();
  if (!sb) return;
  const { error } = await sb.from(TABLE).upsert({ user_id: userId, state, updated_at: new Date(state.updatedAt || Date.now()).toISOString() });
  if (error) throw friendly(error);
}
