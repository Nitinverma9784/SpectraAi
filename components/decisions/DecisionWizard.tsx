'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createDecision } from '@/actions/decisions'
import { Plus, X } from 'lucide-react'

export function DecisionWizard({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [title, setTitle] = useState('')
  const [context, setContext] = useState('')
  const [costConstraint, setCostConstraint] = useState('')
  const [timeConstraint, setTimeConstraint] = useState('')
  const [scalabilityRequirement, setScalabilityRequirement] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  
  const [options, setOptions] = useState<any[]>([
    { title: '', description: '', pros: [], cons: [] }
  ])

  const addOption = () => {
    setOptions([...options, { title: '', description: '', pros: [], cons: [] }])
  }
  
  const updateOption = (index: number, key: string, value: string) => {
    const newOptions = [...options]
    newOptions[index][key] = value
    setOptions(newOptions)
  }

  const removeOption = (index: number) => {
    if (options.length === 1) return
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('context', context)
      formData.append('cost_constraint', costConstraint)
      formData.append('time_constraint', timeConstraint)
      formData.append('scalability_requirement', scalabilityRequirement)
      formData.append('risk_tolerance', riskTolerance)
      
      const validOptions = options.filter(o => o.title.trim() !== '')
      
      const decision = await createDecision(projectId, formData, validOptions)
      router.push(`/projects/${projectId}/decisions/${decision.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create decision')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 mb-8">
        {[1, 2].map(s => (
          <div key={s} className={`h-2 flex-1 rounded-full ${step >= s ? 'bg-[--accent]' : 'bg-[--bg-elevated]'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-[--radius-sm] bg-[--danger-muted] border border-[--danger]/20 p-3 text-sm text-[--danger]">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-1">Step 1: Context & Constraints</h2>
            <p className="text-[--text-secondary] text-sm">Define the problem, constraints, and goals.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Decision Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Choose authentication strategy" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-sm font-medium mb-1 block text-[--text-secondary]">Cost Constraint</label>
                 <Input value={costConstraint} onChange={e => setCostConstraint(e.target.value)} placeholder="e.g. Low budget, open source preferred" className="text-sm" />
              </div>
              <div>
                 <label className="text-sm font-medium mb-1 block text-[--text-secondary]">Time/Delivery</label>
                 <Input value={timeConstraint} onChange={e => setTimeConstraint(e.target.value)} placeholder="e.g. Must launch in 2 weeks" className="text-sm" />
              </div>
              <div>
                 <label className="text-sm font-medium mb-1 block text-[--text-secondary]">Scalability Requirement</label>
                 <Input value={scalabilityRequirement} onChange={e => setScalabilityRequirement(e.target.value)} placeholder="e.g. Handle 10k CCU" className="text-sm" />
              </div>
              <div>
                 <label className="text-sm font-medium mb-1 block text-[--text-secondary]">Risk Tolerance</label>
                 <Input value={riskTolerance} onChange={e => setRiskTolerance(e.target.value)} placeholder="e.g. Low risk, cannot afford downtime" className="text-sm" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Context & Additional Info</label>
              <textarea 
                value={context} 
                onChange={e => setContext(e.target.value)} 
                rows={4}
                placeholder="What problem/goal is this decision for? Define requirements and constraints..."
                className="flex w-full rounded-xl border border-[rgba(124,108,242,0.18)] bg-white/60 backdrop-blur-sm px-3 py-2 text-sm text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:ring-2 focus:ring-[rgba(124,108,242,0.15)] focus:border-[rgba(124,108,242,0.40)] resize-none"
              />
              <div className="text-xs text-[--text-muted] mt-1 text-right">
                {context.length} / 100 min chars recommended for AI
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-[--border-subtle]">
            <Button onClick={() => setStep(2)} disabled={!title || context.length < 10}>Next Step</Button>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-1">Step 2: Options</h2>
            <p className="text-[--text-secondary] text-sm">Define at least two competing options.</p>
          </div>

          <div className="space-y-4">
            {options.map((opt, i) => (
              <div key={i} className="p-4 border border-[rgba(124,108,242,0.15)] rounded-2xl bg-white/60 backdrop-blur-sm relative shadow-[0_2px_12px_rgba(124,108,242,0.06)]">
                {options.length > 1 && (
                  <button onClick={() => removeOption(i)} className="absolute right-2 top-2 text-[--text-muted] hover:text-[--danger]">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <Input 
                    value={opt.title} 
                    onChange={e => updateOption(i, 'title', e.target.value)} 
                    placeholder={`Option ${i+1} Title`} 
                    className="bg-[--bg-surface]" 
                  />
                  <textarea 
                    value={opt.description} 
                    onChange={e => updateOption(i, 'description', e.target.value)} 
                    rows={2}
                    placeholder="Description..."
                    className="flex w-full rounded-xl border border-[rgba(124,108,242,0.18)] bg-white/60 backdrop-blur-sm px-3 py-2 text-sm text-[--text-primary] placeholder:text-[--text-muted] focus:outline-none focus:border-[rgba(124,108,242,0.40)] resize-none"
                  />
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={addOption}>
              <Plus className="h-4 w-4" /> Add Option
            </Button>
          </div>

          <div className="flex justify-between pt-4 border-t border-[--border-subtle]">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleSubmit} disabled={loading || options.filter(o => o.title).length < 1}>
              {loading ? 'Creating...' : 'Create & Analyze'}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
