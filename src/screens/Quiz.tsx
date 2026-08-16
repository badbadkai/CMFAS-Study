import { useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { getModule, moduleConceptPool } from '../data/modules'
import { generateQuiz } from '../lib/quizEngine'
import { saveQuizResult } from '../lib/storage'
import type { QuizQuestion } from '../types'

export default function Quiz() {
  const { moduleId = '', chapterId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const chapter = mod?.chapters.find((c) => c.id === chapterId)

  const [seed, setSeed] = useState(0)
  const questions = useMemo<QuizQuestion[]>(() => {
    if (!chapter) return []
    return generateQuiz(chapter, moduleConceptPool(moduleId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, moduleId, seed])

  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [wrong, setWrong] = useState<string[]>([])
  const [done, setDone] = useState(false)

  if (!mod || !chapter) return <Navigate to="/" replace />
  const q = questions[idx]

  function choose(oi: number) {
    if (chosen !== null) return
    setChosen(oi)
    if (q.options[oi].correct) setScore((s) => s + 1)
    else setWrong((w) => [...w, q.conceptId])
  }

  function next() {
    if (idx + 1 >= questions.length) {
      const finalWrong = wrong
      saveQuizResult({
        moduleId,
        chapterId,
        score,
        total: questions.length,
        ts: Date.now(),
        wrongConceptIds: finalWrong,
      })
      setDone(true)
    } else {
      setIdx((n) => n + 1)
      setChosen(null)
    }
  }

  function restart() {
    setSeed((s) => s + 1)
    setIdx(0)
    setChosen(null)
    setScore(0)
    setWrong([])
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Result" subtitle={`${chapter.title}`} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className="text-6xl font-black text-accent">{pct}%</p>
          <p className="text-slate-300">
            {score} / {questions.length} correct
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {pct >= 70 ? 'Above the 70% pass line. Keep it up.' : 'Below 70%. Run it again to lock it in.'}
          </p>
        </div>
        <div className="flex gap-3 px-4 pb-6">
          <button onClick={() => navigate(`/m/${moduleId}/quiz`)} className="btn-ghost flex-1">
            Chapters
          </button>
          <button onClick={restart} className="btn-accent flex-1">
            New 10 questions
          </button>
        </div>
      </div>
    )
  }

  const correctIdx = q.options.findIndex((o) => o.correct)

  return (
    <div className="flex flex-1 flex-col">
      <Header title={`Q${idx + 1} of ${questions.length}`} subtitle={`Chapter ${chapter.num} \u2014 ${chapter.title}`} />

      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5">
        <p className="whitespace-pre-line text-lg font-semibold leading-snug">{q.prompt}</p>
      </div>

      <div className="grid gap-2.5 px-4 pt-5">
        {q.options.map((o, oi) => {
          let cls = 'bg-panel ring-white/10'
          if (chosen !== null) {
            if (oi === correctIdx) cls = 'bg-emerald-500/20 ring-emerald-400/50'
            else if (oi === chosen) cls = 'bg-rose-500/20 ring-rose-400/50'
            else cls = 'bg-panel/60 ring-white/5 opacity-60'
          }
          return (
            <motion.button
              key={oi}
              whileTap={{ scale: chosen === null ? 0.98 : 1 }}
              onClick={() => choose(oi)}
              className={`rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium leading-snug ring-1 ${cls}`}
            >
              {o.text}
            </motion.button>
          )
        })}
      </div>

      {chosen !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-4">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className={`text-sm font-bold ${q.options[chosen].correct ? 'text-emerald-400' : 'text-rose-400'}`}>
              {q.options[chosen].correct ? 'Correct' : 'Not quite'}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-300">{q.explanation}</p>
          </div>
        </motion.div>
      )}

      <div className="mt-auto px-4 pb-6 pt-4">
        <button onClick={next} disabled={chosen === null} className="btn-accent w-full disabled:opacity-30">
          {idx + 1 >= questions.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
