import { useEffect, useMemo, useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import MockReview from '../components/MockReview'
import { getModule } from '../data/modules'
import { getMockResults, type MockResult } from '../lib/storage'
import type { MockQuestion } from '../types'

export default function MockHistory() {
  const { moduleId = '' } = useParams()
  const mod = getModule(moduleId)
  const [results, setResults] = useState<MockResult[]>([])
  const [loaded, setLoaded] = useState(false)
  const [viewing, setViewing] = useState<MockResult | null>(null)

  useEffect(() => {
    getMockResults().then((all) => {
      setResults(all.filter((r) => r.moduleId === moduleId).sort((a, b) => b.ts - a.ts))
      setLoaded(true)
    })
  }, [moduleId])

  const byId = useMemo(() => {
    const m = new Map<string, MockQuestion>()
    if (mod) for (const p of mod.mocks) for (const q of p.questions) m.set(q.id, q)
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  if (!mod || mod.mocks.length === 0) return <Navigate to={`/m/${moduleId}`} replace />

  function reviewable(r: MockResult): boolean {
    return Boolean(r.questionIds && r.answers && r.questionIds.every((id) => byId.has(id)))
  }

  if (viewing) {
    const qs = viewing.questionIds!.map((id) => byId.get(id)!)
    return <MockReview questions={qs} answers={viewing.answers ?? {}} onBack={() => setViewing(null)} backLabel="Attempts" />
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Past Attempts" subtitle={`${mod.name} \u2014 mock exam history`} />

      {loaded && results.length === 0 && (
        <p className="px-6 pt-10 text-center text-sm text-slate-500">
          No attempts yet. Finish a mock paper and it will show up here.
        </p>
      )}

      <div className="grid gap-2.5 px-4 pt-4">
        {results.map((r, i) => {
          const pct = Math.round((r.score / r.total) * 100)
          const canReview = reviewable(r)
          const when = new Date(r.ts).toLocaleString(undefined, {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })
          return (
            <button
              key={r.id ?? `${r.ts}-${i}`}
              onClick={() => canReview && setViewing(r)}
              disabled={!canReview}
              className="tile flex items-center justify-between gap-3 disabled:opacity-60"
            >
              <span className="min-w-0 text-left">
                <span className="text-[15px] font-bold">
                  {r.paper === 'random' ? 'Random Paper' : `Exam Paper ${r.paper}`}
                </span>
                <span className="block text-xs text-slate-500">
                  {when} {'\u00b7'} {r.score}/{r.total}
                  {!canReview && <> {'\u00b7'} no review saved</>}
                </span>
              </span>
              <span className="shrink-0 text-right">
                <span className={`block text-sm font-bold ${pct >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pct}%
                </span>
                {canReview && <span className="text-[10px] text-slate-500">review</span>}
              </span>
            </button>
          )
        })}
      </div>

      {results.length > 0 && (
        <p className="px-5 py-6 text-center text-xs text-slate-600">
          Tap an attempt to walk through every question with your answer and the explanation.
        </p>
      )}
    </div>
  )
}
