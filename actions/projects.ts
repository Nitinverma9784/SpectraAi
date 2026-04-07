'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProjects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error || !projects) {
    console.error(error)
    return []
  }

  const enriched = await Promise.all(projects.map(async (p: any) => {
    const { count: dCount } = await supabase.from('decisions').select('*', { count: 'exact', head: true }).eq('project_id', p.id)
    const { count: sCount } = await supabase.from('specifications').select('*', { count: 'exact', head: true }).eq('project_id', p.id)
    const { count: cCount } = await supabase.from('spec_conflicts').select('*', { count: 'exact', head: true }).eq('project_id', p.id).eq('status', 'open')
    return {
      ...p,
      decisions: [{ count: dCount || 0 }],
      specifications: [{ count: sCount || 0 }],
      spec_conflicts: [{ count: cCount || 0 }]
    }
  }))

  return enriched
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { data, error } = await supabase
    .from('projects')
    .insert([{ name, description, owner_id: user.id }])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  return data
}
