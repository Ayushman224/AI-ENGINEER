import { RES } from './resources';
import type { ResourceType } from './types';

/**
 * Per-day dedicated links: a Primary resource + a 🇮🇳 Indian Alternative (where a strong one exists).
 * Rules: no channel-homepage (@handle) links anywhere; every video is a specific `watch?v=` URL;
 * long lectures (≈1.5 h+) are split across days with a ⏱ badge and a `&t=…s` start offset.
 * Every video ID, title and length below was verified against YouTube (video page + chapter list).
 */
export interface Link {
  title: string;
  url: string;
  type: ResourceType;
  est: string;
  badge?: string; // e.g. "⏱ Watch 45:00 – 1:30:00"
}

const secs = (s: string) => s.split(':').map(Number).reduce((a, x) => a * 60 + x, 0);

/** YouTube video; pass from/to to start at a timestamp and show the ⏱ badge. */
function Y(id: string, title: string, est: string, from?: string, to?: string, list?: string): Link {
  const t = from !== undefined ? `&t=${secs(from)}s` : '';
  return {
    title,
    url: `https://www.youtube.com/watch?v=${id}${list ? `&list=${list}` : ''}${t}`,
    type: 'Video',
    est: from !== undefined ? `${est} slice` : est,
    badge: from !== undefined ? `⏱ Watch ${from} – ${to}` : undefined,
  };
}
/** Existing curated resource (docs, course page, GitHub, practice). */
const R = (id: string): Link => {
  const r = RES[id];
  if (!r) throw new Error(`links.ts: unknown resource ${id}`);
  return { title: r.title, url: r.url, type: r.type, est: r.est };
};
const W_ = (url: string, title: string, type: ResourceType, est: string): Link => ({ url, title, type, est });

// ── Frequently reused long lectures (sliced) ──
const LA = 'PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab';
const micrograd = (from: string, to: string, est: string) => Y('VMj-3S1tku0', 'Andrej Karpathy — Building micrograd (backprop from scratch)', est, from, to);
const gpt2 = (from: string, to: string) => Y('l8pRSuU81PU', 'Andrej Karpathy — Let’s reproduce GPT-2 (124M)', '45 min', from, to);
const buildGpt = (from: string, to: string, est: string) => Y('kCc8FmEb1nY', 'Andrej Karpathy — Let’s build GPT: from scratch, in code', est, from, to);
const tokenizer = (from: string, to: string, est: string) => Y('zduSFxRajkE', 'Andrej Karpathy — Let’s build the GPT Tokenizer', est, from, to);
const nana = (from: string, to: string, est: string) => Y('3c-iBn73dDE', 'TechWorld with Nana — Docker Full Course', est, from, to);
const fccMicro = (from: string, to: string, est: string) => Y('Cy9fAvsXGZA', 'freeCodeCamp — Microservices with FastAPI (Full Course)', est, from, to);
const krishSec = (from: string, to: string, est: string) => Y('rQE3w8Qjx98', 'Krish Naik — Complete AI Security Course (Guardrails, Evals, AgentOps)', est, from, to);
const krishAgentSec = (from: string, to: string, est: string) => Y('bUpmu_aZBTw', 'Krish Naik Hindi — Agentic AI Security Crash Course', est, from, to);
const krishFT = (from: string, to: string, est: string) => Y('t-0s_2uZZU0', 'Krish Naik — Fine-Tuning LLMs Crash Course', est, from, to);
const cbFT = (from: string, to: string, est: string) => Y('IIvORO248Zs', 'Codebasics — LLM Fine-Tuning Crash Course', est, from, to);
const striver = R('striver-a2z');

type Pair = [Link, Link?];

