# Best Free Path to AI Engineer: Review + Recommended Course

*Reviewed November 2026. All links were checked and load.*

> **Status: applied to the app.** CS229, Fast.ai and the 2023 FSDL bootcamp were removed. Each phase now shows its **spine course** on the Roadmap. The days that repeated a generic link now open specific pages: Evals FAQ questions, Made With ML lessons, smol-course units, Labonne tutorials, Google ML Crash Course modules, Chip Huyen chapters and NeetCode problem videos.

## Part 1: Honest review of what's in the app now

### Keep: these are the best free resources in their area

| Resource | Why it's great |
|---|---|
| [Karpathy — Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) | The single best free deep learning + LLM course. You build everything yourself. |
| [3Blue1Brown — Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) | The best intuition for vectors and matrices, the math AI actually uses. |
| [StatQuest](https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF) | The clearest short explanations of ML and statistics. |
| [Raschka — LLMs From Scratch](https://github.com/rasbt/LLMs-from-scratch) | Code-along build of a GPT, very clean. |
| [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) | The most important 40 minutes of reading on agents. |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course) + [MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction) | Free, hands-on, current. |
| [DataTalksClub LLM Zoomcamp](https://github.com/DataTalksClub/llm-zoomcamp) | The best free project-based RAG course. Its 2026 version adds agentic RAG and evals. |
| [Applied LLMs](https://applied-llms.org/) and [Eugene Yan on evals](https://eugeneyan.com/writing/evals/) | Real production lessons from practitioners. |
| [OWASP LLM Top 10](https://genai.owasp.org/initiatives/top-10-for-llm-and-genai/) + [Agentic Top 10](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) | The industry-standard security checklists. |
| [FastAPI docs](https://fastapi.tiangolo.com/tutorial/), [vLLM docs](https://docs.vllm.ai/), [Unsloth](https://github.com/unslothai/unsloth), [Labonne LLM Course](https://github.com/mlabonne/llm-course) | Official or best-in-class for their topic. |
| [NeetCode](https://neetcode.io/), [Deep-ML](https://www.deep-ml.com/), [Chip Huyen ML Interviews](https://huyenchip.com/ml-interviews-book/) | The best free interview prep. |
| CampusX, Abhishek Veeramalla, Vizuara (Hindi) | The strongest Indian creators for ML, DevOps/AWS and LLM internals respectively. |

### Downgrade or replace: not wrong, but not the best use of limited time

| Resource | Problem | Better choice |
|---|---|---|
| **Stanford CS229** (2018) | Heavy proof-based math, low payoff for an AI *engineer* | [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course) (updated, hands-on) + StatQuest |
| **Fast.ai Part 1** | Good, but overlaps Karpathy and teaches the fastai library rather than PyTorch | Make it optional |
| **Full Stack Deep Learning LLM Bootcamp** (2023) | Outdated for 2026 tools and practices | [Hamel & Shreya — AI Evals FAQ](https://hamel.dev/blog/posts/evals-faq/) + [Made With ML](https://madewithml.com/) |
| **Stanford CS336** | Elite, but about 4–5× CS229's workload and needs paid GPUs for the assignments | Watch only selected lectures (tokenization, architecture, resource accounting, inference); skip the assignments |
| **DeepLearning.AI short courses** | Hit or miss; many are vendor-sponsored and shallow | Use 2–3 specific ones, not as a spine |
| **LangChain Academy** | Ties you to one framework | Learn the concepts; keep plain Python plus one framework |
| **Krish Naik 8–10 h livestreams** | Low information per hour | Use only the chapter slices the app already gives you |

### Problems in the app's current plan
1. **Too much repetition late in the plan.** The same link is the "primary" on many days: Chip Huyen's interview book on 43 days, NeetCode on 25, Labonne on 14. Those weeks need more specific daily resources.
2. **The best free evals resource is missing.** The [Hamel & Shreya Evals FAQ](https://hamel.dev/blog/posts/evals-faq/), expanded in September 2026, is the most practical free guide to evals, the #1 AI engineer skill gap.
3. **Hands-on fine-tuning is missing.** Hugging Face's [smol-course](https://github.com/huggingface/smol-course) teaches alignment of small models with runnable notebooks.
4. **Production ML is missing.** [Made With ML](https://madewithml.com/) teaches testing, CI/CD and deployment for ML properly.
5. **Anthropic's free courses are missing:** [prompt engineering and tool use notebooks](https://github.com/anthropics/courses) and [Anthropic Courses](https://anthropic.skilljar.com/).

---

## Part 2: My recommended course ("one spine per stage")

**Rule:** for each stage, follow **one main course (the spine)** start to finish, use the others only when stuck, and **ship one project per stage**. Mixing many courses is the #1 reason self-learners stall.

Time: about 13.5 h/week, same as your app.

### Stage 1: Math & ML foundations (6 weeks)
- **Spine:** [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)
- **Intuition:** [3Blue1Brown Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) + [Calculus](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr) + StatQuest
- **Reference only:** [Mathematics for Machine Learning (free book)](https://mml-book.github.io/)
- **Hindi:** CampusX *100 Days of ML*
- **Project:** a NumPy vector search engine + a logistic regression from scratch

### Stage 2: Deep learning & how LLMs work inside (8 weeks)
- **Spine:** [Karpathy Zero to Hero](https://karpathy.ai/zero-to-hero.html), all videos in order, typing every line yourself ([code](https://github.com/karpathy/nn-zero-to-hero))
- **Book companion:** [Raschka LLMs From Scratch](https://github.com/rasbt/LLMs-from-scratch), chapters 2–5
- **Optional depth:** [Stanford CS336](https://cs336.stanford.edu/), selected lectures only
- **Hindi:** CampusX *100 Days of DL* (transformer part) + Vizuara
- **Project:** your own small GPT with a KV cache (Project 5 in the app)

### Stage 3: Building with LLMs, tools & agents (6 weeks)
- **Spine:** [Hugging Face Agents Course](https://huggingface.co/learn/agents-course)
- **Must-read:** [Anthropic — Building Effective Agents](https://www.anthropic.com/research/building-effective-agents) + [Anthropic courses (prompting, tool use)](https://github.com/anthropics/courses)
- **Then:** [Hugging Face MCP Course](https://huggingface.co/learn/mcp-course/en/unit0/introduction)
- **Hindi:** CampusX *Agentic AI using LangGraph* + *MCP Trilogy*
- **Project:** a tool-using agent with an MCP server and human approval for risky actions

### Stage 4: RAG + evals, the most hireable skills (7 weeks)
- **Spine:** [LLM Zoomcamp](https://github.com/DataTalksClub/llm-zoomcamp). Do the course project.
- **Evals:** [Hamel & Shreya — AI Evals FAQ](https://hamel.dev/blog/posts/evals-faq/) + [Eugene Yan](https://eugeneyan.com/writing/evals/) + [Evidently LLM evals course](https://www.evidentlyai.com/llm-evaluations-course)
- **Production lessons:** [Applied LLMs](https://applied-llms.org/)
- **Hindi:** CampusX *RAG* + *LLM Evaluation* playlists
- **Project:** hybrid-search RAG with an eval set, judge and CI gate (Project 1 in the app)

### Stage 5: Production engineering (6 weeks)
- **Spine:** [Made With ML](https://madewithml.com/): testing, CI/CD, serving, monitoring
- **Tools:** [FastAPI docs](https://fastapi.tiangolo.com/tutorial/), [Docker docs](https://docs.docker.com/get-started/), [GitHub Actions docs](https://docs.github.com/en/actions)
- **Security:** both OWASP Top 10 lists
- **Cloud:** [AWS GenAI learning plan](https://explore.skillbuilder.aws/learn/lp/2068/generative-ai-learning-plan-for-developers)
- **Hindi:** Abhishek Veeramalla's Docker, CI/CD and AWS playlists
- **Project:** deploy your RAG API (Docker → CI → AWS) with tracing

### Stage 6: Fine-tuning & inference (5 weeks)
- **Spine:** [Hugging Face smol-course](https://github.com/huggingface/smol-course)
- **Then:** [Labonne LLM Course](https://github.com/mlabonne/llm-course) + [Unsloth docs](https://docs.unsloth.ai/) for QLoRA/DPO
- **Serving:** [vLLM docs](https://docs.vllm.ai/)
- **Systems thinking:** [Stanford CS329S notes](https://stanford-cs329s.github.io/)
- **Hindi:** Krish Naik / Codebasics fine-tuning videos (chapter slices)
- **Project:** fine-tune a small model, then benchmark it against an API model (Project 3)

### Stage 7: Interview blitz (last ~10 weeks, alongside portfolio polish)
- **Coding:** [NeetCode 150](https://neetcode.io/) (Hindi: Striver's A2Z sheet)
- **ML coding:** [Deep-ML](https://www.deep-ml.com/)
- **Theory:** [Chip Huyen ML Interviews](https://huyenchip.com/ml-interviews-book/)
- **System design:** [AI system design question bank](https://github.com/ombharatiya/ai-system-design-guide/blob/main/00-interview-prep/01-question-bank.md), 3 mock designs per week

### What to skip (saves months)
- Full CS229 proofs, full CS336 assignments, and the 2023 FSDL bootcamp
- More than one framework (pick plain Python + LangGraph *or* PydanticAI)
- Collecting certificates: **projects with eval numbers get interviews; certificates don't**
- 8–10 hour livestreams end to end: watch only the chapters you need
