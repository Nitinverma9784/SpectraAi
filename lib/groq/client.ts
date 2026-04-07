import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqInsight(prompt: string) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return "[GROQ SIMULATION] Insight: Fast strategy suggests prioritizing developer agility (AIML5/6 Balance).";
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a product strategist. Give a 1-sentence 'Lightning Insight' for a product decision. Focused, professional, and strategic. Resolve contradictions instantly (AIML6)."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-specdec", // Lightning fast model on Groq
    });

    return completion.choices[0]?.message?.content || "";
  } catch (err) {
    console.error("Groq insight failed", err);
    return "Unable to fetch real-time insight.";
  }
}
