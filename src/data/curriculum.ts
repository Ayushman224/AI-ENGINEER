import type { Phase, Project, Week } from './types';
import { RES } from './resources';
import { WEEKS_P1 } from './weeks1';
import { WEEKS_P2_4 } from './weeks2';
import { WEEKS_P5_7 } from './weeks3';

export const PHASES: Phase[] = [
  {
    n: 1, title: 'Math Intuition, Classical ML, PyTorch & Transformers From Scratch', short: 'Foundations', weeks: [1, 8], color: '#a78bfa',
    topics: ['Linear algebra & calculus intuition', 'Probability, MLE & cross-entropy', 'Classical ML & evaluation', 'Backprop & PyTorch', 'Tokenization & embeddings', 'Attention & transformers', 'Modern GPT from scratch'],
    resources: ['3b1b-la', 'statquest', 'cs229', 'fastai', 'karpathy', 'alammar', 'cs336', 'raschka', 'hf-llm', 'neetcode-ml', 'deepml'],
  },
  {
    n: 2, title: 'Production Hybrid RAG + FastAPI Backend + Docker Compose', short: 'RAG & Backend', weeks: [9, 12], color: '#60a5fa',
    topics: ['Semantic/structural chunking', 'BM25 + dense hybrid search', 'RRF', 'Cross-encoder reranking', 'Context engineering', 'FastAPI async/await', 'Pydantic', 'SSE streaming', 'Redis caching', 'Postgres + pgvector', 'Multi-stage Dockerfiles', 'Docker Compose'],
    resources: ['dlai-rag', 'dlai-short', 'llm-zoomcamp', 'applied-llms', 'fastapi', 'nana-docker', 'docker-path'],
  },
  {
    n: 3, title: 'Agentic Workflows, MCP + OWASP AI & Agentic Security', short: 'Agents & Security', weeks: [13, 16], color: '#34d399',
    topics: ['Workflows vs autonomous agents', 'LangGraph state/checkpoints', 'Tool calling', 'Structured outputs', 'MCP clients/servers', 'Human-in-the-loop approvals', 'OWASP LLM & Agentic Top 10', 'PII redaction', 'Excessive agency', 'Vector RBAC/ACLs', 'Docker sandboxing'],
    resources: ['anthropic-agents', 'anthropic-cookbook', 'lc-academy', 'hf-agents', 'hf-mcp', 'owasp-llm', 'owasp-agentic', 'docker-learn'],
  },
  {
    n: 4, title: 'Post-Training, Fine-Tuning & Alignment', short: 'Fine-Tuning', weeks: [17, 20], color: '#f472b6',
    topics: ['Fine-tune vs RAG', 'Dataset curation', 'Synthetic data', 'SFT', 'LoRA/QLoRA', 'DPO', 'GRPO', 'Quantization (GGUF/AWQ/GPTQ)'],
    resources: ['labonne', 'trl', 'unsloth', 'aie-book'],
  },
  {
    n: 5, title: 'Evals, Observability + GitHub Actions CI/CD', short: 'Evals & CI/CD', weeks: [21, 24], color: '#fbbf24',
    topics: ['Code evaluators', 'LLM-as-a-Judge', 'Ragas: faithfulness, context precision, relevancy', 'Langfuse tracing', 'Prompt versioning', 'Latency/cost dashboards', 'GitHub Actions CI eval gates'],
    resources: ['eugeneyan-evals', 'langfuse', 'langfuse-ragas', 'mlops-zoomcamp', 'fsdl'],
  },
  {
    n: 6, title: 'AWS Cloud Deployment, vLLM Inference & AI System Design', short: 'Cloud & Inference', weeks: [25, 28], color: '#fb923c',
    topics: ['IAM least privilege', 'S3, ECR', 'ECS Fargate / App Runner', 'EC2 GPU instances', 'Amazon Bedrock', 'Secrets Manager, CloudWatch, Billing Alerts', 'vLLM PagedAttention', 'KV cache math', 'TTFT vs ITL', 'Semantic caching', 'Model routing'],
    resources: ['aws-essentials', 'aws-genai', 'bedrock-kb', 'vllm', 'openai-vllm', 'ai-sd'],
  },
  {
    n: 7, title: 'Portfolio Hardening, Calibration Applications & Interview Blitz', short: 'Portfolio & Interviews', weeks: [29, 40], color: '#22d3ee',
    topics: ['Polish top 3 repos with eval scorecards & load tests', 'Apply at Month 8.5 for calibration', 'Daily NeetCode 150 + ML-from-scratch', '3×/week whiteboard AI system design', 'Mock interviews'],
    resources: ['neetcode', 'deepml-timed', 'huyen-interviews'],
  },
];

