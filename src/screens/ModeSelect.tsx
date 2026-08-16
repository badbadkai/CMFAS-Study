import { useNavigate, useParams, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { getModule } from '../data/modules'

export default function ModeSelect() {
  const { moduleId = '' } = useParams()
  const navigate = useNavigate()
  const mod = getModule(moduleId)
  if (!mod) return <Navigate to="/" replace />

  const modes = [
    { key: 'study', label: 'Study', desc: 'Swipe through the material like flashcards.' },
    { key: 'quiz', label: 'Quiz Me', desc: '10 randomised questions per chapter, fresh each time.' },
    { key: 'mock', label: 'Mock Exam', desc: 'Full timed paper, then review what you got wrong.' },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <Header title={mod.name} subtitle={mod.subtitle} />
      <div className="grid gap-3 px-4 pt-4">
        {modes.map((m) => {
          const disabled = m.key === 'mock' && mod.mocks.length === 0
          return (
            <button
              key={m.key}
              disabled={disabled}
              onClick={() => navigate(`/m/${moduleId}/${m.key}`)}
              className={`tile ${disabled ? 'opacity-40' : ''}`}
            >
              <span className="text-lg font-bold">{m.label}</span>
              <span className="mt-0.5 block text-sm text-slate-400">
                {disabled ? 'Mock papers coming soon for this module.' : m.desc}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
