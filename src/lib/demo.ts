import type { AppState, Brand, Check, Engine, Prompt } from './types'

export const ENGINES: Engine[] = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Grok', 'Copilot']

export const BRAND_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function seededRandom(seed: number) {
  let x = seed || 1
  return () => {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    return x / 0x7fffffff
  }
}

export function simulateCheck(brand: Brand, prompt: Prompt, engine: Engine): Omit<Check, 'id' | 'created_at'> {
  const rnd = seededRandom(hashCode(brand.name + prompt.text + engine))
  const brandStrength = 0.35 + rnd() * 0.55
  const mentioned = rnd() < brandStrength + 0.15
  const position = mentioned ? 1 + Math.floor(rnd() * 5) : null
  const visibility_score = mentioned
    ? Math.round(Math.max(20, 100 - (position! - 1) * 14 - rnd() * 12))
    : Math.round(rnd() * 18)
  const sentiment = rnd() < 0.62 ? 'positive' : rnd() < 0.85 ? 'neutral' : 'negative'
  const citePool = [
    `${brand.domain}/blog/guide`,
    `${brand.domain}/pricing`,
    `${brand.domain}/features`,
    'wikipedia.org',
    'techcrunch.com',
    'forbes.com',
    'reddit.com/r/SaaS',
    'g2.com',
  ]
  const citations = mentioned
    ? citePool.filter(() => rnd() > 0.55).slice(0, 3)
    : citePool.filter(() => rnd() > 0.8).slice(0, 1)
  const answer_snippet = mentioned
    ? `When asked "${prompt.text}", ${engine} recommends ${brand.name} as one of the top options (position #${position}), highlighting its ${brand.description || 'core features'} and citing ${citations[0] ?? brand.domain}.`
    : `When asked "${prompt.text}", ${engine} did not mention ${brand.name}. Competitors dominated the answer. Consider adding structured content and citations to improve GEO visibility.`
  return {
    user_id: brand.user_id,
    brand_id: brand.id,
    prompt_id: prompt.id,
    engine,
    mentioned,
    position,
    visibility_score,
    sentiment: sentiment as Check['sentiment'],
    citations,
    answer_snippet,
  }
}

export function seedDemo(userId: string): AppState {
  const now = new Date()
  const iso = (daysAgo: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString()
  }
  const brands: Brand[] = [
    { id: uid(), user_id: userId, name: 'NovaPay', domain: 'novapay.io', description: 'instant cross-border payments for freelancers', color: '#6366f1', created_at: iso(30) },
    { id: uid(), user_id: userId, name: 'CloudNest', domain: 'cloudnest.app', description: 'serverless hosting for indie hackers', color: '#0ea5e9', created_at: iso(22) },
  ]
  const promptTexts = [
    'best payment platform for freelancers in 2026',
    'how to send money internationally with low fees',
    'top fintech apps for remote workers',
    'best serverless hosting for small startups',
    'how to deploy a Next.js app cheaply',
    'best alternatives to Vercel for indie hackers',
  ]
  const prompts: Prompt[] = promptTexts.map((text, i) => ({
    id: uid(),
    user_id: userId,
    brand_id: brands[i < 3 ? 0 : 1].id,
    text,
    intent: (i % 3 === 0 ? 'commercial' : i % 3 === 1 ? 'informational' : 'transactional') as Prompt['intent'],
    created_at: iso(20 - i),
  }))
  const competitors = [
    { id: uid(), user_id: userId, brand_id: brands[0].id, name: 'Wise', domain: 'wise.com', created_at: iso(18) },
    { id: uid(), user_id: userId, brand_id: brands[0].id, name: 'Payoneer', domain: 'payoneer.com', created_at: iso(18) },
    { id: uid(), user_id: userId, brand_id: brands[1].id, name: 'Vercel', domain: 'vercel.com', created_at: iso(15) },
    { id: uid(), user_id: userId, brand_id: brands[1].id, name: 'Netlify', domain: 'netlify.com', created_at: iso(15) },
  ]
  const checks: Check[] = []
  for (let day = 13; day >= 0; day--) {
    for (const p of prompts) {
      const b = brands.find((x) => x.id === p.brand_id)!
      for (const e of ENGINES) {
        if (day % 2 === 0 || e === 'ChatGPT' || e === 'Perplexity') {
          checks.push({
            ...simulateCheck(b, p, e),
            id: uid(),
            created_at: iso(day),
          })
        }
      }
    }
  }
  return { brands, competitors, prompts, checks }
}

export function uidGen() { return uid() }