export const WEEKS: Week[] = [...WEEKS_P1, ...WEEKS_P2_4, ...WEEKS_P5_7].sort((a, b) => a.n - b.n);

if (import.meta.env.DEV) {
  if (WEEKS.length !== 40) console.error(`Curriculum has ${WEEKS.length} weeks, expected 40`);
  WEEKS.forEach((w) =>
    w.days.forEach((d) =>
      d.res.forEach((id) => {
        if (!RES[id]) console.error(`Week ${w.n} “${d.title}” references unknown resource “${id}”`);
      })
    )
  );
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Production Hybrid RAG Engine + FastAPI + Docker + Langfuse/Ragas CI Eval Gate',
    pitch: 'Hybrid BM25 + pgvector retrieval with RRF and cross-encoder reranking, served by async FastAPI with SSE streaming and Redis caching, containerized with Docker Compose, traced in Langfuse and protected by a Ragas eval gate in GitHub Actions.',
    steps: [
      'Pick a real document corpus and write 30+ golden Q/A pairs',
      'Structural chunking with heading-path metadata',
      'Postgres + pgvector schema with HNSW index',
      'BM25/full-text search + RRF fusion',
      'Cross-encoder reranking on top-N candidates',
      'Grounded prompt with citations and refusal',
      'FastAPI /ask (SSE streaming) + /ingest (background task)',
      'Redis response cache + rate limiting',
      'Multi-stage Dockerfile + docker compose (api, postgres, redis)',
      'Langfuse tracing + prompt versioning',
      'Ragas + Recall@5/MRR eval suite with scorecard',
      'GitHub Actions: tests + eval gate thresholds',
      'Deploy to AWS (App Runner/ECS) with live demo URL',
      'README: architecture diagram, scorecard, load test, demo GIF',
    ],
    metrics: [
      { key: 'recall5', label: 'Recall@5', unit: '%', hint: 'from golden set' },
      { key: 'faith', label: 'Faithfulness', unit: '0–1', hint: 'Ragas' },
      { key: 'halluc', label: 'Hallucination rate', unit: '%', hint: 'judge-flagged unsupported claims' },
      { key: 'p95', label: 'p95 latency', unit: 's', hint: 'end-to-end' },
      { key: 'ttft', label: 'p95 TTFT', unit: 's', hint: 'streaming first token' },
      { key: 'cost', label: '$ / 1k requests', unit: '$', hint: 'measured tokens × price' },
    ],
  },
  {
    id: 2,
    title: 'Stateful Multi-Agent Ops Workflow (LangGraph + Custom MCP Servers + OWASP Security Controls)',
    pitch: 'A LangGraph workflow (e.g. incident triage or invoice processing) with persistent checkpoints, human approvals, custom MCP servers for internal data, and OWASP-aligned controls: PII redaction, least-privilege tools, ACL-filtered retrieval and Docker-sandboxed execution.',
    steps: [
      'Choose an ops process and map it to a workflow graph',
      'LangGraph StateGraph with typed state and conditional edges',
      'Postgres/SQLite checkpointer + resume by thread',
      'Human-in-the-loop interrupt before write actions',
      'MCP server #1 (e.g. ticket DB) with validated tools',
      'MCP server #2 (e.g. docs search) with auth',
      'PII redaction middleware for prompts and traces',
      'Tool allowlists + per-user scoped credentials',
      'ACL-filtered retrieval',
      'Docker sandbox for code/tool execution',
      'Scenario eval suite (task success, safety violations)',
      'Threat model + README with architecture diagram',
    ],
    metrics: [
      { key: 'success', label: 'Task success rate', unit: '%', hint: 'scenario suite' },
      { key: 'inject', label: 'Injection attacks blocked', unit: '%', hint: 'red-team set' },
      { key: 'steps', label: 'Avg steps / task', unit: '#', hint: 'efficiency' },
      { key: 'p95', label: 'p95 task latency', unit: 's', hint: 'excluding human wait' },
      { key: 'cost', label: '$ / task', unit: '$', hint: 'LLM + infra' },
    ],
  },
  {
    id: 3,
    title: 'Domain Fine-Tuned Small Model (3B–8B Unsloth/QLoRA/DPO) vs Frontier API Benchmark',
    pitch: 'A domain task dataset (real + synthetic, deduped and decontaminated), QLoRA SFT with Unsloth, DPO preference tuning, quantized GGUF/AWQ exports, and an honest benchmark versus a frontier API on accuracy, latency and $/1k requests.',
    steps: [
      'Define task + success metric; write decision memo (why fine-tune)',
      'Build 2–5k example dataset (real + synthetic)',
      'Dedup + decontaminate against 200-example eval set',
      'Baseline: base model + frontier API on eval set',
      'QLoRA SFT with Unsloth; track loss',
      'Hyperparameter comparison (2–3 runs)',
      'Preference pairs + DPO run',
      'Merge adapters; export GGUF + AWQ',
      'Serve with vLLM; measure latency/throughput',
      'Benchmark table vs frontier API',
      'Model card + publish adapters on Hugging Face',
    ],
    metrics: [
      { key: 'acc', label: 'Task accuracy / F1', unit: '%', hint: 'held-out eval' },
      { key: 'frontier', label: 'Frontier API accuracy', unit: '%', hint: 'same eval set' },
      { key: 'valid', label: 'Format validity', unit: '%', hint: 'schema pass rate' },
      { key: 'p95', label: 'p95 latency', unit: 's', hint: 'self-hosted' },
      { key: 'cost', label: '$ / 1k requests', unit: '$', hint: 'GPU cost ÷ throughput' },
    ],
  },
  {
    id: 4,
    title: 'Self-Hosted vLLM Inference Gateway + Smart Model Router + AWS ECS Deployment + Load Test',
    pitch: 'An OpenAI-compatible gateway in front of vLLM and a frontier API with difficulty-based routing, semantic caching, retries/fallbacks/circuit breakers, per-team quotas and cost attribution — deployed on AWS and load-tested.',
    steps: [
      'Serve a quantized model with vLLM in Docker',
      'Benchmark TTFT / ITL / throughput at 1, 8, 32 users',
      'FastAPI OpenAI-compatible gateway',
      'Difficulty router (rules → classifier)',
      'Semantic cache with tuned threshold',
      'Retries with jitter, timeouts, circuit breaker, fallbacks',
      'Per-team API keys, quotas and cost attribution',
      'Tracing + latency/cost dashboard',
      'Deploy on AWS ECS (GPU EC2 or Fargate + external GPU)',
      'Locust load test + capacity report',
      'README with quality-vs-cost routing curve',
    ],
    metrics: [
      { key: 'ttft', label: 'p95 TTFT', unit: 's', hint: 'at target concurrency' },
      { key: 'itl', label: 'Mean ITL', unit: 'ms', hint: 'decode speed' },
      { key: 'tput', label: 'Throughput', unit: 'tok/s', hint: 'sustained' },
      { key: 'hit', label: 'Cache hit rate', unit: '%', hint: 'semantic cache' },
      { key: 'savings', label: 'Cost savings vs all-frontier', unit: '%', hint: 'routing' },
      { key: 'cost', label: '$ / 1k requests', unit: '$', hint: 'blended' },
    ],
  },
  {
    id: 5,
    title: 'Modern Decoder Transformer From Scratch in PyTorch (RoPE, RMSNorm, SwiGLU, GQA, KV Cache)',
    pitch: 'A clean, tested decoder-only transformer implementing modern components, trained on TinyStories/TinyShakespeare, with KV-cache generation, sampling strategies and a write-up explaining every design choice.',
    steps: [
      'BPE tokenizer (own or tiktoken) + data pipeline',
      'Token embeddings + RoPE',
      'Causal multi-head attention → GQA',
      'RMSNorm + SwiGLU FFN + pre-norm block',
      'Training loop with AdamW, warmup, cosine schedule, grad clipping',
      'Train/val loss curves + checkpoints',
      'KV-cache generation + speed benchmark',
      'Temperature / top-k / top-p sampling',
      'Unit tests: shapes, causality, cache equivalence',
      'README: architecture diagram + design write-up',
    ],
    metrics: [
      { key: 'params', label: 'Parameters', unit: 'M', hint: 'model size' },
      { key: 'valloss', label: 'Val loss', unit: 'nats', hint: 'final' },
      { key: 'ppl', label: 'Val perplexity', unit: '', hint: 'exp(val loss)' },
      { key: 'speedup', label: 'KV-cache speedup', unit: '×', hint: 'tokens/s vs no cache' },
    ],
  },
];
