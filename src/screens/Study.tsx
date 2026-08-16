import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '../components/Header'
import { getModule } from '../data/modules'

export default function Study() {
  const { moduleId = '', chapterId = '' } = useParams()
  const mod = getModule(moduleId)
  const chapter = mod?.chapters.find((c) => c.id === chapterId)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [dir, setDir] = useState(1)

  if (!mod || !chapter) return <Navigate to="/" replace />
  const cards = chapter.concepts
  if (cards.length === 0) return <Navigate to={`/m/${moduleId}/study`} replace />
  const card = cards[i]

  function go(next: number) {
    const target = i + next
    if (target < 0 || target >= cards.length) return
    setDir(next)
    setFlipped(false)
    setI(target)
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header title={`Chapter ${chapter.num}`} subtitle={chapter.title} />

      <div className="px-4 pt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-all" style={{ width: `${((i + 1) / cards.length) * 100}%` }} />
        </div>
        <p className="mt-1 text-center text-xs text-slate-500">
          {i + 1} / {cards.length}
        </p>
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
            className="flex min-h-[22rem] w-full cursor-pointer flex-col justify-center rounded-3xl bg-panel p-7 text-left ring-1 ring-white/10"
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
                <span className="mt-3 text-[17px] leading-relaxed text-slate-100">{card.fact}</span>
                {card.trap && (
                  <span className="mt-4 rounded-xl bg-amber-400/10 px-3 py-2 text-sm text-amber-300 ring-1 ring-amber-400/20">
                    Watch out: {card.trap}
                  </span>
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
        <button onClick={() => go(1)} disabled={i === cards.length - 1} className="btn-accent flex-1 disabled:opacity-30">
          Next
        </button>
      </div>
    </div>
  )
}
