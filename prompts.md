Here's your ultra-detailed prompt for SpectraAI using OpenRouter free models:

---

# MASTER PROMPT: Build SpectraAI — GenAI Product Decision & Adaptive Specification Platform

---

## OVERVIEW & VISION

Build **SpectraAI**, a production-ready full-stack web application that solves two deeply interconnected problems for modern product teams, unified into one intelligent workspace:

**Problem 1 (AIML5) — Decision Intelligence System**: Product teams have no structured way to reason through competing decisions, evaluate trade-offs, or document prioritization logic. They rely on gut feeling, scattered Notion docs, and verbal consensus. There is no explainable, repeatable decision framework.

**Problem 2 (AIML6) — Adaptive Specification Engine**: Product specs are written once and immediately start rotting. As requirements evolve through user feedback, technical discoveries, and market shifts, no system keeps documents synchronized, validates consistency across artifacts, or flags conflicts between specs.

**The Connection**: These two problems are a loop. Decisions produce specs. Specs surface new constraints that force new decisions. SpectraAI closes this loop — every decision automatically influences the living spec, and every spec update triggers a decision review. The AI acts as a continuous product reasoning layer across both.

---

## TECH STACK

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions, Streaming)
- **Database + Auth + Realtime**: Supabase (PostgreSQL, Row Level Security, Realtime subscriptions, Supabase Auth, Supabase Storage)
- **AI Provider**: OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`) using free models:
  - Primary reasoning: `deepseek/deepseek-r1:free` (for complex trade-off analysis)
  - Fast responses: `meta-llama/llama-3.3-70b-instruct:free` (for spec generation, summaries)
  - Fallback: `mistralai/mistral-7b-instruct:free`
- **Styling**: Tailwind CSS v4 with custom CSS variables design tokens
- **Animations**: Framer Motion
- **Rich Text Editor**: TipTap (for living spec documents)
- **Charts/Viz**: Recharts (for decision trade-off matrices)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Fonts**: Load via `next/font/google` — `Instrument_Serif` for display, `Geist` for UI, `JetBrains_Mono` for code/specs

---

## DESIGN SYSTEM — SLEEK DARK MINIMALISM

### Color Tokens (globals.css)
```css
:root {
  --bg-base: #07070E;
  --bg-surface: #0F0F1A;
  --bg-elevated: #16162A;
  --bg-hover: #1E1E30;
  --border-subtle: #1F1F35;
  --border-default: #2A2A45;
  --border-strong: #3D3D60;
  --accent: #7C6FE0;
  --accent-hover: #9487EF;
  --accent-muted: #7C6FE015;
  --accent-soft: #7C6FE030;
  --success: #22C55E;
  --success-muted: #22C55E15;
  --warning: #F59E0B;
  --warning-muted: #F59E0B15;
  --danger: #EF4444;
  --danger-muted: #EF444415;
  --info: #38BDF8;
  --text-primary: #EDEDF5;
  --text-secondary: #8888A8;
  --text-muted: #44445A;
  --text-inverse: #07070E;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### Layout Architecture
```
┌─────────────────────────────────────────────────────┐
│  TOPBAR: Logo | Breadcrumb | Search | Notif | Avatar │
├──────────┬──────────────────────────┬────────────────┤
│          │                          │                │
│ SIDEBAR  │    MAIN WORKSPACE        │  AI PANEL      │
│ 220px    │    flex-1                │  340px         │
│          │                          │  (collapsible) │
│ Nav      │  Context-aware view:     │                │
│ Projects │  - Decision Board        │  Streaming AI  │
│ Recent   │  - Spec Editor           │  responses,    │
│ Settings │  - Analytics             │  suggestions,  │
│          │                          │  conflict flags│
└──────────┴──────────────────────────┴────────────────┘

MOBILE (< 768px):
- Bottom tab bar: Home | Decisions | Specs | AI | Profile
- Sidebar becomes full-screen drawer (swipe right)
- AI panel becomes bottom sheet (swipe up)
- All modals: full-screen slide-up
- Touch-friendly 44px minimum tap targets
```

### Component Specs
- **Cards**: `bg-[--bg-surface] border border-[--border-subtle] rounded-[--radius-lg] p-5` with hover `border-[--border-default] bg-[--bg-elevated]` transition
- **Buttons**: 
  - Primary: `bg-[--accent] text-white rounded-[--radius-md] px-4 py-2 hover:bg-[--accent-hover]`
  - Ghost: `text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-hover]`
  - Danger: `bg-[--danger-muted] text-[--danger] border border-[--danger]/20`
- **AI Output Blocks**: `bg-[--bg-elevated] border-l-2 border-[--accent] rounded-r-[--radius-md] p-4` with streaming text animation using a blinking cursor `::after` pseudo-element
- **Badges**: Pill shape `rounded-full px-2.5 py-0.5 text-xs font-medium`
- **Input fields**: `bg-[--bg-elevated] border border-[--border-default] rounded-[--radius-md] focus:border-[--accent] focus:ring-2 focus:ring-[--accent-muted]`
- **Sidebar items**: `rounded-[--radius-md] px-3 py-2 text-sm` with active state `bg-[--accent-muted] text-[--accent]`

---

## DATABASE SCHEMA (Complete Supabase SQL)

Run this entire SQL in the Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROJECTS
-- =====================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- DECISIONS (AIML5)
-- =====================
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  context TEXT NOT NULL,              -- What problem/goal is this decision for?
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'decided', 'revisiting', 'closed')),
  final_choice_id UUID,               -- FK to options, set after decision
  decision_rationale TEXT,            -- AI-generated + human-edited final explanation
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- DECISION OPTIONS
-- =====================
CREATE TABLE decision_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pros TEXT[],
  cons TEXT[],
  effort_score INT CHECK (effort_score BETWEEN 1 AND 10),
  impact_score INT CHECK (impact_score BETWEEN 1 AND 10),
  risk_score INT CHECK (risk_score BETWEEN 1 AND 10),
  ai_analysis TEXT,                   -- AI-generated analysis of this option
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- DECISION COMMENTS / REASONING TRAIL
-- =====================
CREATE TABLE decision_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID REFERENCES decisions(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_ai BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SPECIFICATIONS (AIML6)
-- =====================
CREATE TABLE specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'prd' CHECK (type IN ('prd', 'technical', 'design', 'api', 'user_story', 'acceptance_criteria')),
  content JSONB,                      -- TipTap editor JSON content
  content_text TEXT,                  -- Plaintext for AI processing
  version INT DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'outdated', 'deprecated')),
  linked_decisions UUID[],            -- Array of decision IDs that influenced this spec
  consistency_score INT,              -- 0-100 AI-computed consistency rating
  last_validated_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- SPEC VERSIONS (history)
