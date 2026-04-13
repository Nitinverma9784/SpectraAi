import { MODELS } from './models';

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

export async function callOpenRouter({
  model = MODELS.fast,
  messages,
  stream = false,
  temperature = 0.7,
  max_tokens = 2000,
}: {
  model?: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}) {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      "X-Title": "SpectraAI",
    },
    body: JSON.stringify({ model, messages, stream, temperature, max_tokens }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`OpenRouter API error for model ${model}: ${res.status} ${res.statusText}`, errorText);
    
    if (model !== MODELS.fallback) {
      console.log(`Trying fallback model ${MODELS.fallback}`);
      return callOpenRouter({ model: MODELS.fallback, messages, stream, temperature, max_tokens });
    }
    throw new Error(`OpenRouter API failed: ${res.statusText} (${res.status})`);
  }

  return res;
}
