import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'

export default async function SpecHistoryPage({ params }: { params: { id: string, specId: string } }) {
  const supabase = await createClient()
  
  const { data: spec } = await supabase.from('specifications').select('title').eq('id', params.specId).single()
  const { data: versions } = await supabase
    .from('specification_versions')
    .select('*')
    .eq('spec_id', params.specId)
    .order('version', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <Link href={`/projects/${params.id}/specs/${params.specId}`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Spec Editor
      </Link>
      
      <h1 className="text-3xl font-serif text-[--text-primary]">Version History</h1>
      <p className="text-[--text-secondary] mb-6">Review changes to {spec?.title}.</p>

      <div className="space-y-4">
        {!versions || versions.length === 0 ? (
          <div className="py-12 text-center rounded-[--radius-lg] border border-dashed border-[--border-strong] bg-[--bg-surface] text-[--text-muted]">
            No previous versions saved yet.
          </div>
        ) : (
          versions.map((v: any) => (
            <Card key={v.id} className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h3 className="font-medium text-lg mb-1">Version {v.version}</h3>
                <p className="text-sm text-[--text-secondary]">{new Date(v.created_at).toLocaleString()}</p>
                {v.change_summary && <p className="text-sm text-[--text-primary] mt-2">{v.change_summary}</p>}
              </div>
              <div className="text-sm text-[--accent] cursor-pointer hover:underline">
                Compare with Current
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
