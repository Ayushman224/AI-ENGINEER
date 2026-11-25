import type { DayBadge, Track } from './types';

export type { Track };

/** Tracks unlock sequentially: AI Core (W1–8) → Backend (W9–10) → Docker (W11–12) → Security (W15–16) → CI/CD (W23–24) → AWS (W25–28) → Interview Prep (W29–40). */
export const TRACK_ORDER: Track[] = ['ai', 'backend', 'docker', 'security', 'cicd', 'aws', 'interview'];

export const TRACKS: Record<DayBadge, { label: string; color: string; badge: string; unlock: string }> = {
  ai: { label: 'AI Core', color: '#8b5cf6', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300', unlock: 'Weeks 1–28' },
  backend: { label: 'Backend', color: '#10b981', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', unlock: 'Weeks 9–10' },
  docker: { label: 'Docker', color: '#0ea5e9', badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300', unlock: 'Weeks 11–12' },
  security: { label: 'Security', color: '#f43f5e', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300', unlock: 'Weeks 15–16' },
  cicd: { label: 'CI/CD', color: '#eab308', badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300', unlock: 'Weeks 23–24' },
  aws: { label: 'AWS', color: '#f97316', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300', unlock: 'Weeks 25–28' },
  interview: { label: 'Interview Prep', color: '#22d3ee', badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/15 dark:text-cyan-300', unlock: 'Weeks 28–40' },
  revision: { label: 'Revision', color: '#a1a1aa', badge: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-200', unlock: 'Every Friday' },
};
