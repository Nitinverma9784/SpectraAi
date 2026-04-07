'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createProject } from '@/actions/projects'

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const project = await createProject(formData)
      router.push(`/projects/${project.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
      setLoading(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard" className="text-sm font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      
      <div className="space-y-1">
        <h1 className="font-serif text-3xl text-[--text-primary]">Create new project</h1>
        <p className="text-[--text-secondary]">Set up a workspace for decisions and specifications.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-[--radius-sm] bg-[--danger-muted] border border-[--danger]/20 p-3 text-sm text-[--danger]">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-[--text-primary]">
              Project Name
            </label>
            <Input id="name" name="name" placeholder="e.g. Acme Web App" required />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-[--text-primary]">
              Description (Optional)
            </label>
            <textarea 
              id="description" 
              name="description" 
              rows={4}
              placeholder="What are you building?"
              className="flex w-full rounded-[--radius-md] border border-[--border-default] bg-[--bg-elevated] px-3 py-2 text-sm text-[--text-primary] placeholder:text-[--text-muted] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent-muted] focus-visible:border-[--accent] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[--border-subtle]">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
