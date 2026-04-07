import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { getDecision } from '@/actions/decisions'
import { Card } from '@/components/ui/Card'
import { AIDecisionAnalysis } from '@/components/decisions/AIDecisionAnalysis'
import { TradeoffMatrix } from '@/components/decisions/TradeoffMatrix'
import { Button } from '@/components/ui/Button'
import { GroqLightningInsight } from '@/components/decisions/GroqLightningInsight'

export default async function DecisionDetailPage({ params }: { params: Promise<{ id: string, decisionId: string }> }) {
  const { id, decisionId } = await params
  const decision = await getDecision(decisionId)

  if (!decision) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-serif mb-4 text-[--text-primary]">Decision not found</h1>
        <p className="text-[--text-muted] mb-6">The decision ID might be invalid or you don't have access.</p>
        <Link href={`/projects/${id}/decisions`}>
          <Button variant="secondary">Back to Decisions</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <Link href={`/projects/${id}/decisions`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back to Decisions
      </Link>

      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-serif text-[--text-primary]">{decision.title}</h1>
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${decision.status === 'open' ? 'bg-[--warning-muted] text-[--warning]' : 'bg-[--success-muted] text-[--success]'}`}>
              {decision.status}
            </span>
          </div>
          <div className="p-4 bg-[--bg-surface] rounded-[--radius-md] border border-[--border-subtle] text-[--text-secondary] text-sm mb-2">
            <h3 className="font-medium text-[--text-primary] mb-1">Context</h3>
            <p className="whitespace-pre-wrap">{decision.context}</p>
          </div>
          <GroqLightningInsight prompt={`What is a lightning-fast product strategy insight for this decision: ${decision.title}? Context: ${decision.context}`} />
        </div>
        <div className="w-full md:w-80 shrink-0 mt-4 md:mt-0">
          <TradeoffMatrix options={decision.decision_options || []} />
        </div>
      </div>

      <div className="mt-8">
        <AIDecisionAnalysis decisionId={decision.id} />
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4 mt-8 bg-[--bg-base] py-2 sticky top-0 z-10">Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decision.decision_options?.map((opt: any) => (
            <Card key={opt.id} className="flex flex-col relative overflow-hidden">
              {decision.final_choice_id === opt.id && (
                <div className="absolute top-0 right-0 bg-[--success] text-white text-xs px-3 py-1 font-medium flex items-center gap-1 rounded-bl-lg">
                  <CheckCircle2 className="h-3 w-3" /> Selected
                </div>
              )}
              <h3 className="font-medium text-lg mb-2 pr-20">{opt.title}</h3>
              <p className="text-sm text-[--text-secondary] mb-4">{opt.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-auto border-t border-[--border-subtle] pt-4">
                <div>
                  <h4 className="text-xs font-medium text-[--success] mb-1">Pros</h4>
                  <ul className="text-xs text-[--text-muted] list-disc pl-4 space-y-1">
                    {opt.pros?.map((p: string, i: number) => <li key={i}>{p}</li>)}
                    {(!opt.pros || opt.pros.length === 0) && <li>None listed</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[--danger] mb-1">Cons</h4>
                  <ul className="text-xs text-[--text-muted] list-disc pl-4 space-y-1">
                    {opt.cons?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    {(!opt.cons || opt.cons.length === 0) && <li>None listed</li>}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
