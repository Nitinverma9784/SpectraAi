import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { DecisionWizard } from '@/components/decisions/DecisionWizard'

export default async function NewDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <Link href={`/projects/${id}/decisions`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Decisions
      </Link>

      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-serif text-[--text-primary]">New Decision</h1>
        <p className="text-[--text-secondary] mt-1">Structure your thoughts and let AI analyze the trade-offs.</p>
      </div>

      <DecisionWizard projectId={id} />
    </div>
  )
}
