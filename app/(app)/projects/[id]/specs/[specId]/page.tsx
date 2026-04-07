import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { getSpec } from '@/actions/specifications'
import { SpecEditor } from '@/components/specs/SpecEditor'
import { Button } from '@/components/ui/Button'

export default async function SpecDetailPage({ params }: { params: Promise<{ id: string, specId: string }> }) {
  const { id, specId } = await params
  const spec = await getSpec(specId)

  if (!spec) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-serif mb-4 text-[--text-primary]">Specification not found</h1>
        <p className="text-[--text-muted] mb-6">The specification ID might be invalid or you don't have access.</p>
        <Link href={`/projects/${id}/specs`}>
          <Button variant="secondary">Back to Specs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto h-[calc(100vh-3.5rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <Link href={`/projects/${id}/specs`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Link href={`/projects/${id}/specs/${specId}/history`}>
          <Button variant="ghost" className="text-xs" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            History
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <h1 className="text-3xl font-serif text-[--text-primary]">{spec.title}</h1>
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-[--radius-sm] bg-[--bg-elevated] border border-[--border-subtle]`}>
          v{spec.version}
        </span>
      </div>

      <div className="flex-1 min-h-0">
        <SpecEditor spec={spec} />
      </div>
    </div>
  )
}
