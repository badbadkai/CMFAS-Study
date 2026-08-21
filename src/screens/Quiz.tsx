import { useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { getModule } from '../data/modules'
import { sample, shuffle } from '../lib/shuffle'
import { saveQuizResult } from '../lib/storage'
import type { Letter, PlayableQuestion } from '../types'

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']
const QUIZ_LEN = 15

export default function Quiz() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)

  const [seed, setSeed] = useState(0)
  const questions = useMemo<PlayableQuestion[]>(() => {
    if (!mod) return []
    const pool: PlayableQuestion[] =
      mod.quiz && mod.quiz.length > 0 ? mod.quiz : mod.mocks.flatMap((p) => p.questions)
    return sample(pool, Math.min(QUIZ_LEN, pool.length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, seed])

  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<Letter | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  // Randomise the on-screen position of the options so the answer slot is not memorable.
  const order = useMemo<Letter[]>(() => shuffle(LETTERS), [idx, seed])

  if (!mod) return <Navigate to="/" replace />
  if (questions.length === 0) return <Navigate to={`/m/${moduleId}`} replace />
  const q = questions[idx]

  function choose(orig: Letter) {
    if (chosen !== null) return
    setChosen(orig)
    if (orig === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (idx + 1 >= questions.length) {
      saveQuizResult({
        moduleId,
        chapterId: 'quiz',
        score,
        total: questions.length,
        ts: Date.now(),
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
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Result" subtitle={`${mod.name} Quiz`} />
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
          <button onClick={() => navigate(`/m/${moduleId}`)} className="btn-ghost flex-1">
            Back
          </button>
          <button onClick={restart} className="btn-accent flex-1">
            New set
          </button>
        </div>
      </div>
    )
  }

  const correct = chosen === q.answer

  return (
    <div className="flex flex-1 flex-col">
      <Header title={`Q${idx + 1} of ${questions.length}`} subtitle={`${mod.name} \u2014 Quiz Me`} />

      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5">
        <p className="whitespace-pre-line text-[17px] font-semibold leading-snug">{q.stem}</p>
      </div>

      <div className="grid gap-2.5 px-4 pt-5">
        {order.map((orig, i) => {
          let cls = 'bg-panel ring-white/10'
          if (chosen !== null) {
            if (orig === q.answer) cls = 'bg-emerald-500/20 ring-emerald-400/50'
            else if (orig === chosen) cls = 'bg-rose-500/20 ring-rose-400/50'
            else cls = 'bg-panel/60 ring-white/5 opacity-60'
          }
          return (
            <motion.button
              key={orig}
              whileTap={{ scale: chosen === null ? 0.98 : 1 }}
              onClick={() => choose(orig)}
              className={`rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium leading-snug ring-1 ${cls}`}
            >
              <span className="mr-2 font-bold text-slate-400">{LETTERS[i]}</span>
              {q.options[orig]}
            </motion.button>
          )
        })}
      </div>

      {chosen !== null && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 px-4">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <p className={`text-sm font-bold ${correct ? 'text-emerald-400' : 'text-rose-400'}`}>
              {correct ? 'Correct' : 'Not quite'}
            </p>
            {!correct && (
              <p className="mt-1 text-sm text-slate-300">
                <span className="font-semibold text-slate-400">Answer: </span>
                {q.options[q.answer]}
              </p>
            )}
            {q.explanation && <p className="mt-2 text-sm leading-snug text-slate-300">{q.explanation}</p>}
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
