import { useState } from 'react'
import { useParams, useSearchParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../../components/Header'
import { getModule } from '../../data/modules'
import { compTopics } from '../../data/m9/computations'
import { generateProblem, type DrillProblem } from '../../lib/compDrill'

export default function CompDrill() {
  const { moduleId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const topicId = params.get('t') ?? undefined
  const topic = compTopics.find((t) => t.id === topicId)

  const [problem, setProblem] = useState<DrillProblem>(() => generateProblem(topicId))
  const [revealed, setRevealed] = useState(false)
  const [got, setGot] = useState(0)
  const [total, setTotal] = useState(0)
  const [n, setN] = useState(1)

  const mod = getModule(moduleId)
  if (!mod || !mod.comp) return <Navigate to="/" replace />

  function next(gotIt: boolean) {
    setGot((g) => g + (gotIt ? 1 : 0))
    setTotal((t) => t + 1)
    setProblem(generateProblem(topicId))
    setRevealed(false)
    setN((k) => k + 1)
  }

  function clearTopic() {
    params.delete('t')
    setParams(params, { replace: true })
    setProblem(generateProblem(undefined))
    setRevealed(false)
    setN((k) => k + 1)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header
        title="Drill"
        subtitle={topic ? `Topic ${topic.num} \u2014 ${topic.title}` : 'Mixed \u2014 all topics'}
      />

      <div className="flex items-center justify-between px-4 pt-3">
        <span className="text-xs text-slate-500">
          {total === 0 ? 'Work it on paper, then reveal.' : `${got} / ${total} solved`}
        </span>
        {topic && (
          <button
            onClick={clearTopic}
            className="rounded-full px-3 py-1 text-xs font-semibold text-slate-400 ring-1 ring-white/10"
          >
            Switch to mixed
          </button>
        )}
      </div>

      <div className="flex-1 px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={n}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.18 }}
            className="rounded-3xl bg-panel p-6 ring-1 ring-white/10"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              {problem.topicTitle}
            </span>
            <p className="mt-3 text-[16px] leading-relaxed text-slate-100">{problem.prompt}</p>

            {revealed && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Worked solution
                </p>
                <ol className="mt-2 space-y-2 border-l-2 border-accent/30 pl-3">
                  {problem.steps.map((s, i) => (
                    <li key={i} className="text-sm leading-relaxed text-slate-300">
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 rounded-xl bg-accent/10 px-3 py-2 text-[15px] font-semibold text-accent ring-1 ring-accent/30">
                  {problem.answer}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-6">
        {!revealed ? (
          <button onClick={() => setRevealed(true)} className="btn-accent flex-1">
            Reveal solution
          </button>
        ) : (
          <>
            <button onClick={() => next(false)} className="btn-ghost flex-1">
              Missed it
            </button>
            <button onClick={() => next(true)} className="btn-accent flex-1">
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  )
}
