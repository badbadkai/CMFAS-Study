import { useParams, Navigate } from 'react-router-dom'
import Header from '../../components/Header'
import { getModule } from '../../data/modules'
import { formulaGroups, topTraps } from '../../data/m9/computations'

export default function CompFormulas() {
  const { moduleId = '' } = useParams()
  const mod = getModule(moduleId)
  if (!mod || !mod.comp) return <Navigate to="/" replace />

  return (
    <div className="flex flex-1 flex-col">
      <Header title="Formulas" subtitle={`${mod.name} Computations \u2014 quick recall`} />
      <div className="space-y-3 px-4 pt-4">
        {formulaGroups.map((g) => (
          <div key={g.title} className="rounded-2xl bg-panel p-4 ring-1 ring-white/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{g.title}</p>
            <ul className="mt-2 space-y-1.5">
              {g.items.map((f, i) => (
                <li key={i} className="font-mono text-[13px] leading-snug text-slate-100">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="rounded-2xl bg-amber-400/10 p-4 ring-1 ring-amber-400/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            The three expensive mistakes
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-snug text-amber-100/90 marker:text-amber-300">
            {topTraps.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ol>
        </div>
      </div>
      <p className="px-5 py-6 text-center text-xs text-slate-600">
        Buy at offer. Cash out at bid. Count your periods.
      </p>
    </div>
  )
}
