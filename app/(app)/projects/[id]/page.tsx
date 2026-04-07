import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Brain, FileText, Shield, Plus, ChevronRight, Zap, CheckCircle } from 'lucide-react'

export default async function ProjectOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !project) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-xl font-serif mb-4 text-[--text-primary]">Project not found</h1>
        <p className="text-[--text-muted] mb-6">The project ID might be invalid or you don't have access.</p>
        <Link href="/dashboard">
          <Button variant="secondary">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }
  
  const { count: decCount } = await supabase.from('decisions').select('*', { count: 'exact', head: true }).eq('project_id', id)
  const { count: specCount } = await supabase.from('specifications').select('*', { count: 'exact', head: true }).eq('project_id', id)
  const { count: confCount } = await supabase.from('spec_conflicts').select('*', { count: 'exact', head: true }).eq('project_id', id).eq('status', 'open')

  const modules = [
    {
      title: "Decision Engine",
      subtitle: "Strategy",
      description: "Structure, compare, and reason through product trade-offs using AI.",
      icon: Brain,
      count: decCount || 0,
      unit: "decisions",
      color: "var(--accent)",
      colorMuted: "var(--accent-muted)",
      colorBorder: "var(--accent-border)",
      href: `/projects/${id}/decisions`,
      newHref: `/projects/${id}/decisions/new`,
      cta: "View Decisions",
    },
    {
      title: "Specifications",
      subtitle: "Consistency",
      description: "Living documents that auto-validate against each other to prevent spec rot.",
      icon: FileText,
      count: specCount || 0,
      unit: "specs",
      color: "var(--info)",
      colorMuted: "var(--info-muted)",
      colorBorder: "var(--info-border)",
      href: `/projects/${id}/specs`,
      newHref: `/projects/${id}/specs/new`,
      cta: "View Specs",
    },
    {
      title: "Conflict Scanner",
      subtitle: "Auto-sync",
      description: "AI detects inconsistencies and contradictions across your specification artifacts.",
      icon: Shield,
      count: confCount || 0,
      unit: "open conflicts",
      color: confCount && confCount > 0 ? "var(--warning)" : "var(--success)",
      colorMuted: confCount && confCount > 0 ? "var(--warning-muted)" : "var(--success-muted)",
      colorBorder: confCount && confCount > 0 ? "var(--warning-border)" : "var(--success-border)",
      href: `/projects/${id}/conflicts`,
      cta: confCount && confCount > 0 ? "Resolve Conflicts" : "View Scanner",
    },
  ]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <Link href="/dashboard" className="text-xs font-medium text-[--text-muted] hover:text-[--text-primary] flex items-center gap-2 w-fit transition-colors">
        <ArrowLeft className="h-3 w-3" />
        Dashboard
      </Link>
      
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[--success] animate-pulse" />
            <span className="text-[10px] font-mono text-[--text-muted] uppercase tracking-widest">Active Project</span>
          </div>
          <h1 className="text-4xl font-serif mb-2" style={{ color: 'var(--text-primary)' }}>{project.name}</h1>
          <p className="max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href={`/projects/${id}/decisions/new`}>
            <Button variant="secondary" className="text-xs flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Decision
            </Button>
          </Link>
          <Link href={`/projects/${id}/specs/new`}>
            <Button className="text-xs flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Spec
            </Button>
          </Link>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((mod) => {
          const Icon = mod.icon
          return (
            <Card key={mod.title} className="flex flex-col group relative overflow-hidden hover:-translate-y-0.5 transition-all">
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(to right, transparent, ${mod.color}60, transparent)` }}
              />
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-[--radius-md] flex items-center justify-center"
                  style={{ background: mod.colorMuted, border: `1px solid ${mod.colorBorder}` }}
                >
                  <Icon className="h-4 w-4" style={{ color: mod.color }} />
                </div>
                <span
                  className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded font-mono"
                  style={{ color: mod.color, background: mod.colorMuted, border: `1px solid ${mod.colorBorder}` }}
                >
                  {mod.subtitle}
                </span>
              </div>
              <h2 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>{mod.title}</h2>
              <p className="text-[11px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{mod.description}</p>

              <div className="mt-auto space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-serif" style={{ color: mod.color }}>{mod.count}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{mod.unit}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={mod.href} className="flex-1">
                    <Button variant="secondary" className="w-full text-xs flex items-center justify-center gap-1">
                      {mod.cta} <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                  {mod.newHref && (
                    <Link href={mod.newHref}>
                      <Button variant="ghost" className="text-xs px-2.5">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Value explainer banner */}
      <div className="p-6 rounded-[--radius-xl] bg-gradient-to-br from-[--bg-surface] to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[--accent-soft]/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-[--accent]" />
              <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>How SpectraAI Solves Your Product Problems</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "Intel", text: "AI evaluates competing options and explains prioritization logic" },
                { label: "Consistency", text: "Specs cross-validate in real-time, preventing documentation rot" },
                { label: "Groq", text: "Lightning-fast strategy hints before you even run analysis" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[--success] mt-0.5 shrink-0" />
                  <p className="text-xs text-[--text-muted]">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}:</span> {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-2">
            <div className="text-[10px] text-[--text-muted] uppercase font-mono tracking-widest mb-1">Quick Actions</div>
            <Link href={`/projects/${id}/decisions/new`}>
              <Button variant="secondary" className="w-full text-xs flex items-center gap-2">
                <Brain className="h-3.5 w-3.5 text-[--accent]" /> New Decision
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
