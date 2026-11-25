import { WEEKS } from './curriculum';
import { RES } from './resources';

export type Track = 'ai' | 'backend' | 'docker' | 'aws' | 'secops';

export const TRACK_ORDER: Track[] = ['ai', 'backend', 'docker', 'aws', 'secops'];

export const TRACKS: Record<Track, { label: string; short: string; color: string; badge: string; windows: [number, number][] }> = {
  ai: { label: 'AI Core', short: 'AI', color: '#8b5cf6', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300', windows: [[1, 40]] },
  backend: { label: 'Backend', short: 'BE', color: '#10b981', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', windows: [[9, 12]] },
  docker: { label: 'Docker', short: 'DK', color: '#0ea5e9', badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300', windows: [[10, 15]] },
  aws: { label: 'AWS', short: 'AWS', color: '#f97316', badge: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300', windows: [[25, 28]] },
  secops: { label: 'Security & CI/CD', short: 'SEC', color: '#f43f5e', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300', windows: [[14, 16], [22, 24]] },
};

/** Which weekday carries each non-AI track's drill (AI Core is the main topic every day). */
export const TRACK_SLOT: Record<Exclude<Track, 'ai'>, number> = { backend: 0, docker: 1, secops: 2, aws: 3 };

export const isFocusWeek = (t: Track, w: number) => TRACKS[t].windows.some(([a, b]) => w >= a && w <= b);

export interface TrackTask {
  track: Track;
  week: number;
  task: string;
  res: string[];
  focus: boolean; // inside the track's focus window → a full session, not a 15–20 min drill
}

// [backend, docker, secops, aws] — each "task | space-separated resource ids"
type Row = [string, string, string, string];

const PLAN: Record<number, Row> = {
  // ── Phase 1: light ongoing drills (≈15–20 min inside the hands-on block) ──
  1: [
    'Read FastAPI’s “Python Types Intro” and add full type hints to your NumPy cosine-similarity function | fastapi',
    'Install Docker Desktop; run `hello-world`, then an interactive `python:3.12-slim` container and run NumPy inside it | nana-docker',
    'Create a GitHub repo for study code with a .gitignore that excludes .env and data/ — never commit API keys | gh-actions',
    'Create an AWS free-tier account, enable MFA on root and set a $10 Billing Alert before anything else | aws-essentials',
  ],
  2: [
    'Write a Pydantic model for an experiment config (lr, epochs, seed) and validate a JSON file with it | pydantic',
    'Containerize your gradient-descent script with a simple Dockerfile; mount an output volume for the plots | docker-path',
    'Add a GitHub Actions workflow that runs pytest on your math utilities on every push | gh-actions',
    'AWS Cloud Essentials modules 1–2: global infrastructure and the shared-responsibility model | aws-essentials',
  ],
  3: [
    'Expose your logistic regression as a FastAPI `POST /predict` endpoint with a Pydantic request schema | fastapi pydantic',
    'Write a .dockerignore (venv, data, .env, __pycache__) and compare build-context size before/after | docker-dockerignore',
    'Skim the OWASP Top 10 for LLM intro and note 3 risks you will defend against later | owasp-llm',
    'Cloud Essentials IAM module: create an IAM Identity Center admin user and stop using root | aws-essentials',
  ],
  4: [
    'Python async/await primer: call two slow mock services with `asyncio.gather` and measure the speedup | fastapi',
    'Run Postgres in Docker with a named persistent volume; load your tabular dataset with pandas | docker-path',
    'Add ruff + mypy steps to your GitHub Actions workflow and fail the build on errors | gh-actions',
    'Create an S3 bucket (Block Public Access ON) and upload a dataset with the AWS CLI | aws-essentials',
  ],
  5: [
    'Serve your PyTorch MLP from FastAPI; load the model once in the lifespan handler, not per request | fastapi',
    'Build a CPU PyTorch image; shrink it with python:3.12-slim and `pip --no-cache-dir`, record sizes | nana-docker',
    'Add a secret-scanning pre-commit hook (e.g. gitleaks) and run it in CI | gh-actions',
    'Cloud Essentials compute module: compare EC2, Lambda and Fargate in a one-page note | aws-essentials',
  ],
  6: [
    'Add `POST /tokenize` returning token ids + counts; reject empty input with a Pydantic validator (422) | fastapi pydantic',
    'Use Docker Compose to run Jupyter + Postgres together on one network | docker-path',
    'Read OWASP LLM “Sensitive Information Disclosure”: list where tokens/logs could leak user data | owasp-llm',
    'Upload model checkpoints to S3 with versioning enabled; practise restoring an older version | aws-essentials',
  ],
  7: [
    'Add an endpoint that returns a toy attention matrix as JSON (NumPy → list serialization) | fastapi',
    'Add a HEALTHCHECK and a non-root user to your model-serving image | docker-path',
    'Write unit tests asserting causal-mask correctness and run them in CI | gh-actions',
    'Look up EC2 GPU families (g5/g6) and on-demand prices; estimate a 10-hour training run | aws-essentials',
  ],
  8: [
    'Stream tokens from your GPT with Server-Sent Events (`StreamingResponse`) in FastAPI | fastapi',
    'Containerize your GPT inference service; mount checkpoints as a read-only volume | docker-path',
    'CI job: run a 50-step training smoke test to catch shape regressions on every PR | gh-actions',
    'Create an Amazon ECR repository and push your inference image (login → tag → push) | aws-essentials',
  ],

  // ── Phase 2: Backend focus (W9–12), Docker focus (W10–15) ──
  9: [
    'FOCUS — Postgres + pgvector: schema for documents/chunks with `vector(768)`, HNSW index, async inserts with asyncpg | pgvector fastapi',
    'Run the pgvector/pgvector image with a persistent named volume; prove data survives `docker compose down` | pgvector docker-path',
    'Keep the embedding API key in a git-ignored .env and GitHub Actions secrets — never hard-coded | gh-actions',
    'Read the Bedrock Managed KB RAG workshop overview; compare its managed chunking with yours | bedrock-kb',
  ],
  10: [
    'FOCUS — Microservices with FastAPI (part 1): split ingest and query services; Pydantic schemas for every request/response | fastapi-micro fastapi',
    'FOCUS — Multi-stage Dockerfile for the RAG API (builder → slim runtime) plus a strict .dockerignore | docker-path docker-dockerignore nana-docker',
    'Add unit tests for BM25 scoring and RRF fusion; run them in GitHub Actions | gh-actions',
    'Cloud Essentials databases module: Amazon RDS for Postgres vs self-managed pgvector | aws-essentials',
  ],
  11: [
    'FOCUS — SSE and WebSocket token streaming endpoints; Redis response caching + Redis-backed async queue for ingestion jobs; JWT/API-key auth dependency; per-key rate limiting | fastapi fastapi-ws fastapi-security redis',
    'FOCUS — Docker Compose: FastAPI + Postgres/pgvector (or Qdrant) + Redis + worker, `depends_on` with healthchecks | nana-docker qdrant docker-path',
    'Auth hardening: hash stored API keys, short-lived JWTs, correct 401 vs 403; add auth tests to CI | fastapi-security gh-actions',
    'Learn Lambda + API Gateway basics: when a lightweight webhook/auth endpoint fits serverless | aws-lambda aws-apigw',
  ],
  12: [
    'FOCUS — Finish Microservices with FastAPI; add structured logging, request IDs and global exception handlers | fastapi-micro fastapi',
    'FOCUS — Full stack Compose: FastAPI + Postgres/pgvector + Qdrant (optional) + Redis + Langfuse with persistent volumes and .env | docker-path langfuse-selfhost qdrant',
    'CI: build the Docker image on every PR and run the test suite inside it | gh-actions',
    'Push the RAG API image to ECR, tagged with the git SHA | aws-essentials',
  ],

  // ── Phase 3: Docker focus to W15, Security focus W14–16 ──
  13: [
    'Expose your tool-calling agent behind `POST /agent/run` with Pydantic-validated tool args and a max-steps guard | fastapi pydantic',
    'FOCUS — Run each agent tool in its own container; pass inputs as JSON over stdin, no host mounts | docker-learn docker-path',
    'Threat-model your agent: tools, data access, and what an injected prompt could make it do | owasp-agentic',
    'AWS GenAI learning plan: overview module on Bedrock and agents | aws-genai',
  ],
  14: [
    'Persist LangGraph checkpoints in Postgres; add `POST /threads/{id}/approve` that resumes the graph after human approval | fastapi lc-academy',
    'FOCUS — Docker Sandboxes for AI agents: run code-exec tools with `--network none`, `--read-only`, CPU/memory limits, non-root | docker-learn',
    'FOCUS — OWASP LLM01: test direct + indirect prompt injection; add human-in-the-loop approval gates on every write tool | owasp-llm owasp-agentic',
    'Read Amazon Bedrock Guardrails (denied topics, PII filters) and compare with your own filters | bedrock-guardrails',
  ],
  15: [
    'Build a Streamable-HTTP MCP server behind API-key auth and per-key rate limits | mcp-spec fastapi-security',
    'FOCUS — Containerize your MCP servers and compose them with the agent; add GPU passthrough (`deploy.resources.reservations.devices`) for a local model | docker-gpu docker-path',
    'FOCUS — Least-privilege tool scopes: per-tool allowlists, scoped tokens, and an audit log of every tool call | owasp-agentic mcp-spec',
    'Write an IAM policy granting only what one MCP tool needs (e.g. `s3:GetObject` on a single prefix) | aws-essentials',
  ],
  16: [
    'PII redaction middleware in FastAPI covering requests, responses and logs | fastapi owasp-llm',
    'Harden the agent sandbox: default seccomp, drop capabilities, wall-clock timeouts; document the design | docker-learn',
    'FOCUS — Vector DB RBAC/ACLs (per-user retrieval filters), Excessive Agency audit, and CI tests proving cross-tenant retrieval returns nothing | owasp-llm owasp-agentic gh-actions',
    'Map each OWASP control to its AWS equivalent (IAM, Secrets Manager, Bedrock Guardrails) | bedrock-guardrails aws-secrets',
  ],

  // ── Phase 4: ongoing drills ──
  17: [
    'Build a FastAPI review endpoint to approve/reject synthetic training examples | fastapi',
    'Create a reproducible CUDA training container and run it with `--gpus all` | docker-gpu',
    'CI job: dataset validation (schema, dedup, eval-overlap check) on every data change | gh-actions',
    'Store datasets in S3 with versioning and a lifecycle rule archiving old versions | aws-essentials',
  ],
  18: [
    'Add `POST /extract` calling your fine-tuned adapter; validate output with Pydantic and retry on failure | fastapi pydantic',
    'Mount the Hugging Face cache as a named volume so model downloads persist between runs | docker-path',
    'Build a prompt-injection test set for the fine-tuned model; track pass-rate per run | owasp-llm',
    'Price an EC2 g5/g6 spot instance for QLoRA vs Colab; add a CloudWatch auto-stop alarm | aws-essentials',
  ],
  19: [
    'Feedback endpoint (thumbs + correction) that stores preference pairs in Postgres for DPO | fastapi',
    'Docker Compose profiles: `train` vs `serve` for the same project | docker-path',
    'Safety eval: run harmful/PII prompts through SFT vs DPO models and log refusals | owasp-llm',
    'Upload adapters to S3; download them at container start via an entrypoint script | aws-essentials',
  ],
  20: [
    '`POST /compare` runs one prompt on your model and a frontier API and returns latency + cost | fastapi',
    'Serve your AWQ model with the official vLLM Docker image using GPU passthrough | docker-gpu vllm',
    'CI job: run the 200-example eval on every adapter change and fail on regression | gh-actions',
    'Run the same eval against an Amazon Bedrock model for the benchmark table | aws-genai',
  ],

  // ── Phase 5: Security & CI/CD focus W22–24 ──
  21: [
    'Admin-only `POST /eval` (API-key auth) that runs your LLM judge on a sample | fastapi-security',
    'Add self-hosted Langfuse to your Compose stack with a persistent volume | langfuse-selfhost',
    'Pytest suite for your code-based evaluators, running on every push | gh-actions',
    'CloudWatch metric filters and alarms on log patterns such as “ERROR” | aws-essentials',
  ],
  22: [
    'Background eval worker on the Redis async queue so evals never block API requests | redis fastapi',
    'Compose service `evals` that runs Ragas against the API container | docker-path ragas',
    'FOCUS — GitHub Actions: on every PR run unit tests + a Ragas eval and post the scorecard to the job summary | gh-actions langfuse-ragas',
    'Store eval reports in S3 keyed by commit SHA for history | aws-essentials',
  ],
  23: [
    'Prompt-registry endpoints: fetch prompts by label from Langfuse with caching | langfuse',
    'Run the full stack (API + Postgres + Redis + Langfuse); confirm traces link to prompt versions | langfuse-selfhost',
    'FOCUS — Security regression suite in CI: prompt-injection and PII-leakage tests must pass before merge | owasp-llm owasp-agentic gh-actions',
    'Ship API logs to CloudWatch Logs; build a latency/cost dashboard | aws-essentials',
  ],
  24: [
    'Token budgets per API key; return 429 with Retry-After when exceeded | fastapi-security',
    'CI: build the image with Buildx and push to GHCR/ECR on merge to main | gh-actions docker-path',
    'FOCUS — LLM eval gate on every PR with thresholds, made a required status check via branch protection | gh-actions eugeneyan-evals',
    'GitHub Actions → ECR push via an OIDC role (no long-lived AWS keys) | aws-essentials gh-actions',
  ],

  // ── Phase 6: AWS focus W25–28 ──
  25: [
    'Load secrets from AWS Secrets Manager at startup via boto3; fall back to env vars locally | aws-secrets',
    'Build a `linux/amd64` image for Fargate and push it to ECR | docker-path',
    'IAM least-privilege review: ECS task role vs execution role, no wildcard actions | aws-essentials',
    'FOCUS — IAM least-privilege roles, S3 buckets for datasets/artifacts, ECR repo, Secrets Manager, CloudWatch log group and Billing Alerts | aws-essentials aws-secrets',
  ],
  26: [
    'Add `/health/live` and `/health/ready` endpoints for the load balancer | fastapi',
    'Optimize the image for cold starts: fewer layers, preloaded models | docker-path',
    'CD: GitHub Actions deploys to ECS on merge to main only after the eval gate passes | gh-actions',
    'FOCUS — Deploy the Dockerized AI API with ECR + ECS Fargate or App Runner; build a Lambda + API Gateway webhook; run the Bedrock Knowledge Bases workshop | aws-genai bedrock-kb aws-lambda aws-apigw',
  ],
  27: [
    'OpenAI-compatible proxy endpoint in FastAPI in front of vLLM with streaming passthrough | fastapi vllm',
    'Run vLLM in Docker with GPU passthrough on an EC2 GPU instance | docker-gpu openai-vllm',
    'Authenticate and rate-limit the gateway; never expose the vLLM port publicly (security groups) | fastapi-security',
    'FOCUS — Launch an EC2 GPU instance (g5/g6) for vLLM, add a CloudWatch auto-stop alarm, tear it down afterwards | vllm aws-essentials',
  ],
  28: [
    'Model router + semantic cache in the gateway (Redis or pgvector) | redis',
    'Local Compose: gateway + vLLM + Redis + Langfuse; load-test with a Locust container | docker-path',
    'Compare Bedrock Guardrails with your own filters; add a CI load-test smoke check on PRs | bedrock-guardrails gh-actions',
    'FOCUS — Bedrock (Knowledge Bases & Guardrails) as a fallback route; CloudWatch dashboard for p95/TTFT/cost; budget alarm | bedrock-guardrails bedrock-kb aws-genai',
  ],

  // ── Phase 7: portfolio + interview drills ──
  29: [
    'Polish OpenAPI docs: descriptions, examples and error schemas for Projects 1 & 4 | fastapi',
    'One-command quickstart (`docker compose up` with seed data) for every top project | docker-path',
    'Add CI badges, Dependabot and a SECURITY.md to the top 3 repos | gh-actions',
    'Verify deployed demos with CloudWatch alarms; check your bill | aws-essentials',
  ],
  30: [
    'Write the “API design decisions” section of your blog post (async, streaming, auth, rate limits) | fastapi-micro',
    'Document image sizes and build times before/after optimization for your README | nana-docker',
    'Write Project 2’s threat-model section using OWASP Agentic Top 10 IDs | owasp-agentic',
    'Draw the AWS deployment diagram for Project 4 (VPC, ALB, ECS, ECR, Secrets, CloudWatch) | aws-genai',
  ],
  31: [
    'Interview drill: implement a token-bucket rate limiter in Python in 30 minutes | fastapi-security',
    'Interview drill: explain layers, multi-stage builds and .dockerignore in 2 minutes | docker-dockerignore',
    'Interview drill: direct vs indirect prompt injection and 3 defenses | owasp-llm',
    'Interview drill: IAM user vs role vs policy, with a least-privilege example | aws-essentials',
  ],
  32: [
    'Drill: async vs threads vs processes in Python; when does FastAPI block? | fastapi',
    'Drill: Compose networking, volumes and healthchecks from memory | docker-path',
    'Drill: whiteboard a CI pipeline with unit tests + LLM eval gate | gh-actions',
    'Drill: ECS Fargate vs App Runner vs Lambda + API Gateway trade-offs | aws-lambda aws-apigw',
  ],
  33: [
    'Drill: design an async ingestion queue on Redis with retries and idempotency keys | redis',
    'Drill: GPU passthrough + vLLM container setup on a whiteboard | docker-gpu',
    'Drill: Excessive Agency — redesign an over-privileged agent | owasp-agentic',
    'Drill: Bedrock Knowledge Bases vs custom RAG on AWS | bedrock-kb',
  ],
  34: [
    'Take-home template: FastAPI + Pydantic + SSE + auth + tests, ready to fork | fastapi',
    'Take-home template: Dockerfile + Compose + .dockerignore ready | docker-path',
    'Take-home template: GitHub Actions with tests + eval gate | gh-actions',
    'Take-home template: one-page “how I’d deploy this on AWS” doc | aws-essentials',
  ],
  35: [
    'Drill: implement LRU and TTL caches for embeddings | redis',
    'Drill: debug a broken Dockerfile (layer caching, permission errors) | nana-docker',
    'Drill: pytest a FastAPI endpoint using dependency overrides | gh-actions fastapi',
    'Drill: KV-cache math → choose an EC2 GPU instance for a latency SLO | vllm',
  ],
  36: [
    'System design: the API layer (auth, rate limits, streaming) for each canonical design | fastapi-micro',
    'System design: containerization and sandboxing for the agent platform | docker-learn',
    'System design: the security & CI/CD section for each canonical design | owasp-llm gh-actions',
    'System design: the AWS deployment view for each canonical design | aws-genai',
  ],
  37: [
    'Rapid-fire review: WebSockets vs SSE, JWT vs API keys, Redis queue patterns | fastapi-ws fastapi-security',
    'Rapid-fire review: 20 Docker questions | docker-path',
    'Rapid-fire review: recall all 20 OWASP LLM + Agentic Top 10 items | owasp-llm owasp-agentic',
    'Rapid-fire review: AWS services map for AI apps from memory | aws-essentials',
  ],
  38: [
    'Prepare a deep-dive on how you cut your API’s p95 latency | fastapi',
    'Prepare a story about a container/infra bug you fixed | nana-docker',
    'Prepare a story about a security issue you found and fixed in Project 2 | owasp-agentic',
    'Prepare a story about controlling AWS cost | aws-essentials',
  ],
  39: [
    'Mock: live-code a FastAPI endpoint with validation and tests in 30 minutes | fastapi',
    'Mock: containerize an unfamiliar repo in 20 minutes | docker-path',
    'Mock: security-review a peer’s agent design | owasp-agentic',
    'Mock: AWS deployment design question in 15 minutes | aws-genai',
  ],
  40: [
    'Tag releases of every project and refresh API docs | fastapi',
    'Pin image digests and publish final images | docker-path',
    'Final security & dependency audit; rotate any keys used during the program | gh-actions',
    'Shut down unused AWS resources and confirm a $0 forecast in Billing | aws-essentials',
  ],
};

const parse = (s: string) => {
  const [task, res] = s.split('|').map((x) => x.trim());
  const focus = task.startsWith('FOCUS — ');
  return { task: focus ? task.slice('FOCUS — '.length) : task, res: res.split(/\s+/).filter(Boolean), focus };
};

const KEYS: Exclude<Track, 'ai'>[] = ['backend', 'docker', 'secops', 'aws'];

export const TRACK_TASKS: Record<number, TrackTask[]> = Object.fromEntries(
  WEEKS.map((w) => {
    const row = PLAN[w.n];
    const ai: TrackTask = {
      track: 'ai',
      week: w.n,
      task: `${w.title} — Mon–Thu topics: ${w.days.map((d) => d.title).join(' · ')}`,
      res: [...new Set(w.days.flatMap((d) => d.res))],
      focus: true,
    };
    return [w.n, [ai, ...KEYS.map((k, i) => ({ track: k, week: w.n, ...parse(row[i]) }))]];
  })
);

export const trackTask = (w: number, t: Track) => TRACK_TASKS[w].find((x) => x.track === t)!;

if (import.meta.env.DEV) {
  Object.values(TRACK_TASKS)
    .flat()
    .forEach((t) => t.res.forEach((id) => !RES[id] && console.error(`Track task W${t.week} ${t.track} references unknown resource “${id}”`)));
}

/** Tracks practised on a weekday: AI Core topic + that day's track drill (Mon Backend, Tue Docker, Wed Security & CI/CD, Thu AWS). */
export function dayTracks(slot: number): Track[] {
  if (slot > 4) return TRACK_ORDER; // weekend build integrates every track
  if (slot === 4) return ['ai']; // Friday revision
  const drill = KEYS.find((k) => TRACK_SLOT[k] === slot)!;
  return ['ai', drill];
}

export const trackKey = (w: number, t: Track) => `${w}:${t}`;
