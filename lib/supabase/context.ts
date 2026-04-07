import { createClient } from './server'

export async function getProjectContext(projectId: string) {
  const supabase = await createClient()

  // Fetch project details
  const { data: project } = await supabase
    .from('projects')
    .select('name, description')
    .eq('id', projectId)
    .single()

  // Fetch decisions and their options
  const { data: decisions } = await supabase
    .from('decisions')
    .select(`
      id,
      title,
      context,
      status,
      decision_options (
        id,
        title,
        description,
        is_recommended
      )
    `)
    .eq('project_id', projectId)

  // Fetch specifications
  const { data: specs } = await supabase
    .from('specifications')
    .select('id, title, content, status')
    .eq('project_id', projectId)

  // Fetch open conflicts
  const { data: conflicts } = await supabase
    .from('spec_conflicts')
    .select('id, description, severity, status')
    .eq('project_id', projectId)
    .eq('status', 'open')

  return {
    project,
    decisions,
    specifications: specs,
    active_conflicts: conflicts
  }
}
