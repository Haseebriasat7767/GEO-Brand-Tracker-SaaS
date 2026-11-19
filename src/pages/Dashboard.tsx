import { useMemo } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, CheckCircle2, Circle, Play } from 'lucide-react'
import { useStore } from '../lib/store'
import { ENGINES } from '../lib/demo'
import { EmptyState, ProgressBar, StatCard } from '../components/ui'
import type { Page } from '../components/Sidebar'

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Dashboard({ go }: { go: (p: Page) => void }) {
  const { state, user } = useStore()
  const { brands, checks, prompts, competitors } = state

  const steps = [
    { label: 'Add your brand', done: brands.length > 0, page: 'brands' as Page, hint: 'Your company name + website' },
    { label: 'Add questions customers ask AI', done: prompts.length > 0, page: 'prompts' as Page, hint: 'e.g. “best tool for X”' },
    { label: 'Run your first AI check', done: checks.length > 0, page: 'checks' as Page, hint: 'Ask 6 AI engines what they say' },
    { label: 'Add a competitor', done: competitors.length > 0, page: 'competitors' as Page, hint: 'See if rivals show up more' },
  ]
  const doneCount = steps.filter((s) => s.done).length
  const allDone = doneCount === steps.length

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
    return { engine: e, score: cs.length ? Math.round(cs.reduce((a, c) => a + c.visibility_score, 0) / cs.length) : 0 }
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
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋</h1>
          <p className="text-sm text-slate-500">Let’s find out what AI says about your brand. It takes about 2 minutes.</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold">Your setup checklist — {doneCount}/4 done</h3>
          <div className="mt-4 space-y-3">
            {steps.map((s) => (
              <button key={s.label} onClick={() => go(s.page)} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left hover:border-indigo-300">
                {s.done ? <CheckCircle2 size={22} className="shrink-0 text-emerald-500" /> : <Circle size={22} className="shrink-0 text-slate-300" />}
                <span className="flex-1">
                  <span className={`block font-semibold ${s.done ? 'text-slate-400 line-through' : ''}`}>{s.label}</span>
                  <span className="block text-xs text-slate-500">{s.hint}</span>
                </span>
                {!s.done && <ArrowRight size={18} className="text-indigo-500" />}
              </button>
            ))}
          </div>
        </div>
        <EmptyState title="Start with your brand" sub="Add your brand name and website — we’ll guide you from there." action={<button className="btn-primary" onClick={() => go('brands')}>Add my brand <ArrowRight size={16} /></button>} />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Your AI visibility at a glance</h1>
        <p className="text-sm text-slate-500">{brands.length} brand(s) · {prompts.length} questions · {checks.length} AI checks run</p>
      </div>

      {!allDone && (
        <div className="card border-indigo-100 bg-indigo-50/50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-bold">Almost there — finish your setup ({doneCount}/4)</h3>
            <button className="btn-primary" onClick={() => go(steps.find((s) => !s.done)!.page)}>
              <Play size={16} /> {steps.find((s) => !s.done)!.label}
            </button>
          </div>
          <div className="mt-3"><ProgressBar value={(doneCount / 4) * 100} /></div>
        </div>
      )}

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Visibility score" value={`${stats.avg}/100`} sub="How strongly AI recommends you. Higher is better." accent="#6366f1" />
          <StatCard label="Mention rate" value={`${stats.mentionRate}%`} sub="Share of AI answers that mention you." accent="#10b981" />
          <StatCard label="Avg position" value={`#${stats.avgPos}`} sub="Where you rank when AI mentions you. #1 is best." accent="#f59e0b" />
          <StatCard label="Positive tone" value={`${stats.posPct}%`} sub="Share of answers that sound positive about you." accent="#0ea5e9" />
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <h3 className="font-bold">Is your visibility going up or down?</h3>
          <p className="text-xs text-slate-500">Average score each day — the line should climb over time.</p>
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
          <h3 className="font-bold">Who gets mentioned most?</h3>
          <p className="text-xs text-slate-500">Your share of AI mentions vs your other brands.</p>
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
          <h3 className="font-bold">Which AI likes you most?</h3>
          <p className="text-xs text-slate-500">Score per engine — focus on the lowest bars first.</p>
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
          <h3 className="font-bold">Your top questions</h3>
          <p className="text-xs text-slate-500">Where you score highest — and where you need help.</p>
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
          <button className="btn-primary mt-5 w-full" onClick={() => go('checks')}><Play size={16} /> Run new AI checks</button>
        </div>
      </div>
    </div>
  )
}
