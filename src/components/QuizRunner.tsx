import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import { shuffle } from '../lib/shuffle'
import type { Letter, PlayableQuestion } from '../types'

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']

interface Props {
  questions: PlayableQuestion[]
  /** Header title while playing, e.g. "M9 - Quiz Me". */
  subtitle: string
  /** Called once when the run finishes, with the final score. */
  onComplete?: (score: number, total: number) => void
  /** Left button on the result screen. */
  onExit: () => void
  exitLabel?: string
  /** Right button on the result screen. Bump a seed/key in the parent to replay. */
  onRestart: () => void
  restartLabel?: string
}

export default function QuizRunner({
  questions,
  subtitle,
  onComplete,
  onExit,
  exitLabel = 'Back',
  onRestart,
  restartLabel = 'New set',
}: Props) {
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<Letter | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[idx]
  // Randomise the on-screen position of the options so the answer slot is not memorable.
  const order = useMemo<Letter[]>(() => shuffle(LETTERS), [idx])

  function choose(orig: Letter) {
    if (chosen !== null) return
    setChosen(orig)
    if (orig === q.answer) setScore((s) => s + 1)
  }

  function next() {
    if (idx + 1 >= questions.length) {
      // score already reflects the current question (updated in choose)
      onComplete?.(score, questions.length)
      setDone(true)
    } else {
      setIdx((n) => n + 1)
      setChosen(null)
    }
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Result" subtitle={subtitle} />
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
          <button onClick={onExit} className="btn-ghost flex-1">
            {exitLabel}
          </button>
          <button onClick={onRestart} className="btn-accent flex-1">
            {restartLabel}
          </button>
        </div>
      </div>
    )
  }

  const correct = chosen === q.answer

  return (
    <div className="flex flex-1 flex-col">
      <Header title={`Q${idx + 1} of ${questions.length}`} subtitle={subtitle} />

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
