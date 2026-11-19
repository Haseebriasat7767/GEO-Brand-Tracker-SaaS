import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/store'
import { BRAND_COLORS } from '../lib/demo'
import { EmptyState } from '../components/ui'

export default function Brands() {
  const { state, addBrand, deleteBrand } = useStore()
  const [name, setName] = useState('')
  const [domain, setDomain] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(BRAND_COLORS[0])
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await addBrand({ name: name.trim(), domain: domain.trim().replace(/^https?:\/\//, ''), description: description.trim(), color })
      setName(''); setDomain(''); setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add brand')
    }
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Brands</h1><p className="text-sm text-slate-500">Track one or more brands across AI engines.</p></div>
      <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2">
        <div><label className="label">Brand name *</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="NovaPay" required /></div>
        <div><label className="label">Domain *</label><input className="input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="novapay.io" required /></div>
        <div className="md:col-span-2"><label className="label">What does it do?</label><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="instant cross-border payments for freelancers" /></div>
        <div>
          <label className="label">Color</label>
          <div className="flex gap-2">
            {BRAND_COLORS.map((c) => (
              <button type="button" key={c} onClick={() => setColor(c)} className={`h-8 w-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-slate-800' : ''}`} style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="flex items-end"><button className="btn-primary w-full"><Plus size={16} /> Add brand</button></div>
        {error && <p className="md:col-span-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      </form>

      {state.brands.length === 0 ? (
        <EmptyState title="No brands yet" sub="Add your first brand above to start tracking." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.brands.map((b) => {
            const cs = state.checks.filter((c) => c.brand_id === b.id)
            const score = cs.length ? Math.round(cs.reduce((a, c) => a + c.visibility_score, 0) / cs.length) : 0
            return (
              <div key={b.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-extrabold text-white" style={{ background: b.color }}>{b.name[0]}</div>
                    <div>
                      <p className="font-bold">{b.name}</p>
                      <p className="text-sm text-slate-500">{b.domain}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteBrand(b.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
                <p className="mt-3 text-sm text-slate-600">{b.description || '—'}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{state.prompts.filter((p) => p.brand_id === b.id).length} prompts · {cs.length} checks</span>
                  <span className="badge bg-indigo-50 text-indigo-700">Score {score}/100</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
