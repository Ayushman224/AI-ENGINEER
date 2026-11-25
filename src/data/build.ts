import type { TopicDay, Track, Week } from './types';

/** Compact day tuple: [title, learn, build, resIds (space-separated), recallQ, recallA, interviewQ, interviewA, track?] */
export type D = [string, string, string, string, string, string, string, string, Track?];

/** Week fields filled in later from WEEKLY (stage + Fri/Sat/Sun plans). */
export type RawWeek = Omit<Week, 'stage' | 'fri' | 'sat' | 'sun'>;

interface WeekMeta {
  why: string;
  master: string; // '; ' separated
  skip: string;
  coding: [string, string];
  design: [string, string];
  weekend: string;
  project?: number;
}

export function W(n: number, phase: number, title: string, m: WeekMeta, days: D[]): RawWeek {
  if (days.length !== 4) throw new Error(`Week ${n} must have 4 days`);
  return {
    n,
    phase,
    title,
    why: m.why,
    master: m.master.split(';').map((s) => s.trim()).filter(Boolean),
    skip: m.skip,
    coding: { q: m.coding[0], a: m.coding[1] },
    design: { q: m.design[0], a: m.design[1] },
    weekend: m.weekend,
    project: m.project,
    days: days.map(
      ([title, learn, build, res, rq, ra, iq, ia, track]): TopicDay => ({
        title,
        learn,
        build,
        res: res.split(' ').filter(Boolean),
        recall: { q: rq, a: ra },
        iq: { q: iq, a: ia },
        track: track ?? (phase === 7 ? 'interview' : 'ai'),
      })
    ),
  };
}
