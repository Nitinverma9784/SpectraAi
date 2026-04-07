import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { getSpecs } from '@/actions/specifications'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default async function SpecsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const specs = await getSpecs(id)

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/projects/${id}`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit mb-4">
            <ArrowLeft className="h-4 w-4" />
            Project Overview
          </Link>
          <h1 className="text-3xl font-serif text-[--text-primary]">Specifications</h1>
          <p className="text-[--text-secondary] mt-1">Living documents powered by TipTap and synced with decisions.</p>
        </div>
        <Link href={`/projects/${id}/specs/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Spec
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specs.map((spec: any) => (
          <Link key={spec.id} href={`/projects/${id}/specs/${spec.id}`}>
            <Card className="h-full flex flex-col cursor-pointer transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg text-[--text-primary]">{spec.title}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-[--radius-sm] bg-[--bg-elevated] border border-[--border-subtle]`}>
                  {spec.type}
                </span>
              </div>
              <p className="text-sm text-[--text-secondary] truncate mb-4 flex-1">
                {spec.content_text ? spec.content_text.substring(0, 100) + '...' : 'Empty document...'}
              </p>
              <div className="flex justify-between items-center text-xs text-[--text-muted] border-t border-[--border-subtle] pt-3">
                <span>v{spec.version}</span>
                {spec.consistency_score != null && (
                  <span className={`px-2 py-0.5 rounded-full ${spec.consistency_score < 70 ? 'bg-[--danger-muted] text-[--danger]' : 'bg-[--success-muted] text-[--success]'}`}>
                    Consistency: {spec.consistency_score}%
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
        {specs.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-[--radius-lg] border border-dashed border-[--border-strong] bg-[--bg-surface]">
            <p className="text-[--text-muted] mb-4">No specifications yet.</p>
            <Link href={`/projects/${id}/specs/new`}>
              <Button variant="secondary">Create a specification</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
