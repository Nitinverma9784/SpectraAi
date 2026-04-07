'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDecisionScores(decisionId: string, scores: any[]) {
  const supabase = await createClient()

  for (const score of scores) {
    const { error } = await supabase
      .from('decision_options')
      .update({
        effort_score: score.effort_score,
        impact_score: score.impact_score,
        risk_score: score.risk_score,
        feasibility_score: score.feasibility_score,
        strategic_alignment_score: score.strategic_alignment_score
      })
      .eq('decision_id', decisionId)
      .eq('title', score.option_title)

    if (error) console.error('Error updating score:', error)
  }

  revalidatePath('/projects')
}