-- =====================
CREATE TABLE specification_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spec_id UUID REFERENCES specifications(id) ON DELETE CASCADE NOT NULL,
  version INT NOT NULL,
  content JSONB,
  content_text TEXT,
  change_summary TEXT,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- CONFLICTS & GAPS (AIML6 core)
-- =====================
CREATE TABLE spec_conflicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  spec_a_id UUID REFERENCES specifications(id) ON DELETE CASCADE,
  spec_b_id UUID REFERENCES specifications(id) ON DELETE CASCADE,
  conflict_type TEXT CHECK (conflict_type IN ('contradiction', 'gap', 'ambiguity', 'duplicate', 'outdated_reference')),
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored', 'wont_fix')),
  ai_resolution_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- =====================
-- AI SESSIONS (audit trail)
-- =====================
CREATE TABLE ai_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL,         -- 'decision_analysis', 'spec_generation', 'conflict_scan', 'sync_check'
  input_context TEXT,
  output TEXT,
  model_used TEXT,
  tokens_used INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE specification_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE spec_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

-- Projects: owner only
CREATE POLICY "owner_access" ON projects FOR ALL USING (auth.uid() = owner_id);
-- Cascade auth via project ownership for all child tables
CREATE POLICY "project_member_decisions" ON decisions FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = decisions.project_id AND owner_id = auth.uid())
);
CREATE POLICY "project_member_options" ON decision_options FOR ALL USING (
  EXISTS (SELECT 1 FROM decisions d JOIN projects p ON d.project_id = p.id WHERE d.id = decision_options.decision_id AND p.owner_id = auth.uid())
);
CREATE POLICY "project_member_specs" ON specifications FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = specifications.project_id AND owner_id = auth.uid())
);
CREATE POLICY "project_member_conflicts" ON spec_conflicts FOR ALL USING (
  EXISTS (SELECT 1 FROM projects WHERE id = spec_conflicts.project_id AND owner_id = auth.uid())
);

