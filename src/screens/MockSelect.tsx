import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getModule } from '../data/modules'
import { getMockResults, getMockSessions, type MockResult, type MockSession } from '../lib/storage'

export default function MockSelect() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const [results, setResults] = useState<MockResult[]>([])
  const [sessions, setSessions] = useState<MockSession[]>([])

  useEffect(() => {
    getMockResults().then((all) => setResults(all.filter((r) => r.moduleId === moduleId)))
    getMockSessions(moduleId).then(setSessions)
  }, [moduleId])

  if (!mod || mod.mocks.length === 0) return <Navigate to={`/m/${moduleId}`} replace />

  function bestFor(paper: number | 'random') {
    const runs = results.filter((r) => r.paper === paper)
    if (runs.length === 0) return null
    return Math.max(...runs.map((r) => Math.round((r.score / r.total) * 100)))
  }

  function sessionFor(paper: number | 'random') {
    return sessions.find((s) => s.paper === paper) ?? null
  }

  function rightSide(paper: number | 'random') {
    const sess = sessionFor(paper)
    if (sess) {
      return (
        <span className="shrink-0 text-right">
          <span className="block text-sm font-bold text-amber-400">{Object.keys(sess.answers).length} answered</span>
          <span className="text-[10px] text-amber-400/80">resume</span>
        </span>
      )
    }
    const best = bestFor(paper)
    if (best === null) return null
    return (
      <span className="shrink-0 text-right">
        <span className="block text-sm font-bold text-slate-200">{best}%</span>
        <span className="text-[10px] text-slate-500">best</span>
      </span>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Mock Exam" subtitle={`${mod.name} \u2014 full timed paper`} />

      <div className="grid gap-2.5 px-4 pt-4">
        {mod.mocks.map((p) => (
          <button
            key={p.paper}
            onClick={() => navigate(`/m/${moduleId}/mock/${p.paper}`)}
            className="tile flex items-center justify-between gap-3"
          >
            <span className="min-w-0">
              <span className="text-[15px] font-bold">Exam Paper {p.paper}</span>
              <span className="block text-xs text-slate-500">{p.questions.length} questions {'\u00b7'} 120 min</span>
            </span>
            {rightSide(p.paper)}
          </button>
        ))}

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
          {rightSide('random')}
        </button>

        <button
          onClick={() => navigate(`/m/${moduleId}/mock/history`)}
          className="tile flex items-center justify-between gap-3"
        >
          <span className="min-w-0">
            <span className="text-[15px] font-bold">Past Attempts</span>
            <span className="block text-xs text-slate-500">Every finished paper, reviewable with explanations</span>
          </span>
          {results.length > 0 && (
            <span className="shrink-0 text-right">
              <span className="block text-sm font-bold text-slate-200">{results.length}</span>
              <span className="text-[10px] text-slate-500">{results.length === 1 ? 'attempt' : 'attempts'}</span>
            </span>
          )}
        </button>
      </div>

      <p className="px-5 py-6 text-center text-xs text-slate-600">
        Timed like the real thing. Progress saves as you go, so you can leave and resume.
      </p>
    </div>
  )
}
