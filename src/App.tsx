import { useState } from 'react'
import { Menu } from 'lucide-react'
import { StoreProvider, useStore } from './lib/store'
import Sidebar, { type Page } from './components/Sidebar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Brands from './pages/Brands'
import Prompts from './pages/Prompts'
import Competitors from './pages/Competitors'
import Checks from './pages/Checks'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function Shell() {
  const { user } = useStore()
  const [page, setPage] = useState<Page>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  if (!user) {
    if (showAuth) return <Auth onBack={() => setShowAuth(false)} />
    return <Landing onLogin={() => setShowAuth(true)} />
  }

  return (
    <div className="min-h-screen">
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <span className="font-extrabold capitalize">{page}</span>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          {page === 'dashboard' && <Dashboard go={setPage} />}
          {page === 'brands' && <Brands />}
          {page === 'prompts' && <Prompts />}
          {page === 'competitors' && <Competitors />}
          {page === 'checks' && <Checks />}
          {page === 'reports' && <Reports />}
          {page === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
