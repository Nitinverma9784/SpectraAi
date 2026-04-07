import { useState, useCallback } from 'react'

export function useAIStream() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startStream = useCallback(async (url: string, body: any) => {
    try {
      setIsStreaming(true)
      setContent('')
      setError(null)
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) throw new Error('Stream failed')
      if (!res.body) throw new Error('No body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        // Parse OpenRouter SSE format. This is heavily simplified.
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '))
        for (const line of lines) {
          const data = line.replace('data: ', '').trim()
          if (data === '[DONE]') break
          try {
            const json = JSON.parse(data)
            const text = json.choices[0]?.delta?.content || ''
            setContent(prev => prev + text)
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return { content, isStreaming, error, startStream }
}
