import { type AppState, normalize } from './state';

export function exportBackup(state: AppState, today: string) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-engineer-os-backup-${today}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readBackup(file: File): Promise<AppState> {
  const parsed = JSON.parse(await file.text());
  if (!parsed || typeof parsed !== 'object' || !('logs' in parsed) || !('settings' in parsed)) throw new Error('This file is not an AI Engineer OS backup');
  return normalize(parsed);
}
