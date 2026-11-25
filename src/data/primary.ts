import type { DayBadge } from './types';

/**
 * ONE decisive primary resource per day — "who teaches this topic best".
 *  W1–5   ML & DL foundations: Codebasics (math/stats, W1–2) · CampusX 100 Days of ML (W3–4) / DL (W5); Deep-ML for practice days
 *  W6–8   Transformers & LLMs: Karpathy Zero to Hero (W6, W8) · Vizuara (W7); Raschka repo for revision/build days
 *  W9–10  Backend days → CampusX FastAPI; RAG days → DeepLearning.AI RAG
 *  W11–12, W23–28  Docker / CI/CD / AWS days → Abhishek Veeramalla; AI days keep the official docs (vLLM, Langfuse…)
 *  W13–14 LangGraph & MCP → CampusX Agentic AI; agent design → Anthropic; SDK days → official PydanticAI / OpenAI Agents docs
 *  W15–22 Official OWASP, Unsloth/TRL, Langfuse & Ragas docs (the day's existing first resource)
 *  W29–40 DSA → Striver A2Z · ML coding → NeetCode ML · everything else → Chip Huyen ML Interviews
 */
export function primaryResource(week: number, slot: number, track: DayBadge, fallback: string): string {
  const learn = slot < 4;

  if (week <= 5) {
    if (!learn) return 'deepml';
    if (week <= 2) return 'codebasics';
    return week === 5 ? 'campusx-dl' : 'campusx-ml';
  }
  if (week <= 8) {
    if (!learn) return 'raschka';
    return week === 7 ? 'vizuara' : 'karpathy';
  }
  if (week <= 10) return track === 'backend' ? 'campusx-fastapi' : 'dlai-rag';
  if (week <= 12) return track === 'docker' || slot === 4 ? 'abhishek-docker' : fallback;
  if (week <= 14) {
    if (week === 13 && slot <= 1) return 'anthropic-agents';
    if (week === 14 && slot <= 1) return fallback; // PydanticAI / OpenAI Agents SDK official docs
    return 'campusx-agents';
  }
  if (week <= 22) return fallback;
  if (week <= 28) {
    if (track === 'cicd' || (slot === 4 && week <= 24)) return 'abhishek-cicd';
    if (track === 'aws' || (slot === 4 && week <= 27)) return 'abhishek-aws';
    return fallback; // official vLLM / Langfuse / system-design docs
  }
  // W29–40 interview blitz
  if (week >= 31 && week <= 33) return 'striver-a2z';
  if (week === 35) return 'neetcode-ml';
  if (week === 39) return slot === 0 ? 'striver-a2z' : slot === 1 ? 'neetcode-ml' : 'huyen-interviews';
  return 'huyen-interviews';
}
