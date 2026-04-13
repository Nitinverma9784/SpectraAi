import { callOpenRouter } from '@/lib/openrouter/client'
import { MODELS } from '@/lib/openrouter/models'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const { decisionId } = await req.json()
    const supabase = await createClient()
    const { data: decision } = await supabase.from('decisions').select('*').eq('id', decisionId).single()
    const { data: options } = await supabase.from('decision_options').select('*').eq('decision_id', decisionId)

    if (!decision || !options) return new Response('Not found', { status: 404 })

    const systemPrompt = `You are a scoring engine for product trade-offs. 
Analyze the decision and options provided. 
Assign scores (1-10) for: effort, impact, risk, feasibility, and strategic_alignment.
Return ONLY VALID JSON matching this schema:
{
  "options_analysis": [
    {
      "option_title": "string",
      "effort_score": number,
      "impact_score": number,
      "risk_score": number,
      "feasibility_score": number,
      "strategic_alignment_score": number
    }
  ]
}`

    const userPrompt = `Decision: ${decision.title}\nContext: ${decision.context}\nOptions:\n${options.map(o => `- ${o.title}: ${o.description}`).join('\n')}`

    if (!process.env.OPENROUTER_API_KEY || !process.env.OPENROUTER_API_KEY.startsWith('sk-or-v1') || process.env.OPENROUTER_API_KEY.length < 20) {
      const mockResult = {
        options_analysis: options.map(o => ({
          option_title: o.title,
          effort_score: Math.floor(Math.random() * 5) + 3, // Random 3-7
          impact_score: Math.floor(Math.random() * 5) + 5, // Random 5-9
          risk_score: Math.floor(Math.random() * 5) + 2,   // Random 2-6
          feasibility_score: Math.floor(Math.random() * 5) + 4, // Random 4-8
          strategic_alignment_score: Math.floor(Math.random() * 4) + 6 // Random 6-9
        }))
      }
      return new Response(JSON.stringify(mockResult), { headers: { 'Content-Type': 'application/json' } })
    }

    const response = await callOpenRouter({
      model: MODELS.grok, // Fast model for scoring
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false // Non-streaming for structured data sync
    })

    const json = await response.json()
    return new Response(JSON.stringify(json), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
