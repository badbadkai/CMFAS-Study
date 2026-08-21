import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getModule } from '../data/modules'

export default function ModeSelect() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  if (!mod) return <Navigate to="/" replace />

  const noChapters = mod.chapters.length === 0
  const noMocks = mod.mocks.length === 0
  const modes = [
    { key: 'study', label: 'Study', desc: 'Swipe through the material like flashcards.', disabled: noChapters, soon: 'Flashcards coming soon for this module.' },
    { key: 'quiz', label: 'Quiz Me', desc: '15 random exam questions with instant feedback.', disabled: noMocks, soon: 'Questions coming soon for this module.' },
    { key: 'mock', label: 'Mock Exam', desc: 'Full timed paper, then review what you got wrong.', disabled: noMocks, soon: 'Mock papers coming soon for this module.' },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <Header title={mod.name} subtitle={mod.subtitle} />
      <div className="grid gap-3 px-4 pt-4">
        {modes.map((m) => (
          <button
            key={m.key}
            disabled={m.disabled}
            onClick={() => navigate(`/m/${moduleId}/${m.key}`)}
            className={`tile ${m.disabled ? 'opacity-40' : ''}`}
          >
            <span className="text-lg font-bold">{m.label}</span>
            <span className="mt-0.5 block text-sm text-slate-400">{m.disabled ? m.soon : m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
