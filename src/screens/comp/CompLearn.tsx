import { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../../components/Header'
import { getModule } from '../../data/modules'
import { compTopics } from '../../data/m9/computations'
import type { CompExample } from '../../types'

/** One worked example with steps revealed one at a time. */
function Example({ ex, index }: { ex: CompExample; index: number }) {
  const [shown, setShown] = useState(0)
  const total = ex.steps.length
  const done = shown >= total

  return (
    <div className="rounded-2xl bg-panel p-4 ring-1 ring-white/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Example {index + 1} {'\u2014'} {ex.title}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-100">{ex.given}</p>

      {shown > 0 && (
        <ol className="mt-3 space-y-2 border-l-2 border-accent/30 pl-3">
          <AnimatePresence initial={false}>
            {ex.steps.slice(0, shown).map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm leading-relaxed text-slate-300"
              >
                {s}
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}

      {done ? (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl bg-accent/10 px-3 py-2 text-[15px] font-semibold text-accent ring-1 ring-accent/30"
        >
          {ex.answer}
        </motion.p>
      ) : (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {shown} / {total} steps
          </span>
          <button
            onClick={() => setShown((n) => n + 1)}
            className="rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent ring-1 ring-accent/40"
          >
            {shown === 0 ? 'Work it through' : shown === total - 1 ? 'Final step' : 'Next step'}
          </button>
        </div>
      )}
      {done && total > 0 && (
        <button
          onClick={() => setShown(0)}
          className="mt-2 text-xs font-semibold text-slate-500 underline-offset-2 hover:underline"
        >
          Reset steps
        </button>
      )}
    </div>
  )
}

export default function CompLearn() {
  const { moduleId = '', topicId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const idx = compTopics.findIndex((t) => t.id === topicId)
  if (!mod || !mod.comp) return <Navigate to="/" replace />
  if (idx === -1) return <Navigate to={`/m/${moduleId}/comp/learn`} replace />

  const topic = compTopics[idx]
  const prev = compTopics[idx - 1]
  const next = compTopics[idx + 1]

  return (
    <div className="flex flex-1 flex-col">
      <Header title={`Topic ${topic.num}`} subtitle={topic.title} />

      <div key={topic.id} className="flex-1 space-y-4 px-4 pt-4">
        <p className="text-sm font-semibold text-accent">{topic.tagline}</p>

        <div className="space-y-3">
          {topic.teach.map((p, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-slate-200">
              {p}
            </p>
          ))}
        </div>

        <div className="rounded-2xl bg-accent/5 p-4 ring-1 ring-accent/25">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Formulas</p>
          <ul className="mt-2 space-y-1.5">
            {topic.formulas.map((f, i) => (
              <li key={i} className="font-mono text-[13px] leading-snug text-slate-100">
                {f}
              </li>
            ))}
          </ul>
        </div>

        {topic.examples.map((ex, i) => (
          <Example key={`${topic.id}-${i}`} ex={ex} index={i} />
        ))}

        {topic.trap && (
          <p className="rounded-xl bg-amber-400/10 px-3 py-2.5 text-sm leading-snug text-amber-300 ring-1 ring-amber-400/20">
            Watch out: {topic.trap}
          </p>
        )}

        <button
          onClick={() => navigate(`/m/${moduleId}/comp/drill?t=${topic.id}`)}
          className="btn-accent w-full"
        >
          Drill this topic
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 py-6">
        <button
          onClick={() => prev && navigate(`/m/${moduleId}/comp/learn/${prev.id}`)}
          disabled={!prev}
          className="btn-ghost flex-1 disabled:opacity-30"
        >
          {prev ? `\u2190 Topic ${prev.num}` : 'Start'}
        </button>
        <button
          onClick={() =>
            next ? navigate(`/m/${moduleId}/comp/learn/${next.id}`) : navigate(`/m/${moduleId}/comp`)
          }
          className="btn-ghost flex-1"
        >
          {next ? `Topic ${next.num} \u2192` : 'Done'}
        </button>
      </div>
    </div>
  )
}
