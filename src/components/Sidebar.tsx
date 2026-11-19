import { BarChart3, Building2, FileText, LayoutDashboard, LogOut, MessageSquareText, Radar, Settings, Swords, X } from 'lucide-react'
import { useStore } from '../lib/store'

export type Page = 'dashboard' | 'brands' | 'prompts' | 'competitors' | 'checks' | 'reports' | 'settings'

const NAV: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'brands', label: 'Brands', icon: Building2 },
  { id: 'prompts', label: 'Prompts', icon: MessageSquareText },
  { id: 'competitors', label: 'Competitors', icon: Swords },
  { id: 'checks', label: 'AI Checks', icon: Radar },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ page, setPage, open, onClose }: { page: Page; setPage: (p: Page) => void; open: boolean; onClose: () => void }) {
  const { user, logout, mode } = useStore()
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-950 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600"><BarChart3 size={20} /></div>
            <div>
              <p className="text-sm font-extrabold leading-none">GEO Tracker</p>
              <p className="mt-1 text-[11px] text-slate-400">AI Visibility SaaS</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={onClose}><X size={20} /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); onClose() }}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${page === n.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10'}`}
            >
              <n.icon size={18} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 rounded-xl bg-white/5 p-3">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
            <span className={`badge mt-2 ${mode === 'supabase' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
              {mode === 'supabase' ? '● Supabase connected' : '● Demo mode'}
            </span>
          </div>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
