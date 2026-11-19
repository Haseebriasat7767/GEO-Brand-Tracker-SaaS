import { ArrowRight, BarChart3, CheckCircle2, Play, Radar, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { useStore } from '../lib/store'

export default function Landing({ onLogin }: { onLogin: () => void }) {
  const { enterDemo } = useStore()
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white"><BarChart3 size={20} /></div>
            <span className="text-lg font-extrabold tracking-tight">GEO Brand Tracker</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <a href="#how" className="hover:text-indigo-600">How it works</a>
            <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onLogin} className="btn-ghost hidden sm:inline-flex">Sign in</button>
            <button onClick={enterDemo} className="btn-primary"><Play size={16} /> Try live demo</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 text-center">
        <span className="badge bg-indigo-50 text-indigo-700"><Sparkles size={13} className="mr-1" /> See how AI sees your brand</span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          When people ask AI, does it mention you?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          People now ask ChatGPT, Claude and Google AI instead of searching. This tool checks what those AIs say about your brand — and shows you how to show up more.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={enterDemo} className="btn-primary px-6 py-3 text-base"><Play size={18} /> Try the live demo — no signup</button>
          <button onClick={onLogin} className="btn-ghost px-6 py-3 text-base">Create free account</button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Demo loads sample data instantly. No credit card, no setup.</p>

        {/* Mock dashboard preview */}
        <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-medium text-slate-500">Your dashboard preview</span>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div className="rounded-xl bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Visibility score</p>
              <p className="mt-1 text-3xl font-extrabold">72<span className="text-base text-slate-400">/100</span></p>
              <p className="text-xs text-slate-500">How strongly AI recommends you</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Mention rate</p>
              <p className="mt-1 text-3xl font-extrabold">64%</p>
              <p className="text-xs text-slate-500">Of answers that mention you</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Avg position</p>
              <p className="mt-1 text-3xl font-extrabold">#2.1</p>
              <p className="text-xs text-slate-500">Where you rank when mentioned</p>
            </div>
          </div>
          <div className="border-t border-slate-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Example question</p>
            <p className="mt-1 text-sm font-medium">“Best payment platform for freelancers?”</p>
            <p className="mt-1 text-sm text-slate-600">ChatGPT → <span className="font-semibold text-emerald-600">NovaPay mentioned #2</span> · Claude → <span className="font-semibold text-red-500">Not mentioned</span> · Perplexity → <span className="font-semibold text-emerald-600">NovaPay mentioned #1</span></p>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: '6', v: 'AI engines checked' },
            { k: '1 min', v: 'To run your first check' },
            { k: 'Free', v: 'Demo with sample data' },
            { k: 'CSV', v: 'Export your reports' },
          ].map((s) => (
            <div key={s.v} className="card p-5">
              <p className="text-2xl font-extrabold text-indigo-600">{s.k}</p>
              <p className="mt-1 text-sm text-slate-500">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">What you get</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">Three simple things that tell you exactly how visible you are in AI answers.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Radar, t: 'Visibility score', d: 'One clear number (0–100) showing how prominently AI recommends your brand.' },
              { icon: TrendingUp, t: 'Beat your competitors', d: 'See if rivals get mentioned more than you — and where you are losing.' },
              { icon: ShieldCheck, t: 'See your sources', d: 'AI cites websites. Find out which pages it trusts — and which ones to fix.' },
            ].map((f) => (
              <div key={f.t} className="card p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><f.icon size={22} /></div>
                <h3 className="mt-4 font-bold">{f.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-center text-3xl font-extrabold tracking-tight">How it works — 3 steps</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { n: 'Step 1', t: 'Add your brand', d: 'Type your brand name and website. Takes 30 seconds.' },
            { n: 'Step 2', t: 'Add questions', d: 'Add the questions your customers ask AI, like “best tool for X”.' },
            { n: 'Step 3', t: 'Click “Run checks”', d: 'We ask 6 AI engines and show you exactly what they say about you.' },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <p className="text-sm font-extrabold text-indigo-600">{s.n}</p>
              <h3 className="mt-2 font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button onClick={enterDemo} className="btn-primary px-6 py-3 text-base"><Play size={18} /> Start now — it’s free</button>
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Simple pricing</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { name: 'Starter', price: '$0', feats: ['1 brand', '10 questions', '2 AI engines', 'Weekly checks'] },
              { name: 'Pro', price: '$29/mo', feats: ['5 brands', '100 questions', 'All 6 AI engines', 'Daily checks + reports'], hot: true },
              { name: 'Agency', price: '$99/mo', feats: ['Unlimited brands', 'Unlimited questions', 'API + white-label', 'Priority support'] },
            ].map((p) => (
              <div key={p.name} className={`card p-6 ${p.hot ? 'ring-2 ring-indigo-600' : ''}`}>
                <p className="font-bold">{p.name}</p>
                <p className="mt-2 text-3xl font-extrabold">{p.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {p.feats.map((f) => <li key={f} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" />{f}</li>)}
                </ul>
                <button onClick={enterDemo} className={`mt-6 w-full ${p.hot ? 'btn-primary' : 'btn-ghost'}`}>Get started <ArrowRight size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-500">
        GEO Brand Tracker — See how AI sees your brand. © 2026
      </footer>
    </div>
  )
}
