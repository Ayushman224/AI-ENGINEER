import { RES } from './resources';
import type { QA } from './types';

/** 2026 production topics woven into specific weeks: one concrete task per week + an attached interview question. */
export interface ModernTopic {
  id: string;
  title: string;
  phaseLabel: string;
  weeks: [number, number];
  summary: string;
  res: string[];
  iq: QA;
  tasks: Record<number, string>;
}

export const MODERN: ModernTopic[] = [
  {
    id: 'vision-rag',
    title: 'Multimodal Document Parsing & Vision-RAG',
    phaseLabel: 'Phase 2 · RAG',
    weeks: [9, 12],
    summary: 'Parse layout-heavy PDFs, tables and diagrams with Docling / PyMuPDF and caption figures with a VLM before embedding, so retrieval sees structure instead of garbled text.',
    res: ['docling', 'pymupdf', 'rag-techniques'],
    iq: {
      q: 'Why does naive text chunking fail on enterprise PDFs, and how do you architect a Vision-RAG / layout-aware ingestion pipeline?',
      a: 'Naive extraction flattens multi-column layouts, splits tables across chunks, drops headers/footers context, and ignores charts/diagrams entirely — so key facts never get embedded or get embedded as noise. Pipeline: (1) layout parsing (Docling/PyMuPDF) into typed elements — headings, paragraphs, tables, figures — with page & bbox metadata; (2) tables → Markdown/HTML with captions, kept whole; (3) figures/diagrams → VLM captions (or page-image embeddings, ColPali-style) stored with a link to the image; (4) structural chunking by section path; (5) embed text + captions, keep page images for citation; (6) hybrid retrieval + rerank; (7) eval with questions that require tables and figures. Trade-offs: VLM captioning cost/latency at ingest, so cache and only caption figure regions.',
    },
    tasks: {
      9: 'Parse 5 layout-heavy PDFs with PyMuPDF vs Docling; compare text order, tables and lost content side by side.',
      10: 'Convert tables to Markdown with captions and keep each table as one chunk with its section-path metadata.',
      11: 'Caption figures/diagrams with a vision-language model; embed captions alongside text and store page images for citations.',
      12: 'Add 10 table/figure questions to your golden set; measure Recall@5 before vs after layout-aware ingestion.',
    },
  },
  {
    id: 'typed-agents',
    title: 'Type-Safe Python Agent SDKs (PydanticAI & OpenAI Agents SDK)',
    phaseLabel: 'Phase 3 · Agents',
    weeks: [13, 16],
    summary: 'Build agents with typed structured outputs, dependency injection, handoffs and OpenTelemetry tracing — and learn when a light SDK beats a graph framework like LangGraph.',
    res: ['pydantic-ai', 'openai-agents', 'otel-python', 'genai-agents'],
    iq: {
      q: 'When would you choose a lightweight typed agent SDK like PydanticAI or OpenAI Agents SDK over a heavy graph framework?',
      a: 'Choose a light typed SDK when the flow is mostly a single agent (or simple handoffs) calling tools with validated, typed outputs; you want plain Python control flow, dependency injection for testability, fast iteration and little framework lock-in; and tracing via OpenTelemetry is enough. Choose a graph framework (LangGraph) when you need explicit multi-step state machines, durable checkpoints/resume, long-running human-in-the-loop interrupts, complex branching/cycles, or time-travel debugging. Many teams combine them: typed agents as nodes inside a graph. Decide by: state/persistence needs, branching complexity, team familiarity, and observability requirements.',
    },
    tasks: {
      13: 'Rebuild your raw tool-calling agent in PydanticAI with a typed result model and dependency-injected DB client.',
      14: 'Build the same 2-agent triage → specialist flow with OpenAI Agents SDK handoffs; compare code size and control with LangGraph.',
      15: 'Add OpenTelemetry tracing to the typed agent and connect it to an MCP server; inspect spans for each tool call.',
      16: 'Add guardrails (input/output validation) in the SDK and write a one-page “SDK vs LangGraph” decision note.',
    },
  },
  {
    id: 'retrieval-debugging',
    title: 'Retrieval-First Debugging & Grounding Discipline',
    phaseLabel: 'Phase 5 · Evals',
    weeks: [21, 24],
    summary: 'Diagnose hallucinations by inspecting retrieved chunks first; fix chunking, reranking and metadata filters; enforce abstention and citations; gate PRs with regression evals.',
    res: ['rag-techniques', 'ragas', 'langfuse', 'eugeneyan-evals'],
    iq: {
      q: 'Your production RAG bot is hallucinating — walk me through your exact debugging order before touching model temperature.',
      a: '1) Reproduce with traces: pull the exact query, retrieved chunks, prompt and answer. 2) Retrieval check: is the answer-bearing chunk in top-k at all? (Recall@k on similar golden queries.) If not → fix ingestion/chunking, embeddings, hybrid search, query rewriting, metadata/ACL filters. 3) Ranking check: present but ranked low or cut by the context budget → reranker, k, context packing order. 4) Context quality: stale/duplicated/conflicting docs → dedup, freshness, source priority. 5) Generation grounding: context correct but answer unsupported → stricter grounding prompt, required citations, abstain when evidence is missing, faithfulness judge. 6) Add the failing case to the regression set and gate PRs on it. Temperature is last — it rarely causes factual hallucination when retrieval is wrong.',
    },
    tasks: {
      21: 'Take 20 failing answers from Project 1 and label each as retrieval miss, ranking miss, bad context, or generation error.',
      22: 'Build a “retrieval inspector” script that prints top-k chunks, scores and metadata for any query in the trace.',
      23: 'Enforce abstention + mandatory citations; measure faithfulness and the abstain rate on unanswerable questions.',
      24: 'Add every fixed hallucination as a regression case and make the CI eval gate fail when any of them regresses.',
    },
  },
  {
    id: 'reasoning-routing',
    title: 'Reasoning Models & Test-Time Compute Trade-Offs',
    phaseLabel: 'Phase 6 · Inference & System Design',
    weeks: [25, 28],
    summary: 'Route simple extraction/classification to fast non-reasoning models and reserve reasoning models with capped thinking budgets for multi-step planning — cutting p95 latency and cost by 60–80%.',
    res: ['extended-thinking', 'ai-sd', 'genai-agents'],
    iq: {
      q: 'How do you decide when to use a reasoning model versus a fast standard model in a latency- and cost-sensitive production system?',
      a: 'Segment traffic by task type and measure. Fast models for extraction, classification, short-form RAG answers and formatting — they meet quality with low TTFT and cost. Reasoning models for multi-step planning, math/code, ambiguous multi-hop questions and agent planning where accuracy gains justify extra tokens. Implement a router (rules → small classifier → confidence/validation-based escalation), cap thinking budgets per route, stream partial output, cache, and set timeouts with fallback. Validate with a quality-vs-cost/latency curve on an eval set per route; monitor p95 latency, $/request and escalation rate. Typical outcome: most traffic stays on the fast path, cutting p95 and spend by 60–80% with no quality loss.',
    },
    tasks: {
      25: 'Label 100 real queries by type (extraction, classification, RAG answer, multi-step planning) and estimate each route’s volume.',
      26: 'Benchmark a fast model vs a reasoning model on each type: accuracy, TTFT, p95 latency and $/request.',
      27: 'Experiment with thinking budgets (low/medium/high) on planning tasks; chart quality vs latency vs cost.',
      28: 'Ship a router in your Project 4 gateway that escalates to the reasoning model only when needed; report p95 and cost savings.',
    },
  },
];

