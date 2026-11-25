import { Check, Cloud, Copy, Download, Eye, EyeOff, HardDrive, LogOut, RefreshCw, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { exportBackup, readBackup } from '../lib/backup';
import { copyText } from '../lib/clipboard';
import { getCloudConfig, saveCloudConfig, savedCloudConfig, SETUP_SQL, signIn, signOut, signUp, validateConfig } from '../lib/cloud';
import { useStore } from '../lib/store';
import { Modal } from './Modal';
import { Badge, Btn, Label } from './ui';

export function SyncModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Settings / Sync — keep Phone & PC identical" wide>
      <div className="space-y-6">
        <CloudSection />
        <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
        <LocalSection />
      </div>
    </Modal>
  );
}

function CloudSection() {
  const { user, sync, syncError, cloudConfigured, syncNow, readOnly } = useStore();
  const saved = savedCloudConfig();
  const active = getCloudConfig();
  const [url, setUrl] = useState(saved?.url ?? '');
  const [key, setKey] = useState(saved?.key ?? '');
  const [showKey, setShowKey] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const save = () => {
    const err = validateConfig({ url, key });
    if (err) return setMsg({ tone: 'err', text: err });
    saveCloudConfig({ url, key });
    setMsg({ tone: 'ok', text: 'Saved. Now sign in (or create an account) below — sync starts automatically.' });
  };

  const auth = async (mode: 'in' | 'up') => {
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'in') await signIn(email, password);
      else if (!(await signUp(email, password))) {
        setMsg({ tone: 'ok', text: 'Account created. Confirm the email Supabase sent you, then sign in here. (Tip: disable “Confirm email” in Supabase → Authentication for instant sign-up.)' });
        return;
      }
      setPassword('');
      setMsg({ tone: 'ok', text: 'Signed in — syncing your progress.' });
    } catch (e) {
      setMsg({ tone: 'err', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <div className="mb-1 flex items-center gap-2">
        <Cloud size={16} className="text-violet-500" />
        <h3 className="text-sm font-semibold">1 · Cloud Sync (optional, Supabase)</h3>
        {user ? (
          <Badge tone={sync === 'error' ? 'red' : 'green'}>{sync === 'syncing' ? 'Syncing…' : sync === 'error' ? 'Error' : 'Synced'}</Badge>
        ) : cloudConfigured ? (
          <Badge tone="amber">Keys saved · not signed in</Badge>
        ) : (
          <Badge>Off</Badge>
        )}
      </div>
      <p className="mb-4 text-xs leading-relaxed text-zinc-500">
        Paste your own free Supabase project’s keys. Your progress and daily logs then auto-sync both ways, so phone and PC stay identical. Keys are stored only in this browser — do this once on each device.
      </p>

      <div className="mb-4">
        <Label
          hint={
            <button
              className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400"
              onClick={async () => {
                if (await copyText(SETUP_SQL)) {
                  setSqlCopied(true);
                  setTimeout(() => setSqlCopied(false), 1800);
                }
              }}
            >
              {sqlCopied ? <Check size={11} /> : <Copy size={11} />} {sqlCopied ? 'Copied' : 'Copy SQL'}
            </button>
          }
        >
          Step 1 — run in Supabase → SQL Editor
        </Label>
        <pre className="scroll-thin overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed dark:border-zinc-800 dark:bg-zinc-900">{SETUP_SQL}</pre>
      </div>

      <div className="grid gap-3">
        <div>
          <Label hint="Project Settings → API">Step 2 — Supabase Project URL</Label>
          <input className="field font-mono text-[13px]" placeholder="https://abcdefgh.supabase.co" value={url} disabled={readOnly} onChange={(e) => setUrl(e.target.value)} autoComplete="off" spellCheck={false} />
        </div>
        <div>
          <Label hint="the “anon / public” key — never the service_role key">Supabase Anon Key</Label>
          <div className="relative">
            <input
              className="field pr-10 font-mono text-[13px]"
              type={showKey ? 'text' : 'password'}
              placeholder="eyJhbGciOi…"
              value={key}
              disabled={readOnly}
              onChange={(e) => setKey(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="button" aria-label={showKey ? 'Hide key' : 'Show key'} onClick={() => setShowKey(!showKey)} className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="primary" onClick={save} disabled={readOnly || !url || !key}>
            Save keys
          </Btn>
          {saved && (
            <Btn
              variant="ghost"
              onClick={async () => {
                await signOut();
                saveCloudConfig(null);
                setUrl('');
                setKey('');
                setMsg({ tone: 'ok', text: 'Cloud sync disconnected on this device. Local data is untouched.' });
              }}
            >
              Disconnect
            </Btn>
          )}
          {!saved && active && <span className="self-center text-[11px] text-zinc-500">Using keys from the build’s .env</span>}
        </div>
      </div>

      {cloudConfigured && (
        <div className="mt-5 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          {user ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div>
                Signed in as <b>{user.email}</b>
                {syncError && <div className="mt-1 text-xs text-rose-500">{syncError}</div>}
              </div>
              <div className="flex gap-2">
                <Btn size="sm" onClick={syncNow}>
                  <RefreshCw size={13} /> Sync now
                </Btn>
                <Btn size="sm" variant="ghost" onClick={signOut}>
                  <LogOut size={13} /> Sign out
                </Btn>
              </div>
            </div>
          ) : (
            <form
              className="grid gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                auth('in');
              }}
            >
              <Label hint="same login on phone and PC">Step 3 — Sign in to sync</Label>
              <input className="field" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="field" type="password" required minLength={6} autoComplete="current-password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="flex flex-wrap gap-2">
                <Btn variant="primary" type="submit" disabled={busy}>
                  Sign in
                </Btn>
                <Btn type="button" disabled={busy || !email || password.length < 6} onClick={() => auth('up')}>
                  Create account
                </Btn>
              </div>
            </form>
          )}
        </div>
      )}
      {msg && <p className={`mt-3 text-xs ${msg.tone === 'err' ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>{msg.text}</p>}
    </section>
  );
}

function LocalSection() {
  const { state, today, replace, readOnly } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const logged = Object.keys(state.logs).length;
  return (
    <section>
      <div className="mb-1 flex items-center gap-2">
        <HardDrive size={16} className="text-violet-500" />
        <h3 className="text-sm font-semibold">2 · Instant Local Transfer (no database)</h3>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-zinc-500">
        Export a backup file on one device, then import it on the other (AirDrop, email, Google Drive…). Import replaces this device’s progress. Current data: {logged} logged day{logged === 1 ? '' : 's'}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Btn
          variant="primary"
          onClick={() => {
            exportBackup(state, today);
            setMsg({ tone: 'ok', text: 'Backup downloaded.' });
          }}
        >
          <Download size={15} /> Export Backup (.json)
        </Btn>
        <Btn onClick={() => fileRef.current?.click()} disabled={readOnly}>
          <Upload size={15} /> Import Backup (.json)
        </Btn>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (!f) return;
            try {
              const s = await readBackup(f);
              if (!confirm(`Replace ALL progress on this device with “${f.name}” (${Object.keys(s.logs).length} logged days)?`)) return;
              replace(s);
              setMsg({ tone: 'ok', text: 'Backup imported.' });
            } catch (err) {
              setMsg({ tone: 'err', text: `Import failed: ${(err as Error).message}` });
            }
          }}
        />
      </div>
      {msg && <p className={`mt-3 text-xs ${msg.tone === 'err' ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>{msg.text}</p>}
    </section>
  );
}
