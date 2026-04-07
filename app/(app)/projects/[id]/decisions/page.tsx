import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getDecisions } from '@/actions/decisions'

export default async function DecisionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const decisions = await getDecisions(id)

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/projects/${id}`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit mb-4">
            <ArrowLeft className="h-4 w-4" />
            Project Overview
          </Link>
          <h1 className="text-3xl font-serif text-[--text-primary]">Decisions</h1>
          <p className="text-[--text-secondary] mt-1">Structure options and evaluate trade-offs.</p>
        </div>
        <Link href={`/projects/${id}/decisions/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Decision
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decisions.map((decision: any) => (
          <Link key={decision.id} href={`/projects/${id}/decisions/${decision.id}`}>
            <Card className="h-full flex flex-col cursor-pointer transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg text-[--text-primary]">{decision.title}</h3>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${decision.status === 'open' ? 'bg-[--warning-muted] text-[--warning]' : 'bg-[--success-muted] text-[--success]'}`}>
                  {decision.status}
                </span>
              </div>
              <p className="text-sm text-[--text-secondary] line-clamp-3 mb-4 flex-1">
                {decision.context}
              </p>
              <div className="text-xs text-[--text-muted]">
                {decision.decision_options?.[0]?.count || 0} Options
              </div>
            </Card>
          </Link>
        ))}
        {decisions.length === 0 && (
          <div className="col-span-full py-12 text-center rounded-[--radius-lg] border border-dashed border-[--border-strong] bg-[--bg-surface]">
            <p className="text-[--text-muted] mb-4">No decisions yet.</p>
            <Link href={`/projects/${id}/decisions/new`}>
              <Button variant="secondary">Create a decision</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
