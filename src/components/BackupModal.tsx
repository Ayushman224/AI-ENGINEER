import { Download, HardDrive, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { exportBackup, readBackup } from '../lib/backup';
import { useStore } from '../lib/store';
import { Modal } from './Modal';
import { Btn } from './ui';

/** Local-only storage: progress lives in this browser; JSON files move it between Phone and PC. */
export function BackupModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, today, replace, readOnly } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const logged = Object.keys(state.logs).length;

  return (
    <Modal open={open} onClose={onClose} title="Backup & Transfer">
      <div className="mb-1 flex items-center gap-2">
        <HardDrive size={16} className="text-violet-500" />
        <h3 className="text-sm font-semibold">Your data is stored locally in this browser</h3>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-zinc-500">
        Nothing is sent to a server. To move progress between Phone and PC, export a backup here and import it on the other device (AirDrop, email, Google Drive…). Import replaces that
        device’s progress. Export regularly — clearing browser data deletes local progress. Current data: {logged} logged day{logged === 1 ? '' : 's'}.
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
    </Modal>
  );
}
