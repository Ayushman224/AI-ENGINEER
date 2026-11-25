import { CalendarDays, Cloud, Trash2, X } from 'lucide-react';
import { Btn, Card, CardHeader, Label, PageTitle } from '../components/ui';
import { fmtDate, fromISO, nextMonday } from '../lib/schedule';
import { initialState } from '../lib/state';
import { useStore } from '../lib/store';

export function Settings() {
  const { state, update, replace, readOnly, user, sync, syncError, cal, cloudConfigured } = useStore();
  const start = state.settings.startDate;
  const notMonday = fromISO(start).getDay() !== 1;

  return (
    <div className="max-w-3xl space-y-4">
      <PageTitle title="Settings" />

      <Card>
        <CardHeader icon={<CalendarDays size={15} />} title="Schedule" sub="Day 1 → Day 280 map onto real dates from your start date" />
        <div className="space-y-4 p-4">
          <div>
            <Label hint={`Ends ${fmtDate(cal.dates[279], { month: 'short', day: 'numeric', year: 'numeric' })}`}>Start date</Label>
            <div className="flex flex-wrap gap-2">
              <input type="date" className="field w-48" value={start} disabled={readOnly} onChange={(e) => e.target.value && update((d) => void (d.settings.startDate = e.target.value))} />
              <Btn disabled={readOnly} onClick={() => update((d) => void (d.settings.startDate = nextMonday()))}>
                Next Monday
              </Btn>
            </div>
            {notMonday && <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">Tip: start on a Monday so Fri = Revision and Sat/Sun = Deep Build line up with the real weekend.</p>}
          </div>
          <div>
            <Label hint="each one shifts all later days forward by 1">Rest / rescheduled dates ({state.settings.skipped.length})</Label>
            {!state.settings.skipped.length ? (
              <p className="text-xs text-zinc-500">None. Use “Push +1 day” on any day, or “Reschedule” on the Today screen after missed days.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {state.settings.skipped.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 rounded-md bg-zinc-100 py-1 pr-1 pl-2 text-xs dark:bg-zinc-800">
                    {fmtDate(d)}
                    {!readOnly && (
                      <button aria-label={`Remove ${d}`} className="rounded p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700" onClick={() => update((s) => void (s.settings.skipped = s.settings.skipped.filter((x) => x !== d)))}>
                        <X size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader icon={<Cloud size={15} />} title="Phone ↔ PC sync" sub={user ? `Cloud sync on · ${user.email} · ${sync}` : cloudConfigured ? 'Supabase keys saved — sign in to start syncing' : 'Guest mode — saved in this browser (localStorage)'} />
        <div className="flex flex-wrap items-center gap-3 p-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="flex-1">Paste your Supabase URL + anon key for automatic sync, or move progress with a JSON backup — both live in the Sync panel (also in the top header).</p>
          <Btn variant="primary" onClick={() => window.dispatchEvent(new Event('aieos-open-sync'))}>
            Open Settings / Sync
          </Btn>
        </div>
        {syncError && <p className="px-4 pb-4 text-xs text-rose-500">{syncError}</p>}
      </Card>

      <Card>
        <CardHeader icon={<Trash2 size={15} />} title="Danger zone" />
        <div className="p-4">
          <Btn
            variant="danger"
            disabled={readOnly}
            onClick={() => {
              if (confirm('Erase ALL progress on this device (and in the cloud if signed in)? This cannot be undone. Export a JSON backup first if unsure.')) replace({ ...initialState(), settings: { ...state.settings, skipped: [] } });
            }}
          >
            Reset all progress
          </Btn>
        </div>
      </Card>
      <p className="text-center text-[11px] text-zinc-500">AI Engineer OS · 7 phases · 40 weeks · 160 topics · {(13.5).toFixed(1)} h/week</p>
    </div>
  );
}
