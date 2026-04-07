export const SPEC_CONFLICT_PROMPT = (specs: any[]) => ({
  system: `You are a GenAI-Powered Adaptive Product Specification Engine (AIML6).
Your task is to continuously validate consistency across product artifacts.
You identify contradictions, gaps, and technical misalignments between specifications.
Identify real, high-impact conflicts in requirement logic, not just phrasing.`,
  user: `Analyze these two specifications for inconsistencies, contradictions, and missing requirements:

SPEC A: ${specs[0].title}
CONTENT: ${specs[0].content_text}

SPEC B: ${specs[1].title}
CONTENT: ${specs[1].content_text}

---
Search for:
1. **Contradictions:** Mutually exclusive requirements (e.g., Spec A says X=10, Spec B says X=20).
2. **Gaps:** Requirements in A that imply missing logic in B.
3. **Drafting Ambiguity:** Definitions that differ across documents.

Return a detailed analysis of findings. If conflicts exist, provide a technical resolution strategy.

JSON SCHEMA:
{
  "conflicts_found": [
    {
      "type": "contradiction | gap | misalignment",
      "severity": "critical | high | medium | low",
      "description": "Short explanation of the conflict",
      "spec_a_ref": "text fragment in spec a",
      "spec_b_ref": "text fragment in spec b",
      "ai_resolution_suggestion": "Technical fix to synchronize both specs",
      "root_cause_analysis": "Why this typically happens"
    }
  ],
  "consistency_score": 0-100,
  "summary": "Overall alignment health"
}`
});