const PLAN: Record<number, Pair[]> = {
  // ───── Phase 1: Math, ML, PyTorch & Transformers ─────
  1: [
    [Y('fNk_zzaMoSs', '3Blue1Brown — Vectors, what even are they? (Ch. 1)', '10 min'), Y('CpPLLp3snK4', 'CampusX — NumPy Part 1: Introduction to NumPy', '9 min')],
    [Y('k7RM-ot2NWY', '3Blue1Brown — Linear combinations, span & basis vectors (Ch. 2)', '10 min'), Y('Y8UjSNSMeZ4', 'CampusX — Linear Algebra Part 2: Matrices', '45 min', '00:00', '45:00')],
    [R('numpy-quickstart'), Y('LaKAA7Z84so', 'CampusX — NumPy Part 12: Broadcasting', '9 min')],
    [Y('PFDu9oVAE-g', '3Blue1Brown — Eigenvectors & eigenvalues (Ch. 14)', '17 min', undefined, undefined, LA), Y('tXXnxjj2wM4', 'CampusX — PCA Part 2: Eigen Decomposition, Step by Step', '56 min')],
    [R('deepml'), Y('m_CooIRM3UI', 'Codebasics — Cosine similarity & cosine distance explained', '12 min')],
    [R('numpy-quickstart'), Y('40xGMygHMDU', 'CampusX — Advanced NumPy: indexing & broadcasting', '46 min', '06:36', '52:15')],
    [R('pytest'), Y('40xGMygHMDU', 'CampusX — Advanced NumPy: vectorized math, sigmoid & MSE', '37 min', '52:15', '1:29:30')],
  ],
  2: [
    [Y('wl1myxrtQHQ', 'StatQuest — The Chain Rule, Clearly Explained', '18 min'), Y('-siBIGUREjw', 'CampusX — Session on Differential Calculus', '45 min', '00:00', '45:00')],
    [Y('sDv4f4s2SB8', 'StatQuest — Gradient Descent, Step-by-Step', '24 min'), Y('Jyo53pAyVAM', 'CampusX — Batch Gradient Descent with Code Demo', '1 h 5 min')],
    [Y('9wCnvr7Xw4E', 'StatQuest — Bayes’ Theorem, Clearly Explained', '14 min'), Y('ndHDsvqmbuI', 'CampusX — Joint, Marginal, Conditional Probability & Bayes’ Theorem', '1 h 20 min')],
    [Y('XepXtl9YKwc', 'StatQuest — Maximum Likelihood, Clearly Explained', '6 min'), Y('QBFVcBXRzu4', 'CampusX — Probability vs Likelihood', '29 min')],
    [Y('6ArSys5qHAU', 'StatQuest — Neural Networks Part 6: Cross Entropy', '10 min'), Y('6bXOo0sxY5c', 'CampusX — Logistic Regression Part 4: MLE & Binary Cross-Entropy', '29 min')],
    [Y('vMh0zPT0tLI', 'StatQuest — Stochastic Gradient Descent, Clearly Explained', '11 min'), Y('ORyfPJypKuU', 'CampusX — Gradient Descent From Scratch (with animation)', '59 min', '00:00', '58:58')],
    [R('deepml'), Y('ORyfPJypKuU', 'CampusX — Gradient Descent From Scratch (with animation)', '59 min', '58:58', '1:57:56')],
  ],
  3: [
    [Y('7ArmBVF2dCs', 'StatQuest — Linear Regression, Clearly Explained', '27 min'), Y('dXHIDLPKdmA', 'CampusX — Simple Linear Regression: Math & Coding from Scratch', '54 min')],
    [Y('yIYKR4sgzI8', 'StatQuest — Logistic Regression', '9 min'), Y('ABrrSwMYWSg', 'CampusX — Logistic Regression Part 5: Gradient Descent & Code from Scratch', '37 min')],
    [Y('EuBBz3bI-aA', 'StatQuest — Bias and Variance', '7 min'), Y('FN4aZPIAfI4', 'CampusX — Why Lasso Regression creates sparsity', '25 min')],
    [Y('4jRBRDbJemM', 'StatQuest — ROC and AUC, Clearly Explained', '16 min'), Y('iK-kdhJ-7yI', 'CampusX — Precision, Recall & F1 Score', '43 min')],
    [Y('fSytzGwwBVw', 'StatQuest — Cross Validation', '6 min'), Y('c09drtuCS3c', 'CampusX — Accuracy & Confusion Matrix (Type 1 / Type 2 errors)', '34 min')],
    [R('sklearn'), Y('xOccYkgRV4Q', 'CampusX — Machine Learning Pipelines A–Z', '46 min')],
    [Y('Kdsp6soqA7o', 'StatQuest — The Confusion Matrix', '7 min'), Y('BuuijIa7MZ8', 'CampusX — When is a false positive worse than a false negative?', '11 min')],
  ],
  4: [
    [Y('_L39rN6gz7Y', 'StatQuest — Decision and Classification Trees', '18 min'), Y('IZnno-dKgVQ', 'CampusX — Decision Trees: Entropy, Gini & Information Gain', '58 min')],
    [Y('J4Wdy0Wc_xQ', 'StatQuest — Random Forests Part 1', '10 min'), Y('fbKz7N92mhQ', 'CampusX — Gradient Boosting Explained', '33 min')],
    [Y('FgakZw6K1QQ', 'StatQuest — PCA, Step-by-Step', '22 min'), Y('iRbsBi5W0-c', 'CampusX — PCA Part 1: Geometric Intuition', '34 min')],
    [R('sklearn'), Y('sluoVhT0ehg', 'CampusX — What is Feature Engineering', '25 min')],
    [Y('3CC4N4z3GJc', 'StatQuest — Gradient Boost Part 1: Regression Main Ideas', '16 min'), Y('etk-4thyX7E', 'CampusX — Bagging vs Boosting (interview question)', '6 min')],
    [Y('4b5d3muPQmA', 'StatQuest — K-means clustering', '9 min'), Y('ToGuhynu-No', 'CampusX — Curse of Dimensionality', '15 min')],
    [R('sklearn'), Y('tofVCUDrg4M', 'CampusX — PCA Part 3: Code & Visualization', '43 min')],
  ],
  5: [
    [micrograd('00:00', '50:00', '50 min'), Y('6M1wWQmcUjQ', 'CampusX — Backpropagation Part 1: The What', '54 min')],
    [micrograd('50:00', '1:40:00', '50 min'), Y('qw7wFGgNCSU', 'CampusX — Multi-Layer Perceptron: Intuition', '38 min')],
    [micrograd('1:40:00', '2:25:52', '46 min'), Y('BECZ0UB5AR0', 'CampusX — PyTorch Autograd (Video 3)', '54 min')],
    [Y('P6sfmUTpUmc', 'Andrej Karpathy — makemore Part 3: init, activations & BatchNorm', '63 min', '00:00', '1:03:07'), Y('N5AynalXD9g', 'CampusX — Adam Optimizer Explained', '13 min')],
    [R('deepml'), Y('ma6hWrU-LaI', 'CampusX — Backpropagation Part 2: The How', '1 h')],
    [W_('https://github.com/karpathy/micrograd', 'Andrej Karpathy — micrograd (GitHub repo)', 'GitHub', '~30 min read'), Y('MKxEbbKpL5Q', 'CampusX — PyTorch Training Pipeline (Video 4)', '30 min')],
    [R('pytorch-tut'), Y('6EJaHBJhwDs', 'CampusX — Building an ANN using PyTorch (Video 7)', '39 min')],
  ],
  6: [
    [Y('PaCmpygFfXo', 'Andrej Karpathy — Building makemore: the bigram language model', '63 min', '00:00', '1:02:57'), Y('z9fgKz1Drlc', 'Vizuara — Lecture 6: Stages of building an LLM from scratch', '20 min')],
    [tokenizer('00:00', '57:36', '58 min'), Y('fKd8s29e-l4', 'Vizuara — Lecture 8: The GPT Tokenizer (Byte Pair Encoding)', '54 min')],
    [Y('TCH_1BHY58I', 'Andrej Karpathy — Building makemore Part 2: MLP', '1 h 16 min'), Y('ghCSGRgVB_o', 'Vizuara — Lecture 10: What are token embeddings?', '1 h')],
    [R('hf-llm'), Y('CabHrf9eOVs', 'CampusX — Neural Network Training on GPU (Video 8)', '11 min')],
    [R('deepml'), Y('3dWzNZXA8DY', 'Vizuara — Lecture 2: Large Language Model Basics', '34 min')],
    [tokenizer('57:36', '1:28:42', '31 min'), Y('mk-6cFebjis', 'Vizuara — Lecture 12: The LLM Data Preprocessing Pipeline', '47 min', '00:00', '47:00')],
    [tokenizer('1:28:42', '2:13:34', '45 min'), Y('mk-6cFebjis', 'Vizuara — Lecture 12: The LLM Data Preprocessing Pipeline', '47 min', '47:00', '1:34:15')],
  ],
  7: [
    [buildGpt('42:13', '1:11:38', '29 min'), Y('NLn4eetGmf8', 'Vizuara — Lecture 4: What are transformers?', '20 min', '00:00', '20:00')],
    [buildGpt('1:11:38', '1:24:25', '13 min'), Y('NLn4eetGmf8', 'Vizuara — Lecture 4: What are transformers?', '21 min', '20:00', '40:39')],
    [buildGpt('1:24:25', '1:42:39', '18 min'), Y('G3W-LT79LSI', 'Vizuara — Lecture 20: Layer Normalization in the LLM Architecture', '39 min')],
    [R('alammar'), Y('a17DlNxkv2k', 'Vizuara — Rotary Positional Encodings, Explained Visually', '35 min')],
    [R('deepml'), Y('r7mAt0iVqwo', 'CampusX — Scaled Dot-Product Attention: why we scale', '51 min')],
    [R('raschka'), Y('DI2_hrAulYo', 'CampusX — Transformer Decoder Architecture', '48 min')],
    [R('raschka'), Y('m6onaKFzF94', 'CampusX — Masked (Causal) Self-Attention', '1 h')],
  ],
  8: [
    [gpt2('00:00', '45:00'), Y('G3-JgHckzjw', 'Vizuara — Coding the 124M-parameter GPT-2 model', '1 h 2 min')],
    [gpt2('45:00', '1:30:00'), Y('mtsY7JsGQjw', 'Vizuara — What is Grouped-Query Attention?', '58 min')],
    [gpt2('1:30:00', '2:15:00'), Y('IDwTiS4_bKo', 'Vizuara — Key-Value Cache from Scratch', '1 h')],
    [gpt2('2:15:00', '3:00:00'), Y('b5e43BaNC84', 'Vizuara — Replicate GPT-2 from Scratch', '1 h 34 min')],
    [R('deepml'), Y('rvsEW-EsD-Y', 'Vizuara — Multi-Head Attention Handwritten from Scratch', '51 min')],
    [Y('l8pRSuU81PU', 'Andrej Karpathy — Let’s reproduce GPT-2 (124M)', '61 min', '3:00:00', '4:01:26'), Y('lF1yuipDf3U', 'Vizuara — Build an SLM: Pre-training & Inference', '1 h 39 min')],
    [R('raschka'), Y('-rQT4AaZXKI', 'Vizuara — The KV Cache: why LLMs store keys and values', '36 min')],
  ],

  // ───── Phase 2A: AI Core + Backend ─────
  9: [
    [R('dlai-rag'), Y('SEWS9P4ODmc', 'CampusX — Text Splitters (chunking) in LangChain', '59 min')],
    [R('fastapi'), Y('WJKsPchji0Q', 'CampusX — What is an API? FastAPI for ML (Ep. 1)', '47 min')],
    [R('pgvector'), Y('k13WK0bxQP0', 'CampusX — Vector Stores', '51 min')],
    [R('llm-zoomcamp'), Y('pJdMxwXBsk0', 'CampusX — Retrievers (hybrid & MMR)', '51 min')],
    [R('fastapi'), Y('VVVKEfhXCQ4', 'CampusX — Path & Query Params in FastAPI (Ep. 4)', '41 min')],
    [fccMicro('00:00', '45:00', '45 min'), Y('lXx-_1r0Uss', 'CampusX — FastAPI Philosophy & Setup (Ep. 2)', '42 min')],
    [fccMicro('45:00', '1:28:53', '44 min'), Y('O8KrViWNhOM', 'CampusX — HTTP Methods in FastAPI (Ep. 3)', '27 min')],
  ],
  10: [
    [R('dlai-short'), krishAgentSec('3:03:42', '3:55:13', '52 min')],
    [R('pydantic'), Y('lRArylZCeOs', 'CampusX — Pydantic Crash Course', '1 h 26 min')],
    [R('fastapi'), Y('mcF3iefRqLY', 'Abhishek Veeramalla — Redis vs Valkey on AWS ElastiCache (caching demo)', '20 min')],
    [R('docling'), Y('bL92ALSZ2Cg', 'CampusX — Document Loaders (PDF & multimodal parsing)', '57 min')],
    [R('fastapi'), Y('sw8V7mLl3OI', 'CampusX — POST Requests & Request Body in FastAPI', '36 min')],
    [R('dlai-rag'), krishAgentSec('00:01:39', '00:50:00', '48 min')],
    [R('fastapi'), Y('JdDoMi_vqbM', 'CampusX — Serving ML Models with FastAPI (Ep. 7)', '47 min')],
  ],

  // ───── Phase 2B: Context Engineering + Docker ─────
  11: [
    [R('dlai-rag'), Y('BbO_XaEjzaA', 'CampusX — Self-RAG: make your AI fact-check itself', '1 h 9 min')],
    [R('dlai-short'), Y('41XDn81nR5c', 'CampusX — Corrective RAG (CRAG)', '1 h 15 min')],
    [nana('00:00', '45:00', '45 min'), Y('7JZP345yVjw', 'Abhishek Veeramalla — Introduction to Containers (Day 23)', '25 min')],
    [nana('45:00', '1:30:00', '45 min'), Y('yyJrZgoNal0', 'Abhishek Veeramalla — Multi-Stage Docker Builds & Distroless (Day 26)', '32 min')],
    [R('docker-path'), Y('I6ZBUEc4LrU', 'Abhishek Veeramalla — Docker Interview Questions (Day 29)', '38 min')],
    [R('docker-dockerignore'), Y('wodLpta-hoQ', 'Abhishek Veeramalla — Docker Zero to Hero Part 1 (Day 24)', '50 min')],
    [R('dlai-rag'), Y('uQFLY8rQVYA', 'CampusX — LLM Eval Methods: LLM-as-a-Judge', '53 min')],
  ],
  12: [
    [R('dlai-short'), Y('xlUIiTSaFKI', 'Vizuara — Foundations of Context (Context Engineering Bootcamp L1)', '45 min', '00:00', '45:00')],
    [nana('1:30:00', '2:15:00', '45 min'), Y('eYzIPGHxnQo', 'Abhishek Veeramalla — Docker Compose Beginner Guide', '50 min')],
    [nana('2:15:00', '2:46:15', '31 min'), Y('r_LgmqejAkA', 'Abhishek Veeramalla — Docker Volumes & Bind Mounts (Day 27)', '36 min')],
    [R('dlai-short'), Y('DcPKJrOF9Wo', 'CampusX — LLMs don’t have memory: so how do they remember?', '58 min')],
    [R('docker-path'), Y('xrUGEoUpa3s', 'Abhishek Veeramalla — Docker Networking (Day 28)', '33 min')],
    [nana('1:29:49', '1:42:02', '12 min'), Y('jlLs6hfAga4', 'CampusX — FastAPI + Docker: Dockerize a FastAPI app', '19 min')],
    [R('applied-llms'), Y('FSBkTI1QuvY', 'CampusX — Short-Term Memory in LangGraph', '53 min')],
  ],

  // ───── Phase 3A: Agents & MCP ─────
  13: [
    [R('anthropic-agents'), Y('xdA0pGDiUPE', 'CampusX — Generative AI vs Agentic AI (LangGraph Ep. 1)', '1 h 3 min')],
    [R('anthropic-cookbook'), Y('_UuUigoM9MA', 'CampusX — Tools in LangGraph', '34 min')],
    [R('lc-academy'), Y('D5KhiCDM9XQ', 'CampusX — LangGraph Core Concepts (Ep. 4)', '52 min')],
    [R('lc-academy'), Y('_IPP7_Bi8uA', 'CampusX — Persistence & Time Travel in LangGraph', '58 min')],
    [R('anthropic-cookbook'), Y('I-dvZqTz-Wc', 'CampusX — Conditional Workflows in LangGraph (Ep. 7)', '48 min')],
    [R('anthropic-cookbook'), Y('O6ryuSpqdOw', 'CampusX — Parallel Workflows in LangGraph (Ep. 6)', '59 min')],
    [R('lc-academy'), Y('xxqZzVZ4gE0', 'CampusX — Human-in-the-Loop (HITL) in LangGraph', '40 min')],
  ],
  14: [
    [R('pydantic-ai'), Y('Qu2Lm38yoNk', 'Krish Naik Hindi — Building AI Agents with PydanticAI', '60 min', '00:00', '1:00:00')],
    [R('openai-agents'), Y('Iw4tZ5fmYIQ', 'Piyush Garg — Building Agents with the OpenAI Agents SDK', '20 min')],
    [R('hf-mcp'), Y('tc2oOznpdE0', 'CampusX — How to Build Local MCP Servers', '1 h 12 min')],
    [R('hf-mcp'), Y('o4ajsc-tSBc', 'CampusX — How to Build MCP Clients', '40 min')],
    [R('mcp-spec'), Y('nQa31xdXbGk', 'CampusX — MCP Architecture', '1 h 17 min')],
    [R('mcp-spec'), Y('GF7-ZzUausU', 'CampusX — Build & Deploy Remote MCP Servers', '46 min')],
    [R('pydantic-ai'), Y('yZGjVA4uDc4', 'CampusX — MCP Client using LangGraph', '45 min')],
  ],

  // ───── Phase 3B: Security ─────
  15: [
    [R('owasp-llm'), Y('qvrbwZ3V4-o', 'Krish Naik — LLM Security: Prompt Injection (LLM01)', '41 min')],
    [R('owasp-llm'), krishAgentSec('5:40:35', '6:33:00', '52 min')],
    [R('owasp-agentic'), krishAgentSec('6:33:00', '7:25:59', '53 min')],
    [R('owasp-agentic'), Y('xxqZzVZ4gE0', 'CampusX — Human-in-the-Loop (HITL) in LangGraph', '40 min')],
    [R('owasp-llm'), Y('dLmFDlyR8Zo', 'Abhishek Veeramalla — SAST, DAST & SCA explained', '54 min')],
    [R('owasp-agentic'), krishSec('00:03:08', '00:36:20', '33 min')],
    [R('owasp-agentic'), krishSec('00:36:20', '01:03:01', '27 min')],
  ],
  16: [
    [R('owasp-agentic'), krishSec('00:20:50', '00:36:20', '16 min')],
    [R('pgvector'), Y('o7-H8QWUPqI', 'Abhishek Veeramalla — Kubernetes Security: RBAC, Network Policies & Secrets', '1 h 15 min')],
    [R('docker-learn'), Y('bsfKtGbmTgk', 'Abhishek Veeramalla — Securing Containers (DevSecOps Day 4)', '46 min')],
    [R('owasp-llm'), Y('Th7_WCIMjEo', 'Abhishek Veeramalla — Intro to DevSecOps & Security Reports (Day 1)', '31 min')],
    [R('owasp-llm'), Y('qvrbwZ3V4-o', 'Krish Naik — LLM Security: Prompt Injection (LLM01)', '41 min')],
    [R('docker-learn'), Y('bsfKtGbmTgk', 'Abhishek Veeramalla — Securing Containers (DevSecOps Day 4)', '46 min')],
    [R('owasp-agentic'), Y('I4sGn8Z1vpI', 'Keerti Purswani — 20 Agentic AI System Design Interview Questions', '30 min')],
  ],

  // ───── Phase 4: Fine-Tuning & Alignment ─────
  17: [
    [R('labonne'), cbFT('00:00', '13:10', '13 min')],
    [R('trl'), Y('Vg3dS-NLUT4', 'Krish Naik — Fine-tune Llama 2 on a custom dataset (LoRA/QLoRA)', '27 min')],
    [R('labonne'), krishFT('2:20:14', '2:36:49', '17 min')],
    [R('labonne')],
    [R('labonne'), Y('SrYXAd4nMvQ', 'Krish Naik Hindi — LoRA & QLoRA techniques', '27 min')],
    [R('labonne'), Y('6S59Y0ckTm4', 'Krish Naik — Road to fine-tuning: quantization, LoRA, QLoRA intuition', '33 min')],
    [R('aie-book')],
  ],
  18: [
    [R('trl'), krishFT('56:07', '1:20:16', '24 min')],
    [R('labonne'), Y('l5a_uKnbEr4', 'Krish Naik — LoRA & QLoRA: in-depth mathematical intuition', '23 min')],
    [R('unsloth'), cbFT('13:10', '34:37', '21 min')],
    [R('unsloth'), krishFT('1:37:14', '1:59:26', '22 min')],
    [R('labonne'), Y('SrYXAd4nMvQ', 'Krish Naik Hindi — LoRA & QLoRA techniques', '27 min')],
    [R('unsloth'), cbFT('34:37', '53:41', '19 min')],
    [R('trl')],
  ],
  19: [
    [R('labonne')],
    [R('trl')],
    [R('trl'), Y('wEa9CmWPWoU', 'Vizuara — GRPO explained in 40 minutes', '38 min')],
    [R('aie-book'), Y('QSOB9lNrNj4', 'CampusX — What are LLM Benchmarks?', '45 min', '00:00', '45:00')],
    [R('trl')],
    [R('labonne')],
    [R('trl')],
  ],
  20: [
    [R('labonne'), krishFT('01:20', '33:44', '32 min')],
    [R('labonne'), Y('YcAYmIFtA0o', 'CampusX — Ollama Masterclass: run local (GGUF) LLMs', '45 min', '00:00', '45:00')],
    [R('labonne'), krishFT('1:20:16', '1:37:14', '17 min')],
    [R('aie-book'), Y('RG5A-W3eMHI', 'CampusX — Selecting the Right LLM: Running Custom Model Evals', '58 min', '00:00', '58:00')],
    [R('labonne')],
    [R('labonne')],
    [R('aie-book'), Y('RG5A-W3eMHI', 'CampusX — Selecting the Right LLM: Running Custom Model Evals', '59 min', '58:00', '1:56:53')],
  ],

  // ───── Phase 5A: Evals & Observability ─────
  21: [
    [R('eugeneyan-evals'), Y('cNF_MO82Qew', 'CampusX — Introduction to LLM Evaluations: Model vs Application Evals', '25 min')],
    [R('eugeneyan-evals'), Y('Pv4mkG2K_s8', 'CampusX — How to Evaluate LLM Applications: the complete workflow', '17 min')],
    [R('eugeneyan-evals'), Y('uQFLY8rQVYA', 'CampusX — LLM Eval Methods: LLM-as-a-Judge', '53 min')],
    [R('eugeneyan-evals'), krishSec('01:30:44', '01:52:46', '22 min')],
    [R('eugeneyan-evals'), Y('FPS0rIAQwzo', 'CampusX — LLM Model Evals & Capabilities', '38 min')],
    [R('eugeneyan-evals'), krishAgentSec('9:03:47', '10:21:52', '1 h 18 min')],
    [R('eugeneyan-evals'), Y('SahaDGzN-Bk', 'CampusX — Offline Evals vs Online Evals', '1 h 21 min')],
  ],
  22: [
    [R('llm-zoomcamp'), krishSec('02:18:02', '02:30:46', '13 min')],
    [R('ragas'), krishSec('01:52:46', '02:18:02', '25 min')],
    [R('langfuse'), Y('pN9sF1KgiAI', 'Loop Kaka — Langfuse Full Setup & Tutorial (Hindi)', '20 min')],
    [R('rag-techniques'), Y('PFaJwB33mlQ', 'Tushar Vashishth — RAG System Design: semantic cache, re-ranking, vector DB', '21 min')],
    [R('ragas'), Y('7KLzDljc6QE', 'AmanAI Lab — RAGAS metrics + 20 interview Q&A', '15 min')],
    [R('langfuse'), krishSec('06:10:58', '06:19:11', '8 min')],
    [R('rag-techniques'), krishSec('02:30:46', '02:47:50', '17 min')],
  ],

  // ───── Phase 5B: CI/CD ─────
  23: [
    [R('gh-actions'), Y('K3RqgDPCjYs', 'Abhishek Veeramalla — GitHub Actions: 3 projects & self-hosted runner (Day 20)', '22 min')],
    [R('pytest'), Y('CmVxoNkkACQ', 'Abhishek Veeramalla — What is CI/CD? (Day 18)', '33 min')],
    [R('gh-actions'), Y('Gd-AiV--LHs', 'Abhishek Veeramalla — DevSecOps for Git & GitHub: top 10 practices', '46 min')],
    [R('langfuse')],
    [R('gh-actions'), Y('hTAvtgZPyP8', 'Abhishek Veeramalla — How to explain your CI/CD process in an interview', '12 min')],
    [R('gh-actions'), Y('Rb2pUKdmdYo', 'Abhishek Veeramalla — GitHub Actions Self-Hosted Runners', '25 min')],
    [R('langfuse'), Y('pN9sF1KgiAI', 'Loop Kaka — Langfuse Full Setup & Tutorial (Hindi)', '20 min')],
  ],
  24: [
    [R('gh-actions'), krishSec('02:40:31', '02:47:50', '7 min')],
    [R('owasp-llm'), Y('Ke_Wr5zPE0A', 'Abhishek Veeramalla — DevSecOps CI/CD Pipeline Implementation', '1 h 39 min')],
    [R('gh-actions'), Y('lx00Do4yEpQ', 'Abhishek Veeramalla — Docker Multi-Arch Builds (Buildx)', '43 min')],
    [R('gh-actions'), Y('WUra9ugnVhs', 'Abhishek Veeramalla — CI/CD Workflow: Dev → Stage → Prod', '27 min')],
    [R('gh-actions'), Y('rlFQgAqt3_Q', 'Abhishek Veeramalla — Top 5 CI/CD Interview Q&A', '11 min')],
    [R('gh-actions'), Y('jNPGo6A4VHc', 'Abhishek Veeramalla — Ultimate CI/CD Pipeline: End-to-End Project', '33 min')],
    [R('gh-actions'), Y('-8_r28jJ6AM', 'Abhishek Veeramalla — AWS ECR vs DockerHub (Day 20)', '29 min')],
  ],

  // ───── Phase 6: vLLM Inference + AWS ─────
  25: [
    [R('vllm'), Y('QyHHbeXqgrQ', 'Vizuara — How the vLLM inference engine works', '1 h 14 min')],
    [R('vllm'), Y('-rQT4AaZXKI', 'Vizuara — The KV Cache: why LLMs store keys and values', '36 min')],
    [R('aws-genai'), Y('n6RWhajimZg', 'Abhishek Veeramalla — Introduction to AWS & Core Architecture (Day 1)', '28 min')],
    [R('aws-essentials'), Y('mCLYcsJ0GXQ', 'Abhishek Veeramalla — AWS IAM Deep Dive (Day 2)', '46 min')],
    [R('aws-essentials'), Y('qtkWHhikLh8', 'Abhishek Veeramalla — AWS Scenario Interview Q&A: EC2, IAM, VPC (Day 8)', '26 min')],
    [R('aws-essentials'), Y('Ka08OEr7Mls', 'Abhishek Veeramalla — How to reduce your AWS bill', '21 min')],
    [R('vllm'), Y('Z6B51Odtn-Y', 'Vizuara — Multi-Query Attention: dealing with KV-cache memory', '38 min')],
  ],
  26: [
    [R('vllm'), Y('vM3kzJIPvvw', 'Vizuara — How LLM Serving Works: vLLM & SGLang', '54 min', '00:00', '54:00')],
    [R('openai-vllm'), Y('vM3kzJIPvvw', 'Vizuara — How LLM Serving Works: vLLM & SGLang', '55 min', '54:00', '1:48:57')],
    [R('aws-genai'), Y('DiWWPo2Qoso', 'Abhishek Veeramalla — AWS S3 Deep Dive (Day 9)', '1 h 3 min')],
    [R('aws-secrets'), Y('u4XngwbY-O0', 'Abhishek Veeramalla — AWS CloudWatch Deep Dive (Day 16)', '57 min')],
    [R('vllm'), Y('FllcHYsBm78', 'Abhishek Veeramalla — Secret Management on AWS (Day 23)', '17 min')],
    [R('vllm'), Y('IDjyrXKsC5U', 'Vizuara — Journey of a token in vLLM and SGLang', '1 h 32 min')],
    [R('aws-essentials'), Y('-8_r28jJ6AM', 'Abhishek Veeramalla — AWS ECR (Day 20)', '29 min')],
  ],
  27: [
    [R('extended-thinking'), Y('k2QEElQ9eeM', 'Vizuara — Reasoning LLMs from Scratch: Lecture 1', '49 min')],
    [R('aws-genai'), Y('nnIFkEOzNp4', 'Abhishek Veeramalla — AWS ECS: ECS vs EKS (Day 21)', '55 min')],
    [R('vllm'), Y('Dc0t4LDOySY', 'Abhishek Veeramalla — EC2 Deep Dive (Day 3)', '42 min')],
    [R('bedrock-kb'), krishSec('06:19:11', '06:40:41', '22 min')],
    [R('aws-genai'), Y('rsw74PifwSA', 'Abhishek Veeramalla — 500 AWS Interview Q&A (30 services)', '7 min')],
    [R('aws-genai'), Y('X0lnToYN21k', 'CampusX — Deploy a FastAPI API on AWS (Ep. 10)', '19 min')],
    [R('vllm'), Y('OKYJCHHSWb4', 'Abhishek Veeramalla — AWS Cost Optimization project (Day 18)', '45 min')],
  ],
  28: [
    [R('ai-sd'), Y('9jZAT1aVtGs', 'Adsorp AI (Hindi) — Semantic Caching strategies to minimize LLM cost & latency', '18 min')],
    [R('ai-sd'), krishAgentSec('7:25:59', '8:15:00', '49 min')],
    [R('vllm'), krishSec('07:22:25', '07:31:42', '9 min')],
    [R('ai-sd'), Y('S6jy0T85DFs', 'Codebasics — AI System Design Tutorial (Hindi)', '43 min')],
    [R('ai-sd'), Y('icd5KdbtwxM', 'Think in Models — What is asked in AI system design interviews?', '1 h 2 min')],
    [R('ai-sd'), krishSec('06:45:01', '06:53:12', '8 min')],
    [R('vllm'), krishSec('07:31:42', '07:48:38', '17 min')],
  ],

  // ───── Phase 7: Portfolio & Interview Blitz ─────
  29: [[R('huyen-interviews')], [R('huyen-interviews')], [R('vllm')], [R('huyen-interviews')], [R('huyen-interviews')], [R('huyen-interviews')], [R('gh-actions')]],
  30: [
    [R('huyen-interviews'), Y('M-UaSHSIgJs', 'Krish Naik — How to get an AI job in 2026-27', '24 min')],
    [R('huyen-interviews'), Y('BOY65Sw8xL0', 'Krish Naik — Complete AI Engineering Roadmap', '20 min')],
    [R('applied-llms')],
    [R('huyen-interviews')],
    [R('huyen-interviews')],
    [R('applied-llms')],
    [R('huyen-interviews')],
  ],
  31: [[R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver]],
  32: [[R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver]],
  33: [[R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver], [R('neetcode'), striver]],
  34: [
    [R('huyen-interviews'), Y('M-UaSHSIgJs', 'Krish Naik — How to get an AI job in 2026-27', '24 min')],
    [R('huyen-interviews')],
    [R('fastapi')],
    [R('huyen-interviews')],
    [R('huyen-interviews')],
    [R('huyen-interviews')],
    [R('fastapi')],
  ],
  35: [
    [R('deepml-timed'), Y('r7mAt0iVqwo', 'CampusX — Scaled Dot-Product Attention', '51 min')],
    [R('neetcode-ml'), Y('ABrrSwMYWSg', 'CampusX — Logistic Regression: Gradient Descent & Code from Scratch', '37 min')],
    [R('deepml-timed'), Y('abnL_GUGub4', 'CampusX — K Nearest Neighbors in one video', '52 min')],
    [R('deepml-timed'), Y('ma6hWrU-LaI', 'CampusX — Backpropagation Part 2: The How', '1 h')],
    [R('neetcode-ml'), Y('yA_Vtygj5FA', 'CampusX — 100 Most Common ML Interview Questions', '4 min')],
    [R('deepml-timed'), striver],
    [R('neetcode-ml'), striver],
  ],
  36: [
    [R('huyen-interviews'), Y('PFaJwB33mlQ', 'Tushar Vashishth — RAG System Design 2026', '21 min')],
    [R('huyen-interviews'), Y('I4sGn8Z1vpI', 'Keerti Purswani — 20 Agentic AI System Design Interview Questions', '30 min')],
    [R('huyen-interviews'), Y('S6jy0T85DFs', 'Codebasics — AI System Design Tutorial (Hindi)', '43 min')],
    [R('huyen-interviews'), Y('icd5KdbtwxM', 'Think in Models — What is asked in AI system design interviews?', '1 h 2 min')],
    [R('huyen-interviews'), Y('mwN75EiGfCE', 'Aishwarya Srinivasan — Agentic AI System Design in 27 minutes', '27 min')],
    [R('huyen-interviews'), Y('H9Qdm8_JBAs', 'sudoCODE — ChatGPT System Design (mock interview)', '26 min')],
    [R('huyen-interviews'), Y('mwN75EiGfCE', 'Aishwarya Srinivasan — Agentic AI System Design in 27 minutes', '27 min')],
  ],
  37: [
    [R('huyen-interviews'), Y('yA_Vtygj5FA', 'CampusX — 100 Most Common ML Interview Questions', '4 min')],
    [R('huyen-interviews'), Y('BjRVS2wTtcA', 'CampusX — Introduction to Transformers', '1 h')],
    [R('huyen-interviews'), Y('8fX3rOjTloc', 'CampusX — The Epic History of LLMs: LSTMs to ChatGPT', '1 h 27 min')],
    [R('huyen-interviews'), Y('QyHHbeXqgrQ', 'Vizuara — How the vLLM inference engine works', '1 h 14 min')],
    [R('huyen-interviews'), Y('HkDe1sqS8yw', 'CampusX — Reducible vs Irreducible Error', '15 min')],
    [R('huyen-interviews'), Y('9sEiMp8bCnY', 'CampusX — Parametric vs Non-Parametric algorithms', '16 min')],
    [R('huyen-interviews'), Y('TXVtbgaEyms', 'CampusX — Convex vs Non-Convex cost functions', '10 min')],
  ],
  38: [[R('huyen-interviews')], [R('huyen-interviews')], [R('huyen-interviews')], [R('huyen-interviews')], [R('huyen-interviews')], [R('huyen-interviews')], [R('huyen-interviews')]],
  39: [
    [R('neetcode'), striver],
    [R('neetcode-ml'), Y('yA_Vtygj5FA', 'CampusX — 100 Most Common ML Interview Questions', '4 min')],
    [R('huyen-interviews'), Y('H9Qdm8_JBAs', 'sudoCODE — ChatGPT System Design (mock interview)', '26 min')],
    [R('huyen-interviews')],
    [R('neetcode'), striver],
    [R('neetcode'), Y('H9Qdm8_JBAs', 'sudoCODE — ChatGPT System Design (mock interview)', '26 min')],
    [R('huyen-interviews')],
  ],
  40: [
    [R('huyen-interviews')],
    [R('neetcode'), striver],
    [R('huyen-interviews')],
    [R('huyen-interviews')],
    [R('huyen-interviews')],
    [R('applied-llms')],
    [R('aie-book')],
  ],
};

export function dayLinks(week: number, slot: number): { primary: Link; alt?: Link } {
  const pair = PLAN[week]?.[slot];
  if (!pair) throw new Error(`links.ts: missing week ${week} slot ${slot}`);
  return { primary: pair[0], alt: pair[1] };
}

/** Every link in the plan — used by the audit. */
export const ALL_DAY_LINKS = (): Link[] => Object.values(PLAN).flatMap((w) => w.flatMap((p) => p.filter(Boolean) as Link[]));

if (import.meta.env.DEV) {
  for (let w = 1; w <= 40; w++) if (PLAN[w]?.length !== 7) console.error(`links.ts: week ${w} must have 7 days`);
}
