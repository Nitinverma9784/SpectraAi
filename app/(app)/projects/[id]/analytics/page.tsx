import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <Link href={`/projects/${params.id}`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit mb-4">
        <ArrowLeft className="h-4 w-4" />
        Project Overview
      </Link>
      
      <h1 className="text-3xl font-serif text-[--text-primary]">Analytics</h1>
      <p className="text-[--text-secondary]">Project health and metrics.</p>

      <div className="flex items-center justify-center h-64 border border-dashed border-[--border-strong] rounded-[--radius-lg] text-[--text-muted]">
        Analytics workspace building soon...
      </div>
    </div>
  )
}
