/** Scannable interview reference cards (rendered with the mini-Markdown renderer: `code`, **bold**). */
export interface CheatSheet {
  id: string;
  title: string;
  blurb: string;
  sections: { h: string; items: string[] }[];
}

export const CHEATSHEETS: CheatSheet[] = [
  {
    id: 'mem',
    title: 'Transformer & GPU Memory Math',
    blurb: 'Shapes, parameter memory, KV-cache VRAM, and why prefill and decode bottleneck differently.',
    sections: [
      {
        h: 'Attention shapes',
        items: [
          'Input `x: (B, T, d_model)` → Q, K, V projections → split heads → `(B, H, T, d_k)` with `d_k = d_model / H`',
          'Scores `Q @ Kᵀ / √d_k → (B, H, T, T)`; add causal mask (−∞ above diagonal) **before** softmax',
          '`softmax(scores) @ V → (B, H, T, d_k)` → transpose + reshape → `(B, T, d_model)` → output projection `W_O`',
          'GQA: K, V have `H_kv < H` heads, each shared by `H / H_kv` query heads',
          'Cost per layer: attention `O(T² · d)` compute, `O(T²)` scores memory (unless FlashAttention)',
        ],
      },
      {
        h: 'Parameter memory',
        items: [
          'Per block ≈ `12 · d²` params (4d² attention + 8d² FFN with 4× hidden); total ≈ `12 · L · d² + V · d`',
          'Weights VRAM = `params × bytes`: fp32 4 · bf16/fp16 2 · int8 1 · int4 ≈ 0.5 bytes',
          'Examples: 7B bf16 ≈ **14 GB**, 8B bf16 ≈ **16 GB**, 8B int4 ≈ **4–5 GB**, 70B bf16 ≈ **140 GB**',
          'Full fine-tune with AdamW (mixed precision) ≈ **16 bytes/param** + activations → 7B ≈ 112 GB+',
          'QLoRA: 4-bit frozen base + small bf16 adapters → 8B fits in ~10–16 GB',
        ],
      },
      {
        h: 'KV-cache VRAM',
        items: [
          '`KV bytes = 2 × L × H_kv × d_head × T × B × bytes_per_value` (2 = K and V)',
          'Llama-3-8B (L=32, H_kv=8, d_head=128, bf16): `2·32·8·128·2 = 131,072 B` ≈ **128 KB / token** → 8k tokens ≈ **1 GB / sequence**',
          'Max concurrent sequences ≈ `(VRAM − weights − overhead) / KV per sequence`',
          'Levers: GQA/MQA, KV-cache quantization (fp8), shorter max context, PagedAttention (no fragmentation), prefix caching',
        ],
      },
      {
        h: 'Latency: prefill vs decode',
        items: [
          '**Prefill** processes the whole prompt in parallel → big matmuls → **compute-bound** → drives **TTFT**',
          '**Decode** emits one token per step, re-reading all weights + KV → **memory-bandwidth-bound** → drives **ITL / TPOT**',
          '`TTFT = queueing + prefill`; `end-to-end ≈ TTFT + ITL × (output_tokens − 1)`',
          'Batching raises decode throughput (weights read once for many sequences) but can raise TTFT via queueing',
          'Fixes: TTFT → prefix caching, chunked prefill, shorter prompts, more replicas · ITL → quantization, speculative decoding, smaller model',
        ],
      },
    ],
  },
  {
    id: 'rag',
    title: 'Production RAG Debugging Checklist',
    blurb: 'Debug retrieval first, generation last. Never touch temperature first.',
    sections: [
      {
        h: 'Step-by-step order',
        items: [
          '**0 · Reproduce from the trace:** exact query, rewritten query, retrieved chunk ids + scores, final prompt, answer',
          '**1 · Chunk inspection:** is the answer in the corpus at all? Is it split across chunks, a broken table, or lost in parsing (PDF layout)?',
          '**2 · Hybrid retrieval (BM25 + dense):** is the gold chunk in top-k? Check Recall@k on similar golden queries; add BM25 for IDs/codes, fuse with RRF',
          '**3 · Reranker:** gold chunk retrieved but ranked low or cut? Tune candidate N, reranker model, final k and context packing order',
          '**4 · Metadata / RBAC filters:** are filters (tenant, date, ACL groups) wrongly excluding the right chunk — or leaking forbidden ones?',
          '**5 · Citation & abstention prompt:** context correct but answer unsupported → require citations per claim, allow “I don’t know”, check citation ids exist',
          '**6 · Ragas CI gate:** add the case to the golden set; gate PRs on faithfulness, context precision/recall and Recall@k',
        ],
      },
      {
        h: 'What each metric tells you',
        items: [
          'Low **context recall** → chunking, embeddings, query rewriting, hybrid search',
          'Low **context precision** (recall OK) → reranker, filters, smaller k',
          'Low **faithfulness** (context OK) → grounding prompt, citations, abstention, model choice',
          'Low **answer relevancy** → query understanding, prompt instructions, follow-up rewriting',
        ],
      },
    ],
  },
  {
    id: 'sec',
    title: 'OWASP LLM & Agentic Security Checklist',
    blurb: 'Architectural controls — no prompt is a security boundary.',
    sections: [
      {
        h: 'Prompt injection (direct & indirect)',
        items: [
          'Treat retrieved docs, web pages, emails and tool outputs as **untrusted data**, never instructions',
          'Untrusted content must never directly trigger privileged/irreversible actions',
          'Keep a red-team suite of injection attempts and run it in CI on every prompt/model/tool change',
        ],
      },
      {
        h: 'PII redaction & output handling',
        items: [
          'Redact PII before vendors, logs, traces and vector stores; reversible placeholders per request',
          'Treat LLM output as untrusted: escape HTML, sanitize Markdown, parameterize SQL, validate URLs',
        ],
      },
      {
        h: 'Least-privilege tool scopes',
        items: [
          'Classify every tool: **read / write / irreversible**',
          'Scoped, short-lived credentials per user/task; read-only by default; allowlisted operations',
          'Rate, step and spend limits; audit log every tool call (user, args hash, result, trace id)',
          'Vet third-party MCP servers — tool descriptions can be poisoned',
        ],
      },
      {
        h: 'Human-in-the-loop gates',
        items: [
          'Require approval for payments, external messages, deletions, permission changes, deploys',
          'Show exactly what will happen (recipient, amount, diff); support approve / edit / reject; log decisions',
        ],
      },
      {
        h: 'Docker sandboxing & data isolation',
        items: [
          '`docker run --network none --read-only --memory 512m --cpus 1 --user 1000 --cap-drop ALL --security-opt no-new-privileges`',
          'Ephemeral container per run, wall-clock timeout, only stdout/stderr returned',
          'Vector RBAC: pre-filter by ACL/tenant inside the query; test cross-tenant retrieval returns nothing',
        ],
      },
    ],
  },
  {
    id: 'sd',
    title: 'AI System Design · 45-Minute Framework',
    blurb: 'Requirements & SLOs → Data & Retrieval → Orchestration → Guardrails & Evals → Deployment & Caching.',
    sections: [
      {
        h: '0–7 min · Requirements & SLOs',
        items: [
          'Users, use cases, QPS/peak, data size & freshness, compliance/PII',
          'SLOs: **p95 latency / TTFT**, **cost per request** budget, **accuracy** target and how it’s measured',
          'Back-of-envelope: tokens/request × requests/day → tokens/day → $/day; GPUs needed if self-hosting',
        ],
      },
      {
        h: '7–17 min · Data & Retrieval',
        items: [
          'Ingestion: parsing (layout-aware), chunking, embeddings, re-indexing/CDC, deletes',
          'Retrieval: hybrid BM25 + dense, RRF, reranker on top-N, metadata & ACL pre-filters',
          'Storage: Postgres+pgvector vs dedicated vector DB; multi-tenant isolation',
        ],
      },
      {
        h: '17–27 min · Model & Agent Orchestration',
        items: [
          'Workflow vs agent; tools, state, checkpoints, human approvals',
          'Model routing: fast model by default, reasoning model with capped thinking budget for hard tasks',
          'Structured outputs with validation + retries; fallbacks across providers',
        ],
      },
      {
        h: '27–37 min · Guardrails & Evals',
        items: [
          'Offline golden sets per component; LLM judges calibrated to humans; CI eval + security gates',
          'Online: tracing, feedback, judges on sampled traffic, drift and cost dashboards',
          'Guardrails: injection defenses, PII redaction, output validation, least privilege',
        ],
      },
      {
        h: '37–45 min · Deployment & Caching',
        items: [
          'Serving: API (ECS/App Runner) + vLLM on GPUs or managed (Bedrock); autoscaling; streaming',
          'Caching: exact + semantic (tuned threshold, tenant-scoped), prefix/KV caching',
          'Reliability: timeouts, retries with jitter, circuit breakers, rate limits, rollback',
          'Close with trade-offs, failure modes and what you’d build next',
        ],
      },
    ],
  },
];
