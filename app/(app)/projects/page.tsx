import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getProjects } from '@/actions/projects'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[--text-primary]">All Projects</h1>
          <p className="text-[--text-secondary] mt-1">Manage your workspaces and active initiatives.</p>
        </div>
        <Link href="/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full py-12 text-center rounded-[--radius-lg] border border-dashed border-[--border-strong] bg-[--bg-surface]">
            <p className="text-[--text-muted] mb-4">No projects yet.</p>
            <Link href="/projects/new">
              <Button variant="outline">Create your first project</Button>
            </Link>
          </div>
        ) : (
          projects.map((project: any) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full flex flex-col cursor-pointer transition-transform hover:-translate-y-1">
                <h3 className="font-medium text-lg mb-1 text-[--text-primary]">{project.name}</h3>
                <p className="text-sm text-[--text-secondary] line-clamp-2 mb-4 flex-1">
                  {project.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[--text-muted] mt-auto border-t border-[--border-subtle] pt-4">
                  <div className="flex flex-col">
                    <span className="text-[--text-secondary] mb-1">Decisions</span>
                    <span className="text-lg font-sans font-medium text-[--text-primary]">{project.decisions[0]?.count || 0}</span>
                  </div>
                  <div className="w-px h-8 bg-[--border-subtle]" />
                  <div className="flex flex-col">
                    <span className="text-[--text-secondary] mb-1">Specs</span>
                    <span className="text-lg font-sans font-medium text-[--text-primary]">{project.specifications[0]?.count || 0}</span>
                  </div>
                  <div className="w-px h-8 bg-[--border-subtle]" />
                  <div className="flex flex-col">
                    <span className="text-[--text-secondary] mb-1">Conflicts</span>
                    <span className={`text-lg font-sans font-medium ${project.spec_conflicts[0]?.count > 0 ? 'text-[--danger]' : 'text-[--text-primary]'}`}>
                      {project.spec_conflicts[0]?.count || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
