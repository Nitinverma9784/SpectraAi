'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createSpec } from '@/actions/specifications'

export default function NewSpecPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get('title') as string
      const type = formData.get('type') as string
      
      const spec = await createSpec(id, title, type)
      router.push(`/projects/${id}/specs/${spec.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create spec')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <Link href={`/projects/${id}/specs`} className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back to Specs
      </Link>
      
      <div className="space-y-1">
        <h1 className="font-serif text-3xl text-[--text-primary]">Create new spec</h1>
        <p className="text-[--text-secondary]">Set up a new living document.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-[--danger] text-sm">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Spec Title</label>
            <Input name="title" placeholder="e.g. Authentication Requirements" required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Document Type</label>
            <select name="type" className="flex h-10 w-full rounded-[--radius-md] border border-[--border-default] bg-[--bg-elevated] px-3 py-2 text-sm text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--accent-muted] focus:border-[--accent]">
              <option value="prd">Product Requirement Doc (PRD)</option>
              <option value="technical">Technical Spec</option>
              <option value="design">Design Spec</option>
              <option value="api">API Spec</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[--border-subtle]">
            <Link href={`/projects/${id}/specs`}>
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Spec'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
