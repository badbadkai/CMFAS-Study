import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import { getModule } from '../data/modules'
import { shuffle, sample } from '../lib/shuffle'
import { saveMockResult } from '../lib/storage'
import type { Letter, MockQuestion } from '../types'

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']
const EXAM_SECONDS = 120 * 60

export default function MockExam() {
  const { moduleId = '', paper = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)

  const isRandom = paper === 'random'
  const paperNum = Number(paper)

  const questions = useMemo<MockQuestion[]>(() => {
    if (!mod || mod.mocks.length === 0) return []
    if (isRandom) {
      const all = mod.mocks.flatMap((p) => p.questions)
      const count = mod.mocks[0]?.questions.length ?? 100
      return sample(all, Math.min(count, all.length))
    }
    const found = mod.mocks.find((p) => p.paper === paperNum)
    return found ? shuffle(found.questions) : []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, paper])

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, Letter>>({})
  const [done, setDone] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [reviewIdx, setReviewIdx] = useState(0)
  const [remaining, setRemaining] = useState(EXAM_SECONDS)
  const savedRef = useRef(false)

  const score = useMemo(
    () => questions.reduce((n, q) => (answers[q.num] === q.answer ? n + 1 : n), 0),
    [answers, questions]
  )

  function finish() {
    if (savedRef.current) return
    savedRef.current = true
    const total = questions.length
    const sc = questions.reduce((n, q) => (answers[q.num] === q.answer ? n + 1 : n), 0)
    saveMockResult({
      moduleId,
      paper: isRandom ? 'random' : paperNum,
      score: sc,
      total,
      ts: Date.now(),
    })
    setDone(true)
  }

  useEffect(() => {
    if (done || questions.length === 0) return
    if (remaining <= 0) {
      finish()
      return
    }
    const t = setTimeout(() => setRemaining((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, done, questions.length])

  if (!mod || mod.mocks.length === 0) return <Navigate to={`/m/${moduleId}`} replace />
  if (questions.length === 0) return <Navigate to={`/m/${moduleId}/mock`} replace />

  const q = questions[idx]
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const lowTime = remaining <= 300

  function answer(letter: Letter) {
    setAnswers((a) => ({ ...a, [q.num]: letter }))
    if (idx + 1 >= questions.length) finish()
    else setIdx((n) => n + 1)
  }

  // ---- Result screen ----
  if (done && !reviewing) {
    const total = questions.length
    const pct = Math.round((score / total) * 100)
    const answered = Object.keys(answers).length
    return (
      <div className="flex flex-1 flex-col">
        <Header title="Result" subtitle={isRandom ? 'Random paper' : `Exam Paper ${paperNum}`} />
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
          <p className={`text-6xl font-black ${pct >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{pct}%</p>
          <p className="text-slate-300">
            {score} / {total} correct
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {pct >= 70 ? 'Pass. You cleared the 70% line.' : 'Below 70%. Review the misses and run it again.'}
          </p>
          {answered < total && (
            <p className="mt-1 text-xs text-amber-400/80">{total - answered} left blank when time ran out.</p>
          )}
        </div>
        <div className="flex gap-3 px-4 pb-6">
          <button onClick={() => navigate(`/m/${moduleId}/mock`)} className="btn-ghost flex-1">
            Exit
          </button>
          <button
            onClick={() => {
              setReviewIdx(0)
              setReviewing(true)
            }}
            className="btn-accent flex-1"
          >
            Review answers
          </button>
        </div>
      </div>
    )
  }

  // ---- Review screen ----
  if (done && reviewing) {
    const rq = questions[reviewIdx]
    const chosen = answers[rq.num]
    const wrongCount = questions.filter((x) => answers[x.num] !== x.answer).length
    return (
      <div className="flex flex-1 flex-col">
        <Header title={`Review ${reviewIdx + 1} of ${questions.length}`} subtitle={`${wrongCount} wrong`} />

        <div className="px-4 pt-4">
          <p className="whitespace-pre-line text-[15px] font-semibold leading-snug">{rq.stem}</p>
        </div>

        <div className="grid gap-2.5 px-4 pt-4">
          {LETTERS.map((L) => {
            const isCorrect = L === rq.answer
            const isChosen = L === chosen
            let cls = 'bg-panel ring-white/10'
            if (isCorrect) cls = 'bg-emerald-500/20 ring-emerald-400/50'
            else if (isChosen) cls = 'bg-rose-500/20 ring-rose-400/50'
            else cls = 'bg-panel/60 ring-white/5 opacity-60'
            return (
              <div key={L} className={`rounded-2xl px-4 py-3 text-[15px] leading-snug ring-1 ${cls}`}>
                <span className="mr-2 font-bold text-slate-400">{L}</span>
                {rq.options[L]}
                {isCorrect && <span className="ml-2 text-xs font-bold text-emerald-400">correct</span>}
                {isChosen && !isCorrect && <span className="ml-2 text-xs font-bold text-rose-400">your answer</span>}
              </div>
            )
          })}
          {!chosen && <p className="px-1 text-xs text-amber-400/80">You left this one blank.</p>}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 px-4 pb-6 pt-4">
          <button
            onClick={() => setReviewIdx((n) => Math.max(0, n - 1))}
            disabled={reviewIdx === 0}
            className="btn-ghost flex-1 disabled:opacity-30"
          >
            Prev
          </button>
          <button onClick={() => setReviewing(false)} className="btn-ghost px-4 text-xs">
            Summary
          </button>
          <button
            onClick={() => setReviewIdx((n) => Math.min(questions.length - 1, n + 1))}
            disabled={reviewIdx === questions.length - 1}
            className="btn-accent flex-1 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  // ---- Exam in progress ----
  return (
    <div className="flex flex-1 flex-col">
      <Header
        title={`Q${idx + 1} of ${questions.length}`}
        subtitle={isRandom ? 'Random paper' : `Exam Paper ${paperNum}`}
      />

      <div className="flex items-center justify-between px-4 pt-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-all" style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
        </div>
        <span className={`ml-3 tabular-nums text-sm font-bold ${lowTime ? 'text-rose-400' : 'text-slate-300'}`}>
          {mm}:{ss}
        </span>
      </div>

      <div className="px-4 pt-5">
        <p className="whitespace-pre-line text-[17px] font-semibold leading-snug">{q.stem}</p>
      </div>

      <div className="grid gap-2.5 px-4 pt-5 pb-6">
        {LETTERS.map((L) => (
          <motion.button
            key={L}
            whileTap={{ scale: 0.98 }}
            onClick={() => answer(L)}
            className="rounded-2xl bg-panel px-4 py-3.5 text-left text-[15px] font-medium leading-snug ring-1 ring-white/10"
          >
            <span className="mr-2 font-bold text-slate-400">{L}</span>
            {q.options[L]}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
