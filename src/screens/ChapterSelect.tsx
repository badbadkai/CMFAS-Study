import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getModule } from '../data/modules'

export default function ChapterSelect() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)

  if (!mod) return <Navigate to="/" replace />
  if (mod.chapters.length === 0) return <Navigate to={`/m/${moduleId}`} replace />

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Study" subtitle={`${mod.name} \u2014 pick a chapter`} />
      <div className="grid gap-2.5 px-4 pt-4">
        {mod.chapters.map((c) => (
          <button
            key={c.id}
            onClick={() => navigate(`/m/${moduleId}/study/${c.id}`)}
            className="tile flex items-center justify-between gap-3"
          >
            <span className="min-w-0">
              <span className="text-xs font-semibold text-accent">Chapter {c.num}</span>
              <span className="block truncate text-[15px] font-semibold leading-tight">{c.title}</span>
              <span className="text-xs text-slate-500">{c.concepts.length} concepts</span>
            </span>
          </button>
        ))}
      </div>
      <p className="px-5 py-6 text-center text-xs text-slate-600">Swipe or tap to flip and advance.</p>
    </div>
  )
}
