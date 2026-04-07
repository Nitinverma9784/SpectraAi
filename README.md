# SpectraAI: GenAI Product Strategist & Adaptive Spec Engine

[![AI Status](https://img.shields.io/badge/AI%20Engine-Active-success?style=flat-square&logo=openai)](https://spectra-ai.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blueviolet?style=flat-square&logo=supabase)](https://supabase.com)

> **Product decisions, finally reasoned.** SpectraAI is a GenAI-powered platform designed to solve product documentation rot and unstructured decision-making. It closes the loop between high-level architectural decisions and "living" specification documents.

---

## 🚀 The Core Problems Solved

SpectraAI was built to address two fundamental gaps in modern product management:

### 1. AIML5: Decision Intelligence & Trade-off Reasoning
**The Problem:** Product teams often make critical decisions based on "gut feeling" or messy Notion tables, leading to expensive rework when trade-offs aren't documented.
**The Solution:** A structured GenAI reasoning engine that evaluates competing options against project-specific constraints (Cost, Time, Scalability, Risk) and generates an auditable, explainable logic trail.

### 2. AIML6: Adaptive Specification Engine
**The Problem:** Specifications (PRDs, Technical Docs) are static; they "rot" the moment a decision changes or a new requirement is added. Conflict detection is manual and error-prone.
**The Solution:** A continuous synchronization loop where AI cross-references all specification artifacts in real-time. If Document A (Security) contradicts Document B (UX), SpectraAI flags it and proposes a resolution strategy.

---

## ✨ Key Features

- **🧠 Decision Intelligence Module:** Formalize dilemmas, list competing options, and trigger deep AI analysis to visualize trade-offs on interactive Radar Charts.
- **🛡️ Adaptive Spec Engine:** Create living PRDs and Technical Specs with a rich-text editor (Tiptap) that auto-validates against your project's decisions.
- **⚡ Conflict Scanner:** A pairwise document analysis engine that detects high-severity logic contradictions (e.g., Session Duration Misalignment) and suggests technical fixes.
- **🤖 Continuous Reasoning Loop:** Decisions automatically inform spec validation rules, and spec conflicts spawn mandatory decision artifacts for the team.
- **⚡ Groq Lightning Hints:** Get sub-second strategic product insights as you type, powered by high-speed Groq inference.
- **📊 Quantitative Trade-off Matrix:** Recharts-powered visualization of Impact, Effort, Risk, and Strategic Alignment for every product choice.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) | Server Components and fast streaming responses. |
| **Database** | Supabase (Postgres) | Real-time synchronization and robust RLS security. |
| **AI Strategy** | OpenRouter (Grok-2 / DeepSeek) | Best-in-class architectural reasoning and logic. |
| **Fast Inference**| Groq (Llama-3) | Real-time UI hints and immediate feedback. |
| **Visuals** | Recharts & D3 | Explaining AI scores through data visualization. |
| **Styling** | Tailwind CSS v4 | Cutting-edge minimalist "Dark Mode" aesthetic. |

---

## 📥 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/SpectraAi.git
cd SpectraAi
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Providers
OPENROUTER_API_KEY=your_openrouter_key
GROQ_API_KEY=your_groq_key
```

### 3. Database Setup
Execute the `UPDATE_DB.sql` script in your Supabase SQL Editor. This initializes the schema for:
- `projects`, `decisions`, `decision_options`
- `specifications`, `spec_conflicts`
- RLS Policies for multi-tenant security.

### 4. Launch
```bash
npm run dev
```

---

## 🧪 Testing with Seed Data (Recommended)

To experience the full logic of SpectraAI without manual entry, use the built-in **Demo Seeder**:

1. Log in to the application.
2. In the **Dashboard** (`/dashboard`), click the **"Load Demo Data"** button (Sparkles icon).
3. This will instantly generate the **"Athena E-Commerce Platform"** demo, including:
   - A complex **Unified Checkout Strategy** decision.
   - Two competing architectural options (Monolithic vs Isolated).
   - High-fidelity **UX PRD** and **Security Spec** documents.
   - An active **Logic Conflict** (Session Duration Contradiction) for you to resolve.

---

## 🔍 Step-by-Step Test Walkthrough

### Part A: Testing Decision Intelligence (AIML5)
1. Open the **Athena E-Commerce** project and go to **Decisions**.
2. Select **"Unified Checkout Strategy"**.
3. Observe the **Decision Matrix** (Radar Chart) showing Impact vs Risk.
4. Click **"Analyze Options"** in the AI Panel.
5. **Validation:** Watch as the AI streams a deep-dive comparison, weighing development effort against scalability, and providing a "Logical Winner."

### Part B: Testing Adaptive Spec Engine (AIML6)
1. Go to the **Conflicts** tab in the sidebar.
2. Observe the conflict: **"Session duration logic mismatch."**
3. Notice how it flags that the **UX Protocol** (1 hour) contradicts the **Security Spec** (15 minutes).
4. View the **AI Resolution Suggestion**: The engine doesn't just flag the error; it proposes a technical fix (Silent Refresh pattern) to satisfy both constraints.
5. **Run Scan:** Click the "Run Scan" button to trigger a live pairwise cross-validation of your documents across the database.

---

## 📜 Master Logic: The Closed Loop
SpectraAI operates on a **Closed Logic Loop**:
1. **Decision Output** -> Automatically updates/suggests changes to **Specifications**.
2. **Specification Conflict** -> Automatically triggers a **Decision Record** for the team to resolve the alignment gap.

This ensures that the "source of truth" in your product docs is never out of sync with the "strategic logic" of your decisions.

---

Built with ❤️ for modern product teams.
