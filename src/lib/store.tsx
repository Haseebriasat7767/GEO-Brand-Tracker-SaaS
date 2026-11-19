import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState, Brand, Check, Competitor, Engine, Prompt, User } from './types'
import { seedDemo, simulateCheck, uidGen } from './demo'
import { isSupabaseConfigured, supabase } from './supabase'

interface StoreCtx {
  user: User | null
  mode: 'supabase' | 'demo'
  state: AppState
  login: (email: string, password: string, name?: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  enterDemo: () => Promise<void>
  logout: () => void
  addBrand: (b: Omit<Brand, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteBrand: (id: string) => Promise<void>
  addCompetitor: (c: Omit<Competitor, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteCompetitor: (id: string) => Promise<void>
  addPrompt: (p: Omit<Prompt, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  runChecks: (brandId: string, promptIds: string[], engines: Engine[]) => Promise<Check[]>
  resetDemo: () => void
}

const Ctx = createContext<StoreCtx | null>(null)
const LS_USER = 'geo_user'
const LS_STATE = 'geo_state'

function loadState(userId: string): AppState {
  try {
    const raw = localStorage.getItem(LS_STATE)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.brands.some((b) => b.user_id === userId)) return parsed
    }
  } catch { /* ignore */ }
  return seedDemo(userId)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try { const r = localStorage.getItem(LS_USER); return r ? JSON.parse(r) : null } catch { return null }
  })
  const [state, setState] = useState<AppState>(() => {
    const u = (() => { try { const r = localStorage.getItem(LS_USER); return r ? JSON.parse(r) as User : null } catch { return null } })()
    if (u) return loadState(u.id)
    return { brands: [], competitors: [], prompts: [], checks: [] }
  })

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user))
    else localStorage.removeItem(LS_USER)
  }, [user])

  useEffect(() => {
    if (user) localStorage.setItem(LS_STATE, JSON.stringify(state))
  }, [state, user])

  // Supabase session restore
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      const s = data.session?.user
      if (s) {
        const u: User = { id: s.id, email: s.email ?? '', name: (s.user_metadata?.name as string) ?? s.email?.split('@')[0] ?? 'User' }
        setUser(u)
        setState(loadState(u.id))
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const s = session?.user
      if (s) {
        const u: User = { id: s.id, email: s.email ?? '', name: (s.user_metadata?.name as string) ?? s.email?.split('@')[0] ?? 'User' }
        setUser(u)
      } else {
        setUser(null)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string, name?: string) => {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const u: User = { id: data.user!.id, email, name: name ?? data.user!.user_metadata?.name ?? email.split('@')[0] }
      setUser(u)
      setState(loadState(u.id))
      return
    }
    // Demo mode: any email/password works, stable id per email
    const id = 'demo-' + email.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const u: User = { id, email, name: name ?? email.split('@')[0] }
    setUser(u)
    setState(loadState(id))
  }

  const signup = async (email: string, password: string, name: string) => {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) throw error
      if (data.user) {
        const u: User = { id: data.user.id, email, name }
        setUser(u)
        setState(loadState(u.id))
      }
      return
    }
    await login(email, password, name)
  }

  const enterDemo = async () => {
    const u: User = { id: 'demo-demo-geo-app', email: 'demo@geo.app', name: 'Demo User' }
    setUser(u)
    setState(loadState(u.id))
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    setState({ brands: [], competitors: [], prompts: [], checks: [] })
  }

  const addBrand = async (b: Omit<Brand, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    const brand: Brand = { ...b, id: uidGen(), user_id: user.id, created_at: new Date().toISOString() }
    if (supabase) {
      const { error } = await supabase.from('brands').insert(brand)
      if (error) throw error
    }
    setState((s) => ({ ...s, brands: [...s.brands, brand] }))
  }

  const deleteBrand = async (id: string) => {
    if (supabase) await supabase.from('brands').delete().eq('id', id)
    setState((s) => ({
      ...s,
      brands: s.brands.filter((b) => b.id !== id),
      competitors: s.competitors.filter((c) => c.brand_id !== id),
      prompts: s.prompts.filter((p) => p.brand_id !== id),
      checks: s.checks.filter((c) => c.brand_id !== id),
    }))
  }

  const addCompetitor = async (c: Omit<Competitor, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    const comp: Competitor = { ...c, id: uidGen(), user_id: user.id, created_at: new Date().toISOString() }
    if (supabase) {
      const { error } = await supabase.from('competitors').insert(comp)
      if (error) throw error
    }
    setState((s) => ({ ...s, competitors: [...s.competitors, comp] }))
  }

  const deleteCompetitor = async (id: string) => {
    if (supabase) await supabase.from('competitors').delete().eq('id', id)
    setState((s) => ({ ...s, competitors: s.competitors.filter((c) => c.id !== id) }))
  }

  const addPrompt = async (p: Omit<Prompt, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return
    const prompt: Prompt = { ...p, id: uidGen(), user_id: user.id, created_at: new Date().toISOString() }
    if (supabase) {
      const { error } = await supabase.from('prompts').insert(prompt)
      if (error) throw error
    }
    setState((s) => ({ ...s, prompts: [...s.prompts, prompt] }))
  }

  const deletePrompt = async (id: string) => {
    if (supabase) await supabase.from('prompts').delete().eq('id', id)
    setState((s) => ({ ...s, prompts: s.prompts.filter((p) => p.id !== id), checks: s.checks.filter((c) => c.prompt_id !== id) }))
  }

  const runChecks = async (brandId: string, promptIds: string[], engines: Engine[]) => {
    if (!user) return []
    const brand = state.brands.find((b) => b.id === brandId)
    if (!brand) return []
    const newChecks: Check[] = []
    for (const pid of promptIds) {
      const prompt = state.prompts.find((p) => p.id === pid)
      if (!prompt) continue
      for (const engine of engines) {
        const c: Check = { ...simulateCheck(brand, prompt, engine), id: uidGen(), created_at: new Date().toISOString() }
        newChecks.push(c)
      }
    }
    if (supabase && newChecks.length) {
      const { error } = await supabase.from('checks').insert(newChecks)
      if (error) throw error
    }
    setState((s) => ({ ...s, checks: [...s.checks, ...newChecks] }))
    return newChecks
  }

  const resetDemo = () => {
    if (!user) return
    setState(seedDemo(user.id))
  }

  const value = useMemo<StoreCtx>(() => ({
    user,
    mode: isSupabaseConfigured ? 'supabase' : 'demo',
    state,
    login, signup, enterDemo, logout,
    addBrand, deleteBrand, addCompetitor, deleteCompetitor, addPrompt, deletePrompt, runChecks, resetDemo,
  }), [user, state])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore outside provider')
  return ctx
}
