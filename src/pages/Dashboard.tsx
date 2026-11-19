import { useMemo } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useStore } from '../lib/store'
import { ENGINES } from '../lib/demo'
import { EmptyState, ProgressBar, StatCard } from '../components/ui'
import type { Page } from '../components/Sidebar'

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard({ go }: { go: (p: Page) => void }) {
  const { state } = useStore()
  const { brands, checks, prompts, competitors } = state

  const stats = useMemo(() => {
    if (!checks.length) return null
    const avg = Math.round(checks.reduce((a, c) => a + c.visibility_score, 0) / checks.length)
    const mentionRate = Math.round((checks.filter((c) => c.mentioned).length / checks.length) * 100)
    const avgPos = checks.filter((c) => c.position).reduce((a, c) => a + (c.position ?? 0), 0) / Math.max(1, checks.filter((c) => c.position).length)
    const pos = checks.filter((c) => c.sentiment === 'positive').length / checks.length
    return { avg, mentionRate, avgPos: avgPos.toFixed(1), posPct: Math.round(pos * 100) }
  }, [checks])

  const trend = useMemo(() => {
    const byDay = new Map<string, number[]>()
    for (const c of checks) {
      const d = c.created_at.slice(0, 10)
      if (!byDay.has(d)) byDay.set(d, [])
      byDay.get(d)!.push(c.visibility_score)
    }
    return [...byDay.entries()].sort().map(([date, vals]) => ({
      date: date.slice(5),
      score: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }))
  }, [checks])

  const byEngine = useMemo(() => ENGINES.map((e) => {
    const cs = checks.filter((c) => c.engine === e)
    return { engine: e, score: cs.length ? Math.round(cs.reduce((a, c) => a + c.visibility_score, 0) / cs.length) : 0, mentions: cs.filter((c) => c.mentioned).length }
  }), [checks])

  const sov = useMemo(() => {
    const total = checks.filter((c) => c.mentioned).length || 1
    return brands.map((b, i) => ({
      name: b.name,
      value: Math.round((checks.filter((c) => c.brand_id === b.id && c.mentioned).length / total) * 100),
      color: b.color || COLORS[i % COLORS.length],
    })).filter((x) => x.value > 0)
  }, [brands, checks])

  if (!brands.length) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <div className="mt-5"><EmptyState title="No brands yet" sub="Add your first brand to start tracking AI visibility." action={<button className="btn-primary" onClick={() => go('brands')}>Add a brand</button>} /></div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500">{brands.length} brand(s) · {prompts.length} prompts · {competitors.length} competitors · {checks.length} checks</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Avg Visibility Score" value={`${stats.avg}/100`} sub="Across all engines & prompts" accent="#6366f1" />
          <StatCard label="Mention Rate" value={`${stats.mentionRate}%`} sub="Share of answers mentioning you" accent="#10b981" />
          <StatCard label="Avg Position" value={`#${stats.avgPos}`} sub="When mentioned" accent="#f59e0b" />
          <StatCard label="Positive Sentiment" value={`${stats.posPct}%`} sub="Of AI answers about you" accent="#0ea5e9" />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-bold">Visibility trend</h3>
          <p className="text-xs text-slate-500">Average score per day</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Share of Voice</h3>
          <p className="text-xs text-slate-500">Mentions by brand</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sov} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {sov.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {sov.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                <span className="flex-1">{s.name}</span><span className="font-semibold">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold">Score by engine</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byEngine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="engine" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {byEngine.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Top prompts</h3>
          <div className="mt-4 space-y-3">
            {prompts.slice(0, 5).map((p) => {
              const cs = checks.filter((c) => c.prompt_id === p.id)
              const score = cs.length ? Math.round(cs.reduce((a, c) => a + c.visibility_score, 0) / cs.length) : 0
              return (
                <div key={p.id}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate">{p.text}</span>
                    <span className="font-bold">{score}</span>
                  </div>
                  <div className="mt-1"><ProgressBar value={score} /></div>
                </div>
              )
            })}
          </div>
          <button className="btn-ghost mt-5 w-full" onClick={() => go('checks')}>Run new AI checks →</button>
        </div>
      </div>
    </div>
  )
}
