import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Auth({ onBack }: { onBack: () => void }) {
  const { login, signup, mode } = useStore()
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') await login(email, password)
      else await signup(email, password, name || email.split('@')[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="mb-4 text-sm font-medium text-slate-500 hover:text-indigo-600">← Back to home</button>
        <div className="card p-7">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white"><BarChart3 size={22} /></div>
            <div>
              <p className="font-extrabold">GEO Brand Tracker</p>
              <p className="text-xs text-slate-500">{mode === 'supabase' ? 'Supabase auth enabled' : 'Demo mode — any credentials work'}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            {(['login', 'signup'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-2 text-sm font-semibold capitalize ${tab === t ? 'bg-white shadow' : 'text-slate-500'}`}>{t}</button>
            ))}
          </div>
          <form onSubmit={submit} className="mt-5 space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="label">Full name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Haseeb Riasat" required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>{loading ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}</button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">
            {mode === 'demo'
              ? 'Tip: use demo@geo.app / anything to explore with seeded data.'
              : 'Secured by Supabase Auth.'}
          </p>
        </div>
      </div>
    </div>
  )
}
