import { Check, Download, Link2, Upload } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CopyReportButton } from '../components/CopyReportButton';
import { Btn, Card, CardHeader, cx, PageTitle, Progress, TrackBadge } from '../components/ui';
import { exportBackup, readBackup } from '../lib/backup';
import { copyText } from '../lib/clipboard';
import { mentorReport, type Scope } from '../lib/report';
import { resolveDay } from '../lib/schedule';
import { trackStats } from '../lib/selectors';
import { encodeShare } from '../lib/state';
import { useStore } from '../lib/store';

export function Mentor() {
  const { state, cal, today, replace, readOnly } = useStore();
  const [scope, setScope] = useState<Scope>('week');
  const [shareCopied, setShareCopied] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const n = resolveDay(cal, today).n;
  const report = useMemo(() => mentorReport(state, cal, today, n, scope), [state, cal, today, n, scope]);
  const stats = trackStats(state, n).filter((x) => x.due > 0 || x.minutes > 0);

  const share = async () => {
    const token = await encodeShare(state);
    const url = `${location.origin}${location.pathname}#/share/${token}`;
    const ok = await copyText(url);
    if (ok) {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
    setMsg(ok ? `Read-only link copied (${(url.length / 1024).toFixed(1)} KB). It contains a snapshot of your progress — share only with people you trust.` : `Copy this link manually: ${url}`);
  };

  const importJson = async (f: File) => {
    try {
      const s = await readBackup(f);
      if (!confirm('Replace ALL current progress on this device with the imported backup? (Export first if unsure.)')) return;
      replace(s);
      setMsg('Backup imported.');
    } catch (e) {
      setMsg(`Import failed: ${(e as Error).message}`);
    }
  };

  return (
    <div className="space-y-5">
      <PageTitle title="AI Mentor Sync" sub="Copy a clean Markdown check-in and paste it into Claude, ChatGPT or a human mentor." />

      <Card>
        <CardHeader title="Mentor Check-In Report" sub="Phase · week · streak · hours · tracks · recent entries · blockers · low-confidence topics" right={<CopyReportButton getText={() => report} />} />
        <div className="p-4">
          <div className="mb-3 inline-flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-950">
            {(['today', 'week', 'phase'] as const).map((s) => (
              <button key={s} onClick={() => setScope(s)} className={cx('rounded-md px-3 py-1.5 text-xs font-medium', scope === s ? 'bg-white shadow-sm dark:bg-zinc-800' : 'text-zinc-500')}>
                {s === 'today' ? 'Today' : s === 'week' ? 'This Week' : 'Full Phase'}
              </button>
            ))}
          </div>
          <pre className="scroll-thin max-h-[28rem] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap dark:border-zinc-800 dark:bg-zinc-950">{report}</pre>
        </div>
      </Card>

      <Card>
        <CardHeader title="Track breakdown" sub="Days completed vs days due so far, per unlocked track" />
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.track}>
              <div className="mb-1.5 flex items-center justify-between">
                <TrackBadge track={s.track} />
                <span className="font-mono text-[11px] text-zinc-500">
                  {s.done}/{s.due}
                </span>
              </div>
              <Progress value={(s.done / Math.max(1, s.due)) * 100} />
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader icon={<Link2 size={15} />} title="Shareable read-only mentor link" />
          <div className="space-y-3 p-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>Encodes a compressed snapshot of your progress into the link itself — no server needed. The recipient sees everything read-only.</p>
            <Btn onClick={share}>
              {shareCopied ? <Check size={15} /> : <Link2 size={15} />}
              {shareCopied ? 'Link copied' : 'Copy read-only link'}
            </Btn>
          </div>
        </Card>
        <Card>
          <CardHeader icon={<Download size={15} />} title="JSON backup" />
          <div className="space-y-3 p-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>Export a full backup, or import one on another device (replaces local progress).</p>
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => exportBackup(state, today)}>
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
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (f) importJson(f);
                }}
              />
            </div>
          </div>
        </Card>
      </div>
      {msg && <p className="rounded-lg bg-zinc-100 p-3 text-xs break-all text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">{msg}</p>}
    </div>
  );
}
