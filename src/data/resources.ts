import type { Resource } from './types';

const r = (id: string, title: string, url: string, type: Resource['type'], est: string): Resource => ({ id, title, url, type, est });

export const RESOURCES: Resource[] = [
  // Phase 1 — Math, classical ML, PyTorch, Transformers
  r('3b1b-la', '3Blue1Brown — Essence of Linear Algebra', 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', 'Video', '~3.5 h'),
  r('statquest', 'StatQuest — Playlists (Stats, ML, NN)', 'https://www.youtube.com/@statquest/playlists', 'Video', 'pick per topic, 10–20 min each'),
  r('cs229', 'Stanford CS229 — Machine Learning', 'https://www.youtube.com/watch?v=DATnpGoGhM8', 'Video', '~1.3 h / lecture'),
  r('fastai', 'Fast.ai — Practical Deep Learning for Coders', 'https://course.fast.ai/', 'Course', '~1.5 h / lesson'),
  r('karpathy', 'Andrej Karpathy — Neural Networks: Zero to Hero', 'https://karpathy.ai/zero-to-hero.html', 'Video', '~2 h / episode'),
  r('alammar', 'Jay Alammar — The Illustrated Transformer', 'https://jalammar.github.io/illustrated-transformer/', 'Article', '~45 min'),
  r('cs336', 'Stanford CS336 — Language Modeling from Scratch', 'https://www.youtube.com/live/JuoVZkPBiKk', 'Video', '~1.3 h / lecture'),
  r('raschka', 'Sebastian Raschka — LLMs From Scratch', 'https://github.com/rasbt/LLMs-from-scratch', 'GitHub', '~1–2 h / chapter'),
  r('hf-llm', 'Hugging Face — LLM Course', 'https://huggingface.co/huggingface-course', 'Course', '~1 h / section'),
  r('neetcode-ml', 'NeetCode — Machine Learning Practice', 'https://neetcode.io/practice/machine-learning', 'Practice', '20–40 min / problem'),
  r('deepml', 'Deep-ML — ML Coding Practice', 'https://www.deep-ml.com/', 'Practice', '15–30 min / problem'),
  r('numpy', 'NumPy — Absolute Beginners Guide', 'https://numpy.org/doc/stable/user/absolute_beginners.html', 'Docs', '~1 h'),
  r('numpy-quickstart', 'NumPy — Quickstart', 'https://numpy.org/doc/stable/user/quickstart.html', 'Docs', '~1 h'),
  r('pytest', 'pytest — Getting Started', 'https://docs.pytest.org/en/stable/getting-started.html', 'Docs', '~30 min'),
  r('sklearn', 'scikit-learn — User Guide', 'https://scikit-learn.org/stable/user_guide.html', 'Docs', 'reference'),
  r('pytorch-tut', 'PyTorch — Learn the Basics', 'https://pytorch.org/tutorials/beginner/basics/intro.html', 'Docs', '~2 h'),

  // Phase 2 — RAG + FastAPI + Docker
  r('dlai-rag', 'DeepLearning.AI — Retrieval Augmented Generation', 'https://www.deeplearning.ai/courses/retrieval-augmented-generation', 'Course', '~5 h'),
  r('dlai-short', 'DeepLearning.AI — Short Courses (Context Engineering)', 'https://www.deeplearning.ai/courses?types=short_course', 'Course', '~1 h each'),
  r('llm-zoomcamp', 'DataTalksClub — LLM Zoomcamp', 'https://github.com/DataTalksClub/llm-zoomcamp', 'GitHub', '~3 h / module'),
  r('applied-llms', 'Applied LLMs — What We Learned from a Year of Building', 'https://applied-llms.org/', 'Article', '~2 h'),
  r('fastapi', 'FastAPI — Official Tutorial / User Guide', 'https://fastapi.tiangolo.com/tutorial/', 'Docs', '~4 h'),
  r('pydantic', 'Pydantic — Documentation', 'https://docs.pydantic.dev/latest/', 'Docs', 'reference'),
  r('pgvector', 'pgvector — Open-source vector search for Postgres', 'https://github.com/pgvector/pgvector', 'GitHub', '~45 min'),
  r('nana-docker', 'TechWorld with Nana — Docker Crash Course', 'https://www.youtube.com/watch?v=3c-iBn73dDE', 'Video', '~3 h'),
  r('docker-path', 'Docker Docs — Get Started with Containers', 'https://docs.docker.com/learn/paths/get-started-with-docker-containers/', 'Docs', '~2 h'),

  // Phase 3 — Agents, MCP, Security
  r('anthropic-agents', 'Anthropic — Building Effective AI Agents', 'https://www.anthropic.com/research/building-effective-agents', 'Article', '~40 min'),
  r('anthropic-cookbook', 'Anthropic Cookbook — Agent Patterns', 'https://github.com/anthropics/anthropic-cookbook/blob/main/patterns/agents/README.md', 'GitHub', '~2 h'),
  r('lc-academy', 'LangChain Academy — LangGraph & LangSmith', 'https://academy.langchain.com/', 'Course', '~6 h'),
  r('hf-agents', 'Hugging Face — Agents Course', 'https://huggingface.co/agents-course', 'Course', '~1.5 h / unit'),
  r('hf-mcp', 'Hugging Face — MCP Course', 'https://huggingface.co/learn/mcp-course/en/unit0/introduction', 'Course', '~1 h / unit'),
  r('mcp-spec', 'Model Context Protocol — Docs', 'https://modelcontextprotocol.io/', 'Docs', 'reference'),
  r('owasp-llm', 'OWASP — Top 10 for LLM & GenAI Apps', 'https://genai.owasp.org/initiatives/top-10-for-llm-and-genai/', 'Docs', '~1.5 h'),
  r('owasp-agentic', 'OWASP — Top 10 for Agentic Applications (2026)', 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/', 'Docs', '~1.5 h'),
  r('docker-learn', 'Docker Sandboxes for AI Agents (Docker Learn)', 'https://docs.docker.com/learn/', 'Docs', '~1 h'),

  // Track extras — Backend / Docker / AWS
  r('fastapi-micro', 'Microservices with FastAPI — Full Course', 'https://www.youtube.com/watch?v=Cy9fAvsXGZA', 'Video', 'course, ~1 h / section'),
  r('fastapi-ws', 'FastAPI — WebSockets', 'https://fastapi.tiangolo.com/advanced/websockets/', 'Docs', '~30 min'),
  r('fastapi-security', 'FastAPI — Security (OAuth2, JWT, API keys)', 'https://fastapi.tiangolo.com/tutorial/security/', 'Docs', '~1.5 h'),
  r('redis', 'Redis — Documentation (caching, queues, streams)', 'https://redis.io/docs/latest/', 'Docs', 'reference'),
  r('qdrant', 'Qdrant — Vector Database Documentation', 'https://qdrant.tech/documentation/', 'Docs', '~1 h'),
  r('docker-dockerignore', 'Docker Docs — Build Context & .dockerignore', 'https://docs.docker.com/build/concepts/context/', 'Docs', '~20 min'),
  r('docker-gpu', 'Docker Compose — GPU Support (passthrough)', 'https://docs.docker.com/compose/how-tos/gpu-support/', 'Docs', '~20 min'),
  r('langfuse-selfhost', 'Langfuse — Self-Hosting with Docker Compose', 'https://langfuse.com/self-hosting', 'Docs', '~45 min'),
  r('aws-lambda', 'AWS Lambda — Developer Guide', 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html', 'Docs', '~1 h'),
  r('aws-apigw', 'Amazon API Gateway — Developer Guide', 'https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html', 'Docs', '~45 min'),
  r('aws-secrets', 'AWS Secrets Manager — User Guide', 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html', 'Docs', '~30 min'),
  // Primary video teachers (one decisive resource per day — see primary.ts)
  r('codebasics', 'Codebasics — Math, Statistics & ML Tutorials', 'https://www.youtube.com/@codebasics', 'Video', '~20–40 min / video'),
  r('campusx-ml', 'CampusX — 100 Days of Machine Learning', 'https://www.youtube.com/@campusx-official/playlists', 'Video', '~30–60 min / video'),
  r('campusx-dl', 'CampusX — 100 Days of Deep Learning', 'https://www.youtube.com/@campusx-official/playlists', 'Video', '~30–60 min / video'),
  r('campusx-fastapi', 'CampusX — FastAPI for ML & Generative AI', 'https://www.youtube.com/@campusx-official/playlists', 'Video', '~30–60 min / video'),
  r('campusx-agents', 'CampusX — Agentic AI using LangGraph', 'https://www.youtube.com/@campusx-official/playlists', 'Video', '~30–60 min / video'),
  r('vizuara', 'Vizuara — Building LLMs / SLMs From Scratch', 'https://www.youtube.com/@vizuara/playlists', 'Video', '~45 min / lecture'),
  r('abhishek-docker', 'Abhishek Veeramalla — Docker Zero to Hero', 'https://www.youtube.com/@AbhishekVeeramalla/playlists', 'Video', '~30–45 min / video'),
  r('abhishek-cicd', 'Abhishek Veeramalla — CI/CD (GitHub Actions) Zero to Hero', 'https://www.youtube.com/@AbhishekVeeramalla/playlists', 'Video', '~30–45 min / video'),
  r('abhishek-aws', 'Abhishek Veeramalla — AWS Zero to Hero', 'https://www.youtube.com/@AbhishekVeeramalla/playlists', 'Video', '~30–45 min / video'),
  r('striver-a2z', 'Striver’s A2Z DSA Sheet (takeUforward)', 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet', 'Practice', '20–45 min / problem'),

  // 2026 production topics
  r('docling', 'Docling — Layout-aware Document Parsing (PDF, tables, figures)', 'https://github.com/docling-project/docling', 'GitHub', '~1 h'),
  r('pymupdf', 'PyMuPDF — Documentation', 'https://pymupdf.readthedocs.io/en/latest/', 'Docs', 'reference'),
  r('pydantic-ai', 'PydanticAI — Typed Python Agent Framework (docs)', 'https://ai.pydantic.dev/', 'Docs', '~2 h'),
  r('openai-agents', 'OpenAI Agents SDK (Python) — Docs', 'https://openai.github.io/openai-agents-python/', 'Docs', '~1.5 h'),
  r('otel-python', 'OpenTelemetry — Python', 'https://opentelemetry.io/docs/languages/python/', 'Docs', '~45 min'),
  r('rag-techniques', 'RAG Techniques Cookbook (Nir Diamant)', 'https://github.com/NirDiamant/RAG_Techniques', 'GitHub', '~30 min / notebook'),
  r('genai-agents', 'GenAI Agents Cookbook (Nir Diamant)', 'https://github.com/NirDiamant/GenAI_Agents', 'GitHub', '~30 min / notebook'),
  r('extended-thinking', 'Anthropic — Extended Thinking (thinking budgets)', 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', 'Docs', '~30 min'),
  r('bedrock-guardrails', 'Amazon Bedrock — Guardrails', 'https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html', 'Docs', '~45 min'),

  // Phase 4 — Post-training
  r('labonne', 'Maxime Labonne — LLM Course', 'https://github.com/mlabonne/llm-course', 'GitHub', '~1 h / notebook'),
  r('trl', 'Hugging Face — TRL Documentation', 'https://huggingface.co/docs/trl/en/index', 'Docs', 'reference'),
  r('unsloth', 'Unsloth — Fast LoRA/QLoRA Fine-tuning', 'https://github.com/unslothai/unsloth', 'GitHub', '~1 h / notebook'),
  r('aie-book', 'Chip Huyen — AI Engineering Book Resources', 'https://github.com/chiphuyen/aie-book', 'GitHub', 'reference'),

  // Phase 5 — Evals & Observability
  r('eugeneyan-evals', 'Eugene Yan — Task-Specific LLM Evals', 'https://eugeneyan.com/writing/evals/', 'Article', '~1 h'),
  r('langfuse', 'Langfuse — Open-Source LLM Observability', 'https://langfuse.com/', 'Docs', '~2 h'),
  r('langfuse-ragas', 'Langfuse + Ragas — Evaluating RAG', 'https://langfuse.com/resources/engineering/evaluation-of-rag-with-ragas', 'Docs', '~1 h'),
  r('ragas', 'Ragas — Documentation', 'https://docs.ragas.io/', 'Docs', 'reference'),
  r('mlops-zoomcamp', 'DataTalksClub — MLOps Zoomcamp', 'https://github.com/DataTalksClub/mlops-zoomcamp', 'GitHub', '~3 h / module'),
  r('fsdl', 'Full Stack Deep Learning — LLM Bootcamp', 'https://fullstackdeeplearning.com/llm-bootcamp/', 'Course', '~1 h / lecture'),
  r('gh-actions', 'GitHub Actions — Documentation', 'https://docs.github.com/en/actions', 'Docs', 'reference'),

  // Phase 6 — AWS, vLLM, System Design
  r('aws-essentials', 'AWS Skill Builder — Cloud Essentials', 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/15009/getting-started-with-aws-cloud-essentials', 'Course', '~3 h'),
  r('aws-genai', 'AWS — GenAI Learning Plan for Developers', 'https://explore.skillbuilder.aws/learn/lp/2068/generative-ai-learning-plan-for-developers', 'Course', '~10 h total'),
  r('bedrock-kb', 'AWS Samples — Bedrock Managed KB RAG Workshop', 'https://github.com/aws-samples/bedrock-kb-rag-workshop/blob/main/BEDROCK_MANAGED_KB.md', 'GitHub', '~2 h'),
  r('vllm', 'vLLM — Documentation', 'https://docs.vllm.ai/', 'Docs', 'reference'),
  r('openai-vllm', 'OpenAI Cookbook — Running Open Models with vLLM', 'https://github.com/openai/openai-cookbook/blob/main/articles/gpt-oss/run-vllm.md', 'GitHub', '~45 min'),
  r('ai-sd', 'AI System Design — Interview Question Bank', 'https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md', 'GitHub', 'reference'),

  // Phase 7 — Interview blitz
  r('neetcode', 'NeetCode — NeetCode 150 & ML Track', 'https://neetcode.io/', 'Practice', '30–45 min / problem'),
  r('deepml-timed', 'Deep-ML — Timed Challenges', 'https://www.deep-ml.com/', 'Practice', '20 min / challenge'),
  r('huyen-interviews', 'Chip Huyen — ML Interviews Book (Free)', 'https://huyenchip.com/ml-interviews-book/', 'Article', '~1 h / chapter'),
];

export const RES: Record<string, Resource> = Object.fromEntries(RESOURCES.map((x) => [x.id, x]));
