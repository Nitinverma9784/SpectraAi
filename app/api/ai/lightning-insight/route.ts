import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.includes('your_')) {
      const simulations = [
         "Prioritize Developer Experience (DX) for this decision to prevent long-term maintenance rot.",
         "Ensure consistency by aligning the security protocol with the PRD steps instantly.",
         "High-velocity delivery suggests choosing the most scalable option with minimal boilerplate.",
         "Balance impact vs risk by isolating the B2B checkout flow from the B2C core."
      ];
      const randomInsight = simulations[Math.floor(Math.random() * simulations.length)];
      return new Response(JSON.stringify({ insight: randomInsight }));
    }

    const completion = await groq.chat.completions.create({
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
      model: "llama-3.3-70b-specdec",
    });

    console.log(`[AI SUCCESS] Groq Lightning Insight generated for: ${prompt.substring(0, 30)}...`);
    return new Response(JSON.stringify({ insight: completion.choices[0]?.message?.content || "" }));

  } catch (err: any) {
    console.error("[GROQ ERROR] Lightning insight failed", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
