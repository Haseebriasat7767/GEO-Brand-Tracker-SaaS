import { ArrowRight, BarChart3, CheckCircle2, Radar, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'

export default function Landing({ onLogin }: { onLogin: () => void }) {
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
          <button onClick={onLogin} className="btn-primary">Sign in <ArrowRight size={16} /></button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 text-center">
        <span className="badge bg-indigo-50 text-indigo-700"><Sparkles size={13} className="mr-1" /> Generative Engine Optimization</span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Is your brand visible when AI answers?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          Track how ChatGPT, Claude, Gemini, Perplexity, Grok and Copilot mention, rank and cite your brand — and beat your competitors in AI answers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={onLogin} className="btn-primary px-6 py-3 text-base">Start tracking free <ArrowRight size={18} /></button>
          <a href="#features" className="btn-ghost px-6 py-3 text-base">See features</a>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { k: '6', v: 'AI engines tracked' },
            { k: '98%', v: 'Mention accuracy' },
            { k: '24h', v: 'Fresh checks' },
            { k: '4.9★', v: 'Customer rating' },
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
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Everything you need to win AI answers</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Radar, t: 'AI Visibility Score', d: 'A single score per prompt and engine showing how prominently AI recommends you.' },
              { icon: TrendingUp, t: 'Share of Voice', d: 'Compare your mention rate against competitors across every engine.' },
              { icon: ShieldCheck, t: 'Citation tracking', d: 'See which pages AI cites — and which competitors get cited instead.' },
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
        <h2 className="text-center text-3xl font-extrabold tracking-tight">How it works</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { n: '01', t: 'Add your brand', d: 'Enter your domain and the prompts your customers ask AI.' },
            { n: '02', t: 'Run AI checks', d: 'We query 6 AI engines and record mentions, positions and citations.' },
            { n: '03', t: 'Improve & repeat', d: 'Get actionable insights and watch your Visibility Score climb.' },
          ].map((s) => (
            <div key={s.n} className="card p-6">
              <p className="text-sm font-extrabold text-indigo-600">{s.n}</p>
              <h3 className="mt-2 font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">Simple pricing</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { name: 'Starter', price: '$0', feats: ['1 brand', '10 prompts', '2 engines', 'Weekly checks'] },
              { name: 'Pro', price: '$29/mo', feats: ['5 brands', '100 prompts', 'All 6 engines', 'Daily checks + reports'], hot: true },
              { name: 'Agency', price: '$99/mo', feats: ['Unlimited brands', 'Unlimited prompts', 'API + white-label', 'Priority support'] },
            ].map((p) => (
              <div key={p.name} className={`card p-6 ${p.hot ? 'ring-2 ring-indigo-600' : ''}`}>
                <p className="font-bold">{p.name}</p>
                <p className="mt-2 text-3xl font-extrabold">{p.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {p.feats.map((f) => <li key={f} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" />{f}</li>)}
                </ul>
                <button onClick={onLogin} className={`mt-6 w-full ${p.hot ? 'btn-primary' : 'btn-ghost'}`}>Get started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-500">
        GEO Brand Tracker SaaS — Built with Supabase + React. © 2026
      </footer>
    </div>
  )
}
