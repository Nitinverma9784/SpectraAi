# SpectraAI: GenAI Product Decision & Adaptive Specification Platform

This document explains the technical architecture and logic solving the core product problems (AIML5 & AIML6) using **OpenRouter** and a **Continuous Synchronization Loop**.

---

## 1. AIML5 — GenAI-Powered Decision Intelligence
**Problem:** Teams lack structured reasoning for trade-offs during design. Gut feeling leads to expensive rework.

### How SpectraAI Solves It (The "Decision Intelligence Module"):
SpectraAI uses LLMs (via OpenRouter) to evaluate competing options against project constraints. 
1. **Structuring**: Users create formal Decisions with competing Options.
2. **Analysis**: The `DECISION_ANALYSIS_PROMPT` instructs the LLM to perform architectural reasoning.
3. **Reasoning Outputs**: 
   - **Impact vs. Effort Scoring**: LLM assigns 1–10 scores for strategic alignment, risk, and feasibility.
   - **Hidden Risk Detection**: The model flags risks humans overlook (e.g., "Monolithic flow creates a circular dependency in analytics pipeline").
   - **Explainable Recommendation**: Provides a definitive recommendation ("Use Isolated Flows") with a "Confidence Score" and "Conditions for Reversal."

**Test it in the app:**
- Go to **Decisions**.
- Open the **"Unified Checkout Strategy"** decision.
- Look at the Options. Click **"Analyze Options"**.
- Watch the AI synthesize the trade-offs live, turning unstructured ideation into auditable logic.

---

## 2. AIML6 — GenAI-Driven Adaptive Specification Engine
**Problem:** Specifications "rot" over time. A change in a PRD often contradicts a security doc, but no one notices until implementation.

### How SpectraAI Solves It (The "Adaptive Spec Engine"):
SpectraAI cross-references all documentation in its database to identify contradictions and misalignments the moment they occur.
1. **Document Embedding**: All specs (PRD, Technical, Security) are stored in a centralized Postgres database.
2. **The Conflict Scan**: The `SPEC_CONFLICT_PROMPT` compares two documents (e.g., `prd` vs. `technical`).
3. **Anomaly Detection**: 
   - **Contradiction Flagging**: Flagging that PRD Spec A requires "1-hour sessions" while Security Spec B requires "15-minute sessions."
   - **AI-Generated Resolution**: Instead of just flagging an error, the engine proposes the technical fix: *"Unify on 30-minutes as a compromise or implement Secure Extensions."*
   - **Loop Closure**: Once resolved, it prepares the system to update the versions of both documents simultaneously.

**Test it in the app:**
- Go to **Conflicts**.
- Locate the **"Session duration misalignment"** conflict.
- Look at how it explicitly links the **UX Protocol** vs **Security Architecture**.
- See the **AI Suggestion** field for the resolution strategy. This is not just content; it is a **diagnostic** solving document rot.

---

## 3. The Technical Bridge
The core innovation is that **Decisions (AIML5)** and **Specifications (AIML6)** are not isolated silos. 
- A **Decision** output can automatically generate or update a **Specification**.
- A **Specification Conflict** can automatically trigger a mandatory **Decision** artifact for the team to resolve.

This creates a **Closed Loop** where the AI is not just writing text code but is **maintaining the integrity of product logic**.
