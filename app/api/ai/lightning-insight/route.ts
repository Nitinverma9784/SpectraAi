import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('[Lightning AI] SDK Request for prediction');

    // Fallback simulation mode
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your_')) {
      const simulations = [
         "Prioritize Developer Experience (DX) for this decision to prevent long-term maintenance rot.",
         "Ensure consistency by aligning the security protocol with the PRD steps instantly.",
         "High-velocity delivery suggests choosing the most scalable option with minimal boilerplate.",
         "Balance impact vs risk by isolating the B2B checkout flow from the B2C core."
      ];
      const randomInsight = simulations[Math.floor(Math.random() * simulations.length)];
      return new Response(JSON.stringify({ insight: randomInsight }));
    }

    const response = await openrouter.chat.send({
      chatRequest: {
        model: "openrouter/free",
        messages: [
          {
            role: "system",
            content: "You are a product strategist. Give a 1-sentence 'Lightning Insight' for a product decision. Focused, professional, and strategic (AIML5/6)."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }
    });

    const insight = response.choices[0]?.message?.content || "";
    console.log('[Lightning AI] Success');
    
    return new Response(JSON.stringify({ insight }));

  } catch (err: any) {
    console.error("[Lightning AI FATAL ERROR]", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
