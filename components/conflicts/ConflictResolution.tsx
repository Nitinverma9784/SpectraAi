'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Mermaid } from '@/components/ui/Mermaid'

export default function ConflictResolution({ text }: { text: string }) {
  // Regex to detect mermaid blocks in the resolution text
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
  const parts = text.split(mermaidRegex)
  const matches = text.matchAll(mermaidRegex)
  const mermaidCharts = Array.from(matches).map(m => m[1])

  return (
    <div className="prose prose-sm prose-invert max-w-none text-[--text-secondary]">
      {parts.map((part, index) => {
        // If it's an even index, it's a text part, otherwise it's a mermaid part
        if (index % 2 === 0) {
          return (
            <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
              {part}
            </ReactMarkdown>
          )
        } else {
          const chart = mermaidCharts[Math.floor(index / 2)]
          return <Mermaid key={index} chart={chart} />
        }
      })}
    </div>
  )
}
