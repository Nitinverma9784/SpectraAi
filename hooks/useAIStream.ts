import { useState, useCallback } from 'react'

export function useAIStream() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startStream = useCallback(async (url: string, body: any) => {
    try {
      console.log(`[Stream Hook] Starting stream for ${url}...`);
      setIsStreaming(true)
      setContent('')
      setError(null)
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[Stream Hook] Request failed: ${res.status}`, errText);
        throw new Error(`Stream failed: ${res.status}`);
      }

      if (!res.body) {
        console.error('[Stream Hook] Response body is null');
        throw new Error('No body');
      }

      console.log('[Stream Hook] Response received, reading body...');

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let totalChars = 0;

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log(`[Stream Hook] Stream complete. Total chars: ${totalChars}`);
          break
        }
        
        const chunk = decoder.decode(value)
        // Parse OpenRouter SSE format.
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data: '))
        
        for (const line of lines) {
          const data = line.replace('data: ', '').trim()
          if (data === '[DONE]') {
            console.log('[Stream Hook] [DONE] received');
            break
          }
          
          try {
            const json = JSON.parse(data)
            const text = json.choices[0]?.delta?.content || ''
            if (text) {
              totalChars += text.length;
              setContent(prev => prev + text)
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    } catch (err: any) {
      console.error('[Stream Hook] Error:', err);
      setError(err.message)
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return { content, isStreaming, error, startStream }
}
