'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function seedDemoData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('You must be logged in to seed data.')

  // 1. Create a Project — Unified SaaS Ecosystem
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert([
      { 
        name: 'Athena E-Commerce Platform', 
        description: 'Next-gen enterprise commerce with unified B2B and B2C checkout flows.',
        owner_id: user.id
      }
    ])
    .select()
    .single()

  if (projectError) throw new Error(projectError.message)

  // 2. AIML5 — DECISION INTELLIGENCE MODULE (Architecture/Prioritization)
  const { data: decision, error: decisionError } = await supabase
    .from('decisions')
    .insert([
      {
        project_id: project.id,
        title: 'Unified Checkout Strategy',
        context: 'We need to decide whether to use a single monolithic checkout flow for both Guest and Enterprise B2B users, or split them into isolated flows. This will impact developer effort and B2C conversion rates vs B2B flexibility.',
        cost_constraint: 'Moderate to High. We can absorb upfront technical debt costs if it strictly reduces maintenance over 3 years.',
        time_constraint: 'Must be deliverable within a 3-month release window.',
        scalability_requirement: 'B2C must handle flash sales (10k CCU). B2B requires bespoke logic without impacting B2C uptime.',
        risk_tolerance: 'Zero tolerance for B2C downtime or regressions caused by B2B feature deployments.',
        status: 'open',
        created_by: user.id
      }
    ])
    .select()
    .single()

  if (decisionError) throw new Error(decisionError.message)

  // Options for AIML5 to reason through trade-offs
  await supabase.from('decision_options').insert([
    {
      decision_id: decision.id,
      title: 'Monolithic Flow',
      description: 'One codebase for all checkouts. Feature toggles handle differences.',
      pros: ['Single code source', 'Easier bug fixing', 'Unified analytics'],
      cons: ['Complex logic branches', 'High risk of breaking B2C with B2B changes'],
      effort_score: 3,
      impact_score: 8,
      risk_score: 5
    },
    {
      decision_id: decision.id,
      title: 'Isolated Flows',
      description: 'Separate codebases for B2B and B2C checkouts.',
      pros: ['Perfect isolation', 'Maximum checkout speed (B2C)', 'B2B specialized features'],
      cons: ['Duplicate maintenance', 'Shared logic drifting over time'],
      effort_score: 7,
      impact_score: 9,
      risk_score: 3
    }
  ])

  // 3. AIML6 — ADAPTIVE SPECIFICATION ENGINE (Cross-Artifact Consistency)
  // Spec A: UX PRD
  const { data: spec1 } = await supabase
    .from('specifications')
    .insert([
      {
        project_id: project.id,
        title: 'Checkout Flow UX Protocol',
        type: 'prd',
        content_text: 'The checkout process must support anonymous users. All sessions must remain valid for exactly 1 hour. Total checkout steps must not exceed 3.',
        content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "The checkout process must support anonymous users. All sessions must remain valid for exactly 1 hour. Total checkout steps must not exceed 3." }] }] },
        version: 1,
        consistency_score: 80,
        created_by: user.id
      }
    ]).select().single()

  // Spec B: Security Architecture
  const { data: spec2 } = await supabase
    .from('specifications')
    .insert([
      {
        project_id: project.id,
        title: 'Platform Security Architecture',
        type: 'technical',
        content_text: 'For fraud prevention, session tokens for anonymous checkout are valid for 15 minutes only. Enterprise B2B sessions are governed by 24-hour expiration.',
        content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "For fraud prevention, session tokens for anonymous checkout are valid for 15 minutes only. Enterprise B2B sessions are governed by 24-hour expiration." }] }] },
        version: 1,
        consistency_score: 65,
        created_by: user.id
      }
    ]).select().single()

  // 4. THE CONFLICT — Demonstration of AIML6 Flagging Rot/Inconsistency
  if (spec1 && spec2) {
    await supabase.from('spec_conflicts').insert([
      {
        project_id: project.id,
        spec_a_id: spec1.id,
        spec_b_id: spec2.id,
        conflict_type: 'contradiction',
        description: 'Session duration misalignment. UX PRD requires 1-hour sessions for Guest checkout, but Security Architecture mandates 15-minute expiration for fraud prevention.',
        severity: 'high',
        ai_resolution_suggestion: 'Unify on 30-minutes as a security-aware compromise, or implement a "Secure Extension" flow if the user is active, updating both the UX PRD (V2) and Security (V3).',
        status: 'open'
      }
    ])
  }

  revalidatePath('/dashboard')
  revalidatePath(`/projects/${project.id}`)
  
  return project.id
}
