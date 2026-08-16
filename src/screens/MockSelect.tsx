import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getModule } from '../data/modules'
import { getMockResults, type MockResult } from '../lib/storage'

export default function MockSelect() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const [results, setResults] = useState<MockResult[]>([])

  useEffect(() => {
    getMockResults().then((all) => setResults(all.filter((r) => r.moduleId === moduleId)))
  }, [moduleId])

  if (!mod || mod.mocks.length === 0) return <Navigate to={`/m/${moduleId}`} replace />

  function bestFor(paper: number | 'random') {
    const runs = results.filter((r) => r.paper === paper)
    if (runs.length === 0) return null
    return Math.max(...runs.map((r) => Math.round((r.score / r.total) * 100)))
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Mock Exam" subtitle={`${mod.name} \u2014 full timed paper`} />

      <div className="grid gap-2.5 px-4 pt-4">
        {mod.mocks.map((p) => {
          const best = bestFor(p.paper)
          return (
            <button
              key={p.paper}
              onClick={() => navigate(`/m/${moduleId}/mock/${p.paper}`)}
              className="tile flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <span className="text-[15px] font-bold">Exam Paper {p.paper}</span>
                <span className="block text-xs text-slate-500">{p.questions.length} questions {'\u00b7'} 120 min</span>
              </span>
              {best !== null && (
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold text-slate-200">{best}%</span>
                  <span className="text-[10px] text-slate-500">best</span>
                </span>
              )}
            </button>
          )
        })}

        <button
          onClick={() => navigate(`/m/${moduleId}/mock/random`)}
          className="tile flex items-center justify-between gap-3 ring-accent/30"
        >
          <span className="min-w-0">
            <span className="text-[15px] font-bold text-accent">Random Paper</span>
            <span className="block text-xs text-slate-500">
              {mod.mocks[0]?.questions.length ?? 100} drawn from all papers, reshuffled
            </span>
          </span>
          {bestFor('random') !== null && (
            <span className="shrink-0 text-right">
              <span className="block text-sm font-bold text-slate-200">{bestFor('random')}%</span>
              <span className="text-[10px] text-slate-500">best</span>
            </span>
          )}
        </button>
      </div>

      <p className="px-5 py-6 text-center text-xs text-slate-600">
        Timed like the real thing. Grade shows at the end, then review every question.
      </p>
    </div>
  )
}
