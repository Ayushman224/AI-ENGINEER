import type { DayBadge, DayPlan } from './types';

/**
 * Per-week stage label + concrete Day 5 (Fri revision gate), Day 6 (Sat build part 1)
 * and Day 7 (Sun build part 2 + evals + Weekly Mentor Report) plans.
 * Each plan: [task, resource ids, track].
 */
type P = [string, string, DayBadge?];
interface Row {
  stage: string;
  fri: P;
  sat: P;
  sun: P;
}

const S1 = 'Phase 1 — AI Core: Math, ML, PyTorch & Transformers';
const S2A = 'Phase 2A — AI Core + Backend';
const S2B = 'Phase 2B — Context Engineering + Docker';
const S3A = 'Phase 3A — AI Core: Agents & MCP';
const S3B = 'Phase 3B — Security After Agents';
const S4 = 'Phase 4 — AI Core: Fine-Tuning & Alignment';
const S5A = 'Phase 5A — AI Core: Evals & Observability';
const S5B = 'Phase 5B — CI/CD After Evals';
const S6 = 'Phase 6 — vLLM Inference + AWS Cloud';
const S7 = 'Phase 7 — Portfolio Polish & Interview Blitz';

const ROWS: Record<number, Row> = {
  1: { stage: S1,
    fri: ['Re-implement Cosine Similarity and Matrix Multiplication cold without looking at notes; answer the 3 cold-recall questions.', 'deepml neetcode-ml'],
    sat: ['Mini-Project Part 1 — Build a pure-NumPy Semantic Vector Search Engine from scratch (batch cosine similarity, top-k retrieval, input validation).', 'numpy-quickstart'],
    sun: ['Mini-Project Part 2 — Benchmark vectorized NumPy search vs Python loops across 10,000 vectors, write pytest unit tests, push to GitHub, and copy your Weekly Mentor Report.', 'pytest numpy-quickstart'] },
  2: { stage: S1,
    fri: ['Re-derive the chain rule on a 3-node computation graph and re-implement stable softmax + cross-entropy cold; answer the cold-recall questions.', 'deepml'],
    sat: ['Mini-Project Part 1 — Implement gradient descent from scratch to fit y = 3x² − 2x + 1 with noise, with a fully vectorized gradient.', 'statquest numpy-quickstart'],
    sun: ['Mini-Project Part 2 — Plot loss curves for 4 learning rates, explain divergence vs slow convergence in the README, add pytest checks, push, and copy your Weekly Mentor Report.', 'statquest pytest'] },
  3: { stage: S1,
    fri: ['Re-implement the logistic-regression gradient and precision/recall/F1 cold; answer the cold-recall questions.', 'deepml'],
    sat: ['Mini-Project Part 1 — Train logistic regression from scratch and with scikit-learn on a tabular dataset using a proper train/val/test split.', 'sklearn deepml'],
    sun: ['Mini-Project Part 2 — Report precision/recall at 5 thresholds, justify your chosen threshold, add tests, push, and copy your Weekly Mentor Report.', 'sklearn pytest'] },
  4: { stage: S1,
    fri: ['Re-implement k-means and a Gini-impurity split cold; answer the cold-recall questions.', 'deepml'],
    sat: ['Mini-Project Part 1 — Embed 2–5k text snippets and cluster them with your own NumPy k-means.', 'statquest numpy-quickstart'],
    sun: ['Mini-Project Part 2 — Name the clusters, visualize with your PCA, compare with sklearn KMeans, write up, push, and copy your Weekly Mentor Report.', 'sklearn'] },
  5: { stage: S1,
    fri: ['Re-implement micrograd’s Value.backward() for +, × and tanh cold; answer the cold-recall questions.', 'karpathy'],
    sat: ['Mini-Project Part 1 — Complete micrograd end-to-end: Value class, MLP, and training on a toy 2D dataset.', 'karpathy'],
    sun: ['Mini-Project Part 2 — Port the MLP to PyTorch, verify gradients match, train with AdamW and early stopping, push, and copy your Weekly Mentor Report.', 'pytorch-tut'] },
  6: { stage: S1,
    fri: ['Re-implement the BPE merge step and the bigram negative log-likelihood cold; answer the cold-recall questions.', 'karpathy'],
    sat: ['Mini-Project Part 1 — Train a BPE tokenizer on a text corpus following Karpathy’s “Let’s build the GPT Tokenizer”.', 'karpathy'],
    sun: ['Mini-Project Part 2 — Compare token counts vs tiktoken for English, code and Hindi; document the cost implications, push, and copy your Weekly Mentor Report.', 'hf-llm'] },
  7: { stage: S1,
    fri: ['Re-implement scaled dot-product attention with a causal mask cold; answer the cold-recall questions.', 'deepml'],
    sat: ['Mini-Project Part 1 — Code one pre-norm transformer block (multi-head attention + FFN + residuals) in PyTorch.', 'alammar raschka'],
    sun: ['Mini-Project Part 2 — Unit-test shapes, causality and parameter counts; write annotated notes; push and copy your Weekly Mentor Report.', 'raschka pytest'] },
  8: { stage: S1,
    fri: ['Re-implement multi-head causal attention and top-p sampling cold; answer the cold-recall questions.', 'deepml'],
    sat: ['Project 5 Part 1 — Decoder-only transformer with RoPE, RMSNorm, SwiGLU and GQA; start training on TinyShakespeare.', 'karpathy cs336'],
    sun: ['Project 5 Part 2 — Add KV-cache generation, benchmark tokens/sec vs no cache, log loss curves and samples, push, and copy your Weekly Mentor Report.', 'raschka'] },

  9: { stage: S2A,
    fri: ['Re-implement RRF and a heading-based chunker cold; re-write the async FastAPI /search endpoint from memory; answer the cold-recall questions.', 'llm-zoomcamp fastapi'],
    sat: ['Project 1 v0 Part 1 — FastAPI `/search` over Postgres + pgvector with structural chunking and async inserts.', 'fastapi pgvector', 'backend'],
    sun: ['Project 1 v0 Part 2 — Add BM25 + RRF hybrid retrieval, write 30 golden Q/A pairs, measure Recall@5, push, and copy your Weekly Mentor Report.', 'llm-zoomcamp', 'ai'] },
  10: { stage: S2A,
    fri: ['Re-implement an SSE streaming endpoint and a Redis cache-key function cold; answer the cold-recall questions.', 'fastapi redis'],
    sat: ['Project 1 v1 Part 1 — Add cross-encoder reranking and Vision-RAG ingestion (Docling tables + figure captions).', 'docling dlai-rag', 'ai'],
    sun: ['Project 1 v1 Part 2 — Serve it via FastAPI with Pydantic models, SSE `/ask` and Redis caching; compare Recall@5 before vs after; push and copy your Weekly Mentor Report.', 'fastapi redis', 'backend'] },
  11: { stage: S2B,
    fri: ['Re-write a multi-stage Dockerfile and a citation-checking function cold; answer the cold-recall questions.', 'docker-path'],
    sat: ['Project 1 Part 1 — Containerize the API with a multi-stage Dockerfile and a strict .dockerignore; verify the image runs non-root.', 'docker-path docker-dockerignore', 'docker'],
    sun: ['Project 1 Part 2 — Add grounded answers with citations + query rewriting; measure faithfulness on the golden set; push and copy your Weekly Mentor Report.', 'dlai-rag', 'ai'] },
  12: { stage: S2B,
    fri: ['Re-write a docker-compose.yml with healthchecks and the token-budget context packer cold; answer the cold-recall questions.', 'nana-docker'],
    sat: ['Project 1 Part 1 — Docker Compose: FastAPI + Postgres/pgvector + Redis with volumes and healthchecks — `docker compose up` runs everything.', 'nana-docker docker-path', 'docker'],
    sun: ['Project 1 Part 2 — Add context packing + conversation memory, a README quickstart and seeded demo corpus; push and copy your Weekly Mentor Report.', 'applied-llms', 'ai'] },

  13: { stage: S3A,
    fri: ['Re-implement the raw tool-calling loop and a LangGraph conditional edge cold; answer the cold-recall questions.', 'anthropic-cookbook'],
    sat: ['Build Part 1 — Implement routing, orchestrator-workers and evaluator-optimizer on one realistic task; compare cost, latency and quality.', 'anthropic-cookbook'],
    sun: ['Project 2 kickoff (Part 2) — Model your ops workflow in LangGraph with checkpoints and an approval step; push and copy your Weekly Mentor Report.', 'lc-academy'] },
  14: { stage: S3A,
    fri: ['Re-implement a FastMCP tool and a PydanticAI typed agent cold; answer the cold-recall questions.', 'hf-mcp pydantic-ai'],
    sat: ['Project 2 Part 1 — Build two custom MCP servers (ticket DB + docs search) and test them in the MCP inspector.', 'hf-mcp mcp-spec'],
    sun: ['Project 2 Part 2 — Connect them to your agent (LangGraph or PydanticAI) with tracing; write an “SDK vs graph” note; push and copy your Weekly Mentor Report.', 'pydantic-ai openai-agents'] },
  15: { stage: S3B,
    fri: ['Re-write the PII redaction function and the read/write/irreversible tool classification cold; answer the cold-recall questions.', 'owasp-llm'],
    sat: ['Project 2 Part 1 — Add PII redaction, tool allowlists and scoped credentials.', 'owasp-llm owasp-agentic', 'security'],
    sun: ['Project 2 Part 2 — Add human approval gates on write tools; run 10 injection attacks and document results; push and copy your Weekly Mentor Report.', 'owasp-agentic', 'security'] },
  16: { stage: S3B,
    fri: ['Re-write the ACL-filtered retrieval query and the sandbox `docker run` flags cold; answer the cold-recall questions.', 'owasp-agentic'],
    sat: ['Project 2 Part 1 — Add per-user vector ACL filters and a Docker-sandboxed code-execution tool.', 'pgvector docker-learn', 'security'],
    sun: ['Project 2 Part 2 — Write the threat model and a 20-attack red-team suite; record the pass rate; push and copy your Weekly Mentor Report.', 'owasp-llm owasp-agentic', 'security'] },

  17: { stage: S4,
    fri: ['Re-implement MinHash near-duplicate detection and the eval-overlap check cold; answer the cold-recall questions.', 'labonne'],
    sat: ['Project 3 Part 1 — Build a 2–5k example dataset (real + synthetic) for your domain task.', 'labonne'],
    sun: ['Project 3 Part 2 — Clean, dedup and decontaminate it; carve out a 200-example eval set; publish a data card; copy your Weekly Mentor Report.', 'aie-book'] },
  18: { stage: S4,
    fri: ['Re-implement a LoRA linear layer and the QLoRA memory estimate cold; answer the cold-recall questions.', 'labonne'],
    sat: ['Project 3 Part 1 — Run a QLoRA SFT of a 3B–8B model with Unsloth on your dataset.', 'unsloth'],
    sun: ['Project 3 Part 2 — Evaluate base vs SFT on the 200-example set and compare 2 hyperparameter runs; push and copy your Weekly Mentor Report.', 'trl'] },
  19: { stage: S4,
    fri: ['Re-implement the DPO loss and GRPO’s group-normalized advantage cold; answer the cold-recall questions.', 'trl'],
    sat: ['Project 3 Part 1 — Generate 300–1000 preference pairs by sampling + LLM judging.', 'labonne'],
    sun: ['Project 3 Part 2 — Run DPO on your SFT adapter; compare SFT vs SFT+DPO; push and copy your Weekly Mentor Report.', 'trl'] },
  20: { stage: S4,
    fri: ['Re-implement per-channel int8 quantization and the $/1k-requests formula cold; answer the cold-recall questions.', 'labonne'],
    sat: ['Project 3 Part 1 — Merge adapters, export GGUF and AWQ, and serve with vLLM.', 'labonne vllm'],
    sun: ['Project 3 Part 2 — Benchmark vs a frontier API (accuracy, latency, $/1k); publish the model card; push and copy your Weekly Mentor Report.', 'aie-book'] },

  21: { stage: S5A,
    fri: ['Re-write an LLM-as-judge rubric prompt and a Cohen’s kappa calculation cold; answer the cold-recall questions.', 'eugeneyan-evals'],
    sat: ['Evals Part 1 — Error analysis: review 50 Project 1 outputs and build a failure taxonomy.', 'eugeneyan-evals'],
    sun: ['Evals Part 2 — Implement 3 code evals + 1 LLM judge calibrated on 50 human labels; push and copy your Weekly Mentor Report.', 'eugeneyan-evals'] },
  22: { stage: S5A,
    fri: ['Re-implement Recall@k, MRR and the retrieval-inspector script cold; answer the cold-recall questions.', 'ragas'],
    sat: ['Project 1 Part 1 — Add Langfuse tracing and a Ragas suite (faithfulness, context precision/recall).', 'langfuse ragas'],
    sun: ['Project 1 Part 2 — Debug 20 hallucinations retrieval-first; enforce abstention + citations; publish the eval scorecard; copy your Weekly Mentor Report.', 'rag-techniques'] },
  23: { stage: S5B,
    fri: ['Re-write a GitHub Actions workflow with caching and a pytest dependency override cold; answer the cold-recall questions.', 'gh-actions'],
    sat: ['Project 1 Part 1 — GitHub Actions: lint, pytest with a mocked LLM, pip caching and environment secrets.', 'gh-actions pytest', 'cicd'],
    sun: ['Project 1 Part 2 — Latency/cost dashboard + online feedback scores in Langfuse; push and copy your Weekly Mentor Report.', 'langfuse', 'ai'] },
  24: { stage: S5B,
    fri: ['Re-write the eval-gate comparison script and the rollback command cold; answer the cold-recall questions.', 'gh-actions'],
    sat: ['Project 1 Part 1 — Make the LLM eval gate and the security regression suite required PR checks.', 'gh-actions langfuse-ragas', 'cicd'],
    sun: ['Project 1 Part 2 — Build & push the image by SHA; add staging/prod environments; show a red→green PR in the README; copy your Weekly Mentor Report.', 'gh-actions docker-path', 'cicd'] },

  25: { stage: S6,
    fri: ['Re-derive the KV-cache memory formula and write a least-privilege IAM policy cold; answer the cold-recall questions.', 'aws-essentials'],
    sat: ['AWS Part 1 — Secure account: MFA, IAM Identity Center admin, $20 budget + billing alerts, least-privilege roles.', 'aws-essentials', 'aws'],
    sun: ['Inference Part 2 — Notebook computing KV-cache sizes for 3 models and max concurrent users on a 24 GB GPU; push and copy your Weekly Mentor Report.', 'cs336', 'ai'] },
  26: { stage: S6,
    fri: ['Re-write a `vllm serve` command with key flags and a boto3 presigned-URL function cold; answer the cold-recall questions.', 'vllm'],
    sat: ['Project 4 Part 1 — Serve a quantized model with vLLM; benchmark TTFT/ITL at 1, 8 and 32 concurrent users.', 'vllm openai-vllm', 'ai'],
    sun: ['Project 4 Part 2 — Push images to ECR, store secrets in Secrets Manager, add CloudWatch logs + billing alarm; copy your Weekly Mentor Report.', 'aws-secrets aws-essentials', 'aws'] },
  27: { stage: S6,
    fri: ['Re-write a Bedrock Converse call and your fast-vs-reasoning routing rule cold; answer the cold-recall questions.', 'aws-genai'],
    sat: ['AWS Part 1 — Deploy the Project 1 API on ECS Fargate or App Runner with secrets and CloudWatch logs.', 'aws-genai', 'aws'],
    sun: ['AWS Part 2 — Run vLLM on an EC2 GPU spot instance, add a reasoning-vs-fast router to the gateway, then tear everything down; copy your Weekly Mentor Report.', 'vllm extended-thinking', 'aws'] },
  28: { stage: S6,
    fri: ['Re-implement a semantic-cache lookup and a circuit breaker cold; answer the cold-recall questions.', 'ai-sd'],
    sat: ['Project 4 Part 1 — Gateway: router + semantic cache + retries/fallbacks/circuit breaker.', 'ai-sd'],
    sun: ['Project 4 Part 2 — Locust load test; report p95, cache hit rate and $/1k requests; push and copy your Weekly Mentor Report.', 'vllm'] },

  29: { stage: S7,
    fri: ['Explain Project 1’s architecture from memory in 5 minutes on a whiteboard; answer the cold-recall questions.', 'ai-sd'],
    sat: ['Polish Part 1 — Projects 1 & 2: README, architecture diagram and eval scorecard.', 'eugeneyan-evals'],
    sun: ['Polish Part 2 — CI badges, demo GIF and one-command run for Projects 1 & 2; push and copy your Weekly Mentor Report.', 'gh-actions'] },
  30: { stage: S7,
    fri: ['Deliver your 60-second pitch and 3 quantified resume bullets from memory; answer the cold-recall questions.', 'huyen-interviews'],
    sat: ['Write Part 1 — Draft the technical blog post on Project 1 with real numbers and diagrams.', 'applied-llms'],
    sun: ['Write Part 2 — Publish it; update LinkedIn and your GitHub profile; pin the top 3 repos; copy your Weekly Mentor Report.', 'huyen-interviews'] },
  31: { stage: S7,
    fri: ['Re-solve 2 NeetCode problems you missed this week cold; answer the cold-recall questions.', 'neetcode'],
    sat: ['Timed Part 1 — 3 NeetCode problems (hashing, two pointers) at 25 minutes each, out loud.', 'neetcode'],
    sun: ['Timed Part 2 — 3 problems (sliding window, stack); log every miss for Friday; copy your Weekly Mentor Report.', 'neetcode'] },
  32: { stage: S7,
    fri: ['Re-solve 2 missed problems (binary search / trees) cold; answer the cold-recall questions.', 'neetcode'],
    sat: ['Timed Part 1 — 3 problems (binary search, linked lists) at 25 minutes each, out loud.', 'neetcode'],
    sun: ['Timed Part 2 — 3 problems (trees, heaps); re-solve last week’s misses; copy your Weekly Mentor Report.', 'neetcode'] },
  33: { stage: S7,
    fri: ['Re-solve 2 missed graph/DP problems cold; answer the cold-recall questions.', 'neetcode'],
    sat: ['Timed Part 1 — 3 problems (graphs, topological sort, 1-D DP) at 25 minutes each.', 'neetcode'],
    sun: ['Timed Part 2 — 3 problems (2-D DP, backtracking); write a one-page pattern cheat sheet from memory; copy your Weekly Mentor Report.', 'neetcode'] },
  34: { stage: S7,
    fri: ['Re-pitch your story and log gaps from any interviews so far; answer the cold-recall questions.', 'huyen-interviews'],
    sat: ['Apply Part 1 — Send 10–15 targeted applications and 5 referral requests.', 'huyen-interviews'],
    sun: ['Apply Part 2 — Do a full 4-hour mock take-home using your FastAPI + RAG + eval template; copy your Weekly Mentor Report.', 'fastapi llm-zoomcamp'] },
  35: { stage: S7,
    fri: ['Re-implement your 2 slowest Deep-ML problems cold; answer the cold-recall questions.', 'deepml-timed'],
    sat: ['ML coding Part 1 — 4 Deep-ML problems at 20 minutes each (attention, k-means, logistic regression, softmax).', 'deepml-timed'],
    sun: ['ML coding Part 2 — 4 more (metrics, backprop, Adam, KNN); re-implement the slowest cold; copy your Weekly Mentor Report.', 'deepml-timed neetcode-ml'] },
  36: { stage: S7,
    fri: ['Re-draw one canonical AI system design from memory in 30 minutes; answer the cold-recall questions.', 'ai-sd'],
    sat: ['Design Part 1 — Whiteboard enterprise RAG and the agent platform (45 minutes each); record yourself.', 'ai-sd'],
    sun: ['Design Part 2 — Whiteboard the LLM gateway and LLM search; review against the question bank; copy your Weekly Mentor Report.', 'ai-sd'] },
  37: { stage: S7,
    fri: ['Answer 20 rapid-fire ML/LLM theory questions out loud; answer the cold-recall questions.', 'huyen-interviews'],
    sat: ['Theory Part 1 — 90-minute self-quiz from Chip Huyen’s ML Interviews book; record your answers.', 'huyen-interviews'],
    sun: ['Theory Part 2 — Re-study every weak answer and re-record it; copy your Weekly Mentor Report.', 'huyen-interviews'] },
  38: { stage: S7,
    fri: ['Re-tell 2 STAR stories from memory with numbers; answer the cold-recall questions.', 'huyen-interviews'],
    sat: ['Behavioral Part 1 — Record two 10-minute project deep-dives (Projects 1 and 4).', 'eugeneyan-evals'],
    sun: ['Behavioral Part 2 — 30-minute behavioral mock with a friend or AI interviewer; review the recording; copy your Weekly Mentor Report.', 'huyen-interviews'] },
  39: { stage: S7,
    fri: ['Review mock feedback and re-solve the problem you failed in a mock; answer the cold-recall questions.', 'neetcode'],
    sat: ['Mock Part 1 — Full mock loop: coding + ML coding + system design + behavioral.', 'neetcode ai-sd'],
    sun: ['Mock Part 2 — Review recordings, list your top 5 fixes and drill them; copy your Weekly Mentor Report.', 'huyen-interviews'] },
  40: { stage: S7,
    fri: ['Clear every remaining item in the revision queue; answer the cold-recall questions.', 'huyen-interviews'],
    sat: ['Wrap-up Part 1 — Write your 10-month retrospective and a 30-60-90 day plan.', 'applied-llms'],
    sun: ['Wrap-up Part 2 — Export a final backup, archive/tag all repos, copy your final Mentor Report, and celebrate. 🎉', 'aie-book'] },
};

const plan = (title: string, [task, res, track]: P, fallback: DayBadge): DayPlan => ({ title, task, res: res.split(/\s+/).filter(Boolean), track: track ?? fallback });

/** Day title = the task's first clause, e.g. "Mini-Project Part 1 — Build a pure-NumPy Semantic Vector Search Engine from scratch". */
const titleOf = (task: string) => task.split(/ \(|; |, /)[0].replace(/[.;,]$/, '');

export function weeklyFor(w: number, phase: number) {
  const r = ROWS[w];
  const core: DayBadge = phase === 7 ? 'interview' : 'ai';
  return {
    stage: r.stage,
    fri: plan('Friday Revision Gate — zero new topics', r.fri, 'revision'),
    sat: plan(titleOf(r.sat[0]), r.sat, core),
    sun: plan(titleOf(r.sun[0]), r.sun, core),
  };
}
