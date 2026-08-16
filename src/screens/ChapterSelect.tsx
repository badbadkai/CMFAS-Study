import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getModule } from '../data/modules'
import { getChapterStats, type ChapterStat } from '../lib/storage'

export default function ChapterSelect({ mode }: { mode: 'study' | 'quiz' }) {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const [stats, setStats] = useState<Record<string, ChapterStat>>({})

  useEffect(() => {
    if (mode === 'quiz') getChapterStats(moduleId).then(setStats)
  }, [moduleId, mode])

  if (!mod) return <Navigate to="/" replace />

  return (
    <div className="flex flex-1 flex-col">
      <Header title={mode === 'study' ? 'Study' : 'Quiz Me'} subtitle={`${mod.name} \u2014 pick a chapter`} />
      <div className="grid gap-2.5 px-4 pt-4">
        {mod.chapters.map((c) => {
          const s = stats[c.id]
          return (
            <button
              key={c.id}
              onClick={() => navigate(`/m/${moduleId}/${mode}/${c.id}`)}
              className="tile flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <span className="text-xs font-semibold text-accent">Chapter {c.num}</span>
                <span className="block truncate text-[15px] font-semibold leading-tight">{c.title}</span>
                <span className="text-xs text-slate-500">{c.concepts.length} concepts</span>
              </span>
              {mode === 'quiz' && s && (
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-bold text-slate-200">{s.bestPct}%</span>
                  <span className="text-[10px] text-slate-500">best</span>
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="px-5 py-6 text-center text-xs text-slate-600">
        {mode === 'quiz' ? 'Each attempt draws a new random set.' : 'Swipe or tap to flip and advance.'}
      </p>
    </div>
  )
}
