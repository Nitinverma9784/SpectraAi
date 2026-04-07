'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'

export function GroqLightningInsight({ prompt }: { prompt: string }) {
  const [insight, setInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchInsight = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/lightning-insight', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      setInsight(data.insight)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 p-3 rounded-[--radius-md] bg-[--accent-soft]/5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[--accent] uppercase tracking-tighter">
          <Sparkles className="h-3 w-3" /> Real-time Strategy Hint (Groq)
        </div>
        <button 
          onClick={fetchInsight} 
          disabled={loading}
          className="text-[9px] underline text-[--text-muted] hover:text-[--accent] disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin"/> : (insight ? 'Refresh Hint' : 'Get Insight')}
        </button>
      </div>
      {insight && (
        <p className="text-xs text-[--text-secondary] italic transition-all animate-in fade-in slide-in-from-top-1 duration-500">
          "{insight}"
        </p>
      )}
    </div>
  )
}
