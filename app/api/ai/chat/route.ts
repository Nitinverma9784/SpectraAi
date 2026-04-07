import { OpenRouter } from "@openrouter/sdk";
import { getProjectContext } from "@/lib/supabase/context";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { messages, contextType, projectId, contextId } = await req.json();
    console.log('[Spectra Assistant] Contextual SDK Request:', { 
      contextType, 
      projectId, 
      contextId 
    });

    // Fetch rich context if on a project page
    let contextString = "No project-wide context available.";
    if (projectId) {
      try {
        const fullContext = await getProjectContext(projectId);
        contextString = `--- PROJECT-WIDE CONTEXT (DECISIONS, OPTIONS, SPECS) ---
${JSON.stringify(fullContext, null, 2)}
---------------------------------------------------------
${contextId ? `CURRENT FOCUS: ${contextType} ID ${contextId}` : ""}
`;
      } catch (e) {
        console.error('[Spectra Assistant Context Error]:', e);
      }
    }

    const systemPrompt = `You are Spectra Assistant, an expert AI built into a product decision and specification platform.

--- DATA CONTEXT ---
${contextString}

--- YOUR ROLE ---
You help product teams:
- Reason through complex trade-offs and decisions
- Review and improve specification documents  
- Detect and resolve specification conflicts
- Provide strategic product insights using the project data provided above.

--- FORMATTING & STYLE ---
- Use strictly professional Markdown.
- Use bullet points (*) for lists. Always add a space after the asterisk.
- Highlight key decisions or risks using bolding (**text**).
- Be concise and strategic. If a decision is inconsistent with a spec, point it out.
- ALWAYS respond in a way that feels premium and expert.`;

    // Fallback if no API key is provided
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_')) {
      console.warn('[Spectra Assistant] Running in simulation mode (No API Key)');
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const simulation = "Hello! I am Spectra Assistant. I'm currently running in **Simulation Mode**. Please configure your OpenRouter API key in `.env` to enable live contextual reasoning for this project.";
          for (const word of simulation.split(' ')) {
            const data = JSON.stringify({ choices: [{ delta: { content: word + ' ' } }] })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            await new Promise(r => setTimeout(r, 40))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      })
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
    }

    // Call OpenRouter via SDK
    console.log('[Spectra Assistant] Initiating contextual SDK stream...');
    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "openrouter/free",
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                choices: [{ delta: { content } }] 
              })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err: any) {
          console.error('[Spectra Assistant SDK Error]:', err);
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (err: any) {
    console.error('[Spectra Assistant FATAL ERROR]:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
