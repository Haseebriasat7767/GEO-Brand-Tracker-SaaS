# GEO Brand Tracker SaaS

Track how AI engines (ChatGPT, Claude, Gemini, Perplexity, Grok, Copilot) mention, rank and cite your brand — Generative Engine Optimization (GEO) visibility tracking.

## What was broken / fixed
The repository contained only a `README.md` — no app code, no dependencies, nothing to run. This commit scaffolds the complete working SaaS:

- Marketing landing page + auth (Supabase Auth or demo mode)
- Dashboard with Visibility Score, Mention Rate, Share of Voice, trends & engine breakdown
- Brands, Prompts, Competitors CRUD
- AI Checks engine (simulated scoring across 6 engines with citations & sentiment)
- Reports with CSV export
- Supabase schema with RLS (`supabase/schema.sql`)

## Quick start (demo mode — no setup needed)
```bash
npm install
npm run dev        # http://localhost:5173
```
Sign in with any email/password (e.g. `demo@geo.app`) — seeded demo data loads automatically.

## Go live with Supabase
1. Create a project at https://supabase.com
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy `.env.example` to `.env` and set:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev` — the app switches from demo mode to Supabase Auth + Postgres automatically.

## Production build
```bash
npm run build
npm run preview
```

## Stack
React 18 + Vite + TypeScript + Tailwind CSS + Recharts + Supabase JS.
