# SpectraAI

Product decisions, finally reasoned. Adaptive Specification Engine.

SpectraAI solves two deeply interconnected problems for modern product teams:
1. **Decision Intelligence**: A structured way to reason through competing decisions, evaluate trade-offs, and document logic.
2. **Adaptive Specification**: Keeping specs synchronized across decisions to prevent documentation rot and flag contradictions.

## Technologies Used
- Next.js 15 (App Router, Server Components, Streaming)
- Supabase (PostgreSQL, Auth, RLS)
- OpenRouter API (deepseek-r1:free, llama-3.3-70b-instruct:free)
- Tailwind CSS v4 + Framer Motion
- TipTap (Rich Text Editor)
- Recharts (Trade-off matrices)
- Zustand, React Hook Form, Zod

## Features Implemented
- ✅ Supabase Database & Auth (Google OAuth + Email) complete with Row Level Security.
- ✅ Custom Tailwind CSS v4 design system with modern CSS variables, dark minimalist aesthetic.
- ✅ Landing Page with animated Framer Motion hero gradients and SVG path diagrams.
- ✅ Dashboard and Project Management CRUD.
- ✅ Decision Wizard: 3-step decision creation with options and AI-powered context evaluation.
- ✅ AI Streaming Route: App router API leveraging OpenRouter to stream token-by-token DeepSeek-R1 response for decision trade-off analysis.
- ✅ Recharts Radar Chart for Impact vs Effort vs Risk across decision options.
- ✅ Adaptive Specifications: TipTap rich text editor with auto-save and history integration.
- ✅ Conflicts Dashboard to view severity-based spec inconsistencies.
- ✅ Persistent AI Panel for context-aware suggestions.

## Setup Instructions
1. Install dependencies: `npm install`
2. Create `.env.local` and configure your Supabase URL, Anon Key, and OpenRouter API Key.
3. Apply the SQL migration provided in Supabase SQL editor to create the necessary tables and RLS policies.
4. Run locally: `npm run dev`
