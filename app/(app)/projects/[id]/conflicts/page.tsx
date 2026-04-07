import Link from 'next/link'
import { ArrowLeft, AlertTriangle, ExternalLink, Check, Zap } from 'lucide-react'
import { getConflicts, runScan } from '@/actions/conflicts'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { revalidatePath } from 'next/cache'
import ConflictResolution from '@/components/conflicts/ConflictResolution'

export default async function ConflictsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const conflicts = await getConflicts(id)

  const severityColors: Record<string, string> = {
    critical: 'bg-[--danger-muted] text-[--danger] border-[--danger]',
    high: 'bg-[--warning-muted] text-[--warning] border-[--warning]',
    medium: 'bg-[--accent-soft] text-[--accent] border-[--accent]',
    low: 'bg-[--bg-elevated] text-[--text-secondary] border-[--border-strong]',
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <Link href={`/projects/${id}`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit mb-4">
        <ArrowLeft className="h-4 w-4" />
        Project Overview
      </Link>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[--text-primary] flex items-center gap-3">
            Conflict Engine <span className="bg-[--danger] text-white text-sm rounded-full h-6 w-6 flex items-center justify-center font-sans tracking-tight">{conflicts.filter(c => c.status === 'open').length}</span>
          </h1>
          <p className="text-[--text-secondary] mt-1">AI-driven contradiction & gap detection across specifications (AIML6).</p>
        </div>
        <form action={async () => { "use server"; await runScan(id); revalidatePath(`/projects/${id}/conflicts`); }}>
          <Button variant="secondary" className="flex items-center gap-2 border-[--accent-muted]">
            <Zap className="h-4 w-4" /> Run Scan
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {conflicts.length === 0 ? (
          <div className="py-24 text-center rounded-[--radius-lg] border border-dashed border-[--border-strong] bg-[--bg-surface]">
            <AlertTriangle className="h-10 w-10 text-[--success] mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-[--text-primary]">All specifications are in sync.</h3>
            <p className="text-[--text-muted] max-w-sm mx-auto">Run a new scan to cross-reference requirements and architectural constraints.</p>
          </div>
        ) : (
          conflicts.map((conflict: any) => (
            <Card key={conflict.id} className={`border-l-4 relative overflow-hidden transition-all hover:shadow-md ${conflict.status === 'open' ? 'border-l-[--danger]' : 'border-l-[--success] opacity-70'}`}>
              <div className="flex justify-between items-start gap-8">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-[--radius-sm] border tracking-wider ${severityColors[conflict.severity]}`}>
                      {conflict.severity}
                    </span>
                    <span className="text-[10px] font-mono font-medium text-[--text-muted] uppercase tracking-widest bg-[--bg-elevated] px-2 py-0.5 rounded">
                      {conflict.conflict_type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                     <h3 className="text-lg font-serif text-[--text-primary] leading-tight">{conflict.description}</h3>
                     <div className="flex gap-4 items-center pl-4 border-l-2 border-[--border-subtle]">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-[--text-muted] uppercase">Artifact A</span>
                            <Link href={`/projects/${id}/specs/${conflict.spec_a?.id}`} className="text-sm text-[--accent] hover:underline flex items-center gap-1 font-medium italic">
                                {conflict.spec_a?.title} <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                        <span className="text-[--text-muted] text-xs font-serif italic mt-3">vs</span>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-[--text-muted] uppercase">Artifact B</span>
                            <Link href={`/projects/${id}/specs/${conflict.spec_b?.id}`} className="text-sm text-[--accent] hover:underline flex items-center gap-1 font-medium italic">
                                {conflict.spec_b?.title} <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>
                    </div>
                  </div>

                  {conflict.ai_resolution_suggestion && (
                    <div className="bg-[--accent-soft]/10 border border-[--accent-muted] p-5 rounded-[--radius-md] relative">
                       <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-4 w-4 text-[--accent]" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[--text-primary]">AI-Suggested Resolution Strategy</span>
                       </div>
                       <ConflictResolution text={conflict.ai_resolution_suggestion} />
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex flex-col gap-3 py-1">
                  {conflict.status === 'open' ? (
                    <>
                      <Button size="sm">Accept Fix</Button>
                      <Button size="sm" variant="secondary">Request Revision</Button>
                    </>
                  ) : (
                    <div className="text-[--success] px-4 py-2 bg-[--success-muted] border border-[--success] rounded flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <Check className="h-4 w-4" strokeWidth={3} /> Resolved
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
