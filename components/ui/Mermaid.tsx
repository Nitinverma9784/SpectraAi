'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Instrument Serif, serif',
})

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed')
      mermaid.contentLoaded()
    }
  }, [chart])

  return (
    <div className="mermaid bg-[--bg-surface] p-4 rounded-[--radius-md] border border-[--border-subtle] my-4 overflow-hidden flex justify-center">
      {chart}
    </div>
  )
}
