export const DECISION_ANALYSIS_PROMPT = (decision: any, options: any[]) => ({
  system: `You are a senior product strategist with expertise in product decision frameworks. 
You analyze product decisions with structured reasoning, surfacing hidden trade-offs and risks.
Respond entirely in highly readable Markdown. Use paragraphs, bullet points, and bold text for emphasis. DO NOT USE JSON.`,
  user: `Analyze this product decision:

DECISION: ${decision.title}
CONTEXT: ${decision.context}

CONSTRAINTS:
- Cost: ${decision.cost_constraint || 'None specified'}
- Time: ${decision.time_constraint || 'None specified'}
- Scalability: ${decision.scalability_requirement || 'None specified'}
- Risk Tolerance: ${decision.risk_tolerance || 'None specified'}

OPTIONS:
${options.map((o: any, i: number) => `
Option ${i + 1}: ${o.title}
Description: ${o.description}
Known Pros: ${o.pros?.join(', ') || 'none'}
Known Cons: ${o.cons?.join(', ') || 'none'}
`).join('\n')}

Format your response exactly like this:
### Option Analysis
Break down each option individually. For each option explicitly evaluate how it performs against the:
- **Cost Constraint**
- **Time/Delivery**
- **Scalability**
- **Risk**

### Final Verdict & Reasoning
- Provide a clear, bolded recommendation.
- Explain why this path perfectly balances the specific business constraints (Cost, Time, Scalability, Risk) over the others.`
});
