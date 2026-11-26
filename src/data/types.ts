export type Track = 'ai' | 'backend' | 'docker' | 'security' | 'cicd' | 'aws' | 'interview';
/** Badge kinds shown on days: a track, or the Friday revision gate. */
export type DayBadge = Track | 'revision';

export type ResourceType = 'Video' | 'Course' | 'Docs' | 'GitHub' | 'Practice' | 'Article';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  est: string; // estimated total time
}

export interface QA {
  q: string;
  a: string;
}

export interface InterviewQ extends QA {
  kind: 'Conceptual' | 'Coding' | 'System Design';
}

/** A Mon–Thu learning day. */
export interface TopicDay {
  title: string;
  learn: string; // 45 min concept/docs
  build: string; // 45 min hands-on
  res: string[]; // resource ids
  recall: QA; // cold-recall question for this topic
  iq: QA; // conceptual interview question for this topic
  track: Track; // the single active track for this day
}

/** Fri (revision gate), Sat (build part 1) and Sun (build part 2 + evals + mentor report). */
export interface DayPlan {
  title: string;
  task: string;
  res: string[];
  track: DayBadge;
}

export interface Week {
  n: number; // 1..40
  phase: number; // 1..7
  title: string;
  why: string; // why it matters in production jobs
  master: string[]; // key concepts to master
  skip: string; // time-wasting traps
  days: TopicDay[]; // exactly 4 (Mon–Thu)
  coding: QA; // week coding interview question
  design: QA; // week system design question
  weekend: string; // Sat–Sun deep build summary
  project?: number; // flagship project id the weekend feeds
  stage: string; // e.g. "Phase 2A — AI Core + Backend"
  fri: DayPlan;
  sat: DayPlan;
  sun: DayPlan;
}

export interface Phase {
  n: number;
  title: string;
  short: string;
  weeks: [number, number];
  topics: string[];
  resources: string[];
  spine: string[]; // the 1–2 main courses to follow start to finish in this phase
  color: string;
}

export interface Project {
  id: number;
  title: string;
  pitch: string;
  steps: string[];
  metrics: { key: string; label: string; unit: string; hint: string }[];
}
