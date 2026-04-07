import Link from 'next/link'
import { Plus, ArrowRight, Brain, Shield, FileText, Sparkles, TrendingUp, AlertTriangle, Zap, Target, FolderKanban } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getProjects } from '@/actions/projects'
import { seedDemoData } from '@/actions/seed'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const projects = await getProjects()

  const totalDecisions = projects.reduce((acc: number, p: any) => acc + (p.decisions[0]?.count || 0), 0)
  const totalSpecs = projects.reduce((acc: number, p: any) => acc + (p.specifications[0]?.count || 0), 0)
  const totalConflicts = projects.reduce((acc: number, p: any) => acc + (p.spec_conflicts[0]?.count || 0), 0)

  const stats = [
    {
      label: "Active Projects",
      value: projects.length,
      icon: Target,
      color: "var(--accent)",
      colorMuted: "var(--accent-muted)",
      colorBorder: "var(--accent-border)",
      description: "Product workspaces",
    },
    {
      label: "Decisions Logged",
      value: totalDecisions,
      icon: Brain,
      color: "var(--info)",
      colorMuted: "var(--info-muted)",
      colorBorder: "var(--info-border)",
      description: "Product Intel",
    },
    {
      label: "Specifications",
      value: totalSpecs,
      icon: FileText,
      color: "var(--success)",
      colorMuted: "var(--success-muted)",
      colorBorder: "var(--success-border)",
      description: "Living docs",
    },
    {
      label: "Open Conflicts",
      value: totalConflicts,
      icon: AlertTriangle,
      color: totalConflicts > 0 ? "var(--warning)" : "var(--success)",
      colorMuted: totalConflicts > 0 ? "var(--warning-muted)" : "var(--success-muted)",
      colorBorder: totalConflicts > 0 ? "var(--warning-border)" : "var(--success-border)",
      description: "Consistency",
    },
  ]

  const recentActivity = [
    { action: "AI reasoned Checkout Strategy", time: "2h ago", type: "decision", icon: Brain },
    { action: "Spec 'PRD v2' updated", time: "4h ago", type: "spec", icon: FileText },
    { action: "Conflict detected in API Spec", time: "1d ago", type: "conflict", icon: Shield },
    { action: "Authentication Decision finalized", time: "2d ago", type: "decision", icon: Brain },
    { action: "Security Architecture created", time: "3d ago", type: "spec", icon: FileText },
  ]

  const features = [
    {
      title: "Decision Intelligence",
      subtitle: "Logic",
      description: "AI evaluates trade-offs and surfaces explainable reasoning for complex product decisions.",
      icon: Brain,
      accent: "var(--accent)",
      href: "/projects",
    },
    {
      title: "Adaptive Spec Engine",
      subtitle: "Sync",
      description: "Living documents that cross-validate against each other and detect inconsistency in real-time.",
      icon: Shield,
      accent: "var(--info)",
      href: "/projects",
    },
    {
      title: "Groq Lightning Hints",
      subtitle: "Real-time",
      description: "Sub-second product strategy insights powered by Groq before you even run full analysis.",
      icon: Zap,
      accent: "var(--warning)",
      href: "/projects",
    },
    {
      title: "Conflict Resolution",
      subtitle: "Auto-Sync",
      description: "Detects specification rot across documents and generates AI-backed resolution strategies.",
      icon: TrendingUp,
      accent: "var(--success)",
      href: "/projects",
    },
  ]

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[--success] animate-pulse" />
            <span className="text-xs font-mono text-[--text-muted] uppercase tracking-widest">AI Engine Online</span>
          </div>
          <h1 className="text-4xl font-serif font-normal text-[--text-primary] leading-tight">
            Welcome back,{" "}
            <span className="text-[--accent]">{user?.user_metadata?.full_name?.split(" ")[0] || "Strategist"}</span>.
          </h1>
          <p className="text-[--text-secondary] mt-2 max-w-lg">
            Your GenAI product intelligence layer is active. Decisions, specs, and conflicts are synced.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <form action={seedDemoData}>
            <Button variant="secondary" className="flex items-center gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Load Demo Data
            </Button>
          </form>
          <Link href="/projects/new">
            <Button className="flex items-center gap-2 text-xs">
              <Plus className="h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="relative overflow-hidden group hover:shadow-[--shadow-accent] transition-shadow duration-200">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: `radial-gradient(circle at top left, ${stat.colorMuted}, transparent 70%)` }}
              />
              <div className="relative z-10 flex flex-col gap-3">
                <div
                  className="w-9 h-9 rounded-[--radius-md] flex items-center justify-center"
                  style={{ background: stat.colorMuted, border: `1px solid ${stat.colorBorder}` }}
                >
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-3xl font-serif" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs font-medium text-[--text-primary] mt-0.5">{stat.label}</div>
                  <div className="text-[10px] text-[--text-muted] mt-0.5">{stat.description}</div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Feature Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[--text-muted]">AI Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <Link key={feat.title} href={feat.href}>
                <div className="group h-full p-5 rounded-[--radius-lg] bg-[--bg-surface]/50 hover:bg-[--bg-surface] transition-all duration-200 cursor-pointer flex flex-col gap-4 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-8 h-8 rounded-[--radius-sm] flex items-center justify-center shrink-0"
                      style={{ background: `${feat.accent}08` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: feat.accent }} />
                    </div>
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded font-mono"
                      style={{ color: feat.accent, background: `${feat.accent}08` }}
                    >
                      {feat.subtitle}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-[--text-primary] mb-1 group-hover:text-[--accent] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-[--text-muted]">{feat.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[--text-muted]">Active Projects</h2>
            <Link href="/projects" className="text-xs text-[--accent] hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-full py-16 text-center rounded-[--radius-lg] border border-dashed border-[--border-strong] bg-[--bg-surface]">
                <Brain className="h-8 w-8 text-[--text-muted] mx-auto mb-3 opacity-30" />
                <p className="text-[--text-muted] text-sm mb-4">No projects yet. Load demo data to see the AI in action.</p>
                <div className="flex gap-3 justify-center">
                  <form action={seedDemoData}>
                    <Button variant="outline" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" /> Load Demo
                    </Button>
                  </form>
                  <Link href="/projects/new">
                    <Button variant="outline" className="text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Create Project
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              projects.map((project: any) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="h-full flex flex-col cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-[--border-default] group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-8 h-8 rounded-[--radius-md] bg-[--accent-muted] border border-[--accent-border] flex items-center justify-center shrink-0">
                        <FolderKanban className="h-4 w-4 text-[--accent]" />
                      </div>
                      {(project.spec_conflicts[0]?.count || 0) > 0 && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[--warning-muted] border border-[--warning-border]">
                          <div className="w-1 h-1 rounded-full bg-[--warning] animate-pulse" />
                          <span className="text-[9px] font-bold text-[--warning]">Conflict</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-[--accent] transition-colors">{project.name}</h3>
                    <p className="text-[11px] text-[--text-muted] line-clamp-2 mb-4 flex-1">
                      {project.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-3 mt-auto text-[10px] font-mono border-t border-[--border-subtle] pt-3">
                      <div className="flex items-center gap-1">
                        <Brain className="h-3 w-3 text-[--accent]" />
                        <span className="text-[--text-muted]">{project.decisions[0]?.count || 0} decisions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-[--info]" />
                        <span className="text-[--text-muted]">{project.specifications[0]?.count || 0} specs</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-[--text-muted] ml-auto group-hover:text-[--accent] transition-colors" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[--text-muted]">Activity Feed</h2>
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[--border-subtle]">
              {recentActivity.map((item, i) => {
                const Icon = item.icon
                const colors: Record<string, string> = {
                  decision: "var(--accent)",
                  spec: "var(--info)",
                  conflict: "var(--warning)",
                }
                const color = colors[item.type]
                return (
                  <div key={i} className="p-4 hover:bg-[--bg-elevated] transition-colors flex gap-3 items-start">
                    <div
                      className="w-7 h-7 rounded-[--radius-sm] flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[--text-primary] leading-snug">{item.action}</p>
                      <p className="text-[10px] text-[--text-muted] mt-1">{item.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-3 bg-[--bg-surface] border-t border-[--border-subtle] text-center">
              <button className="text-[10px] text-[--text-muted] hover:text-[--accent] transition-colors">
                View all activity →
              </button>
            </div>
          </Card>

          {/* AI Status Banner */}
          <div className="p-4 rounded-[--radius-lg] bg-gradient-to-br from-[--accent-muted] to-transparent">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[--radius-md] bg-[--accent-soft]/30 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-[--accent]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-[--text-primary] mb-1">AI System Status</h4>
                <p className="text-[11px] text-[--text-muted] leading-relaxed">
                  Two models active: OpenRouter (deep analysis) + Groq (real-time hints).
                </p>
                <div className="flex gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[--success]" />
                    <span className="text-[9px] text-[--text-muted]">OpenRouter</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[--success]" />
                    <span className="text-[9px] text-[--text-muted]">Groq</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
