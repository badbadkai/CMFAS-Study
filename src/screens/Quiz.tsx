import { useMemo, useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import QuizRunner from '../components/QuizRunner'
import { getModule } from '../data/modules'
import { sample } from '../lib/shuffle'
import { saveQuizResult } from '../lib/storage'
import type { PlayableQuestion } from '../types'

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

  if (!mod) return <Navigate to="/" replace />
  if (questions.length === 0) return <Navigate to={`/m/${moduleId}`} replace />

  return (
    <QuizRunner
      key={seed}
      questions={questions}
      subtitle={`${mod.name} \u2014 Quiz Me`}
      onComplete={(score, total) =>
        saveQuizResult({ moduleId, chapterId: 'quiz', score, total, ts: Date.now() })
      }
      onExit={() => navigate(`/m/${moduleId}`)}
      onRestart={() => setSeed((s) => s + 1)}
    />
  )
}
