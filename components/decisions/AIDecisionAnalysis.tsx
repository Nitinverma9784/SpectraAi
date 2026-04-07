'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Sparkles, Check, AlertCircle, RefreshCw, BarChart3 } from 'lucide-react'
import { useAIStream } from '@/hooks/useAIStream'
import { updateDecisionScores } from '@/actions/ai-feedback'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function AIDecisionAnalysis({ decisionId }: { decisionId: string }) {
  const { content, isStreaming, error, startStream } = useAIStream()
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleSyncMatrix() {
    setIsUpdating(true)
    try {
      const res = await fetch('/api/ai/score-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId })
      })
      const data = await res.json()
      if (data.options_analysis) {
        const scores = data.options_analysis.map((o: any) => ({
          option_title: o.option_title || o.title || "",
          effort_score: o.effort_score,
          impact_score: o.impact_score,
          risk_score: o.risk_score,
          feasibility_score: o.feasibility_score,
          strategic_alignment_score: o.strategic_alignment_score
        }))
        await updateDecisionScores(decisionId, scores);
        // Reload to show new matrix data - ideally this would be state-based 
        // but for now we follow the existing pattern
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to sync matrix', e)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="border-[rgba(124,108,242,0.18)] bg-gradient-to-br from-[rgba(124,108,242,0.04)] to-transparent relative overflow-hidden">

      <div className="p-3 border-b border-[--border-subtle]/30 mb-4 flex justify-between items-center bg-[--bg-surface]/30">
        <div>
          <h3 className="font-medium text-[--accent] flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> AI Analysis Intelligence
          </h3>
          <p className="text-[10px] text-[--text-muted]">Structured Reasoning Loop.</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleSyncMatrix} disabled={isUpdating || isStreaming} className="border-[--border-subtle] bg-[--bg-surface]/50">
             {isUpdating ? <RefreshCw className="h-3 w-3 animate-spin"/> : <BarChart3 className="h-3 w-3" />}
             {isUpdating ? 'Syncing...' : 'Sync Matrix'}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => startStream('/api/ai/analyze-decision', { decisionId })} disabled={isStreaming} className="border-none bg-[--accent-soft]/20">
            {isStreaming ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="h-3 w-3 animate-spin"/> Reasoning...
              </span>
            ) : (
                <>
                    <Sparkles className="h-3 w-3" /> Get Reasoning
                </>
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="text-[--danger] flex gap-2 items-center text-sm p-4"><AlertCircle className="h-4 w-4" /> {error}</div>
      ) : content ? (
        <div className="p-4 space-y-4">
          <div className="prose prose-sm prose-invert max-w-none text-[--text-secondary]">
             <div className="prose-headings:font-serif prose-headings:text-[--text-primary] prose-strong:text-[--accent] prose-p:leading-relaxed space-y-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>

                {isStreaming && (
                  <span className="inline-block w-1.5 h-4 bg-[--accent] ml-1 animate-pulse align-middle" />
                )}
             </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Sparkles className="h-8 w-8 text-[--border-strong] mx-auto mb-3" />
          <p className="text-[--text-muted] text-sm italic mx-auto max-w-xs">
            "Reason through competing product constraints with logical certainty."
          </p>
          <p className="text-[10px] text-[--text-muted] mt-4 uppercase tracking-tighter">Click run to start reasoning loop.</p>
        </div>
      )}
    </Card>
  )
}
