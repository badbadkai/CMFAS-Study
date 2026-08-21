import { useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import QuizRunner from '../components/QuizRunner'
import { getModule } from '../data/modules'
import { sample, shuffle } from '../lib/shuffle'
import { saveQuizResult } from '../lib/storage'
import type { PlayableQuestion } from '../types'

const POP_LEN = 10

type FactBlock = { kind: 'p'; text: string } | { kind: 'list'; lead: string; items: string[] }

const MARKER = /\((?:[a-z]|\d{1,2}|i{1,3}|iv|v)\)/gi

function endSentence(s: string) {
  const t = s.replace(/\s+$/, '')
  return /[.!?)]$/.test(t) ? t : `${t}.`
}

// Break a dense fact string into readable blocks: one sentence per line,
// with (a)/(1) enumerations and "lead: item; item; item" turned into bullets.
function formatFact(fact: string): FactBlock[] {
  const sentences = fact
    .split(/(?<![A-Z])(?<!\be\.g)(?<!\bi\.e)(?<!\betc)(?<!\bvs)(?<!\bNo)\.\s+(?=[A-Z(])/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(endSentence)

  return sentences.map((s): FactBlock => {
    const markers = s.match(MARKER)
    if (markers && markers.length >= 2) {
      const start = s.indexOf(markers[0])
      const lead = s
        .slice(0, start)
        .replace(/[:;,\s]+$/, '')
        .replace(/\s+(?:or|and)$/i, '')
      const items = s
        .slice(start)
        .split(/;\s*(?:or\s+|and\s+)?(?=\()/i)
        .map((x) => x.replace(MARKER, '').trim().replace(/^[:,\s]+/, '').replace(/[.;]\s*$/, ''))
        .filter(Boolean)
      return { kind: 'list', lead: lead ? `${lead}:` : '', items }
    }
    const colon = s.indexOf(': ')
    if (colon > -1) {
      const body = s.slice(colon + 2)
      if ((body.match(/;/g) || []).length >= 2) {
        const items = body
          .split(/;\s*(?:or\s+|and\s+)?/i)
          .map((x) => x.trim().replace(/[.;]\s*$/, ''))
          .filter(Boolean)
        return { kind: 'list', lead: `${s.slice(0, colon).trim()}:`, items }
      }
    }
    return { kind: 'p', text: s }
  })
}

export default function Study() {
  const { moduleId = '', chapterId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  const chapter = mod?.chapters.find((c) => c.id === chapterId)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [dir, setDir] = useState(1)
  const [shuffled, setShuffled] = useState(false)
  const [seed, setSeed] = useState(0)
  const [phase, setPhase] = useState<'study' | 'quiz'>('study')
  const [popSeed, setPopSeed] = useState(0)

  const cards = useMemo(() => {
    const base = chapter?.concepts ?? []
    return shuffled ? shuffle(base) : base
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id, shuffled, seed])

  // Pop-quiz pool: authored questions tagged to this chapter's concepts,
  // sampled to span as many distinct concepts as possible.
  const chapterQuiz = useMemo<PlayableQuestion[]>(() => {
    const ids = new Set((chapter?.concepts ?? []).map((c) => c.id))
    const pool = (mod?.quiz ?? []).filter((q) => q.conceptId && ids.has(q.conceptId))
    if (pool.length === 0) return []
    const byConcept = new Map<string, PlayableQuestion[]>()
    for (const q of shuffle(pool)) {
      const arr = byConcept.get(q.conceptId!) ?? []
      arr.push(q)
      byConcept.set(q.conceptId!, arr)
    }
    const primary = [...byConcept.values()].map((a) => a[0])
    const extras = [...byConcept.values()].flatMap((a) => a.slice(1))
    return primary.length >= POP_LEN
      ? sample(primary, POP_LEN)
      : shuffle([...primary, ...sample(extras, POP_LEN - primary.length)])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter?.id, popSeed])

  if (!mod || !chapter) return <Navigate to="/" replace />
  if (cards.length === 0) return <Navigate to={`/m/${moduleId}/study`} replace />

  if (phase === 'quiz') {
    return (
      <QuizRunner
        key={popSeed}
        questions={chapterQuiz}
        subtitle={`Ch ${chapter.num} \u2014 Pop Quiz`}
        onComplete={(score, total) =>
          saveQuizResult({ moduleId, chapterId: chapter.id, score, total, ts: Date.now() })
        }
        onExit={() => navigate(`/m/${moduleId}/study`)}
        exitLabel="Chapters"
        onRestart={() => setPopSeed((s) => s + 1)}
        restartLabel="Retry"
      />
    )
  }

  const card = cards[i]
  const atEnd = i === cards.length - 1

  function go(next: number) {
    const target = i + next
    if (target < 0 || target >= cards.length) return
    setDir(next)
    setFlipped(false)
    setI(target)
  }

  function toggleShuffle() {
    setShuffled((s) => !s)
    setSeed((n) => n + 1)
    setI(0)
    setFlipped(false)
    setDir(1)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title={`Chapter ${chapter.num}`} subtitle={chapter.title} />

      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-all" style={{ width: `${((i + 1) / cards.length) * 100}%` }} />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {i + 1} / {cards.length}
          </span>
          <button
            onClick={toggleShuffle}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-colors ${
              shuffled ? 'bg-accent/20 text-accent ring-accent/40' : 'text-slate-400 ring-white/10'
            }`}
          >
            {shuffled ? 'Shuffled' : 'Shuffle'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center px-4 py-2">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.button
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.18 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1)
              else if (info.offset.x > 80) go(-1)
            }}
            onClick={() => setFlipped((f) => !f)}
            className={`flex min-h-[22rem] max-h-[74vh] w-full cursor-pointer flex-col overflow-y-auto rounded-3xl bg-panel p-7 text-left ring-1 ring-white/10 ${
              flipped ? 'justify-start' : 'justify-center'
            }`}
          >
            {!flipped ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">Concept</span>
                <span className="mt-3 text-2xl font-bold leading-snug">{card.term}</span>
                <span className="mt-auto pt-6 text-xs text-slate-500">Tap to reveal</span>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{card.term}</span>
                <div className="mt-3 space-y-3 text-[16px] leading-relaxed text-slate-100">
                  {formatFact(card.fact).map((b, k) =>
                    b.kind === 'p' ? (
                      <p key={k}>{b.text}</p>
                    ) : (
                      <div key={k}>
                        {b.lead && <p className="mb-1.5">{b.lead}</p>}
                        <ul className="list-disc space-y-1 pl-5 marker:text-accent">
                          {b.items.map((it, j) => (
                            <li key={j}>{it}</li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
                {card.trap && (
                  <p className="mt-4 rounded-xl bg-amber-400/10 px-3 py-2 text-sm text-amber-300 ring-1 ring-amber-400/20">
                    Watch out: {card.trap}
                  </p>
                )}
              </>
            )}
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3 px-4 pb-6">
        <button onClick={() => go(-1)} disabled={i === 0} className="btn-ghost flex-1 disabled:opacity-30">
          Prev
        </button>
        {atEnd && chapterQuiz.length > 0 ? (
          <button onClick={() => setPhase('quiz')} className="btn-accent flex-1">
            Pop quiz
          </button>
        ) : (
          <button onClick={() => go(1)} disabled={atEnd} className="btn-accent flex-1 disabled:opacity-30">
            Next
          </button>
        )}
      </div>
    </div>
  )
}
