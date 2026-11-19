import { useStore } from '../lib/store'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Settings() {
  const { user, mode, resetDemo } = useStore()
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold tracking-tight">Settings</h1><p className="text-sm text-slate-500">Account and connection status.</p></div>
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Signed in as</label>
          <p className="font-semibold">{user?.name} <span className="font-normal text-slate-500">({user?.email})</span></p>
        </div>
        <div>
          <label className="label">Data mode</label>
          <p className="text-sm">{mode === 'supabase' ? 'Supabase connected — data is stored in your Supabase project.' : 'Demo mode — data is stored in your browser (localStorage).'}</p>
          <p className="mt-1 text-xs text-slate-500">
            {isSupabaseConfigured
              ? 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
              : 'To go live, create a Supabase project, run supabase/schema.sql, then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in a .env file and restart.'}
          </p>
        </div>
        {mode === 'demo' && (
          <div className="border-t border-slate-100 pt-4">
            <button className="btn-ghost" onClick={resetDemo}>Reset demo data</button>
          </div>
        )}
      </div>
    </div>
  )
}