export const modernForWeek = (w: number) => MODERN.find((m) => w >= m.weeks[0] && w <= m.weeks[1]);
export const modernKey = (w: number) => `${w}:modern`;

if (import.meta.env.DEV) {
  MODERN.flatMap((m) => m.res).forEach((id) => !RES[id] && console.error(`Modern topic references unknown resource “${id}”`));
}

/** Reference cookbooks — bookmarks only, never counted against daily hours. */
export const COOKBOOKS = [
  { title: 'RAG Techniques Cookbook', tag: '42+ runnable notebooks', url: 'https://github.com/NirDiamant/RAG_Techniques', desc: 'Proposition chunking, hybrid fusion retrieval, query rewriting, Self-RAG and reranking.' },
  { title: 'GenAI Agents Cookbook', tag: '60+ implementations', url: 'https://github.com/NirDiamant/GenAI_Agents', desc: 'Reflection, plan-and-execute, tool design, thinking budgets and multi-agent loops.' },
  { title: 'PydanticAI', tag: 'Typed Python agent SDK', url: 'https://github.com/pydantic/pydantic-ai', desc: 'Type-safe structured outputs, dependency injection, MCP and OpenTelemetry tracing.' },
  { title: 'OpenAI Agents Python SDK', tag: 'Lightweight multi-agent', url: 'https://github.com/openai/openai-agents-python', desc: 'Multi-agent handoffs, guardrails, sessions and sandbox execution.' },
  { title: 'AI Roadmap 2026 Reference Notes', tag: 'Markdown notes', url: 'https://github.com/h9-tec/ai-roadmap-2026', desc: 'Concise notes across Foundations, LLM Engineering, Agents, Evals and LLMOps.' },
  { title: 'LLMs From Scratch', tag: 'Code-along', url: 'https://github.com/rasbt/LLMs-from-scratch', desc: 'Step-by-step PyTorch decoder Transformer implementation.' },
  { title: 'AI Engineering Book Resources (Chip Huyen)', tag: 'Production notes', url: 'https://github.com/chiphuyen/aie-book', desc: 'Production AI architecture, dataset engineering and evaluation notes.' },
  { title: 'Production AI Engineer Interview Q&A', tag: 'Interview prep', url: 'https://productionaiengineer.com/blog/ai-engineer-interview-questions', desc: 'Real RAG, chunking and debugging interview questions with strong vs weak answers.' },
];
