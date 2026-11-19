import type { ReactNode } from 'react'

export function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent ?? '#6366f1' }} />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  )
}

export function EmptyState({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="text-lg font-bold">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-500">{sub}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ProgressBar({ value, color = '#6366f1' }: { value: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }} />
    </div>
  )
}

export function sentimentBadge(s: string) {
  if (s === 'positive') return <span className="badge bg-emerald-100 text-emerald-700">Positive</span>
  if (s === 'negative') return <span className="badge bg-red-100 text-red-700">Negative</span>
  return <span className="badge bg-slate-100 text-slate-600">Neutral</span>
}
