'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createDecision(projectId: string, formData: FormData, optionsData: any[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const title = formData.get('title') as string
  const context = formData.get('context') as string
  const cost_constraint = formData.get('cost_constraint') as string
  const time_constraint = formData.get('time_constraint') as string
  const scalability_requirement = formData.get('scalability_requirement') as string
  const risk_tolerance = formData.get('risk_tolerance') as string

  // Insert decision
  const { data: decision, error: decisionError } = await supabase
    .from('decisions')
    .insert([{ 
      project_id: projectId, 
      title, 
      context, 
      cost_constraint,
      time_constraint,
      scalability_requirement,
      risk_tolerance,
      created_by: user?.id 
    }])
    .select()
    .single()

  if (decisionError) throw new Error(decisionError.message)

  // Insert options
  const formattedOptions = optionsData.map(o => ({
    decision_id: decision.id,
    title: o.title,
    description: o.description,
    pros: o.pros,
    cons: o.cons
  }))

  if (formattedOptions.length > 0) {
    const { error: optionsError } = await supabase
      .from('decision_options')
      .insert(formattedOptions)
      
    if (optionsError) throw new Error(optionsError.message)
  }

  revalidatePath(`/projects/${projectId}/decisions`)
  return decision
}

export async function getDecisions(projectId: string) {
  const supabase = await createClient()
  const { data: decisions, error } = await supabase
    .from('decisions')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
    
  if (error || !decisions) return []

  const enriched = await Promise.all(decisions.map(async (d: any) => {
    const { count } = await supabase.from('decision_options').select('*', { count: 'exact', head: true }).eq('decision_id', d.id)
    return { ...d, decision_options: [{ count: count || 0 }] }
  }))

  return enriched
}

export async function getDecision(decisionId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('decisions')
    .select('*, decision_options(*), decision_comments(*)')
    .eq('id', decisionId)
    .single()
    
  if (error) return null
  return data
}
