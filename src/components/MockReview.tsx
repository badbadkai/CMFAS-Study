import { useState } from 'react'
import Header from './Header'
import type { Letter, MockQuestion } from '../types'

const LETTERS: Letter[] = ['A', 'B', 'C', 'D']

/** Question-by-question answer review, shared by the post-exam screen and past attempts. */
export default function MockReview({
  questions,
  answers,
  onBack,
  backLabel,
}: {
  questions: MockQuestion[]
  answers: Record<string, Letter>
  onBack: () => void
  backLabel: string
}) {
  const [reviewIdx, setReviewIdx] = useState(0)
  const rq = questions[reviewIdx]
  const chosen = answers[rq.id]
  const wrongCount = questions.filter((x) => answers[x.id] !== x.answer).length

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
        {rq.explanation && (
          <div className="rounded-2xl bg-panel/80 px-4 py-3 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Why</p>
            <p className="mt-1 whitespace-pre-line text-[14px] leading-snug text-slate-300">{rq.explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 px-4 pb-6 pt-4">
        <button
          onClick={() => setReviewIdx((n) => Math.max(0, n - 1))}
          disabled={reviewIdx === 0}
          className="btn-ghost flex-1 disabled:opacity-30"
        >
          Prev
        </button>
        <button onClick={onBack} className="btn-ghost px-4 text-xs">
          {backLabel}
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
