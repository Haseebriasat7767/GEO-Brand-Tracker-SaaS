import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { useStore } from '../lib/store'
import { EmptyState, ProgressBar } from '../components/ui'

export default function Reports() {
  const { state } = useStore()
  const { brands, checks, prompts } = state

  const rows = useMemo(() => prompts.map((p) => {
    const cs = checks.filter((c) => c.prompt_id === p.id)
    const score = cs.length ? Math.round(cs.reduce((a, c) => a + c.visibility_score, 0) / cs.length) : 0
    const mentions = cs.filter((c) => c.mentioned).length
    return { prompt: p.text, brand: brands.find((b) => b.id === p.brand_id)?.name ?? '', score, mentions, total: cs.length }
  }), [prompts, checks, brands])

  const exportCsv = () => {
    const header = 'Prompt,Brand,Score,Mentions,Total Checks\n'
    const body = rows.map((r) => `"${r.prompt.replace(/"/g, '""')}","${r.brand}",${r.score},${r.mentions},${r.total}`).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'geo-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!checks.length) return <EmptyState title="No data to report" sub="Run AI checks first, then come back for reports." />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold tracking-tight">Reports</h1><p className="text-sm text-slate-500">Per-prompt visibility breakdown.</p></div>
        <button className="btn-ghost" onClick={exportCsv}><Download size={16} /> Export CSV</button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="p-4">Prompt</th><th className="p-4">Brand</th><th className="p-4">Score</th><th className="p-4">Mentions</th><th className="p-4 w-48">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="p-4 font-medium">{r.prompt}</td>
                <td className="p-4">{r.brand}</td>
                <td className="p-4 font-bold">{r.score}/100</td>
                <td className="p-4">{r.mentions}/{r.total}</td>
                <td className="p-4"><ProgressBar value={r.score} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
