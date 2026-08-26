import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../../components/Header'
import { getModule } from '../../data/modules'
import { compTopics } from '../../data/m9/computations'

export default function CompTopics() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  if (!mod || !mod.comp) return <Navigate to="/" replace />

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Learn" subtitle={`${mod.name} Computations \u2014 pick a topic`} />
      <div className="grid gap-2.5 px-4 pt-4">
        {compTopics.map((t) => (
          <button
            key={t.id}
            onClick={() => navigate(`/m/${moduleId}/comp/learn/${t.id}`)}
            className="tile flex items-center gap-3"
          >
            <span className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-accent">Topic {t.num}</span>
              <span className="mt-0.5 block break-words text-[15px] font-semibold leading-tight">
                {t.title}
              </span>
              <span className="text-xs text-slate-500">{t.tagline}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="px-5 py-6 text-center text-xs text-slate-600">
        Almost every topic is FV = PV × (1 + i)ⁿ in disguise.
      </p>
    </div>
  )
}