-- =====================
-- REALTIME
-- =====================
ALTER PUBLICATION supabase_realtime ADD TABLE decisions;
ALTER PUBLICATION supabase_realtime ADD TABLE specifications;
ALTER PUBLICATION supabase_realtime ADD TABLE spec_conflicts;
```

---

## FILE STRUCTURE

```
spectra-ai/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, providers, toaster
│   ├── page.tsx                      # Landing/marketing page
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── (app)/
│       ├── layout.tsx                # App shell: sidebar + topbar + AI panel
│       ├── dashboard/page.tsx        # Home: recent projects, activity, summary
│       ├── projects/
│       │   ├── page.tsx              # All projects grid
│       │   ├── new/page.tsx          # Create project form
│       │   └── [projectId]/
│       │       ├── layout.tsx        # Project context provider
│       │       ├── page.tsx          # Project overview dashboard
│       │       ├── decisions/
│       │       │   ├── page.tsx      # All decisions for project
│       │       │   ├── new/page.tsx  # Create decision wizard
│       │       │   └── [decisionId]/
│       │       │       └── page.tsx  # Decision detail: options, analysis, trail
│       │       ├── specs/
│       │       │   ├── page.tsx      # All specs list + consistency scores
│       │       │   ├── new/page.tsx  # Create spec (type selector + editor)
│       │       │   └── [specId]/
│       │       │       ├── page.tsx  # Spec editor + AI sidebar
│       │       │       └── history/page.tsx  # Version history diff view
│       │       ├── conflicts/
│       │       │   └── page.tsx      # All detected conflicts + resolution center
│       │       └── analytics/
│       │           └── page.tsx      # Project-level decision + spec health metrics
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── AIPanel.tsx               # Collapsible right panel
│   │   └── MobileNav.tsx             # Bottom tab bar
│   ├── decisions/
│   │   ├── DecisionCard.tsx
│   │   ├── DecisionWizard.tsx        # Multi-step: context → options → AI analysis → decide
│   │   ├── OptionCard.tsx            # Shows scores, pros/cons
│   │   ├── TradeoffMatrix.tsx        # Recharts radar/scatter chart
│   │   ├── DecisionTimeline.tsx      # Reasoning trail/audit
│   │   └── AIDecisionAnalysis.tsx    # Streaming AI output component
│   ├── specs/
│   │   ├── SpecCard.tsx
│   │   ├── SpecEditor.tsx            # TipTap rich text editor
│   │   ├── VersionDiff.tsx           # Side-by-side diff view
│   │   ├── ConsistencyBadge.tsx      # Score indicator 0-100
│   │   └── ConflictAlert.tsx         # Inline conflict warning
│   ├── conflicts/
│   │   ├── ConflictList.tsx
│   │   ├── ConflictCard.tsx
│   │   └── ResolutionPanel.tsx
│   ├── ai/
│   │   ├── StreamingText.tsx         # Animated streaming text renderer
│   │   ├── AIPromptBar.tsx           # Input to ask AI anything in context
│   │   └── AIInsightChip.tsx         # Inline suggestion pill
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Modal.tsx
│       ├── Drawer.tsx                # Mobile slide-up
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Tabs.tsx
│       ├── Tooltip.tsx
│       ├── Skeleton.tsx
│       └── ProgressBar.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client (cookies)
│   │   └── types.ts                  # Generated DB types
│   ├── openrouter/
│   │   ├── client.ts                 # OpenRouter fetch wrapper
│   │   ├── models.ts                 # Model constants
│   │   └── prompts/
│   │       ├── decision-analysis.ts  # System + user prompts for AIML5
│   │       ├── spec-generation.ts    # Prompts for AIML6 spec writing
│   │       ├── conflict-scan.ts      # Prompts for conflict detection
│   │       └── sync-check.ts         # Prompts for consistency validation
│   └── utils.ts
├── actions/
│   ├── decisions.ts                  # Server actions: CRUD + trigger AI
│   ├── specifications.ts             # Server actions: CRUD + versioning
│   ├── conflicts.ts                  # Server actions: scan, resolve
│   └── ai.ts                         # Server actions: all AI calls
├── hooks/
│   ├── useDecisions.ts
│   ├── useSpecifications.ts
│   ├── useConflicts.ts
│   ├── useAIStream.ts                # Hook to consume streaming AI responses
│   └── useRealtime.ts                # Supabase realtime subscriptions
└── stores/
    ├── aiPanelStore.ts               # Zustand: AI panel state, context, history
    └── projectStore.ts               # Zustand: active project, breadcrumbs
