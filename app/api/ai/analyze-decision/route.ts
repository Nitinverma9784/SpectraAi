import { callOpenRouter } from '@/lib/openrouter/client'
import { MODELS } from '@/lib/openrouter/models'
import { DECISION_ANALYSIS_PROMPT } from '@/lib/openrouter/prompts/decision-analysis'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { decisionId } = await req.json()
    
    const supabase = await createClient()
    const { data: decision } = await supabase.from('decisions').select('*').eq('id', decisionId).single()
    const { data: options } = await supabase.from('decision_options').select('*').eq('decision_id', decisionId)

    if (!decision || !options) {
      console.error(`[AI ERROR] Decision ${decisionId} not found.`);
      return new Response('Not found', { status: 404 })
    }

    const prompt = DECISION_ANALYSIS_PROMPT(decision, options)
    
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_')) {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        async start(controller) {
          // AIML5 GENERATOR - PRODUCES DATA FOR TRADE-OFF MATRIX (Simulating AI Reasoning)
          const simulationText = `### Option Analysis

${options.map((o: any) => `**${o.title}**
- **Cost Requirement**: Modest initial upfront investment.
- **Time/Delivery**: Expected delivery within standard sprint durations.
- **Scalability constraints**: Designed to handle moderate load increases gracefully.
- **Risk tolerance**: Manageable risk if fallback strategies are prepared.
- **Pros/Cons Context**: ${o.pros?.length ? o.pros[0] : 'Solid theoretical foundation'}, though ${o.cons?.length ? o.cons[0] : 'lacking some practical tooling'}.`).join('\n\n')}

### Final Verdict & Reasoning
**Recommendation:** Proceed strategically with **${options[0]?.title || 'the first option'}**.

Based on a holistic evaluation of the specified constraints (Cost, Time, Scalability, and Risk), this option offers the highest yield with the lowest corresponding debt. Its execution closely aligns with your target velocity and operational stability requirements.`;

          console.log(`[AI SUCCESS] Generated Reasoning Result for ${decisionId}`);
          
          // Stream the markdown text
          const content = simulationText;
          const words = content.split(' ')
          for (let i = 0; i < words.length; i++) {
            const data = JSON.stringify({ choices: [{ delta: { content: words[i] + ' ' } }] })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            await new Promise(resolve => setTimeout(resolve, 30))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      })
      return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
    }

    const response = await callOpenRouter({ 
      model: MODELS.grok, // Using Grok-2 for reasoning
      messages: [
        { role: 'system', content: prompt.system + "\n\nProvide deep architectural reasoning and prioritize explainable logic (AIML5)." },
        { role: 'user', content: prompt.user }
      ],
      stream: true 
    })
  
    console.log(`[AI SUCCESS] Initiated Grok-2 reasoning for decision: ${decision.title}`);
    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  } catch (err: any) {
    console.error(`[AI ERROR] Analysis failed: ${err.message}`);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
