import { useMemo, useState } from 'react'
import { Play, RefreshCw } from 'lucide-react'
import { useStore } from '../lib/store'
import { ENGINES } from '../lib/demo'
import { EmptyState, sentimentBadge } from '../components/ui'
import type { Engine } from '../lib/types'

export default function Checks() {
  const { state, runChecks } = useStore()
  const [brandId, setBrandId] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [engines, setEngines] = useState<Engine[]>(['ChatGPT', 'Claude', 'Perplexity'])
  const [running, setRunning] = useState(false)
  const [justRan, setJustRan] = useState(0)

  const brandPrompts = useMemo(() => state.prompts.filter((p) => p.brand_id === brandId), [state.prompts, brandId])
  const sorted = useMemo(() => [...state.checks].sort((a, b) => b.created_at.localeCompare(a.created_at)), [state.checks])

  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const toggleEngine = (e: Engine) => setEngines((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]))

  const run = async () => {
    if (!brandId || !selected.length || !engines.length) return
    setRunning(true)
    try {
      const res = await runChecks(brandId, selected, engines)
      setJustRan(res.length)
    } finally {
      setRunning(false)
    }
  }

  if (!state.brands.length) {
    return <EmptyState title="No brands yet" sub="Add a brand and prompts before running AI checks." />
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold tracking-tight">AI Checks</h1><p className="text-sm text-slate-500">Simulate asking each AI engine your prompts and record visibility.</p></div>

      <div className="card space-y-4 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Brand</label>
            <select className="input" value={brandId} onChange={(e) => { setBrandId(e.target.value); setSelected([]) }}>
              <option value="">Select brand…</option>
              {state.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Engines</label>
            <div className="flex flex-wrap gap-2">
              {ENGINES.map((e) => (
                <button key={e} onClick={() => toggleEngine(e)} className={`badge cursor-pointer ${engines.includes(e) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{e}</button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Prompts</label>
            <button className="text-xs font-semibold text-indigo-600" onClick={() => setSelected(brandPrompts.map((p) => p.id))}>Select all</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {brandPrompts.length === 0 && <p className="text-sm text-slate-500">No prompts for this brand. Add them in Prompts.</p>}
            {brandPrompts.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 p-3 text-sm hover:border-indigo-300">
                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} className="mt-0.5" />
                <span>{p.text}</span>
              </label>
            ))}
          </div>
        </div>
        <button className="btn-primary w-full sm:w-auto" disabled={running || !brandId || !selected.length || !engines.length} onClick={run}>
          {running ? <><RefreshCw size={16} className="animate-spin" /> Running…</> : <><Play size={16} /> Run {selected.length * engines.length} checks</>}
        </button>
        {justRan > 0 && <p className="text-sm text-emerald-600">✓ {justRan} new checks recorded below.</p>}
      </div>

      <div className="card divide-y divide-slate-100">
        {sorted.length === 0 && <p className="p-5 text-sm text-slate-500">No checks yet. Run your first check above.</p>}
        {sorted.slice(0, 30).map((c) => {
          const b = state.brands.find((x) => x.id === c.brand_id)
          const p = state.prompts.find((x) => x.id === c.prompt_id)
          return (
            <div key={c.id} className="p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge bg-slate-900 text-white">{c.engine}</span>
                <span className="font-semibold">{b?.name}</span>
                <span className="text-sm text-slate-500">“{p?.text}”</span>
                <span className="ml-auto flex items-center gap-2">
                  {sentimentBadge(c.sentiment)}
                  <span className={`badge ${c.mentioned ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {c.mentioned ? `Mentioned #${c.position}` : 'Not mentioned'}
                  </span>
                  <span className="font-extrabold">{c.visibility_score}/100</span>
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">{c.answer_snippet}</p>
              {c.citations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.citations.map((x) => <span key={x} className="badge bg-indigo-50 text-indigo-700">{x}</span>)}
                </div>
              )}
              <p className="mt-1 text-xs text-slate-400">{new Date(c.created_at).toLocaleString()}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