```

---

## OPENROUTER INTEGRATION

### `/lib/openrouter/client.ts`
```typescript
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export const MODELS = {
  reasoning: "deepseek/deepseek-r1:free",
  fast: "meta-llama/llama-3.3-70b-instruct:free",
  fallback: "mistralai/mistral-7b-instruct:free",
};

export async function callOpenRouter({
  model = MODELS.fast,
  messages,
  stream = false,
  temperature = 0.7,
  max_tokens = 2000,
}: {
  model?: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}) {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL!,
      "X-Title": "SpectraAI",
    },
    body: JSON.stringify({ model, messages, stream, temperature, max_tokens }),
  });

  if (!res.ok) {
    // Retry with fallback model
    return callOpenRouter({ model: MODELS.fallback, messages, stream, temperature, max_tokens });
  }

  return res;
}
```

---

## FEATURE DETAILS — AIML5: DECISION INTELLIGENCE

### 1. Decision Creation Wizard (3-step modal)

**Step 1 — Context**: User fills in decision title (e.g., "Choose authentication strategy") and a free-text context block describing the problem, constraints, goals, timeline, and team size. Rich text supported. A character counter encourages thoroughness (min 100 chars for AI quality).

**Step 2 — Options**: User adds 2–5 options. Each option has: title, description, and optionally manual pros/cons. User can also click "Let AI suggest options" — this calls OpenRouter with the decision context and returns 3 suggested alternatives with auto-filled pros/cons, streamed inline.

**Step 3 — AI Analysis**: User clicks "Analyze with AI". The system sends all options to `deepseek/deepseek-r1:free` with a structured prompt requesting:
- Per-option effort/impact/risk scores (1–10)
- Comparative analysis paragraph
- Recommended option with confidence level
- Hidden assumptions and risks
- What would change this recommendation
All output streams token-by-token into the UI with animated reveal. User can then override any AI score manually.

### 2. Decision Detail Page

**Trade-off Matrix**: A Recharts RadarChart showing each option plotted across 5 axes: Impact, Effort (inverted), Risk (inverted), Feasibility, Strategic Alignment. Options shown as colored overlapping polygons. Hovering reveals values.

**Decision Timeline**: Vertical timeline component showing every event: decision created → options added → AI analysis run → comments → decision made. Each event has timestamp, actor (human or AI avatar), and content preview.

**Reasoning Trail**: Every AI response is stored in `decision_comments` with `is_ai: true`. Humans can reply, annotate, or override. This creates a permanent audit log of WHY a decision was made — exportable as PDF.

**"Make Decision" Action**: Promotes one option to `final_choice_id`, sets status to `decided`, triggers AI to write a final rationale paragraph, and optionally auto-creates a linked specification document.

### 3. Decisions List Page

Cards for each decision showing: title, status badge, number of options, last activity, linked specs count, consistency score. Filter by status, sort by recency or risk level. A global "Run AI Review" button re-analyzes all open decisions for staleness.

---

## FEATURE DETAILS — AIML6: ADAPTIVE SPECIFICATION ENGINE

### 1. Spec Editor

Full TipTap editor with custom extensions: heading hierarchy, requirement blocks (with unique IDs like `REQ-001`), acceptance criteria checklist, decision reference chips (click to open linked decision in side panel), and status tags inline.

Autosave every 30 seconds using Supabase Server Actions. Each save snapshots the previous version into `specification_versions`.

**AI Writing Toolbar** (appears on text selection):
- "Improve clarity" — rewrites selected text to be unambiguous
- "Expand this" — elaborates the selected requirement
- "Add acceptance criteria" — generates Given/When/Then scenarios
- "Flag for review" — marks section with a visual warning badge

### 2. Consistency Validator

Triggered: (a) manually by user, (b) automatically after every 5 saves, (c) when a linked decision changes.

**Process**:
1. Collect all spec `content_text` fields for the project
2. Send to `meta-llama/llama-3.3-70b-instruct:free` with the conflict-scan system prompt
3. AI returns structured JSON: array of conflicts/gaps with `spec_a_id`, `spec_b_id`, `conflict_type`, `description`, `severity`, `resolution_suggestion`
4. Upsert into `spec_conflicts` table
5. Update `consistency_score` (0-100) on each spec: 100 minus penalty per conflict by severity
6. Realtime subscription pushes updates to all open browser tabs

**Conflict Types Detected**:
- **Contradiction**: Spec A says "users must verify email before login", Spec B says "users can login immediately"
- **Gap**: A feature is referenced in one spec but never defined
- **Ambiguity**: Vague terms like "should", "fast", "large" without measurable definitions
- **Duplicate**: Two specs defining the same requirement differently
- **Outdated Reference**: A spec references a decision that was reversed

### 3. Conflict Resolution Center (`/conflicts`)

Full-page view with three columns:
- **Left**: Filterable list of all conflicts (by severity, type, spec, status)
- **Center**: Conflict detail — shows the two conflicting excerpts side-by-side, highlighted diff, AI resolution suggestion
- **Right**: Action panel — "Accept AI suggestion", "Open Spec A", "Open Spec B", "Mark as Won't Fix", "Add manual resolution note"

Resolving a conflict re-triggers consistency scoring for affected specs.

### 4. Version History & Diff View (`/specs/[id]/history`)

Timeline of all saved versions. Click any two to compare side-by-side. Text diff shown with green additions and red deletions, character-level precision. Each version shows: timestamp, change summary (AI-generated one-line summary of what changed), and which decisions were linked at that version.

---

## FEATURE DETAILS — THE BRIDGE (AIML5 ↔ AIML6)

### Decision → Spec Auto-Sync
When a decision status changes to `decided`:
1. AI generates a spec update suggestion: "Based on the decision to use OAuth2, update the Authentication spec to reflect..." 
2. A banner appears in all linked specs: "⚠ Linked decision updated — review recommended"
3. User can click "Apply AI suggestion" to insert the change into the spec editor for review

### Spec → Decision Feedback Loop
When the consistency validator detects a conflict that stems from an architectural assumption:
1. It creates a new linked decision automatically: "Conflict detected: inconsistent auth requirements — decision needed"
2. This decision appears in the Decision board pre-filled with context from both conflicting specs
3. Resolving the decision resolves the conflict

### Project Overview Dashboard (`/projects/[id]`)
Shows unified health metrics:
- **Decision Health**: X open decisions, Y decisions overdue for review, Z with high risk
- **Spec Health**: Overall consistency score (large number, color-coded), X conflicts open, Y specs marked outdated
- **Activity Feed**: Realtime stream of all project events (decisions made, specs updated, conflicts detected, AI sessions run)
- **AI Summary Card**: "Your project has 3 critical decisions pending and 2 spec conflicts that may block implementation. Recommended next action: resolve the authentication contradiction between PRD v4 and Technical Spec v2."

---

## AI PROMPT TEMPLATES

### Decision Analysis Prompt
```typescript
export const DECISION_ANALYSIS_PROMPT = (decision: Decision, options: Option[]) => ({
  system: `You are a senior product strategist with expertise in product decision frameworks. 
You analyze product decisions with structured reasoning, surfacing hidden trade-offs and risks.
Always respond in valid JSON matching the schema provided. Be specific, not generic.`,
  user: `Analyze this product decision:

DECISION: ${decision.title}
CONTEXT: ${decision.context}

OPTIONS:
${options.map((o, i) => `
Option ${i + 1}: ${o.title}
Description: ${o.description}
Known Pros: ${o.pros?.join(', ') || 'none'}
Known Cons: ${o.cons?.join(', ') || 'none'}
`).join('\n')}

Return JSON with this exact schema:
{
  "options_analysis": [
    {
      "option_id": "string",
      "effort_score": 1-10,
      "impact_score": 1-10,
      "risk_score": 1-10,
      "feasibility_score": 1-10,
      "strategic_alignment_score": 1-10,
      "hidden_risks": ["string"],
      "assumptions": ["string"],
      "analysis": "2-3 paragraph detailed analysis"
    }
  ],
  "recommendation": {
    "recommended_option": "option title",
    "confidence": "low|medium|high",
    "rationale": "detailed rationale",
    "conditions_that_change_recommendation": ["string"]
  },
  "comparative_summary": "paragraph comparing all options"
}`
});
```

### Conflict Scan Prompt
```typescript
export const CONFLICT_SCAN_PROMPT = (specs: Spec[]) => ({
  system: `You are a technical product analyst specializing in requirements validation.
You identify contradictions, gaps, ambiguities, and duplicates across product specification documents.
Respond ONLY in valid JSON. No preamble.`,
  user: `Scan these product specification documents for conflicts, gaps, and inconsistencies:

${specs.map(s => `
=== SPEC: ${s.title} (ID: ${s.id}, Type: ${s.type}) ===
${s.content_text}
`).join('\n\n')}

Return JSON:
{
  "conflicts": [
    {
      "spec_a_id": "uuid",
      "spec_b_id": "uuid or null if single-spec issue",
      "conflict_type": "contradiction|gap|ambiguity|duplicate|outdated_reference",
      "severity": "low|medium|high|critical",
      "description": "specific description of the conflict",
      "affected_sections": ["quote from spec A", "quote from spec B"],
      "resolution_suggestion": "specific actionable suggestion"
    }
  ],
  "overall_consistency_score": 0-100,
  "summary": "one paragraph summary of spec health"
}`
});
```

---

## PAGE-BY-PAGE IMPLEMENTATION NOTES

### Landing Page (`/`)
- Hero: Large `Instrument Serif` italic headline "Product decisions, finally reasoned." with a subtle animated gradient mesh background
- Two feature sections: one for AIML5 (Decision Intelligence), one for AIML6 (Adaptive Specs)
- A visual showing the feedback loop between decisions and specs (SVG diagram, animated with Framer Motion path drawing)
- CTA: "Start building" → `/signup`
- No pricing section (hackathon demo)

### Auth Pages (`/login`, `/signup`)
- Centered single-column layout on dark bg
- Supabase Auth with email/password
- Magic link option via Supabase
- After login → redirect to `/dashboard`

### Dashboard (`/dashboard`)
- Greeting with user's name
- "Your Projects" grid (3 columns desktop, 1 mobile)
- Each project card: name, description, decision count, spec count, consistency score ring
- "Recent Activity" feed (last 10 events across all projects)
- "New Project" button → modal with name + description fields, creates project row, redirects

### Project Overview (`/projects/[id]`)
- Tabs: Overview | Decisions | Specs | Conflicts | Analytics
- Overview tab: health widgets (described above) + activity feed
- Each tab content is the respective feature list/board

---

## STREAMING IMPLEMENTATION

Use Next.js Route Handlers for streaming AI responses:

```typescript
// app/api/ai/analyze-decision/route.ts
export async function POST(req: Request) {
  const { decisionId } = await req.json();
  // Fetch decision + options from Supabase
  // Build prompt
  const response = await callOpenRouter({ model: MODELS.reasoning, messages, stream: true });
  
  // Return readable stream to client
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' }
  });
}
```

Client-side hook `useAIStream` consumes this with `ReadableStream` and updates state token-by-token, rendered by `StreamingText` component which shows a blinking cursor at the end while streaming.

---

## MOBILE RESPONSIVENESS RULES

- All grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Sidebar: hidden on mobile, opens as `fixed inset-0 z-50` drawer on hamburger tap
- AI Panel: hidden on mobile, accessible via floating AI button (bottom right, 56px circle, accent color) that opens a bottom sheet drawer
- Decision Wizard: full-screen on mobile with bottom CTA bar
- TipTap Editor: simplified toolbar on mobile (only 5 most-used actions visible, rest in overflow menu)
- Trade-off RadarChart: 280px height on mobile, full on desktop
- All modals: `sm:rounded-xl rounded-none` with `sm:max-w-lg w-full` — full screen slide-up on mobile

---

## ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## IMPLEMENTATION SEQUENCE

Build in this exact order to have a working demo fastest:

1. Supabase project setup + run full SQL schema
2. Next.js project init + Tailwind + design tokens in `globals.css`
3. Auth flow (login/signup with Supabase Auth)
4. App shell layout: sidebar + topbar + AI panel skeleton
5. Projects CRUD (list, create, view)
6. Decisions CRUD + Decision Wizard (no AI yet)
7. OpenRouter integration + Decision AI Analysis (streaming)
8. Trade-off Matrix chart
9. Specifications CRUD + TipTap editor
10. Spec versioning on save
11. Conflict Scanner (OpenRouter) + Conflicts page
12. Decision→Spec bridge (auto-sync banners, linked decisions)
13. Project Overview dashboard with health metrics
14. Mobile responsiveness pass
15. Landing page

---

## DEVELOPMENT & REFINEMENT LOG (FIXES & DEBUGGING)

1. **"remove the wide solid border from everywehre use minimalstic thin border"**
2. **"there are still so many borders in dashboaard ai capabilities ai system status there are too many fix that"**
3. **"inside project page the decision engine, specification and conflict scan font is black fix this make it white"**
4. **"the reasoning and matrix data is colliding inside reasoning you should show reasoning as per both option fix that"**
5. **"also the chat section in ai panel is not working fix that"**
6. **"not good when i click run ai analytics in the decision engine you should give analytics right now you are giving the data that needed for matrix fix this"**
7. **"make a separate function and run it to get analytics when get analysis is clicked"**
8. **"inside ai analysis component data should be shown in paragraph and bullet points with a final verdict of reasoning both"**
9. **"right now u have hardcoded monolithic flow and all it should be dynamic based on the decisions from db fix this"**
10. **"dont use hardcoded values in analyze-decision or score-decision anymore"**
11. **"Recommendation: Requires deep analysis... DONT GIVE THIS GIVE ONE FINAL ANSWER"**
12. **"include cost and all fields in while creating decision make changes in db so that based on specific requirement can give decision (cost, time, scalability, risk)"**
13. **"create more detailed demo data based on all constraint so that all app can work fine dont stop until fixing all this"**
14. **"in sidebar remove border from ai engine active and the logo of spectra ai"**
15. **"the dashboard text is sometimes overlapping with cards fix padding"**
16. **"fix the ai-assistant side panel toggle—it should slide smoothly using framer motion"**
17. **"update the breadcrumbs in topbar to correctly reflect the project name from the database"**
18. **"the charts are not responsive on mobile screens fix the recharts container"**
19. **"implement soft pastel colors everywhere transition from dark mode to light mode soft lux"**
20. **"use bg-white/70 with backdrop-blur-md for all cards in the dashboard"**
21. **"buttons should have rounded-full pills shape and vibrant gradients"**
22. **"ensure the ai streaming text has a blinking cursor effect using custom css"**
23. **"fix the login page—it should look premium with a soft blurred background"**
24. **"the sidebar active navigation items should have a 2px left border but no main border around them"**
25. **"optimize the conflict scanner to only analyze changed documents to save tokens"**
26. **"add a 'thinking' state indicator to the ai status pill when processing"**
27. **"fix the tip tap editor to preserve line breaks when saving to supabase"**
28. **"ensure consistency score badges color change based on the numerical value"**
29. **"remove the scrollbars or make them extremely thin and purple styled"**
30. **"the hero section needs an 'Orb Float' animation to feel alive"**
31. **"fix the matrix axis labels—they should be white or high contrast text"**
32. **"ensure the ai reasoner always addresses the business constraints like cost and time directly"**
33. **"the conflict resolution panel side-by-side view is broken on webkit browsers fix layout"**
34. **"add a tool-tip to the conflict severity level explaining the ai's choice"**
35. **"the 'Create Decision' button in projects list is missing its icon fix that"**
36. **"ensure the ai chat history is persisted in local storage so it doesnt disappear on refresh"**
37. **"the app feels too slow—optimize the server actions to prevent waterfall fetches"**
38. **"fix the typography—ensure Instrument Serif is only used for headings"**
39. **"the logout button in sidebar doesn't redirect correctly fix the supabase auth signout"**
40. **"final polish: align all dashboard cards to a 12-column grid system"**
