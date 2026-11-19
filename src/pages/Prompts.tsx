import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import { EmptyState } from '../components/ui'
import type { Prompt } from '../lib/types'

const SUGGESTIONS = [
  'best {brand} alternatives in 2026',
  'how to choose the best {brand} for small teams',
  'top rated {brand} reviews',
  'is {brand} worth it?',
]

export default function Prompts() {
  const { state, addPrompt, deletePrompt } = useStore()
  const [brandId, setBrandId] = useState('')
  const [text, setText] = useState('')
  const [intent, setIntent] = useState<Prompt['intent']>('commercial')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!brandId) { setError('Select a brand first.'); return }
    try {
      await addPrompt({ brand_id: brandId, text: text.trim(), intent })
      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add prompt')
    }
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Prompts</h1><p className="text-sm text-slate-500">Questions your customers ask AI engines.</p></div>
      {state.brands.length === 0 ? (
        <EmptyState title="Add a brand first" sub="Prompts belong to a brand. Create a brand to continue." />
      ) : (
        <>
          <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-[1fr_2fr_1fr_auto]">
            <div>
              <label className="label">Brand</label>
              <select className="input" value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
                <option value="">Select…</option>
                {state.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div><label className="label">Prompt text *</label><input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="best payment platform for freelancers" required /></div>
            <div>
              <label className="label">Intent</label>
              <select className="input" value={intent} onChange={(e) => setIntent(e.target.value as Prompt['intent'])}>
                <option value="informational">Informational</option>
                <option value="commercial">Commercial</option>
                <option value="transactional">Transactional</option>
                <option value="navigational">Navigational</option>
              </select>
            </div>
            <div className="flex items-end"><button className="btn-primary"><Plus size={16} /> Add</button></div>
            {error && <p className="md:col-span-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          </form>
          <div className="card p-5">
            <p className="text-sm font-semibold">Need ideas? Try:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => setText(s.replace('{brand}', state.brands[0]?.name ?? 'your brand'))} className="badge bg-slate-100 text-slate-700 hover:bg-indigo-50">{s}</button>
              ))}
            </div>
          </div>
          <div className="card divide-y divide-slate-100">
            {state.prompts.length === 0 && <p className="p-5 text-sm text-slate-500">No prompts yet.</p>}
            {state.prompts.map((p) => {
              const b = state.brands.find((x) => x.id === p.brand_id)
              const cs = state.checks.filter((c) => c.prompt_id === p.id)
              const score = cs.length ? Math.round(cs.reduce((a, c) => a + c.visibility_score, 0) / cs.length) : 0
              return (
                <div key={p.id} className="flex items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.text}</p>
                    <p className="text-xs text-slate-500">{b?.name} · {p.intent} · {cs.length} checks</p>
                  </div>
                  <span className="badge bg-indigo-50 text-indigo-700">{score}/100</span>
                  <button onClick={() => deletePrompt(p.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
