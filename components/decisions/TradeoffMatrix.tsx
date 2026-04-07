'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card } from '@/components/ui/Card'

export function TradeoffMatrix({ options }: { options: any[] }) {
  if (!options || options.length === 0) return null

  // Transform data for recharts
  // Effort and Risk are inverted (11-score) so that "Higher" in the matrix always means "Better" (Low effort/Low risk)
  const data = [
    { subject: 'Impact', ...options.reduce((acc, o, i) => ({ ...acc, [`Option ${i + 1}`]: o.impact_score || 5 }), {}) },
    { subject: 'Effort (Inv)', ...options.reduce((acc, o, i) => ({ ...acc, [`Option ${i + 1}`]: 11 - (o.effort_score || 5) }), {}) },
    { subject: 'Risk (Inv)', ...options.reduce((acc, o, i) => ({ ...acc, [`Option ${i + 1}`]: 11 - (o.risk_score || 5) }), {}) },
    { subject: 'Feasibility', ...options.reduce((acc, o, i) => ({ ...acc, [`Option ${i + 1}`]: o.feasibility_score || 5 }), {}) },
    { subject: 'Strategy', ...options.reduce((acc, o, i) => ({ ...acc, [`Option ${i + 1}`]: o.strategic_alignment_score || 5 }), {}) },
  ]

  const colors = ['#7C6FE0', '#38BDF8', '#F59E0B', '#22C55E', '#EF4444']

  return (
    <Card className="h-80 w-full flex flex-col items-center p-4">
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="font-medium text-xs uppercase tracking-wider text-[--text-muted]">Trade-off Matrix</h3>
        <div className="flex gap-2">
          {options.map((opt, i) => (
             <div key={opt.id} className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
               <span className="text-[10px] text-[--text-secondary]">Opt {i+1}</span>
             </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
          <PolarGrid stroke="rgba(124,108,242,0.15)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(124,108,242,0.15)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(124,108,242,0.12)' }} 
            itemStyle={{ color: 'var(--text-primary)', fontSize: '11px' }}
          />

          {options.map((opt, i) => (
            <Radar
              key={opt.id}
              name={opt.title}
              dataKey={`Option ${i + 1}`}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.25}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-[--text-muted] mt-2 italic text-center leading-tight">
        *Effort and Risk are inverted. Higher surface area = superior trade-off balance.
      </p>
    </Card>
  )
}
