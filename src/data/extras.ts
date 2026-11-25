import { EXTRAS_A } from './extrasA';
import { EXTRAS_B } from './extrasB';

/** Per-week day extras: Fri/Sat/Sun reading, weekend interview questions, and per-day mentor tips. */
export interface Extra {
  read: [string, string, string]; // concept/reading for Fri, Sat, Sun
  satQ: [string, string];
  sunQ: [string, string];
  tips: string[]; // 7 × "interview tip || common pitfall"
}

export const EXTRAS: Record<number, Extra> = { ...EXTRAS_A, ...EXTRAS_B };

export interface DayTip {
  tip: string;
  pitfall: string;
}

export function dayTip(week: number, slot: number): DayTip {
  const [tip, pitfall] = (EXTRAS[week]?.tips[slot] ?? '').split('||').map((s) => s.trim());
  return { tip: tip ?? '', pitfall: pitfall ?? '' };
}
