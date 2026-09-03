import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import MockReview from '../components/MockReview'
import { getModule } from '../data/modules'
import { shuffle, sample } from '../lib/shuffle'
import { saveMockResult, getMockSession, saveMockSession, clearMockSession } from '../lib/storage'
import type { Letter, MockQuestion } from '../types'

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']
const EXAM_SECONDS = 120 * 60

export default function MockExam() {
  const { moduleId = '', paper = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)

  const isRandom = paper === 'random'
  const paperNum = Number(paper)
  const paperKey: number | 'random' = isRandom ? 'random' : paperNum

  const byId = useMemo(() => {
    const m = new Map<string, MockQuestion>()
    if (mod) for (const p of mod.mocks) for (const q of p.questions) m.set(q.id, q)
    return m
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId])

  const [questions, setQuestions] = useState<MockQuestion[]>([])
  const [ready, setReady] = useState(false)
  const [resumed, setResumed] = useState(false)
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Letter>>({})
  const [done, setDone] = useState(false)
  const [reviewing, setReviewing] = useState(false)
  const [remaining, setRemaining] = useState(EXAM_SECONDS)
  const savedRef = useRef(false)
  const remainingRef = useRef(EXAM_SECONDS)
  remainingRef.current = remaining

  // Restore an unfinished sitting if one exists, else deal a fresh paper.
  useEffect(() => {
    let alive = true
    getMockSession(moduleId, paperKey).then((s) => {
      if (!alive || !mod || mod.mocks.length === 0) return
      if (s) {
        const qs = s.questionIds.map((id) => byId.get(id)).filter((q): q is MockQuestion => Boolean(q))
        if (qs.length === s.questionIds.length && qs.length > 0) {
          setQuestions(qs)
          setAnswers(s.answers)
          setIdx(Math.min(s.idx, qs.length - 1))
          setRemaining(s.remaining > 0 ? s.remaining : EXAM_SECONDS)
          setResumed(true)
          setReady(true)
          return
        }
      }
      if (isRandom) {
        const all = mod.mocks.flatMap((p) => p.questions)
        const count = mod.mocks[0]?.questions.length ?? 100
        setQuestions(sample(all, Math.min(count, all.length)))
      } else {
        const found = mod.mocks.find((p) => p.paper === paperNum)
        setQuestions(found ? shuffle(found.questions) : [])
      }
      setReady(true)
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, paper])

  function persist() {
    if (savedRef.current || questions.length === 0) return
    saveMockSession({
      moduleId,
      paper: paperKey,
      questionIds: questions.map((q) => q.id),
      answers,
      idx,
      remaining: remainingRef.current,
      ts: Date.now(),
    })
  }

  // Save the sitting whenever an answer lands or the question changes.
  useEffect(() => {
    if (!ready || done) return
    persist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, idx, ready])

  const score = useMemo(
    () => questions.reduce((n, q) => (answers[q.id] === q.answer ? n + 1 : n), 0),
    [answers, questions]
  )

  function finish() {
    if (savedRef.current) return
    savedRef.current = true
    const total = questions.length
    const sc = questions.reduce((n, q) => (answers[q.id] === q.answer ? n + 1 : n), 0)
    const ts = Date.now()
    saveMockResult({
      id: String(ts),
      moduleId,
      paper: paperKey,
      score: sc,
      total,
      ts,
      questionIds: questions.map((q) => q.id),
      answers,
    })
    clearMockSession(moduleId, paperKey)
    setDone(true)
  }

  useEffect(() => {
    if (done || !ready || questions.length === 0) return
    if (remaining <= 0) {
      finish()
      return
    }
    if (remaining % 15 === 0) persist()
    const t = setTimeout(() => setRemaining((s) => s - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, done, ready, questions.length])

  if (!mod || mod.mocks.length === 0) return <Navigate to={`/m/${moduleId}`} replace />
  if (!ready) return null
  if (questions.length === 0) return <Navigate to={`/m/${moduleId}/mock`} replace />

  const q = questions[idx]
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const lowTime = remaining <= 300

  function answer(letter: Letter) {
    setAnswers((a) => ({ ...a, [q.id]: letter }))
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
          <p className="mt-2 text-xs text-slate-600">Saved to past attempts. Review it anytime from the mock menu.</p>
        </div>
        <div className="flex gap-3 px-4 pb-6">
          <button onClick={() => navigate(`/m/${moduleId}/mock`)} className="btn-ghost flex-1">
            Exit
          </button>
          <button onClick={() => setReviewing(true)} className="btn-accent flex-1">
            Review answers
          </button>
        </div>
      </div>
    )
  }

  // ---- Review screen ----
  if (done && reviewing) {
    return <MockReview questions={questions} answers={answers} onBack={() => setReviewing(false)} backLabel="Summary" />
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

      {resumed && idx === 0 && Object.keys(answers).length > 0 && (
        <p className="px-4 pt-2 text-xs text-amber-400/80">
          Resumed where you left off: {Object.keys(answers).length} answered, {mm}:{ss} on the clock.
        </p>
      )}

      <div className="px-4 pt-5">
        <p className="whitespace-pre-line text-[17px] font-semibold leading-snug">{q.stem}</p>
      </div>

      <div className="grid gap-2.5 px-4 pt-5">
        {LETTERS.map((L) => {
          const selected = answers[q.id] === L
          const cls = selected ? 'bg-accent/20 ring-accent/60' : 'bg-panel ring-white/10'
          return (
            <motion.button
              key={L}
              whileTap={{ scale: 0.98 }}
              onClick={() => answer(L)}
              className={`rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium leading-snug ring-1 ${cls}`}
            >
              <span className={`mr-2 font-bold ${selected ? 'text-accent' : 'text-slate-400'}`}>{L}</span>
              {q.options[L]}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-auto px-4 pb-6 pt-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setIdx((n) => Math.max(0, n - 1))}
            disabled={idx === 0}
            className="btn-ghost flex-1 disabled:opacity-30"
          >
            Prev
          </button>
          {idx + 1 >= questions.length ? (
            <button onClick={finish} className="btn-accent flex-1">
              Finish
            </button>
          ) : (
            <button onClick={() => setIdx((n) => Math.min(questions.length - 1, n + 1))} className="btn-accent flex-1">
              Next
            </button>
          )}
        </div>
        <p className="pt-3 text-center text-[10px] text-slate-600">
          Progress saves automatically. Back out anytime and resume later.
        </p>
      </div>
    </div>
  )
}
