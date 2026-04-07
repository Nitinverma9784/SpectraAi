'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSpecs(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('specifications')
    .select('*')
    .eq('project_id', projectId)
    .order('updated_at', { ascending: false })
  if (error) return []
  return data
}

export async function getSpec(specId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('specifications')
    .select('*')
    .eq('id', specId)
    .single()
  if (error) return null
  return data
}

export async function createSpec(projectId: string, title: string, type: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('specifications')
    .insert([{ 
      project_id: projectId, 
      title, 
      type, 
      created_by: user?.id,
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      content_text: ''
    }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}/specs`)
  return data
}

export async function updateSpec(specId: string, content: any, content_text: string) {
  const supabase = await createClient()
  
  // Here we'd typically also handle versioning (specification_versions)
  const { error } = await supabase
    .from('specifications')
    .update({ 
      content, 
      content_text,
      updated_at: new Date().toISOString()
    })
    .eq('id', specId)

  if (error) throw new Error(error.message)
  return true
}
