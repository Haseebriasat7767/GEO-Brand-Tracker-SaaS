import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import { EmptyState } from '../components/ui'

export default function Competitors() {
  const { state, addCompetitor, deleteCompetitor } = useStore()
  const [brandId, setBrandId] = useState('')
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!brandId) { setError('Select a brand first.'); return }
    try {
      await addCompetitor({ brand_id: brandId, name: name.trim(), domain: domain.trim().replace(/^https?:\/\//, '') })
      setName(''); setDomain('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add competitor')
    }
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Competitors</h1><p className="text-sm text-slate-500">Benchmark your Share of Voice against rivals.</p></div>
      {state.brands.length === 0 ? (
        <EmptyState title="Add a brand first" sub="Competitors are tracked per brand." />
      ) : (
        <>
          <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <label className="label">Your brand</label>
              <select className="input" value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
                <option value="">Select…</option>
                {state.brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div><label className="label">Competitor name *</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Wise" required /></div>
            <div><label className="label">Domain *</label><input className="input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="wise.com" required /></div>
            <div className="flex items-end"><button className="btn-primary"><Plus size={16} /> Add</button></div>
            {error && <p className="md:col-span-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          </form>
          <div className="card divide-y divide-slate-100">
            {state.competitors.length === 0 && <p className="p-5 text-sm text-slate-500">No competitors yet.</p>}
            {state.competitors.map((c) => {
              const b = state.brands.find((x) => x.id === c.brand_id)
              return (
                <div key={c.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 font-bold">{c.name[0]}</div>
                  <div className="flex-1"><p className="font-medium">{c.name}</p><p className="text-xs text-slate-500">{c.domain} · vs {b?.name}</p></div>
                  <button onClick={() => deleteCompetitor(c.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
