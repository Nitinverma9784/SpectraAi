import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: Request) {
  try {
    const { messages, contextType, contextData } = await req.json()

    const systemPrompt = `You are Spectra Assistant, an expert AI built into a product decision and specification platform.
Context Type: ${contextType || 'general'}
${contextData ? `Relevant Context: ${JSON.stringify(contextData, null, 2)}` : ''}

You help product teams:
- Reason through complex trade-offs and decisions
- Review and improve specification documents  
- Detect and resolve specification conflicts
- Provide strategic product insights

Be concise, strategic, and professional. Format responses clearly using markdown when helpful.`

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
    })

    // Convert Groq's async iterator to a ReadableStream (SSE format)
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content ?? ''
            if (content) {
              // Send in SSE format so AIPanel's existing reader works
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (err: any) {
    console.error('[chat/route] error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
