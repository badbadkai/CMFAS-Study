import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../../components/Header'
import { getModule } from '../../data/modules'
import { compTopics, topTraps } from '../../data/m9/computations'

export default function CompHome() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  if (!mod || !mod.comp) return <Navigate to="/" replace />

  const modes = [
    {
      key: 'learn',
      label: 'Learn',
      desc: `${compTopics.length} topics, taught step by step with worked examples.`,
    },
    {
      key: 'formulas',
      label: 'Formulas',
      desc: 'The quick-recall reference sheet. Read it until it sticks.',
    },
    {
      key: 'drill',
      label: 'Drill',
      desc: 'Infinite generated problems. New numbers every time.',
    },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Computations" subtitle={`${mod.name} \u2014 every calculation type`} />
      <div className="grid gap-3 px-4 pt-4">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => navigate(`/m/${moduleId}/comp/${m.key}`)}
            className="tile"
          >
            <span className="text-lg font-bold">{m.label}</span>
            <span className="mt-0.5 block text-sm text-slate-400">{m.desc}</span>
          </button>
        ))}
      </div>

      <div className="mx-4 mt-5 rounded-2xl bg-amber-400/10 p-4 ring-1 ring-amber-400/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          The three mistakes that cost the most marks
        </p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-snug text-amber-100/90 marker:text-amber-300">
          {topTraps.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
